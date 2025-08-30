import { storage } from './storage';
import { writeTamperEvidenceAudit, type AuditContext } from './tamper-audit';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { z } from 'zod';

// Environment variable for JWT secret - should be stored securely
const IMP_SECRET = process.env.IMP_SECRET || 'dev-impersonation-secret-change-in-production';
const IMP_MAX_MINUTES = 30;
const IMP_DEFAULT_MINUTES = 10;

// Default operations to deny during impersonation
const DENY_DEFAULT = [
  'password.change',
  'mfa.reset', 
  'user.delete',
  'role.update',
  'payment.method.update'
];

// JWT Claims for impersonation token
export interface ImpClaims {
  sub: string;     // Target user being impersonated
  imp: true;       // Flag indicating impersonation JWT
  act: string;     // Admin actor ID
  sid: string;     // Session ID
  deny: string[];  // Denied operations
  iat?: number;    // Issued at
  exp?: number;    // Expires at
}

// Request body validation schemas
export const StartImpersonationSchema = z.object({
  target_user_id: z.string().min(1),
  business_reason: z.string().min(20),
  duration_minutes: z.number().int().min(5).max(IMP_MAX_MINUTES)
});

export const EndImpersonationSchema = z.object({
  session_id: z.string().min(1),
  reason: z.string().optional()
});

// Operation classification for request filtering
const opMap: Array<{ test: (req: any) => boolean; op: string }> = [
  { test: req => req.method === 'POST' && /^\/api\/users\/[^/]+\/password$/.test(req.path), op: 'password.change' },
  { test: req => req.method === 'POST' && /^\/api\/users\/[^/]+\/mfa\/reset$/.test(req.path), op: 'mfa.reset' },
  { test: req => req.method === 'DELETE' && /^\/api\/users\/[^/]+$/.test(req.path), op: 'user.delete' },
  { test: req => req.method === 'PATCH' && /^\/api\/users\/[^/]+\/role$/.test(req.path), op: 'role.update' },
  { test: req => req.method === 'POST' && /^\/api\/billing\/payment-methods$/.test(req.path), op: 'payment.method.update' },
  { test: req => req.method === 'POST' && /^\/api\/auth\/change-password$/.test(req.path), op: 'password.change' },
  { test: req => req.method === 'POST' && /^\/api\/billing\/update-payment$/.test(req.path), op: 'payment.method.update' },
];

export function classifyOp(req: any): string | null {
  const hit = opMap.find(m => m.test(req));
  return hit ? hit.op : null;
}

// In-memory token blocklist (in production, use Redis with TTL)
const tokenBlocklist = new Set<string>();

/**
 * Start impersonation session - creates JWT token and database record
 */
export async function startImpersonation(req: any, res: any) {
  try {
    // 1) Require admin auth & permission
    const admin = req.user;
    if (!admin || !['ADMIN', 'PRESIDENT'].includes(admin.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // 2) Validate request body
    const parse = StartImpersonationSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    }

    const { target_user_id, business_reason, duration_minutes } = parse.data;

    // 3) Prevent self-impersonation
    if (target_user_id === admin.id) {
      return res.status(400).json({ error: 'Cannot impersonate yourself' });
    }

    // 4) Check if target user exists
    const targetUser = await storage.getUserById(target_user_id);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // 5) Prevent impersonating other admins/staff
    if (['ADMIN', 'PRESIDENT'].includes(targetUser.role)) {
      return res.status(403).json({ error: 'Cannot impersonate admin users' });
    }

    // 6) Check for existing active session
    const existingSession = await storage.getActiveImpersonationSession(admin.id);
    if (existingSession) {
      return res.status(409).json({ 
        error: 'Active impersonation session already exists',
        session_id: existingSession.id 
      });
    }

    // 7) Create session record
    const sid = 'imp_' + randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration_minutes * 60_000);

    await storage.createImpersonationSession({
      id: sid,
      actorId: admin.id,
      targetId: target_user_id,
      businessReason: business_reason,
      status: 'active',
      expiresAt,
      ip: req.ip || req.connection?.remoteAddress,
      deny: DENY_DEFAULT,
      meta: {}
    });

    // 8) Create signed JWT
    const token = jwt.sign(
      {
        sub: target_user_id,
        imp: true,
        act: admin.id,
        sid,
        deny: DENY_DEFAULT
      } as ImpClaims,
      IMP_SECRET,
      { 
        algorithm: 'HS256', 
        expiresIn: `${duration_minutes}m` 
      }
    );

    // 9) Audit event
    await writeTamperEvidenceAudit({
      actorId: admin.id,
      actorEmail: admin.username,
      actorRole: admin.role,
      action: 'impersonation.started',
      resource: 'user',
      resourceId: target_user_id,
      meta: {
        session_id: sid,
        target_user_id,
        business_reason,
        duration_minutes,
        ip: req.ip
      },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(201).json({
      session_id: sid,
      token,
      expires_at: expiresAt.toISOString(),
      target_user_id,
      deny: DENY_DEFAULT
    });

  } catch (error: any) {
    console.error('Error starting impersonation:', error);
    return res.status(500).json({ error: 'Failed to start impersonation session' });
  }
}

/**
 * End impersonation session
 */
export async function endImpersonation(req: any, res: any) {
  try {
    const admin = req.user;
    if (!admin) {
      return res.status(403).json({ error: 'Authentication required' });
    }

    const parse = EndImpersonationSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid request', details: parse.error.flatten() });
    }

    const { session_id, reason = 'manual' } = parse.data;

    // Get session from database
    const session = await storage.getImpersonationSession(session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'active') {
      return res.status(200).json({ ok: true, message: 'Session already ended' });
    }

    // Only the actor can end their own session
    if (session.actorId !== admin.id) {
      return res.status(403).json({ error: 'Can only end your own impersonation sessions' });
    }

    // Block all tokens for this session ID until original expiry
    const expUnix = Math.floor(session.expiresAt.getTime() / 1000);
    tokenBlocklist.add(session_id); // In production: store with TTL in Redis

    // Update session status
    await storage.endImpersonationSession(session_id, 'completed', reason);

    // Audit event
    await writeTamperEvidenceAudit({
      actorId: admin.id,
      actorEmail: admin.username,
      actorRole: admin.role,
      action: 'impersonation.ended',
      resource: 'user',
      resourceId: session.targetId,
      meta: {
        session_id,
        target_user_id: session.targetId,
        end_reason: reason,
        ip: req.ip
      },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.json({ ok: true });

  } catch (error: any) {
    console.error('Error ending impersonation:', error);
    return res.status(500).json({ error: 'Failed to end impersonation session' });
  }
}

/**
 * Get current impersonation status
 */
export async function getImpersonationStatus(req: any, res: any) {
  try {
    const admin = req.user;
    if (!admin) {
      return res.status(403).json({ error: 'Authentication required' });
    }

    const activeSession = await storage.getActiveImpersonationSession(admin.id);
    
    if (!activeSession) {
      return res.json({ active: false });
    }

    // Check if session has expired
    if (new Date() > activeSession.expiresAt) {
      await storage.endImpersonationSession(activeSession.id, 'expired', 'auto-expired');
      return res.json({ active: false });
    }

    return res.json({
      active: true,
      session: {
        id: activeSession.id,
        target_user_id: activeSession.targetId,
        business_reason: activeSession.businessReason,
        expires_at: activeSession.expiresAt.toISOString(),
        deny: activeSession.deny || DENY_DEFAULT
      }
    });

  } catch (error: any) {
    console.error('Error getting impersonation status:', error);
    return res.status(500).json({ error: 'Failed to get impersonation status' });
  }
}

/**
 * Get recent impersonation sessions for audit
 */
export async function getRecentImpersonationSessions(req: any, res: any) {
  try {
    const admin = req.user;
    if (!admin || !['ADMIN', 'PRESIDENT'].includes(admin.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const sessions = await storage.getRecentImpersonationSessions(50);
    return res.json({ sessions });

  } catch (error: any) {
    console.error('Error getting recent sessions:', error);
    return res.status(500).json({ error: 'Failed to get recent sessions' });
  }
}

/**
 * Middleware to parse impersonation JWT from Authorization header
 */
export async function parseImpersonationJWT(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization || '';
  
  if (!authHeader.startsWith('Bearer ')) {
    return next(); // Not an impersonation request
  }

  const token = authHeader.slice(7);

  try {
    const claims = jwt.verify(token, IMP_SECRET) as ImpClaims;

    // Must be impersonation token
    if (!claims?.imp || !claims?.sid || !claims?.sub) {
      return res.status(401).json({ error: 'Invalid impersonation token' });
    }

    // Check if session ID is blocklisted
    if (tokenBlocklist.has(claims.sid)) {
      return res.status(401).json({ error: 'Impersonation session ended' });
    }

    // Verify session is still active in database
    const session = await storage.getImpersonationSession(claims.sid);
    if (!session || session.status !== 'active') {
      return res.status(401).json({ error: 'Impersonation session not active' });
    }

    // Check expiration
    if (new Date() > session.expiresAt) {
      await storage.endImpersonationSession(claims.sid, 'expired', 'auto-expired');
      tokenBlocklist.add(claims.sid);
      return res.status(401).json({ error: 'Impersonation session expired' });
    }

    // Attach impersonation context
    req.impersonation = {
      sid: claims.sid,
      actorId: claims.act,
      targetId: claims.sub,
      deny: claims.deny || [],
      exp: claims.exp
    };

    // Set effective user to the target user
    const targetUser = await storage.getUserById(claims.sub);
    if (targetUser) {
      req.currentUser = { ...targetUser, impersonated: true };
    }

    return next();

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired impersonation token' });
  }
}

/**
 * Middleware to enforce impersonation denylist
 */
export function enforceImpersonationDenylist(req: any, res: any, next: any) {
  if (!req.impersonation) {
    return next(); // Not an impersonation request
  }

  const op = classifyOp(req);
  
  if (op && req.impersonation.deny.includes(op)) {
    // Audit the blocked attempt
    writeTamperEvidenceAudit({
      actorId: req.impersonation.actorId,
      actorEmail: 'impersonation-actor',
      actorRole: 'ADMIN',
      action: 'impersonation.request.blocked',
      resource: 'operation',
      resourceId: op,
      meta: {
        session_id: req.impersonation.sid,
        operation: op,
        path: req.path,
        method: req.method,
        allowed: false
      },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({ 
      error: 'IMPERSONATION_BLOCKED', 
      operation: op,
      message: `Operation '${op}' is not allowed during impersonation`
    });
  }

  // Log allowed request (sample at 10% to avoid noise)
  if (Math.random() < 0.1) {
    writeTamperEvidenceAudit({
      actorId: req.impersonation.actorId,
      actorEmail: 'impersonation-actor', 
      actorRole: 'ADMIN',
      action: 'impersonation.request.allowed',
      resource: 'operation',
      resourceId: op || 'other',
      meta: {
        session_id: req.impersonation.sid,
        operation: op || 'other',
        path: req.path,
        method: req.method,
        allowed: true
      },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  next();
}

/**
 * Background cleanup job - mark expired sessions
 */
export async function cleanupExpiredSessions() {
  try {
    const expiredSessions = await storage.getExpiredImpersonationSessions();
    
    for (const session of expiredSessions) {
      await storage.endImpersonationSession(session.id, 'expired', 'auto-cleanup');
      tokenBlocklist.add(session.id);
      
      // Audit cleanup
      await writeTamperEvidenceAudit({
        actorId: 'system',
        actorEmail: 'system',
        actorRole: 'SYSTEM',
        action: 'impersonation.auto_expired',
        resource: 'session',
        resourceId: session.id,
        meta: {
          session_id: session.id,
          target_user_id: session.targetId,
          actor_id: session.actorId
        },
        ip: '127.0.0.1',
        userAgent: 'system-cleanup'
      });
    }

    console.log(`Cleaned up ${expiredSessions.length} expired impersonation sessions`);
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredSessions, 5 * 60 * 1000);

/**
 * Legacy compatibility - kept for backward compatibility
 */
export interface ImpersonationSession {
  id: string;
  adminId: string;
  targetId: string;
  reason?: string;
  startedAt: Date;
  expiresAt: Date;
  endedAt?: Date;
  endedReason?: string;
}