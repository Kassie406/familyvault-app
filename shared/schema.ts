import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  serial,
  boolean,
  unique
} from "drizzle-orm/pg-core";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Family Activity table for activity feed
export const familyActivity = pgTable("family_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  userId: varchar("user_id").notNull(),
  activityType: varchar("activity_type").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  metadata: jsonb("metadata").default({}),
  priority: varchar("priority").default("low"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertFamilyActivity = typeof familyActivity.$inferInsert;
export type FamilyActivity = typeof familyActivity.$inferSelect;

// Family Updates (Reminders & Notices) table
export const familyUpdates = pgTable("family_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  type: varchar("type").notNull(), // insurance_renewal, security_reminder, birthday, meeting, etc.
  title: varchar("title").notNull(),
  body: text("body"),
  severity: varchar("severity").notNull().default("info"), // info, warning, urgent
  dueAt: timestamp("due_at"),
  actionUrl: varchar("action_url"),
  metadata: jsonb("metadata").default({}),
  isDismissed: boolean("is_dismissed").default(false),
  dismissedBy: varchar("dismissed_by"),
  dismissedAt: timestamp("dismissed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertFamilyUpdate = typeof familyUpdates.$inferInsert;
export type FamilyUpdate = typeof familyUpdates.$inferSelect;

// Family Update Snooze table - per-user snoozing of updates
export const familyUpdateSnooze = pgTable("family_update_snooze", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  updateId: varchar("update_id").notNull().references(() => familyUpdates.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull(),
  until: timestamp("until").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertFamilyUpdateSnooze = typeof familyUpdateSnooze.$inferInsert;
export type FamilyUpdateSnooze = typeof familyUpdateSnooze.$inferSelect;

// Family Members
export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name").notNull(),
  role: varchar("role").notNull().default("member"), // owner, admin, member
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  dateOfBirth: timestamp("date_of_birth"),
  relationshipToFamily: varchar("relationship_to_family"),
  emergencyContact: boolean("emergency_contact").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shared family resources/documents
export const familyResources = pgTable("family_resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // passwords, documents, contacts, etc.
  subcategory: varchar("subcategory"),
  contentType: varchar("content_type").notNull(), // text, file, link
  content: text("content"), // For text content or file paths
  fileUrl: varchar("file_url"),
  fileName: varchar("file_name"),
  fileSize: integer("file_size"),
  tags: text("tags"), // JSON array of tags
  isPrivate: boolean("is_private").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Share links for temporary access
export const shareLinks = pgTable("share_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceId: varchar("resource_id").references(() => familyResources.id),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Invitations system
export const invitations = pgTable("invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  email: varchar("email").notNull(),
  role: varchar("role").notNull().default("member"),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  invitedBy: varchar("invited_by").references(() => users.id),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// SMS notifications log
export const smsNotifications = pgTable("sms_notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientPhone: varchar("recipient_phone").notNull(),
  message: text("message").notNull(),
  status: varchar("status").notNull(), // sent, failed, delivered
  twilioMessageId: varchar("twilio_message_id"),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at").defaultNow(),
});

// Chat threads for family messaging
export const threads = pgTable("threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages within threads
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").references(() => threads.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id").notNull(),
  senderName: varchar("sender_name").notNull(),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array of file info
  messageType: varchar("message_type").default("text"), // text, image, file, system
  replyToId: varchar("reply_to_id").references(() => messages.id),
  editedAt: timestamp("edited_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message read status tracking
export const messageReadStatus = pgTable("message_read_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").references(() => messages.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull(),
  readAt: timestamp("read_at").defaultNow(),
}, (table) => [
  unique("unique_user_message_read").on(table.messageId, table.userId)
]);

// Thread participants for tracking who's in each chat
export const threadParticipants = pgTable("thread_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").references(() => threads.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
  lastReadMessageId: varchar("last_read_message_id").references(() => messages.id),
  lastReadAt: timestamp("last_read_at"),
}, (table) => [
  unique("unique_thread_participant").on(table.threadId, table.userId)
]);

// API Services Management
export const apiServices = pgTable("api_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(), // messaging, storage, database, payment, etc.
  description: text("description"),
  baseUrl: varchar("base_url"),
  status: varchar("status").notNull().default("active"), // active, inactive, deprecated
  variables: text("variables"), // JSON array of environment variable names
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API Credentials with encryption
export const apiCredentials = pgTable("api_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").references(() => apiServices.id, { onDelete: "cascade" }),
  label: varchar("label").notNull(), // e.g., "API Key", "Secret Key", "Account SID"
  type: varchar("type").notNull(), // api_key, secret, token, username, password
  ciphertext: text("ciphertext").notNull(), // Encrypted secret value
  iv: text("iv").notNull(), // Initialization vector for encryption
  tag: text("tag").notNull(), // Authentication tag for AES-GCM
  masked: varchar("masked").notNull(), // Masked display value (e.g., "••••abcd")
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertApiService = typeof apiServices.$inferInsert;
export type ApiService = typeof apiServices.$inferSelect;
export type InsertApiCredential = typeof apiCredentials.$inferInsert;
export type ApiCredential = typeof apiCredentials.$inferSelect;

// Admin sessions
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionToken: varchar("session_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Security settings
export const securitySettings = pgTable("security_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orgId: varchar("org_id").notNull(),
  setting: varchar("setting").notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Impersonation sessions
export const impersonationSessions = pgTable("impersonation_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminUserId: varchar("admin_user_id").notNull(),
  targetUserId: varchar("target_user_id").notNull(),
  token: varchar("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Organizations
export const organizations = pgTable("organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Plans
export const plans = pgTable("plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  price: integer("price").notNull(),
  features: text("features"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Coupons
export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code").notNull().unique(),
  discount: integer("discount").notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Articles
export const articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Consent events
export const consentEvents = pgTable("consent_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  consentType: varchar("consent_type").notNull(),
  granted: boolean("granted").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  action: varchar("action").notNull(),
  details: text("details"),
  ipAddress: varchar("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add all the other required tables with minimal structure to fix imports
export const gdprConsentEvents = pgTable("gdpr_consent_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  consentType: varchar("consent_type").notNull(),
  granted: boolean("granted").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dsarRequests = pgTable("dsar_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  requestType: varchar("request_type").notNull(),
  status: varchar("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const retentionPolicies = pgTable("retention_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dataType: varchar("data_type").notNull(),
  retentionDays: integer("retention_days").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suppressionList = pgTable("suppression_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  reason: varchar("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const invites = pgTable("invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull(),
  role: varchar("role").notNull(),
  token: varchar("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inviteLinks = pgTable("invite_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: varchar("token").notNull().unique(),
  maxUses: integer("max_uses"),
  currentUses: integer("current_uses").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyBusinessItems = pgTable("family_business_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyLegalDocs = pgTable("family_legal_docs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyLegalItems = pgTable("family_legal_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyInsurancePolicies = pgTable("family_insurance_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  policyName: varchar("policy_name").notNull(),
  provider: varchar("provider"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyInsuranceItems = pgTable("family_insurance_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  itemName: varchar("item_name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyTaxYears = pgTable("family_tax_years", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  year: integer("year").notNull(),
  status: varchar("status"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyTaxItems = pgTable("family_tax_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  taxYearId: varchar("tax_year_id"),
  itemName: varchar("item_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageThreads = pgTable("message_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const threadMembers = pgTable("thread_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  userId: varchar("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const messageReadReceipts = pgTable("message_read_receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  userId: varchar("user_id").notNull(),
  readAt: timestamp("read_at").defaultNow(),
});

export const messageReactions = pgTable("message_reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  userId: varchar("user_id").notNull(),
  reaction: varchar("reaction").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageAttachments = pgTable("message_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add required type definitions
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;
export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = typeof coupons.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type ConsentEvent = typeof consentEvents.$inferSelect;
export type InsertConsentEvent = typeof consentEvents.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
export type SecuritySetting = typeof securitySettings.$inferSelect;
export type InsertSecuritySetting = typeof securitySettings.$inferInsert;
export type ImpersonationSession = typeof impersonationSessions.$inferSelect;
export type InsertImpersonationSession = typeof impersonationSessions.$inferInsert;
export type GdprConsentEvent = typeof gdprConsentEvents.$inferSelect;
export type InsertGdprConsentEvent = typeof gdprConsentEvents.$inferInsert;
export type DsarRequest = typeof dsarRequests.$inferSelect;
export type InsertDsarRequest = typeof dsarRequests.$inferInsert;
export type RetentionPolicy = typeof retentionPolicies.$inferSelect;
export type InsertRetentionPolicy = typeof retentionPolicies.$inferInsert;
export type Suppression = typeof suppressionList.$inferSelect;
export type InsertSuppression = typeof suppressionList.$inferInsert;
export type Invite = typeof invites.$inferSelect;
export type InsertInvite = typeof invites.$inferInsert;
export type InviteLink = typeof inviteLinks.$inferSelect;
export type InsertInviteLink = typeof inviteLinks.$inferInsert;
export type Family = typeof families.$inferSelect;
export type InsertFamily = typeof families.$inferInsert;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = typeof familyMembers.$inferInsert;
export type FamilyBusinessItem = typeof familyBusinessItems.$inferSelect;
export type InsertFamilyBusinessItem = typeof familyBusinessItems.$inferInsert;
export type FamilyLegalDoc = typeof familyLegalDocs.$inferSelect;
export type InsertFamilyLegalDoc = typeof familyLegalDocs.$inferInsert;
export type FamilyLegalItem = typeof familyLegalItems.$inferSelect;
export type InsertFamilyLegalItem = typeof familyLegalItems.$inferInsert;
export type FamilyInsurancePolicy = typeof familyInsurancePolicies.$inferSelect;
export type InsertFamilyInsurancePolicy = typeof familyInsurancePolicies.$inferInsert;
export type FamilyInsuranceItem = typeof familyInsuranceItems.$inferSelect;
export type InsertFamilyInsuranceItem = typeof familyInsuranceItems.$inferInsert;
export type FamilyTaxYear = typeof familyTaxYears.$inferSelect;
export type InsertFamilyTaxYear = typeof familyTaxYears.$inferInsert;
export type FamilyTaxItem = typeof familyTaxItems.$inferSelect;
export type InsertFamilyTaxItem = typeof familyTaxItems.$inferInsert;
export type MessageThread = typeof messageThreads.$inferSelect;
export type InsertMessageThread = typeof messageThreads.$inferInsert;
export type ThreadMember = typeof threadMembers.$inferSelect;
export type InsertThreadMember = typeof threadMembers.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type MessageReadReceipt = typeof messageReadReceipts.$inferSelect;
export type InsertMessageReadReceipt = typeof messageReadReceipts.$inferInsert;
export type MessageReaction = typeof messageReactions.$inferSelect;
export type InsertMessageReaction = typeof messageReactions.$inferInsert;
export type MessageAttachment = typeof messageAttachments.$inferSelect;
export type InsertMessageAttachment = typeof messageAttachments.$inferInsert;

// Calendar System Tables
export const calendars = pgTable("calendars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  name: varchar("name").notNull(),
  color: varchar("color").default("#D4AF37"), // Gold default
  isSystem: boolean("is_system").default(false), // e.g., Holidays
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calendarEvents = pgTable("calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  calendarId: varchar("calendar_id").notNull().references(() => calendars.id, { onDelete: "cascade" }),
  creatorUserId: varchar("creator_user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  location: varchar("location"),
  startAt: timestamp("start_at", { withTimezone: true }).notNull(),
  endAt: timestamp("end_at", { withTimezone: true }).notNull(),
  allDay: boolean("all_day").default(false).notNull(),
  timezone: varchar("timezone").default("UTC").notNull(), // IANA TZ
  recurrence: jsonb("recurrence"), // {freq, interval, byDay, byMonth, byMonthDay, bySetPos, count, until}
  visibility: varchar("visibility").default("family"), // 'private' | 'family' | 'public'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("calendar_events_calendar_start_idx").on(table.calendarId, table.startAt),
  index("calendar_events_start_idx").on(table.startAt),
]);

export const calendarEventAttendees = pgTable("calendar_event_attendees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => calendarEvents.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").default("viewer"), // 'owner' | 'editor' | 'viewer'
  rsvp: varchar("rsvp").default("none"), // 'yes' | 'no' | 'maybe' | 'none'
}, (table) => [
  unique("unique_event_attendee").on(table.eventId, table.userId)
]);

export const calendarEventReminders = pgTable("calendar_event_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => calendarEvents.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  minutesBefore: integer("minutes_before").notNull(),
  channel: varchar("channel").default("push"), // 'push' | 'email' | 'sms'
  sentAt: timestamp("sent_at"),
}, (table) => [
  unique("unique_event_reminder").on(table.eventId, table.userId, table.minutesBefore)
]);

export const calendarEventSnoozes = pgTable("calendar_event_snoozes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventId: varchar("event_id").notNull().references(() => calendarEvents.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  snoozeUntil: timestamp("snooze_until", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique("unique_event_snooze").on(table.eventId, table.userId)
]);

export const calendarSyncAccounts = pgTable("calendar_sync_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  provider: varchar("provider").notNull(), // 'google' | 'microsoft' | 'icloud' | 'caldav'
  extCalendarId: varchar("ext_calendar_id"), // provider calendar id
  scopes: text("scopes"),
  accessToken: text("access_token").notNull(), // encrypt at rest
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calendarSyncDelta = pgTable("calendar_sync_delta", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  provider: varchar("provider").notNull(),
  lastCursor: text("last_cursor"), // Google: syncToken / updatedMin
  lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
}, (table) => [
  unique("unique_user_provider_sync").on(table.userId, table.provider)
]);

// Calendar Types
export type Calendar = typeof calendars.$inferSelect;
export type InsertCalendar = typeof calendars.$inferInsert;
export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;
export type CalendarEventAttendee = typeof calendarEventAttendees.$inferSelect;
export type InsertCalendarEventAttendee = typeof calendarEventAttendees.$inferInsert;
export type CalendarEventReminder = typeof calendarEventReminders.$inferSelect;
export type InsertCalendarEventReminder = typeof calendarEventReminders.$inferInsert;
export type CalendarEventSnooze = typeof calendarEventSnoozes.$inferSelect;
export type InsertCalendarEventSnooze = typeof calendarEventSnoozes.$inferInsert;
export type CalendarSyncAccount = typeof calendarSyncAccounts.$inferSelect;
export type InsertCalendarSyncAccount = typeof calendarSyncAccounts.$inferInsert;
export type CalendarSyncDelta = typeof calendarSyncDelta.$inferSelect;
export type InsertCalendarSyncDelta = typeof calendarSyncDelta.$inferInsert;

// Additional missing tables
export const documentFiles = pgTable("document_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  fileName: varchar("file_name").notNull(),
  fileUrl: varchar("file_url").notNull(),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyPhotos = pgTable("family_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  photoUrl: varchar("photo_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DocumentFile = typeof documentFiles.$inferSelect;
export type InsertDocumentFile = typeof documentFiles.$inferInsert;
export type FamilyPhoto = typeof familyPhotos.$inferSelect;
export type InsertFamilyPhoto = typeof familyPhotos.$inferInsert;

// SMS and notification tables
export const verificationCodes = pgTable("verification_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: varchar("phone_number").notNull(),
  code: varchar("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  smsEnabled: boolean("sms_enabled").default(false),
  emailEnabled: boolean("email_enabled").default(true),
  pushEnabled: boolean("push_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type VerificationCode = typeof verificationCodes.$inferSelect;
export type InsertVerificationCode = typeof verificationCodes.$inferInsert;
export type NotificationPreference = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreference = typeof notificationPreferences.$inferInsert;

// Auth sessions
export const authSessions = pgTable("auth_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionToken: varchar("session_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export type AuthSession = typeof authSessions.$inferSelect;
export type InsertAuthSession = typeof authSessions.$inferInsert;

// Organization security settings
export const orgSecuritySettings = pgTable("org_security_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orgId: varchar("org_id").notNull(),
  setting: varchar("setting").notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OrgSecuritySetting = typeof orgSecuritySettings.$inferSelect;
export type InsertOrgSecuritySetting = typeof orgSecuritySettings.$inferInsert;

// WebAuthn credentials
export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  credentialId: text("credential_id").notNull().unique(),
  publicKey: text("public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  transports: text("transports"), // JSON array
  createdAt: timestamp("created_at").defaultNow(),
});

export type WebauthnCredential = typeof webauthnCredentials.$inferSelect;
export type InsertWebauthnCredential = typeof webauthnCredentials.$inferInsert;

// Business items
export const businessItems = pgTable("business_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessId: varchar("business_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BusinessItem = typeof businessItems.$inferSelect;
export type InsertBusinessItem = typeof businessItems.$inferInsert;

// Incident management tables
export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  severity: varchar("severity").notNull(),
  status: varchar("status").notNull().default("open"),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const oncallTargets = pgTable("oncall_targets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statusAlertState = pgTable("status_alert_state", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  alertType: varchar("alert_type").notNull(),
  lastTriggered: timestamp("last_triggered"),
  isActive: boolean("is_active").default(false),
  metadata: text("metadata"), // JSON data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;
export type OncallTarget = typeof oncallTargets.$inferSelect;
export type InsertOncallTarget = typeof oncallTargets.$inferInsert;
export type StatusAlertState = typeof statusAlertState.$inferSelect;
export type InsertStatusAlertState = typeof statusAlertState.$inferInsert;

// Credentials and sharing tables
export const credentials = pgTable("credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  username: varchar("username"),
  password: text("password"), // encrypted
  url: varchar("url"),
  notes: text("notes"),
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const credentialShares = pgTable("credential_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  credentialId: varchar("credential_id").notNull(),
  sharedWith: varchar("shared_with").notNull(),
  permissions: varchar("permissions").default("read"),
  sharedBy: varchar("shared_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Credential = typeof credentials.$inferSelect;
export type InsertCredential = typeof credentials.$inferInsert;
export type CredentialShare = typeof credentialShares.$inferSelect;
export type InsertCredentialShare = typeof credentialShares.$inferInsert;

// Link policies table
export const linkPolicies = pgTable("link_policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  maxUses: integer("max_uses"),
  expiresAt: timestamp("expires_at"),
  allowedDomains: text("allowed_domains"), // JSON array
  requiresAuth: boolean("requires_auth").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type LinkPolicy = typeof linkPolicies.$inferSelect;
export type InsertLinkPolicy = typeof linkPolicies.$inferInsert;

// Document sharing system
export const documentShares = pgTable("document_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceId: varchar("resource_id").notNull().references(() => familyResources.id, { onDelete: "cascade" }),
  createdBy: varchar("created_by").notNull().references(() => users.id),
  scope: varchar("scope").notNull(), // 'family' | 'user' | 'link'
  sharedWithUserId: varchar("shared_with_user_id").references(() => users.id),
  policyId: varchar("policy_id").references(() => linkPolicies.id),
  canDownload: boolean("can_download").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document approval workflow
export const docApprovals = pgTable("doc_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resourceId: varchar("resource_id").notNull().references(() => familyResources.id, { onDelete: "cascade" }),
  requestedBy: varchar("requested_by").notNull().references(() => users.id),
  status: varchar("status").default("pending"), // pending|approved|rejected
  approverId: varchar("approver_id").references(() => users.id),
  decidedAt: timestamp("decided_at"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DocumentShare = typeof documentShares.$inferSelect;
export type InsertDocumentShare = typeof documentShares.$inferInsert;
export type DocApproval = typeof docApprovals.$inferSelect;
export type InsertDocApproval = typeof docApprovals.$inferInsert;

// Family Calendar Events
export const familyCalendarEvents = pgTable("family_calendar_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location"),
  eventType: varchar("event_type").notNull().default("general"), // birthday, reminder, urgent, general
  color: varchar("color").default("#D4AF37"),
  isAllDay: boolean("is_all_day").default(false),
  reminderMinutes: integer("reminder_minutes"),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ICE (In Case of Emergency) Data
export const familyIceData = pgTable("family_ice_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull(),
  emergencyContacts: jsonb("emergency_contacts").default({}), // { primary: "", doctor: "", neighbor: "" }
  medicalInfo: jsonb("medical_info").default({}), // { allergies: "", conditions: "", medications: "" }
  bloodTypes: jsonb("blood_types").default({}), // { dad: "", mom: "", kids: "" }
  additionalNotes: text("additional_notes"),
  lastUpdatedBy: varchar("last_updated_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FamilyCalendarEvent = typeof familyCalendarEvents.$inferSelect;
export type InsertFamilyCalendarEvent = typeof familyCalendarEvents.$inferInsert;
export type FamilyIceData = typeof familyIceData.$inferSelect;
export type InsertFamilyIceData = typeof familyIceData.$inferInsert;