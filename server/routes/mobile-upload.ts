import { Router } from "express";
import { nanoid } from "nanoid";
import multer from "multer";
import { emitFileUpdate } from "../realtime";

const router = Router();

// In-memory session storage (for development)
// In production, use Redis or database
interface MobileSession {
  id: string;
  familyId: string;
  purpose: "photos" | "documents";
  createdAt: Date;
  expiresAt: Date;
  used: boolean;
}

const sessions = new Map<string, MobileSession>();

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = new Date();
  sessions.forEach((session, id) => {
    if (session.expiresAt < now) {
      sessions.delete(id);
    }
  });
}, 5 * 60 * 1000);

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB per file
    files: 10, // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/heic', 'image/heif',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  }
});

/**
 * POST /api/mobile-upload/sessions
 * Creates a new mobile upload session
 */
router.post("/sessions", async (req, res) => {
  try {
    const { purpose = "documents", familyId = "family-1" } = req.body;
    
    const id = nanoid(8);
    const baseUrl = process.env.REPL_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/m/u/${id}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    const session: MobileSession = {
      id,
      familyId,
      purpose,
      createdAt: new Date(),
      expiresAt,
      used: false,
    };
    
    sessions.set(id, session);
    
    console.log(`[mobile-upload] Created session ${id} for ${purpose}, expires at ${expiresAt}`);
    
    res.json({
      id,
      url,
      expiresAt: expiresAt.toISOString(),
      purpose,
    });
  } catch (error) {
    console.error("[mobile-upload] Session creation error:", error);
    res.status(500).json({ error: "Failed to create upload session" });
  }
});

/**
 * GET /api/mobile-upload/:id
 * Get session info for mobile page
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const session = sessions.get(id);
    
    if (!session) {
      return res.status(404).json({ error: "Session not found or expired" });
    }
    
    if (session.expiresAt < new Date()) {
      sessions.delete(id);
      return res.status(410).json({ error: "Session expired" });
    }
    
    res.json({
      id: session.id,
      purpose: session.purpose,
      expiresAt: session.expiresAt.toISOString(),
      used: session.used,
    });
  } catch (error) {
    console.error("[mobile-upload] Session fetch error:", error);
    res.status(500).json({ error: "Failed to get session info" });
  }
});

/**
 * POST /api/mobile-upload/:id/files
 * Upload files for mobile session
 */
router.post("/:id/files", upload.array("files", 10), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }
    
    const session = sessions.get(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found or expired" });
    }
    
    if (session.expiresAt < new Date()) {
      sessions.delete(id);
      return res.status(410).json({ error: "Session expired" });
    }
    
    console.log(`[mobile-upload] Processing ${files.length} files for session ${id}`);
    
    const uploadedFiles = [];
    
    for (const file of files) {
      try {
        // Create a mock file record (replace with actual file storage logic)
        const fileId = `mobile-${nanoid()}`;
        const fileRecord = {
          id: fileId,
          fileName: file.originalname,
          contentType: file.mimetype,
          size: file.size,
          familyId: session.familyId,
          category: session.purpose === "photos" ? "photo" : "document",
          uploadedAt: new Date(),
          scanStatus: "pending" as const,
          thumbStatus: "pending" as const,
          quarantined: false,
        };
        
        // TODO: Store file in S3/R2 and save record to database
        // For now, just simulate the upload
        
        uploadedFiles.push({
          fileId,
          clientId: req.body.clientId || fileId,
          fileName: file.originalname,
          size: file.size,
        });
        
        // Emit real-time update to desktop watchers
        emitFileUpdate(fileId, session.familyId, {
          scanStatus: "pending",
          thumbStatus: "pending",
          fileName: file.originalname,
          contentType: file.mimetype,
          size: file.size,
          processing: true,
        });
        
        // Simulate processing completion after a delay (replace with actual worker)
        setTimeout(() => {
          emitFileUpdate(fileId, session.familyId, {
            scanStatus: "clean",
            thumbStatus: "done",
            processing: false,
            ready: true,
            processedAt: new Date().toISOString(),
          });
        }, 2000 + Math.random() * 3000); // 2-5 second delay
        
      } catch (fileError) {
        console.error(`[mobile-upload] Error processing file ${file.originalname}:`, fileError);
      }
    }
    
    // Mark session as used
    session.used = true;
    
    // Emit session completion event
    emitFileUpdate(`session-${id}`, session.familyId, {
      type: "session-complete",
      sessionId: id,
      filesUploaded: uploadedFiles.length,
    });
    
    res.json({
      success: true,
      filesUploaded: uploadedFiles.length,
      files: uploadedFiles,
    });
    
  } catch (error) {
    console.error("[mobile-upload] Upload error:", error);
    res.status(500).json({ error: "Failed to upload files" });
  }
});

/**
 * DELETE /api/mobile-upload/:id
 * Cancel/cleanup session
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = sessions.delete(id);
    
    if (deleted) {
      console.log(`[mobile-upload] Session ${id} deleted`);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  } catch (error) {
    console.error("[mobile-upload] Session deletion error:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
});

export default router;