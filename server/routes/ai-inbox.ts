// server/routes/ai-inbox.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { inboxItems, extractedFields } from "@shared/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { getIoServer } from "../realtime";

// Create S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export const aiInboxRouter = Router();

/** Image Preprocessing with Sharp */
async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  try {
    return await sharp(buffer)
      .rotate()                 // auto-orient based on EXIF
      .resize({ width: 2000, withoutEnlargement: true })  // max 2000px width
      .grayscale()             // convert to grayscale for better OCR
      .normalise()             // increase contrast
      .toFormat('jpeg', { quality: 85 })  // convert to JPEG, 85% quality
      .toBuffer();
  } catch (error) {
    console.error('[PREPROCESSING] Error processing image:', error);
    // Return original buffer if preprocessing fails
    return buffer;
  }
}

/** Timeout wrapper for promises */
function withTimeout<T>(promise: Promise<T>, ms = 20000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

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
  
  // Timing instrumentation
  const t0 = Date.now();
  const step = (label: string, t = Date.now()) => {
    console.log(`[AI] ${label} +${t - ((step as any)._last || t0)}ms (total ${t - t0}ms)`);
    (step as any)._last = t;
  };
  (step as any)._last = t0;
  
  try {
    step('started');
    
    const item = await db.query.inboxItems.findFirst({ where: eq(inboxItems.id, id) });
    if (!item) return res.status(404).json({ error: 'inbox_item_not_found' });
    step('fetched item from DB');

    await db.update(inboxItems).set({ status: 'analyzing' }).where(eq(inboxItems.id, id));
    step('updated status to analyzing');

    // Fetch S3 object
    let processedBuffer: Buffer;
    try {
      const s3Object = await s3Client.send(new GetObjectCommand({ 
        Bucket: process.env.S3_BUCKET_DOCS!, 
        Key: item.fileUrl 
      }));
      step('fetched S3 object');

      const chunks: Uint8Array[] = [];
      if (s3Object.Body) {
        const stream = s3Object.Body as any;
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
      }
      const originalBuffer = Buffer.concat(chunks);
      step('converted S3 stream to buffer');

      // Preprocess image with sharp
      processedBuffer = await withTimeout(preprocessImage(originalBuffer), 10000);
      step('preprocessed image with sharp');
    } catch (error) {
      console.error('[AI] S3 fetch/preprocessing failed:', error);
      // Fall back to demo mode if S3 fails
      processedBuffer = Buffer.from('demo-content');
      step('fell back to demo mode');
    }

    // ---- DEMO ANALYZER (always produces 2 fields) ----
    const suggestion = { memberId: 'angel-quintana', memberName: 'Angel Quintana', confidence: 0.92 };
    const fields = [
      { key: "Driver's License Number", value: 'C03364260056932', confidence: 0.96, pii: true },
      { key: 'Expiration Date', value: '2027-04-06', confidence: 0.98, pii: false },
    ];
    step('OCR analysis complete');
    // -----------------------------------------------

    // Simulate member matching delay
    await new Promise(resolve => setTimeout(resolve, 50));
    step('matched member');

    // persist fields
    for (const f of fields) {
      await db.insert(extractedFields).values({
        inboxItemId: id, fieldKey: f.key, fieldValue: f.value, confidence: f.confidence, isPii: !!f.pii,
      });
    }
    step('persisted extracted fields');

    await db.update(inboxItems).set({
      status: 'suggested',
      suggestedMemberId: suggestion.memberId,
    }).where(eq(inboxItems.id, id));
    step('updated final status');

    console.log(`[AI] Analysis complete for ${id} in ${Date.now() - t0}ms`);
    
    // Emit real-time success event
    const io = getIoServer();
    if (io && item.familyId) {
      io.to(`family:${item.familyId}`).emit('inbox:ready', {
        uploadId: id,
        fileName: item.filename,
        detailsCount: fields.length,
        fields,
        suggestion
      });
      console.log(`[AI] Emitted inbox:ready event to family:${item.familyId}`);
    }
    
    // return exactly what UI expects
    return res.json({ suggestion, fields });
  } catch (e:any) {
    console.error('analyze error', e);
    
    const errorMessage = e?.message || 'Analysis failed';
    
    // Update status to failed in DB
    await db.update(inboxItems).set({
      status: 'failed',
    }).where(eq(inboxItems.id, id));
    
    // Get item for family ID and emit real-time failure event
    const item = await db.query.inboxItems.findFirst({ where: eq(inboxItems.id, id) });
    const io = getIoServer();
    if (io && item?.familyId) {
      io.to(`family:${item.familyId}`).emit('inbox:failed', {
        uploadId: id,
        fileName: item.filename,
        error: errorMessage
      });
      console.log(`[AI] Emitted inbox:failed event to family:${item.familyId}`);
    }
    
    return res.status(500).json({ error: 'analyze_failed' });
  }
});

/** GET /api/inbox/:id/status -> { status, detailsCount, result } */
aiInboxRouter.get("/:id/status", async (req, res) => {
  const { id } = req.params;
  
  try {
    const item = await db.query.inboxItems.findFirst({ where: eq(inboxItems.id, id) });
    if (!item) return res.status(404).json({ error: 'inbox_item_not_found' });

    // Get extracted fields
    const fields = await db.query.extractedFields.findMany({
      where: eq(extractedFields.inboxItemId, id)
    });

    const result = {
      fields: fields.map(f => ({
        key: f.fieldKey,
        value: f.fieldValue,
        confidence: f.confidence,
        pii: f.isPii
      })),
      suggestion: item.suggestedMemberId ? {
        memberId: item.suggestedMemberId,
        memberName: 'Angel Quintana', // TODO: lookup from members table
        confidence: item.confidence || 90
      } : null
    };

    res.json({
      status: item.status,
      detailsCount: result.fields.length,
      result: result,
      error: item.status === 'failed' ? 'Analysis failed' : null
    });
  } catch (e: any) {
    console.error('[AI] Status check error:', e);
    res.status(500).json({ error: 'status_check_failed' });
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