import { Router } from "express";
import { checkAIHealth } from "../lib/aiHealth";

const router = Router();

router.get("/ai", async (_req, res) => {
  try {
    const health = await checkAIHealth();
    res.status(health.awsReady && health.openaiReady ? 200 : 503).json(health);
  } catch (error) {
    console.error("[HEALTH] AI health check error:", error);
    res.status(500).json({
      awsReady: false,
      openaiReady: false,
      details: {
        error: String(error)
      }
    });
  }
});

export default router;