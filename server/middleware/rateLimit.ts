import type { Request, Response, NextFunction } from 'express';

type Bucket = { tokens: number; last: number };
const buckets: Record<string, Bucket> = {};

// Token-bucket: X requests/min and Y burst (per session or IP)
export function rateLimit({ rpm = 30, burst = 10 }: { rpm?: number; burst?: number }) {
  const refillPerMs = rpm / 60000; // tokens per ms
  return (req: Request, res: Response, next: NextFunction) => {
    const key = (req.sessionID || req.ip || 'anon') + ':' + (req.path || '');
    const now = Date.now();
    const b = (buckets[key] ||= { tokens: burst, last: now });
    const elapsed = now - b.last;
    b.tokens = Math.min(burst, b.tokens + elapsed * refillPerMs);
    b.last = now;
    if (b.tokens < 1) return res.status(429).json({ error: 'Rate limit: slow down' });
    b.tokens -= 1;
    next();
  };
}