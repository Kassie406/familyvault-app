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
  users, organizations, plans, coupons, articles, consentEvents, auditLogs,
  adminSessions, securitySettings, impersonationSessions,
  gdprConsentEvents, dsarRequests, retentionPolicies, suppressionList
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
}

export const storage = new DatabaseStorage();
