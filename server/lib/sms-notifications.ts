import { storage } from "../storage";
import { sendSMSNotification } from "./twilio";

// Naive presence cache for tracking online users
// In production, use Redis or Socket.IO presence service
const onlineUsers = new Set<string>();

export function markUserOnline(userId: string) {
  onlineUsers.add(userId);
}

export function markUserOffline(userId: string) {
  onlineUsers.delete(userId);
}

export function isUserOnline(userId: string): boolean {
  return onlineUsers.has(userId);
}

// Simple cooldown to prevent SMS spam (1 minute per user)
function canSendSMSNow(lastSentAt?: Date | null): boolean {
  if (!lastSentAt) return true;
  return Date.now() - lastSentAt.getTime() > 60_000; // 1 minute cooldown
}

// Main function to handle SMS notifications for new messages
export async function sendSMSNotificationsForMessage(
  threadId: string, 
  senderId: string, 
  messageBody: string
): Promise<void> {
  try {
    // Get thread members (excluding sender)
    const threadMembers = await storage.getThreadMembers(threadId);
    const recipientIds = threadMembers
      .filter(member => member.userId !== senderId)
      .map(member => member.userId);

    if (recipientIds.length === 0) return;

    // Get sender info for personalized message
    const sender = await storage.getUser(senderId);
    const senderName = sender?.name || "Family Member";

    // Process each recipient
    for (const recipientId of recipientIds) {
      try {
        const recipient = await storage.getUser(recipientId);
        
        // Check if recipient is eligible for SMS
        if (!recipient || 
            !recipient.smsOptIn || 
            !recipient.phoneE164 || 
            isUserOnline(recipientId) ||
            !canSendSMSNow(recipient.smsLastSentAt)) {
          continue;
        }

        // Create message preview (truncate if too long)
        const preview = messageBody.length > 120 
          ? messageBody.slice(0, 117) + "..." 
          : messageBody;

        // Compose SMS message
        const smsText = `New message from ${senderName}: ${preview}\nOpen: ${process.env.APP_BASE_URL || "https://familyvault.com"}/family/messages/${threadId}`;

        // Send SMS notification
        const result = await sendSMSNotification({
          to: recipient.phoneE164,
          message: smsText,
          statusCallback: process.env.APP_BASE_URL 
            ? `${process.env.APP_BASE_URL}/api/twilio/status` 
            : undefined,
        });

        if (result.success) {
          // Update cooldown timestamp
          await storage.updateUser(recipientId, {
            smsLastSentAt: new Date()
          });
          
          console.log(`SMS sent to ${recipientId} (${recipient.phoneE164}): ${result.messageId}`);
        } else {
          console.error(`Failed to send SMS to ${recipientId}: ${result.error}`);
        }

      } catch (recipientError: any) {
        console.error(`Error processing SMS for recipient ${recipientId}:`, recipientError.message);
        // Continue with other recipients
      }
    }

  } catch (error: any) {
    console.error("Error in sendSMSNotificationsForMessage:", error.message);
    throw error;
  }
}