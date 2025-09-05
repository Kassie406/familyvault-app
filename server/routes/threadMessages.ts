import { Router } from "express";
import { getThreadMessages, getThreadSummary, markMessagesAsRead } from "../repositories/threadMessagesRepo.js";

const router = Router();

/**
 * GET /api/threads/:id/messages?limit=50&cursor=...&order=newest
 * Get paginated messages for a specific thread
 */
router.get("/:id/messages", async (req, res) => {
  try {
    const user = { id: "current-user" }; // TODO: Get from auth middleware
    const threadId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 50;
    const cursor = req.query.cursor as string;
    const order = (req.query.order as "newest" | "oldest") || "newest";

    const result = await getThreadMessages({
      threadId,
      userId: user.id,
      limit,
      cursor,
      order,
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching thread messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/**
 * GET /api/threads/:id/summary
 * Get basic thread info without messages
 */
router.get("/:id/summary", async (req, res) => {
  try {
    const threadId = req.params.id;
    const summary = await getThreadSummary(threadId);

    if (!summary) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error fetching thread summary:", error);
    res.status(500).json({ error: "Failed to fetch thread summary" });
  }
});

/**
 * POST /api/threads/:id/messages/mark-read
 * Mark specific messages as read (bulk operation)
 * body: { messageIds: string[] }
 */
router.post("/:id/messages/mark-read", async (req, res) => {
  try {
    const user = { id: "current-user" }; // TODO: Get from auth middleware
    const { messageIds } = req.body as { messageIds: string[] };

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ error: "messageIds array is required" });
    }

    await markMessagesAsRead(messageIds, user.id);

    res.json({ 
      success: true, 
      markedCount: messageIds.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

export default router;