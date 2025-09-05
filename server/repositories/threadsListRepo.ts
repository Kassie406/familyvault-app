import { db } from "../db.js";
import { messageThreads, threadMembers, messages, messageReadReceipts, users } from "@shared/schema";
import { and, desc, eq, ilike, sql, gt, count, max } from "drizzle-orm";

export interface ThreadListItem {
  id: string;
  title: string | null;
  kind: string;
  updatedAt: Date | null;
  lastMessage: {
    id: string;
    body: string | null;
    authorId: string;
    createdAt: Date | null;
  } | null;
  members: Array<{
    userId: string;
    name: string | null;
    online?: boolean;
  }>;
  unreadCount: number;
}

export async function listThreadsForUser(opts: {
  userId: string;
  familyId: string;
  limit?: number;
  cursor?: string;
  q?: string;
}): Promise<{ items: ThreadListItem[]; nextCursor: string | null }> {
  const limit = Math.min(opts.limit ?? 20, 100);
  
  // Build WHERE conditions
  let conditions = [
    eq(threadMembers.userId, opts.userId),
    eq(messageThreads.familyId, opts.familyId)
  ];

  // Add search filter if provided
  if (opts.q) {
    conditions.push(ilike(messageThreads.title, `%${opts.q}%`));
  }

  // Add cursor-based pagination
  if (opts.cursor) {
    const cursorDate = new Date(opts.cursor);
    conditions.push(gt(messageThreads.updatedAt, cursorDate));
  }

  // Get threads where the user is a member
  const threads = await db
    .select({
      id: messageThreads.id,
      title: messageThreads.title,
      kind: messageThreads.kind,
      updatedAt: messageThreads.updatedAt,
    })
    .from(messageThreads)
    .innerJoin(threadMembers, eq(threadMembers.threadId, messageThreads.id))
    .where(and(...conditions))
    .orderBy(desc(messageThreads.updatedAt))
    .limit(limit);

  if (threads.length === 0) {
    return { items: [], nextCursor: null };
  }

  const threadIds = threads.map(t => t.id);

  // Get last message for each thread - simplified approach
  const lastMessages = await Promise.all(
    threadIds.map(async (threadId) => {
      const [lastMessage] = await db
        .select({
          threadId: messages.threadId,
          id: messages.id,
          body: messages.body,
          authorId: messages.authorId,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(eq(messages.threadId, threadId))
        .orderBy(desc(messages.createdAt))
        .limit(1);
      
      return lastMessage;
    })
  );

  const lastMessageByThread = new Map(
    lastMessages
      .filter(m => m)
      .map(m => [m!.threadId, m])
  );

  // Get all members for these threads
  const membersByThread = new Map<string, Array<{ userId: string; name: string | null }>>();
  
  for (const threadId of threadIds) {
    const threadMembersResult = await db
      .select({
        userId: threadMembers.userId,
        name: users.name,
      })
      .from(threadMembers)
      .leftJoin(users, eq(users.id, threadMembers.userId))
      .where(eq(threadMembers.threadId, threadId));
    
    membersByThread.set(threadId, threadMembersResult);
  }

  // Calculate unread counts using our existing messageReadReceipts
  const unreadCounts = await calculateUnreadCounts(opts.userId, threadIds);

  // Compose the final items
  const items: ThreadListItem[] = threads.map(thread => {
    const lastMessage = lastMessageByThread.get(thread.id);
    const threadMembers = membersByThread.get(thread.id) || [];
    const unreadCount = unreadCounts.get(thread.id) || 0;

    return {
      id: thread.id,
      title: thread.title,
      kind: thread.kind,
      updatedAt: thread.updatedAt,
      lastMessage: lastMessage ? {
        id: lastMessage.id,
        body: lastMessage.body,
        authorId: lastMessage.authorId,
        createdAt: lastMessage.createdAt,
      } : null,
      members: threadMembers,
      unreadCount,
    };
  });

  // Generate next cursor from the last item's updatedAt
  const nextCursor = items.length === limit && items[items.length - 1].updatedAt
    ? items[items.length - 1].updatedAt!.toISOString()
    : null;

  return { items, nextCursor };
}

async function calculateUnreadCounts(userId: string, threadIds: string[]): Promise<Map<string, number>> {
  const unreadMap = new Map<string, number>();

  // For each thread, count messages that don't have read receipts for this user
  for (const threadId of threadIds) {
    const [result] = await db
      .select({
        totalMessages: count(messages.id),
        readMessages: count(messageReadReceipts.messageId),
      })
      .from(messages)
      .leftJoin(
        messageReadReceipts,
        and(
          eq(messageReadReceipts.messageId, messages.id),
          eq(messageReadReceipts.userId, userId)
        )
      )
      .where(eq(messages.threadId, threadId));

    const unreadCount = (result?.totalMessages || 0) - (result?.readMessages || 0);
    unreadMap.set(threadId, Math.max(0, unreadCount));
  }

  return unreadMap;
}

// Helper to mark thread as read (mark all messages as read)
export async function markThreadAsRead(threadId: string, userId: string): Promise<void> {
  // Get all unread messages in the thread
  const unreadMessages = await db
    .select({ id: messages.id })
    .from(messages)
    .leftJoin(
      messageReadReceipts,
      and(
        eq(messageReadReceipts.messageId, messages.id),
        eq(messageReadReceipts.userId, userId)
      )
    )
    .where(
      and(
        eq(messages.threadId, threadId),
        sql`${messageReadReceipts.messageId} IS NULL`
      )
    );

  // Create read receipts for unread messages
  if (unreadMessages.length > 0) {
    const receipts = unreadMessages.map(msg => ({
      userId,
      messageId: msg.id,
    }));

    await db.insert(messageReadReceipts).values(receipts).onConflictDoNothing();
  }
}

// This is now handled by the dedicated presence system in server/lib/presence.ts
// No need for the old getOnlineUsersForFamily implementation here