// server/routes/ai-inbox.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { inboxItems, extractedFields } from "@shared/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Create S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export const aiInboxRouter = Router();

/** Schema */
const RegisterBody = z.object({
  userId: z.string(),
  fileKey: z.string(),     // s3 key you just uploaded to
  fileName: z.string(),
  mime: z.string().optional(),
  size: z.number().optional()
});

/** POST /api/inbox/register -> { uploadId } */
aiInboxRouter.post("/register", async (req, res) => {
  const body = RegisterBody.parse(req.body);
  const uploadId = nanoid();

  try {
    await db.insert(inboxItems).values({
      id: uploadId,
      familyId: "family-1", // TODO: get from user context
      userId: body.userId,
      filename: body.fileName,
      fileUrl: body.fileKey, // S3 key serves as file URL
      fileSize: body.size,
      mimeType: body.mime,
      status: "analyzing",
      uploadedAt: new Date()
    });

    res.json({ uploadId });
  } catch (error) {
    console.error("[AI INBOX] Registration error:", error);
    res.status(500).json({ error: "Failed to register upload" });
  }
});

/** Helper: Fake analyzer that extracts Driver License Number + Expiration if present */
async function analyzeBuffer(buf: Buffer) {
  const text = buf.toString("utf8");
  // very simple patterns – replace with real OCR later
  const number =
    /(?:DL|ID|No\.?|Number)[:\s]*([A-Z0-9]{5,})/i.exec(text)?.[1] ??
    /([A-Z]\d{3,}\s?\d{3,}\s?\d{3,})/.exec(text)?.[1];

  const exp =
    /(?:EXP|Expires|Expiration)[:\s]*([0-9]{4}-[0-9]{2}-[0-9]{2})/i.exec(text)?.[1] ??
    /([0-9]{2}\/[0-9]{2}\/[0-9]{4})/.exec(text)?.[1];

  const fields = [];
  if (number) fields.push({ key: "Driver's License Number", value: number, confidence: 0.92, pii: true });
  if (exp)    fields.push({ key: "Expiration date", value: exp, confidence: 0.86 });

  // simple suggestion: pick the top-matching member if name found
  let suggestion: null | { memberId: string; memberName: string; confidence: number } = null;
  const personMatch = /ANGEL\s+QUINTANA|ANGEL D QUINTANA/i.test(text);
  if (personMatch) {
    // Your real lookup should query people table; hardcoded ID is just for demo
    suggestion = { memberId: "angel-quintana-id", memberName: "Angel Quintana", confidence: 0.91 };
  }

  return { fields, suggestion };
}

/** POST /api/inbox/:id/analyze -> { fields, suggestion } */
aiInboxRouter.post("/:id/analyze", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await db.query.inboxItems.findFirst({ where: eq(inboxItems.id, id) });
    if (!item) return res.status(404).json({ error: 'inbox_item_not_found' });

    await db.update(inboxItems).set({ status: 'analyzing' }).where(eq(inboxItems.id, id));

    // ---- DEMO ANALYZER (always produces 2 fields) ----
    const suggestion = { memberId: 'angel-quintana', memberName: 'Angel Quintana', confidence: 0.92 };
    const fields = [
      { key: "Driver's License Number", value: 'C03364260056932', confidence: 0.96, pii: true },
      { key: 'Expiration Date', value: '2027-04-06', confidence: 0.98, pii: false },
    ];
    // -----------------------------------------------

    // persist fields
    for (const f of fields) {
      await db.insert(extractedFields).values({
        inboxId: id, key: f.key, value: f.value, confidence: f.confidence, pii: !!f.pii,
      });
    }

    await db.update(inboxItems).set({
      status: 'suggested',
      suggestionMemberId: suggestion.memberId,
    }).where(eq(inboxItems.id, id));

    // return exactly what UI expects
    return res.json({ suggestion, fields });
  } catch (e:any) {
    console.error('analyze error', e);
    return res.status(500).json({ error: 'analyze_failed' });
  }
});

/** POST /api/inbox/:id/accept */
aiInboxRouter.post("/:id/accept", async (req, res) => {
  const { memberId } = z.object({ memberId: z.string() }).parse(req.body);
  const id = req.params.id;

  try {
    await db.update(inboxItems)
      .set({ 
        status: "accepted",
        suggestedMemberId: memberId,
        acceptedAt: new Date()
      })
      .where(eq(inboxItems.id, id));

    res.json({ ok: true });
  } catch (error) {
    console.error("[AI INBOX] Accept error:", error);
    res.status(500).json({ error: "Failed to accept upload" });
  }
});

/** POST /api/inbox/:id/dismiss */
aiInboxRouter.post("/:id/dismiss", async (req, res) => {
  const id = req.params.id;
  
  try {
    await db.update(inboxItems).set({ 
      status: "dismissed",
      dismissedAt: new Date()
    }).where(eq(inboxItems.id, id));
    
    res.json({ ok: true });
  } catch (error) {
    console.error("[AI INBOX] Dismiss error:", error);
    res.status(500).json({ error: "Failed to dismiss upload" });
  }
});