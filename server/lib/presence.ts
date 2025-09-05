import { createClient, type RedisClientType } from "redis";

// Redis client for presence tracking
let redisClient: RedisClientType | null = null;

// Initialize Redis connection if URL is provided
async function getRedisClient(): Promise<RedisClientType | null> {
  if (!process.env.REDIS_URL) {
    console.warn("[presence] No Redis URL provided, using fallback presence tracking");
    return null;
  }

  if (!redisClient) {
    try {
      redisClient = createClient({ url: process.env.REDIS_URL });
      await redisClient.connect();
      console.log("[presence] Redis client connected successfully");
    } catch (error) {
      console.error("[presence] Failed to connect to Redis:", error);
      redisClient = null;
    }
  }

  return redisClient;
}

// Mark user as online for a family
export async function markUserOnline(familyId: string, userId: string): Promise<void> {
  const redis = await getRedisClient();
  
  if (redis) {
    try {
      // Add user to family's online set with 30-second TTL
      await redis.sAdd(`presence:family:${familyId}`, userId);
      await redis.expire(`presence:family:${familyId}:${userId}`, 30);
      
      // Also set individual user presence with timestamp
      await redis.setEx(`presence:user:${userId}`, 30, Date.now().toString());
    } catch (error) {
      console.error("[presence] Error marking user online:", error);
    }
  } else {
    // Fallback: update lastSeenAt in database
    // This would require importing the db and users schema
    console.log(`[presence] Fallback: User ${userId} online in family ${familyId}`);
  }
}

// Mark user as offline
export async function markUserOffline(familyId: string, userId: string): Promise<void> {
  const redis = await getRedisClient();
  
  if (redis) {
    try {
      await redis.sRem(`presence:family:${familyId}`, userId);
      await redis.del(`presence:user:${userId}`);
    } catch (error) {
      console.error("[presence] Error marking user offline:", error);
    }
  }
}

// Get all online users for a family
export async function getOnlineUsersForFamily(familyId: string): Promise<Set<string>> {
  const redis = await getRedisClient();
  
  if (redis) {
    try {
      const onlineUserIds = await redis.sMembers(`presence:family:${familyId}`);
      
      // Clean up expired users by checking individual presence keys
      const validUsers: string[] = [];
      for (const userId of onlineUserIds) {
        const lastSeen = await redis.get(`presence:user:${userId}`);
        if (lastSeen) {
          const lastSeenTime = parseInt(lastSeen);
          const now = Date.now();
          // Consider online if seen within last 60 seconds
          if (now - lastSeenTime < 60000) {
            validUsers.push(userId);
          } else {
            // Remove stale user
            await redis.sRem(`presence:family:${familyId}`, userId);
          }
        }
      }
      
      return new Set(validUsers);
    } catch (error) {
      console.error("[presence] Error getting online users:", error);
      return new Set();
    }
  } else {
    // Fallback: check lastSeenAt in database (basic implementation)
    // For now, return empty set - could implement DB fallback
    return new Set();
  }
}

// Get user's last seen timestamp
export async function getUserLastSeen(userId: string): Promise<Date | null> {
  const redis = await getRedisClient();
  
  if (redis) {
    try {
      const lastSeen = await redis.get(`presence:user:${userId}`);
      return lastSeen ? new Date(parseInt(lastSeen)) : null;
    } catch (error) {
      console.error("[presence] Error getting user last seen:", error);
      return null;
    }
  }
  
  return null;
}

// Heartbeat function for client to call periodically
export async function heartbeat(familyId: string, userId: string): Promise<void> {
  await markUserOnline(familyId, userId);
}

// Batch get presence for multiple users
export async function getBatchUserPresence(userIds: string[]): Promise<Map<string, { online: boolean; lastSeen: Date | null }>> {
  const redis = await getRedisClient();
  const presenceMap = new Map<string, { online: boolean; lastSeen: Date | null }>();
  
  if (redis && userIds.length > 0) {
    try {
      // Get all user presence keys in one pipeline
      const pipeline = redis.multi();
      for (const userId of userIds) {
        pipeline.get(`presence:user:${userId}`);
      }
      
      const results = await pipeline.exec();
      
      for (let i = 0; i < userIds.length; i++) {
        const userId = userIds[i];
        const lastSeenStr = results?.[i] as string | null;
        
        if (lastSeenStr) {
          const lastSeenTime = parseInt(lastSeenStr);
          const now = Date.now();
          const isOnline = now - lastSeenTime < 60000; // 60 seconds threshold
          
          presenceMap.set(userId, {
            online: isOnline,
            lastSeen: new Date(lastSeenTime),
          });
        } else {
          presenceMap.set(userId, {
            online: false,
            lastSeen: null,
          });
        }
      }
    } catch (error) {
      console.error("[presence] Error getting batch presence:", error);
    }
  }
  
  // Fill in missing users as offline
  for (const userId of userIds) {
    if (!presenceMap.has(userId)) {
      presenceMap.set(userId, { online: false, lastSeen: null });
    }
  }
  
  return presenceMap;
}

// Initialize presence system
export async function initializePresence(): Promise<void> {
  const redis = await getRedisClient();
  if (redis) {
    console.log("[presence] Redis presence system initialized");
  } else {
    console.log("[presence] Using fallback presence system");
  }
}

// Cleanup function
export async function cleanupPresence(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log("[presence] Redis client disconnected");
  }
}