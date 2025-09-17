import { db } from "../db.js";
import { messages, messageAttachments, users, messageReadReceipts } from "@shared/schema";
import { and, desc, eq, lt, sql } from "drizzle-orm";

export interface MessageWithAuthor {
  id: string;
  threadId: string;
  authorId: string;
  body: string | null;
  createdAt: Date | null;
  replyToId: string | null;
  author: {
    id: string;
    name: string | null;
    email: string | null;
  };
  attachments: Array<{
    id: string;
    name: string;
    mime: string;
    size: number;
    url: string;
    thumbnailUrl?: string | null;
  }>;
  isRead: boolean; // Whether current user has read this message
}

export interface ThreadMessagesResponse {
  messages: MessageWithAuthor[];
  nextCursor: string | null;
  hasMore: boolean;
  threadInfo: {
    id: string;
    title: string | null;
    memberCount: number;
  };
}

export async function getThreadMessages(opts: {
  threadId: string;
  userId: string;
  limit?: number;
  cursor?: string;
  order?: "newest" | "oldest";
}): Promise<ThreadMessagesResponse> {
  const limit = Math.min(opts.limit ?? 50, 100);
  const order = opts.order ?? "newest";
  
  // Build WHERE conditions for pagination
  let conditions = [eq(messages.threadId, opts.threadId)];
  
  if (opts.cursor) {
    const cursorDate = new Date(opts.cursor);
    if (order === "newest") {
      // For newest first, get messages older than cursor
      conditions.push(lt(messages.createdAt, cursorDate));
    } else {
      // For oldest first, get messages newer than cursor  
      conditions.push(lt(messages.createdAt, cursorDate));
    }
  }

  // Get paginated messages with author info
  const messagesWithAuthors = await db
    .select({
      id: messages.id,
      threadId: messages.threadId,
      authorId: messages.authorId,
      body: messages.body,
      createdAt: messages.createdAt,
      replyToId: messages.replyToId,
      authorName: users.name,
      authorEmail: users.email,
    })
    .from(messages)
    .leftJoin(users, eq(users.id, messages.authorId))
    .where(and(...conditions))
    .orderBy(order === "newest" ? desc(messages.createdAt) : messages.createdAt)
    .limit(limit + 1); // Get one extra to check if there are more

  // Check if there are more messages
  const hasMore = messagesWithAuthors.length > limit;
  const messagesToReturn = hasMore 
    ? messagesWithAuthors.slice(0, limit)
    : messagesWithAuthors;

  // Get message IDs for attachments and read receipts
  const messageIds = messagesToReturn.map(m => m.id);

  // Get attachments for these messages
  const attachmentsData = messageIds.length > 0 
    ? await db
        .select({
          messageId: messageAttachments.messageId,
          id: messageAttachments.id,
          name: messageAttachments.name,
          mime: messageAttachments.mime,
          size: messageAttachments.size,
          url: messageAttachments.url,
          thumbnailUrl: messageAttachments.thumbnailUrl,
        })
        .from(messageAttachments)
        .where(sql`${messageAttachments.messageId} IN (${sql.join(messageIds.map(id => sql`${id}`), sql`, `)})`)
    : [];

  // Group attachments by message ID
  const attachmentsByMessage = new Map<string, typeof attachmentsData>();
  for (const attachment of attachmentsData) {
    if (!attachmentsByMessage.has(attachment.messageId)) {
      attachmentsByMessage.set(attachment.messageId, []);
    }
    attachmentsByMessage.get(attachment.messageId)!.push(attachment);
  }

  // Get read receipts for current user
  const readReceiptsData = messageIds.length > 0
    ? await db
        .select({
          messageId: messageReadReceipts.messageId,
        })
        .from(messageReadReceipts)
        .where(
          and(
            sql`${messageReadReceipts.messageId} IN (${sql.join(messageIds.map(id => sql`${id}`), sql`, `)})`,
            eq(messageReadReceipts.userId, opts.userId)
          )
        )
    : [];

  const readMessageIds = new Set(readReceiptsData.map(r => r.messageId));

  // Compose final message objects
  const finalMessages: MessageWithAuthor[] = messagesToReturn.map(msg => ({
    id: msg.id,
    threadId: msg.threadId,
    authorId: msg.authorId,
    body: msg.body,
    createdAt: msg.createdAt,
    replyToId: msg.replyToId,
    author: {
      id: msg.authorId,
      name: msg.authorName,
      email: msg.authorEmail,
    },
    attachments: (attachmentsByMessage.get(msg.id) || []).map(att => ({
      id: att.id,
      name: att.name,
      mime: att.mime,
      size: att.size,
      url: att.url,
      thumbnailUrl: att.thumbnailUrl,
    })),
    isRead: readMessageIds.has(msg.id),
  }));

  // Generate next cursor from the last message's createdAt
  const nextCursor = hasMore && finalMessages.length > 0
    ? finalMessages[finalMessages.length - 1].createdAt?.toISOString() || null
    : null;

  // Get thread info (title and member count)
  const threadInfoResult = await db.execute<{ 
    title: string | null; 
    memberCount: string; 
  }>(sql`
    SELECT 
      mt.title,
      COUNT(tm.user_id)::text as memberCount
    FROM message_threads mt
    LEFT JOIN thread_members tm ON tm.thread_id = mt.id
    WHERE mt.id = ${opts.threadId}
    GROUP BY mt.id, mt.title
  `);
  const threadInfo = threadInfoResult.rows?.[0];

  return {
    messages: finalMessages,
    nextCursor,
    hasMore,
    threadInfo: {
      id: opts.threadId,
      title: threadInfo?.title || null,
      memberCount: parseInt(threadInfo?.memberCount || "0"),
    },
  };
}

// Helper to get thread summary for quick access
export async function getThreadSummary(threadId: string) {
  const threadResult = await db.execute<{
    id: string;
    title: string | null;
    kind: string;
    memberCount: string;
  }>(sql`
    SELECT 
      mt.id,
      mt.title,
      mt.kind,
      COUNT(tm.user_id)::text as memberCount
    FROM message_threads mt
    LEFT JOIN thread_members tm ON tm.thread_id = mt.id
    WHERE mt.id = ${threadId}
    GROUP BY mt.id, mt.title, mt.kind
  `);
  
  const thread = threadResult.rows?.[0];
  return thread ? {
    id: thread.id,
    title: thread.title,
    kind: thread.kind,
    memberCount: parseInt(thread.memberCount),
  } : null;
}

// Helper to mark multiple messages as read (bulk operation)
export async function markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
  if (messageIds.length === 0) return;

  const receipts = messageIds.map(messageId => ({
    userId,
    messageId,
  }));

  await db.insert(messageReadReceipts).values(receipts).onConflictDoNothing();
}