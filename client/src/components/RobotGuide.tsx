import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, animate } from "framer-motion";
import { useManusAgent } from "@/hooks/useManusAgent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, MessageCircle, Code, FileText, Database, Terminal } from "lucide-react";

type Step = { selector: string; message: string };
type Props = {
  steps?: Step[];
  start?: boolean;
  onFinish?: () => void;
  initial?: { x: number; y: number };
};

function useCursor() {
  const [p, setP] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  useEffect(() => {
    const h = (e: MouseEvent) => setP({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return p;
}

const Spotlight: React.FC<{ rect: DOMRect | null }> = ({ rect }) => {
  if (!rect) return null;
  const pad = 8;
  const r = new DOMRect(
    rect.left - pad,
    rect.top - pad,
    rect.width + pad * 2,
    rect.height + pad * 2
  );
  const path = `
    M0,0 H${window.innerWidth} V${window.innerHeight} H0 Z
    M${r.left},${r.top} H${r.right} V${r.bottom} H${r.left} Z
  `;
  return createPortal(
    <svg className="fixed inset-0 pointer-events-none z-[9998]">
      <path d={path} fill="rgba(0,0,0,0.5)" fillRule="evenodd" />
      <rect x={r.left} y={r.top} width={r.width} height={r.height}
        className="stroke-[#D4AF37]" fill="transparent" strokeDasharray="6 8" strokeWidth={2}/>
    </svg>,
    document.body
  );
};

export const RobotGuide: React.FC<Props> = ({ steps = [], start, onFinish, initial }) => {
  const [i, setI] = useState(start ? 0 : -1);
  const [showChat, setShowChat] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  // Debug logging
  React.useEffect(() => {
    console.log('🤖 RobotGuide component mounted!');
    return () => console.log('🤖 RobotGuide component unmounted!');
  }, []);
  
  const { 
    askManus, 
    isLoading, 
    conversation, 
    clearConversation, 
    conversationSummary,
    refreshConversation
  } = useManusAgent({ autoload: false }); // Only load when chat is opened
  
  // Load conversation when chat is opened
  useEffect(() => {
    if (showChat) {
      refreshConversation();
    }
  }, [showChat, refreshConversation]);

  const target = useMemo(() => (i >= 0 ? document.querySelector(steps[i]?.selector) as HTMLElement | null : null), [i, steps]);
  const rect = target?.getBoundingClientRect() ?? null;

  // Robot position (floating widget) - debug positioning
  const x = useMotionValue(initial?.x ?? 120);
  const y = useMotionValue(initial?.y ?? 200); // Fixed visible position for debugging
  const { x: cx, y: cy } = useCursor(); // cursor for eye-tracking

  // Fly to target when step changes
  useEffect(() => {
    if (!rect) return;
    const tx = rect.left + rect.width + 24;
    const ty = rect.top + rect.height / 2;
    const controlsX = animate(x, tx, { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] });
    const controlsY = animate(y, ty, { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] });
    return () => { controlsX.stop(); controlsY.stop(); };
  }, [rect]);

  // Idle bobbing when no step
  useEffect(() => {
    if (i >= 0) return;
    const bob = animate(y, (y.get() ?? 0) + 8, { repeat: Infinity, repeatType: "reverse", duration: 1.6, ease: "easeInOut" });
    return () => bob.stop();
  }, [i]);

  // eye tracking
  const eye = (axis: "x" | "y") => {
    const rx = x.get(); const ry = y.get();
    const dx = Math.max(-6, Math.min(6, (cx - rx) / 40));
    const dy = Math.max(-6, Math.min(6, (cy - ry) / 40));
    return axis === "x" ? dx : dy;
  };

  const next = () => {
    if (i + 1 < steps.length) setI(i + 1);
    else { setI(-1); onFinish?.(); }
  };
  const prev = () => setI(Math.max(0, i - 1));
  const open = i >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    
    const userPrompt = prompt;
    setPrompt('');
    await askManus(userPrompt);
  };

  const handleQuickAction = async (action: string) => {
    await askManus(action);
  };

  // Tutorial tooltip near robot
  const TutorialTip = open ? createPortal(
    <div style={{ left: x.get() + 56, top: y.get() - 8 }}
         className="fixed z-[9999] max-w-sm rounded-2xl bg-zinc-900 text-zinc-100 shadow-xl border border-zinc-800 p-3">
      <div className="text-sm">{steps[i]?.message}</div>
      <div className="mt-2 flex gap-2 justify-end">
        {i > 0 && <button onClick={prev} className="px-2 py-1 text-xs rounded bg-zinc-800">Back</button>}
        <button onClick={next} className="px-2 py-1 text-xs rounded bg-[#D4AF37] text-black">
          {i + 1 < steps.length ? "Next" : "Finish"}
        </button>
      </div>
    </div>, document.body
  ) : null;

  // Chat interface
  const ChatInterface = showChat ? createPortal(
    <div style={{ left: x.get() + 56, top: y.get() - 240 }}
         className="fixed z-[9999] w-80 max-h-96 rounded-2xl bg-zinc-900/95 backdrop-blur text-zinc-100 shadow-xl border border-zinc-800">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/95 flex items-center justify-center">
            <div className="w-4 h-2 rounded-full bg-black flex items-center justify-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-white" />
              <div className="w-1 h-1 rounded-full bg-white" />
            </div>
          </div>
          <span className="text-sm font-medium">Manus AI</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowChat(false)}
          className="h-6 w-6 p-0 text-zinc-400 hover:text-zinc-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-zinc-800">
        <div className="text-xs text-zinc-400 mb-2">Quick Actions</div>
        <div className="grid grid-cols-2 gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleQuickAction("List all TypeScript files")}
            className="h-8 justify-start text-xs"
          >
            <FileText className="h-3 w-3 mr-1" />
            List Files
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleQuickAction("Check git status")}
            className="h-8 justify-start text-xs"
          >
            <Code className="h-3 w-3 mr-1" />
            Git Status
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleQuickAction("Show database schema")}
            className="h-8 justify-start text-xs"
          >
            <Database className="h-3 w-3 mr-1" />
            DB Schema
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleQuickAction("Get application logs")}
            className="h-8 justify-start text-xs"
          >
            <Terminal className="h-3 w-3 mr-1" />
            App Logs
          </Button>
        </div>
      </div>

      {/* Conversation */}
      <div className="max-h-48 overflow-y-auto p-3 space-y-2">
        {conversation.messages.length === 0 ? (
          <div className="text-xs text-zinc-500 text-center py-4">
            Hey! I'm your AI assistant. I can help with coding, files, git, database, and more!
          </div>
        ) : (
          conversation.messages.map((msg: any, idx: number) => (
            <div key={idx} className={`text-xs ${msg.role === 'user' ? 'text-zinc-300' : 'text-zinc-100'}`}>
              <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-zinc-800' : 'bg-[#D4AF37]/20'}`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-xs text-zinc-400 animate-pulse p-2">
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 h-8 text-xs bg-zinc-800 border-zinc-700"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!prompt.trim() || isLoading}
            className="h-8 w-8 p-0 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </form>
    </div>, document.body
  ) : null;

  return (
    <>
      <Spotlight rect={open ? rect : null} />
      {TutorialTip}
      {ChatInterface}
      
      {/* DEBUG: Render robot directly in component (not portal) */}
      <div className="fixed top-10 left-10 z-[9999] bg-red-500 text-white p-4 rounded">
        DEBUG: RobotGuide is rendered!
      </div>
      
      <motion.div
        className="fixed z-[9999] cursor-grab active:cursor-grabbing"
        style={{ left: '120px', top: '200px' }}
      >
        {/* Robot orb - VISIBLE DEBUG VERSION */}
        <motion.div
          className="w-20 h-20 rounded-full bg-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,.8)] flex items-center justify-center border-4 border-zinc-900 cursor-pointer"
          animate={{ 
            scale: [1, 1.1, 1], 
            boxShadow: "0 0 60px rgba(212,175,55,.9)"
          }}
          transition={{ duration: 1, repeat: Infinity }}
          onClick={() => setShowChat(!showChat)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Robot face - black oval visor with white dots for eyes */}
          <div className="relative w-10 h-6 rounded-full bg-black">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </div>
        </motion.div>

        {/* Chat indicator */}
        {!showChat && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <MessageCircle className="h-2 w-2 text-black" />
          </motion.div>
        )}
      </motion.div>
    </>
  );
};