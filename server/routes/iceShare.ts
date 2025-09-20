import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();

// POST /api/ice/share  -> { url, ttl }
router.post("/share", (req: any, res) => {
  // require auth in your middleware before this route if needed
  const payload = { userId: req.user?.id || "anonymous", scope: "ice-view" };
  const token = jwt.sign(payload, process.env.ICE_JWT_SECRET!, { expiresIn: "15m" });
  const url = `${process.env.APP_BASE_URL}/ice/share/${token}`;
  res.json({ url, ttl: 900 });
});

// GET /ice/share/:token  -> render read-only ICE view
router.get("/share/:token", (req, res) => {
  try {
    const data = jwt.verify(req.params.token, process.env.ICE_JWT_SECRET!);
    // fetch ICE data for data.userId, render read-only page (no edit/download)
    res.render("ice-readonly", { /* …safe fields… */ });
  } catch {
    res.status(410).send("Link expired or invalid");
  }
});

export default router;
