import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, Minimize2, Paperclip, Users, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePresence } from "@/hooks/usePresence";
import { useTyping } from "@/hooks/useTyping";
import ChatComposer from "@/components/ChatComposer";

// Types matching the message system
type Message = {
  id: string;
  body: string;
  author: { id: string; name: string };
  attachments: Array<{ id: string; name: string; url: string; type?: string }>;
  createdAt: string;
};

type Thread = {
  id: string;
  title: string;
  memberIds: string[];
  memberNames: string[];
};

// API functions
async function fetchMessages(threadId: string): Promise<{ messages: Message[] }> {
  const response = await fetch(`/api/threads/${threadId}/messages`);
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
}

async function sendMessage(threadId: string | null, body: string, fileIds: string[]): Promise<Message> {
  // Use fallback route if no threadId is provided
  const url = threadId ? `/api/threads/${threadId}/messages` : `/api/messages`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body, fileIds }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  const result = await response.json();
  return result.message;
}

// Mock current user - in production this would come from auth context
const currentUser = { 
  id: "current-user", 
  name: "You",
  familyId: "family-1" 
};

interface FloatingChatWidgetProps {
  onOpenChat?: () => void;
}

export default function FloatingChatWidget({ onOpenChat }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatId, setChatId] = useState<string | undefined>("family-chat");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Add body flag when chat opens
  useEffect(() => {
    document.body.classList.toggle("chat-open", isOpen);
    return () => document.body.classList.remove("chat-open");
  }, [isOpen]);

  // Listen for custom event to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsExpanded(true);
    };

    window.addEventListener('openFamilyChat', handleOpenChat);
    return () => window.removeEventListener('openFamilyChat', handleOpenChat);
  }, []);
  
  // Fetch default chat ID when component mounts
  useEffect(() => {
    async function fetchDefaultChatId() {
      try {
        const response = await fetch("/api/threads/default");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched default chat ID:", data.id);
          setChatId(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch default chat ID:", error);
        // Fallback to hardcoded value
        setChatId("family-chat");
      }
    }
    fetchDefaultChatId();
  }, []);
  
  // Real-time hooks
  const { online, lastSeen } = usePresence(currentUser.familyId, currentUser);
  const { typingUsers, notifyTyping, stopTyping } = useTyping(chatId || "family-chat", currentUser);
  
  // Message queries
  const { data: messagesData, isLoading } = useQuery<{ messages: Message[] }>({
    queryKey: [`/api/threads/${chatId}/messages`],
    enabled: isOpen && !!chatId,
    refetchInterval: isExpanded ? 2000 : 10000, // More frequent when expanded
  });
  
  const sendMutation = useMutation({
    mutationFn: async ({ body, fileIds }: { body: string; fileIds: string[] }) => {
      if (!chatId) {
        // Use fallback route if no chatId
        return sendMessage(null, body, fileIds);
      }
      return sendMessage(chatId, body, fileIds);
    },
    onSuccess: (message: Message) => {
      // Invalidate queries for both specific thread and fallback route
      if (chatId) {
        queryClient.invalidateQueries({ queryKey: [`/api/threads/${chatId}/messages`] });
      }
      queryClient.invalidateQueries({ queryKey: [`/api/messages`] });
      setMessage("");
      setFiles([]);
      stopTyping();
      scrollToBottom();
    },
    onError: (error: Error) => {
      console.error("Failed to send message:", error);
      // Try sending via fallback route if specific thread fails
      if (chatId && error.message.includes("Failed to send message")) {
        sendMessage(null, message, []).then(() => {
          queryClient.invalidateQueries({ queryKey: [`/api/threads/${chatId}/messages`] });
          setMessage("");
          setFiles([]);
          stopTyping();
          scrollToBottom();
        }).catch(console.error);
      }
    },
  });

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messagesData && messagesData.messages && isExpanded) {
      scrollToBottom();
    }
  }, [messagesData, isExpanded]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (!isExpanded) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
      setIsOpen(false);
    }
  };

  const handleSend = async (text: string, files: any[]) => {
    const fileIds = files.map(f => f.id);
    sendMutation.mutate({ body: text, fileIds });
  };


  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUserOnline = (userId: string) => online.has(userId);
  
  const getLastSeenText = (userId: string) => {
    const lastSeenAt = lastSeen[userId];
    if (!lastSeenAt) return "Never";
    const date = new Date(lastSeenAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const messages = messagesData?.messages || [];
  const familyMembers = [
    { id: "user-1", name: "Alice" },
    { id: "user-2", name: "Bob" },
    { id: "user-3", name: "Mom" },
    { id: "user-4", name: "Dad" },
    { id: currentUser.id, name: currentUser.name },
  ];
  
  // Get typing user names
  const typingNames = Array.from(typingUsers)
    .map(userId => familyMembers.find(m => m.id === userId)?.name)
    .filter(Boolean) as string[];
  const recentMessages = messages.slice(-3); // Show last 3 in preview
  // Only show notification when chat is closed and there are recent messages
  const unreadCount = !isOpen && recentMessages.length > 0 ? recentMessages.length : 0;
  
  // Message bubble component
  const MessageBubble = ({ message, isMe }: { message: Message; isMe: boolean }) => {
    if (!message || !message.body) return null;
    
    // Handle both author object and authorId string from API
    const authorName = message.author?.name || 
                      (message.author?.id === currentUser.id ? currentUser.name : 'Family Member');
    const authorInitials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
    
    return (
      <div className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''} mb-3`}>
        {!isMe && (
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-medium">
            {authorInitials}
          </div>
        )}
        
        <div className={`flex-1 max-w-[85%] ${isMe ? 'text-right' : ''}`}>
          {!isMe && (
            <div className="text-xs text-white/60 mb-1">{authorName}</div>
          )}
          
          <div className={`rounded-2xl px-3 py-2 ${
            isMe 
              ? 'bg-[#D4AF37] text-black ml-auto' 
              : 'bg-white/10 text-white'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.body}
            </div>

            {/* File Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {message.attachments.map((attachment: any, index: number) => 
                  attachment.mime?.startsWith("image/") ? (
                    <a key={attachment.id ?? index} href={attachment.url} target="_blank" rel="noreferrer" className="block">
                      <img
                        src={attachment.thumbnailUrl || attachment.url}
                        alt={attachment.name}
                        className="max-h-40 rounded-lg border border-white/10"
                        loading="lazy"
                        data-testid={`image-attachment-${index}`}
                      />
                    </a>
                  ) : (
                    <div key={attachment.id ?? index} className="bg-black/20 rounded p-2">
                      <a 
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-xs ${
                          isMe ? 'text-black/80 hover:text-black' : 'text-[#D4AF37] hover:text-[#D4AF37]/80'
                        }`}
                        data-testid={`link-attachment-${index}`}
                      >
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate max-w-[180px]">{attachment.name}</span>
                      </a>
                    </div>
                  )
                )}
              </div>
            )}
            <div className={`text-xs mt-1 ${isMe ? 'text-black/60' : 'text-white/50'}`}>
              {message.createdAt ? formatTime(message.createdAt) : ''}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main Chat Button */}
      <button
        id="chat-fab"
        aria-expanded={isOpen}
        aria-pressed={isOpen}
        data-state={isOpen ? "open" : "closed"}
        onClick={handleToggle}
        className={`
          fixed bottom-6 right-6 z-[50] grid place-items-center
          h-14 w-14 rounded-full bg-[#D4AF37] text-black shadow-xl
          transition-transform duration-150 hover:scale-105 active:scale-95
          outline-none focus-visible:ring-2 ring-black/20
          ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        data-testid="button-floating-chat"
        aria-label="Open family chat"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="fab-badge absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                           grid place-items-center rounded-full bg-red-600 text-white text-[10px]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && createPortal(
        <div className={`chat-panel fixed right-6 z-[100] bg-black/95 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isExpanded 
            ? 'bottom-6 w-96 h-[600px]' 
            : 'bottom-24 w-80 h-80'
        }`}>
          {/* Header */}
          <div className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-white font-medium text-sm">Family Chat</span>
              </div>
              
              {/* Online members indicator */}
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-white/50" />
                <span className="text-xs text-white/50">{online.size}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                data-testid="button-expand-chat"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                <Minimize2 className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                data-testid="button-close-chat-widget"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3" style={{ height: isExpanded ? '480px' : '200px' }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" />
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-2">
                {(isExpanded ? messages : recentMessages).map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isMe={message?.author?.id === currentUser?.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/40">
                <div className="text-center">
                  <div className="text-sm mb-1">No messages yet</div>
                  <div className="text-xs">Start the conversation!</div>
                </div>
              </div>
            )}
          </div>

          {/* Typing Indicator */}
          {typingNames.length > 0 && (
            <div className="px-3 py-1 border-t border-white/10">
              <div className="text-xs text-white/50">
                {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
              </div>
            </div>
          )}

          {/* Message Composer */}
          <ChatComposer 
            onSend={handleSend}
            disabled={sendMutation.isPending}
          />
        </div>, 
        document.body
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsOpen(false);
            setIsExpanded(false);
          }}
        />
      )}
    </>
  );
}