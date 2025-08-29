import { pgTable, varchar, text, timestamp, boolean, json, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Feature Flags Schema
export const flagStatusEnum = pgEnum("flag_status", ["active", "archived"]);

export const featureFlags = pgTable("feature_flags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").unique().notNull(), // e.g. 'new-billing-ui'
  name: text("name").notNull(),
  description: text("description"),
  status: flagStatusEnum("status").default("active").notNull(),
  forceOn: boolean("force_on"),  // hard override
  forceOff: boolean("force_off"),
  targeting: json("targeting").notNull().default(sql`'{}'::jsonb`), // rules
  createdBy: varchar("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Impersonation Sessions Schema  
export const impersonationSessions = pgTable("impersonation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull(),
  targetId: varchar("target_id").notNull(), 
  reason: text("reason"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  endedAt: timestamp("ended_at"),
  endedReason: text("ended_reason"),
});

// Insert schemas
export const insertFeatureFlagSchema = createInsertSchema(featureFlags).pick({
  key: true,
  name: true,
  description: true,
  status: true,
  forceOn: true,
  forceOff: true,
  targeting: true,
  createdBy: true,
});

export const insertImpersonationSessionSchema = createInsertSchema(impersonationSessions).pick({
  adminId: true,
  targetId: true,
  reason: true,
  expiresAt: true,
});

// Types
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof insertFeatureFlagSchema._type;
export type ImpersonationSession = typeof impersonationSessions.$inferSelect;
export type InsertImpersonationSession = typeof insertImpersonationSessionSchema._type;