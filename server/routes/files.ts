import { Router } from "express";
import { db } from "../db";
import { documentFiles, familyPhotos } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Guard: ensure the requester has access to the file's family
async function assertCanSeeFile(userId: string, fileId: string, type: 'document' | 'photo' = 'document') {
  // TODO: Implement proper family membership validation
  // For now, just verify the file exists and belongs to a family
  const table = type === 'document' ? documentFiles : familyPhotos;
  const [file] = await db.select().from(table).where(eq(table.id, fileId)).limit(1);
  
  if (!file) {
    throw new Error('File not found');
  }
  
  // TODO: Check if userId has access to file.familyId
  return file;
}

/**
 * GET /api/files/:id/status
 * Returns live processing status for one file row.
 */
router.get("/:id/status", async (req, res) => {
  try {
    // TODO: Get actual user ID from session
    const userId = "current-user";
    const id = String(req.params.id);
    const type = req.query.type as 'document' | 'photo' || 'document';

    const file = await assertCanSeeFile(userId, id, type);

    const response = {
      id: file.id,
      scanStatus: file.scanStatus,        // "pending" | "clean" | "infected" | "error" | "skipped"
      scanResult: file.scanResult,
      quarantined: file.quarantined,
      thumbStatus: file.thumbStatus,      // "pending" | "done" | "error" | "skipped"
      thumbKey: file.thumbKey,
      thumbWidth: file.thumbWidth,
      thumbHeight: file.thumbHeight,
      processedAt: file.processedAt,
      fileName: file.fileName,
      contentType: file.contentType,
      size: file.size,
      // convenience booleans for UI:
      ready: file.scanStatus === "clean" && (file.thumbStatus === "done" || file.thumbStatus === "skipped"),
      blocked: !!file.quarantined || file.scanStatus === "infected",
      processing: file.scanStatus === "pending" || file.thumbStatus === "pending",
    };

    res.json(response);
  } catch (error) {
    console.error("[file-status.error]", error);
    if (error instanceof Error && error.message === 'File not found') {
      return res.status(404).json({ error: "File not found" });
    }
    res.status(500).json({ error: "Failed to get file status" });
  }
});

/**
 * GET /api/files/family/:familyId/status
 * Returns status for all files in a family (for bulk updates)
 */
router.get("/family/:familyId/status", async (req, res) => {
  try {
    // TODO: Get actual user ID from session and verify family access
    const userId = "current-user";
    const { familyId } = req.params;

    // Get all documents for this family
    const documents = await db.select({
      id: documentFiles.id,
      scanStatus: documentFiles.scanStatus,
      thumbStatus: documentFiles.thumbStatus,
      quarantined: documentFiles.quarantined,
      processedAt: documentFiles.processedAt,
    }).from(documentFiles).where(eq(documentFiles.familyId, familyId));

    // Get all photos for this family
    const photos = await db.select({
      id: familyPhotos.id,
      scanStatus: familyPhotos.scanStatus,
      thumbStatus: familyPhotos.thumbStatus,
      quarantined: familyPhotos.quarantined,
      processedAt: familyPhotos.processedAt,
    }).from(familyPhotos).where(eq(familyPhotos.familyId, familyId));

    const allFiles = [
      ...documents.map(d => ({ ...d, type: 'document' })),
      ...photos.map(p => ({ ...p, type: 'photo' }))
    ];

    const status = allFiles.map(file => ({
      id: file.id,
      type: file.type,
      scanStatus: file.scanStatus,
      thumbStatus: file.thumbStatus,
      quarantined: file.quarantined,
      processedAt: file.processedAt,
      ready: file.scanStatus === "clean" && (file.thumbStatus === "done" || file.thumbStatus === "skipped"),
      blocked: !!file.quarantined || file.scanStatus === "infected",
      processing: file.scanStatus === "pending" || file.thumbStatus === "pending",
    }));

    res.json({
      familyId,
      files: status,
      summary: {
        total: status.length,
        ready: status.filter(f => f.ready).length,
        processing: status.filter(f => f.processing).length,
        blocked: status.filter(f => f.blocked).length,
      }
    });
  } catch (error) {
    console.error("[family-status.error]", error);
    res.status(500).json({ error: "Failed to get family file status" });
  }
});

export default router;