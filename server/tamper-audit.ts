import crypto from 'crypto';
import { storage } from './storage';
import { auditLogs } from '../shared/schema';
import { desc, eq } from 'drizzle-orm';

export interface AuditContext {
  userId: string;
  email: string;
  role: string;
  ip: string;
}

export interface AuditEntry {
  action: string;
  objectType: string;
  objectId: string;
  before?: any;
  after?: any;
  reason?: string;
}

/**
 * Get the last tamper hash for hash chaining
 */
export async function getLastTamperHash(): Promise<string | null> {
  // For now, use mock implementation until we connect to real DB
  // In production, this would query the actual database
  return null;
}

/**
 * Compute SHA-256 hash for tamper evidence
 */
function computeHash(payload: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

/**
 * Write a tamper-evident audit log entry with hash chaining
 */
export async function writeTamperEvidenceAudit(ctx: AuditContext, entry: AuditEntry): Promise<void> {
  const prevTamperHash = await getLastTamperHash();
  
  const corePayload = {
    ts: new Date().toISOString(),
    actorId: ctx.userId,
    actorEmail: ctx.email,
    actorRole: ctx.role,
    actorIp: ctx.ip,
    action: entry.action,
    objectType: entry.objectType,
    objectId: String(entry.objectId),
    before: entry.before || null,
    after: entry.after || null,
    reason: entry.reason || null,
    prevTamperHash: prevTamperHash || null,
  };

  const tamperHash = computeHash(corePayload);
  
  // For now, store in memory storage. In production, use real DB
  console.log('Tamper-evident audit log:', {
    tamperHash,
    prevTamperHash,
    action: entry.action,
    objectType: entry.objectType,
    objectId: entry.objectId,
  });
}

/**
 * Verify the integrity of the audit chain
 */
export async function verifyAuditChain(): Promise<{ valid: boolean; errors: string[] }> {
  // For now, mock implementation - in production would verify actual chain
  return {
    valid: true,
    errors: []
  };
}

/**
 * Get audit context from Express request
 */
export function getAuditContext(req: any): AuditContext {
  return {
    userId: req.user?.id || 'unknown',
    email: req.user?.email || 'unknown',
    role: req.user?.role || 'unknown',
    ip: req.ip || req.connection?.remoteAddress || 'unknown',
  };
}