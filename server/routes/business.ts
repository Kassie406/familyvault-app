import { Router } from "express";
import { db } from "../db";
import { businessItems, users } from "../../shared/schema";
import { eq, sql, desc } from "drizzle-orm";

const router = Router();

/**
 * GET /api/business/managers
 * Returns: [{ id, name, initials, itemCount }]
 */
router.get("/managers", async (_req, res) => {
  try {
    // Get users with at least one business item
    const rows = await db.execute(sql`
      SELECT u.id,
             u.name,
             INITCAP(COALESCE(SUBSTRING(u.name FROM 1 FOR 1), 'U')) ||
             INITCAP(COALESCE(SUBSTRING(SPLIT_PART(u.name,' ',2) FROM 1 FOR 1), '')) as initials,
             COUNT(b.id)::int as "itemCount"
      FROM users u
      JOIN business_items b ON b.owner_id = u.id
      GROUP BY u.id, u.name
      ORDER BY u.name ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching business managers:", error);
    res.status(500).json({ error: "Failed to fetch business managers" });
  }
});

/**
 * GET /api/business/items?ownerId=ID
 */
router.get("/items", async (req, res) => {
  try {
    const ownerId = String(req.query.ownerId || "");
    if (!ownerId) {
      return res.status(400).json({ error: "ownerId required" });
    }

    const items = await db
      .select()
      .from(businessItems)
      .where(eq(businessItems.ownerId, ownerId))
      .orderBy(desc(businessItems.updatedAt));

    res.json(items);
  } catch (error) {
    console.error("Error fetching business items:", error);
    res.status(500).json({ error: "Failed to fetch business items" });
  }
});

/**
 * POST /api/business/items
 * body: { ownerId, type, title, subtitle?, docCount? }
 */
router.post("/items", async (req, res) => {
  try {
    const { ownerId, type, title, subtitle, docCount } = req.body || {};
    if (!ownerId || !type || !title) {
      return res.status(400).json({ error: "Missing required fields: ownerId, type, title" });
    }

    const [newItem] = await db.insert(businessItems).values({
      ownerId,
      type,
      title,
      subtitle,
      docCount: docCount ?? 0,
    }).returning();

    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating business item:", error);
    res.status(500).json({ error: "Failed to create business item" });
  }
});

/**
 * PUT /api/business/items/:id
 */
router.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patch = req.body || {};
    patch.updatedAt = new Date();

    await db.update(businessItems).set(patch).where(eq(businessItems.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error("Error updating business item:", error);
    res.status(500).json({ error: "Failed to update business item" });
  }
});

/**
 * DELETE /api/business/items/:id
 */
router.delete("/items/:id", async (req, res) => {
  try {
    await db.delete(businessItems).where(eq(businessItems.id, req.params.id));
    res.json({ ok: true });
  } catch (error) {
    console.error("Error deleting business item:", error);
    res.status(500).json({ error: "Failed to delete business item" });
  }
});

export default router;