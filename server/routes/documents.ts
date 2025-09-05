import { Router } from "express";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { 
  familyResources, 
  documentShares, 
  linkPolicies, 
  shareLinks,
  docApprovals,
  users 
} from "@shared/schema";
import { db } from "../db";
import { addDays } from "date-fns";
import { requireAuth, AuthenticatedRequest } from "../auth";
import type { Response } from "express";

const router = Router();

// Apply authentication to all routes
router.use(requireAuth());

// Helper: Check if user can view document
async function userCanView(userId: string, familyId: string, resourceId: string) {
  const [resource] = await db
    .select()
    .from(familyResources)
    .where(eq(familyResources.id, resourceId));
  
  if (!resource) return null;
  if (resource.familyId !== familyId) return null;
  
  // Owner can always view
  if (resource.createdBy === userId) return resource;
  
  // Check if shared with user or family
  const shares = await db
    .select()
    .from(documentShares)
    .where(eq(documentShares.resourceId, resourceId));
  
  const familyShare = shares.find(s => s.scope === "family");
  const directShare = shares.find(s => s.scope === "user" && s.sharedWithUserId === userId);
  
  if (familyShare || directShare) return resource;
  return null;
}

// GET /api/documents/recent - Get recent documents for dropdown
router.get("/recent", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || "current-user";
    const familyId = "family-1"; // Using orgId as familyId
    
    if (!userId || !familyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const limit = Math.min(Number(req.query.limit) || 5, 20);

    // Get recent documents - either owned by user or family documents category
    const recent = await db
      .select({
        id: familyResources.id,
        title: familyResources.title,
        category: familyResources.category,
        subcategory: familyResources.subcategory,
        contentType: familyResources.contentType,
        fileUrl: familyResources.fileUrl,
        fileName: familyResources.fileName,
        fileSize: familyResources.fileSize,
        createdBy: familyResources.createdBy,
        createdAt: familyResources.createdAt,
        updatedAt: familyResources.updatedAt,
      })
      .from(familyResources)
      .where(
        and(
          eq(familyResources.familyId, familyId),
          eq(familyResources.category, "documents")
        )
      )
      .orderBy(desc(familyResources.updatedAt))
      .limit(limit);

    // Add sharing info for each document
    const documentsWithShares = await Promise.all(
      recent.map(async (doc) => {
        const shares = await db
          .select()
          .from(documentShares)
          .where(eq(documentShares.resourceId, doc.id));

        let shareInfo = "Private";
        if (shares.some(s => s.scope === "family")) {
          shareInfo = "Shared with family";
        } else if (shares.some(s => s.scope === "user")) {
          shareInfo = "Shared with specific users";
        } else if (shares.some(s => s.scope === "link")) {
          shareInfo = "Shared via link";
        }

        return {
          ...doc,
          shareInfo,
          canView: true, // Already filtered above
        };
      })
    );

    res.json({ items: documentsWithShares });
  } catch (error) {
    console.error("Error fetching recent documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// POST /api/documents/:id/share - Share a document
router.post("/:id/share", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      scope, 
      sharedWithUserId, 
      policyId, 
      canDownload = true, 
      expiresAt 
    } = req.body;
    
    const userId = req.user?.id || "current-user";
    const familyId = "family-1"; // Using orgId as familyId

    if (!userId || !familyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resource = await userCanView(userId, familyId, id);
    if (!resource) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Validate scope
    if (!["family", "user", "link"].includes(scope)) {
      return res.status(400).json({ error: "Invalid scope" });
    }

    if (scope === "user" && !sharedWithUserId) {
      return res.status(400).json({ error: "sharedWithUserId required for user scope" });
    }

    // Create or update document share
    const [share] = await db
      .insert(documentShares)
      .values({
        resourceId: id,
        createdBy: userId,
        scope,
        sharedWithUserId: scope === "user" ? sharedWithUserId : null,
        policyId: policyId || null,
        canDownload,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    // If scope is 'link', create a share link
    if (scope === "link") {
      const slug = Math.random().toString(36).substring(2, 15);
      let linkExpire: Date | null = null;

      // Apply policy expiration if specified
      if (policyId) {
        const [policy] = await db
          .select()
          .from(linkPolicies)
          .where(eq(linkPolicies.id, policyId));
        
        if (policy?.expiresAt) {
          linkExpire = policy.expiresAt;
        }
      }

      await db.insert(shareLinks).values({
        resourceId: id,
        token: slug,
        expiresAt: linkExpire || addDays(new Date(), 30), // 30 day default
        maxUses: null,
        currentUses: 0,
      });
    }

    res.json({ success: true, share });
  } catch (error) {
    console.error("Error sharing document:", error);
    res.status(500).json({ error: "Failed to share document" });
  }
});

// GET /api/documents/:id/url - Get signed URL for document
router.get("/:id/url", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { mode = "view" } = req.query as { mode?: "view" | "download" };
    
    const userId = req.user?.id || "current-user";
    const familyId = "family-1"; // Using orgId as familyId

    if (!userId || !familyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const resource = await userCanView(userId, familyId, id);
    if (!resource) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check download permissions
    if (mode === "download") {
      const shares = await db
        .select()
        .from(documentShares)
        .where(eq(documentShares.resourceId, id));

      const userShare = shares.find(s => 
        (s.scope === "family") || 
        (s.scope === "user" && s.sharedWithUserId === userId)
      );

      if (userShare && !userShare.canDownload) {
        return res.status(403).json({ error: "Download not permitted" });
      }
    }

    // For now, return the direct file URL - in production you'd generate signed S3/R2 URLs
    const url = resource.fileUrl;
    
    if (!url) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json({ url });
  } catch (error) {
    console.error("Error getting document URL:", error);
    res.status(500).json({ error: "Failed to get document URL" });
  }
});

// GET /api/link-policies - Get link policies for family
router.get("/link-policies", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const familyId = "family-1"; // Using orgId as familyId
    
    if (!familyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // For now, get all active policies (would filter by familyId in production)
    const policies = await db
      .select()
      .from(linkPolicies)
      .where(eq(linkPolicies.isActive, true));

    res.json({ items: policies });
  } catch (error) {
    console.error("Error fetching link policies:", error);
    res.status(500).json({ error: "Failed to fetch link policies" });
  }
});

// POST /api/link-policies - Create new link policy
router.post("/link-policies", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, maxUses, expiresAt, allowedDomains, requiresAuth } = req.body;
    const userId = req.user?.id || "current-user";

    if (!userId || !name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const [policy] = await db
      .insert(linkPolicies)
      .values({
        name,
        maxUses: maxUses || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        allowedDomains: allowedDomains || null,
        requiresAuth: requiresAuth || false,
        isActive: true,
      })
      .returning();

    res.json(policy);
  } catch (error) {
    console.error("Error creating link policy:", error);
    res.status(500).json({ error: "Failed to create link policy" });
  }
});

// GET /api/approvals/pending - Get pending document approvals
router.get("/approvals/pending", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id || "current-user";
    const familyId = "family-1"; // Using orgId as familyId

    if (!userId || !familyId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const pending = await db
      .select({
        id: docApprovals.id,
        resourceId: docApprovals.resourceId,
        requestedBy: docApprovals.requestedBy,
        status: docApprovals.status,
        reason: docApprovals.reason,
        createdAt: docApprovals.createdAt,
        documentTitle: familyResources.title,
        requesterName: users.firstName,
      })
      .from(docApprovals)
      .leftJoin(familyResources, eq(docApprovals.resourceId, familyResources.id))
      .leftJoin(users, eq(docApprovals.requestedBy, users.id))
      .where(eq(docApprovals.status, "pending"));

    res.json({ items: pending });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    res.status(500).json({ error: "Failed to fetch pending approvals" });
  }
});

export default router;