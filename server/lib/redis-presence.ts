import Redis from "ioredis";

interface PresenceEntry {
  userId: string;
  familyId: string;
  connectedAt: number;
  lastSeen: number;
}

class RedisPresenceManager {
  private redis: Redis | null = null;
  private fallbackPresence = new Map<string, Map<string, PresenceEntry>>(); // familyId -> userId -> entry
  private readonly PRESENCE_TTL = 300; // 5 minutes TTL
  private readonly HEARTBEAT_INTERVAL = 30; // 30 seconds

  constructor() {
    this.initializeRedis();
  }

  private initializeRedis() {
    try {
      const redisUrl = process.env.REDIS_URL;
      if (redisUrl) {
        this.redis = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
          retryDelayOnClusterDown: 100,
        });

        this.redis.on("connect", () => {
          console.log("[presence] Connected to Redis for presence tracking");
        });

        this.redis.on("error", (error) => {
          console.warn("[presence] Redis error, falling back to in-memory:", error.message);
          this.redis = null;
        });
      } else {
        console.log("[presence] No REDIS_URL provided, using in-memory presence tracking");
      }
    } catch (error) {
      console.warn("[presence] Failed to initialize Redis, using in-memory fallback:", error);
      this.redis = null;
    }
  }

  // Mark user as online with TTL
  async markOnline(familyId: string, userId: string): Promise<void> {
    const entry: PresenceEntry = {
      userId,
      familyId,
      connectedAt: Date.now(),
      lastSeen: Date.now(),
    };

    if (this.redis) {
      try {
        const key = `presence:${familyId}`;
        await this.redis.hset(key, userId, JSON.stringify(entry));
        await this.redis.expire(key, this.PRESENCE_TTL);
        
        // Also set individual user key for faster lookups
        await this.redis.setex(`presence:user:${userId}`, this.PRESENCE_TTL, JSON.stringify(entry));
      } catch (error) {
        console.warn("[presence] Redis error in markOnline, using fallback:", error);
        this.fallbackMarkOnline(familyId, userId, entry);
      }
    } else {
      this.fallbackMarkOnline(familyId, userId, entry);
    }
  }

  // Update user's last seen timestamp
  async updateHeartbeat(familyId: string, userId: string): Promise<void> {
    if (this.redis) {
      try {
        const userKey = `presence:user:${userId}`;
        const existing = await this.redis.get(userKey);
        
        if (existing) {
          const entry: PresenceEntry = JSON.parse(existing);
          entry.lastSeen = Date.now();
          
          const familyKey = `presence:${familyId}`;
          await this.redis.hset(familyKey, userId, JSON.stringify(entry));
          await this.redis.setex(userKey, this.PRESENCE_TTL, JSON.stringify(entry));
          await this.redis.expire(familyKey, this.PRESENCE_TTL);
        }
      } catch (error) {
        console.warn("[presence] Redis error in updateHeartbeat:", error);
        this.fallbackUpdateHeartbeat(familyId, userId);
      }
    } else {
      this.fallbackUpdateHeartbeat(familyId, userId);
    }
  }

  // Mark user as offline
  async markOffline(familyId: string, userId: string): Promise<void> {
    if (this.redis) {
      try {
        const familyKey = `presence:${familyId}`;
        const userKey = `presence:user:${userId}`;
        
        await this.redis.hdel(familyKey, userId);
        await this.redis.del(userKey);
      } catch (error) {
        console.warn("[presence] Redis error in markOffline:", error);
        this.fallbackMarkOffline(familyId, userId);
      }
    } else {
      this.fallbackMarkOffline(familyId, userId);
    }
  }

  // Get all online users for a family
  async getOnlineUsers(familyId: string): Promise<string[]> {
    if (this.redis) {
      try {
        const key = `presence:${familyId}`;
        const entries = await this.redis.hgetall(key);
        
        const now = Date.now();
        const activeUsers: string[] = [];
        
        for (const [userId, dataStr] of Object.entries(entries)) {
          try {
            const entry: PresenceEntry = JSON.parse(dataStr);
            // Consider user online if last seen within heartbeat grace period
            if (now - entry.lastSeen < (this.HEARTBEAT_INTERVAL * 2 * 1000)) {
              activeUsers.push(userId);
            }
          } catch (parseError) {
            console.warn("[presence] Failed to parse presence entry:", parseError);
          }
        }
        
        return activeUsers;
      } catch (error) {
        console.warn("[presence] Redis error in getOnlineUsers:", error);
        return this.fallbackGetOnlineUsers(familyId);
      }
    } else {
      return this.fallbackGetOnlineUsers(familyId);
    }
  }

  // Check if specific user is online
  async isUserOnline(userId: string): Promise<boolean> {
    if (this.redis) {
      try {
        const entry = await this.redis.get(`presence:user:${userId}`);
        if (!entry) return false;
        
        const data: PresenceEntry = JSON.parse(entry);
        const now = Date.now();
        return (now - data.lastSeen) < (this.HEARTBEAT_INTERVAL * 2 * 1000);
      } catch (error) {
        console.warn("[presence] Redis error in isUserOnline:", error);
        return this.fallbackIsUserOnline(userId);
      }
    } else {
      return this.fallbackIsUserOnline(userId);
    }
  }

  // Get presence stats
  async getPresenceStats(): Promise<{ totalOnline: number; byFamily: Record<string, number> }> {
    if (this.redis) {
      try {
        const keys = await this.redis.keys("presence:*");
        const familyKeys = keys.filter(key => key.startsWith("presence:") && !key.includes(":user:"));
        
        const byFamily: Record<string, number> = {};
        let totalOnline = 0;
        
        for (const key of familyKeys) {
          const familyId = key.replace("presence:", "");
          const onlineUsers = await this.getOnlineUsers(familyId);
          byFamily[familyId] = onlineUsers.length;
          totalOnline += onlineUsers.length;
        }
        
        return { totalOnline, byFamily };
      } catch (error) {
        console.warn("[presence] Redis error in getPresenceStats:", error);
        return this.fallbackGetPresenceStats();
      }
    } else {
      return this.fallbackGetPresenceStats();
    }
  }

  // Clean up expired presence entries (for Redis maintenance)
  async cleanupExpired(): Promise<void> {
    if (this.redis) {
      try {
        const keys = await this.redis.keys("presence:*");
        const now = Date.now();
        
        for (const key of keys) {
          if (key.includes(":user:")) {
            // Check individual user entries
            const entry = await this.redis.get(key);
            if (entry) {
              const data: PresenceEntry = JSON.parse(entry);
              if (now - data.lastSeen > this.PRESENCE_TTL * 1000) {
                await this.redis.del(key);
              }
            }
          }
        }
      } catch (error) {
        console.warn("[presence] Error during cleanup:", error);
      }
    } else {
      this.fallbackCleanupExpired();
    }
  }

  // Fallback methods for in-memory operation
  private fallbackMarkOnline(familyId: string, userId: string, entry: PresenceEntry): void {
    if (!this.fallbackPresence.has(familyId)) {
      this.fallbackPresence.set(familyId, new Map());
    }
    this.fallbackPresence.get(familyId)!.set(userId, entry);
  }

  private fallbackUpdateHeartbeat(familyId: string, userId: string): void {
    const familyMap = this.fallbackPresence.get(familyId);
    if (familyMap?.has(userId)) {
      const entry = familyMap.get(userId)!;
      entry.lastSeen = Date.now();
    }
  }

  private fallbackMarkOffline(familyId: string, userId: string): void {
    const familyMap = this.fallbackPresence.get(familyId);
    if (familyMap) {
      familyMap.delete(userId);
      if (familyMap.size === 0) {
        this.fallbackPresence.delete(familyId);
      }
    }
  }

  private fallbackGetOnlineUsers(familyId: string): string[] {
    const familyMap = this.fallbackPresence.get(familyId);
    if (!familyMap) return [];
    
    const now = Date.now();
    const activeUsers: string[] = [];
    
    for (const [userId, entry] of Array.from(familyMap.entries())) {
      if (now - entry.lastSeen < (this.HEARTBEAT_INTERVAL * 2 * 1000)) {
        activeUsers.push(userId);
      }
    }
    
    return activeUsers;
  }

  private fallbackIsUserOnline(userId: string): boolean {
    for (const familyMap of Array.from(this.fallbackPresence.values())) {
      const entry = familyMap.get(userId);
      if (entry) {
        const now = Date.now();
        return (now - entry.lastSeen) < (this.HEARTBEAT_INTERVAL * 2 * 1000);
      }
    }
    return false;
  }

  private fallbackGetPresenceStats(): { totalOnline: number; byFamily: Record<string, number> } {
    const byFamily: Record<string, number> = {};
    let totalOnline = 0;
    
    for (const [familyId, familyMap] of Array.from(this.fallbackPresence.entries())) {
      const onlineCount = this.fallbackGetOnlineUsers(familyId).length;
      byFamily[familyId] = onlineCount;
      totalOnline += onlineCount;
    }
    
    return { totalOnline, byFamily };
  }

  private fallbackCleanupExpired(): void {
    const now = Date.now();
    
    for (const [familyId, familyMap] of Array.from(this.fallbackPresence.entries())) {
      for (const [userId, entry] of Array.from(familyMap.entries())) {
        if (now - entry.lastSeen > this.PRESENCE_TTL * 1000) {
          familyMap.delete(userId);
        }
      }
      
      if (familyMap.size === 0) {
        this.fallbackPresence.delete(familyId);
      }
    }
  }

  // Start cleanup interval
  startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpired();
    }, 60000); // Clean up every minute
  }

  // Health check
  async healthCheck(): Promise<{ redis: boolean; fallback: boolean; totalOnline: number }> {
    const stats = await this.getPresenceStats();
    return {
      redis: this.redis?.status === "ready",
      fallback: !this.redis,
      totalOnline: stats.totalOnline,
    };
  }
}

// Export singleton instance
export const redisPresence = new RedisPresenceManager();

// Start the cleanup interval when module loads
redisPresence.startCleanupInterval();