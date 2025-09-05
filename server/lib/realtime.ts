import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { markUserOnline, markUserOffline } from "./presence.js";
import { redisPresence } from "./redis-presence.js";

interface ClientConnection {
  ws: WebSocket;
  userId: string;
  familyId: string;
  threadIds: Set<string>;
  lastActivity: Date;
}

interface MessageBroadcast {
  type: "message:new";
  threadId: string;
  message: {
    id: string;
    threadId: string;
    authorId: string;
    body: string | null;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
    };
    attachments: Array<{
      id: string;
      name: string;
      url: string;
      thumbnailUrl?: string | null;
    }>;
  };
}

interface TypingBroadcast {
  type: "typing:update";
  threadId: string;
  userId: string;
  userName: string | null;
  isTyping: boolean;
}

interface PresenceBroadcast {
  type: "presence:update";
  userId: string;
  userName: string | null;
  online: boolean;
  lastSeen?: string;
}

interface UnreadBroadcast {
  type: "unread:update";
  threadId: string;
  userId: string;
  unreadCount: number;
}

type RealtimeBroadcast = MessageBroadcast | TypingBroadcast | PresenceBroadcast | UnreadBroadcast;

class RealtimeManager {
  private clients = new Map<string, ClientConnection>();
  private typingUsers = new Map<string, Map<string, NodeJS.Timeout>>(); // threadId -> userId -> timeout

  constructor(private wss: WebSocketServer) {
    this.setupWebSocketHandlers();
    this.startCleanupInterval();
  }

  private setupWebSocketHandlers() {
    this.wss.on("connection", (ws, request) => {
      console.log("[realtime] New WebSocket connection");
      
      // Wait for authentication message
      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error("[realtime] Invalid message:", error);
          ws.close(1003, "Invalid JSON");
        }
      });

      ws.on("close", () => {
        this.handleClientDisconnect(ws);
      });

      ws.on("error", (error) => {
        console.error("[realtime] WebSocket error:", error);
        this.handleClientDisconnect(ws);
      });
    });
  }

  private handleClientMessage(ws: WebSocket, message: any) {
    const clientId = this.getClientId(ws);
    
    switch (message.type) {
      case "auth":
        this.handleAuth(ws, message);
        break;
        
      case "join:thread":
        this.handleJoinThread(clientId, message.threadId);
        break;
        
      case "leave:thread":
        this.handleLeaveThread(clientId, message.threadId);
        break;
        
      case "typing:start":
        this.handleTypingStart(clientId, message.threadId);
        break;
        
      case "typing:stop":
        this.handleTypingStop(clientId, message.threadId);
        break;
        
      case "heartbeat":
        this.handleHeartbeat(clientId);
        break;
    }
  }

  private handleAuth(ws: WebSocket, message: { userId: string; familyId: string }) {
    const clientId = this.generateClientId();
    const client: ClientConnection = {
      ws,
      userId: message.userId,
      familyId: message.familyId,
      threadIds: new Set(),
      lastActivity: new Date(),
    };
    
    this.clients.set(clientId, client);
    (ws as any).clientId = clientId;
    
    // Mark user as online with Redis presence
    redisPresence.markOnline(message.familyId, message.userId);
    markUserOnline(message.familyId, message.userId); // Keep legacy for now
    
    // Broadcast presence update
    this.broadcastToFamily(message.familyId, {
      type: "presence:update",
      userId: message.userId,
      userName: null, // Could be enhanced with user lookup
      online: true,
    }, message.userId);

    // Send authentication success
    ws.send(JSON.stringify({
      type: "auth:success",
      clientId,
      timestamp: new Date().toISOString(),
    }));

    console.log(`[realtime] User ${message.userId} authenticated`);
  }

  private handleJoinThread(clientId: string, threadId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.threadIds.add(threadId);
    client.lastActivity = new Date();
    
    console.log(`[realtime] User ${client.userId} joined thread ${threadId}`);
  }

  private handleLeaveThread(clientId: string, threadId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.threadIds.delete(threadId);
    
    // Clear typing status when leaving
    this.handleTypingStop(clientId, threadId);
    
    console.log(`[realtime] User ${client.userId} left thread ${threadId}`);
  }

  private handleTypingStart(clientId: string, threadId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.lastActivity = new Date();

    // Clear existing typing timeout
    const threadTyping = this.typingUsers.get(threadId) || new Map();
    const existingTimeout = threadTyping.get(client.userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new typing timeout (5 seconds)
    const timeout = setTimeout(() => {
      this.handleTypingStop(clientId, threadId);
    }, 5000);

    threadTyping.set(client.userId, timeout);
    this.typingUsers.set(threadId, threadTyping);

    // Broadcast typing start to thread members (except sender)
    this.broadcastToThread(threadId, {
      type: "typing:update",
      threadId,
      userId: client.userId,
      userName: null,
      isTyping: true,
    }, client.userId);
  }

  private handleTypingStop(clientId: string, threadId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Clear typing timeout
    const threadTyping = this.typingUsers.get(threadId);
    if (threadTyping) {
      const timeout = threadTyping.get(client.userId);
      if (timeout) {
        clearTimeout(timeout);
        threadTyping.delete(client.userId);
      }
      
      if (threadTyping.size === 0) {
        this.typingUsers.delete(threadId);
      }
    }

    // Broadcast typing stop to thread members (except sender)
    this.broadcastToThread(threadId, {
      type: "typing:update",
      threadId,
      userId: client.userId,
      userName: null,
      isTyping: false,
    }, client.userId);
  }

  private handleHeartbeat(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.lastActivity = new Date();
    
    // Update presence
    markUserOnline(client.familyId, client.userId);
    
    // Send heartbeat response
    client.ws.send(JSON.stringify({
      type: "heartbeat:ack",
      timestamp: new Date().toISOString(),
    }));
  }

  private async handleClientDisconnect(ws: WebSocket) {
    const clientId = this.getClientId(ws);
    const client = this.clients.get(clientId);
    
    if (client) {
      // Mark user as offline with Redis presence
      await redisPresence.markOffline(client.familyId, client.userId);
      markUserOffline(client.familyId, client.userId); // Keep legacy for now
      
      // Clear all typing indicators
      for (const threadId of Array.from(client.threadIds)) {
        this.handleTypingStop(clientId, threadId);
      }
      
      // Broadcast offline status
      this.broadcastToFamily(client.familyId, {
        type: "presence:update",
        userId: client.userId,
        userName: null,
        online: false,
        lastSeen: new Date().toISOString(),
      }, client.userId);
      
      this.clients.delete(clientId);
      console.log(`[realtime] User ${client.userId} disconnected`);
    }
  }

  // Public API methods for broadcasting from other parts of the application

  broadcastNewMessage(message: MessageBroadcast["message"]) {
    const broadcast: MessageBroadcast = {
      type: "message:new",
      threadId: message.threadId,
      message,
    };

    this.broadcastToThread(message.threadId, broadcast, message.authorId);
    console.log(`[realtime] Broadcasted new message in thread ${message.threadId}`);
  }

  broadcastUnreadUpdate(threadId: string, userId: string, unreadCount: number) {
    const client = this.findClientByUserId(userId);
    if (client) {
      const broadcast: UnreadBroadcast = {
        type: "unread:update",
        threadId,
        userId,
        unreadCount,
      };
      
      this.sendToClient(client, broadcast);
    }
  }

  async broadcastPresenceUpdate(familyId: string, userId: string, online: boolean, userName?: string) {
    // Send heartbeat to Redis if user is online
    if (online) {
      await redisPresence.updateHeartbeat(familyId, userId);
    }
    const broadcast: PresenceBroadcast = {
      type: "presence:update",
      userId,
      userName: userName || null,
      online,
      lastSeen: online ? undefined : new Date().toISOString(),
    };

    this.broadcastToFamily(familyId, broadcast, userId);
  }

  // Private helper methods

  private broadcastToThread(threadId: string, message: RealtimeBroadcast, excludeUserId?: string) {
    for (const client of Array.from(this.clients.values())) {
      if (client.threadIds.has(threadId) && client.userId !== excludeUserId) {
        this.sendToClient(client, message);
      }
    }
  }

  private broadcastToFamily(familyId: string, message: RealtimeBroadcast, excludeUserId?: string) {
    for (const client of Array.from(this.clients.values())) {
      if (client.familyId === familyId && client.userId !== excludeUserId) {
        this.sendToClient(client, message);
      }
    }
  }

  private sendToClient(client: ClientConnection, message: RealtimeBroadcast) {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error("[realtime] Error sending message:", error);
      }
    }
  }

  private findClientByUserId(userId: string): ClientConnection | undefined {
    for (const client of Array.from(this.clients.values())) {
      if (client.userId === userId) {
        return client;
      }
    }
    return undefined;
  }

  private getClientId(ws: WebSocket): string {
    return (ws as any).clientId || "";
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  private startCleanupInterval() {
    // Clean up inactive connections every 5 minutes
    setInterval(() => {
      const now = new Date();
      const staleThreshold = 10 * 60 * 1000; // 10 minutes

      for (const [clientId, client] of Array.from(this.clients.entries())) {
        if (now.getTime() - client.lastActivity.getTime() > staleThreshold) {
          console.log(`[realtime] Cleaning up stale connection for user ${client.userId}`);
          client.ws.close(1001, "Connection timeout");
          this.handleClientDisconnect(client.ws);
        }
      }
    }, 5 * 60 * 1000);
  }

  // Health check method
  getStats() {
    return {
      connectedClients: this.clients.size,
      activeTyping: this.typingUsers.size,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export let realtimeManager: RealtimeManager | null = null;

export function initializeRealtime(server: Server) {
  const wss = new WebSocketServer({ 
    server, 
    path: '/realtime',
    clientTracking: true,
  });
  
  realtimeManager = new RealtimeManager(wss);
  console.log("[realtime] Real-time messaging system initialized on /realtime");
  
  return realtimeManager;
}

export function getRealtimeManager(): RealtimeManager | null {
  return realtimeManager;
}