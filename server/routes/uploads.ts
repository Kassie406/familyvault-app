import { Router } from "express";
import multer from "multer";
import { extension as extFromMime } from "mime-types";
import sharp from "sharp";
import crypto from "crypto";
import { uploadBufferToS3 } from "../lib/s3";
import { MemStorage } from "../storage";
import { insertUploadJobSchema, insertAnalysisResultSchema, insertUploadMetricSchema } from "@shared/schema";
import { z } from "zod";

// Helper function to get user info from request (TODO: integrate with real auth)
const getCurrentUser = (req: any) => {
  // TODO: Replace with actual authentication logic
  return {
    userId: "current-user", // Get from authenticated session
    familyId: "family-1"    // Get from user's family membership
  };
};

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Enhanced upload storage instance
const enhancedStorage = new MemStorage();

const ALLOWED = new Set([
  "image/png","image/jpeg","image/webp","image/gif",
  "application/pdf","text/plain","application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);

const today = () => new Date().toISOString().slice(0,10);

router.post("/", upload.array("files", 5), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const out: any[] = [];

    for (const f of files) {
      if (!ALLOWED.has(f.mimetype)) continue;

      const keyBase = `chat/${today()}/${crypto.randomUUID()}`;

      // Images (except animated GIF) → webp main + webp thumbnail
      if (f.mimetype.startsWith("image/") && f.mimetype !== "image/gif") {
        const img = sharp(f.buffer, { limitInputPixels: 268402689 }); // ~16k x 16k
        const meta = await img.metadata();

        const mainBuf = await img
          .rotate()                                         // respect EXIF
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();

        const thumbBuf = await sharp(f.buffer)
          .rotate()
          .resize({ width: 400, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toBuffer();

        const mainUrl  = await uploadBufferToS3(`${keyBase}.webp`, mainBuf, "image/webp");
        const thumbUrl = await uploadBufferToS3(`${keyBase}.thumb.webp`, thumbBuf, "image/webp");

        // compute thumb dims
        const tMeta = await sharp(thumbBuf).metadata();

        out.push({
          id: crypto.randomUUID(),
          url: mainUrl,
          thumbnailUrl: thumbUrl,
          name: f.originalname,
          mime: "image/webp",
          size: mainBuf.length,
          width: meta.width ?? null,
          height: meta.height ?? null,
          thumbWidth: tMeta.width ?? null,
          thumbHeight: tMeta.height ?? null,
        });
        continue;
      }

      // Animated GIF → keep original; make a static webp thumbnail (frame 0)
      if (f.mimetype === "image/gif") {
        const ext = ".gif";
        const mainUrl = await uploadBufferToS3(`${keyBase}${ext}`, f.buffer, f.mimetype);

        const thumbBuf = await sharp(f.buffer, { animated: false })
          .resize({ width: 400, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toBuffer();

        const thumbUrl = await uploadBufferToS3(`${keyBase}.thumb.webp`, thumbBuf, "image/webp");

        out.push({
          id: crypto.randomUUID(),
          url: mainUrl,
          thumbnailUrl: thumbUrl,
          name: f.originalname,
          mime: f.mimetype,
          size: f.size,
          width: null, height: null, thumbWidth: null, thumbHeight: null
        });
        continue;
      }

      // Non-images → upload as-is (no thumbnail)
      const ext = "." + (extFromMime(f.mimetype) || "bin");
      const url = await uploadBufferToS3(`${keyBase}${ext}`, f.buffer, f.mimetype);
      out.push({ 
        id: crypto.randomUUID(),
        url, 
        thumbnailUrl: null, 
        name: f.originalname, 
        mime: f.mimetype, 
        size: f.size,
        width: null, height: null, thumbWidth: null, thumbHeight: null 
      });
    }

    res.json({ files: out });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Enhanced Upload API Routes

// POST /api/uploads/enhanced/test - Test-only JSON endpoint for creating upload jobs (no file upload)
router.post("/enhanced/test", async (req, res) => {
  // Guard against non-test environments
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).json({
      success: false,
      error: "Test endpoint only available in test environment"
    });
  }

  try {
    // Get authenticated user
    const { userId, familyId } = getCurrentUser(req);
    
    // Validate request body
    const testJobData = z.object({
      filename: z.string().optional(),
      originalFilename: z.string().optional(),
      fileSize: z.number().optional(),
      mimeType: z.string().optional()
    }).parse(req.body);

    // Create upload job with authenticated user data
    const uploadJob = await enhancedStorage.createUploadJob({
      familyId,
      userId,
      filename: testJobData.filename || "test-document.pdf",
      originalFilename: testJobData.originalFilename || "test-document.pdf",
      fileSize: testJobData.fileSize || 1024,
      mimeType: testJobData.mimeType || "application/pdf",
      stage: 'pending',
      status: 'pending', 
      progress: 0,
    });

    // Simulate initial progress update for immediate feedback
    await enhancedStorage.updateUploadProgress(uploadJob.id, 5, 'initializing');

    res.status(201).json({
      success: true,
      job: uploadJob,
      message: "Test upload job created successfully",
      testMode: true
    });
  } catch (error) {
    console.error("Error creating test upload job:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false,
      error: "Failed to create test upload job" 
    });
  }
});

// POST /api/uploads/enhanced - Create enhanced upload job with multi-stage workflow
router.post("/enhanced", upload.single("file"), async (req, res) => {
  try {
    // Get authenticated user
    const { userId, familyId } = getCurrentUser(req);
    
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    // Validate file metadata
    const fileData = z.object({
      originalname: z.string(),
      size: z.number().max(10 * 1024 * 1024, "File too large"),
      mimetype: z.string()
    }).parse(file);

    // Create upload job with authenticated user data
    const uploadJob = await enhancedStorage.createUploadJob({
      familyId,
      userId,
      filename: fileData.originalname,
      originalFilename: fileData.originalname,
      fileSize: fileData.size,
      mimeType: fileData.mimetype,
      stage: 'pending',
      status: 'pending',
      progress: 0,
    });

    // Simulate initial progress update for immediate feedback
    await enhancedStorage.updateUploadProgress(uploadJob.id, 5, 'initializing');

    res.status(201).json({
      success: true,
      job: uploadJob,
      message: "Enhanced upload job created successfully"
    });
  } catch (error) {
    console.error("Error creating enhanced upload job:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false,
        error: "Validation failed",
        details: error.errors 
      });
    }
    res.status(500).json({ 
      success: false,
      error: "Failed to create enhanced upload job" 
    });
  }
});

// GET /api/uploads/enhanced/:jobId/status - Get job status and progress
router.get("/enhanced/:jobId/status", async (req, res) => {
  try {
    // Get authenticated user
    const { userId, familyId } = getCurrentUser(req);
    
    const { jobId } = req.params;
    const job = await enhancedStorage.getUploadJob(jobId);
    
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: "Upload job not found" 
      });
    }

    // Verify family ownership
    if (job.familyId !== familyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }

    res.json({
      success: true,
      job,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching upload job status:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch upload job status" 
    });
  }
});

// GET /api/uploads/enhanced/:jobId/results - Get analysis results
router.get("/enhanced/:jobId/results", async (req, res) => {
  try {
    // Get authenticated user
    const { userId, familyId } = getCurrentUser(req);
    
    const { jobId } = req.params;
    
    // Check if job exists
    const job = await enhancedStorage.getUploadJob(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: "Upload job not found" 
      });
    }

    // Verify family ownership
    if (job.familyId !== familyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }

    // Get analysis results
    const results = await enhancedStorage.getAnalysisResults(jobId);
    
    res.json({
      success: true,
      jobId,
      results,
      count: results.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching analysis results:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch analysis results" 
    });
  }
});

// POST /api/uploads/enhanced/:jobId/analyze - Trigger analysis (placeholder for AWS Textract integration)
router.post("/enhanced/:jobId/analyze", async (req, res) => {
  try {
    // Get authenticated user
    const { userId, familyId } = getCurrentUser(req);
    
    const { jobId } = req.params;
    
    // Check if job exists
    const job = await enhancedStorage.getUploadJob(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: "Upload job not found" 
      });
    }

    // Verify family ownership
    if (job.familyId !== familyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }

    // Update job to analyzing stage
    await enhancedStorage.updateUploadProgress(jobId, 60, 'analyzing');

    // TODO: Integrate AWS Textract service (Task 4)
    // For now, create a mock analysis result
    const mockResult = await enhancedStorage.createAnalysisResult({
      uploadJobId: jobId,
      fieldType: 'document_text',
      fieldKey: 'text_content',
      fieldValue: 'Mock extracted text content',
      confidence: 85.5,
      bbox: { x: 10, y: 10, width: 200, height: 50 }
    });

    // Update job completion
    await enhancedStorage.updateUploadProgress(jobId, 100, 'completed');

    res.json({
      success: true,
      message: "Analysis completed",
      jobId,
      mockResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error analyzing upload job:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to analyze upload job" 
    });
  }
});

// DELETE /api/uploads/enhanced/:jobId - Cancel/delete upload job
router.delete("/enhanced/:jobId", async (req, res) => {
  try {
    // Get authenticated user
    const { userId, familyId } = getCurrentUser(req);
    
    const { jobId } = req.params;
    
    // Check if job exists and verify ownership before deletion
    const job = await enhancedStorage.getUploadJob(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: "Upload job not found" 
      });
    }

    // Verify family ownership
    if (job.familyId !== familyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }
    
    const deleted = await enhancedStorage.deleteUploadJob(jobId);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: "Upload job not found" 
      });
    }

    res.json({
      success: true,
      message: "Upload job deleted successfully",
      jobId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error deleting upload job:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to delete upload job" 
    });
  }
});

// GET /api/uploads/enhanced/family/:familyId - List upload jobs for family
router.get("/enhanced/family/:familyId", async (req, res) => {
  try {
    // Get authenticated user
    const { userId, familyId: userFamilyId } = getCurrentUser(req);
    
    const { familyId } = req.params;
    
    // Verify user can only access their own family's jobs
    if (familyId !== userFamilyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied - can only access your own family's jobs"
      });
    }
    
    const jobs = await enhancedStorage.getUploadJobsByFamily(familyId);
    
    res.json({
      success: true,
      jobs,
      count: jobs.length,
      familyId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching family upload jobs:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch family upload jobs" 
    });
  }
});

// POST /api/uploads/photos - Upload photos to Family Album
router.post("/photos", upload.array("photos", 20), async (req, res) => {
  try {
    const { userId, familyId } = getCurrentUser(req);
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No photos uploaded"
      });
    }

    const uploadedPhotos: any[] = [];

    for (const file of files) {
      // Only process image files
      if (!file.mimetype.startsWith('image/')) {
        continue;
      }

      const keyBase = `family-album/${familyId}/${today()}/${crypto.randomUUID()}`;
      
      try {
        // Process image with sharp
        const img = sharp(file.buffer, { limitInputPixels: 268402689 });
        const metadata = await img.metadata();

        // Create full-size version (max 2048px wide)
        const fullSizeBuf = await img
          .rotate() // Respect EXIF orientation
          .resize({ width: 2048, withoutEnlargement: true })
          .jpeg({ quality: 90 })
          .toBuffer();

        // Create thumbnail (400px)
        const thumbBuf = await img
          .rotate()
          .resize({ width: 400, height: 400, fit: 'cover', position: 'center' })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload to S3
        const fullSizeUrl = await uploadBufferToS3(`${keyBase}.jpg`, fullSizeBuf, "image/jpeg");
        const thumbnailUrl = await uploadBufferToS3(`${keyBase}_thumb.jpg`, thumbBuf, "image/jpeg");

        // Get thumbnail metadata
        const thumbMeta = await sharp(thumbBuf).metadata();

        const photoData = {
          id: crypto.randomUUID(),
          filename: file.originalname,
          url: fullSizeUrl,
          thumbnailUrl: thumbnailUrl,
          size: fullSizeBuf.length,
          originalSize: file.size,
          mimeType: "image/jpeg",
          width: metadata.width || null,
          height: metadata.height || null,
          thumbWidth: thumbMeta.width || null,
          thumbHeight: thumbMeta.height || null,
          uploadTime: new Date().toISOString(),
          familyId: familyId,
          userId: userId,
          // Extract EXIF data if available
          dateTaken: metadata.exif ? extractDateFromExif(metadata.exif) : null,
          camera: metadata.exif ? extractCameraFromExif(metadata.exif) : null
        };

        // Store photo metadata in MemStorage for now
        // TODO: Replace with proper Family Album database storage
        await enhancedStorage.createAnalysisResult({
          uploadJobId: crypto.randomUUID(), // Temporary ID for photo storage
          fieldType: 'photo_metadata',
          fieldKey: 'family_album_photo',
          fieldValue: JSON.stringify(photoData),
          confidence: 100,
          bbox: null
        });

        uploadedPhotos.push(photoData);
      } catch (imageError) {
        console.error(`Error processing image ${file.originalname}:`, imageError);
        // Continue with other files if one fails
        continue;
      }
    }

    res.json({
      success: true,
      photos: uploadedPhotos,
      message: `${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} added to Family Album`,
      familyId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ 
      success: false,
      error: "Photo upload failed" 
    });
  }
});

// GET /api/uploads/photos/family/:familyId - Get family album photos
router.get("/photos/family/:familyId", async (req, res) => {
  try {
    const { userId, familyId: userFamilyId } = getCurrentUser(req);
    const { familyId } = req.params;
    
    // Verify family access
    if (familyId !== userFamilyId) {
      return res.status(403).json({
        success: false,
        error: "Access denied"
      });
    }

    // TODO: Replace with proper Family Album database query
    // For now, get photos from analysis results (temporary storage)
    // Since MemStorage requires jobId, we'll get all family jobs and collect photo metadata
    const familyJobs = await enhancedStorage.getUploadJobsByFamily(familyId);
    const familyPhotos: any[] = [];
    
    for (const job of familyJobs) {
      const jobResults = await enhancedStorage.getAnalysisResults(job.id);
      const photoResults = jobResults.filter((result: any) => result.fieldType === 'photo_metadata');
      
      for (const result of photoResults) {
        try {
          const photoData = JSON.parse(result.fieldValue);
          if (photoData.familyId === familyId) {
            familyPhotos.push(photoData);
          }
        } catch {
          // Skip invalid photo data
          continue;
        }
      }
    }
    
    // Sort by upload time (newest first)
    familyPhotos.sort((a: any, b: any) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime());

    res.json({
      success: true,
      photos: familyPhotos,
      count: familyPhotos.length,
      familyId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching family photos:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch family photos" 
    });
  }
});

// Helper functions for EXIF data extraction
function extractDateFromExif(exif: any): string | null {
  try {
    // Try to extract date from EXIF data
    // This is a simplified version - in practice you'd use a proper EXIF library
    return null; // Placeholder for now
  } catch {
    return null;
  }
}

function extractCameraFromExif(exif: any): string | null {
  try {
    // Try to extract camera info from EXIF data
    // This is a simplified version - in practice you'd use a proper EXIF library
    return null; // Placeholder for now
  } catch {
    return null;
  }
}

export default router;