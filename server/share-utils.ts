import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and } from "drizzle-orm";
import { shareLinks, credentials, type ShareLink, type Credential } from "@shared/schema";
import crypto from "crypto";

const neonClient = neon(process.env.DATABASE_URL!);
const db = drizzle(neonClient);

export function makeToken(length = 26): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(b => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36])
    .join("");
}

export function expiryToDate(expiry: "24h" | "7d" | "30d" | "never"): Date | null {
  const now = new Date();
  if (expiry === "never") return null;
  const date = new Date(now);
  if (expiry === "24h") date.setHours(now.getHours() + 24);
  if (expiry === "7d") date.setDate(now.getDate() + 7);
  if (expiry === "30d") date.setDate(now.getDate() + 30);
  return date;
}

export type ShareResolution = 
  | { status: "invalid" }
  | { status: "expired" }
  | { status: "ok"; link: ShareLink & { credential: Credential } };

export async function resolveShare(token: string): Promise<ShareResolution> {
  const result = await db
    .select({
      shareLink: shareLinks,
      credential: credentials,
    })
    .from(shareLinks)
    .innerJoin(credentials, eq(shareLinks.credentialId, credentials.id))
    .where(eq(shareLinks.token, token))
    .limit(1);

  if (!result.length) {
    return { status: "invalid" };
  }

  const { shareLink: link, credential } = result[0];

  if (link.revoked) {
    return { status: "invalid" };
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return { status: "expired" };
  }

  return { 
    status: "ok", 
    link: { 
      ...link, 
      credential 
    } 
  };
}