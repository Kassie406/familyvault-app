import { Router } from "express";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { PrismaClient } from "@prisma/client";
import { sendOtpSms, checkOtpSms } from "../lib/sms";

const prisma = new PrismaClient();
const router = Router();

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const APP_URL = process.env.APP_URL || "http://localhost:5000";
const FROM_EMAIL = process.env.FROM_EMAIL!;
const JWT_SECRET = process.env.JWT_SECRET!;

// Email allowlist for restricted access
const ALLOWED_EMAILS = [
  "kassandra406@gmail.com",
  "kassandrasantana406@gmail.com", 
  "angeltrustcredit@gmail.com"
];

function sixDigit() {
  return ("" + Math.floor(100000 + Math.random() * 900000));
}

function isEmailAllowed(email: string): boolean {
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}

router.post("/request-code", async (req, res) => {
  try {
    const rawEmail = String(req.body?.email || "");
    const email = rawEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) return res.status(400).json({ ok: false, error: "Invalid email" });

    // Check if email is in allowlist
    if (!isEmailAllowed(email)) {
      return res.status(403).json({ ok: false, error: "Email not authorized for access" });
    }

    // Ensure user exists
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) user = await prisma.user.create({ data: { email } });

    // Create code
    const code = sixDigit();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.emailCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: expires,
      }
    });

    // Email the code
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        to: email,
        from: FROM_EMAIL,
        subject: "Your login code",
        text: `Your code is ${code}. It expires in 10 minutes.`,
        html: `<p>Your code is <strong style="font-size:18px">${code}</strong>. It expires in 10 minutes.</p>`
      });
    } else {
      console.log(`[DEV] Login code for ${email}: ${code}`);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to send code" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const code = String(req.body?.code || "").trim();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ ok: false, error: "User not found" });

    const token = await prisma.emailCode.findFirst({
      where: { userId: user.id, code, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" }
    });
    if (!token) return res.status(400).json({ ok: false, error: "Invalid or expired code" });

    // mark consumed
    await prisma.emailCode.update({ where: { id: token.id }, data: { consumed: true } });

    // issue session JWT
    const jwtToken = jwt.sign({ uid: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.setHeader("Set-Cookie",
      cookie.serialize("session", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Verification failed" });
  }
});

router.post("/request-sms-code", async (req, res) => {
  try {
    const { phone } = req.body as { phone?: string };
    if (!phone) {
      return res.status(400).json({ ok: false, error: "Phone number required" });
    }
    await sendOtpSms(phone);
    res.json({ ok: true, message: "SMS code sent" });
  } catch (e: any) {
    console.error("request-sms-code error", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

router.post("/verify-sms-code", async (req, res) => {
  try {
    const { phone, code, email } = req.body as { phone?: string; code?: string, email?: string };
    if (!phone || !code || !email) return res.status(400).json({ ok: false, error: "Missing phone, code or email" });

    // Check if email is in allowlist
    if (!isEmailAllowed(email.toLowerCase())) {
      return res.status(403).json({ ok: false, error: "Email not authorized for access" });
    }

    const ok = await checkOtpSms(phone, code);
    if (!ok) return res.status(400).json({ ok: false, error: "Invalid code" });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ ok: false, error: "User not found" });

    // issue session JWT
    const jwtToken = jwt.sign({ uid: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.setHeader("Set-Cookie",
      cookie.serialize("session", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.json({ ok: true });
  } catch (e: any) {
    console.error("verify-sms-code error", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
