import { Router } from "express";
import { db } from "../db";
import { linkPolicies } from "@shared/schema";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

// GET /api/link-policies?scope=workspace|collection&scopeId=...
router.get("/", async (req, res) => {
  try {
    const scope = String(req.query.scope || "workspace");
    const scopeId = scope === "collection" ? String(req.query.scopeId || "") : null;

    const [row] = await db.select().from(linkPolicies)
      .where(and(
        eq(linkPolicies.scopeType, scope), 
        scopeId ? eq(linkPolicies.scopeId, scopeId) : eq(linkPolicies.scopeId, null)
      ));

    // Fallback: create a sensible default on first access
    if (!row) {
      const [created] = await db.insert(linkPolicies).values({
        id: crypto.randomUUID(),
        scopeType: scope,
        scopeId,
        defaultScope: "invited",
        requireExpiry: true,
        maxExpiryDays: 30,
        allowNever: false,
        requirePassword: false,
        minPasswordLen: 8,
        allowDownload: true,
        watermark: false,
        disableCopy: false,
        domainAllowlist: [],
        domainBlocklist: [],
        updatedBy: "system",
      }).returning();
      return res.json(created);
    }
    res.json(row);
  } catch (error) {
    console.error("Error fetching link policies:", error);
    res.status(500).json({ error: "Failed to fetch link policies" });
  }
});

// PUT /api/link-policies (admin only)
router.put("/", async (req: any, res) => {
  try {
    // For development, we'll skip admin check for now
    // if (!req.user?.isAdmin) return res.status(403).json({ error: "Admin only" });

    const {
      scopeType, scopeId = null,
      defaultScope, requireExpiry, maxExpiryDays, allowNever,
      requirePassword, minPasswordLen,
      allowDownload, watermark, disableCopy,
      domainAllowlist = [], domainBlocklist = []
    } = req.body || {};

    const [existing] = await db.select().from(linkPolicies)
      .where(and(
        eq(linkPolicies.scopeType, scopeType), 
        scopeId ? eq(linkPolicies.scopeId, scopeId) : eq(linkPolicies.scopeId, null)
      ));

    if (existing) {
      const [row] = await db.update(linkPolicies).set({
        defaultScope, requireExpiry, maxExpiryDays, allowNever,
        requirePassword, minPasswordLen,
        allowDownload, watermark, disableCopy,
        domainAllowlist, domainBlocklist,
        updatedBy: req.user?.id || "system",
        updatedAt: new Date(),
      }).where(eq(linkPolicies.id, existing.id)).returning();
      return res.json(row);
    } else {
      const [row] = await db.insert(linkPolicies).values({
        id: crypto.randomUUID(),
        scopeType, scopeId,
        defaultScope, requireExpiry, maxExpiryDays, allowNever,
        requirePassword, minPasswordLen,
        allowDownload, watermark, disableCopy,
        domainAllowlist, domainBlocklist,
        updatedBy: req.user?.id || "system",
      }).returning();
      return res.json(row);
    }
  } catch (error) {
    console.error("Error saving link policies:", error);
    res.status(500).json({ error: "Failed to save link policies" });
  }
});

// POST /api/link-policies/reconcile (admin: preview or revoke non-compliant links)
// For now, return a stub count; later wire into your sharing subsystem.
router.post("/reconcile", async (req: any, res) => {
  try {
    // For development, we'll skip admin check for now
    // if (!req.user?.isAdmin) return res.status(403).json({ error: "Admin only" });
    
    // TODO: scan active links and return {wouldRevoke:n} or perform revoke
    res.json({ ok: true, wouldRevoke: 0 });
  } catch (error) {
    console.error("Error reconciling link policies:", error);
    res.status(500).json({ error: "Failed to reconcile link policies" });
  }
});

export default router;