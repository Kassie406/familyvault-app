import { Router } from "express";
import multer from "multer";
import { extension as extFromMime } from "mime-types";
import sharp from "sharp";
import crypto from "crypto";
import { uploadBufferToS3 } from "../lib/s3";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

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

export default router;