import { Router } from "express";
import multer from "multer";
import { lookup as mimeLookup, extension as extFromMime } from "mime-types";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const router = Router();

// Create uploads directory
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "." + (extFromMime(file.mimetype) || "bin");
    cb(null, crypto.randomUUID() + ext.toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const okTypes = [
      "image/png", "image/jpeg", "image/webp", "image/gif",
      "application/pdf", "text/plain", "application/zip",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (okTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type: " + file.mimetype));
    }
  },
});

router.post("/", upload.array("files", 5), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const baseUrl = "/uploads";
    
    const items = files.map(f => ({
      id: crypto.randomUUID(),
      name: f.originalname,
      mime: f.mimetype,
      size: f.size,
      url: `${baseUrl}/${f.filename}`,
      width: undefined,
      height: undefined,
    }));
    
    res.json({ files: items });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;