import { Request, Response, NextFunction } from 'express';
import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { authSessions } from '@shared/schema';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    orgId?: string;
  };
  sessionID?: string;
}

/**
 * Middleware to track session activity and device information
 * Updates auth_sessions table with latest activity and device details
 */
export async function touchAuthSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // Only track authenticated users with valid sessions
    if (!req.user?.id || !req.sessionID) {
      return next();
    }

    const userId = req.user.id;
    const orgId = req.user.orgId || null;
    const sessionId = req.sessionID;
    const ip = req.ip || req.connection.remoteAddress || null;
    const userAgent = req.get('user-agent') || null;

    // Upsert session activity (insert or update last_seen_at)
    await db
      .insert(authSessions)
      .values({
        sid: sessionId,
        userId: userId,
        orgId: orgId,
        ip: ip,
        userAgent: userAgent,
        createdAt: new Date(),
        lastSeenAt: new Date()
      })
      .onConflictDoUpdate({
        target: authSessions.sid,
        set: {
          lastSeenAt: new Date(),
          ip: ip,
          userAgent: userAgent
        }
      });

    next();
  } catch (error) {
    // Don't block the user if session tracking fails
    console.error('Session tracking error:', error);
    next();
  }
}

/**
 * Get all active sessions for a user
 */
export async function getUserSessions(userId: string) {
  return await db
    .select()
    .from(authSessions)
    .where(eq(authSessions.userId, userId))
    .orderBy(authSessions.lastSeenAt);
}

/**
 * Remove a specific session
 */
export async function removeSession(sessionId: string, userId: string) {
  const result = await db
    .delete(authSessions)
    .where(eq(authSessions.sid, sessionId))
    .returning();
  
  return result.length > 0;
}

/**
 * Remove all sessions except the current one
 */
export async function removeOtherSessions(currentSessionId: string, userId: string) {
  const result = await db
    .delete(authSessions)
    .where(eq(authSessions.userId, userId))
    .returning();
  
  return result.length;
}

/**
 * Check if user agent/IP combination is new (not seen in last 30 days)
 */
export async function isNewDevice(userId: string, userAgent: string | null | undefined, ip: string | null | undefined): Promise<boolean> {
  if (!userAgent && !ip) return false;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const existingSessions = await db
    .select()
    .from(authSessions)
    .where(eq(authSessions.userId, userId))
    .limit(1);

  // Check if we've seen this user agent or IP in the last 30 days
  for (const session of existingSessions) {
    if (session.lastSeenAt && session.lastSeenAt > thirtyDaysAgo) {
      if ((userAgent && session.userAgent === userAgent) || 
          (ip && session.ip === ip)) {
        return false; // Device has been seen recently
      }
    }
  }

  return true; // This is a new device
}