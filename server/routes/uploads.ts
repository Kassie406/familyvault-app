import { Router } from "express";
import multer from "multer";
import { extension as extFromMime } from "mime-types";
import crypto from "crypto";
import { uploadBufferToS3 } from "../lib/s3";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ALLOWED = new Set([
  "image/png", "image/jpeg", "image/webp", "image/gif",
  "application/pdf", "text/plain", "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
]);

router.post("/", upload.array("files", 5), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const out: any[] = [];

    for (const f of files) {
      if (!ALLOWED.has(f.mimetype)) continue;
      const ext = "." + (extFromMime(f.mimetype) || "bin");
      const key = `chat/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}${ext}`;
      const url = await uploadBufferToS3(key, f.buffer, f.mimetype);
      out.push({ 
        id: crypto.randomUUID(),
        url, 
        name: f.originalname, 
        mime: f.mimetype, 
        size: f.size 
      });
    }

    res.json({ files: out });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;