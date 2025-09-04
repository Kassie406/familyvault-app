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
    console.log("Business managers API called");
    
    // Return mock data for now to fix loading issue
    const managers = [
      {
        id: 'angel',
        name: 'Angel Johnson',
        initials: 'AJ',
        itemCount: 5,
        role: 'Managing Member'
      },
      {
        id: 'kassandra',
        name: 'Kassandra Johnson',
        initials: 'KJ',
        itemCount: 2,
        role: 'Operations Director'
      },
      {
        id: 'family',
        name: 'Family Shared',
        initials: 'FS',
        itemCount: 2,
        role: 'Joint Ownership'
      }
    ];

    console.log("Returning managers:", managers);
    res.json(managers);
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