import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { reviews, agents } from "@/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { z } from "zod";

const createReviewSchema = z.object({
  agentId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(2000).optional(),
});

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { agentId, rating, comment } = parsed.data;

    // Check if agent exists
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, agentId),
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this agent
    const existingReview = await db.query.reviews.findFirst({
      where: and(
        eq(reviews.agentId, agentId),
        eq(reviews.buyerId, userId)
      ),
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this agent" },
        { status: 409 }
      );
    }

    // Create the review
    const [newReview] = await db
      .insert(reviews)
      .values({
        agentId,
        buyerId: userId,
        rating,
        comment: comment || null,
      })
      .returning();

    // Update agent's average rating
    const avgResult = await db
      .select({
        avgRating: sql<number>`ROUND(AVG(${reviews.rating})::numeric, 2)`,
      })
      .from(reviews)
      .where(eq(reviews.agentId, agentId));

    const newAvgRating = avgResult[0]?.avgRating || rating;

    await db
      .update(agents)
      .set({ rating: newAvgRating.toString(), updatedAt: new Date() })
      .where(eq(agents.id, agentId));

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
