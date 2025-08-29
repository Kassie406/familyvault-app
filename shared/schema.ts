import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json, pgEnum, decimal, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Role hierarchy: FAMILY_ACCESSOR < MEMBER < AGENT < ADMIN < PRESIDENT
export const roleEnum = pgEnum("role", ["FAMILY_ACCESSOR", "MEMBER", "AGENT", "ADMIN", "PRESIDENT"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  name: text("name"),
  role: roleEnum("role").default("MEMBER").notNull(),
  orgId: varchar("org_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerId: varchar("owner_id").notNull(),
  planId: varchar("plan_id"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  name: text("name").notNull(),
  amountCents: integer("amount_cents").notNull(),
  interval: text("interval").notNull(), // "month" | "year"
  features: json("features"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Enhanced Coupons v2 Schema
export const couponCampaigns = pgTable("coupon_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  campaignId: varchar("campaign_id").references(() => couponCampaigns.id),
  type: text("type").notNull(), // 'percentage', 'fixed_amount', 'free_trial_days'
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency"),
  maxRedemptions: integer("max_redemptions"),
  perUserLimit: integer("per_user_limit").default(1),
  allowStacking: boolean("allow_stacking").default(false),
  minSubtotalCents: integer("min_subtotal_cents"),
  allowedPlanIds: text("allowed_plan_ids").array(),
  deniedPlanIds: text("denied_plan_ids").array(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  isRecurring: boolean("is_recurring").default(false),
  metadata: json("metadata"),
  timesRedeemed: integer("times_redeemed").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const couponRedemptions = pgTable("coupon_redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponId: varchar("coupon_id").notNull().references(() => coupons.id),
  userId: varchar("user_id").notNull(),
  orgId: varchar("org_id"),
  planId: text("plan_id"),
  orderId: text("order_id"),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
  amountCents: integer("amount_cents"),
}, (table) => ({
  uniqueRedemption: unique().on(table.couponId, table.userId, table.orderId),
}));

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  bodyMd: text("body_md").notNull(),
  published: boolean("published").default(false).notNull(),
  authorId: varchar("author_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consentEvents = pgTable("consent_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  orgId: varchar("org_id"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  consent: json("consent").notNull(), // {analytics: boolean, marketing: boolean}
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id"),
  actorEmail: text("actor_email"),
  actorRole: text("actor_role"),
  action: text("action").notNull(),
  resource: text("resource"),
  resourceId: varchar("resource_id"),
  beforeState: json("before_state"), // Snapshot before change
  afterState: json("after_state"),   // Snapshot after change
  reason: text("reason"), // Optional "why" for risky edits
  tamperHash: text("tamper_hash").notNull(), // Hash chaining for immutability
  prevTamperHash: text("prev_tamper_hash"), // Previous row's hash
  meta: json("meta"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const securitySettings = pgTable("security_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  updatedBy: varchar("updated_by"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
  orgId: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).pick({
  name: true,
  ownerId: true,
  planId: true,
  stripeCustomerId: true,
});

export const insertPlanSchema = createInsertSchema(plans).pick({
  stripePriceId: true,
  name: true,
  amountCents: true,
  interval: true,
  features: true,
  active: true,
});

export const insertCouponSchema = createInsertSchema(coupons).pick({
  code: true,
  percentOff: true,
  amountOff: true,
  validFrom: true,
  validTo: true,
  maxRedemptions: true,
  active: true,
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  slug: true,
  title: true,
  bodyMd: true,
  published: true,
  authorId: true,
});

export const insertConsentEventSchema = createInsertSchema(consentEvents).pick({
  userId: true,
  orgId: true,
  ip: true,
  userAgent: true,
  consent: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).pick({
  actorId: true,
  action: true,
  resource: true,
  resourceId: true,
  beforeState: true,
  afterState: true,
  meta: true,
  ip: true,
  userAgent: true,
});

export const insertAdminSessionSchema = createInsertSchema(adminSessions).pick({
  userId: true,
  sessionToken: true,
  ipAddress: true,
  userAgent: true,
  isActive: true,
});

export const insertSecuritySettingSchema = createInsertSchema(securitySettings).pick({
  settingKey: true,
  settingValue: true,
  updatedBy: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;

export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type Plan = typeof plans.$inferSelect;

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

export type InsertConsentEvent = z.infer<typeof insertConsentEventSchema>;
export type ConsentEvent = typeof consentEvents.$inferSelect;

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

export type InsertAdminSession = z.infer<typeof insertAdminSessionSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;

export type InsertSecuritySetting = z.infer<typeof insertSecuritySettingSchema>;
export type SecuritySetting = typeof securitySettings.$inferSelect;
