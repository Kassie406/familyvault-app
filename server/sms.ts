import { Router } from "express";
import crypto from "crypto";
import { db } from "./db";
import { users, verificationCodes, notificationPreferences } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

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

    // TODO: Send SMS with Twilio when implemented
    console.log(`SMS verification code for ${phone}: ${code}`);
    
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

export default router;