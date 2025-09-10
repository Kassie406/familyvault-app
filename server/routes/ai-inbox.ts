// server/routes/ai-inbox.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../db";          // your Drizzle or DB client
import { nanoid } from "nanoid";
// Import from correct path
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Use existing S3 setup
const s3 = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});
import { GetObjectCommand } from "@aws-sdk/client-s3";

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

  await db.insertInto("inbox_items").values({
    id: uploadId,
    user_id: body.userId,
    file_key: body.fileKey,
    file_name: body.fileName,
    status: "pending",
    created_at: new Date()
  });

  res.json({ uploadId });
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
  const id = req.params.id;
  const row = await db.selectFrom("inbox_items").selectAll().where("id", "=", id).executeTakeFirst();

  if (!row) return res.status(404).json({ error: "Inbox item not found" });

  try {
    // Download the file from S3 using SDK (no CORS in server context)
    const s3Resp = await s3.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_DOCS || process.env.S3_BUCKET || "family-vault",
      Key: row.file_key
    }));
    const buf = Buffer.from(await s3Resp.Body!.transformToByteArray());

    const { fields, suggestion } = await analyzeBuffer(buf);

    // Save analysis
    await db.updateTable("inbox_items")
      .set({
        status: "analyzed",
        fields_json: JSON.stringify(fields),
        suggestion_json: JSON.stringify(suggestion)
      })
      .where("id", "=", id)
      .execute();

    res.json({ fields, suggestion });
  } catch (e: any) {
    await db.updateTable("inbox_items").set({ status: "error", error_msg: String(e?.message || e) })
      .where("id", "=", id).execute();
    res.status(500).json({ error: "Failed to analyze upload" });
  }
});

/** POST /api/inbox/:id/accept */
aiInboxRouter.post("/:id/accept", async (req, res) => {
  const { memberId } = z.object({ memberId: z.string() }).parse(req.body);
  const id = req.params.id;

  // Attach file to member (pseudo—replace with your real linkage)
  // await db.insertInto("member_files").values({ member_id: memberId, inbox_id: id }).execute();

  await db.updateTable("inbox_items")
    .set({ status: "accepted", accepted_member_id: memberId })
    .where("id", "=", id)
    .execute();

  res.json({ ok: true });
});

/** POST /api/inbox/:id/dismiss */
aiInboxRouter.post("/:id/dismiss", async (req, res) => {
  const id = req.params.id;
  await db.updateTable("inbox_items").set({ status: "dismissed" }).where("id", "=", id).execute();
  res.json({ ok: true });
});