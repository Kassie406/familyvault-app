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
  lastSeenAt: timestamp("last_seen_at"),
  // mfaSecret: text("mfa_secret"), // TOTP secret for two-factor authentication - TODO: Add back after DB migration
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

export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  percentOff: integer("percent_off"),
  amountOff: integer("amount_off"),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  maxRedemptions: integer("max_redemptions"),
  timesRedeemed: integer("times_redeemed").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Create enum for menu categories
export const menuCategoryEnum = pgEnum("menu_category", [
  "Child Information",
  "Disaster Planning", 
  "Elderly Parents",
  "Estate Planning",
  "Getting Married",
  "Home Buying",
  "International Travel",
  "Starting a Family",
  "Moving",
  "When Someone Dies",
  "Digital Security",
  "Neurodiversity"
]);

// Create enum for tenant types
export const tenantEnum = pgEnum("tenant", ["PUBLIC", "FAMILY", "STAFF"]);

// Create enum for article status
export const articleStatusEnum = pgEnum("article_status", ["draft", "published", "scheduled", "archived"]);

export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  bodyMd: text("body_md").notNull(),
  category: text("category").notNull().default("announcements"),
  menuCategory: menuCategoryEnum("menu_category"),
  tenant: tenantEnum("tenant").notNull().default("PUBLIC"),
  status: articleStatusEnum("status").notNull().default("draft"),
  publishAt: timestamp("publish_at"),
  tags: text("tags").array(),
  seoDescription: text("seo_description"),
  featureImage: text("feature_image"),
  pinToTop: boolean("pin_to_top").default(false).notNull(),
  allowComments: boolean("allow_comments").default(true).notNull(),
  published: boolean("published").default(false).notNull(),
  authorId: varchar("author_id"),
  authorName: text("author_name"),
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

// Session tracking for device management and security
export const authSessions = pgTable("auth_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sid: text("sid").notNull().unique(), // express-session SID
  userId: varchar("user_id").notNull(),
  orgId: varchar("org_id"),
  ip: text("ip"), // INET stored as text for compatibility
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

// Organization-level security settings
export const orgSecuritySettings = pgTable("org_security_settings", {
  orgId: varchar("org_id").primaryKey(),
  requireMfaForDownloads: boolean("require_mfa_for_downloads").default(true).notNull(),
  requireMfaForShares: boolean("require_mfa_for_shares").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Status monitoring and alerting tables
export const statusAlertState = pgTable("status_alert_state", {
  component: text("component").primaryKey(),
  lastState: boolean("last_state"),
  lastAlertAt: timestamp("last_alert_at"),
  cooldownUntil: timestamp("cooldown_until"),
  dailySent: integer("daily_sent").default(0).notNull(),
  counterDate: text("counter_date").default(sql`CURRENT_DATE`).notNull(),
});

export const statusMaintenance = pgTable("status_maintenance", {
  id: boolean("id").primaryKey().default(true),
  enabled: boolean("enabled").default(false).notNull(),
  reason: text("reason"),
  until: timestamp("until"),
});

export const statusMaintenanceComponents = pgTable("status_maintenance_components", {
  component: text("component").primaryKey(),
  enabled: boolean("enabled").default(false).notNull(),
  reason: text("reason"),
  until: timestamp("until"),
});

export const statusQuietHours = pgTable("status_quiet_hours", {
  id: boolean("id").primaryKey().default(true),
  enabled: boolean("enabled").default(false).notNull(),
  tz: text("tz").default("UTC").notNull(),
  startMin: integer("start_min").default(1380).notNull(), // 23:00
  endMin: integer("end_min").default(420).notNull(), // 07:00
  criticalOnly: boolean("critical_only").default(true).notNull(),
});

// Security tables for enhanced authentication
export const userDevices = pgTable("user_devices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fingerprint: text("fingerprint").notNull().unique(),
  name: text("name"), // e.g., "MacBook Pro - Chrome"
  trusted: boolean("trusted").default(false).notNull(),
  lastUsed: timestamp("last_used").defaultNow().notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"), // e.g., "San Francisco, CA"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").default(0).notNull(),
  transports: json("transports"), // ['usb', 'nfc', 'ble', 'internal']
  name: text("name"), // User-friendly name like "YubiKey"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
});

export const totpSecrets = pgTable("totp_secrets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  secret: text("secret").notNull(),
  backupCodes: json("backup_codes"), // Array of backup codes
  enabled: boolean("enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const secureSessionStore = pgTable("secure_session_store", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  userId: varchar("user_id").notNull(),
  deviceId: varchar("device_id"),
  data: json("data").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActivity: timestamp("last_activity").defaultNow().notNull(),
});

export const fileSignatures = pgTable("file_signatures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileKey: text("file_key").notNull().unique(),
  signature: text("signature").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  userId: varchar("user_id"),
  orgId: varchar("org_id"),
  permissions: json("permissions"), // ['read', 'download', 'share']
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Incident management tables
export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  component: text("component").notNull(),
  severity: text("severity").notNull(), // S1, S2, etc.
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgedBy: varchar("acknowledged_by"),
  closedAt: timestamp("closed_at"),
  status: text("status").default("open").notNull(), // open, acknowledged, closed
  lastEscalationTier: integer("last_escalation_tier").default(0).notNull(),
  description: text("description"),
});

export const oncallTargets = pgTable("oncall_targets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tier: integer("tier").notNull(),
  kind: text("kind").notNull(), // email, sms, voice
  to: text("to").notNull(),
  name: text("name"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Marketing promotions table
export const promotionTypeEnum = pgEnum("promotion_type", ["banner", "popup", "ribbon", "inline"]);
export const promotionStatusEnum = pgEnum("promotion_status", ["active", "scheduled", "expired", "paused"]);

export const marketingPromotions = pgTable("marketing_promotions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: promotionTypeEnum("type").notNull(),
  title: text("title").notNull(),
  content: json("content").notNull(), // {headline, sub, cta: {label, href}}
  couponCode: text("coupon_code"),
  targets: json("targets").notNull(), // {tenants: [], pages: [], segments: []}
  schedule: json("schedule").notNull(), // {start, end, tz}
  status: promotionStatusEnum("status").default("paused").notNull(),
  paused: boolean("paused").default(false).notNull(),
  variants: json("variants").default([]).notNull(), // Array of A/B test variants
  metrics: json("metrics").default({impressions: 0, clicks: 0, conversions: 0, updatedAt: null}).notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// GDPR Compliance Tables
export const consentPurposeEnum = pgEnum("consent_purpose", ["marketing", "analytics", "required"]);
export const consentStatusEnum = pgEnum("consent_status", ["granted", "denied"]);
export const consentMethodEnum = pgEnum("consent_method", ["banner", "settings", "api", "import"]);
export const consentSourceEnum = pgEnum("consent_source", ["web", "mobile", "admin"]);

export const dsarTypeEnum = pgEnum("dsar_type", ["access", "erasure", "rectification", "portability", "restriction", "objection"]);
export const dsarStatusEnum = pgEnum("dsar_status", ["open", "id_pending", "in_progress", "awaiting_subject", "completed", "rejected"]);

export const retentionDispositionEnum = pgEnum("retention_disposition", ["delete", "anonymize"]);

// GDPR Consent Events (immutable ledger)
export const gdprConsentEvents = pgTable("gdpr_consent_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  purpose: consentPurposeEnum("purpose").notNull(),
  status: consentStatusEnum("status").notNull(),
  method: consentMethodEnum("method").notNull(),
  source: consentSourceEnum("source").notNull(),
  ip: text("ip"),
  userAgent: text("user_agent"),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
  meta: json("meta"), // banner_version, etc.
});

// Data Subject Access Requests
export const dsarRequests = pgTable("dsar_requests", {
  id: varchar("id").primaryKey(), // Will be 'dsr_' + UUID
  type: dsarTypeEnum("type").notNull(),
  subjectUserId: varchar("subject_user_id"),
  subjectEmail: text("subject_email"),
  status: dsarStatusEnum("status").default("open").notNull(),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  dueAt: timestamp("due_at").notNull(),
  closedAt: timestamp("closed_at"),
  legalBasis: text("legal_basis"),
  notes: text("notes"),
  verifiedAt: timestamp("verified_at"),
  exportedAt: timestamp("exported_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Retention Policies
export const retentionPolicies = pgTable("retention_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dataset: text("dataset").notNull(),
  basis: text("basis").notNull(),
  ttlDays: integer("ttl_days").notNull(),
  disposition: retentionDispositionEnum("disposition").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Suppression List (hashed emails)
export const suppressionList = pgTable("suppression_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  emailHash: text("email_hash").notNull().unique(), // SHA-256 hex
  reason: text("reason").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Family Credential Storage
export const credentials = pgTable("credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'password', 'note', 'card', etc.
  encryptedData: text("encrypted_data").notNull(), // Encrypted JSON payload
  ownerId: varchar("owner_id").notNull(),
  orgId: varchar("org_id"),
  tags: text("tags").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Share Links for credentials  
export const shareLinks = pgTable("share_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: text("token").notNull().unique(),
  credentialId: varchar("credential_id").notNull(),
  requireLogin: boolean("require_login").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  revoked: boolean("revoked").default(false).notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Credential sharing permissions
export const credentialShares = pgTable("credential_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  credentialId: varchar("credential_id").notNull(),
  subjectId: varchar("subject_id").notNull(), // member or group id
  permission: text("permission").notNull().default("none"), // 'none', 'view', 'edit', 'owner'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueCredentialSubject: unique().on(table.credentialId, table.subjectId),
}));

// Admin Impersonation Sessions - Security-sensitive table for tracking user impersonation
export const impersonationStatusEnum = pgEnum("impersonation_status", ["active", "completed", "expired", "terminated"]);

export const impersonationSessions = pgTable("impersonation_sessions", {
  id: varchar("id").primaryKey(), // Will be 'imp_' + UUID
  actorId: varchar("actor_id").notNull(), // Admin who started the session
  targetId: varchar("target_id").notNull(), // User being impersonated
  businessReason: text("business_reason").notNull(), // Required justification
  status: impersonationStatusEnum("status").default("active").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  endedAt: timestamp("ended_at"),
  ip: text("ip"), // Actor's IP address
  deny: json("deny").default([]).notNull(), // Blocked operations
  meta: json("meta"), // Additional context (e.g., ticket_id)
  endReason: text("end_reason"), // manual, expired, terminated
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// File storage and processing enums
export const scanStatusEnum = pgEnum("scan_status", ["pending","clean","infected","error","skipped"]);
export const thumbStatusEnum = pgEnum("thumb_status", ["pending","done","error","skipped"]);

// Document Files - handles actual file storage for documents
export const documentFiles = pgTable("document_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  storageKey: text("storage_key").notNull().unique(),
  fileName: text("file_name").notNull(),
  contentType: text("content_type"),
  size: integer("size"),
  sha256: text("sha256"),
  
  // Metadata
  title: text("title"),
  description: text("description"),
  category: text("category"), // 'insurance', 'medical', 'legal', 'financial', etc.
  
  // AV Scanning
  scanStatus: scanStatusEnum("scan_status").notNull().default("pending"),
  scanResult: text("scan_result"),
  quarantined: boolean("quarantined").notNull().default(false),
  
  // Thumbnails (for document previews)
  thumbStatus: thumbStatusEnum("thumb_status").notNull().default("skipped"),
  thumbKey: text("thumb_key"),
  thumbWidth: integer("thumb_width"),
  thumbHeight: integer("thumb_height"),
  
  // Processing timestamps
  processedAt: timestamp("processed_at"),
  uploadedBy: varchar("uploaded_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Photo Storage - handles family photos and albums
export const familyPhotos = pgTable("family_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  albumId: varchar("album_id"), // optional grouping
  storageKey: text("storage_key").notNull().unique(),
  fileName: text("file_name").notNull(),
  contentType: text("content_type"),
  size: integer("size"),
  sha256: text("sha256"),
  
  // Photo metadata
  caption: text("caption"),
  altText: text("alt_text"),
  tags: text("tags").array().default([]).notNull(),
  location: text("location"),
  takenAt: timestamp("taken_at"),
  
  // AV Scanning
  scanStatus: scanStatusEnum("scan_status").notNull().default("pending"),
  scanResult: text("scan_result"),
  quarantined: boolean("quarantined").notNull().default(false),
  
  // Thumbnails and variants
  thumbStatus: thumbStatusEnum("thumb_status").notNull().default("pending"),
  thumbKey: text("thumb_key"), // 256px thumbnail
  gridKey: text("grid_key"),   // 1024px grid view
  thumbWidth: integer("thumb_width"),
  thumbHeight: integer("thumb_height"),
  
  // Processing timestamps
  processedAt: timestamp("processed_at"),
  uploadedBy: varchar("uploaded_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Photo Albums - organize family photos
export const photoAlbums = pgTable("photo_albums", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  coverPhotoId: varchar("cover_photo_id"),
  isPrivate: boolean("is_private").default(false).notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messaging System - Real-time family communication
export const threadKindEnum = pgEnum("thread_kind", ["family", "dm", "group"]);
export const threadMemberRoleEnum = pgEnum("thread_member_role", ["owner", "member"]);

// Message Threads - conversation containers
export const messageThreads = pgTable("message_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kind: threadKindEnum("kind").notNull(),
  title: text("title"),
  familyId: varchar("family_id").notNull(),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Thread Members - who can access each thread
export const threadMembers = pgTable("thread_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  userId: varchar("user_id").notNull(),
  role: threadMemberRoleEnum("role").default("member").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => ({
  uniqueThreadUser: unique().on(table.threadId, table.userId),
}));

// Messages - actual chat messages
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  authorId: varchar("author_id").notNull(),
  body: text("body"),
  fileIds: text("file_ids").array().default([]).notNull(), // References to uploaded files
  createdAt: timestamp("created_at").defaultNow().notNull(),
  editedAt: timestamp("edited_at"),
  deletedAt: timestamp("deleted_at"),
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
  category: true,
  menuCategory: true,
  tenant: true,
  status: true,
  publishAt: true,
  tags: true,
  seoDescription: true,
  featureImage: true,
  pinToTop: true,
  allowComments: true,
  published: true,
  authorId: true,
  authorName: true,
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

export const insertIncidentSchema = createInsertSchema(incidents).pick({
  component: true,
  severity: true,
  acknowledgedAt: true,
  acknowledgedBy: true,
  closedAt: true,
  status: true,
  lastEscalationTier: true,
  description: true,
});

export const insertOncallTargetSchema = createInsertSchema(oncallTargets).pick({
  tier: true,
  kind: true,
  to: true,
  name: true,
  active: true,
});

export const insertMarketingPromotionSchema = createInsertSchema(marketingPromotions).pick({
  type: true,
  title: true,
  content: true,
  couponCode: true,
  targets: true,
  schedule: true,
  status: true,
  paused: true,
  variants: true,
  createdBy: true,
});

export const insertImpersonationSessionSchema = createInsertSchema(impersonationSessions).pick({
  id: true,
  actorId: true,
  targetId: true,
  businessReason: true,
  status: true,
  expiresAt: true,
  endedAt: true,
  ip: true,
  deny: true,
  meta: true,
  endReason: true,
});

// GDPR Insert Schemas
export const insertGdprConsentEventSchema = createInsertSchema(gdprConsentEvents).pick({
  userId: true,
  purpose: true,
  status: true,
  method: true,
  source: true,
  ip: true,
  userAgent: true,
  meta: true,
});

export const insertDsarRequestSchema = createInsertSchema(dsarRequests).pick({
  id: true,
  type: true,
  subjectUserId: true,
  subjectEmail: true,
  status: true,
  dueAt: true,
  legalBasis: true,
  notes: true,
});

export const insertRetentionPolicySchema = createInsertSchema(retentionPolicies).pick({
  dataset: true,
  basis: true,
  ttlDays: true,
  disposition: true,
  enabled: true,
});

export const insertSuppressionSchema = createInsertSchema(suppressionList).pick({
  emailHash: true,
  reason: true,
});


// Business Management - Company entities, contracts, licenses, etc.
export const businessTypeEnum = pgEnum("business_type", [
  "entity",
  "contract", 
  "license",
  "insurance",
  "partner",
  "other",
]);

export const businessItems = pgTable("business_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull(), // References users.id
  type: businessTypeEnum("type").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  docCount: integer("doc_count").default(0),
  tags: text("tags").array().default([]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Family invite system tables  
export const invitePermissionEnum = pgEnum("invite_permission", ["view", "edit", "admin"]);
export const familyRoleEnum = pgEnum("family_role", ["owner", "parent", "child", "grandparent", "member", "other"]);

export const invites = pgTable("invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  email: text("email").notNull(),
  permission: invitePermissionEnum("permission").notNull().default("view"),
  familyRole: familyRoleEnum("family_role").notNull().default("member"),
  invitedByUserId: varchar("invited_by_user_id").notNull(),
  token: text("token").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending | accepted | revoked | expired | bounced
  requireLogin: boolean("require_login").notNull().default(true),
  message: text("message"),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  acceptedAt: timestamp("accepted_at", { mode: "date" }),
  acceptedBy: varchar("accepted_by"),
});

export const inviteLinks = pgTable("invite_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdByUserId: varchar("created_by_user_id").notNull(),
  permission: invitePermissionEnum("permission").notNull().default("view"),
  requireLogin: boolean("require_login").notNull().default(true),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Core family management
export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  relationshipToOwner: text("relationship_to_owner"), // "spouse", "child", "parent", etc.
  role: familyRoleEnum("role").notNull().default("member"),
  avatarColor: text("avatar_color").default("#3498DB"),
  itemCount: integer("item_count").default(0).notNull(),
  emergencyContact: boolean("emergency_contact").default(false),
  profileImageUrl: text("profile_image_url"),
  address: json("address"), // {street, city, state, zip, country}
  medicalInfo: json("medical_info"), // {conditions, medications, allergies, doctors}
  identificationInfo: json("identification_info"), // {ssn, passport, license, etc}
  userId: varchar("user_id"), // Links to users table when they accept invite
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Business Items (detailed breakdown)
export const familyBusinessItems = pgTable("family_business_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  ownerId: varchar("owner_id").notNull(), // family member who owns this business item
  type: businessTypeEnum("type").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  section: text("section").notNull(), // "documents", "finances", "legal", "people", "other"
  category: text("category").notNull(),
  value: text("value"),
  meta: json("meta"), // Additional metadata like contact info, sensitive flags
  docCount: integer("doc_count").default(0),
  tags: text("tags").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Legal Documents
export const familyLegalDocs = pgTable("family_legal_docs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  type: text("type").notNull(), // "will", "trust", "power-of-attorney", etc.
  title: text("title").notNull(),
  status: text("status").default("draft").notNull(), // "draft", "active", "expired"
  documentUrl: text("document_url"),
  notarizedDate: timestamp("notarized_date"),
  expirationDate: timestamp("expiration_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Legal Document Items (detailed breakdown)
export const familyLegalItems = pgTable("family_legal_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  legalDocId: varchar("legal_doc_id").notNull(),
  section: text("section").notNull(), // "documents", "executors", "notes", "attachments", "other"
  category: text("category").notNull(),
  title: text("title").notNull(),
  value: text("value"),
  meta: json("meta"), // Additional metadata like contact info, sensitive flags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Insurance Policies
export const familyInsurancePolicies = pgTable("family_insurance_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  type: text("type").notNull(), // "health", "life", "auto", "home", "disability"
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  policyNumber: text("policy_number"),
  coverageAmount: decimal("coverage_amount"),
  premiumAmount: decimal("premium_amount"),
  premiumFrequency: text("premium_frequency"), // "monthly", "quarterly", "annually"
  startDate: timestamp("start_date"),
  renewalDate: timestamp("renewal_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Insurance Items (detailed breakdown)
export const familyInsuranceItems = pgTable("family_insurance_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  insuranceId: varchar("insurance_id").notNull(),
  section: text("section").notNull(), // "policy", "members", "financials", "documents"
  category: text("category").notNull(),
  title: text("title").notNull(),
  value: text("value"),
  meta: json("meta"), // Additional metadata like sensitive flags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Tax Years
export const familyTaxYears = pgTable("family_tax_years", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  taxYear: text("tax_year").notNull(),
  status: text("status").default("pending").notNull(), // "pending", "filed", "processed", "audit"
  federalRefund: decimal("federal_refund"),
  stateRefund: decimal("state_refund"),
  preparer: text("preparer"), // "self", "cpa", "software"
  filedDate: timestamp("filed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family Tax Items (detailed breakdown)
export const familyTaxItems = pgTable("family_tax_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  taxYear: text("tax_year").notNull(),
  section: text("section").notNull(), // "documents", "forms", "payments", "notes", "other"
  category: text("category").notNull(),
  title: text("title").notNull(),
  value: text("value"),
  meta: json("meta"), // Additional metadata like sensitive flags
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Family credential schemas
export const insertCredentialSchema = createInsertSchema(credentials).pick({
  title: true,
  category: true,
  encryptedData: true,
  ownerId: true,
  orgId: true,
  tags: true,
});

export const insertShareLinkSchema = createInsertSchema(shareLinks).pick({
  token: true,
  credentialId: true,
  requireLogin: true,
  expiresAt: true,
  revoked: true,
  createdBy: true,
});

export const insertCredentialShareSchema = createInsertSchema(credentialShares).pick({
  credentialId: true,
  subjectId: true,
  permission: true,
});

// Business schemas
export const insertBusinessItemSchema = createInsertSchema(businessItems).pick({
  ownerId: true,
  type: true,
  title: true,
  subtitle: true,
  docCount: true,
  tags: true,
});

// Security schema inserts
export const insertUserDeviceSchema = createInsertSchema(userDevices).pick({
  userId: true,
  fingerprint: true,
  name: true,
  trusted: true,
  ipAddress: true,
  userAgent: true,
  location: true,
});

export const insertWebauthnCredentialSchema = createInsertSchema(webauthnCredentials).pick({
  userId: true,
  credentialId: true,
  publicKey: true,
  counter: true,
  transports: true,
  name: true,
});

export const insertTotpSecretSchema = createInsertSchema(totpSecrets).pick({
  userId: true,
  secret: true,
  backupCodes: true,
  enabled: true,
});

export const insertSecureSessionSchema = createInsertSchema(secureSessionStore).pick({
  sessionId: true,
  userId: true,
  deviceId: true,
  data: true,
  expiresAt: true,
  ipAddress: true,
  userAgent: true,
});

export const insertFileSignatureSchema = createInsertSchema(fileSignatures).pick({
  fileKey: true,
  signature: true,
  expiresAt: true,
  userId: true,
  orgId: true,
  permissions: true,
});

export const insertStatusAlertStateSchema = createInsertSchema(statusAlertState).pick({
  component: true,
  lastState: true,
  lastAlertAt: true,
  cooldownUntil: true,
  dailySent: true,
  counterDate: true,
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

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertOncallTarget = z.infer<typeof insertOncallTargetSchema>;
export type OncallTarget = typeof oncallTargets.$inferSelect;

export type InsertStatusAlertState = z.infer<typeof insertStatusAlertStateSchema>;
export type StatusAlertState = typeof statusAlertState.$inferSelect;

// Security types
export type InsertUserDevice = z.infer<typeof insertUserDeviceSchema>;
export type UserDevice = typeof userDevices.$inferSelect;

export type InsertWebauthnCredential = z.infer<typeof insertWebauthnCredentialSchema>;
export type WebauthnCredential = typeof webauthnCredentials.$inferSelect;

export type InsertTotpSecret = z.infer<typeof insertTotpSecretSchema>;
export type TotpSecret = typeof totpSecrets.$inferSelect;

export type InsertSecureSession = z.infer<typeof insertSecureSessionSchema>;
export type SecureSession = typeof secureSessionStore.$inferSelect;

export type InsertFileSignature = z.infer<typeof insertFileSignatureSchema>;
export type FileSignature = typeof fileSignatures.$inferSelect;

export type InsertMarketingPromotion = z.infer<typeof insertMarketingPromotionSchema>;
export type MarketingPromotion = typeof marketingPromotions.$inferSelect;

export type InsertImpersonationSession = z.infer<typeof insertImpersonationSessionSchema>;
export type ImpersonationSession = typeof impersonationSessions.$inferSelect;

// GDPR Types
export type InsertGdprConsentEvent = z.infer<typeof insertGdprConsentEventSchema>;
export type GdprConsentEvent = typeof gdprConsentEvents.$inferSelect;

export type InsertDsarRequest = z.infer<typeof insertDsarRequestSchema>;
export type DsarRequest = typeof dsarRequests.$inferSelect;

export type InsertRetentionPolicy = z.infer<typeof insertRetentionPolicySchema>;
export type RetentionPolicy = typeof retentionPolicies.$inferSelect;

export type InsertSuppression = z.infer<typeof insertSuppressionSchema>;
export type Suppression = typeof suppressionList.$inferSelect;

// Family credential types
export type InsertCredential = z.infer<typeof insertCredentialSchema>;
export type Credential = typeof credentials.$inferSelect;

export type InsertShareLink = z.infer<typeof insertShareLinkSchema>;
export type ShareLink = typeof shareLinks.$inferSelect;

export type InsertCredentialShare = z.infer<typeof insertCredentialShareSchema>;
export type CredentialShare = typeof credentialShares.$inferSelect;

// Invite schemas
export const insertFamilySchema = createInsertSchema(families).pick({
  name: true,
  ownerId: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).pick({
  familyId: true,
  name: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  relationshipToOwner: true,
  role: true,
  avatarColor: true,
  itemCount: true,
  emergencyContact: true,
  profileImageUrl: true,
  address: true,
  medicalInfo: true,
  identificationInfo: true,
  userId: true,
  isActive: true,
});

export const insertFamilyBusinessItemSchema = createInsertSchema(familyBusinessItems).pick({
  familyId: true,
  ownerId: true,
  type: true,
  title: true,
  subtitle: true,
  section: true,
  category: true,
  value: true,
  meta: true,
  docCount: true,
  tags: true,
});

export const insertFamilyLegalDocSchema = createInsertSchema(familyLegalDocs).pick({
  familyId: true,
  type: true,
  title: true,
  status: true,
  documentUrl: true,
  notarizedDate: true,
  expirationDate: true,
});

export const insertFamilyLegalItemSchema = createInsertSchema(familyLegalItems).pick({
  familyId: true,
  legalDocId: true,
  section: true,
  category: true,
  title: true,
  value: true,
  meta: true,
});

export const insertFamilyInsurancePolicySchema = createInsertSchema(familyInsurancePolicies).pick({
  familyId: true,
  type: true,
  title: true,
  provider: true,
  policyNumber: true,
  coverageAmount: true,
  premiumAmount: true,
  premiumFrequency: true,
  startDate: true,
  renewalDate: true,
  isActive: true,
});

export const insertFamilyInsuranceItemSchema = createInsertSchema(familyInsuranceItems).pick({
  familyId: true,
  insuranceId: true,
  section: true,
  category: true,
  title: true,
  value: true,
  meta: true,
});

export const insertFamilyTaxYearSchema = createInsertSchema(familyTaxYears).pick({
  familyId: true,
  taxYear: true,
  status: true,
  federalRefund: true,
  stateRefund: true,
  preparer: true,
  filedDate: true,
});

export const insertFamilyTaxItemSchema = createInsertSchema(familyTaxItems).pick({
  familyId: true,
  taxYear: true,
  section: true,
  category: true,
  title: true,
  value: true,
  meta: true,
});

export const insertInviteSchema = createInsertSchema(invites).pick({
  familyId: true,
  email: true,
  permission: true,
  familyRole: true,
  invitedByUserId: true,
  token: true,
  status: true,
  requireLogin: true,
  message: true,
  expiresAt: true,
});

export const insertInviteLinkSchema = createInsertSchema(inviteLinks).pick({
  createdByUserId: true,
  permission: true,
  requireLogin: true,
  token: true,
  expiresAt: true,
});

export const insertDocumentFileSchema = createInsertSchema(documentFiles).pick({
  familyId: true,
  storageKey: true,
  fileName: true,
  contentType: true,
  size: true,
  title: true,
  description: true,
  category: true,
  uploadedBy: true,
});

export const insertFamilyPhotoSchema = createInsertSchema(familyPhotos).pick({
  familyId: true,
  albumId: true,
  storageKey: true,
  fileName: true,
  contentType: true,
  size: true,
  caption: true,
  altText: true,
  tags: true,
  location: true,
  takenAt: true,
  uploadedBy: true,
});

export const insertPhotoAlbumSchema = createInsertSchema(photoAlbums).pick({
  familyId: true,
  name: true,
  description: true,
  coverPhotoId: true,
  isPrivate: true,
  createdBy: true,
});

// Messaging insert schemas
export const insertMessageThreadSchema = createInsertSchema(messageThreads).pick({
  kind: true,
  title: true,
  familyId: true,
  createdBy: true,
});

export const insertThreadMemberSchema = createInsertSchema(threadMembers).pick({
  threadId: true,
  userId: true,
  role: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  threadId: true,
  authorId: true,
  body: true,
  fileIds: true,
});

// Family types
export type InsertFamily = z.infer<typeof insertFamilySchema>;
export type Family = typeof families.$inferSelect;

export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;
export type FamilyMember = typeof familyMembers.$inferSelect;

export type InsertFamilyBusinessItem = z.infer<typeof insertFamilyBusinessItemSchema>;
export type FamilyBusinessItem = typeof familyBusinessItems.$inferSelect;

export type InsertFamilyLegalDoc = z.infer<typeof insertFamilyLegalDocSchema>;
export type FamilyLegalDoc = typeof familyLegalDocs.$inferSelect;

export type InsertFamilyLegalItem = z.infer<typeof insertFamilyLegalItemSchema>;
export type FamilyLegalItem = typeof familyLegalItems.$inferSelect;

export type InsertFamilyInsurancePolicy = z.infer<typeof insertFamilyInsurancePolicySchema>;
export type FamilyInsurancePolicy = typeof familyInsurancePolicies.$inferSelect;

export type InsertFamilyInsuranceItem = z.infer<typeof insertFamilyInsuranceItemSchema>;
export type FamilyInsuranceItem = typeof familyInsuranceItems.$inferSelect;

export type InsertFamilyTaxYear = z.infer<typeof insertFamilyTaxYearSchema>;
export type FamilyTaxYear = typeof familyTaxYears.$inferSelect;

export type InsertFamilyTaxItem = z.infer<typeof insertFamilyTaxItemSchema>;
export type FamilyTaxItem = typeof familyTaxItems.$inferSelect;

// Invite types
export type InsertInvite = z.infer<typeof insertInviteSchema>;
export type Invite = typeof invites.$inferSelect;

export type InsertInviteLink = z.infer<typeof insertInviteLinkSchema>;
export type InviteLink = typeof inviteLinks.$inferSelect;

export type InsertDocumentFile = z.infer<typeof insertDocumentFileSchema>;
export type DocumentFile = typeof documentFiles.$inferSelect;

export type InsertFamilyPhoto = z.infer<typeof insertFamilyPhotoSchema>;
export type FamilyPhoto = typeof familyPhotos.$inferSelect;

export type InsertPhotoAlbum = z.infer<typeof insertPhotoAlbumSchema>;
export type PhotoAlbum = typeof photoAlbums.$inferSelect;

// Messaging types
export type InsertMessageThread = z.infer<typeof insertMessageThreadSchema>;
export type MessageThread = typeof messageThreads.$inferSelect;

export type InsertThreadMember = z.infer<typeof insertThreadMemberSchema>;
export type ThreadMember = typeof threadMembers.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Business type exports  
export type BusinessItem = typeof businessItems.$inferSelect;
export type NewBusinessItem = typeof businessItems.$inferInsert;
