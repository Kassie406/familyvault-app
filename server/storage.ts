import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, sql, ilike, or, and, not, inArray } from "drizzle-orm";
import { 
  type User, type UpsertUser,
  type Organization, type InsertOrganization,
  type Plan, type InsertPlan,
  type Coupon, type InsertCoupon,
  type Article, type InsertArticle,
  type ConsentEvent, type InsertConsentEvent,
  type AuditLog, type InsertAuditLog,
  type AdminSession, type InsertAdminSession,
  type SecuritySetting, type InsertSecuritySetting,
  type ImpersonationSession, type InsertImpersonationSession,
  type GdprConsentEvent, type InsertGdprConsentEvent,
  type DsarRequest, type InsertDsarRequest,
  type RetentionPolicy, type InsertRetentionPolicy,
  type Suppression, type InsertSuppression,
  type Invite, type InsertInvite,
  type InviteLink, type InsertInviteLink,
  type Family, type InsertFamily,
  type FamilyMember, type InsertFamilyMember,
  type FamilyBusinessItem, type InsertFamilyBusinessItem,
  type FamilyLegalDoc, type InsertFamilyLegalDoc,
  type FamilyLegalItem, type InsertFamilyLegalItem,
  type FamilyInsurancePolicy, type InsertFamilyInsurancePolicy,
  type FamilyInsuranceItem, type InsertFamilyInsuranceItem,
  type FamilyTaxYear, type InsertFamilyTaxYear,
  type FamilyTaxItem, type InsertFamilyTaxItem,
  type MessageThread, type InsertMessageThread,
  type ThreadMember, type InsertThreadMember,
  type Message, type InsertMessage,
  type MessageReadReceipt, type InsertMessageReadReceipt,
  type MessageReaction, type InsertMessageReaction,
  type MessageAttachment, type InsertMessageAttachment,
  // Enhanced Upload System Types
  type UploadJob, type InsertUploadJob,
  type AnalysisResult, type InsertAnalysisResult,
  type UploadMetric, type InsertUploadMetric,
  users, organizations, plans, coupons, articles, consentEvents, auditLogs,
  adminSessions, securitySettings, impersonationSessions,
  gdprConsentEvents, dsarRequests, retentionPolicies, suppressionList,
  invites, inviteLinks, families, familyMembers, familyBusinessItems,
  familyLegalDocs, familyLegalItems, familyInsurancePolicies, familyInsuranceItems,
  familyTaxYears, familyTaxItems, messageThreads, threadMembers, messages,
  messageReadReceipts, messageReactions, messageAttachments,
  familyUpdates, familyUpdateSnooze,
  type FamilyUpdate, type InsertFamilyUpdate,
  type FamilyUpdateSnooze, type InsertFamilyUpdateSnooze,
  familyCalendarEvents, familyIceData,
  type FamilyCalendarEvent, type InsertFamilyCalendarEvent,
  type FamilyIceData, type InsertFamilyIceData,
  couples, coupleDateIdeas, coupleEvents, coupleJournal, coupleCheckins,
  type Couple, type InsertCouple,
  type CoupleDateIdea, type InsertCoupleDateIdea,
  type CoupleEvent, type InsertCoupleEvent,
  type CoupleJournalEntry, type InsertCoupleJournalEntry,
  type CoupleCheckin, type InsertCoupleCheckin
} from "@shared/schema";

// Database connection
const neonClient = neon(process.env.DATABASE_URL!);
const db = drizzle(neonClient);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  // Organization methods
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization | undefined>;
  getUserOrganizations(userId: string): Promise<Organization[]>;
  
  // Plan methods
  getAllPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan | undefined>;
  getPlanByStripeId(stripePriceId: string): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: string, updates: Partial<InsertPlan>): Promise<Plan | undefined>;
  
  // Coupon methods
  getAllCoupons(): Promise<Coupon[]>;
  getCoupon(id: string): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined>;
  incrementCouponUsage(id: string): Promise<boolean>;
  
  // Article methods
  getAllArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticlesByCategory(menuCategory: string): Promise<Article[]>;
  getArticlesByTenant(tenant: string): Promise<Article[]>;
  getArticle(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  
  // Menu category methods
  getMenuCategories(): Promise<{category: string, articles: Article[]}[]>;
  
  // Consent methods
  createConsentEvent(consent: InsertConsentEvent): Promise<ConsentEvent>;
  getConsentEvents(limit?: number): Promise<ConsentEvent[]>;
  
  // Enhanced audit log methods
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(limit?: number): Promise<AuditLog[]>;
  searchAuditLogs(query: string, limit?: number): Promise<AuditLog[]>;

  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getActiveSessions(userId?: string): Promise<AdminSession[]>;
  updateSessionActivity(sessionToken: string): Promise<void>;
  revokeSession(sessionToken: string): Promise<boolean>;

  // Security settings methods
  getSecuritySetting(key: string): Promise<SecuritySetting | undefined>;
  setSecuritySetting(key: string, value: string, updatedBy: string): Promise<SecuritySetting>;

  // Impersonation methods
  getUserById(id: string): Promise<User | undefined>;
  getActiveImpersonationSession(actorId: string): Promise<ImpersonationSession | undefined>;
  createImpersonationSession(session: InsertImpersonationSession): Promise<ImpersonationSession>;
  getImpersonationSession(sessionId: string): Promise<ImpersonationSession | undefined>;
  endImpersonationSession(sessionId: string, status: string, endReason: string): Promise<void>;
  getRecentImpersonationSessions(limit: number): Promise<ImpersonationSession[]>;
  getExpiredImpersonationSessions(): Promise<ImpersonationSession[]>;

  // GDPR Compliance methods
  // Consent Management
  createGdprConsentEvent(event: InsertGdprConsentEvent): Promise<GdprConsentEvent>;
  getGdprConsentEvents(userId?: string, limit?: number): Promise<GdprConsentEvent[]>;
  getEffectiveConsents(userId: string): Promise<{[purpose: string]: boolean}>;
  
  // DSAR Management
  createDsarRequest(request: InsertDsarRequest): Promise<DsarRequest>;
  getAllDsarRequests(status?: string): Promise<DsarRequest[]>;
  getDsarRequest(id: string): Promise<DsarRequest | undefined>;
  updateDsarRequest(id: string, updates: Partial<InsertDsarRequest>): Promise<DsarRequest | undefined>;
  getDsarRequestsByDueDate(daysFromNow: number): Promise<DsarRequest[]>;
  getDsarTimeline(id: string): Promise<Array<{
    at: Date;
    event: string;
    actor?: string;
    note?: string;
  }>>;
  addDsarTimelineEvent(dsarId: string, event: string, actor?: string, note?: string): Promise<void>;
  
  // Retention Policies
  getAllRetentionPolicies(): Promise<RetentionPolicy[]>;
  createRetentionPolicy(policy: InsertRetentionPolicy): Promise<RetentionPolicy>;
  updateRetentionPolicy(id: string, updates: Partial<InsertRetentionPolicy>): Promise<RetentionPolicy | undefined>;
  deleteRetentionPolicy(id: string): Promise<boolean>;
  
  // Suppression List
  getAllSuppressions(): Promise<Suppression[]>;
  addSuppression(suppression: InsertSuppression): Promise<Suppression>;
  removeSuppression(emailHash: string): Promise<boolean>;
  isEmailSuppressed(emailHash: string): Promise<boolean>;

  // GDPR Metrics
  getGdprMetrics(): Promise<{
    openDsars: number;
    dueSoon: number;
    consentUpdates30d: number;
    totalSuppressions: number;
  }>;

  // Family Management methods
  createFamily(family: InsertFamily): Promise<Family>;
  getFamily(id: string): Promise<Family | undefined>;
  getUserFamily(userId: string): Promise<Family | undefined>;
  updateFamily(id: string, updates: Partial<InsertFamily>): Promise<Family | undefined>;
  deleteFamily(id: string): Promise<boolean>;
  
  // Family Member methods
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  getFamilyMember(id: string): Promise<FamilyMember | undefined>;
  getFamilyMemberByEmail(email: string): Promise<FamilyMember | undefined>;
  getFamilyMembers(familyId: string): Promise<FamilyMember[]>;
  updateFamilyMember(id: string, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: string): Promise<boolean>;
  getFamilyMemberStats(familyId: string): Promise<{totalMembers: number, recentlyAdded: FamilyMember[]}>;
  
  // Family Business methods
  createFamilyBusinessItem(item: InsertFamilyBusinessItem): Promise<FamilyBusinessItem>;
  getFamilyBusinessItems(familyId: string, ownerId?: string): Promise<FamilyBusinessItem[]>;
  getFamilyBusinessItem(id: string): Promise<FamilyBusinessItem | undefined>;
  updateFamilyBusinessItem(id: string, updates: Partial<InsertFamilyBusinessItem>): Promise<FamilyBusinessItem | undefined>;
  deleteFamilyBusinessItem(id: string): Promise<boolean>;
  
  // Family Legal methods
  createFamilyLegalDoc(doc: InsertFamilyLegalDoc): Promise<FamilyLegalDoc>;
  getFamilyLegalDocs(familyId: string): Promise<FamilyLegalDoc[]>;
  getFamilyLegalDoc(id: string): Promise<FamilyLegalDoc | undefined>;
  updateFamilyLegalDoc(id: string, updates: Partial<InsertFamilyLegalDoc>): Promise<FamilyLegalDoc | undefined>;
  deleteFamilyLegalDoc(id: string): Promise<boolean>;
  
  createFamilyLegalItem(item: InsertFamilyLegalItem): Promise<FamilyLegalItem>;
  getFamilyLegalItems(familyId: string, legalDocId?: string): Promise<FamilyLegalItem[]>;
  getFamilyLegalItem(id: string): Promise<FamilyLegalItem | undefined>;
  updateFamilyLegalItem(id: string, updates: Partial<InsertFamilyLegalItem>): Promise<FamilyLegalItem | undefined>;
  deleteFamilyLegalItem(id: string): Promise<boolean>;
  
  // Family Insurance methods
  createFamilyInsurancePolicy(policy: InsertFamilyInsurancePolicy): Promise<FamilyInsurancePolicy>;
  getFamilyInsurancePolicies(familyId: string): Promise<FamilyInsurancePolicy[]>;
  getFamilyInsurancePolicy(id: string): Promise<FamilyInsurancePolicy | undefined>;
  updateFamilyInsurancePolicy(id: string, updates: Partial<InsertFamilyInsurancePolicy>): Promise<FamilyInsurancePolicy | undefined>;
  deleteFamilyInsurancePolicy(id: string): Promise<boolean>;
  
  createFamilyInsuranceItem(item: InsertFamilyInsuranceItem): Promise<FamilyInsuranceItem>;
  getFamilyInsuranceItems(familyId: string, insuranceId?: string): Promise<FamilyInsuranceItem[]>;
  getFamilyInsuranceItem(id: string): Promise<FamilyInsuranceItem | undefined>;
  updateFamilyInsuranceItem(id: string, updates: Partial<InsertFamilyInsuranceItem>): Promise<FamilyInsuranceItem | undefined>;
  deleteFamilyInsuranceItem(id: string): Promise<boolean>;
  
  // Family Tax methods
  createFamilyTaxYear(taxYear: InsertFamilyTaxYear): Promise<FamilyTaxYear>;
  getFamilyTaxYears(familyId: string): Promise<FamilyTaxYear[]>;
  getFamilyTaxYear(id: string): Promise<FamilyTaxYear | undefined>;
  updateFamilyTaxYear(id: string, updates: Partial<InsertFamilyTaxYear>): Promise<FamilyTaxYear | undefined>;
  deleteFamilyTaxYear(id: string): Promise<boolean>;
  
  createFamilyTaxItem(item: InsertFamilyTaxItem): Promise<FamilyTaxItem>;
  getFamilyTaxItems(familyId: string, taxYear?: string): Promise<FamilyTaxItem[]>;
  getFamilyTaxItem(id: string): Promise<FamilyTaxItem | undefined>;
  updateFamilyTaxItem(id: string, updates: Partial<InsertFamilyTaxItem>): Promise<FamilyTaxItem | undefined>;
  deleteFamilyTaxItem(id: string): Promise<boolean>;

  // Family Invite methods
  createInvite(invite: InsertInvite): Promise<Invite>;
  getInvite(id: string): Promise<Invite | undefined>;
  getInviteByToken(token: string): Promise<Invite | undefined>;
  getInvitesByEmail(email: string): Promise<Invite[]>;
  getUserInvites(userId: string): Promise<Invite[]>;
  updateInvite(id: string, updates: Partial<InsertInvite>): Promise<Invite | undefined>;
  revokeInvite(id: string): Promise<boolean>;
  acceptInvite(token: string): Promise<Invite | undefined>;
  
  // Invite Link methods
  createInviteLink(link: InsertInviteLink): Promise<InviteLink>;
  getInviteLink(id: string): Promise<InviteLink | undefined>;
  getInviteLinkByToken(token: string): Promise<InviteLink | undefined>;
  getUserInviteLinks(userId: string): Promise<InviteLink[]>;
  revokeInviteLink(id: string): Promise<boolean>;
  
  // Messaging methods
  getFamilyThread(familyId: string): Promise<MessageThread | undefined>;
  createMessageThread(thread: InsertMessageThread): Promise<MessageThread>;
  getUserThreads(userId: string): Promise<MessageThread[]>;
  addThreadMember(member: InsertThreadMember): Promise<ThreadMember>;
  getThreadMembers(threadId: string): Promise<ThreadMember[]>;
  getThreadMessages(threadId: string, cursor?: string, limit?: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment>;
  getMessageAttachments(messageId: string): Promise<MessageAttachment[]>;
  
  // Enhanced messaging methods
  markMessageAsRead(messageId: string, userId: string): Promise<MessageReadReceipt>;
  getMessageReadReceipts(messageId: string): Promise<MessageReadReceipt[]>;
  getUnreadMessagesCount(userId: string, threadId: string): Promise<number>;
  addMessageReaction(reaction: InsertMessageReaction): Promise<MessageReaction>;
  removeMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean>;
  getMessageReactions(messageId: string): Promise<MessageReaction[]>;
  searchMessages(userId: string, query: string, threadId?: string): Promise<Message[]>;
  
  // Advanced messaging methods for new API
  findThreadByMembers(memberIds: string[]): Promise<MessageThread | undefined>;
  createThread(data: { title: string; memberIds: string[]; createdAt: Date; updatedAt: Date }): Promise<MessageThread>;
  getThread(threadId: string): Promise<MessageThread | undefined>;
  getMessages(threadId: string, limit: number, cursor?: string): Promise<{ messages: Message[]; nextCursor?: string }>;
  updateThread(threadId: string, updates: { updatedAt: Date }): Promise<MessageThread | undefined>;
  
  // Presence methods
  updateUserLastSeen(userId: string, timestamp: Date): Promise<boolean>;

  // Family Update methods
  getFamilyUpdates(familyId: string, userId?: string): Promise<FamilyUpdate[]>;
  getFamilyUpdate(updateId: string): Promise<FamilyUpdate | undefined>;
  createFamilyUpdate(update: InsertFamilyUpdate): Promise<FamilyUpdate>;
  dismissFamilyUpdate(updateId: string, userId: string): Promise<boolean>;

  // Family Update Snooze methods
  snoozeFamilyUpdate(updateId: string, userId: string, until?: Date): Promise<FamilyUpdateSnooze>;
  unsnoozeFamilyUpdate(updateId: string, userId: string): Promise<boolean>;
  getUserSnoozedUpdates(userId: string): Promise<FamilyUpdateSnooze[]>;
  getUserSnoozedCount(userId: string): Promise<number>;

  // Calendar Events methods
  getCalendarEvents(familyId: string, from?: string, to?: string): Promise<FamilyCalendarEvent[]>;
  createCalendarEvent(event: InsertFamilyCalendarEvent): Promise<FamilyCalendarEvent>;
  getCalendarEvent(eventId: string): Promise<FamilyCalendarEvent | undefined>;
  updateCalendarEvent(eventId: string, updates: Partial<InsertFamilyCalendarEvent>): Promise<FamilyCalendarEvent | undefined>;
  deleteCalendarEvent(eventId: string): Promise<boolean>;

  // ICE Data methods  
  getFamilyICEData(familyId: string): Promise<FamilyIceData | undefined>;
  updateFamilyICEData(data: InsertFamilyIceData): Promise<FamilyIceData>;

  // Couple Connection methods
  getCoupleDateIdeas(coupleId: string): Promise<CoupleDateIdea[]>;
  createCoupleDateIdea(idea: InsertCoupleDateIdea): Promise<CoupleDateIdea>;
  updateCoupleDateIdeaRanking(ideaId: string, userId: string, ranking: number): Promise<boolean>;
  
  getCoupleEvents(coupleId: string): Promise<CoupleEvent[]>;
  createCoupleEvent(event: InsertCoupleEvent): Promise<CoupleEvent>;
  
  getCoupleJournalEntries(coupleId: string): Promise<CoupleJournalEntry[]>;
  createCoupleJournalEntry(entry: InsertCoupleJournalEntry): Promise<CoupleJournalEntry>;
  
  getCoupleCheckins(coupleId: string): Promise<CoupleCheckin[]>;
  createCoupleCheckin(checkin: InsertCoupleCheckin): Promise<CoupleCheckin>;

  // Enhanced Upload System methods
  createUploadJob(job: InsertUploadJob): Promise<UploadJob>;
  getUploadJob(jobId: string): Promise<UploadJob | undefined>;
  getUploadJobsByFamily(familyId: string): Promise<UploadJob[]>;
  getUploadJobsByUser(userId: string): Promise<UploadJob[]>;
  updateUploadJob(jobId: string, updates: Partial<InsertUploadJob>): Promise<UploadJob | undefined>;
  updateUploadProgress(jobId: string, progress: number, stage?: string): Promise<boolean>;
  deleteUploadJob(jobId: string): Promise<boolean>;
  
  // Analysis Results methods
  createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResults(uploadJobId: string): Promise<AnalysisResult[]>;
  getAnalysisResultsWithConfidence(uploadJobId: string, minConfidence: number): Promise<AnalysisResult[]>;
  deleteAnalysisResults(uploadJobId: string): Promise<boolean>;
  
  // Upload Metrics methods  
  createUploadMetric(metric: InsertUploadMetric): Promise<UploadMetric>;
  getUploadMetrics(uploadJobId: string): Promise<UploadMetric[]>;
  getSystemMetrics(): Promise<{
    totalUploads: number;
    completedUploads: number;
    avgProcessingTime: number;
    avgUploadTime: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: UpsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Organization methods
  async getOrganization(id: string): Promise<Organization | undefined> {
    const result = await db.select().from(organizations).where(eq(organizations.id, id)).limit(1);
    return result[0];
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const result = await db.insert(organizations).values(org).returning();
    return result[0];
  }

  async updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const result = await db.update(organizations).set(updates).where(eq(organizations.id, id)).returning();
    return result[0];
  }

  async getUserOrganizations(userId: string): Promise<Organization[]> {
    return await db.select().from(organizations).where(eq(organizations.ownerId, userId));
  }

  // Plan methods
  async getAllPlans(): Promise<Plan[]> {
    return await db.select().from(plans).orderBy(desc(plans.createdAt));
  }

  async getPlan(id: string): Promise<Plan | undefined> {
    const result = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
    return result[0];
  }

  async getPlanByStripeId(stripePriceId: string): Promise<Plan | undefined> {
    const result = await db.select().from(plans).where(eq(plans.stripePriceId, stripePriceId)).limit(1);
    return result[0];
  }

  async createPlan(plan: InsertPlan): Promise<Plan> {
    const result = await db.insert(plans).values(plan).returning();
    return result[0];
  }

  async updatePlan(id: string, updates: Partial<InsertPlan>): Promise<Plan | undefined> {
    const result = await db.update(plans).set(updates).where(eq(plans.id, id)).returning();
    return result[0];
  }

  // Coupon methods
  async getAllCoupons(): Promise<Coupon[]> {
    return await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async getCoupon(id: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
    return result[0];
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const result = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    return result[0];
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const result = await db.insert(coupons).values(coupon).returning();
    return result[0];
  }

  async updateCoupon(id: string, updates: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const result = await db.update(coupons).set(updates).where(eq(coupons.id, id)).returning();
    return result[0];
  }

  async incrementCouponUsage(id: string): Promise<boolean> {
    const result = await db.update(coupons)
      .set({ timesRedeemed: sql`${coupons.timesRedeemed} + 1` })
      .where(eq(coupons.id, id));
    return result.rowCount > 0;
  }

  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getPublishedArticles(): Promise<Article[]> {
    return await db.select().from(articles)
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt));
  }

  async getArticlesByCategory(menuCategory: string): Promise<Article[]> {
    return await db.select().from(articles)
      .where(eq(articles.menuCategory, menuCategory as any))
      .orderBy(desc(articles.createdAt));
  }

  async getArticlesByTenant(tenant: string): Promise<Article[]> {
    return await db.select().from(articles)
      .where(eq(articles.tenant, tenant as any))
      .orderBy(desc(articles.createdAt));
  }

  async getMenuCategories(): Promise<{category: string, articles: Article[]}[]> {
    const allArticles = await this.getPublishedArticles();
    const categories = [
      "Child Information", "Disaster Planning", "Elderly Parents", "Estate Planning",
      "Getting Married", "Home Buying", "International Travel", "Starting a Family",
      "Moving", "When Someone Dies", "Digital Security", "Neurodiversity"
    ];
    
    return categories.map(category => ({
      category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      articles: allArticles.filter(article => article.menuCategory === category)
    }));
  }

  async getArticle(id: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return result[0];
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0];
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article).returning();
    return result[0];
  }

  async updateArticle(id: string, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const result = await db.update(articles).set(updates).where(eq(articles.id, id)).returning();
    return result[0];
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount > 0;
  }

  // Consent methods
  async createConsentEvent(consent: InsertConsentEvent): Promise<ConsentEvent> {
    const result = await db.insert(consentEvents).values(consent).returning();
    return result[0];
  }

  async getConsentEvents(limit: number = 500): Promise<ConsentEvent[]> {
    return await db.select().from(consentEvents)
      .orderBy(desc(consentEvents.createdAt))
      .limit(limit);
  }

  // Enhanced audit log methods
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    // Add required tamperHash field with a simple hash
    const logWithHash = {
      ...log,
      tamperHash: Math.random().toString(36).substring(2, 15)
    };
    const result = await db.insert(auditLogs).values(logWithHash).returning();
    return result[0];
  }

  async getAuditLogs(limit: number = 500): Promise<AuditLog[]> {
    return await db.select().from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  async searchAuditLogs(query: string, limit: number = 100): Promise<AuditLog[]> {
    return await db.select().from(auditLogs)
      .where(
        or(
          ilike(auditLogs.action, `%${query}%`),
          ilike(auditLogs.resource, `%${query}%`),
          ilike(auditLogs.actorId, `%${query}%`)
        )
      )
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
  }

  // Admin session methods
  async createAdminSession(session: InsertAdminSession): Promise<AdminSession> {
    const result = await db.insert(adminSessions).values(session).returning();
    return result[0];
  }

  async getActiveSessions(userId?: string): Promise<AdminSession[]> {
    if (userId) {
      return await db.select().from(adminSessions)
        .where(sql`${adminSessions.isActive} = true AND ${adminSessions.userId} = ${userId}`)
        .orderBy(desc(adminSessions.lastActivity));
    } else {
      return await db.select().from(adminSessions)
        .where(eq(adminSessions.isActive, true))
        .orderBy(desc(adminSessions.lastActivity));
    }
  }

  async updateSessionActivity(sessionToken: string): Promise<void> {
    await db.update(adminSessions)
      .set({ lastActivity: new Date() })
      .where(eq(adminSessions.sessionToken, sessionToken));
  }

  async revokeSession(sessionToken: string): Promise<boolean> {
    const result = await db.update(adminSessions)
      .set({ isActive: false })
      .where(eq(adminSessions.sessionToken, sessionToken));
    return result.rowCount > 0;
  }

  // Security settings methods
  async getSecuritySetting(key: string): Promise<SecuritySetting | undefined> {
    const result = await db.select().from(securitySettings)
      .where(eq(securitySettings.settingKey, key))
      .limit(1);
    return result[0];
  }

  async setSecuritySetting(key: string, value: string, updatedBy: string): Promise<SecuritySetting> {
    const existing = await this.getSecuritySetting(key);
    
    if (existing) {
      const result = await db.update(securitySettings)
        .set({ 
          settingValue: value, 
          lastUpdated: new Date(),
          updatedBy 
        })
        .where(eq(securitySettings.settingKey, key))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(securitySettings)
        .values({ 
          settingKey: key, 
          settingValue: value, 
          updatedBy 
        })
        .returning();
      return result[0];
    }
  }

  // Impersonation methods
  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id); // Use existing getUser method
  }

  async getActiveImpersonationSession(actorId: string): Promise<ImpersonationSession | undefined> {
    const result = await db.select().from(impersonationSessions)
      .where(and(
        eq(impersonationSessions.actorId, actorId),
        eq(impersonationSessions.status, 'active')
      ))
      .limit(1);
    return result[0];
  }

  async createImpersonationSession(session: InsertImpersonationSession): Promise<ImpersonationSession> {
    const result = await db.insert(impersonationSessions).values(session).returning();
    return result[0];
  }

  async getImpersonationSession(sessionId: string): Promise<ImpersonationSession | undefined> {
    const result = await db.select().from(impersonationSessions)
      .where(eq(impersonationSessions.id, sessionId))
      .limit(1);
    return result[0];
  }

  async endImpersonationSession(sessionId: string, status: string, endReason: string): Promise<void> {
    await db.update(impersonationSessions)
      .set({ 
        status: status as any,
        endedAt: new Date(),
        endReason 
      })
      .where(eq(impersonationSessions.id, sessionId));
  }

  async getRecentImpersonationSessions(limit: number): Promise<ImpersonationSession[]> {
    return await db.select().from(impersonationSessions)
      .orderBy(desc(impersonationSessions.createdAt))
      .limit(limit);
  }

  async getExpiredImpersonationSessions(): Promise<ImpersonationSession[]> {
    return await db.select().from(impersonationSessions)
      .where(and(
        eq(impersonationSessions.status, 'active'),
        sql`${impersonationSessions.expiresAt} < NOW()`
      ));
  }

  // GDPR Compliance methods
  // Consent Management
  async createGdprConsentEvent(event: InsertGdprConsentEvent): Promise<GdprConsentEvent> {
    const result = await db.insert(gdprConsentEvents).values(event).returning();
    return result[0];
  }

  async getGdprConsentEvents(userId?: string, limit: number = 500): Promise<GdprConsentEvent[]> {
    const query = db.select().from(gdprConsentEvents);
    
    if (userId) {
      return await query
        .where(eq(gdprConsentEvents.userId, userId))
        .orderBy(desc(gdprConsentEvents.occurredAt))
        .limit(limit);
    } else {
      return await query
        .orderBy(desc(gdprConsentEvents.occurredAt))
        .limit(limit);
    }
  }

  async getEffectiveConsents(userId: string): Promise<{[purpose: string]: boolean}> {
    const events = await db.select().from(gdprConsentEvents)
      .where(eq(gdprConsentEvents.userId, userId))
      .orderBy(desc(gdprConsentEvents.occurredAt));
    
    const effective: {[purpose: string]: boolean} = {};
    events.forEach(event => {
      if (!effective.hasOwnProperty(event.purpose)) {
        effective[event.purpose] = event.status === 'granted';
      }
    });
    
    return effective;
  }

  // DSAR Management
  async createDsarRequest(request: InsertDsarRequest): Promise<DsarRequest> {
    const result = await db.insert(dsarRequests).values(request).returning();
    return result[0];
  }

  async getAllDsarRequests(status?: string): Promise<DsarRequest[]> {
    const query = db.select().from(dsarRequests);
    
    if (status) {
      return await query
        .where(eq(dsarRequests.status, status as any))
        .orderBy(desc(dsarRequests.createdAt));
    } else {
      return await query.orderBy(desc(dsarRequests.createdAt));
    }
  }

  async getDsarRequest(id: string): Promise<DsarRequest | undefined> {
    const result = await db.select().from(dsarRequests)
      .where(eq(dsarRequests.id, id))
      .limit(1);
    return result[0];
  }

  async updateDsarRequest(id: string, updates: Partial<InsertDsarRequest>): Promise<DsarRequest | undefined> {
    const result = await db.update(dsarRequests)
      .set(updates)
      .where(eq(dsarRequests.id, id))
      .returning();
    return result[0];
  }

  async getDsarRequestsByDueDate(daysFromNow: number): Promise<DsarRequest[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysFromNow);
    
    return await db.select().from(dsarRequests)
      .where(sql`${dsarRequests.dueAt} <= ${cutoffDate.toISOString()} AND ${dsarRequests.status} NOT IN ('completed', 'rejected')`)
      .orderBy(dsarRequests.dueAt);
  }

  // Retention Policies
  async getAllRetentionPolicies(): Promise<RetentionPolicy[]> {
    return await db.select().from(retentionPolicies)
      .orderBy(retentionPolicies.dataset);
  }

  async createRetentionPolicy(policy: InsertRetentionPolicy): Promise<RetentionPolicy> {
    const result = await db.insert(retentionPolicies).values(policy).returning();
    return result[0];
  }

  async updateRetentionPolicy(id: string, updates: Partial<InsertRetentionPolicy>): Promise<RetentionPolicy | undefined> {
    const result = await db.update(retentionPolicies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(retentionPolicies.id, id))
      .returning();
    return result[0];
  }

  async deleteRetentionPolicy(id: string): Promise<boolean> {
    const result = await db.delete(retentionPolicies)
      .where(eq(retentionPolicies.id, id));
    return result.rowCount > 0;
  }

  // Suppression List
  async getAllSuppressions(): Promise<Suppression[]> {
    return await db.select().from(suppressionList)
      .orderBy(desc(suppressionList.addedAt));
  }

  async addSuppression(suppression: InsertSuppression): Promise<Suppression> {
    const result = await db.insert(suppressionList).values(suppression).returning();
    return result[0];
  }

  async removeSuppression(emailHash: string): Promise<boolean> {
    const result = await db.delete(suppressionList)
      .where(eq(suppressionList.emailHash, emailHash));
    return result.rowCount > 0;
  }

  async isEmailSuppressed(emailHash: string): Promise<boolean> {
    const result = await db.select().from(suppressionList)
      .where(eq(suppressionList.emailHash, emailHash))
      .limit(1);
    return result.length > 0;
  }

  // DSAR Timeline methods
  async getDsarTimeline(id: string): Promise<Array<{
    at: Date;
    event: string;
    actor?: string;
    note?: string;
  }>> {
    // For now, we'll create a simple timeline based on the DSAR status changes
    // In a real implementation, you'd have a separate timeline table
    const dsar = await this.getDsarRequest(id);
    if (!dsar) return [];

    const timeline = [
      {
        at: dsar.openedAt,
        event: 'Request opened',
        actor: 'System',
        note: `Type: ${dsar.type}`
      }
    ];

    if (dsar.status !== 'open') {
      timeline.push({
        at: dsar.closedAt || dsar.openedAt,
        event: `Status changed to ${dsar.status}`,
        actor: 'Admin',
        note: dsar.notes ?? undefined
      });
    }

    return timeline.sort((a, b) => b.at.getTime() - a.at.getTime());
  }

  async addDsarTimelineEvent(dsarId: string, event: string, actor?: string, note?: string): Promise<void> {
    // For now, this is a no-op since we don't have a timeline table
    // In a real implementation, you'd insert into a timeline table
    console.log(`Timeline event for ${dsarId}: ${event} by ${actor || 'System'} - ${note || ''}`);
  }

  // GDPR Metrics
  async getGdprMetrics(): Promise<{
    openDsars: number;
    dueSoon: number;
    consentUpdates30d: number;
    totalSuppressions: number;
  }> {
    const [openDsars, dueSoon, consentUpdates30d, totalSuppressions] = await Promise.all([
      // Open DSARs
      db.select({ count: sql<number>`count(*)` }).from(dsarRequests)
        .where(sql`${dsarRequests.status} != 'completed' AND ${dsarRequests.status} != 'rejected'`),
      
      // Due soon (next 7 days)
      db.select({ count: sql<number>`count(*)` }).from(dsarRequests)
        .where(sql`${dsarRequests.dueAt} <= NOW() + INTERVAL '7 days' AND ${dsarRequests.status} != 'completed' AND ${dsarRequests.status} != 'rejected'`),
      
      // Consent updates in last 30 days
      db.select({ count: sql<number>`count(*)` }).from(gdprConsentEvents)
        .where(sql`${gdprConsentEvents.occurredAt} >= NOW() - INTERVAL '30 days'`),
      
      // Total suppressions
      db.select({ count: sql<number>`count(*)` }).from(suppressionList)
    ]);

    return {
      openDsars: openDsars[0]?.count || 0,
      dueSoon: dueSoon[0]?.count || 0,
      consentUpdates30d: consentUpdates30d[0]?.count || 0,
      totalSuppressions: totalSuppressions[0]?.count || 0,
    };
  }

  // Family Invite methods
  async createInvite(invite: InsertInvite): Promise<Invite> {
    const result = await db.insert(invites).values(invite).returning();
    return result[0];
  }

  async getInvite(id: string): Promise<Invite | undefined> {
    const result = await db.select().from(invites).where(eq(invites.id, id)).limit(1);
    return result[0];
  }

  async getInviteByToken(token: string): Promise<Invite | undefined> {
    const result = await db.select().from(invites).where(eq(invites.token, token)).limit(1);
    return result[0];
  }

  async getInvitesByEmail(email: string): Promise<Invite[]> {
    return await db.select().from(invites).where(eq(invites.email, email)).orderBy(desc(invites.createdAt));
  }

  async getUserInvites(userId: string): Promise<Invite[]> {
    return await db.select().from(invites).where(eq(invites.invitedByUserId, userId)).orderBy(desc(invites.createdAt));
  }

  async updateInvite(id: string, updates: Partial<InsertInvite>): Promise<Invite | undefined> {
    const result = await db.update(invites).set(updates).where(eq(invites.id, id)).returning();
    return result[0];
  }

  async revokeInvite(id: string): Promise<boolean> {
    const result = await db.update(invites)
      .set({ status: 'revoked' })
      .where(eq(invites.id, id));
    return result.rowCount > 0;
  }

  async acceptInvite(token: string): Promise<Invite | undefined> {
    const result = await db.update(invites)
      .set({ status: 'accepted', acceptedAt: new Date() })
      .where(eq(invites.token, token))
      .returning();
    return result[0];
  }

  // Family Member methods
  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const result = await db.insert(familyMembers).values(member).returning();
    return result[0];
  }

  async getFamilyMember(id: string): Promise<FamilyMember | undefined> {
    const result = await db.select().from(familyMembers).where(eq(familyMembers.id, id)).limit(1);
    return result[0];
  }

  async getFamilyMemberByEmail(email: string): Promise<FamilyMember | undefined> {
    if (!email) return undefined;
    const result = await db.select().from(familyMembers).where(eq(familyMembers.email, email)).limit(1);
    return result[0];
  }

  async getAllFamilyMembers(): Promise<FamilyMember[]> {
    return await db.select().from(familyMembers).orderBy(desc(familyMembers.createdAt));
  }

  async updateFamilyMember(id: string, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined> {
    const result = await db.update(familyMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(familyMembers.id, id))
      .returning();
    return result[0];
  }

  async deleteFamilyMember(id: string): Promise<boolean> {
    const result = await db.delete(familyMembers).where(eq(familyMembers.id, id));
    return result.rowCount > 0;
  }

  // Invite Link methods
  async createInviteLink(link: InsertInviteLink): Promise<InviteLink> {
    const result = await db.insert(inviteLinks).values(link).returning();
    return result[0];
  }

  async getInviteLink(id: string): Promise<InviteLink | undefined> {
    const result = await db.select().from(inviteLinks).where(eq(inviteLinks.id, id)).limit(1);
    return result[0];
  }

  async getInviteLinkByToken(token: string): Promise<InviteLink | undefined> {
    const result = await db.select().from(inviteLinks).where(eq(inviteLinks.token, token)).limit(1);
    return result[0];
  }

  async getUserInviteLinks(userId: string): Promise<InviteLink[]> {
    return await db.select().from(inviteLinks).where(eq(inviteLinks.createdByUserId, userId)).orderBy(desc(inviteLinks.createdAt));
  }

  async revokeInviteLink(id: string): Promise<boolean> {
    const result = await db.delete(inviteLinks).where(eq(inviteLinks.id, id));
    return result.rowCount > 0;
  }

  // Temporary implementations for family management (until full implementation)
  async createFamily(family: InsertFamily): Promise<Family> {
    // Temporary mock implementation
    return {
      id: "family-1",
      name: family.name,
      ownerId: family.ownerId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getUserFamily(userId: string): Promise<Family | undefined> {
    // Temporary mock implementation
    return {
      id: "family-1",
      name: "Johnson Family",
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    // Temporary mock implementation
    return [
      {
        id: "member-1",
        familyId: familyId,
        name: "John Smith",
        email: "john@example.com",
        phone: "(555) 123-4567",
        dateOfBirth: new Date("1990-01-01"),
        relationshipToOwner: "self",
        role: "owner",
        avatarColor: "#3498DB",
        itemCount: 5,
        emergencyContact: false,
        profileImageUrl: null,
        address: null,
        medicalInfo: null,
        identificationInfo: null,
        userId: "user-1",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "member-2",
        familyId: familyId,
        name: "Angel Quintana",
        email: "angel@example.com",
        phone: "(555) 123-4568",
        dateOfBirth: new Date("1992-05-15"),
        relationshipToOwner: "spouse",
        role: "member",
        avatarColor: "#E74C3C",
        itemCount: 3,
        emergencyContact: true,
        profileImageUrl: null,
        address: null,
        medicalInfo: null,
        identificationInfo: null,
        userId: "user-2",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getFamilyMemberStats(familyId: string): Promise<{totalMembers: number, recentlyAdded: FamilyMember[]}> {
    const members = await this.getFamilyMembers(familyId);
    return {
      totalMembers: members.length,
      recentlyAdded: members.slice(0, 3)
    };
  }

  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    // Temporary mock implementation
    return {
      id: "new-member-" + Date.now(),
      ...member,
      avatarColor: member.avatarColor || "#3498DB",
      itemCount: member.itemCount || 0,
      emergencyContact: member.emergencyContact || false,
      isActive: member.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getFamilyBusinessItems(familyId: string, ownerId?: string): Promise<FamilyBusinessItem[]> {
    // Temporary mock implementation
    return [];
  }

  async createFamilyBusinessItem(item: InsertFamilyBusinessItem): Promise<FamilyBusinessItem> {
    // Temporary mock implementation
    return {
      id: "business-" + Date.now(),
      ...item,
      docCount: item.docCount || 0,
      tags: item.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getFamilyLegalItems(familyId: string, legalDocId?: string): Promise<FamilyLegalItem[]> {
    // Temporary mock implementation
    return [];
  }

  async getFamilyInsuranceItems(familyId: string, insuranceId?: string): Promise<FamilyInsuranceItem[]> {
    // Temporary mock implementation
    return [];
  }

  async getFamilyTaxItems(familyId: string, taxYear?: string): Promise<FamilyTaxItem[]> {
    // Temporary mock implementation
    return [];
  }

  async getFamily(id: string): Promise<Family | undefined> {
    // Temporary mock implementation
    return {
      id: id,
      name: "Johnson Family",
      ownerId: "user-1",
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Messaging implementations
  async getFamilyThread(familyId: string): Promise<MessageThread | undefined> {
    const result = await db.select().from(messageThreads)
      .where(eq(messageThreads.familyId, familyId) && eq(messageThreads.kind, "family"))
      .limit(1);
    return result[0];
  }

  async createMessageThread(thread: InsertMessageThread): Promise<MessageThread> {
    const result = await db.insert(messageThreads).values(thread).returning();
    return result[0];
  }

  async getUserThreads(userId: string): Promise<MessageThread[]> {
    const result = await db.select()
      .from(messageThreads)
      .innerJoin(threadMembers, eq(messageThreads.id, threadMembers.threadId))
      .where(eq(threadMembers.userId, userId))
      .orderBy(desc(messageThreads.updatedAt));
    return result.map(row => row.message_threads);
  }

  async addThreadMember(member: InsertThreadMember): Promise<ThreadMember> {
    const result = await db.insert(threadMembers).values(member).returning();
    return result[0];
  }

  async getThreadMembers(threadId: string): Promise<ThreadMember[]> {
    const result = await db.select().from(threadMembers).where(eq(threadMembers.threadId, threadId));
    return result;
  }

  async getThreadMessages(threadId: string, cursor?: string, limit: number = 50): Promise<any[]> {
    let query = db.select().from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(desc(messages.createdAt));

    if (cursor) {
      query = query.where(eq(messages.id, cursor));
    }

    const messageList = await query.limit(limit);
    
    // Fetch attachments for each message
    const messagesWithAttachments = await Promise.all(
      messageList.map(async (message) => {
        const attachments = await this.getMessageAttachments(message.id);
        return {
          ...message,
          attachments
        };
      })
    );

    return messagesWithAttachments;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment> {
    const result = await db.insert(messageAttachments).values(attachment).returning();
    return result[0];
  }

  async getMessageAttachments(messageId: string): Promise<MessageAttachment[]> {
    const result = await db.select().from(messageAttachments).where(eq(messageAttachments.messageId, messageId));
    return result;
  }

  // Advanced messaging methods for new API
  async findThreadByMembers(memberIds: string[]): Promise<MessageThread | undefined> {
    // For now, assume family thread - in production, implement proper member matching
    const result = await db.select().from(messageThreads)
      .where(eq(messageThreads.kind, "family"))
      .limit(1);
    return result[0];
  }

  async createThread(data: { title: string; memberIds: string[]; createdAt: Date; updatedAt: Date }): Promise<MessageThread> {
    const thread = await db.insert(messageThreads).values({
      kind: "family",
      title: data.title,
      familyId: "family-1", // TODO: Get from user context
      createdBy: "me", // TODO: Get from user context
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }).returning();

    // Add members to thread
    for (const memberId of data.memberIds) {
      await db.insert(threadMembers).values({
        threadId: thread[0].id,
        userId: memberId,
        role: "member"
      });
    }

    return thread[0];
  }

  async getThread(threadId: string): Promise<MessageThread | undefined> {
    const result = await db.select().from(messageThreads)
      .where(eq(messageThreads.id, threadId))
      .limit(1);
    return result[0];
  }

  async getMessages(threadId: string, limit: number, cursor?: string): Promise<{ messages: Message[]; nextCursor?: string }> {
    let query = db.select().from(messages)
      .where(eq(messages.threadId, threadId))
      .orderBy(desc(messages.createdAt))
      .limit(limit + 1); // Get one extra to determine if there's a next page

    const result = await query;
    const hasMore = result.length > limit;
    const messageList = hasMore ? result.slice(0, limit) : result;
    const nextCursor = hasMore ? result[limit - 1].id : undefined;

    return { messages: messageList, nextCursor };
  }

  async updateThread(threadId: string, updates: { updatedAt: Date }): Promise<MessageThread | undefined> {
    const result = await db.update(messageThreads)
      .set(updates)
      .where(eq(messageThreads.id, threadId))
      .returning();
    return result[0];
  }

  // Enhanced messaging methods
  async markMessageAsRead(messageId: string, userId: string): Promise<MessageReadReceipt> {
    const result = await db.insert(messageReadReceipts)
      .values({ messageId, userId })
      .onConflictDoUpdate({
        target: [messageReadReceipts.messageId, messageReadReceipts.userId],
        set: { readAt: sql`NOW()` }
      })
      .returning();
    return result[0];
  }

  async getMessageReadReceipts(messageId: string): Promise<MessageReadReceipt[]> {
    return await db.select()
      .from(messageReadReceipts)
      .where(eq(messageReadReceipts.messageId, messageId));
  }

  async getUnreadMessagesCount(userId: string, threadId: string): Promise<number> {
    const result = await db.select({
      count: sql<number>`count(*)`
    }).from(messages)
      .leftJoin(messageReadReceipts, 
        sql`${messages.id} = ${messageReadReceipts.messageId} AND ${messageReadReceipts.userId} = ${userId}`)
      .where(sql`${messages.threadId} = ${threadId} 
                 AND ${messages.authorId} != ${userId} 
                 AND ${messageReadReceipts.id} IS NULL`);
    
    return result[0]?.count || 0;
  }

  async addMessageReaction(reaction: InsertMessageReaction): Promise<MessageReaction> {
    const result = await db.insert(messageReactions)
      .values(reaction)
      .onConflictDoUpdate({
        target: [messageReactions.messageId, messageReactions.userId, messageReactions.emoji],
        set: { createdAt: sql`NOW()` }
      })
      .returning();
    return result[0];
  }

  async removeMessageReaction(messageId: string, userId: string, emoji: string): Promise<boolean> {
    const result = await db.delete(messageReactions)
      .where(sql`${messageReactions.messageId} = ${messageId} 
                 AND ${messageReactions.userId} = ${userId} 
                 AND ${messageReactions.emoji} = ${emoji}`);
    return result.changes > 0;
  }

  async getMessageReactions(messageId: string): Promise<MessageReaction[]> {
    return await db.select()
      .from(messageReactions)
      .where(eq(messageReactions.messageId, messageId))
      .orderBy(messageReactions.createdAt);
  }

  async searchMessages(userId: string, query: string, threadId?: string): Promise<Message[]> {
    let dbQuery = db.select()
      .from(messages)
      .innerJoin(threadMembers, eq(messages.threadId, threadMembers.threadId))
      .where(sql`${threadMembers.userId} = ${userId} 
                 AND ${messages.body} ILIKE ${`%${query}%`}
                 AND ${messages.deletedAt} IS NULL`);

    if (threadId) {
      dbQuery = dbQuery.where(eq(messages.threadId, threadId));
    }

    const result = await dbQuery
      .orderBy(desc(messages.createdAt))
      .limit(50);

    return result.map(row => row.messages);
  }

  // Presence methods
  async updateUserLastSeen(userId: string, timestamp: Date): Promise<boolean> {
    try {
      await db.update(users)
        .set({ lastSeenAt: timestamp })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Failed to update lastSeenAt:", error);
      return false;
    }
  }

  // Family Update methods
  async getFamilyUpdates(familyId: string, userId?: string): Promise<FamilyUpdate[]> {
    try {
      let query = db.select().from(familyUpdates)
        .where(and(
          eq(familyUpdates.familyId, familyId),
          eq(familyUpdates.isDismissed, false)
        ))
        .orderBy(desc(familyUpdates.createdAt));

      // If userId is provided, exclude snoozed updates for this user
      if (userId) {
        const snoozedIds = await db.select({
          updateId: familyUpdateSnooze.updateId
        }).from(familyUpdateSnooze)
        .where(and(
          eq(familyUpdateSnooze.userId, userId),
          sql`${familyUpdateSnooze.until} > NOW()`
        ));

        if (snoozedIds.length > 0) {
          const snoozedUpdateIds = snoozedIds.map(s => s.updateId);
          query = db.select().from(familyUpdates)
            .where(and(
              eq(familyUpdates.familyId, familyId),
              eq(familyUpdates.isDismissed, false),
              not(inArray(familyUpdates.id, snoozedUpdateIds))
            ))
            .orderBy(desc(familyUpdates.createdAt));
        }
      }

      return await query;
    } catch (error) {
      console.error('Error fetching family updates:', error);
      return [];
    }
  }

  async getFamilyUpdate(updateId: string): Promise<FamilyUpdate | undefined> {
    try {
      const [result] = await db.select().from(familyUpdates)
        .where(eq(familyUpdates.id, updateId))
        .limit(1);
      return result;
    } catch (error) {
      console.error('Error fetching family update:', error);
      return undefined;
    }
  }

  async createFamilyUpdate(update: InsertFamilyUpdate): Promise<FamilyUpdate> {
    const [result] = await db.insert(familyUpdates).values(update).returning();
    return result;
  }

  async dismissFamilyUpdate(updateId: string, userId: string): Promise<boolean> {
    try {
      await db.update(familyUpdates)
        .set({ 
          isDismissed: true,
          dismissedBy: userId,
          dismissedAt: new Date()
        })
        .where(eq(familyUpdates.id, updateId));
      return true;
    } catch (error) {
      console.error('Error dismissing family update:', error);
      return false;
    }
  }

  // Family Update Snooze methods
  async snoozeFamilyUpdate(updateId: string, userId: string, until?: Date): Promise<FamilyUpdateSnooze> {
    // If no until date provided, use update's dueAt or default to 7 days from now
    let snoozeUntil = until;
    
    if (!snoozeUntil) {
      const [update] = await db.select().from(familyUpdates).where(eq(familyUpdates.id, updateId));
      if (update?.dueAt) {
        snoozeUntil = new Date(update.dueAt);
      } else {
        // Default to 7 days from now
        snoozeUntil = new Date();
        snoozeUntil.setDate(snoozeUntil.getDate() + 7);
      }
    }

    // Check if snooze already exists and update it, or create new one
    const existingSnooze = await db.select()
      .from(familyUpdateSnooze)
      .where(and(
        eq(familyUpdateSnooze.updateId, updateId),
        eq(familyUpdateSnooze.userId, userId)
      ))
      .limit(1);

    if (existingSnooze.length > 0) {
      // Update existing snooze
      const [result] = await db.update(familyUpdateSnooze)
        .set({ until: snoozeUntil })
        .where(and(
          eq(familyUpdateSnooze.updateId, updateId),
          eq(familyUpdateSnooze.userId, userId)
        ))
        .returning();
      return result;
    } else {
      // Create new snooze
      const [result] = await db.insert(familyUpdateSnooze)
        .values({
          updateId,
          userId,
          until: snoozeUntil
        })
        .returning();
      return result;
    }
  }

  async unsnoozeFamilyUpdate(updateId: string, userId: string): Promise<boolean> {
    try {
      await db.delete(familyUpdateSnooze)
        .where(and(
          eq(familyUpdateSnooze.updateId, updateId),
          eq(familyUpdateSnooze.userId, userId)
        ));
      return true;
    } catch (error) {
      console.error('Error unsnoozing family update:', error);
      return false;
    }
  }

  async getUserSnoozedUpdates(userId: string): Promise<FamilyUpdateSnooze[]> {
    try {
      return await db.select()
        .from(familyUpdateSnooze)
        .where(and(
          eq(familyUpdateSnooze.userId, userId),
          sql`${familyUpdateSnooze.until} > NOW()`
        ))
        .orderBy(desc(familyUpdateSnooze.createdAt));
    } catch (error) {
      console.error('Error getting user snoozed updates:', error);
      return [];
    }
  }

  async getUserSnoozedCount(userId: string): Promise<number> {
    try {
      const result = await db.select({ count: sql<number>`count(*)` })
        .from(familyUpdateSnooze)
        .where(and(
          eq(familyUpdateSnooze.userId, userId),
          sql`${familyUpdateSnooze.until} > NOW()`
        ));
      
      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting user snoozed count:', error);
      return 0;
    }
  }

  // Calendar Events methods
  async getCalendarEvents(familyId: string, from?: string, to?: string): Promise<FamilyCalendarEvent[]> {
    try {
      let query = db.select().from(familyCalendarEvents)
        .where(eq(familyCalendarEvents.familyId, familyId));

      if (from && to) {
        query = query.where(and(
          eq(familyCalendarEvents.familyId, familyId),
          sql`${familyCalendarEvents.startDate} >= ${from}`,
          sql`${familyCalendarEvents.startDate} <= ${to}`
        ));
      }

      return await query.orderBy(familyCalendarEvents.startDate);
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  }

  async createCalendarEvent(event: InsertFamilyCalendarEvent): Promise<FamilyCalendarEvent> {
    const [result] = await db.insert(familyCalendarEvents).values(event).returning();
    return result;
  }

  async getCalendarEvent(eventId: string): Promise<FamilyCalendarEvent | undefined> {
    const result = await db.select().from(familyCalendarEvents)
      .where(eq(familyCalendarEvents.id, eventId)).limit(1);
    return result[0];
  }

  async updateCalendarEvent(eventId: string, updates: Partial<InsertFamilyCalendarEvent>): Promise<FamilyCalendarEvent | undefined> {
    const [result] = await db.update(familyCalendarEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(familyCalendarEvents.id, eventId))
      .returning();
    return result;
  }

  async deleteCalendarEvent(eventId: string): Promise<boolean> {
    try {
      await db.delete(familyCalendarEvents).where(eq(familyCalendarEvents.id, eventId));
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  // ICE Data methods
  async getFamilyICEData(familyId: string): Promise<FamilyIceData | undefined> {
    try {
      const result = await db.select().from(familyIceData)
        .where(eq(familyIceData.familyId, familyId)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting family ICE data:', error);
      return undefined;
    }
  }

  async updateFamilyICEData(data: InsertFamilyIceData): Promise<FamilyIceData> {
    try {
      // Check if ICE data exists for this family
      const existing = await this.getFamilyICEData(data.familyId);
      
      if (existing) {
        // Update existing record
        const [result] = await db.update(familyIceData)
          .set({ 
            emergencyContacts: data.emergencyContacts,
            medicalInfo: data.medicalInfo,
            bloodTypes: data.bloodTypes,
            additionalNotes: data.additionalNotes,
            lastUpdatedBy: data.lastUpdatedBy,
            updatedAt: new Date()
          })
          .where(eq(familyIceData.familyId, data.familyId))
          .returning();
        return result;
      } else {
        // Create new record
        const [result] = await db.insert(familyIceData).values(data).returning();
        return result;
      }
    } catch (error) {
      console.error('Error updating family ICE data:', error);
      throw error;
    }
  }

  // Couple Connection methods
  async getCoupleDateIdeas(coupleId: string): Promise<CoupleDateIdea[]> {
    try {
      const result = await db.select().from(coupleDateIdeas)
        .where(eq(coupleDateIdeas.coupleId, coupleId))
        .orderBy(desc(coupleDateIdeas.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting couple date ideas:', error);
      return [];
    }
  }

  async createCoupleDateIdea(idea: InsertCoupleDateIdea): Promise<CoupleDateIdea> {
    try {
      const [result] = await db.insert(coupleDateIdeas).values(idea).returning();
      return result;
    } catch (error) {
      console.error('Error creating couple date idea:', error);
      throw error;
    }
  }

  async updateCoupleDateIdeaRanking(ideaId: string, userId: string, ranking: number): Promise<boolean> {
    try {
      // This would update the upvotes JSON field - simplified for now
      const [idea] = await db.select().from(coupleDateIdeas).where(eq(coupleDateIdeas.id, ideaId));
      if (!idea) return false;
      
      const upvotes = (idea.upvotes as Record<string, any>) || {};
      upvotes[userId] = ranking;
      
      await db.update(coupleDateIdeas)
        .set({ upvotes })
        .where(eq(coupleDateIdeas.id, ideaId));
      return true;
    } catch (error) {
      console.error('Error updating couple date idea ranking:', error);
      return false;
    }
  }

  async getCoupleEvents(coupleId: string): Promise<CoupleEvent[]> {
    try {
      const result = await db.select().from(coupleEvents)
        .where(eq(coupleEvents.coupleId, coupleId))
        .orderBy(desc(coupleEvents.startTime));
      return result;
    } catch (error) {
      console.error('Error getting couple events:', error);
      return [];
    }
  }

  async createCoupleEvent(event: InsertCoupleEvent): Promise<CoupleEvent> {
    try {
      const [result] = await db.insert(coupleEvents).values(event).returning();
      return result;
    } catch (error) {
      console.error('Error creating couple event:', error);
      throw error;
    }
  }

  async getCoupleJournalEntries(coupleId: string): Promise<CoupleJournalEntry[]> {
    try {
      const result = await db.select().from(coupleJournal)
        .where(eq(coupleJournal.coupleId, coupleId))
        .orderBy(desc(coupleJournal.occurredOn));
      return result;
    } catch (error) {
      console.error('Error getting couple journal entries:', error);
      return [];
    }
  }

  async createCoupleJournalEntry(entry: InsertCoupleJournalEntry): Promise<CoupleJournalEntry> {
    try {
      const [result] = await db.insert(coupleJournal).values(entry).returning();
      return result;
    } catch (error) {
      console.error('Error creating couple journal entry:', error);
      throw error;
    }
  }

  async getCoupleCheckins(coupleId: string): Promise<CoupleCheckin[]> {
    try {
      const result = await db.select().from(coupleCheckins)
        .where(eq(coupleCheckins.coupleId, coupleId))
        .orderBy(desc(coupleCheckins.checkinDate));
      return result;
    } catch (error) {
      console.error('Error getting couple checkins:', error);
      return [];
    }
  }

  async createCoupleCheckin(checkin: InsertCoupleCheckin): Promise<CoupleCheckin> {
    try {
      const [result] = await db.insert(coupleCheckins).values(checkin).returning();
      return result;
    } catch (error) {
      console.error('Error creating couple checkin:', error);
      throw error;
    }
  }

  // Enhanced Upload System methods - Not implemented in DatabaseStorage, use MemStorage
  async createUploadJob(job: InsertUploadJob): Promise<UploadJob> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getUploadJob(jobId: string): Promise<UploadJob | undefined> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getUploadJobsByFamily(familyId: string): Promise<UploadJob[]> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getUploadJobsByUser(userId: string): Promise<UploadJob[]> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async updateUploadJob(jobId: string, updates: Partial<InsertUploadJob>): Promise<UploadJob | undefined> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async updateUploadProgress(jobId: string, progress: number, stage?: string): Promise<boolean> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async deleteUploadJob(jobId: string): Promise<boolean> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getAnalysisResults(uploadJobId: string): Promise<AnalysisResult[]> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getAnalysisResultsWithConfidence(uploadJobId: string, minConfidence: number): Promise<AnalysisResult[]> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async deleteAnalysisResults(uploadJobId: string): Promise<boolean> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async createUploadMetric(metric: InsertUploadMetric): Promise<UploadMetric> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getUploadMetrics(uploadJobId: string): Promise<UploadMetric[]> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
  async getSystemMetrics(): Promise<{ totalUploads: number; completedUploads: number; avgProcessingTime: number; avgUploadTime: number; }> {
    throw new Error('Enhanced upload methods not implemented in DatabaseStorage. Use MemStorage.');
  }
}

// Enhanced Upload System MemStorage - In-memory storage for upload jobs with atomic operations
export class MemStorage implements Partial<IStorage> {
  private uploadJobs = new Map<string, UploadJob>();
  private analysisResults = new Map<string, AnalysisResult[]>();
  private uploadMetrics = new Map<string, UploadMetric[]>();
  private jobLocks = new Map<string, Promise<any>>(); // Atomic operation locks per job

  // Atomic operation helper to prevent race conditions
  private async atomicJobOperation<T>(jobId: string, operation: () => Promise<T> | T): Promise<T> {
    // Wait for any existing operation on this job to complete
    if (this.jobLocks.has(jobId)) {
      await this.jobLocks.get(jobId);
    }
    
    // Create new operation promise
    const operationPromise = Promise.resolve().then(operation);
    this.jobLocks.set(jobId, operationPromise);
    
    try {
      const result = await operationPromise;
      return result;
    } finally {
      // Clean up lock after operation completes
      if (this.jobLocks.get(jobId) === operationPromise) {
        this.jobLocks.delete(jobId);
      }
    }
  }

  // Enhanced Upload System methods
  async createUploadJob(job: InsertUploadJob): Promise<UploadJob> {
    const id = `upload-job-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const now = new Date();
    const uploadJob: UploadJob = {
      id,
      ...job,
      startedAt: job.startedAt || now,
      uploadedAt: null,
      completedAt: null,
    };
    this.uploadJobs.set(id, uploadJob);
    
    // Record initial metric
    await this.createUploadMetric({
      uploadJobId: id,
      metricType: 'job_created',
      value: now.getTime(),
    });
    
    return uploadJob;
  }

  async getUploadJob(jobId: string): Promise<UploadJob | undefined> {
    return this.uploadJobs.get(jobId);
  }

  async getUploadJobsByFamily(familyId: string): Promise<UploadJob[]> {
    return Array.from(this.uploadJobs.values()).filter(job => job.familyId === familyId);
  }

  async getUploadJobsByUser(userId: string): Promise<UploadJob[]> {
    return Array.from(this.uploadJobs.values()).filter(job => job.userId === userId);
  }

  async updateUploadJob(jobId: string, updates: Partial<InsertUploadJob>): Promise<UploadJob | undefined> {
    const existingJob = this.uploadJobs.get(jobId);
    if (!existingJob) return undefined;

    const updatedJob: UploadJob = {
      ...existingJob,
      ...updates,
    };
    this.uploadJobs.set(jobId, updatedJob);
    return updatedJob;
  }

  async updateUploadProgress(jobId: string, progress: number, stage?: string): Promise<boolean> {
    return await this.atomicJobOperation(jobId, () => {
      const existingJob = this.uploadJobs.get(jobId);
      if (!existingJob) return false;

      const updates: Partial<UploadJob> = { 
        progress: Math.max(0, Math.min(100, progress)) // Clamp progress between 0-100
      };
      if (stage) {
        updates.stage = stage;
        // Update timestamps based on stage
        if (stage === 'uploaded' && !existingJob.uploadedAt) {
          updates.uploadedAt = new Date();
        } else if (stage === 'completed' && !existingJob.completedAt) {
          updates.completedAt = new Date();
          updates.status = 'completed';
        }
      }
      
      const updatedJob: UploadJob = {
        ...existingJob,
        ...updates,
      };
      this.uploadJobs.set(jobId, updatedJob);
      
      // Record progress metric atomically
      this.createUploadMetric({
        uploadJobId: jobId,
        metricType: 'progress_update',
        value: progress,
      });
      
      return true;
    });
  }

  async deleteUploadJob(jobId: string): Promise<boolean> {
    return await this.atomicJobOperation(jobId, () => {
      const job = this.uploadJobs.get(jobId);
      if (!job) return false;
      
      // Cascading delete - remove all related data
      const deleted = this.uploadJobs.delete(jobId);
      if (deleted) {
        this.analysisResults.delete(jobId);
        this.uploadMetrics.delete(jobId);
        this.jobLocks.delete(jobId); // Clean up any remaining locks
        
        // Record deletion metric for monitoring
        this.createUploadMetric({
          uploadJobId: jobId,
          metricType: 'job_deleted',
          value: Date.now(),
        }).catch(() => {}); // Fire-and-forget since job is being deleted
      }
      return deleted;
    });
  }

  async createAnalysisResult(result: InsertAnalysisResult): Promise<AnalysisResult> {
    const id = `analysis-result-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const analysisResult: AnalysisResult = {
      id,
      ...result,
      extractedAt: result.extractedAt || new Date(),
    };

    const jobId = result.uploadJobId;
    const existing = this.analysisResults.get(jobId) || [];
    existing.push(analysisResult);
    this.analysisResults.set(jobId, existing);
    
    return analysisResult;
  }

  async getAnalysisResults(uploadJobId: string): Promise<AnalysisResult[]> {
    return this.analysisResults.get(uploadJobId) || [];
  }

  async getAnalysisResultsWithConfidence(uploadJobId: string, minConfidence: number): Promise<AnalysisResult[]> {
    const results = this.analysisResults.get(uploadJobId) || [];
    return results.filter(result => result.confidence >= minConfidence);
  }

  async deleteAnalysisResults(uploadJobId: string): Promise<boolean> {
    return this.analysisResults.delete(uploadJobId);
  }

  async createUploadMetric(metric: InsertUploadMetric): Promise<UploadMetric> {
    const id = `upload-metric-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const uploadMetric: UploadMetric = {
      id,
      ...metric,
      recordedAt: metric.recordedAt || new Date(),
    };

    const jobId = metric.uploadJobId;
    const existing = this.uploadMetrics.get(jobId) || [];
    existing.push(uploadMetric);
    this.uploadMetrics.set(jobId, existing);
    
    return uploadMetric;
  }

  async getUploadMetrics(uploadJobId: string): Promise<UploadMetric[]> {
    return this.uploadMetrics.get(uploadJobId) || [];
  }

  async getSystemMetrics(): Promise<{
    totalUploads: number;
    completedUploads: number;
    avgProcessingTime: number;
    avgUploadTime: number;
  }> {
    const allJobs = Array.from(this.uploadJobs.values());
    const completedJobs = allJobs.filter(job => job.status === 'completed');
    
    // Calculate averages from metrics
    let totalProcessingTime = 0;
    let totalUploadTime = 0;
    let processingCount = 0;
    let uploadCount = 0;

    for (const job of allJobs) {
      const metrics = this.uploadMetrics.get(job.id) || [];
      for (const metric of metrics) {
        if (metric.metricType === 'processing_time') {
          totalProcessingTime += metric.value;
          processingCount++;
        } else if (metric.metricType === 'upload_time') {
          totalUploadTime += metric.value;
          uploadCount++;
        }
      }
    }

    return {
      totalUploads: allJobs.length,
      completedUploads: completedJobs.length,
      avgProcessingTime: processingCount > 0 ? Math.round(totalProcessingTime / processingCount) : 0,
      avgUploadTime: uploadCount > 0 ? Math.round(totalUploadTime / uploadCount) : 0,
    };
  }
}

export const storage = new DatabaseStorage();
export const uploadStorage = new MemStorage();
