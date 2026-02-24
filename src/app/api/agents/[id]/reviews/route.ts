import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/agents/[id]/reviews - Get reviews for an agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;

    // Get reviews with pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);
    const offset = (page - 1) * limit;

    // Fetch reviews
    const agentReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.agentId, agentId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count and rating breakdown
    const statsResult = await db
      .select({
        totalCount: sql<number>`COUNT(*)::int`,
        avgRating: sql<number>`ROUND(AVG(${reviews.rating})::numeric, 2)`,
        rating5: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 5)::int`,
        rating4: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 4)::int`,
        rating3: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 3)::int`,
        rating2: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 2)::int`,
        rating1: sql<number>`COUNT(*) FILTER (WHERE ${reviews.rating} = 1)::int`,
      })
      .from(reviews)
      .where(eq(reviews.agentId, agentId));

    const stats = statsResult[0] || {
      totalCount: 0,
      avgRating: 0,
      rating5: 0,
      rating4: 0,
      rating3: 0,
      rating2: 0,
      rating1: 0,
    };

    return NextResponse.json({
      reviews: agentReviews,
      stats: {
        totalCount: stats.totalCount,
        avgRating: stats.avgRating || 0,
        breakdown: {
          5: stats.rating5,
          4: stats.rating4,
          3: stats.rating3,
          2: stats.rating2,
          1: stats.rating1,
        },
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(stats.totalCount / limit),
        hasMore: offset + agentReviews.length < stats.totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
