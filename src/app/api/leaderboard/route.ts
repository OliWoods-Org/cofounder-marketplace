import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { builderStats, builders, agents } from "@/db/schema";
import { eq, desc, sql, asc } from "drizzle-orm";

// Badge definitions
const BADGES = {
  top_seller: { id: "top_seller", name: "Top Seller", icon: "trophy", description: "Top 10 by revenue" },
  trending: { id: "trending", name: "Trending", icon: "fire", description: "High download growth" },
  verified: { id: "verified", name: "Verified", icon: "check-badge", description: "Verified builder" },
  rising_star: { id: "rising_star", name: "Rising Star", icon: "star", description: "New builder with high ratings" },
  prolific: { id: "prolific", name: "Prolific", icon: "stack", description: "10+ published agents" },
};

export type Badge = keyof typeof BADGES;

interface LeaderboardEntry {
  rank: number;
  builderId: string;
  clerkUserId: string;
  totalRevenue: string;
  totalDownloads: number;
  totalAgents: number;
  avgRating: string | null;
  totalReviews: number;
  badges: string[];
}

// GET /api/leaderboard - Get builder leaderboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = searchParams.get("sortBy") || "revenue"; // revenue, downloads, rating
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const offset = (page - 1) * limit;

    // Get or calculate builder stats
    // First, let's calculate stats from the raw data
    const statsQuery = db
      .select({
        builderId: builders.id,
        clerkUserId: builders.clerkUserId,
        totalRevenue: builders.revenue,
        totalAgents: sql<number>`COUNT(DISTINCT ${agents.id})::int`,
        totalDownloads: sql<number>`COALESCE(SUM(${agents.downloads}), 0)::int`,
        avgRating: sql<string>`ROUND(AVG(${agents.rating}::numeric), 2)::text`,
      })
      .from(builders)
      .leftJoin(agents, eq(agents.builderId, builders.id))
      .groupBy(builders.id, builders.clerkUserId, builders.revenue);

    // Execute query
    const results = await statsQuery;

    // Calculate badges and sort
    const leaderboard: LeaderboardEntry[] = results.map((row, _idx) => {
      const badges: string[] = [];

      // Calculate badges
      const revenue = parseFloat(row.totalRevenue || "0");
      const downloads = row.totalDownloads || 0;
      const agentCount = row.totalAgents || 0;
      const rating = parseFloat(row.avgRating || "0");

      if (revenue > 10000) badges.push("top_seller");
      if (downloads > 1000) badges.push("trending");
      if (agentCount >= 10) badges.push("prolific");
      if (agentCount < 5 && rating >= 4.5) badges.push("rising_star");

      return {
        rank: 0, // Will be set after sorting
        builderId: row.builderId,
        clerkUserId: row.clerkUserId,
        totalRevenue: row.totalRevenue || "0",
        totalDownloads: downloads,
        totalAgents: agentCount,
        avgRating: row.avgRating,
        totalReviews: 0, // Would need to join with reviews
        badges,
      };
    });

    // Sort based on criteria
    leaderboard.sort((a, b) => {
      switch (sortBy) {
        case "downloads":
          return b.totalDownloads - a.totalDownloads;
        case "rating":
          return (parseFloat(b.avgRating || "0")) - (parseFloat(a.avgRating || "0"));
        case "agents":
          return b.totalAgents - a.totalAgents;
        case "revenue":
        default:
          return parseFloat(b.totalRevenue) - parseFloat(a.totalRevenue);
      }
    });

    // Assign ranks
    leaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    // Paginate
    const paginatedLeaderboard = leaderboard.slice(offset, offset + limit);

    return NextResponse.json({
      leaderboard: paginatedLeaderboard,
      badges: BADGES,
      pagination: {
        page,
        limit,
        total: leaderboard.length,
        totalPages: Math.ceil(leaderboard.length / limit),
      },
      sortBy,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
