import { io as ioc } from "socket.io-client";

// Worker-to-server broadcast client for real-time updates
class WorkerBroadcastClient {
  private client: any = null;
  private connected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    const origin = process.env.REALTIME_ORIGIN ?? "http://localhost:5000";
    
    this.client = ioc(origin, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      extraHeaders: { 
        "x-internal-worker": "1" 
      },
    });

    this.client.on("connect", () => {
      this.connected = true;
      console.log("[worker-broadcast] Connected to real-time server");
    });

    this.client.on("disconnect", () => {
      this.connected = false;
      console.log("[worker-broadcast] Disconnected from real-time server");
    });

    this.client.on("connect_error", (error: any) => {
      console.error("[worker-broadcast] Connection error:", error.message);
    });
  }

  /**
   * Emit file status update from background worker
   */
  emitFileUpdate(fileId: string, familyId: string, payload: any) {
    if (!this.connected || !this.client) {
      console.warn("[worker-broadcast] Client not connected, skipping update");
      return;
    }

    this.client.emit("file:update:server", { 
      fileId, 
      familyId, 
      ...payload 
    });

    console.log(`[worker-broadcast] Emitted update for file:${fileId}`, payload);
  }

  /**
   * Emit scan status update
   */
  emitScanUpdate(fileId: string, familyId: string, scanStatus: string, scanResult?: string, quarantined = false) {
    this.emitFileUpdate(fileId, familyId, {
      scanStatus,
      scanResult,
      quarantined,
      processedAt: new Date().toISOString(),
    });
  }

  /**
   * Emit thumbnail generation update
   */
  emitThumbnailUpdate(fileId: string, familyId: string, thumbStatus: string, thumbKey?: string, dimensions?: { width: number; height: number }) {
    this.emitFileUpdate(fileId, familyId, {
      thumbStatus,
      thumbKey,
      thumbWidth: dimensions?.width ?? 0,
      thumbHeight: dimensions?.height ?? 0,
      processedAt: new Date().toISOString(),
    });
  }

  /**
   * Close the connection
   */
  disconnect() {
    if (this.client) {
      this.client.disconnect();
      this.connected = false;
    }
  }
}

// Singleton instance for worker processes
export const workerBroadcast = new WorkerBroadcastClient();

// Helper functions for easy usage in worker jobs
export function emitFileUpdateFromWorker(fileId: string, familyId: string, payload: any) {
  workerBroadcast.emitFileUpdate(fileId, familyId, payload);
}

export function emitScanUpdateFromWorker(fileId: string, familyId: string, scanStatus: string, scanResult?: string, quarantined = false) {
  workerBroadcast.emitScanUpdate(fileId, familyId, scanStatus, scanResult, quarantined);
}

export function emitThumbnailUpdateFromWorker(fileId: string, familyId: string, thumbStatus: string, thumbKey?: string, dimensions?: { width: number; height: number }) {
  workerBroadcast.emitThumbnailUpdate(fileId, familyId, thumbStatus, thumbKey, dimensions);
}