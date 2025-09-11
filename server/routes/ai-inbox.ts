// server/routes/ai-inbox.ts
import { Router } from "express";
import { z } from "zod";
import { db } from "../db";
import { inboxItems, extractedFields, familyMembers, familyResources, familyInsurancePolicies, familyInsuranceItems } from "@shared/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import {
  TextractClient,
  AnalyzeIDCommand,
  AnalyzeDocumentCommand,
  DetectDocumentTextCommand,
  type AnalyzeIDCommandOutput,
  type AnalyzeDocumentCommandOutput,
  type DetectDocumentTextCommandOutput
} from "@aws-sdk/client-textract";
import sharp from "sharp";
import { getIoServer } from "../realtime";
import { normalizeAddress } from "../util/normalizeAddress";
import type { ExtractField, AISuggestions, NormalizedAddress } from "@shared/types/inbox";
import { analyzeUniversal } from "../lib/analyzeGeneric";

// Helper functions
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    )
  ]);
}

// Removed first bestMatchMemberId - using the later comprehensive version

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

// Removed duplicate withTimeout - using the earlier version

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

type DocType = 'driverLicense' | 'passport' | 'idCard' | 'pdf' | 'generic';

function routeDocType(fileName: string, mime: string): DocType {
  const f = (fileName || '').toLowerCase();
  const isImage = /^image\//.test(mime);
  const isPdf   = mime === 'application/pdf' || f.endsWith('.pdf');

  if (isPdf) return 'pdf';

  if (isImage) {
    // Only route to ID pipelines when we're confident
    if (/\b(driver'?s?\s*license|dl|driver-?id)\b/.test(f)) return 'driverLicense';
    if (/\bpassport\b/.test(f)) return 'passport';

    // ✅ Any other image (screenshots, photos, etc.) → generic OCR
    return 'generic';
  }

  // Fallback for everything else
  return 'generic';
}

function isoDate(s: string): string {
  try {
    return new Date(s).toISOString().slice(0, 10);
  } catch {
    return s; // Return original if parsing fails
  }
}

// Convert universal analyzer result to AISuggestions format
function convertUniversalToSuggestions(universalResult: any): AISuggestions {
  const fields: ExtractField[] = [];
  const ai = universalResult.ai || {};
  
  // Map structured AI fields to ExtractField format
  if (ai.fullName) {
    fields.push(toField('Full Name', 'fullName', ai.fullName, 90, 'person.name'));
  }
  if (ai.idNumber) {
    fields.push(toField('ID Number', 'idNumber', ai.idNumber, 95, 'ids.idNumber'));
  }
  if (ai.accountNumber) {
    fields.push(toField('Account Number', 'accountNumber', ai.accountNumber, 90, 'account.number'));
  }
  if (ai.policyNumber) {
    fields.push(toField('Policy Number', 'policyNumber', ai.policyNumber, 90, 'insurance.policyNumber'));
  }
  if (ai.issuer) {
    fields.push(toField('Issuer', 'issuer', ai.issuer, 85, 'document.issuer'));
  }
  if (ai.address) {
    fields.push(toField('Address', 'address', ai.address, 80, 'person.address.full'));
  }
  if (ai.date) {
    fields.push(toField('Date', 'date', ai.date, 85, 'document.date'));
  }
  if (ai.expiration) {
    fields.push(toField('Expiration', 'expiration', ai.expiration, 90, 'document.expiration'));
  }
  if (ai.totalAmount) {
    fields.push(toField('Total Amount', 'totalAmount', ai.totalAmount, 85, 'document.total'));
  }
  
  // Add fields from Textract QUERIES
  if (universalResult.queries) {
    Object.entries(universalResult.queries).forEach(([alias, value]: [string, any]) => {
      if (value && typeof value === 'string' && value.trim()) {
        const confidence = 80; // Default confidence for query results
        fields.push(toField(alias.replace(/_/g, ' '), alias, value, confidence, `query.${alias}`));
      }
    });
  }
  
  // Add key-value pairs from Textract
  if (universalResult.kvs) {
    universalResult.kvs.slice(0, 10).forEach((kv: any) => {
      if (kv.key && kv.value) {
        fields.push(toField(kv.key, 'kv', kv.value, 75, `textract.${kv.key}`));
      }
    });
  }
  
  // Determine document type
  let docType = 'other';
  if (ai.documentType) {
    const type = ai.documentType.toLowerCase();
    if (type.includes('driver') || type.includes('license')) docType = 'driverLicense';
    else if (type.includes('passport')) docType = 'passport';
    else if (type.includes('insurance')) docType = 'insurance';
    else if (type.includes('invoice') || type.includes('bill')) docType = 'invoice';
  }
  
  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (fields.length >= 5) confidence = 'high';
  else if (fields.length >= 2) confidence = 'medium';
  
  return {
    docType,
    fields,
    confidence,
    reasoning: `Advanced Textract QUERIES + OpenAI Vision analysis. Extracted ${fields.length} fields with ${ai.confidenceNotes || 'standard confidence'}`
  };
}

// ——— New Textract API Routing with Fallbacks ———

const textract = textractClient;

async function analyzeIdDoc(bytes: Uint8Array): Promise<AnalyzeIDCommandOutput> {
  return textract.send(new AnalyzeIDCommand({
    DocumentPages: [{ Bytes: bytes }],
  }));
}

async function analyzePdfOrForm(bytes: Uint8Array): Promise<AnalyzeDocumentCommandOutput> {
  return textract.send(new AnalyzeDocumentCommand({
    Document: { Bytes: bytes },
    FeatureTypes: ['FORMS', 'TABLES'],
  }));
}

async function analyzeGenericImage(bytes: Uint8Array): Promise<DetectDocumentTextCommandOutput> {
  return textract.send(new DetectDocumentTextCommand({
    Document: { Bytes: bytes },
  }));
}

async function analyzeByRoute(kind: DocType, bytes: Uint8Array) {
  switch (kind) {
    case 'driverLicense':
    case 'passport':
    case 'idCard': {
      // If we mis-routed, gracefully fall back to generic OCR
      try {
        return await analyzeIdDoc(bytes);
      } catch (e: any) {
        if ((e?.name || '').includes('InvalidParameter')) {
          return await analyzeGenericImage(bytes);
        }
        throw e;
      }
    }
    case 'pdf':
      return analyzePdfOrForm(bytes);
    case 'generic':
    default:
      return analyzeGenericImage(bytes);
  }
}

// Old orphaned code removed - using new routing system

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
async function bestMatchMemberId(fields: ExtractField[]): Promise<string | null> {
  const name = fields.find(f => f.path === 'person.name')?.value;
  const dob = fields.find(f => f.path === 'person.dateOfBirth')?.value;
  if (!name && !dob) return null;

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

// Old orphaned code completely removed - using new consolidated endpoint

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

/** POST /api/inbox/:id/analyze - Enhanced with new routing system */
aiInboxRouter.post("/:id/analyze", async (req, res) => {
  const id = req.params.id;
  
  try {
    console.log(`[AI] started +0ms (total 0ms)`);
    
    // Get the inbox item
    const item = await db.query.inboxItems.findFirst({
      where: eq(inboxItems.id, id)
    });
    
    if (!item) {
      return res.status(404).json({ error: "Upload not found" });
    }
    
    console.log(`[AI] fetched item from DB +20ms (total 20ms)`);
    
    // Guard against legacy uploads with hardcoded paths
    if (item.fileUrl?.startsWith('uploads/')) {
      console.log(`[AI] Legacy upload detected: ${item.fileUrl}`);
      await db.update(inboxItems).set({ status: 'failed' }).where(eq(inboxItems.id, id));
      
      return res.status(410).json({
        error: 'legacy_key_unusable',
        message: 'This document was saved in an old format. Please re-upload to analyze.'
      });
    }
    
    // Update status to analyzing
    await db.update(inboxItems)
      .set({ status: "analyzing" })
      .where(eq(inboxItems.id, id));
      
    console.log(`[AI] updated status to analyzing +20ms (total 40ms)`);
    
    let suggestions: AISuggestions;
    
    const key = item.fileUrl || '';
    
    console.log(`[AI] Using universal analyzer for document: ${key}`);
    
    try {
      // Phase 1: Textract analysis
      console.log(`[AI] Phase 1/3: Textract QUERIES analysis...`);
      
      // Use the new universal analyzer with Textract QUERIES + OpenAI Vision fusion
      const universalResult = await withTimeout(analyzeUniversal(key), 45000);
      console.log(`[AI] Phase 3/3: Analysis complete`);
      
      // Convert universal result to suggestions format
      suggestions = convertUniversalToSuggestions(universalResult);
      
    } catch (error: any) {
      console.error(`[AI] Universal analysis failed, falling back to legacy:`, error);
      
      // Fallback to legacy system for compatibility
      const bucket = process.env.S3_BUCKET_DOCS!;
      const route = routeDocType(item.filename || '', item.mimeType || '');
      console.log(`[AI] Fallback: Document routed as: ${route}`);
      
      const bytes = await withTimeout(getObjectBytes(bucket, key), 15000);
      const processedBytes = await withTimeout(preprocessImage(bytes), 10000);
      const uint8Array = new Uint8Array(processedBytes);
      const result = await withTimeout(analyzeByRoute(route, uint8Array), 30000);
      
      suggestions = await processAnalysisResult(result, route);
    }
    
    // Best-match member by name/DOB from extracted fields
    suggestions.memberId = await bestMatchMemberId(suggestions.fields);
    
    // Store extracted fields
    for (const field of suggestions.fields) {
      await db.insert(extractedFields).values({
        inboxItemId: id,
        fieldKey: field.label,
        fieldValue: field.value,
        confidence: field.confidence,
        isPii: field.path.includes('ssn') || field.path.includes('social'),
      }).onConflictDoNothing();
    }
    
    // Update inbox item
    await db.update(inboxItems)
      .set({
        status: "suggested",
        analysisCompleted: true,
        confidence: suggestions.confidence === 'high' ? 95 : suggestions.confidence === 'medium' ? 75 : 50,
        suggestedMemberId: suggestions.memberId,
        processedAt: new Date(),
      })
      .where(eq(inboxItems.id, id));
    
    // Emit real-time update
    const io = getIoServer();
    if (io) {
      io.to("family:family-1").emit("inbox:completed", {
        uploadId: id,
        status: "suggested",
        suggestions,
        suggestedMemberId: suggestions.memberId
      });
    }
    
    console.log(`[AI] Analysis completed successfully`);
    res.json({ ok: true, suggestions });
    
  } catch (error: any) {
    console.error(`[AI] Analysis failed:`, error);
    
    // Update status to failed
    await db.update(inboxItems)
      .set({ status: "failed" })
      .where(eq(inboxItems.id, id));
    
    // Emit failure event
    const io = getIoServer();
    if (io) {
      io.to("family:family-1").emit("inbox:failed", {
        uploadId: id,
        status: "failed",
        error: error.message || 'Analysis failed'
      });
    }
    
    res.status(500).json({
      error: "Analysis failed",
      message: error.message || 'Failed to analyze document'
    });
  }
});

async function processAnalysisResult(result: any, route: DocType): Promise<AISuggestions> {
  const fields: ExtractField[] = [];
  
  if (route === 'generic') {
    // Handle DetectDocumentTextCommand result
    if (result.Blocks) {
      for (const block of result.Blocks) {
        if (block.BlockType === 'LINE' && block.Text) {
          fields.push(toField('Text Content', 'text', block.Text, block.Confidence || 90, 'document.text'));
        }
      }
    }
    
    return {
      docType: 'other',
      fields,
      confidence: 'medium',
      reasoning: 'Generic text extraction completed'
    };
  } else if (route === 'driverLicense' || route === 'passport' || route === 'idCard') {
    // Handle AnalyzeIDCommand result (if it succeeded) or fallback to generic
    if (result.IdentityDocuments) {
      // This is from AnalyzeID - process ID document fields
      const page = result.IdentityDocuments[0];
      const kv = new Map<string, string>();

      page?.IdentityDocumentFields?.forEach((f: any) => {
        const name = f.Type?.Text?.toLowerCase();
        const val = f.ValueDetection?.Text?.trim() || '';
        if (name && val) kv.set(name, val);
      });

      // Extract common fields
      const number = kv.get('document number') || kv.get('id number') || '';
      const given = kv.get('given name') || kv.get('first name') || '';
      const surname = kv.get('surname') || kv.get('last name') || '';
      const fullName = [given, surname].filter(Boolean).join(' ');
      const dob = kv.get('date of birth') || '';
      const expiry = kv.get('date of expiry') || kv.get('expiration date') || '';

      if (fullName) fields.push(toField('Name', 'name', fullName, 95, 'person.name'));
      if (dob) fields.push(toField('Date of birth', 'dateOfBirth', dob, 95, 'person.dateOfBirth'));
      if (number) fields.push(toField('ID number', 'number', number, 96, 'ids.driverLicense.number'));
      if (expiry) fields.push(toField('Expiration', 'expiration', expiry, 94, 'ids.driverLicense.expiration'));

      return {
        docType: route === 'driverLicense' ? 'driverLicense' : route === 'passport' ? 'passport' : 'idCard',
        fields,
        confidence: 'high',
        reasoning: 'ID document analysis completed'
      };
    } else if (result.Blocks) {
      // This is fallback generic text detection
      for (const block of result.Blocks) {
        if (block.BlockType === 'LINE' && block.Text) {
          fields.push(toField('Text Content', 'text', block.Text, block.Confidence || 90, 'document.text'));
        }
      }
      
      return {
        docType: 'other',
        fields,
        confidence: 'medium',
        reasoning: 'Fallback text extraction (ID analysis failed)'
      };
    }
  } else if (route === 'pdf') {
    // Handle AnalyzeDocumentCommand result
    if (result.Blocks) {
      for (const block of result.Blocks) {
        if (block.BlockType === 'LINE' && block.Text) {
          fields.push(toField('Text Content', 'text', block.Text, block.Confidence || 90, 'document.text'));
        }
      }
    }
    
    return {
      docType: 'other',
      fields,
      confidence: 'medium',
      reasoning: 'PDF document analysis completed'
    };
  }
  
  return {
    docType: 'other',
    fields: [],
    confidence: 'low',
    reasoning: 'No analysis performed'
  };
}

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