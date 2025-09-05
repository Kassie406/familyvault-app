import { Router } from "express";
import { db } from "../db";
import { docApprovals, familyResources, users } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

// GET /api/approvals/pending - Get all pending approvals for current user
router.get("/pending", async (req: any, res: any) => {
  try {
    // For development, use mock user data - this matches the pattern used by other endpoints
    const userId = "current-user";
    const familyId = "family-1";

    // Get pending approvals where the current user can approve
    // For this implementation, we'll assume any authenticated user can approve
    const pendingApprovals = await db
      .select({
        id: docApprovals.id,
        resourceId: docApprovals.resourceId,
        requestedBy: docApprovals.requestedBy,
        status: docApprovals.status,
        reason: docApprovals.reason,
        createdAt: docApprovals.createdAt,
        documentTitle: familyResources.title,
        requesterName: users.email, // Use email as display name for now
      })
      .from(docApprovals)
      .innerJoin(familyResources, eq(docApprovals.resourceId, familyResources.id))
      .innerJoin(users, eq(docApprovals.requestedBy, users.id))
      .where(eq(docApprovals.status, "pending"))
      .orderBy(desc(docApprovals.createdAt));

    res.json({ items: pendingApprovals });
  } catch (error) {
    console.error("Error fetching pending approvals:", error);
    res.status(500).json({ error: "Failed to fetch pending approvals" });
  }
});

// POST /api/approvals/:id/decision - Approve or reject an approval request
router.post("/:id/decision", async (req: any, res: any) => {
  try {
    // For development, use mock user data - this matches the pattern used by other endpoints
    const userId = "current-user";
    const approvalId = req.params.id;
    const { decision, reason } = req.body;


    if (!decision || !['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ error: "Decision must be 'approve' or 'reject'" });
    }

    if (decision === 'reject' && !reason?.trim()) {
      return res.status(400).json({ error: "Reason is required when rejecting" });
    }

    // Check if the approval exists and is still pending
    const [existingApproval] = await db
      .select()
      .from(docApprovals)
      .where(and(
        eq(docApprovals.id, approvalId),
        eq(docApprovals.status, "pending")
      ));

    if (!existingApproval) {
      return res.status(404).json({ error: "Approval not found or already processed" });
    }

    // Update the approval status
    const status = decision === 'approve' ? 'approved' : 'rejected';
    const [updatedApproval] = await db
      .update(docApprovals)
      .set({
        status,
        approverId: userId,
        decidedAt: new Date(),
        reason: reason || null,
      })
      .where(eq(docApprovals.id, approvalId))
      .returning();

    res.json({ 
      success: true, 
      approval: updatedApproval,
      message: `Document access ${status} successfully` 
    });
  } catch (error) {
    console.error("Error processing approval decision:", error);
    res.status(500).json({ error: "Failed to process approval decision" });
  }
});

export default router;