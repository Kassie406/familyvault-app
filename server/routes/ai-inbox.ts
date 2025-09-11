// server/routes/ai-inbox.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { inboxItems, extractedFields, familyMembers, familyResources, familyInsurancePolicies, familyInsuranceItems } from "@shared/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { TextractClient, AnalyzeIDCommand, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import sharp from "sharp";
import { getIoServer } from "../realtime";
import { normalizeAddress } from "../util/normalizeAddress";
import type { ExtractField, AISuggestions, NormalizedAddress } from "@shared/types/inbox";

// Create S3 and Textract clients
const s3Client = new S3Client({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const textractClient = new TextractClient({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export const aiInboxRouter = Router();

/** Get S3 object as bytes for Textract */
async function getObjectBytes(bucket: string, key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await s3Client.send(command);
    const bytes = await response.Body!.transformToByteArray();
    return Buffer.from(bytes);
  } catch (error) {
    console.error(`[S3] Failed to get object bytes for ${bucket}/${key}:`, error);
    throw error;
  }
}

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
  userId: z.string().optional(), // Made optional - will derive from session if not provided
  fileKey: z.string(),     // s3 key you just uploaded to
  fileName: z.string(),
  mime: z.string().optional(),
  size: z.number().optional(),
  s3Bucket: z.string().optional(), // Add bucket info
  contentType: z.string().optional() // Add content type
});

/** POST /api/inbox/register -> { uploadId } */
aiInboxRouter.post("/register", async (req, res) => {
  const body = RegisterBody.parse(req.body);

  try {
    // Use userId from body if provided, otherwise derive from session/auth context
    const userId = body.userId || (req as any).user?.id || "anonymous";
    
    // Insert and return the created record to get the actual database ID
    const [created] = await db.insert(inboxItems).values({
      familyId: "family-1", // TODO: get from user context
      userId: userId,
      filename: body.fileName,
      fileUrl: body.fileKey, // S3 key serves as file URL
      fileSize: body.size,
      mimeType: body.contentType || body.mime, // Prioritize contentType
      status: "uploaded" // Start as uploaded, not analyzing
    }).returning({ id: inboxItems.id });

    console.log(`[AI INBOX] Created inbox item with ID: ${created.id}`);
    
    // Return the actual database record ID
    res.json({ uploadId: created.id });
  } catch (error) {
    console.error("[AI INBOX] Registration error:", error);
    res.status(500).json({ error: "Failed to register upload" });
  }
});

// ——— Comprehensive Document Analyzers ———

function toField(label: string, key: string, value: string, confidence = 90, path: string): ExtractField {
  return { label, key, value, confidence, path };
}

/** Safe file type routing - prevents AnalyzeID on PDFs */
function routeDocType(fileName: string, mime: string): {
  docType: AISuggestions['docType'];
  isImage: boolean;
  isPdf: boolean;
} {
  const f = (fileName || '').toLowerCase();
  const isImage = /^image\//.test(mime);
  const isPdf = mime === 'application/pdf';
  
  if (isImage) {
    if (f.includes('license') || f.match(/\b(dl|driver-?id)\b/)) {
      return { docType: 'driverLicense', isImage: true, isPdf: false };
    }
    if (f.includes('passport')) {
      return { docType: 'passport', isImage: true, isPdf: false };
    }
    return { docType: 'idCard', isImage: true, isPdf: false };
  }
  
  if (isPdf) {
    if (f.includes('insurance') || f.includes('policy')) {
      return { docType: 'insurance', isImage: false, isPdf: true };
    }
    return { docType: 'other', isImage: false, isPdf: true };
  }
  
  return { docType: 'other', isImage: false, isPdf: false };
}

function isoDate(s: string): string {
  try {
    return new Date(s).toISOString().slice(0, 10);
  } catch {
    return s; // Return original if parsing fails
  }
}

// Removed s3KeyToBucketAndKey - now using direct bytes approach

async function analyzeIdDoc(bucket: string, key: string, docType: 'driverLicense'|'passport'|'idCard'): Promise<AISuggestions> {
  try {
    // Get bytes from S3 and feed directly to Textract with timeout
    const bytes = await withTimeout(getObjectBytes(bucket, key), 15000);
    
    // Preprocess image if needed
    const processedBytes = await withTimeout(preprocessImage(bytes), 10000);
    
    const command = new AnalyzeIDCommand({
      Document: { Bytes: processedBytes }
    });
    const resp = await withTimeout(textractClient.send(command), 30000);

    const fields: ExtractField[] = [];
    const page = resp.IdentityDocuments?.[0];
    const kv = new Map<string, string>();

    page?.IdentityDocumentFields?.forEach(f => {
      const name = f.Type?.Text?.toLowerCase();
      const val = f.ValueDetection?.Text?.trim() || '';
      if (name && val) kv.set(name, val);
    });

    // Common pulls
    const number    = kv.get('document number') || kv.get('id number') || '';
    const given     = kv.get('given name') || kv.get('first name') || '';
    const surname   = kv.get('surname') || kv.get('last name') || '';
    const fullName  = [given, surname].filter(Boolean).join(' ');
    const dob       = kv.get('date of birth') || '';
    const expiry    = kv.get('date of expiry') || kv.get('expiration date') || '';
    const issue     = kv.get('date of issue') || '';
    const address   = kv.get('address') || '';
    const state     = kv.get('issuing state') || kv.get('state') || '';

    if (fullName) fields.push(toField('Name', 'name', fullName, 95, 'person.name'));
    if (dob)      fields.push(toField('Date of birth', 'dateOfBirth', isoDate(dob), 95, 'person.dateOfBirth'));

    if (number)   fields.push(toField('License/ID number', 'number', number, 96, 'ids.driverLicense.number'));
    if (state)    fields.push(toField('State', 'state', state, 92, 'ids.driverLicense.state'));
    if (expiry)   fields.push(toField('Expiration', 'expiration', isoDate(expiry), 94, 'ids.driverLicense.expiration'));
    if (issue)    fields.push(toField('Issue date', 'issue', isoDate(issue), 85, 'ids.driverLicense.issue'));

    if (address) {
      const addr = normalizeAddress(address);
      if (addr.line1)  fields.push(toField('Address line 1', 'line1', addr.line1, 90, 'person.address.line1'));
      if (addr.line2)  fields.push(toField('Address line 2', 'line2', addr.line2, 80, 'person.address.line2'));
      if (addr.city)   fields.push(toField('City', 'city', addr.city, 90, 'person.address.city'));
      if (addr.state)  fields.push(toField('State', 'state', addr.state, 92, 'person.address.state'));
      if (addr.postal) fields.push(toField('ZIP', 'postal', addr.postal, 92, 'person.address.postal'));
    }

    const confidence = fields.length >= 4 ? 'high' : fields.length >= 2 ? 'medium' : 'low';
    return { docType, fields, confidence, reasoning: 'Extracted using AWS Textract AnalyzeID' };
  } catch (error) {
    console.error('[TEXTRACT] AnalyzeID failed:', error);
    // Return structured error instead of demo data
    throw new Error(`Failed to analyze ${docType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeInsuranceDoc(bucket: string, key: string): Promise<AISuggestions> {
  try {
    // Get bytes from S3 and use AnalyzeDocument for PDFs with timeout
    const bytes = await withTimeout(getObjectBytes(bucket, key), 15000);
    const command = new AnalyzeDocumentCommand({
      Document: { Bytes: bytes },
      FeatureTypes: ['FORMS', 'TABLES']
    });
    const resp = await withTimeout(textractClient.send(command), 30000);
    
    // Extract fields from forms/tables response
    const fields: ExtractField[] = [];
    
    // Parse key-value pairs from forms
    resp.Blocks?.forEach(block => {
      if (block.BlockType === 'KEY_VALUE_SET' && block.EntityTypes?.includes('KEY')) {
        const key = block.Text?.toLowerCase() || '';
        const valueBlock = resp.Blocks?.find(b => 
          b.BlockType === 'KEY_VALUE_SET' && 
          b.EntityTypes?.includes('VALUE') &&
          block.Relationships?.[0]?.Ids?.includes(b.Id || '')
        );
        
        const value = valueBlock?.Text?.trim() || '';
        
        if (key && value) {
          if (key.includes('carrier') || key.includes('company')) {
            fields.push(toField('Insurance Carrier', 'carrier', value, 85, 'insurance.carrier'));
          } else if (key.includes('policy') && key.includes('number')) {
            fields.push(toField('Policy Number', 'policyNumber', value, 90, 'insurance.policyNumber'));
          } else if (key.includes('coverage') || key.includes('type')) {
            fields.push(toField('Coverage Type', 'coverage', value, 80, 'insurance.coverage'));
          } else if (key.includes('premium') || key.includes('amount')) {
            fields.push(toField('Premium Amount', 'premium', value, 75, 'insurance.premium'));
          } else if (key.includes('effective') || key.includes('start')) {
            fields.push(toField('Effective Date', 'effectiveDate', isoDate(value), 80, 'insurance.effectiveDate'));
          } else if (key.includes('expir') || key.includes('end')) {
            fields.push(toField('Expiration Date', 'expirationDate', isoDate(value), 80, 'insurance.expirationDate'));
          }
        }
      }
    });
    
    const confidence = fields.length >= 3 ? 'high' : fields.length >= 1 ? 'medium' : 'low';
    return { 
      docType: 'insurance', 
      fields,
      confidence, 
      reasoning: 'Extracted using AWS Textract AnalyzeDocument' 
    };
  } catch (error) {
    console.error('[TEXTRACT] AnalyzeDocument failed:', error);
    // Return structured error instead of demo data
    throw new Error(`Failed to analyze insurance document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeGeneric(bucket: string, key: string): Promise<AISuggestions> {
  // For unsupported document types, return empty analysis rather than throwing
  console.log(`[ANALYZE] Generic analysis for unsupported document type: ${key}`);
  return { 
    docType: 'other', 
    fields: [], 
    confidence: 'low', 
    reasoning: 'Unsupported document type - no analysis performed' 
  };
}


// Member best-match by name and DOB
async function bestMatchMemberId(fields: ExtractField[]): Promise<string | undefined> {
  const name = fields.find(f => f.path === 'person.name')?.value;
  const dob = fields.find(f => f.path === 'person.dateOfBirth')?.value;
  if (!name && !dob) return undefined;

  try {
    const members = await db.select().from(familyMembers).where(eq(familyMembers.familyId, 'family-1'));
    
    // Simple exact DOB + name includes matching
    const hit = members.find(m => {
      const dobMatch = !dob || (m.dateOfBirth && new Date(m.dateOfBirth).toISOString().slice(0, 10) === dob);
      const nameMatch = !name || (m.name || '').toLowerCase().includes(name.toLowerCase());
      return dobMatch && nameMatch;
    });
    
    return hit?.id;
  } catch (error) {
    console.error('[MEMBER_MATCH] Failed to match member:', error);
    return undefined;
  }
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

    // Guard against legacy uploads with hardcoded paths
    if (item.fileUrl?.startsWith('uploads/')) {
      console.log(`[AI] Legacy upload detected: ${item.fileUrl}`);
      await db.update(inboxItems).set({ status: 'failed' }).where(eq(inboxItems.id, id));
      
      return res.status(410).json({
        error: 'legacy_key_unusable',
        message: 'This file was uploaded with an old format and cannot be analyzed. Please re-upload it.',
        hint: 'Re-upload to use AI analysis'
      });
    }

    await db.update(inboxItems).set({ status: 'analyzing' }).where(eq(inboxItems.id, id));
    step('updated status to analyzing');

    // ---- COMPREHENSIVE ANALYSIS ----
    const routing = routeDocType(item.filename || '', item.mimeType || '');
    let suggestions: AISuggestions;
    
    const bucket = process.env.S3_BUCKET_DOCS!;
    const key = item.fileUrl || '';
    
    if (routing.isImage && (routing.docType === 'driverLicense' || routing.docType === 'passport' || routing.docType === 'idCard')) {
      suggestions = await analyzeIdDoc(bucket, key, routing.docType);
    } else if (routing.isPdf && routing.docType === 'insurance') {
      suggestions = await analyzeInsuranceDoc(bucket, key);
    } else {
      suggestions = await analyzeGeneric(bucket, key);
    }
    
    // Best-match member by name/DOB from extracted fields
    suggestions.memberId = await bestMatchMemberId(suggestions.fields);
    
    step('comprehensive analysis complete');
    // ------------------------------------

    // Simulate member matching delay
    await new Promise(resolve => setTimeout(resolve, 50));
    step('matched member');

    // persist fields with new ExtractField format
    for (const f of suggestions.fields) {
      await db.insert(extractedFields).values({
        inboxItemId: id, 
        fieldKey: f.key, 
        fieldValue: f.value, 
        confidence: f.confidence, 
        isPii: f.path?.includes('person') || false, // Mark person data as PII
      });
    }
    step('persisted extracted fields');

    await db.update(inboxItems).set({
      status: 'suggested',
      suggestedMemberId: suggestions.memberId || undefined,
    }).where(eq(inboxItems.id, id));
    step('updated final status');

    console.log(`[AI] Analysis complete for ${id} in ${Date.now() - t0}ms`);
    
    // Emit real-time success event
    const io = getIoServer();
    if (io && item.familyId) {
      const memberName = suggestions.memberId ? 'Family Member' : null; // TODO: lookup real name
      io.to(`family:${item.familyId}`).emit('inbox:ready', {
        uploadId: id,
        fileName: item.filename,
        detailsCount: suggestions.fields.length,
        fields: suggestions.fields,
        suggestion: suggestions.memberId ? {
          memberId: suggestions.memberId,
          memberName,
          confidence: 92
        } : null
      });
      console.log(`[AI] Emitted inbox:ready event to family:${item.familyId}`);
    }
    
    // return exactly what UI expects - convert new format to legacy for compatibility
    const legacySuggestion = suggestions.memberId ? {
      memberId: suggestions.memberId,
      memberName: 'Family Member', // TODO: lookup real name
      confidence: 92
    } : null;
    
    return res.json({ 
      suggestion: legacySuggestion, 
      fields: suggestions.fields,
      suggestions // Include new format for future client updates
    });
  } catch (e: any) {
    // Comprehensive error handling with detailed feedback
    const payload = {
      ok: false,
      stage: 'analyze',
      error: e.name || 'Error',
      message: e.message || String(e),
      code: e.$metadata?.httpStatusCode,
    };
    console.error('ANALYZE_FAIL', id, payload);
    
    // Update status to failed in DB
    await db.update(inboxItems).set({
      status: 'failed',
    }).where(eq(inboxItems.id, id));
    
    // Get item for family ID and emit real-time failure event with detailed error
    const item = await db.query.inboxItems.findFirst({ where: eq(inboxItems.id, id) });
    const io = getIoServer();
    if (io && item?.familyId) {
      io.to(`family:${item.familyId}`).emit('inbox:failed', {
        uploadId: id,
        fileName: item.filename,
        error: payload.message,
        stage: payload.stage,
        code: payload.code
      });
      console.log(`[AI] Emitted detailed inbox:failed event to family:${item.familyId}`);
    }
    
    // Return 200 with ok:false to keep UI logic simple
    return res.status(200).json(payload);
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

// ——— Upsert functions for field mapping ———

async function upsertPerson(memberId: string, patch: any) {
  try {
    await db.update(familyMembers)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(familyMembers.id, memberId));
  } catch (error) {
    console.error('[UPSERT_PERSON] Error:', error);
  }
}

async function upsertDriverLicense(memberId: string, fields: any) {
  try {
    const content = JSON.stringify({
      type: "driver_license",
      ...fields,
      extractedAt: new Date().toISOString()
    });

    await db.insert(familyResources)
      .values({
        familyId: "family-1", 
        title: `Driver License - ${fields.state || 'Unknown'}`,
        category: "documents",
        subcategory: "driver_license", 
        contentType: "file",
        content,
        createdBy: memberId
      })
      .onConflictDoUpdate({
        target: [familyResources.familyId, familyResources.subcategory], 
        set: { content, updatedAt: new Date() }
      });
  } catch (error) {
    console.error('[UPSERT_DL] Error:', error);
  }
}

async function upsertPassport(memberId: string, fields: any) {
  try {
    const content = JSON.stringify({
      type: "passport",
      ...fields,
      extractedAt: new Date().toISOString()
    });

    await db.insert(familyResources)
      .values({
        familyId: "family-1",
        title: `Passport - ${fields.country || 'Unknown'}`,
        category: "documents", 
        subcategory: "passport",
        contentType: "file",
        content,
        createdBy: memberId
      })
      .onConflictDoUpdate({
        target: [familyResources.familyId, familyResources.subcategory],
        set: { content, updatedAt: new Date() }
      });
  } catch (error) {
    console.error('[UPSERT_PASSPORT] Error:', error);
  }
}

async function upsertInsurance(memberId: string, fields: any) {
  try {
    // Create/update policy
    if (fields.carrier || fields.policyNumber) {
      await db.insert(familyInsurancePolicies)
        .values({
          familyId: "family-1",
          policyName: fields.policyNumber || "Unknown Policy",
          provider: fields.carrier
        })
        .onConflictDoNothing();
    }

    // Add coverage item
    if (fields.coverage) {
      await db.insert(familyInsuranceItems)
        .values({
          familyId: "family-1", 
          itemName: fields.coverage,
          description: `Coverage from ${fields.carrier || 'Unknown Provider'}`
        });
    }
  } catch (error) {
    console.error('[UPSERT_INSURANCE] Error:', error);
  }
}

/** POST /api/inbox/:id/accept - Comprehensive field mapping */
aiInboxRouter.post("/:id/accept", async (req, res) => {
  const { memberId, suggestions } = z.object({ 
    memberId: z.string(),
    suggestions: z.object({
      fields: z.array(z.object({
        key: z.string(),
        value: z.string(),
        path: z.string()
      }))
    })
  }).parse(req.body);
  const id = req.params.id;

  try {
    // Group fields by type for efficient upserts
    const dlFields: any = {};
    const passportFields: any = {};
    const insuranceFields: any = {};
    const personUpdates: any = {};

    for (const f of suggestions.fields) {
      const path = f.path;

      // Person → family_members
      if (path === 'person.name') {
        personUpdates.name = f.value;
      } else if (path === 'person.dateOfBirth') {
        personUpdates.dateOfBirth = new Date(f.value);
      } else if (path === 'person.phone') {
        personUpdates.phoneNumber = f.value;
      } else if (path === 'person.email') {
        personUpdates.email = f.value;
      } else if (path.startsWith('person.address.')) {
        // Address fields - store in familyResources for now
        await db.insert(familyResources).values({
          familyId: 'family-1',
          title: 'Address Information',
          category: 'documents',
          subcategory: 'address',
          contentType: 'file',
          content: JSON.stringify({ [path.split('.').pop()!]: f.value }),
          createdBy: memberId
        }).onConflictDoNothing();
      }

      // Driver License → family_resources
      else if (path.startsWith('ids.driverLicense.')) {
        const part = path.split('.').pop()!;
        dlFields[part] = f.value;
      }

      // Passport → family_resources
      else if (path.startsWith('ids.passport.')) {
        const part = path.split('.').pop()!;
        passportFields[part] = f.value;
      }

      // Insurance → family_insurance_policies + items
      else if (path.startsWith('insurance.')) {
        const part = path.split('.').pop()!;
        insuranceFields[part] = f.value;
      }
    }

    // Execute upserts
    if (Object.keys(personUpdates).length > 0) {
      await upsertPerson(memberId, personUpdates);
    }
    if (Object.keys(dlFields).length > 0) {
      await upsertDriverLicense(memberId, dlFields);
    }
    if (Object.keys(passportFields).length > 0) {
      await upsertPassport(memberId, passportFields);
    }
    if (Object.keys(insuranceFields).length > 0) {
      await upsertInsurance(memberId, insuranceFields);
    }

    // Mark inbox item as accepted
    await db.update(inboxItems)
      .set({ 
        status: "accepted",
        suggestedMemberId: memberId,
        acceptedAt: new Date()
      })
      .where(eq(inboxItems.id, id));

    res.json({ ok: true, message: 'Fields successfully mapped to database' });
  } catch (error) {
    console.error("[AI INBOX] Accept error:", error);
    res.status(500).json({ error: "Failed to accept and process fields" });
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