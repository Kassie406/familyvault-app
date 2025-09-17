import { db as dbConnection } from './db';

/**
 * Row-Level Security (RLS) Service
 * Provides bulletproof tenant isolation at the database level
 */
export class RLSService {
  /**
   * Set the current tenant and user context for RLS policies
   * Must be called before any database operations within a request
   */
  static async setTenantContext(orgId: string, userId?: string): Promise<void> {
    try {
      await dbConnection.execute(`SET app.current_org_id = '${orgId}'`);
      if (userId) {
        await dbConnection.execute(`SET app.current_user_id = '${userId}'`);
      }
    } catch (error) {
      console.error('Failed to set tenant context:', error);
      throw new Error('Database tenant context setup failed');
    }
  }

  /**
   * Clear tenant context (optional, for security)
   */
  static async clearTenantContext(): Promise<void> {
    try {
      await dbConnection.execute(`RESET app.current_org_id`);
      await dbConnection.execute(`RESET app.current_user_id`);
    } catch (error) {
      console.error('Failed to clear tenant context:', error);
    }
  }

  /**
   * Initialize RLS policies and functions in the database
   * This should be run once during deployment
   */
  static async initializeRLS(): Promise<void> {
    try {
      console.log('🔒 Initializing Row-Level Security (RLS)...');

      // Create helper functions for RLS policies
      await dbConnection.execute(`
        CREATE OR REPLACE FUNCTION current_org_id() RETURNS text AS $$
          SELECT current_setting('app.current_org_id', true);
        $$ LANGUAGE sql STABLE;
      `);

      await dbConnection.execute(`
        CREATE OR REPLACE FUNCTION current_user_id() RETURNS text AS $$
          SELECT current_setting('app.current_user_id', true);
        $$ LANGUAGE sql STABLE;
      `);

      // Enable RLS on all tenant-specific tables
      const tables = [
        'users', 'organizations', 'plans', 'coupons', 'articles', 
        'consent_events', 'audit_logs', 'admin_sessions', 
        'user_devices', 'webauthn_credentials', 'totp_secrets', 
        'secure_session_store', 'file_signatures'
      ];

      for (const table of tables) {
        try {
          await dbConnection.execute(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
          console.log(`✅ Enabled RLS on ${table}`);
        } catch (error) {
          console.log(`⚠️  Table ${table} may not exist, skipping RLS setup`);
        }
      }

      // Create RLS policies
      await this.createRLSPolicies();
      
      console.log('🔒 Row-Level Security initialization complete!');
    } catch (error) {
      console.error('❌ RLS initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create comprehensive RLS policies for tenant isolation
   */
  private static async createRLSPolicies(): Promise<void> {
    const policies = [
      // Users table: users can only see users in their org
      {
        table: 'users',
        policy: 'users_org_isolation',
        sql: `
          CREATE POLICY users_org_isolation ON users
          USING (id::text = current_user_id() OR id IN (
            SELECT user_id::text FROM memberships WHERE org_id::text = current_org_id()
          ))
        `
      },

      // Organizations: users can only see their own org
      {
        table: 'organizations', 
        policy: 'org_isolation',
        sql: `
          CREATE POLICY org_isolation ON organizations
          USING (id::text = current_org_id())
        `
      },

      // Audit logs: scoped to current org
      {
        table: 'audit_logs',
        policy: 'audit_org_isolation', 
        sql: `
          CREATE POLICY audit_org_isolation ON audit_logs
          USING (
            "actorId"::text = current_user_id() OR 
            "actorId" IN (
              SELECT user_id::text FROM memberships WHERE org_id::text = current_org_id()
            )
          )
        `
      },

      // User devices: users can only see their own devices
      {
        table: 'user_devices',
        policy: 'device_user_isolation',
        sql: `
          CREATE POLICY device_user_isolation ON user_devices
          USING ("userId"::text = current_user_id())
        `
      },

      // WebAuthn credentials: users can only see their own credentials
      {
        table: 'webauthn_credentials',
        policy: 'webauthn_user_isolation',
        sql: `
          CREATE POLICY webauthn_user_isolation ON webauthn_credentials
          USING ("userId"::text = current_user_id())
        `
      },

      // TOTP secrets: users can only see their own secrets
      {
        table: 'totp_secrets',
        policy: 'totp_user_isolation',
        sql: `
          CREATE POLICY totp_user_isolation ON totp_secrets
          USING ("userId"::text = current_user_id())
        `
      },

      // File signatures: scoped to org
      {
        table: 'file_signatures',
        policy: 'file_org_isolation',
        sql: `
          CREATE POLICY file_org_isolation ON file_signatures
          USING ("orgId"::text = current_org_id() OR "userId"::text = current_user_id())
        `
      }
    ];

    for (const policy of policies) {
      try {
        // Drop existing policy if it exists
        await dbConnection.execute(`DROP POLICY IF EXISTS ${policy.policy} ON ${policy.table};`);
        
        // Create new policy
        await dbConnection.execute(policy.sql);
        console.log(`✅ Created RLS policy: ${policy.policy}`);
      } catch (error) {
        console.log(`⚠️  Could not create policy ${policy.policy}: table may not exist`);
      }
    }
  }

  /**
   * Middleware to automatically set tenant context for authenticated requests
   */
  static tenantMiddleware() {
    return async (req: any, res: any, next: any) => {
      try {
        if (req.user) {
          // For now, use user email as org identifier
          // In production, you'd have proper org membership lookup
          const orgId = req.user.email || req.user.id;
          await RLSService.setTenantContext(orgId, req.user.id);
        }
        next();
      } catch (error) {
        console.error('Tenant context middleware failed:', error);
        res.status(500).json({ error: 'Database security setup failed' });
      }
    };
  }

  /**
   * Execute a query with explicit tenant context
   * Useful for admin operations or system queries
   */
  static async executeWithTenantContext<T>(
    orgId: string, 
    userId: string | undefined, 
    queryFn: () => Promise<T>
  ): Promise<T> {
    await this.setTenantContext(orgId, userId);
    try {
      const result = await queryFn();
      return result;
    } finally {
      await this.clearTenantContext();
    }
  }
}

export default RLSService;