import { useState, useEffect } from "react";
import { MessageSquare, Users, Clock, Dot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Member {
  userId: string;
  name: string | null;
  online?: boolean;
}

interface LastMessage {
  id: string;
  body: string | null;
  authorId: string;
  createdAt: string | null;
}

interface Thread {
  id: string;
  title: string | null;
  kind: string;
  updatedAt: string | null;
  lastMessage: LastMessage | null;
  members: Member[];
  unreadCount: number;
}

interface ThreadsResponse {
  threads: Thread[];
  nextCursor: string | null;
  meta: {
    totalItems: number;
    hasMore: boolean;
  };
}

export function ThreadsList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchThreads();
  }, [searchQuery]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("limit", "20");
      
      if (searchQuery) {
        params.set("q", searchQuery);
      }

      const response = await fetch(`/api/threads?${params}`);
      if (!response.ok) throw new Error("Failed to fetch threads");
      
      const data: ThreadsResponse = await response.json();
      setThreads(data.threads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    try {
      const response = await fetch(`/api/threads/${threadId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Update local state to remove unread count
        setThreads(prev => prev.map(thread => 
          thread.id === threadId 
            ? { ...thread, unreadCount: 0 }
            : thread
        ));
      }
    } catch (err) {
      console.error("Failed to mark thread as read:", err);
    }
  };

  const sendHeartbeat = async () => {
    try {
      await fetch("/api/threads/presence/heartbeat", { method: "POST" });
    } catch (err) {
      console.error("Heartbeat failed:", err);
    }
  };

  // Send heartbeat every 30 seconds
  useEffect(() => {
    sendHeartbeat(); // Initial heartbeat
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatLastMessage = (message: LastMessage | null, members: Member[]) => {
    if (!message) return "No messages yet";

    const author = members.find(m => m.userId === message.authorId);
    const authorName = author?.name || "Unknown";
    
    if (!message.body) {
      return `${authorName}: [Attachment]`;
    }

    const preview = message.body.length > 50 
      ? `${message.body.slice(0, 50)}...`
      : message.body;

    return `${authorName}: ${preview}`;
  };

  const getThreadIcon = (kind: string) => {
    switch (kind) {
      case "dm":
        return <MessageSquare className="w-4 h-4" />;
      case "group":
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">Error: {error}</p>
        <button 
          onClick={fetchThreads}
          className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-gold" />
          Messages
        </h2>
        <div className="text-sm text-gray-400">
          {threads.length} conversations
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
        />
      </div>

      {/* Threads List */}
      <div className="space-y-2">
        {threads.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No conversations yet</p>
            {searchQuery && (
              <p className="text-sm">No results for "{searchQuery}"</p>
            )}
          </div>
        ) : (
          threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                if (thread.unreadCount > 0) {
                  markThreadAsRead(thread.id);
                }
                // In a real app, this would navigate to the thread
                console.log(`Navigate to thread: ${thread.id}`);
              }}
              className="p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg cursor-pointer transition-colors group"
              data-testid={`thread-item-${thread.id}`}
            >
              <div className="flex items-start justify-between">
                {/* Thread Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {getThreadIcon(thread.kind)}
                    <h3 className="text-white font-medium truncate">
                      {thread.title || `${thread.kind.toUpperCase()} Chat`}
                    </h3>
                    {thread.unreadCount > 0 && (
                      <span 
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center"
                        data-testid={`unread-badge-${thread.id}`}
                      >
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <p 
                    className="text-gray-400 text-sm truncate"
                    data-testid={`last-message-${thread.id}`}
                  >
                    {formatLastMessage(thread.lastMessage, thread.members)}
                  </p>
                  
                  {/* Members with Presence */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex -space-x-2">
                      {thread.members.slice(0, 3).map((member) => (
                        <div
                          key={member.userId}
                          className="relative"
                          title={member.name || member.userId}
                        >
                          <div className="w-6 h-6 bg-gold/20 border-2 border-gray-800 rounded-full flex items-center justify-center text-xs text-gold">
                            {(member.name?.[0] || member.userId[0]).toUpperCase()}
                          </div>
                          {member.online && (
                            <Dot className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400" />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {thread.members.filter(m => m.online).length > 0 && (
                        <span className="text-green-400">
                          {thread.members.filter(m => m.online).length} online
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 ml-4">
                  {thread.lastMessage?.createdAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(thread.lastMessage.createdAt), { addSuffix: true })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Total Conversations: {threads.length}</span>
          <span>
            Unread: {threads.reduce((sum, t) => sum + t.unreadCount, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}