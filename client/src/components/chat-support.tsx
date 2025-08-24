import { MessageCircle } from "lucide-react";

export default function ChatSupport() {
  const handleChatClick = () => {
    // Here you would integrate with your chat service (Intercom, Zendesk, etc.)
    console.log("Opening chat support...");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={handleChatClick}
        data-testid="button-chat-support"
        className="bg-[#D4AF37] hover:bg-[#B8860B] text-black rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
        title="Chat with support"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}