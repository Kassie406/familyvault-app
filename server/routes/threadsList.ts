import { Router } from "express";
import { listThreadsForUser, markThreadAsRead } from "../repositories/threadsListRepo.js";
import { getOnlineUsersForFamily, heartbeat, getBatchUserPresence } from "../lib/presence.js";

const router = Router();

/**
 * GET /api/threads?limit=20&cursor=...&q=...
 * Returns threads for the logged-in user with lastMessage, unreadCount, members, and presence flags.
 */
router.get("/", async (req, res) => {
  try {
    // For now, using mock user data - this should come from auth middleware
    const user = { 
      id: "current-user", 
      familyId: "family-1" 
    };

    const limit = Number(req.query.limit) || 20;
    const cursor = (req.query.cursor as string) || undefined;
    const q = (req.query.q as string) || undefined;

    // Get threads and online users in parallel
    const [threadsResult, onlineSet] = await Promise.all([
      listThreadsForUser({ 
        userId: user.id, 
        familyId: user.familyId, 
        limit, 
        cursor, 
        q 
      }),
      getOnlineUsersForFamily(user.familyId),
    ]);

    // Decorate members with presence status
    const decorated = threadsResult.items.map((thread) => ({
      ...thread,
      members: thread.members.map((member) => ({
        ...member,
        online: onlineSet.has(member.userId),
      })),
    }));

    res.json({ 
      threads: decorated, 
      nextCursor: threadsResult.nextCursor,
      meta: {
        totalItems: decorated.length,
        hasMore: !!threadsResult.nextCursor,
      }
    });
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

/**
 * POST /api/threads/:id/read
 * Mark all messages in a thread as read for the current user
 */
router.post("/:id/read", async (req, res) => {
  try {
    const user = { id: "current-user" }; // This should come from auth middleware
    const threadId = req.params.id;

    await markThreadAsRead(threadId, user.id);

    res.json({ 
      success: true,
      message: "Thread marked as read"
    });
  } catch (error) {
    console.error("Error marking thread as read:", error);
    res.status(500).json({ error: "Failed to mark thread as read" });
  }
});

/**
 * GET /api/threads/stats
 * Get summary statistics for the user's threads
 */
router.get("/stats", async (req, res) => {
  try {
    const user = { 
      id: "current-user", 
      familyId: "family-1" 
    };

    // Get all threads to calculate stats
    const { items: threads } = await listThreadsForUser({ 
      userId: user.id, 
      familyId: user.familyId, 
      limit: 100 // Get more for accurate stats
    });

    const stats = {
      totalThreads: threads.length,
      unreadThreads: threads.filter(t => t.unreadCount > 0).length,
      totalUnreadMessages: threads.reduce((sum, t) => sum + t.unreadCount, 0),
      activeThreads: threads.filter(t => t.lastMessage).length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching thread stats:", error);
    res.status(500).json({ error: "Failed to fetch thread statistics" });
  }
});

/**
 * POST /api/threads/presence/heartbeat
 * Client heartbeat to maintain online status
 */
router.post("/presence/heartbeat", async (req, res) => {
  try {
    const user = { 
      id: "current-user", 
      familyId: "family-1" 
    };

    await heartbeat(user.familyId, user.id);

    res.json({ 
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error processing heartbeat:", error);
    res.status(500).json({ error: "Failed to process heartbeat" });
  }
});

/**
 * GET /api/threads/presence/:familyId
 * Get online status for all family members
 */
router.get("/presence/:familyId", async (req, res) => {
  try {
    const familyId = req.params.familyId;
    const onlineSet = await getOnlineUsersForFamily(familyId);

    res.json({
      familyId,
      onlineUsers: Array.from(onlineSet),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching family presence:", error);
    res.status(500).json({ error: "Failed to fetch presence information" });
  }
});

/**
 * POST /api/threads/presence/batch
 * Get detailed presence info for specific users
 * body: { userIds: string[] }
 */
router.post("/presence/batch", async (req, res) => {
  try {
    const { userIds } = req.body as { userIds: string[] };
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    const presenceMap = await getBatchUserPresence(userIds);
    
    // Convert Map to object for JSON response
    const presenceData = Object.fromEntries(presenceMap);

    res.json({
      presence: presenceData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching batch presence:", error);
    res.status(500).json({ error: "Failed to fetch batch presence" });
  }
});

export default router;