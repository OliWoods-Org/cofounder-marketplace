import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { featuredAgents, agents } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

// Admin check - in production, use proper role-based access control
async function isAdmin(userId: string): Promise<boolean> {
  // For now, allow any authenticated user - in production, check against admin list
  // const adminIds = process.env.ADMIN_USER_IDS?.split(',') || [];
  // return adminIds.includes(userId);
  return !!userId;
}

const createFeaturedSchema = z.object({
  agentId: z.string().uuid(),
  placementType: z.enum(['hero', 'trending', 'staff_pick', 'new']),
  priority: z.number().int().min(0).max(100).default(0),
  featuredUntil: z.string().datetime().optional(),
});

const updateFeaturedSchema = z.object({
  placementType: z.enum(['hero', 'trending', 'staff_pick', 'new']).optional(),
  priority: z.number().int().min(0).max(100).optional(),
  featuredUntil: z.string().datetime().nullable().optional(),
});

// GET /api/admin/featured - List all featured placements (admin)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all featured placements with agent details
    const allFeatured = await db
      .select({
        id: featuredAgents.id,
        agentId: featuredAgents.agentId,
        placementType: featuredAgents.placementType,
        featuredAt: featuredAgents.featuredAt,
        featuredUntil: featuredAgents.featuredUntil,
        priority: featuredAgents.priority,
        createdBy: featuredAgents.createdBy,
        agent: {
          id: agents.id,
          name: agents.name,
          description: agents.description,
          role: agents.role,
          price: agents.price,
        },
      })
      .from(featuredAgents)
      .innerJoin(agents, eq(featuredAgents.agentId, agents.id))
      .orderBy(desc(featuredAgents.priority), desc(featuredAgents.featuredAt));

    return NextResponse.json({
      featured: allFeatured,
      placementTypes: [
        { value: 'hero', label: 'Hero Banner', description: 'Main featured spot on homepage' },
        { value: 'trending', label: 'Trending', description: 'Trending section' },
        { value: 'staff_pick', label: 'Staff Pick', description: 'Curated by staff' },
        { value: 'new', label: 'New', description: 'Newly featured' },
      ],
    });
  } catch (error) {
    console.error("Error fetching admin featured:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/featured - Add featured placement
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createFeaturedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { agentId, placementType, priority, featuredUntil } = parsed.data;

    // Check if agent exists and is published
    const agent = await db.query.agents.findFirst({
      where: and(eq(agents.id, agentId), eq(agents.published, true)),
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found or not published" },
        { status: 404 }
      );
    }

    // Check if agent is already featured with this placement type
    const existing = await db.query.featuredAgents.findFirst({
      where: and(
        eq(featuredAgents.agentId, agentId),
        eq(featuredAgents.placementType, placementType)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Agent is already featured with this placement type" },
        { status: 409 }
      );
    }

    // Create featured placement
    const [newFeatured] = await db
      .insert(featuredAgents)
      .values({
        agentId,
        placementType,
        priority,
        featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
        createdBy: userId,
      })
      .returning();

    return NextResponse.json(newFeatured, { status: 201 });
  } catch (error) {
    console.error("Error creating featured placement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/featured?id=xxx - Remove featured placement
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const deleted = await db
      .delete(featuredAgents)
      .where(eq(featuredAgents.id, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Featured placement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    console.error("Error deleting featured placement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/featured?id=xxx - Update featured placement
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateFeaturedSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.placementType !== undefined) {
      updates.placementType = parsed.data.placementType;
    }
    if (parsed.data.priority !== undefined) {
      updates.priority = parsed.data.priority;
    }
    if (parsed.data.featuredUntil !== undefined) {
      updates.featuredUntil = parsed.data.featuredUntil
        ? new Date(parsed.data.featuredUntil)
        : null;
    }

    const [updated] = await db
      .update(featuredAgents)
      .set(updates)
      .where(eq(featuredAgents.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Featured placement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating featured placement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
