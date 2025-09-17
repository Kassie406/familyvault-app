import { db } from './db';
import { auditLogs } from '@shared/schema';
import crypto from 'crypto';
import type { InsertAuditLog } from '@shared/schema';

export interface AuditContext {
  actorId?: string;
  ip?: string;
  userAgent?: string;
}

export class AuditService {
  /**
   * Generate cryptographic signature for audit record integrity
   */
  private static generateSignature(payload: any): string {
    const secret = process.env.AUDIT_SECRET || 'default-audit-secret-change-in-production';
    const payloadString = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto.createHmac('sha256', secret).update(payloadString).digest('hex');
  }

  /**
   * Verify audit record integrity by checking signature
   */
  static verifySignature(auditRecord: any): boolean {
    try {
      const { signature, ...payload } = auditRecord;
      const expectedSignature = this.generateSignature(payload);
      return signature === expectedSignature;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }
  /**
   * Create an audit log entry with before/after state tracking
   */
  static async logChange(
    action: string,
    resource: string,
    resourceId: string,
    beforeState: any,
    afterState: any,
    context: AuditContext
  ) {
    const auditEntry: InsertAuditLog = {
      actorId: context.actorId,
      action,
      resource,
      resourceId,
      beforeState: beforeState ? JSON.stringify(beforeState) : null,
      afterState: afterState ? JSON.stringify(afterState) : null,
      ip: context.ip,
      userAgent: context.userAgent,
    };

    // Add cryptographic signature for tamper detection
    const signature = this.generateSignature(auditEntry);
    const signedEntry = { ...auditEntry, signature };
    
    console.log(`🔍 Audit: ${action} on ${resource}${resourceId ? `/${resourceId}` : ''} by ${context.actorId || 'system'}`);
    return await storage.createAuditLog(signedEntry);
  }

  /**
   * Log a simple action without state tracking
   */
  static async logAction(
    action: string,
    resource?: string,
    resourceId?: string,
    context: AuditContext = {},
    meta?: any
  ) {
    const auditEntry: InsertAuditLog = {
      actorId: context.actorId,
      action,
      resource: resource || 'system',
      resourceId,
      meta: meta ? JSON.stringify(meta) : null,
      ip: context.ip,
      userAgent: context.userAgent,
    };

    // Add cryptographic signature for tamper detection
    const signature = this.generateSignature(auditEntry);
    const signedEntry = { ...auditEntry, signature };
    
    console.log(`🔍 Audit: ${action} by ${context.actorId || 'system'}`);
    return await storage.createAuditLog(signedEntry);
  }

  /**
   * Log authentication events
   */
  static async logAuth(
    action: 'login' | 'logout' | 'login_failed' | 'session_revoked',
    userId?: string,
    context: AuditContext = {}
  ) {
    return await this.logAction(
      `auth:${action}`,
      'user',
      userId,
      context
    );
  }

  /**
   * Log admin operations with high security importance
   */
  static async logAdminAction(
    action: string,
    resource: string,
    resourceId: string,
    beforeState: any,
    afterState: any,
    context: AuditContext
  ) {
    // Log the change with before/after state
    await this.logChange(action, resource, resourceId, beforeState, afterState, context);

    // For high-risk actions, also send real-time alerts (future enhancement)
    const highRiskActions = [
      'user:role_changed',
      'plan:price_updated',
      'admin:created',
      'admin:deleted',
      'security:setting_changed'
    ];

    if (highRiskActions.includes(action)) {
      // Send real-time alert to administrators
      console.log(`🚨 HIGH-RISK ADMIN ACTION: ${action} by ${context.actorId}`);
      // In production: integrate with incident management (PagerDuty, Slack, etc.)
    }
  }

  /**
   * Get audit trail for a specific resource
   */
  static async getResourceAuditTrail(resource: string, resourceId: string, limit = 50) {
    const logs = await storage.getAuditLogs(500);
    return logs
      .filter(log => log.resource === resource && log.resourceId === resourceId)
      .slice(0, limit);
  }

  /**
   * Search audit logs with advanced filtering
   */
  static async searchLogs(query: string, limit = 100) {
    return await storage.searchAuditLogs(query, limit);
  }
}

// Helper function to extract audit context from Express request
export function getAuditContext(req: any): AuditContext {
  return {
    actorId: req.user?.id,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
  };
}