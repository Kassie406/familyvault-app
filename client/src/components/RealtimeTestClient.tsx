import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
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
}

interface TypingUser {
  userId: string;
  userName: string | null;
  threadId: string;
}

interface PresenceUpdate {
  userId: string;
  userName: string | null;
  online: boolean;
  lastSeen?: string;
}

interface RealtimeStats {
  connectedClients: number;
  activeTyping: number;
  timestamp: string;
}

export default function RealtimeTestClient() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [messageInput, setMessageInput] = useState("");
  const [currentThreadId] = useState("test-thread-123");
  const [currentUserId] = useState("test-user-" + Math.random().toString(36).slice(2));
  const [currentFamilyId] = useState("family-1");
  
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-19), `${timestamp}: ${message}`]);
  };

  const connectWebSocket = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/realtime`;
      
      addLog(`Connecting to ${wsUrl}...`);
      const newWs = new WebSocket(wsUrl);
      wsRef.current = newWs;

      newWs.onopen = () => {
        addLog("WebSocket connected! Authenticating...");
        setConnected(true);
        
        // Send authentication
        newWs.send(JSON.stringify({
          type: "auth",
          userId: currentUserId,
          familyId: currentFamilyId,
        }));
      };

      newWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          addLog(`Error parsing message: ${error}`);
        }
      };

      newWs.onclose = () => {
        addLog("WebSocket disconnected");
        setConnected(false);
        setWs(null);
        wsRef.current = null;
      };

      newWs.onerror = (error) => {
        addLog(`WebSocket error: ${error}`);
      };

      setWs(newWs);
    } catch (error) {
      addLog(`Connection failed: ${error}`);
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case "auth:success":
        addLog(`✅ Authenticated as ${currentUserId}`);
        // Join the test thread
        if (wsRef.current) {
          wsRef.current.send(JSON.stringify({
            type: "join:thread",
            threadId: currentThreadId,
          }));
          addLog(`📝 Joined thread ${currentThreadId}`);
        }
        break;

      case "message:new":
        addLog(`💬 New message from ${data.message.author.name}: ${data.message.body?.slice(0, 50)}...`);
        setMessages(prev => [data.message, ...prev]);
        break;

      case "typing:update":
        if (data.isTyping) {
          setTypingUsers(prev => {
            const filtered = prev.filter(u => u.userId !== data.userId || u.threadId !== data.threadId);
            return [...filtered, { userId: data.userId, userName: data.userName, threadId: data.threadId }];
          });
          addLog(`⌨️ ${data.userName || data.userId} is typing...`);
        } else {
          setTypingUsers(prev => prev.filter(u => u.userId !== data.userId || u.threadId !== data.threadId));
          addLog(`⌨️ ${data.userName || data.userId} stopped typing`);
        }
        break;

      case "presence:update":
        if (data.online) {
          setOnlineUsers(prev => new Set([...prev, data.userId]));
          addLog(`🟢 ${data.userName || data.userId} came online`);
        } else {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
          addLog(`🔴 ${data.userName || data.userId} went offline`);
        }
        break;

      case "unread:update":
        addLog(`📬 Unread count updated: ${data.unreadCount} in thread ${data.threadId}`);
        break;

      case "heartbeat:ack":
        // Silent acknowledgment
        break;

      default:
        addLog(`📨 Unknown message type: ${data.type}`);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const response = await fetch(`/api/threads/${currentThreadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: messageInput,
          attachments: [],
        }),
      });

      if (response.ok) {
        addLog(`📤 Sent message: ${messageInput.slice(0, 30)}...`);
        setMessageInput("");
      } else {
        addLog(`❌ Failed to send message: ${response.status}`);
      }
    } catch (error) {
      addLog(`❌ Error sending message: ${error}`);
    }
  };

  const startTyping = () => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({
        type: "typing:start",
        threadId: currentThreadId,
      }));

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Auto-stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  };

  const stopTyping = () => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({
        type: "typing:stop",
        threadId: currentThreadId,
      }));
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const sendHeartbeat = () => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({
        type: "heartbeat",
      }));
      addLog("💓 Heartbeat sent");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/realtime/stats");
      const data = await response.json();
      setStats(data);
      addLog(`📊 Stats: ${data.connectedClients} clients, ${data.activeTyping} typing`);
    } catch (error) {
      addLog(`❌ Error fetching stats: ${error}`);
    }
  };

  useEffect(() => {
    // Auto-fetch stats every 5 seconds
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">🚀 Realtime Chat Test Client</h1>
        <p className="text-gray-400">Test WebSocket messaging, typing indicators & presence</p>
      </div>

      {/* Connection Controls */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={connectWebSocket} 
              disabled={connected}
              variant={connected ? "secondary" : "default"}
            >
              {connected ? "Connected" : "Connect WebSocket"}
            </Button>
            <Button 
              onClick={disconnect} 
              disabled={!connected}
              variant="destructive"
            >
              Disconnect
            </Button>
            <Button onClick={sendHeartbeat} disabled={!connected}>
              Send Heartbeat
            </Button>
            <Button onClick={fetchStats}>
              Refresh Stats
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-gray-400">
              <strong>User ID:</strong> {currentUserId}
            </div>
            <div className="text-gray-400">
              <strong>Thread ID:</strong> {currentThreadId}
            </div>
            <div className="text-gray-400">
              <strong>Family ID:</strong> {currentFamilyId}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Presence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📊 Realtime Stats</CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Connected Clients:</span>
                  <Badge variant="outline">{stats.connectedClients}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Typing:</span>
                  <Badge variant="outline">{stats.activeTyping}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-xs text-gray-500">
                    {new Date(stats.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No stats available</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">👥 Online Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(onlineUsers).map(userId => (
                <Badge key={userId} variant="outline" className="mr-2">
                  🟢 {userId}
                </Badge>
              ))}
              {onlineUsers.size === 0 && (
                <p className="text-gray-500 text-sm">No users online</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message Sending */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">💬 Send Test Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                } else {
                  startTyping();
                }
              }}
              onBlur={stopTyping}
              placeholder="Type a message and press Enter..."
              className="bg-gray-800 border-gray-600 text-white"
              disabled={!connected}
            />
            <Button onClick={sendMessage} disabled={!connected || !messageInput.trim()}>
              Send
            </Button>
          </div>
          
          {/* Typing Indicators */}
          {typingUsers.length > 0 && (
            <div className="mt-3 text-sm text-gray-400">
              ⌨️ {typingUsers.map(u => u.userName || u.userId).join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📬 Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet. Send one above!</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-3 bg-gray-800 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {msg.author.name || msg.authorId}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-white text-sm">{msg.body}</p>
                      {msg.attachments.length > 0 && (
                        <div className="mt-2 text-xs text-gray-400">
                          📎 {msg.attachments.length} attachment(s)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📋 Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-1 font-mono text-xs">
                {logs.map((log, index) => (
                  <div key={index} className="text-gray-300 break-all">
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <p className="text-gray-500">Activity will appear here...</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}