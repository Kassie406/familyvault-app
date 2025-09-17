// server/shareHelpers.ts
import crypto from "crypto";

export type Expiry = "24h" | "7d" | "30d" | "never";

export function makeToken(len = 26) {
  return crypto.randomBytes(len).toString("base64url").replace(/_/g, "x");
}

export function expiryToDate(exp: Expiry): Date | null {
  const now = Date.now();
  if (exp === "never") return null;
  const map: Record<Exclude<Expiry, "never">, number> = {
    "24h": 86400,
    "7d": 7 * 86400,
    "30d": 30 * 86400,
  };
  return new Date(now + map[exp] * 1000);
}

export function appUrl() {
  return process.env.APP_URL || "http://localhost:5000";
}