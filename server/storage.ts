import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc, sql, ilike, or } from "drizzle-orm";
import { 
  type User, type InsertUser,
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
  type FamilyMember, type InsertFamilyMember,
  users, organizations, plans, coupons, articles, consentEvents, auditLogs,
  adminSessions, securitySettings, impersonationSessions,
  gdprConsentEvents, dsarRequests, retentionPolicies, suppressionList,
  invites, inviteLinks, familyMembers
} from "@shared/schema";

// Database connection
const neonClient = neon(process.env.DATABASE_URL!);
const db = drizzle(neonClient);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
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

  // Family Invite methods
  createInvite(invite: InsertInvite): Promise<Invite>;
  getInvite(id: string): Promise<Invite | undefined>;
  getInviteByToken(token: string): Promise<Invite | undefined>;
  getInvitesByEmail(email: string): Promise<Invite[]>;
  getUserInvites(userId: string): Promise<Invite[]>;
  updateInvite(id: string, updates: Partial<InsertInvite>): Promise<Invite | undefined>;
  revokeInvite(id: string): Promise<boolean>;
  acceptInvite(token: string): Promise<Invite | undefined>;
  
  // Family Member methods
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  getFamilyMember(id: string): Promise<FamilyMember | undefined>;
  getFamilyMemberByEmail(email: string): Promise<FamilyMember | undefined>;
  getAllFamilyMembers(): Promise<FamilyMember[]>;
  updateFamilyMember(id: string, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: string): Promise<boolean>;
  
  // Invite Link methods
  createInviteLink(link: InsertInviteLink): Promise<InviteLink>;
  getInviteLink(id: string): Promise<InviteLink | undefined>;
  getInviteLinkByToken(token: string): Promise<InviteLink | undefined>;
  getUserInviteLinks(userId: string): Promise<InviteLink[]>;
  revokeInviteLink(id: string): Promise<boolean>;
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

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
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
      .where(sql`${impersonationSessions.actorId} = ${actorId} AND ${impersonationSessions.status} = 'active'`)
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
      .where(sql`${impersonationSessions.status} = 'active' AND ${impersonationSessions.expiresAt} < NOW()`);
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
}

export const storage = new DatabaseStorage();
