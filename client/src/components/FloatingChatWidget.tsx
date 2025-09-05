import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Minimize2, Paperclip, Users, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePresence } from "@/hooks/usePresence";
import { useTyping } from "@/hooks/useTyping";

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
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  const threadId = "family-chat";
  
  // Real-time hooks
  const { online, lastSeen } = usePresence(currentUser.familyId, currentUser);
  const { typingUsers, notifyTyping, stopTyping } = useTyping(threadId, currentUser);
  
  // Message queries
  const { data: messagesData, isLoading } = useQuery<{ messages: Message[] }>({
    queryKey: [`/api/threads/${threadId}/messages`],
    enabled: isOpen,
    refetchInterval: isExpanded ? 2000 : 10000, // More frequent when expanded
  });
  
  const sendMutation = useMutation({
    mutationFn: async ({ body, fileIds }: { body: string; fileIds: string[] }) => 
      sendMessage(threadId, body, fileIds),
    onSuccess: (message: Message) => {
      queryClient.invalidateQueries({ queryKey: [`/api/threads/${threadId}/messages`] });
      setMessage("");
      setFiles([]);
      stopTyping();
      scrollToBottom();
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

  const handleSendMessage = async () => {
    if (!message.trim() && files.length === 0) return;
    
    // For now, no file upload in widget
    sendMutation.mutate({ body: message.trim(), fileIds: [] });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      notifyTyping();
    }
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
  const unreadCount = messages.length > 0 ? Math.min(messages.length, 9) : 0;
  
  // Message bubble component
  const MessageBubble = ({ message, isMe }: { message: Message; isMe: boolean }) => {
    if (!message || !message.author) return null;
    
    return (
      <div className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''} mb-3`}>
        {!isMe && (
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-medium">
            {message.author.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </div>
        )}
        
        <div className={`flex-1 max-w-[85%] ${isMe ? 'text-right' : ''}`}>
          {!isMe && (
            <div className="text-xs text-white/60 mb-1">{message.author.name || 'Unknown'}</div>
          )}
          
          <div className={`rounded-2xl px-3 py-2 ${
            isMe 
              ? 'bg-[#D4AF37] text-black ml-auto' 
              : 'bg-white/10 text-white'
          }`}>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.body || ''}
            </div>
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
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleToggle}
          className="group relative bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          data-testid="button-floating-chat"
          aria-label="Open family chat"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-[#D4AF37]/30 animate-ping opacity-75 group-hover:opacity-0 transition-opacity"></div>
          
          {/* Notification badge */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount}
            </div>
          )}
        </button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed right-6 z-40 bg-black/95 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
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

          {/* Message Input */}
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => notifyTyping()}
                onBlur={() => stopTyping()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                data-testid="input-chat-message"
                disabled={sendMutation.isPending}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMutation.isPending}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-lg transition-colors"
                data-testid="button-send-message"
              >
                {sendMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
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