import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import IORedis from "ioredis";
import type { Server as HttpServer } from "http";

let io: Server | null = null;

export function createIoServer(httpServer: HttpServer) {
  // Use Redis for Socket.IO adapter (same Redis as BullMQ for efficiency)
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const pub = new IORedis(redisUrl);
  const sub = new IORedis(redisUrl);

  io = new Server(httpServer, {
    cors: { 
      origin: process.env.WEB_ORIGIN ?? true, 
      credentials: true 
    },
    path: "/socket.io/", // Avoid conflicts with Vite HMR
  });

  // Use Redis adapter for multi-instance scaling
  io.adapter(createAdapter(pub, sub));

  // Handle client connections
  io.on("connection", (socket) => {
    console.log(`[realtime] Client connected: ${socket.id}`);

    // Client requests to watch a specific file for updates
    socket.on("file:watch", ({ fileId }) => {
      if (typeof fileId === 'string' && fileId.length > 0) {
        socket.join(`file:${fileId}`);
        console.log(`[realtime] Client ${socket.id} watching file:${fileId}`);
      }
    });

    // Client stops watching a file
    socket.on("file:unwatch", ({ fileId }) => {
      if (typeof fileId === 'string' && fileId.length > 0) {
        socket.leave(`file:${fileId}`);
        console.log(`[realtime] Client ${socket.id} unwatching file:${fileId}`);
      }
    });

    // Client requests to watch all files in a family
    socket.on("family:watch", ({ familyId }) => {
      if (typeof familyId === 'string' && familyId.length > 0) {
        socket.join(`family:${familyId}`);
        console.log(`[realtime] Client ${socket.id} watching family:${familyId}`);
      }
    });

    // Client stops watching family files
    socket.on("family:unwatch", ({ familyId }) => {
      if (typeof familyId === 'string' && familyId.length > 0) {
        socket.leave(`family:${familyId}`);
        console.log(`[realtime] Client ${socket.id} unwatching family:${familyId}`);
      }
    });

    // Internal worker updates (from background jobs)
    socket.on("file:update:server", ({ fileId, familyId, ...payload }) => {
      if (typeof fileId === 'string' && fileId.length > 0) {
        // Broadcast to clients watching this specific file
        io!.to(`file:${fileId}`).emit("file:update", { fileId, ...payload });
        
        // Also broadcast to clients watching the family
        if (familyId) {
          io!.to(`family:${familyId}`).emit("file:update", { fileId, familyId, ...payload });
        }
        
        console.log(`[realtime] Broadcasting update for file:${fileId}`, payload);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[realtime] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Safe emitter used by HTTP routes or other server code
export function emitFileUpdate(fileId: string, familyId: string, payload: any) {
  if (!io) {
    console.warn('[realtime] IO server not initialized, cannot emit update');
    return;
  }
  
  // Emit to file watchers
  io.to(`file:${fileId}`).emit("file:update", { fileId, familyId, ...payload });
  
  // Emit to family watchers
  io.to(`family:${familyId}`).emit("file:update", { fileId, familyId, ...payload });
  
  console.log(`[realtime] Emitted update for file:${fileId}`, payload);
}

// Get the IO instance for use elsewhere
export function getIoServer(): Server | null {
  return io;
}