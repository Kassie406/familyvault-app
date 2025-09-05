import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

type TypingEvent = { userId: string; threadId: string; isTyping: boolean };

export function useTyping(threadId: string, selfUser: { id: string; familyId: string }) {
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const socketRef = useRef<Socket | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const s = io(wsUrl, {
      auth: { 
        user: { 
          id: selfUser.id, 
          familyId: selfUser.familyId,
          name: selfUser.id
        } 
      }
    });

    socketRef.current = s;

    s.on("connect", () => {
      // Join the thread room for typing events
      s.emit("thread:join", { threadId });
    });

    // Handle incoming typing events
    const onTyping = ({ userId, threadId: tId, isTyping }: TypingEvent) => {
      if (tId !== threadId || userId === selfUser.id) return;
      setTypingUsers(prev => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(userId);
        } else {
          next.delete(userId);
        }
        return next;
      });
    };

    s.on("typing", onTyping);

    return () => {
      s.off("typing", onTyping);
      s.emit("thread:leave", { threadId });
      s.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threadId, selfUser.id, selfUser.familyId]);

  // Call this from textarea onChange/onKeyDown
  const notifyTyping = () => {
    socketRef.current?.emit("typing", { threadId, isTyping: true });
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", { threadId, isTyping: false });
    }, 1500); // 1.5s idle window
  };

  // Call on send/blur to force stop typing
  const stopTyping = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    socketRef.current?.emit("typing", { threadId, isTyping: false });
  };

  return { typingUsers, notifyTyping, stopTyping };
}