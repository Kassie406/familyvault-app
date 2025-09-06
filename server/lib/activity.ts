import { db } from "../db";
import { familyActivity, type InsertFamilyActivity } from "@shared/schema";
import { emitFamilyActivity } from "../realtime";

/**
 * Log a family activity to database and broadcast it to all family members in real-time
 */
export async function logFamilyActivity(data: {
  familyId: string;
  userId: string;
  activityType: string;
  title: string;
  description?: string;
  metadata?: any;
  priority?: string;
}) {
  try {
    // Insert activity into database
    const [activity] = await db.insert(familyActivity).values({
      familyId: data.familyId,
      userId: data.userId,
      activityType: data.activityType,
      title: data.title,
      description: data.description,
      metadata: data.metadata || {},
      priority: data.priority || 'low',
    }).returning();

    // Format activity for frontend
    const formattedActivity = {
      id: activity.id,
      type: activity.activityType,
      title: activity.title,
      description: activity.description,
      timestamp: activity.createdAt?.toISOString() || new Date().toISOString(),
      author: { id: activity.userId, name: activity.userId },
      metadata: activity.metadata || {},
      priority: activity.priority,
    };

    // Broadcast to all family members in real-time
    emitFamilyActivity(data.familyId, formattedActivity);

    return activity;
  } catch (error) {
    console.error("Error logging family activity:", error);
    throw error;
  }
}