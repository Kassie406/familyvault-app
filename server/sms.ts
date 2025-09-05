import { Router } from "express";
import crypto from "crypto";
import { db } from "./db";
import { users, verificationCodes, notificationPreferences } from "@shared/schema";
import { eq } from "drizzle-orm";
import twilio from "twilio";

const router = Router();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH!
);

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

// SMS Sending Functions
async function sendSMS(to: string, message: string): Promise<boolean> {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_FROM!,
      to: to
    });
    console.log(`SMS sent to ${to}: ${message.substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
    return false;
  }
}

// Send verification code via SMS
async function sendVerificationCode(phone: string, code: string): Promise<boolean> {
  const message = `Your FamilyCircleSecure verification code is: ${code}. This code expires in 5 minutes.`;
  return await sendSMS(phone, message);
}

// Send message notification with deep link
async function sendMessageNotification(phone: string, senderName: string, threadId: string, preview: string): Promise<boolean> {
  const deepLink = `https://portal.familycirclesecure.com/messages/${threadId}`;
  const message = `New message from ${senderName}: ${preview}\n\nView: ${deepLink}\n\nReply STOP to opt out.`;
  return await sendSMS(phone, message);
}

// POST /api/phone/start-verify
router.post("/phone/start-verify", async (req, res) => {
  // TODO: Replace with actual auth middleware
  const user = { id: "current-user" };
  const { phone } = req.body as { phone: string };
  
  if (!phone) {
    return res.status(400).json({ error: "phone required" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = hash(code);
  const expiresAt = new Date(Date.now() + 5 * 60_000); // 5 minutes

  try {
    await db.transaction(async (tx) => {
      await tx.update(users).set({ phone }).where(eq(users.id, user.id));
      await tx
        .insert(verificationCodes)
        .values({ userId: user.id, codeHash, expiresAt })
        .onConflictDoUpdate({ 
          target: verificationCodes.userId, 
          set: { codeHash, expiresAt } 
        });
    });

    // Send SMS verification code
    const smsSent = await sendVerificationCode(phone, code);
    if (!smsSent) {
      console.warn(`Failed to send SMS to ${phone}, but verification code was saved`);
    }
    
    res.json({ ok: true });
  } catch (error) {
    console.error("Error starting phone verification:", error);
    res.status(500).json({ error: "Failed to start verification" });
  }
});

// POST /api/phone/confirm
router.post("/phone/confirm", async (req, res) => {
  // TODO: Replace with actual auth middleware
  const user = { id: "current-user" };
  const { code } = req.body as { code: string };
  
  try {
    const [row] = await db.select().from(verificationCodes).where(eq(verificationCodes.userId, user.id));
    
    if (!row) {
      return res.status(400).json({ error: "no_code" });
    }
    
    if (row.expiresAt < new Date()) {
      return res.status(400).json({ error: "expired" });
    }
    
    if (hash(code) !== row.codeHash) {
      return res.status(400).json({ error: "invalid" });
    }

    // Mark phone as verified and enable SMS by default
    await db.transaction(async (tx) => {
      await tx.update(users).set({ phoneVerifiedAt: new Date() }).where(eq(users.id, user.id));
      await tx
        .insert(notificationPreferences)
        .values({ 
          id: `np_${user.id}`, 
          userId: user.id, 
          smsEnabled: true 
        })
        .onConflictDoUpdate({
          target: notificationPreferences.userId,
          set: { smsEnabled: true }
        });
      
      // Clean up verification code
      await tx.delete(verificationCodes).where(eq(verificationCodes.userId, user.id));
    });

    res.json({ ok: true });
  } catch (error) {
    console.error("Error confirming phone verification:", error);
    res.status(500).json({ error: "Failed to confirm verification" });
  }
});

// POST /api/sms/inbound (Twilio webhook - URL-encoded)
router.post("/sms/inbound", async (req, res) => {
  const from = req.body.From as string;
  const body = String(req.body.Body || "").trim().toUpperCase();

  try {
    const [u] = await db.select().from(users).where(eq(users.phone, from));
    
    if (!u) {
      res.type("text/xml").send("<Response/>");
      return;
    }

    if (body === "STOP") {
      await db
        .insert(notificationPreferences)
        .values({ id: `np_${u.id}`, userId: u.id, smsEnabled: false })
        .onConflictDoUpdate({ 
          target: notificationPreferences.userId, 
          set: { smsEnabled: false } 
        });
      res.type("text/xml").send("<Response><Message>You have opted out. Reply START to resume.</Message></Response>");
      return;
    }

    if (body === "START") {
      await db
        .insert(notificationPreferences)
        .values({ id: `np_${u.id}`, userId: u.id, smsEnabled: true })
        .onConflictDoUpdate({ 
          target: notificationPreferences.userId, 
          set: { smsEnabled: true } 
        });
      res.type("text/xml").send("<Response><Message>You are opted in. You will receive alerts.</Message></Response>");
      return;
    }

    if (body === "HELP") {
      res.type("text/xml").send("<Response><Message>FamilyCircleSecure: visit portal.familycirclesecure.com/help</Message></Response>");
      return;
    }

    res.type("text/xml").send("<Response/>");
  } catch (error) {
    console.error("Error handling inbound SMS:", error);
    res.type("text/xml").send("<Response/>");
  }
});

// Message notification endpoint
router.post("/notify/message", async (req, res) => {
  try {
    const { threadId, senderName, messagePreview, recipientIds } = req.body;
    
    if (!threadId || !senderName || !messagePreview || !recipientIds) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const results = [];
    
    // Get users with verified phones and SMS enabled
    for (const userId of recipientIds) {
      try {
        const [user] = await db.select({
          phone: users.phone,
          phoneVerified: users.phoneVerifiedAt
        }).from(users).where(eq(users.id, userId));
        
        if (!user?.phone || !user?.phoneVerified) {
          results.push({ userId, status: "no_verified_phone" });
          continue;
        }

        const [prefs] = await db.select()
          .from(notificationPreferences)
          .where(eq(notificationPreferences.userId, userId));
        
        if (!prefs?.smsEnabled) {
          results.push({ userId, status: "sms_disabled" });
          continue;
        }

        // Send notification
        const sent = await sendMessageNotification(user.phone, senderName, threadId, messagePreview);
        
        // TODO: Log the notification when smsNotifications table is added
        console.log(`SMS notification ${sent ? "sent" : "failed"} to ${userId}: ${senderName}`);
        
        results.push({ userId, status: sent ? "sent" : "failed" });
      } catch (error) {
        console.error(`Error sending notification to user ${userId}:`, error);
        results.push({ userId, status: "error" });
      }
    }
    
    res.json({ results });
  } catch (error) {
    console.error("Error sending message notifications:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

export default router;
export { sendMessageNotification, sendVerificationCode };