import rateLimit from "express-rate-limit";

export const softLimit = rateLimit({
  windowMs: 10 * 1000,   // 10 seconds
  limit: 12,             // 12 requests per 10s per IP/user
  standardHeaders: true,
  legacyHeaders: false,
});