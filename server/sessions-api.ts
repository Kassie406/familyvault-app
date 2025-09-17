import express, { Request, Response } from 'express';
import { getUserSessions, removeSession, removeOtherSessions } from './request-tracker.js';
import { eq, and, ne } from 'drizzle-orm';
import { db } from './db.js';
import { authSessions } from '@shared/schema';
import { formatUserAgent, formatIpAddress } from './new-device-alerts.js';
import csrf from 'csurf';

const router = express.Router();

// CSRF protection for state-changing operations
const csrfProtection = csrf({ 
  cookie: { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  } 
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    orgId?: string;
  };
  sessionID?: string;
}

/**
 * List all sessions for the current user
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const currentSessionId = req.sessionID;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Get all sessions for this user
    const sessions = await db
      .select({
        sid: authSessions.sid,
        ip: authSessions.ip,
        userAgent: authSessions.userAgent,
        createdAt: authSessions.createdAt,
        lastSeenAt: authSessions.lastSeenAt
      })
      .from(authSessions)
      .where(eq(authSessions.userId, userId))
      .orderBy(authSessions.lastSeenAt);

    // Format sessions for frontend display
    const formattedSessions = sessions.map(session => ({
      sid: session.sid,
      ip: formatIpAddress(session.ip),
      userAgent: formatUserAgent(session.userAgent),
      rawUserAgent: session.userAgent,
      createdAt: session.createdAt,
      lastSeenAt: session.lastSeenAt,
      current: session.sid === currentSessionId
    }));

    res.json({ 
      sessions: formattedSessions,
      totalCount: formattedSessions.length,
      currentSessionId
    });

  } catch (error) {
    console.error('Failed to list sessions:', error);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

/**
 * Revoke a specific session
 */
router.post('/revoke', csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sid } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!sid) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Verify the session belongs to this user
    const session = await db
      .select()
      .from(authSessions)
      .where(and(
        eq(authSessions.sid, sid),
        eq(authSessions.userId, userId)
      ))
      .limit(1);

    if (session.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Remove from our tracking table
    await db
      .delete(authSessions)
      .where(eq(authSessions.sid, sid));

    // TODO: Also remove from express-session store if using connect-pg-simple
    // This would require access to the session store instance
    
    res.json({ success: true, message: 'Session revoked successfully' });

  } catch (error) {
    console.error('Failed to revoke session:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

/**
 * Revoke all other sessions (keep current one)
 */
router.post('/revoke-others', csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const currentSessionId = req.sessionID;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!currentSessionId) {
      return res.status(400).json({ error: 'No current session found' });
    }

    // Remove all sessions except the current one
    const deletedSessions = await db
      .delete(authSessions)
      .where(and(
        eq(authSessions.userId, userId),
        ne(authSessions.sid, currentSessionId)
      ))
      .returning();

    // TODO: Also remove from express-session store
    // This would require iterating through sessions and removing them
    
    res.json({ 
      success: true, 
      message: 'All other sessions revoked successfully',
      revokedCount: deletedSessions.length
    });

  } catch (error) {
    console.error('Failed to revoke other sessions:', error);
    res.status(500).json({ error: 'Failed to revoke other sessions' });
  }
});

/**
 * Get session statistics
 */
router.get('/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const sessions = await db
      .select()
      .from(authSessions)
      .where(eq(authSessions.userId, userId));

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats = {
      totalSessions: sessions.length,
      activeLast24h: sessions.filter(s => s.lastSeenAt && s.lastSeenAt > oneDayAgo).length,
      activeLast7d: sessions.filter(s => s.lastSeenAt && s.lastSeenAt > oneWeekAgo).length,
      uniqueIPs: new Set(sessions.map(s => s.ip).filter(Boolean)).size,
      uniqueDevices: new Set(sessions.map(s => s.userAgent).filter(Boolean)).size
    };

    res.json({ stats });

  } catch (error) {
    console.error('Failed to get session stats:', error);
    res.status(500).json({ error: 'Failed to retrieve session statistics' });
  }
});

export default router;