import type { Request, Response, NextFunction } from "express";
export function cacheSeconds(seconds: number) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${seconds}`);
    next();
  };
}