import { Router } from "express";
import { db } from "../db";
import { approvals } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const router = Router();

// GET /api/approvals?state=pending
router.get("/", async (req, res) => {
  try {
    const state = String(req.query.state || "pending");
    
    // For development, return mock data with proper structure
    // In production, this would join with users and documents tables
    const mockRows = [
      {
        id: "approval-1",
        documentId: "doc-123",
        requestedRole: "viewer",
        reason: "Need to review quarterly financial reports for board meeting",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isExternal: false,
        domain: null,
        requesterId: "user-456",
        requesterName: "Sarah Chen",
        docTitle: "Q4 Financial Report"
      },
      {
        id: "approval-2", 
        documentId: "doc-456",
        requestedRole: "editor",
        reason: "Updating company policy document with new compliance requirements",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isExternal: true,
        domain: "contractor.com",
        requesterId: "user-789",
        requesterName: "Mike Torres",
        docTitle: "HR Policy Manual"
      },
      {
        id: "approval-3",
        documentId: "doc-789", 
        requestedRole: "viewer",
        reason: "External audit review",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        isExternal: true,
        domain: "auditor.com",
        requesterId: "user-101",
        requesterName: "Jennifer Kim",
        docTitle: "Legal Contracts Archive"
      }
    ];

    res.json(mockRows);
  } catch (error) {
    console.error("Error fetching approvals:", error);
    res.status(500).json({ error: "Failed to fetch approvals" });
  }
});

// POST /api/approvals/:id/approve {role, expiresAt}
router.post("/:id/approve", async (req: any, res) => {
  try {
    // For development, we'll skip admin check for now
    // if (!req.user?.isAdmin) return res.status(403).json({ error: "Admin only" });

    const id = String(req.params.id);
    const { role, expiresAt } = req.body || {};

    // For development, simulate approval success
    // In production, this would:
    // 1) Update the approval record in the database
    // 2) Grant access in your sharing system
    
    console.log(`Approved access request ${id} with role ${role}${expiresAt ? ` expiring at ${expiresAt}` : ''}`);
    
    res.json({ ok: true });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ error: "Failed to approve request" });
  }
});

// POST /api/approvals/:id/deny {reason}
router.post("/:id/deny", async (req: any, res) => {
  try {
    // For development, we'll skip admin check for now  
    // if (!req.user?.isAdmin) return res.status(403).json({ error: "Admin only" });
    
    const id = String(req.params.id);
    const { reason } = req.body || {};

    console.log(`Denied access request ${id}${reason ? ` with reason: ${reason}` : ''}`);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error denying request:", error);
    res.status(500).json({ error: "Failed to deny request" });
  }
});

// POST /api/approvals/:id/request-changes {message}
router.post("/:id/request-changes", async (req: any, res) => {
  try {
    // For development, we'll skip admin check for now
    // if (!req.user?.isAdmin) return res.status(403).json({ error: "Admin only" });
    
    const id = String(req.params.id);
    const { message } = req.body || {};

    console.log(`Requested changes for access request ${id}${message ? ` with message: ${message}` : ''}`);

    res.json({ ok: true });
  } catch (error) {
    console.error("Error requesting changes:", error);
    res.status(500).json({ error: "Failed to request changes" });
  }
});

export default router;