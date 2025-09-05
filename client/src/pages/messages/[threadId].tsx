import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Paperclip, ImageIcon, File, Loader2, Search, X } from "lucide-react";
import { Link, useParams } from "wouter";
import { ThreadHeader } from "@/components/messages/ThreadHeader";
import { TypingBar } from "@/components/messages/TypingBar";
import { usePresence } from "@/hooks/usePresence";
import { useTyping } from "@/hooks/useTyping";

/** ---------------------------------------------
 * Helper Functions
 * --------------------------------------------- */
const pickAuthorName = (m: any): string => {
  return (
    m?.author?.name ??
    m?.authorName ??
    m?.senderName ??
    m?.user?.name ??
    m?.fromName ??
    ""
  );
};

const initialsOf = (name: string): string => {
  const trimmed = (name || "").trim();
  if (!trimmed) return "??";
  return trimmed
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/** ---------------------------------------------
 * Types
 * --------------------------------------------- */
type MessageUser = { id: string; name?: string; avatarUrl?: string | null };
type Message = {
  id: string;
  body: string;
  author?: MessageUser;        // optional
  authorName?: string;         // optional fallback
  senderName?: string;         // optional fallback
  attachments: Array<{ id: string; name: string; url: string; type?: string }>;
  createdAt: string;
  kind?: "message" | "system";
};

type Thread = {
  id: string;
  title: string;
  memberIds: string[];
  memberNames: string[];
};

/** ---------------------------------------------
 * API calls
 * --------------------------------------------- */
async function fetchThread(threadId: string): Promise<Thread> {
  const response = await fetch(`/api/threads/${threadId}`);
  if (!response.ok) throw new Error("Failed to fetch thread");
  return response.json();
}

async function fetchMessages(threadId: string): Promise<{ messages: Message[] }> {
  const response = await fetch(`/api/threads/${threadId}/messages`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
}

async function sendMessage(threadId: string, body: string, fileIds: string[]): Promise<Message> {
  const response = await fetch(`/api/threads/${threadId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, fileIds }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  const result = await response.json();
  return result.message;
}

async function uploadFiles(files: File[]): Promise<string[]> {
  if (!files.length) return [];
  
  const fileIds: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    fileIds.push(result.fileId);
  }
  return fileIds;
}

// Enhanced messaging API calls
async function addReaction(messageId: string, emoji: string): Promise<void> {
  const response = await fetch(`/api/messages/${messageId}/reactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emoji }),
  });
  if (!response.ok) throw new Error("Failed to add reaction");
}

async function removeReaction(messageId: string, emoji: string): Promise<void> {
  const response = await fetch(`/api/messages/${messageId}/reactions/${emoji}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to remove reaction");
}

async function fetchReactions(messageId: string): Promise<any[]> {
  const response = await fetch(`/api/messages/${messageId}/reactions`);
  if (!response.ok) throw new Error("Failed to fetch reactions");
  const result = await response.json();
  return result.reactions;
}

async function markAsRead(messageId: string): Promise<void> {
  const response = await fetch(`/api/messages/${messageId}/read`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to mark as read");
}

async function searchMessages(query: string, threadId?: string): Promise<{ messages: Message[] }> {
  const params = new URLSearchParams({ q: query });
  if (threadId) params.append('threadId', threadId);
  
  const response = await fetch(`/api/messages/search?${params}`);
  if (!response.ok) throw new Error("Failed to search messages");
  return response.json();
}

/** ---------------------------------------------
 * Components
 * --------------------------------------------- */
const MessageSearch: React.FC<{
  threadId: string;
  onClose: () => void;
}> = ({ threadId, onClose }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchMutation = useMutation({
    mutationFn: (searchQuery: string) => searchMessages(searchQuery, threadId),
    onMutate: () => setIsSearching(true),
    onSuccess: (data) => {
      setSearchResults(data.messages);
      setIsSearching(false);
    },
    onError: () => setIsSearching(false),
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length >= 2) {
      searchMutation.mutate(searchQuery.trim());
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="absolute inset-0 bg-[var(--bg-900)] z-50 flex flex-col">
      {/* Search Header */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[var(--bg-800)]">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition"
          data-testid="button-close-search"
        >
          <X className="h-5 w-5 text-white/70" />
        </button>
        
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            data-testid="input-search-messages"
            autoFocus
          />
        </div>
        
        {isSearching && (
          <Loader2 className="h-5 w-5 animate-spin text-[#D4AF37]" />
        )}
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {query.length < 2 ? (
          <div className="text-center text-white/40 mt-8">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Type at least 2 characters to search</p>
          </div>
        ) : searchResults.length === 0 && !isSearching ? (
          <div className="text-center text-white/40 mt-8">
            <p>No messages found for "{query}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {searchResults.map((message) => (
              <div
                key={message.id}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition cursor-pointer"
                data-testid={`search-result-${message.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-medium flex-shrink-0">
                    {initialsOf(pickAuthorName(message))}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white/80">{pickAuthorName(message)}</span>
                      <span className="text-xs text-white/40">{formatTime(message.createdAt)}</span>
                    </div>
                    
                    <div className="text-sm text-white/90 leading-relaxed">
                      {message.body ? (
                        <span dangerouslySetInnerHTML={{
                          __html: message.body.replace(
                            new RegExp(`(${query})`, 'gi'),
                            '<mark class="bg-[#D4AF37]/30 text-[#D4AF37] px-1 rounded">$1</mark>'
                          )
                        }} />
                      ) : (
                        <span className="text-white/50 italic">Message with attachments</span>
                      )}
                    </div>
                    
                    {message.attachments.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-white/60">
                        <Paperclip className="h-3 w-3" />
                        <span>{message.attachments.length} attachment{message.attachments.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const MessageBubble: React.FC<{ message: Message; isMe: boolean }> = ({ message, isMe }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<any[]>([]);
  const queryClient = useQueryClient();

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Fetch reactions for this message
  const { data: reactionsData } = useQuery({
    queryKey: ["reactions", message.id],
    queryFn: () => fetchReactions(message.id),
    refetchInterval: 5000, // Poll for reaction updates
  });

  useEffect(() => {
    if (reactionsData) {
      setReactions(reactionsData);
    }
  }, [reactionsData]);

  // Mark message as read when it comes into view
  useEffect(() => {
    if (!isMe) {
      markAsRead(message.id).catch(console.error);
    }
  }, [message.id, isMe]);

  const reactionMutation = useMutation({
    mutationFn: async ({ emoji, action }: { emoji: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        await addReaction(message.id, emoji);
      } else {
        await removeReaction(message.id, emoji);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reactions", message.id] });
    },
  });

  const handleReaction = (emoji: string) => {
    const currentUserId = "current-user"; // TODO: Get from auth context
    const userReaction = reactions.find(r => r.userId === currentUserId && r.emoji === emoji);
    
    if (userReaction) {
      reactionMutation.mutate({ emoji, action: 'remove' });
    } else {
      reactionMutation.mutate({ emoji, action: 'add' });
    }
    setShowReactions(false);
  };

  // Group reactions by emoji and count them
  const groupedReactions = reactions.reduce((acc: Record<string, { count: number; users: string[] }>, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { count: 0, users: [] };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.userId);
    return acc;
  }, {});

  const popularEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

  return (
    <div className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-medium mt-1">
          {initialsOf(pickAuthorName(message))}
        </div>
      )}
      
      <div className={`flex-1 max-w-[70%] ${isMe ? 'text-right' : ''} relative`}>
        {!isMe && (
          <div className="text-xs text-white/60 mb-1">{pickAuthorName(message)}</div>
        )}
        
        <div className={`rounded-2xl px-4 py-3 relative ${
          isMe 
            ? 'bg-[#D4AF37] text-black ml-auto' 
            : 'bg-white/10 text-white'
        }`}>
          {message.body && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.body}
            </div>
          )}
          
          {message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`flex items-center gap-2 p-2 rounded border ${
                    isMe ? 'border-black/20 bg-black/10' : 'border-white/20 bg-white/10'
                  }`}
                >
                  {attachment.type?.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <File className="h-4 w-4" />
                  )}
                  <span className="text-xs truncate max-w-[120px]">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reaction button - appears on hover */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`absolute -bottom-2 ${isMe ? 'left-4' : 'right-4'} opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center text-xs`}
            data-testid={`button-add-reaction-${message.id}`}
          >
            😊
          </button>

          {/* Reaction picker */}
          {showReactions && (
            <div className={`absolute ${isMe ? 'left-4' : 'right-4'} top-full mt-2 bg-[var(--bg-800)] border border-white/10 rounded-lg p-2 flex gap-1 z-10 shadow-lg`}>
              {popularEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="hover:bg-white/10 rounded px-2 py-1 text-lg transition-colors"
                  data-testid={`button-reaction-${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Display existing reactions */}
        {Object.keys(groupedReactions).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-2 ${isMe ? 'justify-end' : ''}`}>
            {Object.entries(groupedReactions).map(([emoji, data]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors"
                data-testid={`reaction-count-${emoji}`}
              >
                <span>{emoji}</span>
                <span className="text-white/80">{data.count}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="text-xs text-white/40 mt-1">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
};

const MessageComposer: React.FC<{
  threadId: string;
  onMessageSent?: () => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}> = ({ threadId, onMessageSent, onTyping, onStopTyping }) => {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: async () => {
      setSending(true);
      const fileIds = await uploadFiles(files);
      return sendMessage(threadId, body, fileIds);
    },
    onSuccess: () => {
      setBody("");
      setFiles([]);
      queryClient.invalidateQueries({ queryKey: ["messages", threadId] });
      onMessageSent?.();
    },
    onSettled: () => setSending(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((body.trim() || files.length > 0) && !sending) {
      onStopTyping?.();
      sendMutation.mutate();
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    onTyping?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-white/10 p-4">
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div 
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg text-xs text-white/80"
              data-testid={`file-preview-${i}`}
            >
              <ImageIcon className="h-4 w-4" />
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                className="text-white/60 hover:text-white/90"
                data-testid={`button-remove-file-${i}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={body}
            onChange={handleBodyChange}
            onKeyDown={handleKeyDown}
            onBlur={onStopTyping}
            placeholder="Type a message..."
            rows={2}
            className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
            data-testid="textarea-message-compose"
          />
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-file-attachment"
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition"
          data-testid="button-attach-file"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <button
          type="submit"
          disabled={(!body.trim() && files.length === 0) || sending}
          className="px-4 py-3 rounded-xl bg-[#D4AF37] text-black font-medium hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          data-testid="button-send-message"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

/** ---------------------------------------------
 * Main Component
 * --------------------------------------------- */
type Props = {
  threadId?: string;
  onBack?: () => void;
};

export const MessagesPage: React.FC<Props> = ({ threadId: propThreadId, onBack }) => {
  try {
    const params = useParams<{ threadId?: string }>();
    const threadId = propThreadId || params.threadId || "family-chat";
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showSearch, setShowSearch] = useState(false);

    // Mock current user - in production, get from auth context
    const currentUser = { id: "current-user", name: "You", familyId: "family-1" };
    
    // Early return if currentUser is not available
    if (!currentUser || !currentUser.id) {
      return (
        <div className="h-screen bg-[var(--bg-900)] flex items-center justify-center">
          <div className="flex items-center gap-3 text-white/60">
            <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
            <span>Loading user...</span>
          </div>
        </div>
      );
    }

  // Fetch thread info
  const { data: thread, isLoading: threadLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => fetchThread(threadId),
  });

  // Fetch messages
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () => fetchMessages(threadId),
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  // Presence and typing hooks
  const { online, lastSeen } = usePresence(currentUser.familyId, currentUser);
  const { typingUsers, notifyTyping, stopTyping } = useTyping(threadId, currentUser);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData?.messages]);

  if (threadLoading || messagesLoading) {
    return (
      <div className="h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  // Mock thread members for demo - in production, get from thread data
  const threadMembers = [
    { id: "user-1", name: "Alice" },
    { id: "user-2", name: "Bob" },
    { id: currentUser?.id || "current-user", name: currentUser?.name || "You" },
  ];

  // Get typing user names
  const typingNames = Array.from(typingUsers)
    .map(userId => threadMembers.find(m => m.id === userId)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="h-screen bg-[var(--bg-900)] flex flex-col relative">
      {/* Search Component */}
      {showSearch && (
        <MessageSearch
          threadId={threadId}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Header with presence indicators */}
      <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[var(--bg-800)]">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
        )}
        <Link href="/family">
          <button className="p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
        </Link>
        
        <div className="flex-1">
          <ThreadHeader
            members={threadMembers}
            online={online}
            lastSeen={lastSeen}
            title={thread?.title || "Family Chat"}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={() => setShowSearch(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
          data-testid="button-open-search"
        >
          <Search className="h-5 w-5 text-white/70" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesData?.messages && messagesData.messages.length > 0 ? (
          messagesData.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isMe={message?.author?.id === currentUser?.id}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-white/40">
            <div className="text-center">
              <div className="text-lg mb-2">No messages yet</div>
              <div className="text-sm">Start the conversation!</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      <TypingBar names={typingNames} />

      {/* Composer */}
      <MessageComposer 
        threadId={threadId} 
        onTyping={notifyTyping}
        onStopTyping={stopTyping}
      />
    </div>
  );
  } catch (error) {
    console.error("Error in MessagesPage:", error);
    return (
      <div className="h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <div className="text-center">
            <div className="text-lg mb-2 text-red-400">Error loading messages</div>
            <div className="text-sm">Please refresh the page</div>
          </div>
        </div>
      </div>
    );
  }
};

export default MessagesPage;