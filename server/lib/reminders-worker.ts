import { db } from "../db";
import { calendarEventReminders, calendarEvents, calendars, users } from "@shared/schema";
import { and, eq, lte, isNull } from "drizzle-orm";
import { getRealtimeManager } from "./realtime";

export interface ReminderNotification {
  id: string;
  eventId: string;
  userId: string;
  eventTitle: string;
  eventStartAt: Date;
  eventLocation?: string;
  minutesBefore: number;
  channel: string;
  userEmail?: string;
  userFirstName?: string;
}

/**
 * Main reminders worker that processes due reminders
 */
export async function processReminders(): Promise<void> {
  try {
    console.log("[reminders] Processing due reminders...");
    
    const now = new Date();
    
    // Find all reminders that are due but not yet sent
    const dueReminders = await db
      .select({
        id: calendarEventReminders.id,
        eventId: calendarEventReminders.eventId,
        userId: calendarEventReminders.userId,
        minutesBefore: calendarEventReminders.minutesBefore,
        channel: calendarEventReminders.channel,
        eventTitle: calendarEvents.title,
        eventStartAt: calendarEvents.startAt,
        eventLocation: calendarEvents.location,
        userEmail: users.email,
        userFirstName: users.username // Use username since firstName doesn't exist
      })
      .from(calendarEventReminders)
      .innerJoin(calendarEvents, eq(calendarEventReminders.eventId, calendarEvents.id))
      .innerJoin(users, eq(calendarEventReminders.userId, users.id))
      .where(and(
        // Reminder time has passed
        lte(
          // Calculate reminder time: event start - minutes before
          new Date(Date.now() + (calendarEventReminders.minutesBefore * 60 * 1000)),
          calendarEvents.startAt
        ),
        // Not already sent
        isNull(calendarEventReminders.sentAt)
      ));
    
    console.log(`[reminders] Found ${dueReminders.length} due reminders`);
    
    for (const reminder of dueReminders) {
      await processReminder(reminder);
    }
    
    console.log("[reminders] Finished processing reminders");
  } catch (error) {
    console.error("[reminders] Error processing reminders:", error);
  }
}

/**
 * Process a single reminder notification
 */
async function processReminder(reminder: ReminderNotification): Promise<void> {
  try {
    console.log(`[reminders] Processing reminder ${reminder.id} for event ${reminder.eventTitle}`);
    
    const success = await sendReminderNotification(reminder);
    
    if (success) {
      // Mark reminder as sent
      await db
        .update(calendarEventReminders)
        .set({ sentAt: new Date() })
        .where(eq(calendarEventReminders.id, reminder.id));
      
      console.log(`[reminders] Successfully sent reminder ${reminder.id}`);
    } else {
      console.error(`[reminders] Failed to send reminder ${reminder.id}`);
    }
  } catch (error) {
    console.error(`[reminders] Error processing reminder ${reminder.id}:`, error);
  }
}

/**
 * Send reminder notification through the specified channel
 */
async function sendReminderNotification(reminder: ReminderNotification): Promise<boolean> {
  const { channel, eventTitle, eventStartAt, eventLocation, minutesBefore, userId } = reminder;
  
  const timeUntilEvent = Math.floor((eventStartAt.getTime() - Date.now()) / (1000 * 60));
  const eventTime = eventStartAt.toLocaleString();
  
  const message = formatReminderMessage(eventTitle, eventTime, eventLocation, timeUntilEvent);
  
  try {
    switch (channel) {
      case "push":
        return await sendPushNotification(reminder, message);
      
      case "sms":
        return await sendSMSReminder(reminder, message);
      
      case "email":
        return await sendEmailReminder(reminder, message);
      
      default:
        console.error(`[reminders] Unknown channel: ${channel}`);
        return false;
    }
  } catch (error) {
    console.error(`[reminders] Error sending ${channel} reminder:`, error);
    return false;
  }
}

/**
 * Send push notification through WebSocket
 */
async function sendPushNotification(reminder: ReminderNotification, message: string): Promise<boolean> {
  try {
    const realtimeManager = getRealtimeManager();
    if (!realtimeManager) {
      console.error("[reminders] Real-time manager not available for push notifications");
      return false;
    }
    
    // Send to specific user
    realtimeManager.sendToUser(reminder.userId, "calendar:reminder", {
      id: reminder.id,
      eventId: reminder.eventId,
      eventTitle: reminder.eventTitle,
      eventStartAt: reminder.eventStartAt,
      minutesBefore: reminder.minutesBefore,
      message: message,
      type: "event_reminder"
    });
    
    console.log(`[reminders] Sent push notification to user ${reminder.userId}`);
    return true;
  } catch (error) {
    console.error("[reminders] Error sending push notification:", error);
    return false;
  }
}

/**
 * Send SMS reminder
 */
async function sendSMSReminder(reminder: ReminderNotification, message: string): Promise<boolean> {
  try {
    // For SMS, we need the user's phone number
    // This would typically be stored in the user profile
    // For now, we'll skip SMS if no phone number is available
    console.log(`[reminders] SMS reminder would be sent: ${message}`);
    
    // TODO: Implement actual SMS sending when phone numbers are available
    // const success = await sendSMSNotification(userPhoneNumber, message);
    // return success;
    
    return true; // Mock success for now
  } catch (error) {
    console.error("[reminders] Error sending SMS reminder:", error);
    return false;
  }
}

/**
 * Send email reminder
 */
async function sendEmailReminder(reminder: ReminderNotification, message: string): Promise<boolean> {
  try {
    if (!reminder.userEmail) {
      console.error("[reminders] No email address for user");
      return false;
    }
    
    console.log(`[reminders] Email reminder would be sent to ${reminder.userEmail}: ${message}`);
    
    // TODO: Implement actual email sending
    // const success = await sendEmail({
    //   to: reminder.userEmail,
    //   subject: `Event Reminder: ${reminder.eventTitle}`,
    //   text: message,
    //   html: formatReminderHTML(reminder, message)
    // });
    // return success;
    
    return true; // Mock success for now
  } catch (error) {
    console.error("[reminders] Error sending email reminder:", error);
    return false;
  }
}

/**
 * Format reminder message
 */
function formatReminderMessage(
  eventTitle: string,
  eventTime: string,
  eventLocation?: string,
  minutesUntil?: number
): string {
  let message = `📅 Event Reminder: ${eventTitle}`;
  
  if (minutesUntil !== undefined && minutesUntil > 0) {
    message += `\n⏰ Starting in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`;
  } else {
    message += `\n⏰ Time: ${eventTime}`;
  }
  
  if (eventLocation) {
    message += `\n📍 Location: ${eventLocation}`;
  }
  
  return message;
}

/**
 * Start the reminders worker with periodic checking
 */
export function startRemindersWorker(intervalMinutes: number = 1): NodeJS.Timeout {
  console.log(`[reminders] Starting reminders worker (checking every ${intervalMinutes} minute${intervalMinutes !== 1 ? 's' : ''})`);
  
  // Run immediately
  processReminders();
  
  // Then run on interval
  return setInterval(() => {
    processReminders();
  }, intervalMinutes * 60 * 1000);
}

/**
 * Stop the reminders worker
 */
export function stopRemindersWorker(workerInterval: NodeJS.Timeout): void {
  console.log("[reminders] Stopping reminders worker");
  clearInterval(workerInterval);
}

/**
 * Add a reminder for an event
 */
export async function addEventReminder(
  eventId: string,
  userId: string,
  minutesBefore: number,
  channel: "push" | "sms" | "email" = "push"
): Promise<void> {
  try {
    await db
      .insert(calendarEventReminders)
      .values({
        eventId,
        userId,
        minutesBefore,
        channel
      })
      .onConflictDoUpdate({
        target: [
          calendarEventReminders.eventId,
          calendarEventReminders.userId,
          calendarEventReminders.minutesBefore
        ],
        set: { channel }
      });
    
    console.log(`[reminders] Added ${channel} reminder for event ${eventId}, ${minutesBefore} minutes before`);
  } catch (error) {
    console.error("[reminders] Error adding event reminder:", error);
    throw error;
  }
}

/**
 * Remove a reminder for an event
 */
export async function removeEventReminder(
  eventId: string,
  userId: string,
  minutesBefore: number
): Promise<void> {
  try {
    await db
      .delete(calendarEventReminders)
      .where(and(
        eq(calendarEventReminders.eventId, eventId),
        eq(calendarEventReminders.userId, userId),
        eq(calendarEventReminders.minutesBefore, minutesBefore)
      ));
    
    console.log(`[reminders] Removed reminder for event ${eventId}`);
  } catch (error) {
    console.error("[reminders] Error removing event reminder:", error);
    throw error;
  }
}