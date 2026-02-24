import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Builders table - represents marketplace sellers/creators
export const builders = pgTable(
  "builders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
    stripeAccountId: varchar("stripe_account_id", { length: 255 }),
    revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0").notNull(),
    payoutsPending: decimal("payouts_pending", { precision: 12, scale: 2 }).default("0").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("builders_clerk_user_id_idx").on(table.clerkUserId),
    index("builders_stripe_account_id_idx").on(table.stripeAccountId),
  ]
);

// Agents table - AI agents available for purchase
export const agents = pgTable(
  "agents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    role: varchar("role", { length: 100 }),
    config: jsonb("config").$type<Record<string, unknown>>(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    builderId: uuid("builder_id")
      .notNull()
      .references(() => builders.id, { onDelete: "cascade" }),
    published: boolean("published").default(false).notNull(),
    rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
    downloads: integer("downloads").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("agents_builder_id_idx").on(table.builderId),
    index("agents_published_idx").on(table.published),
    index("agents_rating_idx").on(table.rating),
    index("agents_downloads_idx").on(table.downloads),
    index("agents_created_at_idx").on(table.createdAt),
  ]
);

// Teams table - collections of agents sold together
export const teams = pgTable(
  "teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    agents: uuid("agents").array(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    builderId: uuid("builder_id")
      .notNull()
      .references(() => builders.id, { onDelete: "cascade" }),
    published: boolean("published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("teams_builder_id_idx").on(table.builderId),
    index("teams_published_idx").on(table.published),
  ]
);

// Purchases table - records of agent/team purchases
export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    buyerId: varchar("buyer_id", { length: 255 }).notNull(),
    agentId: uuid("agent_id").references(() => agents.id, { onDelete: "set null" }),
    teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    stripePaymentId: varchar("stripe_payment_id", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("purchases_buyer_id_idx").on(table.buyerId),
    index("purchases_agent_id_idx").on(table.agentId),
    index("purchases_team_id_idx").on(table.teamId),
    index("purchases_stripe_payment_id_idx").on(table.stripePaymentId),
    index("purchases_created_at_idx").on(table.createdAt),
  ]
);

// Usage table - tracks agent usage metrics
export const usage = pgTable(
  "usage",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => purchases.id, { onDelete: "cascade" }),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    tokensUsed: integer("tokens_used").default(0).notNull(),
    tasksCompleted: integer("tasks_completed").default(0).notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
  },
  (table) => [
    index("usage_purchase_id_idx").on(table.purchaseId),
    index("usage_agent_id_idx").on(table.agentId),
    index("usage_timestamp_idx").on(table.timestamp),
  ]
);

// Reviews table - user reviews for agents
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    buyerId: varchar("buyer_id", { length: 255 }).notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("reviews_agent_id_idx").on(table.agentId),
    index("reviews_buyer_id_idx").on(table.buyerId),
    index("reviews_rating_idx").on(table.rating),
    index("reviews_created_at_idx").on(table.createdAt),
  ]
);

// Relations
export const buildersRelations = relations(builders, ({ many }) => ({
  agents: many(agents),
  teams: many(teams),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  builder: one(builders, {
    fields: [agents.builderId],
    references: [builders.id],
  }),
  purchases: many(purchases),
  usage: many(usage),
  reviews: many(reviews),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  builder: one(builders, {
    fields: [teams.builderId],
    references: [builders.id],
  }),
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one, many }) => ({
  agent: one(agents, {
    fields: [purchases.agentId],
    references: [agents.id],
  }),
  team: one(teams, {
    fields: [purchases.teamId],
    references: [teams.id],
  }),
  usage: many(usage),
}));

export const usageRelations = relations(usage, ({ one }) => ({
  purchase: one(purchases, {
    fields: [usage.purchaseId],
    references: [purchases.id],
  }),
  agent: one(agents, {
    fields: [usage.agentId],
    references: [agents.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  agent: one(agents, {
    fields: [reviews.agentId],
    references: [agents.id],
  }),
}));

// Builder stats table - aggregated metrics for leaderboard
export const builderStats = pgTable(
  "builder_stats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    builderId: uuid("builder_id")
      .notNull()
      .references(() => builders.id, { onDelete: "cascade" })
      .unique(),
    totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0").notNull(),
    totalDownloads: integer("total_downloads").default(0).notNull(),
    totalAgents: integer("total_agents").default(0).notNull(),
    avgRating: decimal("avg_rating", { precision: 3, scale: 2 }).default("0"),
    totalReviews: integer("total_reviews").default(0).notNull(),
    rank: integer("rank"),
    badges: jsonb("badges").$type<string[]>().default([]).notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("builder_stats_builder_id_idx").on(table.builderId),
    index("builder_stats_rank_idx").on(table.rank),
    index("builder_stats_total_revenue_idx").on(table.totalRevenue),
    index("builder_stats_total_downloads_idx").on(table.totalDownloads),
  ]
);

// Featured agents table - for dynamic featured placement
export const featuredAgents = pgTable(
  "featured_agents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "cascade" }),
    placementType: varchar("placement_type", { length: 50 }).notNull(), // 'hero', 'trending', 'staff_pick', 'new'
    featuredAt: timestamp("featured_at").defaultNow().notNull(),
    featuredUntil: timestamp("featured_until"),
    priority: integer("priority").default(0).notNull(),
    createdBy: varchar("created_by", { length: 255 }), // admin user id
  },
  (table) => [
    index("featured_agents_agent_id_idx").on(table.agentId),
    index("featured_agents_placement_type_idx").on(table.placementType),
    index("featured_agents_priority_idx").on(table.priority),
  ]
);

export const builderStatsRelations = relations(builderStats, ({ one }) => ({
  builder: one(builders, {
    fields: [builderStats.builderId],
    references: [builders.id],
  }),
}));

export const featuredAgentsRelations = relations(featuredAgents, ({ one }) => ({
  agent: one(agents, {
    fields: [featuredAgents.agentId],
    references: [agents.id],
  }),
}));

// Type exports for use in application code
export type Builder = typeof builders.$inferSelect;
export type NewBuilder = typeof builders.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type NewPurchase = typeof purchases.$inferInsert;

export type Usage = typeof usage.$inferSelect;
export type NewUsage = typeof usage.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type BuilderStats = typeof builderStats.$inferSelect;
export type NewBuilderStats = typeof builderStats.$inferInsert;

export type FeaturedAgent = typeof featuredAgents.$inferSelect;
export type NewFeaturedAgent = typeof featuredAgents.$inferInsert;
