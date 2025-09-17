import { useState, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";

export default function ChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightChat, setHighlightChat] = useState(false);

  // Listen for openFamilyChat event from Send Message slot card
  useEffect(() => {
    const handleOpenFamilyChat = () => {
      setIsOpen(true);
      setHighlightChat(true);
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightChat(false);
      }, 3000);
    };

    window.addEventListener('openFamilyChat', handleOpenFamilyChat);
    return () => window.removeEventListener('openFamilyChat', handleOpenFamilyChat);
  }, []);

  const supportTopics = [
    "About",
    "Dashboard Guides",
    "Billing",
    "Feature Request", 
    "Report an Issue",
    "Something Else"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          data-testid="button-chat-support"
          className="icon-btn bg-[#FFD700] p-4 rounded-full shadow-lg transition-all duration-300 transform
                     hover:bg-[#d4af37]/10 
                     focus-visible:bg-[#d4af37]/15 
                     active:bg-[#d4af37]/20 
                     focus:outline-none hover:scale-105"
        >
          <MessageCircle className="h-6 w-6 text-black" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className={`w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-in slide-in-from-bottom-2 duration-300 ${
          highlightChat ? 'upload-highlight' : ''
        }`}>
          {/* Header */}
          <div className="flex justify-between items-center bg-[#0a0a0a] text-white px-4 py-3 rounded-t-lg">
            <div>
              <h2 className="font-bold text-sm">Welcome to FamilyCircle Secure Support</h2>
              <p className="text-xs text-gray-300">Instant answers + live support</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
              className="hover:bg-gray-700 p-1 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Bot Greeting */}
          <div className="p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">FV</span>
              </div>
              <div className="text-gray-700">
                <p className="font-medium text-sm mb-1">FamilyCircle Secure Bot</p>
                <p className="text-sm mb-2">👋 Hi! We're here to help!</p>
                <p className="text-sm text-gray-600 mb-4">
                  Please select a topic below to get started:
                </p>
              </div>
            </div>

            {/* Topic Options */}
            <div className="flex flex-col gap-2">
              {supportTopics.map((topic, index) => (
                <button
                  key={index}
                  data-testid={`button-topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}
                  className="border border-[#FFD700] text-[#0a0a0a] rounded-full px-4 py-2 text-sm hover:bg-[#FFD700] hover:text-black transition-all duration-200 text-left"
                >
                  {topic}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                5 minutes ago
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}