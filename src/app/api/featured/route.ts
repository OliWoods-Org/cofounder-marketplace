import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { featuredAgents, agents } from "@/db/schema";
import { eq, and, gte, lte, or, isNull, desc } from "drizzle-orm";

// GET /api/featured - Get currently featured agents
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const placementType = searchParams.get("type"); // 'hero', 'trending', 'staff_pick', 'new'
    const now = new Date();

    // Build query conditions
    const conditions = [
      or(
        isNull(featuredAgents.featuredUntil),
        gte(featuredAgents.featuredUntil, now)
      ),
      lte(featuredAgents.featuredAt, now),
    ];

    if (placementType) {
      conditions.push(eq(featuredAgents.placementType, placementType));
    }

    // Get featured agents with agent details
    const featured = await db
      .select({
        id: featuredAgents.id,
        agentId: featuredAgents.agentId,
        placementType: featuredAgents.placementType,
        featuredAt: featuredAgents.featuredAt,
        featuredUntil: featuredAgents.featuredUntil,
        priority: featuredAgents.priority,
        agent: {
          id: agents.id,
          name: agents.name,
          description: agents.description,
          role: agents.role,
          price: agents.price,
          rating: agents.rating,
          downloads: agents.downloads,
          builderId: agents.builderId,
        },
      })
      .from(featuredAgents)
      .innerJoin(agents, eq(featuredAgents.agentId, agents.id))
      .where(and(...conditions))
      .orderBy(desc(featuredAgents.priority), desc(featuredAgents.featuredAt));

    // Group by placement type
    const groupedByType = featured.reduce((acc, item) => {
      const type = item.placementType;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {} as Record<string, typeof featured>);

    return NextResponse.json({
      featured,
      byType: groupedByType,
      types: ['hero', 'trending', 'staff_pick', 'new'],
    });
  } catch (error) {
    console.error("Error fetching featured agents:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
