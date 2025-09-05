import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

type PresenceData = {
  online: string[];
  users: Array<{ id: string; name?: string; lastSeenAt?: string }>;
};

export function usePresence(familyId: string, selfUser: { id: string; name?: string }) {
  const [online, setOnline] = useState<Set<string>>(new Set());
  const [lastSeen, setLastSeen] = useState<Record<string, string | null>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let active = true;

    // Initial fetch from API
    fetch("/api/presence/family")
      .then(r => r.json())
      .then((data: PresenceData) => {
        if (!active) return;
        setOnline(new Set(data.online));
        const map: Record<string, string | null> = {};
        for (const u of data.users) {
          map[u.id] = u.lastSeenAt || null;
        }
        setLastSeen(map);
      })
      .catch(err => console.warn("Failed to fetch presence:", err));

    // Socket connection for real-time updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const s = io(wsUrl, {
      auth: { 
        user: { 
          id: selfUser.id, 
          familyId,
          name: selfUser.name || selfUser.id
        } 
      }
    });

    s.on("connect", () => {
      // Send heartbeat immediately
      s.emit("presence:ping");
      // Join family room for presence updates
      s.emit("family:join", { familyId });
    });

    // Handle presence events
    s.on("presence:online", ({ userId }) => {
      setOnline(prev => new Set(prev).add(userId));
    });

    s.on("presence:offline", ({ userId }) => {
      setOnline(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Heartbeat every 20 seconds
    const heartbeat = setInterval(() => {
      if (s.connected) {
        s.emit("presence:ping");
      }
    }, 20_000);

    setSocket(s);

    return () => {
      active = false;
      clearInterval(heartbeat);
      s.disconnect();
    };
  }, [familyId, selfUser.id, selfUser.name]);

  return { online, lastSeen, socket };
}