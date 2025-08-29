import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface AuditContext {
  userId: string;
  email: string;
  role: string;
  ip?: string;
}

export interface AuditEntry {
  action: string;
  objectType: string;
  objectId: string;
  before?: any;
  after?: any;
  reason?: string;
}

export class TamperEvidentAuditService {
  async getLastTamperHash(): Promise<string | null> {
    try {
      const rows = await sql`SELECT tamper_hash FROM audit_log_v2 ORDER BY ts DESC LIMIT 1`;
      return rows[0]?.tamper_hash || null;
    } catch (error) {
      console.error('Error getting last tamper hash:', error);
      return null;
    }
  }

  private computeHash(payload: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  async writeAudit(ctx: AuditContext, entry: AuditEntry): Promise<void> {
    try {
      const prev = await this.getLastTamperHash();

      const corePayload = {
        ts: new Date().toISOString(),
        actor_user_id: ctx.userId,
        actor_email: ctx.email,
        actor_role: ctx.role,
        actor_ip: ctx.ip || null,
        action: entry.action,
        object_type: entry.objectType,
        object_id: String(entry.objectId),
        before: entry.before || null,
        after: entry.after || null,
        reason: entry.reason || null,
        prev_tamper_hash: prev || null,
      };

      const tamper_hash = this.computeHash(corePayload);

      await sql`INSERT INTO audit_log_v2
        (ts, actor_user_id, actor_email, actor_role, actor_ip, action,
         object_type, object_id, before, after, reason, tamper_hash, prev_tamper_hash)
         VALUES (${corePayload.ts}, ${corePayload.actor_user_id}, ${corePayload.actor_email}, 
                 ${corePayload.actor_role}, ${corePayload.actor_ip}, ${corePayload.action},
                 ${corePayload.object_type}, ${corePayload.object_id}, 
                 ${corePayload.before ? JSON.stringify(corePayload.before) : null},
                 ${corePayload.after ? JSON.stringify(corePayload.after) : null},
                 ${corePayload.reason}, ${tamper_hash}, ${corePayload.prev_tamper_hash})`;
    } catch (error) {
      console.error('Error writing audit log:', error);
      throw error;
    }
  }

  async getAuditLogs(limit: number = 100, cursor?: string) {
    try {
      let rows;
      
      if (cursor) {
        rows = await sql`SELECT * FROM audit_log_v2 
                        WHERE ts < (SELECT ts FROM audit_log_v2 WHERE id = ${cursor})
                        ORDER BY ts DESC LIMIT ${limit}`;
      } else {
        rows = await sql`SELECT * FROM audit_log_v2 ORDER BY ts DESC LIMIT ${limit}`;
      }
      
      // Parse JSON fields
      const processedRows = rows.map((row: any) => ({
        ...row,
        before: row.before ? JSON.parse(row.before) : null,
        after: row.after ? JSON.parse(row.after) : null,
      }));

      return { items: processedRows };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { items: [] };
    }
  }

  async verifyChainIntegrity(): Promise<{ valid: boolean; brokenAt?: string }> {
    try {
      const rows = await sql`SELECT id, ts, tamper_hash, prev_tamper_hash, 
                                    actor_user_id, actor_email, actor_role, actor_ip,
                                    action, object_type, object_id, before, after, reason
                             FROM audit_log_v2 ORDER BY ts ASC`;

      let expectedPrevHash = null;
      
      for (const row of rows) {
        // Verify hash chain
        if (row.prev_tamper_hash !== expectedPrevHash) {
          return { valid: false, brokenAt: row.id };
        }

        // Recompute hash
        const payload = {
          ts: row.ts,
          actor_user_id: row.actor_user_id,
          actor_email: row.actor_email,
          actor_role: row.actor_role,
          actor_ip: row.actor_ip,
          action: row.action,
          object_type: row.object_type,
          object_id: row.object_id,
          before: row.before ? JSON.parse(row.before) : null,
          after: row.after ? JSON.parse(row.after) : null,
          reason: row.reason,
          prev_tamper_hash: row.prev_tamper_hash,
        };

        const computedHash = this.computeHash(payload);
        if (computedHash !== row.tamper_hash) {
          return { valid: false, brokenAt: row.id };
        }

        expectedPrevHash = row.tamper_hash;
      }

      return { valid: true };
    } catch (error) {
      console.error('Error verifying chain integrity:', error);
      return { valid: false };
    }
  }
}

export const auditService = new TamperEvidentAuditService();

// Middleware helper
export function attachAuditContext(req: any, res: any, next: any) {
  if (req.user) {
    req.auditCtx = {
      userId: req.user.id,
      email: req.user.username || req.user.email,
      role: req.user.role,
      ip: req.ip || req.socket?.remoteAddress,
    };
  }
  next();
}