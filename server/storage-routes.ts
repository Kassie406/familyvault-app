import { Router } from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

// S3 Client Configuration
const s3 = new S3Client({
  region: process.env.S3_REGION ?? "auto",
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

const storage = Router();

// Security: Rate limiting for upload endpoints
const uploadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 uploads per windowMs
  message: {
    error: "Too many upload requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security: Slow down aggressive upload requests
const uploadSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 5, // Allow 5 requests per windowMs without delay
  delayMs: (used, req) => (used - 5) * 1000, // Add 1s delay per request after 5th
  maxDelayMs: 10000, // Max 10s delay
});

// Security: Apply rate limiting to all storage routes
storage.use(uploadRateLimit);
storage.use(uploadSlowDown);

// Security: Set secure headers for all responses
storage.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Request validation schema
const presignRequestSchema = z.object({
  type: z.enum(["document", "photo"]),
  fileName: z.string().min(1).max(255),
  contentType: z.string().min(1),
  contentLength: z.number().optional(),
  familyId: z.string().optional(),
});

// MIME type validation
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

const ALLOWED_PHOTO_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif'
];

// Size limits (in bytes)
const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_PHOTO_SIZE = 10 * 1024 * 1024;    // 10MB

/**
 * POST /api/storage/presign
 * Request: { type: "document" | "photo", fileName, contentType, contentLength?, familyId? }
 * Response: { uploadUrl, key, bucket, expiresIn, publicUrl }
 */
storage.post("/presign", async (req, res) => {
  try {
    // Validate request body
    const result = presignRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        error: "Invalid request",
        details: result.error.issues.map(i => i.message).join(", ")
      });
    }

    const { type, fileName, contentType, contentLength, familyId } = result.data;

    // Validate MIME type
    const allowedTypes = type === "photo" ? ALLOWED_PHOTO_TYPES : ALLOWED_DOCUMENT_TYPES;
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ 
        error: `Unsupported file type: ${contentType}`,
        allowedTypes 
      });
    }

    // Validate file size
    const maxSize = type === "photo" ? MAX_PHOTO_SIZE : MAX_DOCUMENT_SIZE;
    if (contentLength && contentLength > maxSize) {
      return res.status(400).json({ 
        error: `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB` 
      });
    }

    // Determine bucket
    const bucket = type === "photo" 
      ? process.env.S3_BUCKET_PHOTOS! 
      : process.env.S3_BUCKET_DOCS!;

    if (!bucket) {
      console.error(`Missing bucket config for type: ${type}`);
      return res.status(500).json({ error: "Storage configuration error" });
    }

    // Generate storage key with organized structure
    const now = new Date();
    const yyyy = String(now.getUTCFullYear());
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const baseName = fileName
      .replace(/[^\w.\-]+/g, "_")
      .toLowerCase()
      .substring(0, 100); // Limit filename length
    
    const key = `${familyId ?? "family"}/${type}s/${yyyy}/${mm}/${randomUUID()}-${baseName}`;

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ...(contentLength && { ContentLength: contentLength }),
      ACL: "private", // Always private, access via presigned URLs
    });

    const expiresIn = 60 * 5; // 5 minutes
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

    // Generate public URL for CDN access (if configured)
    const publicBase = process.env.PUBLIC_CDN_BASE?.replace(/\/+$/, "");
    const publicUrl = publicBase ? `${publicBase}/${key}` : undefined;

    res.json({ 
      uploadUrl, 
      key, 
      bucket, 
      expiresIn, 
      publicUrl,
      maxSize: Math.round(maxSize / 1024 / 1024) 
    });

  } catch (err: any) {
    console.error("[presign.error]", err);
    res.status(500).json({ 
      error: "Failed to create presigned URL",
      message: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

/**
 * GET /api/storage/download/:key
 * Generate presigned download URL for private files
 */
storage.get("/download/:key(*)", async (req, res) => {
  try {
    const key = req.params.key;
    if (!key) {
      return res.status(400).json({ error: "Missing storage key" });
    }

    // TODO: Add authorization check - verify user has access to this file
    // This would involve checking the file's familyId against user's family membership

    // Determine bucket from key structure
    const bucket = key.includes('/photos/') 
      ? process.env.S3_BUCKET_PHOTOS!
      : process.env.S3_BUCKET_DOCS!;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(s3, command, { 
      expiresIn: 60 * 15 // 15 minutes
    });

    res.json({ downloadUrl, expiresIn: 60 * 15 });

  } catch (err: any) {
    console.error("[download.error]", err);
    res.status(500).json({ error: "Failed to generate download URL" });
  }
});

/**
 * GET /api/storage/usage/:familyId
 * Get storage usage statistics for a family
 */
storage.get("/usage/:familyId", async (req, res) => {
  try {
    const { familyId } = req.params;
    
    // TODO: Implement storage usage calculation
    // This would query documentFiles and familyPhotos tables to sum up storage usage
    
    res.json({
      familyId,
      totalFiles: 0,
      totalSize: 0,
      documentCount: 0,
      documentSize: 0,
      photoCount: 0,
      photoSize: 0,
      quotaBytes: 5 * 1024 * 1024 * 1024, // 5GB default
      quotaUsedPercent: 0
    });

  } catch (err: any) {
    console.error("[usage.error]", err);
    res.status(500).json({ error: "Failed to get storage usage" });
  }
});

export default storage;