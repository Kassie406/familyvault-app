import {
  TextractClient,
  AnalyzeDocumentCommand,
} from "@aws-sdk/client-textract";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from "openai";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { Readable } from "node:stream";

// Optimized AWS clients with region matching for minimal latency
const AWS_REGION = process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1';

const textract = new TextractClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

// Validate AWS credentials at startup
function validateAWSCredentials(): boolean {
  const requiredVars = ['S3_ACCESS_KEY', 'S3_SECRET_KEY', 'S3_BUCKET_DOCS'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.warn(`[ANALYZE_UNIVERSAL] Missing AWS credentials: ${missing.join(', ')} - Textract analysis will be disabled`);
    return false;
  }
  
  console.log(`[ANALYZE_UNIVERSAL] AWS credentials validated for region: ${AWS_REGION}`);
  return true;
}

// Initialize OpenAI client with graceful error handling
let openai: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log('[ANALYZE_UNIVERSAL] OpenAI client initialized - Vision fusion enabled');
  } else {
    console.warn('[ANALYZE_UNIVERSAL] OpenAI API key not configured - Vision fusion will be disabled');
  }
} catch (error) {
  console.warn('[ANALYZE_UNIVERSAL] Failed to initialize OpenAI client - Vision fusion will be disabled:', error);
}

const AWS_AVAILABLE = validateAWSCredentials();

// Cost optimization settings
const COST_SETTINGS = {
  MAX_PAGES_PREVIEW: 1,        // First page only for cost efficiency
  MAX_PAGES_FULL: 10,          // Cap for full analysis
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024,  // 10MB threshold for preview mode
  ENABLE_VISION_FUSION: !!openai,   // Enable only if OpenAI client is available
  ENABLE_TEXTRACT: AWS_AVAILABLE,   // Enable only if AWS credentials available
  VISION_MAX_TOKENS: 1000,     // Limit Vision API token usage
};

function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

// --- 1) Pull bytes from S3 (first page image for multi-page PDFs) ---
export async function loadBytesFromS3(key: string): Promise<{ mime: string; bytes: Buffer }> {
  const bucket = process.env.S3_BUCKET_DOCS;
  if (!bucket) {
    throw new Error('S3_BUCKET_DOCS environment variable is not configured');
  }
  const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const body = await streamToBuffer(obj.Body as any);
  const ct = (obj.ContentType || "").toLowerCase();

  // If PDF, render page 1 to PNG for OpenAI Vision preview, but keep PDF bytes for Textract.
  if (ct.includes("pdf") || key.toLowerCase().endsWith(".pdf")) {
    return { mime: "application/pdf", bytes: body };
  }
  return { mime: ct || "application/octet-stream", bytes: body };
}

// --- 2) PDF Page Limiting for Cost Control ---
async function limitPdfPages(pdfBytes: Buffer, maxPages: number): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    
    if (totalPages <= maxPages) {
      console.log(`[TEXTRACT] PDF has ${totalPages} pages, no truncation needed`);
      return pdfBytes;
    }
    
    console.log(`[TEXTRACT] Limiting PDF from ${totalPages} to ${maxPages} pages for cost control`);
    
    // Create new document with limited pages
    const newDoc = await PDFDocument.create();
    for (let i = 0; i < Math.min(maxPages, totalPages); i++) {
      const [page] = await newDoc.copyPages(pdfDoc, [i]);
      newDoc.addPage(page);
    }
    
    const limitedBytes = await newDoc.save();
    return Buffer.from(limitedBytes);
    
  } catch (error) {
    console.warn(`[TEXTRACT] Failed to limit PDF pages, using original:`, error);
    return pdfBytes;
  }
}

// --- 3) Textract AnalyzeDocument WITH QUERIES (with cost controls) ---
export async function textractAnalyzeDocument(originalBytes: Uint8Array, isPreview: boolean = false, mime: string = 'unknown') {
  if (!COST_SETTINGS.ENABLE_TEXTRACT) {
    throw new Error('Textract analysis disabled - missing AWS credentials');
  }
  
  let bytes = originalBytes;
  
  // Cost control: Apply page limits for PDFs
  if (mime.includes('pdf') && bytes.length > 0) {
    const maxPages = isPreview ? COST_SETTINGS.MAX_PAGES_PREVIEW : COST_SETTINGS.MAX_PAGES_FULL;
    const limitedBytes = await limitPdfPages(Buffer.from(bytes), maxPages);
    bytes = new Uint8Array(limitedBytes);
    console.log(`[TEXTRACT] Processing PDF with page limit: ${maxPages} pages, size: ${bytes.length} bytes`);
  }
  
  // Cost control: Warn about large documents
  if (!isPreview && bytes.length > COST_SETTINGS.MAX_DOCUMENT_SIZE) {
    console.warn(`[TEXTRACT] Large document detected (${(bytes.length / 1024 / 1024).toFixed(1)}MB), consider preview mode for cost efficiency`);
  }
  // QUERIES: generic questions that work across doc types.
  // Textract supports up to ~30 queries. Start small; expand as needed.
  const QueriesConfig = {
    Queries: [
      { Text: "What is the document type?", Alias: "document_type" },
      { Text: "What is the issuing agency or organization?", Alias: "issuer" },
      // SSN card specific queries
      { Text: "What is the Social Security Number (SSN)?", Alias: "ssn" },
      { Text: "What is the name on the Social Security card?", Alias: "ssn_name" },
      
      { Text: "What is the full name on the document?", Alias: "full_name" },
      { Text: "What is the date (issue or printed date)?", Alias: "date" },
      { Text: "What is the address?", Alias: "address" },
      { Text: "What is the ID number or account number?", Alias: "id_or_account" },
      { Text: "What is the expiration date?", Alias: "expiration" },
      { Text: "What is the policy or certificate number?", Alias: "policy_or_certificate" },
      { Text: "What is the total amount due or total?", Alias: "total" },
    ],
  };

  const cmd = new AnalyzeDocumentCommand({
    Document: { Bytes: bytes },
    FeatureTypes: ["TABLES", "FORMS", "QUERIES"],
    QueriesConfig,
  });

  return textract.send(cmd);
}

// --- SSN Extraction Helper Functions ---
function allWordsText(blocks: any[]): string {
  return blocks
    .filter((b: any) => b.BlockType === "WORD" && typeof b.Text === "string")
    .map((b: any) => b.Text)
    .join(" ");
}

function extractSsnFromText(txt: string): string | null {
  // Normalize separators like '123 45 6789' or '123-45-6789'
  const candidates = [
    /\b(\d{3})[-\s]?(\d{2})[-\s]?(\d{4})\b/g,
  ];
  for (const r of candidates) {
    const m = r.exec(txt);
    if (m) {
      const ssn = `${m[1]}-${m[2]}-${m[3]}`;
      // Filter obviously invalid SSNs (000/666 or 900-999 area)
      const area = +m[1];
      if (area !== 0 && area !== 666 && area < 900) return ssn;
    }
  }
  return null;
}

function maskSsn(ssn: string): string {
  return ssn.replace(/^\d{3}-\d{2}/, "XXX-XX"); // show last 4 only
}

// --- 4) Build a compact signal from Textract blocks ---
type KV = { key: string; value: string };
function extractSignalFromTextract(resp: any) {
  const kvs: KV[] = [];
  const tableRows: string[][] = [];
  const queries: Record<string, string> = {};

  const blocks = resp.Blocks || [];

  // Queries
  for (const b of blocks) {
    if (b.BlockType === "QUERY_RESULT" && b.Text && b.Query && b.Query.Alias) {
      queries[b.Query.Alias] = b.Text;
    }
  }

  // Forms KVs (lightweight association)
  const byId: Record<string, any> = Object.fromEntries(blocks.map((b: any) => [b.Id, b]));
  for (const b of blocks) {
    if (b.BlockType === "KEY_VALUE_SET" && b.EntityTypes?.includes("KEY")) {
      const keyText = (b.Relationships || [])
        .flatMap((r: any) => r.Ids || [])
        .map((id: string) => byId[id])
        .filter((n: any) => n?.BlockType === "WORD" || n?.BlockType === "SELECTION_ELEMENT")
        .map((w: any) => w.Text || (w.SelectionStatus === "SELECTED" ? "☑︎" : ""))
        .join(" ")
        .trim();
      // find VALUE partner
      const valueSet = blocks.find(
        (bb: any) =>
          bb.BlockType === "KEY_VALUE_SET" &&
          bb.EntityTypes?.includes("VALUE") &&
          bb.Relationships?.some((rr: any) => (rr.Ids || []).includes(b.Id)),
      );
      const valueText = valueSet
        ? (valueSet.Relationships || [])
            .flatMap((r: any) => r.Ids || [])
            .map((id: string) => byId[id])
            .filter((n: any) => n?.BlockType === "WORD" || n?.BlockType === "SELECTION_ELEMENT")
            .map((w: any) => w.Text || (w.SelectionStatus === "SELECTED" ? "☑︎" : ""))
            .join(" ")
            .trim()
        : "";
      if (keyText || valueText) kvs.push({ key: keyText, value: valueText });
    }
  }

  // Tables (first few rows)
  const cellText: Record<string, string> = {};
  for (const b of blocks) {
    if (b.BlockType === "CELL") {
      cellText[b.Id] = (b.Relationships || [])
        .flatMap((r: any) => r.Ids || [])
        .map((id: string) => byId[id])
        .filter((n: any) => n?.BlockType === "WORD")
        .map((w: any) => w.Text)
        .join(" ")
        .trim();
    }
  }
  for (const b of blocks) {
    if (b.BlockType === "TABLE") {
      const rows: Record<number, Record<number, string>> = {};
      for (const rel of b.Relationships || []) {
        for (const id of rel.Ids || []) {
          const c = byId[id];
          if (c?.BlockType === "CELL") {
            rows[c.RowIndex] ||= {};
            rows[c.RowIndex][c.ColumnIndex] = cellText[c.Id] || "";
          }
        }
      }
      const normalized: string[][] = Object.keys(rows)
        .sort((a, b) => +a - +b)
        .map((ri) => {
          const row = rows[+ri];
          const cols = Object.keys(row).sort((a, b) => +a - +b).map((ci) => row[+ci]);
          return cols;
        });
      tableRows.push(...normalized.slice(0, 10));
    }
  }

  return { kvs, queries, tableRows };
}

// --- 4) Convert PDF page1 to PNG for Vision context (optional but very nice) ---
async function getPreviewImage(mime: string, bytes: Buffer): Promise<Buffer> {
  if (mime === "application/pdf") {
    // Create a PNG thumbnail from page 1 using pdf-lib + sharp
    // (Simple approach: render vector preview by rasterizing whole page at 144 dpi approx)
    // Here we just pass PDF bytes to Textract, and give Vision a 1000px-wide preview.
    // If you already have page images, reuse them.
    // Quick hack: many PDFs are actually scanned images, so just send the PDF bytes to Vision as file content too.
    // To keep runtime small, we'll return a downscaled JPEG from PDF bytes using sharp (works for many scanned PDFs).
    try {
      const img = await sharp(bytes, { pages: 1 }).jpeg({ quality: 80 }).resize({ width: 1000 }).toBuffer();
      return img;
    } catch {
      // Fallback: empty buffer; Vision step will skip image
      return Buffer.alloc(0);
    }
  } else {
    return await sharp(bytes).jpeg({ quality: 80 }).resize({ width: 1000 }).toBuffer();
  }
}

// --- 5) OpenAI Vision fusion step: unify fields into a typed schema ---
const SCHEMA = `
Return a JSON object with these optional fields when present:
{
  "documentType": string,                 // e.g., "Driver License", "Passport", "Invoice", "Insurance Card", "Bank Statement", "Social Security Card"
  "fullName": string,
  "ssnMasked": string,                    // mask as XXX-XX-1234 if SSN present
  "idNumber": string,
  "accountNumber": string,
  "policyNumber": string,
  "issuer": string,
  "address": string,
  "date": string,                         // issue or statement date (ISO if possible)
  "expiration": string,                   // (ISO if possible)
  "totalAmount": string,                  // numeric string if money
  "items": [ { "description": string, "qty": string, "amount": string } ],
  "confidenceNotes": string               // brief notes about confidence & assumptions
}
If the document appears to be a Social Security card, set documentType to "Social Security Card"
and include "ssnMasked" only (mask the first 5 digits).
Only include fields you can infer with reasonable confidence.
`;

export async function analyzeUniversal(key: string, options: { previewOnly?: boolean } = {}) {
  console.log(`[ANALYZE_UNIVERSAL] Starting analysis for ${key}, previewOnly: ${options.previewOnly}`);
  
  let textractResult: any = null;
  let signal: any = { kvs: [], queries: {}, tableRows: [] };
  let aiResult: any = {};
  
  try {
    // Check if AWS is available before trying to load from S3
    if (!AWS_AVAILABLE) {
      console.warn(`[ANALYZE_UNIVERSAL] AWS credentials unavailable - cannot load document from S3`);
      return {
        success: false,
        extractedData: {},
        textractSignal: signal,
        metadata: {
          textractUsed: false,
          visionUsed: false,
          analysis_failed: true,
          error: "Document analysis unavailable: AWS credentials not configured"
        }
      };
    }
    
    // 1) Load document bytes from S3
    const { mime, bytes } = await loadBytesFromS3(key);
    console.log(`[ANALYZE_UNIVERSAL] Loaded ${bytes.length} bytes, mime: ${mime}`);
    
    // 2) Textract analysis with cost optimization
    try {
      console.log(`[ANALYZE_UNIVERSAL] Phase 1/3: Running Textract QUERIES analysis...`);
      
      // Determine if we should use preview mode based on document size
      const shouldUsePreview = options.previewOnly || bytes.length > COST_SETTINGS.MAX_DOCUMENT_SIZE;
      if (shouldUsePreview) {
        console.log(`[ANALYZE_UNIVERSAL] Using preview mode: document size ${(bytes.length / 1024 / 1024).toFixed(1)}MB`);
      }
      
      textractResult = await textractAnalyzeDocument(bytes, shouldUsePreview, mime);
      signal = extractSignalFromTextract(textractResult);
      
      // SSN fallback from raw text if query didn't find it
      if (!signal.queries.ssn && textractResult?.Blocks) {
        const raw = allWordsText(textractResult.Blocks);
        const ssn = extractSsnFromText(raw);
        if (ssn) {
          signal.queries.ssn = ssn;
          console.log(`[ANALYZE_UNIVERSAL] SSN fallback extraction found: ${maskSsn(ssn)}`);
        }
      }
      
      console.log(`[ANALYZE_UNIVERSAL] Textract extracted: ${Object.keys(signal.queries).length} queries, ${signal.kvs.length} KVs, ${signal.tableRows.length} table rows`);
    } catch (textractError: any) {
      console.warn(`[ANALYZE_UNIVERSAL] Textract failed, continuing with fallback:`, textractError.message);
      // Continue with empty signal - OpenAI Vision can still analyze the image
    }
    
    // 3) OpenAI Vision fusion (if enabled and not preview-only)
    if (COST_SETTINGS.ENABLE_VISION_FUSION && openai && !options.previewOnly) {
      try {
        console.log(`[ANALYZE_UNIVERSAL] Phase 2/3: Running OpenAI Vision fusion...`);
        const preview = await getPreviewImage(mime, bytes);
        
        const parts: any[] = [
          { type: "text", text:
`You are an information extraction system. ${SCHEMA}

If this appears to be a Social Security card, extract the name and mask the SSN as XXX-XX-1234.
Prefer Textract query results when present; use the image for layout disambiguation.` },
          { type: "text", text: `QUERIES:\n${JSON.stringify(signal.queries, null, 2)}\n\nKEY_VALUES:\n${JSON.stringify(signal.kvs.slice(0, 40), null, 2)}\n\nTABLE_ROWS:\n${JSON.stringify(signal.tableRows.slice(0, 10), null, 2)}` },
        ];
        
        if (preview.length > 0) {
          parts.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${preview.toString("base64")}` } });
          console.log(`[ANALYZE_UNIVERSAL] Added image preview (${preview.length} bytes) to Vision request`);
        }
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Cost-optimized model
          messages: [
            { role: "system", content: "Extract and normalize document data. Be conservative; prefer 'not present' to hallucination." },
            { role: "user", content: parts as any },
          ],
          temperature: 0.1,
          max_tokens: COST_SETTINGS.VISION_MAX_TOKENS, // Cost control
          response_format: { type: "json_object" },
        });
        
        try { 
          aiResult = JSON.parse(completion.choices[0]?.message?.content || "{}"); 
          console.log(`[ANALYZE_UNIVERSAL] Vision AI extracted: ${Object.keys(aiResult).length} structured fields`);
        } catch (parseError) {
          console.warn(`[ANALYZE_UNIVERSAL] Failed to parse AI response, using fallback`);
          aiResult = { documentType: "unknown", confidenceNotes: "Parse error in AI response" };
        }
      } catch (visionError: any) {
        console.warn(`[ANALYZE_UNIVERSAL] Vision fusion failed, using Textract-only results:`, visionError.message);
        // Fall back to Textract-only analysis
        aiResult = {
          documentType: "textract_only",
          confidenceNotes: "Vision analysis failed, using Textract data only"
        };
      }
    } else {
      console.log(`[ANALYZE_UNIVERSAL] Skipping Vision fusion (disabled or preview mode)`);
      
      // Create structured fallback results based on available Textract queries
      const fallbackResult: any = {
        documentType: signal.queries?.document_type || "Document",
        fullName: signal.queries?.full_name || signal.queries?.ssn_name || null,
        issuer: signal.queries?.issuer || null,
        date: signal.queries?.date || null,
        address: signal.queries?.address || null,
        idNumber: signal.queries?.id_or_account || null,
        expiration: signal.queries?.expiration || null,
        totalAmount: signal.queries?.total || null,
        confidenceNotes: options.previewOnly ? "Preview mode - basic analysis only" : "Vision fusion disabled"
      };
      
      // Add SSN handling for fallback
      if (signal.queries?.ssn) {
        fallbackResult.ssnMasked = maskSsn(signal.queries.ssn);
        fallbackResult.documentType = "Social Security Card";
        fallbackResult.issuer = "Social Security Administration";
      }
      
      aiResult = fallbackResult;
    }
    
    console.log(`[ANALYZE_UNIVERSAL] Phase 3/3: Analysis complete`);
    
    // Ensure SSN masking for safety
    const ssnMasked = signal.queries?.ssn ? maskSsn(signal.queries.ssn) : undefined;
    
    // Prepare return data with masked SSN
    const safeQueries = { ...signal.queries };
    if (safeQueries.ssn) {
      safeQueries.ssnMasked = ssnMasked;
      delete safeQueries.ssn; // Remove unmasked SSN from response
    }
    
    return {
      documentKey: key,
      mime,
      queries: safeQueries, // Contains ssnMasked instead of ssn
      kvs: signal.kvs,
      tableRows: signal.tableRows,
      ai: {
        ...aiResult,
        // Ensure SSN lands in suggestions even if the model didn't include it
        ssnMasked: ssnMasked ?? aiResult?.ssnMasked ?? null,
        documentType: aiResult?.documentType ?? "Social Security Card",
        issuer: aiResult?.issuer ?? "Social Security Administration",
      },
      metadata: {
        textractSuccess: textractResult !== null,
        visionFusionUsed: COST_SETTINGS.ENABLE_VISION_FUSION && !options.previewOnly,
        previewMode: options.previewOnly || false,
        region: AWS_REGION,
        analysisTimestamp: new Date().toISOString()
      }
    };
    
  } catch (error: any) {
    console.error(`[ANALYZE_UNIVERSAL] Fatal error during analysis:`, error);
    
    // Emergency fallback - return minimal structure
    return {
      documentKey: key,
      mime: "unknown",
      queries: {},
      kvs: [],
      tableRows: [],
      ai: {
        documentType: "analysis_failed",
        confidenceNotes: `Analysis failed: ${error.message || 'Unknown error'}`
      },
      metadata: {
        textractSuccess: false,
        visionFusionUsed: false,
        previewMode: options.previewOnly || false,
        region: AWS_REGION,
        analysisTimestamp: new Date().toISOString(),
        error: error.message || 'Unknown error'
      }
    };
  }
}