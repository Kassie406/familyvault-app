import { useState } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { useLocation } from "wouter";

interface FloatingChatWidgetProps {
  onOpenChat?: () => void;
}

export default function FloatingChatWidget({ onOpenChat }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [, setLocation] = useLocation();

  const handleToggle = () => {
    if (!isOpen && onOpenChat) {
      // If there's a custom handler, use it
      onOpenChat();
    } else if (!isOpen) {
      // Otherwise navigate to family messages
      setLocation("/family/messages");
    } else {
      // Just toggle the preview
      setIsOpen(!isOpen);
    }
  };

  const handleSendQuick = () => {
    if (message.trim()) {
      // Navigate to messages with the intent to send this message
      setLocation("/family/messages");
      setMessage("");
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuick();
    }
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
          
          {/* Notification badge (optional - can be dynamic) */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            2
          </div>
        </button>
      </div>

      {/* Chat Preview Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 bg-black/95 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#D4AF37]/10 border-b border-[#D4AF37]/20 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-white font-medium text-sm">Family Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                data-testid="button-minimize-chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                data-testid="button-close-chat-preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Messages Preview */}
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            <div className="text-xs text-white/50 text-center mb-3">Recent messages</div>
            
            {/* Sample messages - in production, these would come from API */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-xs text-[#D4AF37] font-medium">
                  M
                </div>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-xl px-3 py-2">
                    <div className="text-xs text-white/70 mb-1">Mom • 5 min ago</div>
                    <div className="text-sm text-white">Don't forget dinner at 7!</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-xs text-[#D4AF37] font-medium">
                  D
                </div>
                <div className="flex-1">
                  <div className="bg-white/10 rounded-xl px-3 py-2">
                    <div className="text-xs text-white/70 mb-1">Dad • 12 min ago</div>
                    <div className="text-sm text-white">Running late from work</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Input */}
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Quick message..."
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                data-testid="input-quick-message"
              />
              <button
                onClick={handleSendQuick}
                disabled={!message.trim()}
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black p-2 rounded-lg transition-colors"
                data-testid="button-send-quick-message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setLocation("/family/messages");
                setIsOpen(false);
              }}
              className="w-full mt-2 text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
              data-testid="button-open-full-chat"
            >
              Open full chat →
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}