import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { sql, desc, eq, and } from "drizzle-orm";
import { familyActivity, chores, allowanceLedger, familyMembers, recipes, mealPlanEntries, shoppingItems, familyUpdates, coupleActivities, coupleChores, inboxItems, extractedFields, memberFileAssignments, type InsertFamilyUpdate, type InsertInboxItem, type InsertExtractedField, type InsertMemberFileAssignment } from "@shared/schema";
import storageRoutes from "./storage-routes";
import fileRoutes from "./routes/files";
import mobileUploadRoutes from "./routes/mobile-upload";
import uploadsRouter from "./routes/uploads";
import smsRoutes from "./sms";
import threadsListRouter from "./routes/threadsList";
import threadMessagesRouter from "./routes/threadMessages";
import apiServicesRouter from "./routes/apiServices";
import documentsRouter from "./routes/documents";
import { calendarRouter } from "./routes/calendar";
import familyMeetingsRouter from "./routes/family-meetings";
import { aiInboxRouter } from "./routes/ai-inbox";
import axios from "axios";
import { sendSMSNotification } from "./lib/twilio";
import { sendSMSNotificationsForMessage, markUserOnline, markUserOffline } from "./lib/sms-notifications";
import { getOrCreateFamilyChatId } from "./lib/chat-default";
import { initializeRealtime, getRealtimeManager } from "./lib/realtime.js";
import { emitFamilyActivity } from "./realtime";
import { logFamilyActivity } from "./lib/activity";
import { generateFamilyUpdates } from "./lib/family-updates-worker";
import { requireAuth } from "./auth";
import { cacheSeconds } from "./middleware/cache";
import { softLimit } from "./middleware/limit";
// Schema imports - using proper type names
import { 
  InsertInvite,
  InsertFamilyMember,
  InsertFamily,
  InsertFamilyBusinessItem,
  InsertFamilyLegalItem,
  InsertFamilyInsuranceItem,
  InsertFamilyTaxItem,
  InsertMessageThread,
  InsertThreadMember,
  InsertMessage
} from "@shared/schema";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import { runOcr } from "./ocr";

export async function registerRoutes(app: Express): Promise<Server> {
  // Family Management API endpoints
  
  // GET /api/family - Get user's family
  app.get("/api/family", async (req, res) => {
    try {
      // TODO: Get userId from authenticated session
      const userId = "current-user"; 
      const family = await storage.getUserFamily(userId);
      
      if (!family) {
        return res.status(404).json({ error: "Family not found" });
      }
      
      res.json(family);
    } catch (error) {
      console.error("Error fetching family:", error);
      res.status(500).json({ error: "Failed to fetch family" });
    }
  });

  // POST /api/family - Create new family
  app.post("/api/family", async (req, res) => {
    try {
      const { name } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated session
      
      if (!name) {
        return res.status(400).json({ error: "Family name is required" });
      }

      const familyData = { name, ownerId: userId };
      const family = await storage.createFamily(familyData);
      
      res.status(201).json(family);
    } catch (error) {
      console.error("Error creating family:", error);
      res.status(500).json({ error: "Failed to create family" });
    }
  });

  // GET /api/family/members - Get family members
  app.get("/api/family/members", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const members = await storage.getFamilyMembers(familyId);
      
      res.json(members);
    } catch (error) {
      console.error("Error fetching family members:", error);
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  // POST /api/family/members - Create new family member
  app.post("/api/family/members", async (req, res) => {
    try {
      const memberData = req.body;
      const familyId = "family-1"; // TODO: Get from user's family
      
      const member = await storage.createFamilyMember({ ...memberData, familyId });
      
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating family member:", error);
      res.status(500).json({ error: "Failed to create family member" });
    }
  });

  // GET /api/family/stats - Get family dashboard statistics
  app.get("/api/family/stats", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const stats = await storage.getFamilyMemberStats(familyId);
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching family stats:", error);
      res.status(500).json({ error: "Failed to fetch family stats" });
    }
  });

  // Family Business API endpoints
  // GET /api/family/business - Get family business items
  app.get("/api/family/business", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const { ownerId } = req.query;
      
      const items = await storage.getFamilyBusinessItems(familyId, ownerId as string);
      res.json(items);
    } catch (error) {
      console.error("Error fetching business items:", error);
      res.status(500).json({ error: "Failed to fetch business items" });
    }
  });

  // POST /api/family/business - Create family business item
  app.post("/api/family/business", async (req, res) => {
    try {
      const itemData = req.body;
      const familyId = "family-1"; // TODO: Get from user's family
      
      const item = await storage.createFamilyBusinessItem({ ...itemData, familyId });
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating business item:", error);
      res.status(500).json({ error: "Failed to create business item" });
    }
  });

  // Family Legal API endpoints
  // GET /api/family/legal - Get family legal items
  app.get("/api/family/legal", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const { legalDocId } = req.query;
      
      const items = await storage.getFamilyLegalItems(familyId, legalDocId as string);
      res.json(items);
    } catch (error) {
      console.error("Error fetching legal items:", error);
      res.status(500).json({ error: "Failed to fetch legal items" });
    }
  });

  // Family Insurance API endpoints
  // GET /api/family/insurance - Get family insurance items
  app.get("/api/family/insurance", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const { insuranceId } = req.query;
      
      const items = await storage.getFamilyInsuranceItems(familyId, insuranceId as string);
      res.json(items);
    } catch (error) {
      console.error("Error fetching insurance items:", error);
      res.status(500).json({ error: "Failed to fetch insurance items" });
    }
  });

  // Family Tax API endpoints
  // GET /api/family/taxes - Get family tax items
  app.get("/api/family/taxes", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const { taxYear } = req.query;
      
      const items = await storage.getFamilyTaxItems(familyId, taxYear as string);
      res.json(items);
    } catch (error) {
      console.error("Error fetching tax items:", error);
      res.status(500).json({ error: "Failed to fetch tax items" });
    }
  });

  // Invitation Acceptance API endpoints
  
  // GET /api/invitations/:token - Get invitation details for acceptance
  app.get("/api/invitations/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invite = await storage.getInviteByToken(token);
      
      if (!invite) {
        return res.status(404).json({ ok: false, error: "invalid_token" });
      }
      
      const now = new Date();
      if (invite.expiresAt && invite.expiresAt < now) {
        return res.status(410).json({ ok: false, error: "expired" });
      }
      
      if (invite.acceptedAt) {
        return res.status(409).json({ ok: false, error: "already_accepted" });
      }
      
      if (invite.status === 'revoked') {
        return res.status(410).json({ ok: false, error: "revoked" });
      }
      
      // Get family info for the invite preview
      const family = await storage.getFamily(invite.familyId);
      
      res.json({
        ok: true,
        invite: {
          id: invite.id,
          familyId: invite.familyId,
          familyName: family?.name || "Family",
          role: invite.familyRole,
          message: invite.message,
          expiresAt: invite.expiresAt,
          status: "pending"
        }
      });
    } catch (error) {
      console.error("Error fetching invite:", error);
      res.status(500).json({ ok: false, error: "server_error" });
    }
  });

  // POST /api/invitations/:token/accept - Accept invitation
  app.post("/api/invitations/:token/accept", async (req, res) => {
    try {
      const { token } = req.params;
      const { acceptingUserId, displayName } = req.body;
      
      const invite = await storage.getInviteByToken(token);
      
      if (!invite) {
        return res.status(404).json({ ok: false, error: "invalid_token" });
      }
      
      const now = new Date();
      if (invite.expiresAt && invite.expiresAt < now) {
        return res.status(410).json({ ok: false, error: "expired" });
      }
      
      if (invite.acceptedAt) {
        return res.status(409).json({ ok: false, error: "already_accepted" });
      }
      
      if (invite.status === 'revoked') {
        return res.status(410).json({ ok: false, error: "revoked" });
      }
      
      // Create family member
      const memberData = {
        familyId: invite.familyId,
        name: displayName || invite.email.split('@')[0],
        email: invite.email,
        role: invite.familyRole,
        userId: acceptingUserId || null,
        relationshipToOwner: invite.familyRole,
        phone: null,
        dateOfBirth: null,
        avatarColor: '#3498DB',
        itemCount: 0,
        emergencyContact: false,
        profileImageUrl: null,
        address: null,
        medicalInfo: null,
        identificationInfo: null,
        isActive: true
      };
      
      const member = await storage.createFamilyMember(memberData);
      
      // Mark invitation as accepted
      await storage.acceptInvite(token);
      
      res.json({
        ok: true,
        familyId: invite.familyId,
        member: {
          id: member.id,
          name: member.name,
          role: member.role
        }
      });
    } catch (error) {
      console.error("Error accepting invite:", error);
      res.status(500).json({ ok: false, error: "server_error" });
    }
  });

  // Family Invite API endpoints

  // POST /api/family/invites - Create a new invitation
  app.post("/api/family/invites", async (req, res) => {
    try {
      const { email, permission, familyRole, message, expiresInDays } = req.body;

      if (!email || !permission || !familyRole) {
        return res.status(400).json({ 
          error: "Missing required fields: email, permission, familyRole" 
        });
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Set expiration (default 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7));

      const inviteData = {
        familyId: "family-1", // TODO: Get from user's family
        email: email.toLowerCase(),
        permission,
        familyRole,
        invitedByUserId: "current-user", // TODO: Get from authenticated user
        token,
        status: "pending",
        requireLogin: true,
        message: message || null,
        expiresAt,
      };

      const invite = await storage.createInvite(inviteData);

      // TODO: Send invitation email here
      console.log(`Invitation created for ${email} with token: ${token}`);

      res.status(201).json({
        id: invite.id,
        email: invite.email,
        permission: invite.permission,
        familyRole: invite.familyRole,
        status: invite.status,
        expiresAt: invite.expiresAt,
        inviteUrl: `${req.protocol}://${req.get('host')}/accept-invite/${token}`,
      });
    } catch (error) {
      console.error("Error creating invite:", error);
      res.status(500).json({ error: "Failed to create invitation" });
    }
  });

  // GET /api/family/invites - List all invitations for current user
  app.get("/api/family/invites", async (req, res) => {
    try {
      const userId = "current-user"; // TODO: Get from authenticated user
      const invites = await storage.getUserInvites(userId);
      
      res.json(invites.map(invite => ({
        id: invite.id,
        email: invite.email,
        permission: invite.permission,
        familyRole: invite.familyRole,
        status: invite.status,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
        acceptedAt: invite.acceptedAt,
      })));
    } catch (error) {
      console.error("Error fetching invites:", error);
      res.status(500).json({ error: "Failed to fetch invitations" });
    }
  });

  // POST /api/family/invites/:id/resend - Resend an invitation
  app.post("/api/family/invites/:id/resend", async (req, res) => {
    try {
      const { id } = req.params;
      const invite = await storage.getInvite(id);
      
      if (!invite) {
        return res.status(404).json({ error: "Invitation not found" });
      }

      if (invite.status !== 'pending') {
        return res.status(400).json({ error: "Can only resend pending invitations" });
      }

      // Generate new token and extend expiration
      const newToken = crypto.randomBytes(32).toString('hex');
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 7);

      await storage.updateInvite(id, {
        token: newToken,
        expiresAt: newExpiresAt,
      });

      // TODO: Send invitation email with new token
      console.log(`Invitation resent for ${invite.email} with new token: ${newToken}`);

      res.json({
        message: "Invitation resent successfully",
        inviteUrl: `${req.protocol}://${req.get('host')}/accept-invite/${newToken}`,
      });
    } catch (error) {
      console.error("Error resending invite:", error);
      res.status(500).json({ error: "Failed to resend invitation" });
    }
  });

  // POST /api/family/invites/:id/revoke - Revoke an invitation
  app.post("/api/family/invites/:id/revoke", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.revokeInvite(id);
      
      if (!success) {
        return res.status(404).json({ error: "Invitation not found" });
      }

      res.json({ message: "Invitation revoked successfully" });
    } catch (error) {
      console.error("Error revoking invite:", error);
      res.status(500).json({ error: "Failed to revoke invitation" });
    }
  });

  // GET /accept-invite/:token - Accept invitation page endpoint
  app.get("/accept-invite/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const invite = await storage.getInviteByToken(token);
      
      if (!invite) {
        return res.status(404).json({ error: "Invalid or expired invitation" });
      }

      if (invite.status !== 'pending') {
        return res.status(400).json({ error: "Invitation already processed" });
      }

      if (new Date() > invite.expiresAt) {
        return res.status(400).json({ error: "Invitation has expired" });
      }

      // Accept the invitation
      await storage.acceptInvite(token);

      // Create family member record
      const avatarColors = ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C'];
      const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

      const familyMember = await storage.createFamilyMember({
        name: invite.email.split('@')[0], // Default name from email
        email: invite.email,
        role: invite.familyRole,
        avatarColor: randomColor,
        itemCount: 0,
        userId: null, // Will be linked when user registers
      });

      res.json({
        success: true,
        message: "Invitation accepted successfully",
        familyMember: {
          id: familyMember.id,
          name: familyMember.name,
          email: familyMember.email,
          role: familyMember.role,
        },
      });
    } catch (error) {
      console.error("Error accepting invite:", error);
      res.status(500).json({ error: "Failed to accept invitation" });
    }
  });

  // GET /api/family/members - List all family members
  app.get("/api/family/members", async (req, res) => {
    try {
      const members = await storage.getAllFamilyMembers();
      
      res.json(members.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        avatarColor: member.avatarColor,
        itemCount: member.itemCount,
        createdAt: member.createdAt,
      })));
    } catch (error) {
      console.error("Error fetching family members:", error);
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  // Mount storage routes for file uploads
  app.use("/api/storage", storageRoutes);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/inbox", aiInboxRouter);

  // Mount file status routes for real-time updates
  app.use("/api/files", fileRoutes);

  // Mount mobile upload routes
  app.use("/api/mobile-upload", mobileUploadRoutes);

  // Mount document management routes
  const linkPoliciesRouter = (await import("./routes/link-policies")).default;
  const approvalsRouter = (await import("./routes/approvals")).default;
  app.use("/api/link-policies", linkPoliciesRouter);
  app.use("/api/approvals", approvalsRouter);
  
  // Mount API services routes
  app.use(apiServicesRouter);

  // Mount document routes for file sharing and management
  app.use("/api/documents", documentsRouter);

  // Mount calendar routes
  app.use(calendarRouter);

  // Mount family meetings routes for group chat meetings
  app.use("/api/family", familyMeetingsRouter);

  // Mount threads list routes for chat dashboard
  app.use("/api/threads", threadsListRouter);

  // Mount thread messages routes for individual conversation views
  app.use("/api/threads", threadMessagesRouter);

  // Couple Connection API endpoints
  
  // POST /api/couple/gate - Authenticate couple access
  app.post("/api/couple/gate", async (req, res) => {
    try {
      const { pin } = req.body;
      
      // Simple PIN validation (in production, use secure hashing)
      if (pin === "1234") {
        res.json({ success: true, message: "Access granted" });
      } else {
        res.status(401).json({ error: "Invalid PIN" });
      }
    } catch (error) {
      console.error("Error validating couple access:", error);
      res.status(500).json({ error: "Failed to validate access" });
    }
  });

  // GET /api/couple/ideas - Get couple date ideas
  app.get("/api/couple/ideas", async (req, res) => {
    try {
      const ideas = await storage.getCoupleDateIdeas("family-1");
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching couple date ideas:", error);
      res.status(500).json({ error: "Failed to fetch date ideas" });
    }
  });

  // POST /api/couple/ideas - Create new date idea
  app.post("/api/couple/ideas", async (req, res) => {
    try {
      const ideaData = { ...req.body, coupleId: "couple-1", createdBy: "current-user" };
      const idea = await storage.createCoupleDateIdea(ideaData);
      res.status(201).json(idea);
    } catch (error) {
      console.error("Error creating date idea:", error);
      res.status(500).json({ error: "Failed to create date idea" });
    }
  });

  // PUT /api/couple/ideas/:id/rank - Update idea ranking
  app.put("/api/couple/ideas/:id/rank", async (req, res) => {
    try {
      const { id } = req.params;
      const { ranking } = req.body;
      const userId = "current-user"; // TODO: Get from session
      
      await storage.updateCoupleDateIdeaRanking(id, userId, ranking);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating idea ranking:", error);
      res.status(500).json({ error: "Failed to update ranking" });
    }
  });

  // GET /api/couple/events - Get couple calendar events
  app.get("/api/couple/events", async (req, res) => {
    try {
      const events = await storage.getCoupleEvents("couple-1");
      res.json(events);
    } catch (error) {
      console.error("Error fetching couple events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // POST /api/couple/events - Create new couple event
  app.post("/api/couple/events", async (req, res) => {
    try {
      const eventData = { ...req.body, coupleId: "couple-1", createdBy: "current-user" };
      const event = await storage.createCoupleEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating couple event:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // GET /api/couple/journal - Get couple journal entries
  app.get("/api/couple/journal", async (req, res) => {
    try {
      const entries = await storage.getCoupleJournalEntries("couple-1");
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  // POST /api/couple/journal - Create new journal entry
  app.post("/api/couple/journal", async (req, res) => {
    try {
      const entryData = { ...req.body, coupleId: "couple-1", authorId: "current-user" };
      const entry = await storage.createCoupleJournalEntry(entryData);
      res.status(201).json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ error: "Failed to create journal entry" });
    }
  });

  // GET /api/couple/checkins - Get couple check-ins
  app.get("/api/couple/checkins", async (req, res) => {
    try {
      const checkins = await storage.getCoupleCheckins("couple-1");
      res.json(checkins);
    } catch (error) {
      console.error("Error fetching couple check-ins:", error);
      res.status(500).json({ error: "Failed to fetch check-ins" });
    }
  });

  // POST /api/couple/checkins - Create new check-in
  app.post("/api/couple/checkins", async (req, res) => {
    try {
      const checkinData = { ...req.body, coupleId: "couple-1", participantId: "current-user" };
      const checkin = await storage.createCoupleCheckin(checkinData);
      res.status(201).json(checkin);
    } catch (error) {
      console.error("Error creating couple check-in:", error);
      res.status(500).json({ error: "Failed to create check-in" });
    }
  });

  // Couple Activities API endpoints (simplified feed approach)
  
  // Points system for different activities
  const ACTIVITY_POINTS = { memory: 5, plan_date: 8, love_note: 4, goal: 6, chore_complete: 0 };
  
  // GET /api/couple/activities - Get activity feed
  app.get("/api/couple/activities", async (req, res) => {
    try {
      const coupleId = "couple-1"; // TODO: Get from session
      const activities = await db.select()
        .from(coupleActivities)
        .where(eq(coupleActivities.coupleId, coupleId))
        .orderBy(desc(coupleActivities.createdAt))
        .limit(30);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // POST /api/couple/activities/quick - Quick actions (Add Memory, Plan Date, etc.)
  app.post("/api/couple/activities/quick", async (req, res) => {
    try {
      const { type, title, payload } = req.body;
      const coupleId = "couple-1"; // TODO: Get from session
      
      if (!type || !title || !['memory', 'plan_date', 'love_note', 'goal'].includes(type)) {
        return res.status(400).json({ error: "Invalid type or missing title" });
      }
      
      const points = ACTIVITY_POINTS[type] ?? 0;
      
      const [activity] = await db.insert(coupleActivities).values({
        coupleId,
        type,
        title,
        payload: payload || {},
        points
      }).returning();
      
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  // GET /api/couple/chores - Get couple chores
  app.get("/api/couple/chores", async (req, res) => {
    try {
      const coupleId = "couple-1"; // TODO: Get from session
      const chores = await db.select()
        .from(coupleChores)
        .where(eq(coupleChores.coupleId, coupleId))
        .orderBy(sql`${coupleChores.dueOn} NULLS LAST`, desc(coupleChores.createdAt));
      res.json(chores);
    } catch (error) {
      console.error("Error fetching chores:", error);
      res.status(500).json({ error: "Failed to fetch chores" });
    }
  });

  // POST /api/couple/chores/:id/complete - Complete a chore
  app.post("/api/couple/chores/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = "current-user"; // TODO: Get from session
      const coupleId = "couple-1"; // TODO: Get from session
      
      const [chore] = await db.update(coupleChores)
        .set({ 
          completedBy: userId, 
          completedAt: new Date() 
        })
        .where(and(eq(coupleChores.id, id), eq(coupleChores.coupleId, coupleId)))
        .returning();
      
      if (!chore) {
        return res.status(404).json({ error: "Chore not found" });
      }
      
      // Add completion to activity feed
      await db.insert(coupleActivities).values({
        coupleId,
        type: 'chore_complete',
        title: `Chore: ${chore.title}`,
        payload: { chore_id: chore.id },
        points: chore.points || 0
      });
      
      res.json({ ok: true });
    } catch (error) {
      console.error("Error completing chore:", error);
      res.status(500).json({ error: "Failed to complete chore" });
    }
  });

  // POST /api/couple/chores - Create new chore
  app.post("/api/couple/chores", async (req, res) => {
    try {
      const { title, dueOn, points } = req.body;
      const coupleId = "couple-1"; // TODO: Get from session
      
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      
      const [chore] = await db.insert(coupleChores).values({
        coupleId,
        title,
        dueOn: dueOn ? new Date(dueOn) : null,
        points: points || 10
      }).returning();
      
      res.status(201).json(chore);
    } catch (error) {
      console.error("Error creating chore:", error);
      res.status(500).json({ error: "Failed to create chore" });
    }
  });

  // Document Management API endpoints
  
  // POST /api/documents - Create new document
  app.post("/api/documents", async (req, res) => {
    try {
      const { title, description, category, familyId } = req.body;
      
      // TODO: Get actual user ID from session
      const uploadedBy = "current-user";
      
      if (!title || !familyId) {
        return res.status(400).json({ error: "Title and familyId are required" });
      }

      const documentId = crypto.randomUUID();
      
      // For now, just return a mock document - in production you'd save to database
      const document = {
        id: documentId,
        title,
        description,
        category: category || "general",
        familyId,
        uploadedBy,
        createdAt: new Date().toISOString(),
      };

      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // POST /api/documents/:id/attach-file - Attach file to document
  app.post("/api/documents/:id/attach-file", async (req, res) => {
    try {
      const { id } = req.params;
      const { storageKey, fileName, contentType, size, publicUrl } = req.body;
      
      if (!storageKey || !fileName) {
        return res.status(400).json({ error: "Storage key and filename are required" });
      }

      // TODO: Save file attachment to documentFiles table
      // For now, just return success
      const attachment = {
        id: crypto.randomUUID(),
        documentId: id,
        storageKey,
        fileName,
        contentType,
        size,
        publicUrl,
        createdAt: new Date().toISOString(),
      };

      res.json({ success: true, attachment });
    } catch (error) {
      console.error("Error attaching file:", error);
      res.status(500).json({ error: "Failed to attach file" });
    }
  });

  // Photo Management API endpoints
  
  // POST /api/photos - Create new photo
  app.post("/api/photos", async (req, res) => {
    try {
      const { familyId, albumId, caption, altText, location, takenAt } = req.body;
      
      // TODO: Get actual user ID from session
      const uploadedBy = "current-user";
      
      if (!familyId) {
        return res.status(400).json({ error: "familyId is required" });
      }

      const photoId = crypto.randomUUID();
      
      // For now, just return a mock photo - in production you'd save to database
      const photo = {
        id: photoId,
        familyId,
        albumId: albumId || null,
        caption: caption || null,
        altText: altText || null,
        location: location || null,
        takenAt: takenAt || null,
        uploadedBy,
        createdAt: new Date().toISOString(),
      };

      res.json(photo);
    } catch (error) {
      console.error("Error creating photo:", error);
      res.status(500).json({ error: "Failed to create photo" });
    }
  });

  // POST /api/photos/:id/attach - Attach file to photo
  app.post("/api/photos/:id/attach", async (req, res) => {
    try {
      const { id } = req.params;
      const { storageKey, fileName, contentType, size, publicUrl } = req.body;
      
      if (!storageKey || !fileName) {
        return res.status(400).json({ error: "Storage key and filename are required" });
      }

      // TODO: Save file attachment to familyPhotos table
      // For now, just return success
      const attachment = {
        id,
        storageKey,
        fileName,
        contentType,
        size,
        publicUrl,
        updatedAt: new Date().toISOString(),
      };

      res.json({ success: true, photo: attachment });
    } catch (error) {
      console.error("Error attaching photo:", error);
      res.status(500).json({ error: "Failed to attach photo" });
    }
  });

  // Family Messaging API endpoints
  // POST /api/threads - Create/resolve a thread (family, DM, group)
  app.post("/api/threads", async (req, res) => {
    try {
      const { kind, title, memberIds } = req.body;
      const familyId = "family-1"; // TODO: Get from user's family
      const userId = "current-user"; // TODO: Get from authenticated user
      
      if (!kind || !["family", "dm", "group"].includes(kind)) {
        return res.status(400).json({ error: "Invalid thread kind" });
      }

      // For family threads, check if one already exists
      if (kind === "family") {
        const existingThread = await storage.getFamilyThread(familyId);
        if (existingThread) {
          return res.json({ thread: existingThread });
        }
      }

      const threadData = {
        kind,
        title: title || (kind === "family" ? "Family Chat" : null),
        familyId,
        createdBy: userId
      };

      const thread = await storage.createMessageThread(threadData);
      
      // Add creator as member
      await storage.addThreadMember({
        threadId: thread.id,
        userId,
        role: "owner"
      });

      // Add additional members for DM/group
      if (memberIds && memberIds.length > 0) {
        for (const memberId of memberIds) {
          await storage.addThreadMember({
            threadId: thread.id,
            userId: memberId,
            role: "member"
          });
        }
      }

      res.status(201).json({ thread });
    } catch (error) {
      console.error("Error creating thread:", error);
      res.status(500).json({ error: "Failed to create thread" });
    }
  });

  // GET /api/threads - List user's threads
  app.get("/api/threads", async (req, res) => {
    try {
      const userId = "current-user"; // TODO: Get from authenticated user
      const threads = await storage.getUserThreads(userId);
      res.json({ threads });
    } catch (error) {
      console.error("Error fetching threads:", error);
      res.status(500).json({ error: "Failed to fetch threads" });
    }
  });

  // GET /api/threads/default - Get or create default family chat thread
  app.get("/api/threads/default", async (req, res) => {
    try {
      const threadId = await getOrCreateFamilyChatId();
      res.json({ id: threadId });
    } catch (error) {
      console.error("Error getting default thread:", error);
      res.status(500).json({ error: "Failed to get default thread" });
    }
  });

  // GET /api/threads/:id/messages - Get messages in a thread (paginated)
  app.get("/api/threads/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { cursor, limit = 50 } = req.query;
      
      const messages = await storage.getThreadMessages(
        id, 
        cursor as string, 
        parseInt(limit as string)
      );
      
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // POST /api/threads/:id/messages - Send a message with SMS notifications
  app.post("/api/threads/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { body, attachments = [], replyToId } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      if (!body?.trim() && (!attachments || attachments.length === 0)) {
        return res.status(400).json({ error: "Message body or files required" });
      }

      // Extract file IDs for backward compatibility
      const fileIds = attachments.map((att: any) => att.id || att.url);

      const messageData = {
        threadId: id,
        authorId: userId,
        body: body?.trim(),
        fileIds,
        replyToId
      };

      // 1) Store message in database
      const message = await storage.createMessage(messageData);
      
      // 2) Store attachment metadata if any attachments
      for (const att of attachments) {
        await storage.createMessageAttachment({
          messageId: message.id,
          url: att.url,
          name: att.name || "file",
          mime: att.mime || "application/octet-stream",
          size: att.size || 0,
          width: att.width ?? null,
          height: att.height ?? null,
          thumbnailUrl: att.thumbnailUrl ?? null,
          thumbWidth: att.thumbWidth ?? null,
          thumbHeight: att.thumbHeight ?? null,
        });
      }
      
      // 4) Broadcast via WebSocket to thread members
      const realtimeManager = getRealtimeManager();
      if (realtimeManager) {
        // Get author info and format message for broadcasting
        const messageForBroadcast = {
          id: message.id,
          threadId: id,
          authorId: userId,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          author: {
            id: userId,
            name: "Current User", // TODO: Get actual user name from auth
          },
          attachments: attachments.map((att: any) => ({
            id: att.id || att.url,
            name: att.name || "file",
            url: att.url,
            thumbnailUrl: att.thumbnailUrl || null,
          })),
        };
        
        realtimeManager.broadcastNewMessage(messageForBroadcast);
        console.log(`[realtime] Broadcasting message ${message.id} to thread ${id}`);
      } else {
        console.warn("[realtime] Manager not initialized, skipping broadcast");
      }
      
      // 3) Send SMS notifications to eligible recipients
      try {
        await sendSMSNotificationsForMessage(id, userId, body || "📎 Attachment");
      } catch (smsError) {
        console.error("SMS notification error:", smsError);
        // Don't fail the message send if SMS fails
      }

      res.status(201).json({ message });
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // POST /api/messages - Send a message to default family chat (fallback for widget)
  app.post("/api/messages", async (req, res) => {
    try {
      const { body, fileIds = [], replyToId } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      if (!body?.trim() && (!fileIds || fileIds.length === 0)) {
        return res.status(400).json({ error: "Message body or files required" });
      }

      // Get or create the default family chat
      const threadId = await getOrCreateFamilyChatId();

      const messageData = {
        threadId,
        authorId: userId,
        body: body?.trim(),
        fileIds,
        replyToId
      };

      // 1) Store message in database
      const message = await storage.createMessage(messageData);
      
      // TODO: Broadcast via WebSocket to thread members
      console.log(`Broadcasting message ${message.id} to thread ${threadId}`);
      
      // 2) Send SMS notifications to eligible recipients
      try {
        await sendSMSNotificationsForMessage(threadId, userId, body || "📎 Attachment");
      } catch (smsError) {
        console.error("SMS notification error:", smsError);
        // Don't fail the message send if SMS fails
      }

      res.status(201).json({ message });
    } catch (error) {
      console.error("Error creating message in default chat:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  // Presence API endpoint
  app.get("/api/presence/family", async (req, res) => {
    try {
      // TODO: Get familyId from authenticated user
      const familyId = "family-1";
      
      // For now, return mock data - in production get from Redis/DB
      const online: string[] = []; // Would come from Redis Set
      
      // For now, return mock family users data - TODO: Get from database
      const familyUsers = [
        {
          id: "current-user",
          name: "You",
          lastSeenAt: new Date().toISOString()
        }
      ];
      
      res.json({
        online,
        users: familyUsers
      });
    } catch (error) {
      console.error("Error fetching presence:", error);
      res.status(500).json({ error: "Failed to fetch presence" });
    }
  });

  // Enhanced Messaging API endpoints

  // Mark message as read
  app.post("/api/messages/:messageId/read", async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      const receipt = await storage.markMessageAsRead(messageId, userId);
      res.json({ receipt });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Get message read receipts
  app.get("/api/messages/:messageId/receipts", async (req, res) => {
    try {
      const { messageId } = req.params;
      const receipts = await storage.getMessageReadReceipts(messageId);
      res.json({ receipts });
    } catch (error) {
      console.error("Error fetching read receipts:", error);
      res.status(500).json({ error: "Failed to fetch read receipts" });
    }
  });

  // Get unread message count for a thread
  app.get("/api/threads/:threadId/unread-count", async (req, res) => {
    try {
      const { threadId } = req.params;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      const count = await storage.getUnreadMessagesCount(userId, threadId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  // Add reaction to message
  app.post("/api/messages/:messageId/reactions", async (req, res) => {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      if (!emoji) {
        return res.status(400).json({ error: "Emoji is required" });
      }

      const reaction = await storage.addMessageReaction({
        messageId,
        userId,
        emoji
      });
      
      res.json({ reaction });
    } catch (error) {
      console.error("Error adding reaction:", error);
      res.status(500).json({ error: "Failed to add reaction" });
    }
  });

  // Remove reaction from message
  app.delete("/api/messages/:messageId/reactions/:emoji", async (req, res) => {
    try {
      const { messageId, emoji } = req.params;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      const removed = await storage.removeMessageReaction(messageId, userId, emoji);
      res.json({ removed });
    } catch (error) {
      console.error("Error removing reaction:", error);
      res.status(500).json({ error: "Failed to remove reaction" });
    }
  });

  // Get message reactions
  app.get("/api/messages/:messageId/reactions", async (req, res) => {
    try {
      const { messageId } = req.params;
      const reactions = await storage.getMessageReactions(messageId);
      res.json({ reactions });
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ error: "Failed to fetch reactions" });
    }
  });

  // Search messages
  app.get("/api/messages/search", async (req, res) => {
    try {
      const { q: query, threadId } = req.query;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      if (!query || typeof query !== 'string' || query.trim().length < 2) {
        return res.status(400).json({ error: "Query must be at least 2 characters" });
      }

      const messages = await storage.searchMessages(
        userId, 
        query.trim(), 
        threadId as string | undefined
      );
      
      res.json({ messages });
    } catch (error) {
      console.error("Error searching messages:", error);
      res.status(500).json({ error: "Failed to search messages" });
    }
  });

  // Mount SMS routes
  app.use("/api", smsRoutes);

  // Portal Enhancement API endpoints
  
  // GET /api/notifications - Get user notifications
  app.get("/api/notifications", async (req, res) => {
    try {
      // Mock notifications data - in production, this would fetch from database
      const notifications = [
        {
          id: "notif-1",
          type: "message",
          title: "New Family Message",
          message: "Dad shared vacation photos in family chat",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/family/messages/thread/family",
          priority: "medium",
          author: { name: "Dad", avatar: null }
        },
        {
          id: "notif-2", 
          type: "document",
          title: "Document Upload",
          message: "Medical records updated by Sarah",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionUrl: "/family/documents",
          priority: "low",
          author: { name: "Sarah", avatar: null }
        },
        {
          id: "notif-3",
          type: "reminder",
          title: "Insurance Renewal",
          message: "Your family insurance policy expires in 15 days",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionUrl: "/family/insurance",
          priority: "high",
          author: { name: "System", avatar: null }
        }
      ];
      
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // POST /api/notifications/:id/read - Mark notification as read
  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      // In production, this would update the notification in database
      console.log(`Marking notification ${id} as read`);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // POST /api/notifications/mark-all-read - Mark all notifications as read
  app.post("/api/notifications/mark-all-read", async (req, res) => {
    try {
      // In production, this would update all user notifications in database
      console.log("Marking all notifications as read");
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to mark all notifications as read" });
    }
  });

  // GET /api/family/activity - Get family activity feed
  app.get("/api/family/activity", async (req, res) => {
    try {
      const { filter = 'all', timeRange = '24h', limit = 10 } = req.query;
      const familyId = "family-1"; // TODO: Get from user's family
      
      // Fetch real activity data from database
      const activities = await db.select({
        id: familyActivity.id,
        type: familyActivity.activityType,
        title: familyActivity.title,
        description: familyActivity.description,
        timestamp: familyActivity.createdAt,
        userId: familyActivity.userId,
        metadata: familyActivity.metadata,
        priority: familyActivity.priority
      })
      .from(familyActivity)
      .where(eq(familyActivity.familyId, familyId))
      .orderBy(desc(familyActivity.createdAt))
      .limit(parseInt(limit as string, 10));

      // Transform data to match expected format
      const formattedActivities = activities.map(activity => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        timestamp: activity.timestamp?.toISOString() || new Date().toISOString(),
        author: { id: activity.userId, name: activity.userId },
        metadata: activity.metadata || {},
        priority: activity.priority
      }));
      
      // Apply type filter if specified
      const filteredActivities = filter !== 'all' 
        ? formattedActivities.filter(activity => activity.type === filter)
        : formattedActivities;
      
      res.json(filteredActivities);
    } catch (error) {
      console.error("Error fetching family activity:", error);
      res.status(500).json({ error: "Failed to fetch family activity" });
    }
  });

  // ===== FAMILY UPDATES (REMINDERS & NOTICES) API ROUTES =====
  
  // GET /api/updates - Get active family updates (excludes snoozed for current user)
  app.get("/api/updates", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from authenticated user
      const userId = "user-1"; // TODO: Get from authenticated user
      
      const updates = await storage.getFamilyUpdates(familyId, userId);
      
      res.json({ items: updates });
    } catch (error) {
      console.error("Error fetching family updates:", error);
      res.status(500).json({ error: "Failed to fetch updates" });
    }
  });

  // POST /api/updates - Create manual family update (Admin+ only)
  app.post("/api/updates", requireAuth('ADMIN'), async (req, res) => {
    try {
      const { type, title, body, severity, dueAt, actionUrl, metadata } = req.body;
      const familyId = "family-1"; // TODO: Get from authenticated user
      
      const [update] = await db.insert(familyUpdates).values({
        familyId,
        type: type || "manual",
        title,
        body,
        severity: severity || "info",
        dueAt: dueAt ? new Date(dueAt) : null,
        actionUrl,
        metadata: metadata || {}
      }).returning();
      
      // Broadcast to family members in real-time
      emitFamilyActivity(familyId, {
        id: update.id,
        type: "family_update",
        title: `New update: ${update.title}`,
        description: update.body,
        timestamp: update.createdAt?.toISOString(),
        author: { id: "system", name: "System" },
        priority: update.severity === "urgent" ? "high" : update.severity === "warning" ? "medium" : "low"
      });
      
      res.json({ success: true, update });
    } catch (error) {
      console.error("Error creating family update:", error);
      res.status(500).json({ error: "Failed to create update" });
    }
  });

  // POST /api/updates/:id/dismiss - Dismiss a family update (Admin+ only) 
  app.post("/api/updates/:id/dismiss", requireAuth('ADMIN'), async (req, res) => {
    try {
      const updateId = req.params.id;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      const success = await storage.dismissFamilyUpdate(updateId, userId);
      
      if (!success) {
        return res.status(404).json({ error: "Update not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error dismissing family update:", error);
      res.status(500).json({ error: "Failed to dismiss update" });
    }
  });

  // POST /api/updates/:id/snooze - Snooze a family update for current user
  app.post("/api/updates/:id/snooze", async (req, res) => {
    try {
      const updateId = req.params.id;
      const userId = "user-1"; // TODO: Get from authenticated user
      const { until } = req.body; // Optional snooze until date

      let snoozeUntil = until ? new Date(until) : undefined;
      
      // Validation: Apply server-side caps
      const now = new Date();
      const minUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes minimum
      
      // Get the update to check dueAt
      const update = await storage.getFamilyUpdate(updateId);
      const maxUntil = update?.dueAt ? new Date(update.dueAt) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days max
      
      if (snoozeUntil) {
        if (snoozeUntil < minUntil) {
          snoozeUntil = minUntil;
        }
        if (snoozeUntil > maxUntil) {
          snoozeUntil = maxUntil;
        }
      } else {
        // Default to dueAt or 7 days
        snoozeUntil = update?.dueAt ? new Date(update.dueAt) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      }

      const snooze = await storage.snoozeFamilyUpdate(updateId, userId, snoozeUntil);

      res.json({ success: true, snooze, until: snoozeUntil });
    } catch (error) {
      console.error("Error snoozing family update:", error);
      res.status(500).json({ error: "Failed to snooze update" });
    }
  });

  // DELETE /api/updates/:id/snooze - Unsnooze a family update for current user
  app.delete("/api/updates/:id/snooze", async (req, res) => {
    try {
      const updateId = req.params.id;
      const userId = "user-1"; // TODO: Get from authenticated user
      
      const success = await storage.unsnoozeFamilyUpdate(updateId, userId);
      
      res.json({ success });
    } catch (error) {
      console.error("Error unsnoozing family update:", error);
      res.status(500).json({ error: "Failed to unsnooze update" });
    }
  });

  // GET /api/updates/snoozed - Get current user's active snoozes with joined update info
  app.get("/api/updates/snoozed", async (req, res) => {
    try {
      const userId = "user-1"; // TODO: Get from authenticated user
      const snoozedUpdates = await storage.getUserSnoozedUpdates(userId);
      
      // Get the actual update details for each snoozed item
      const items = await Promise.all(
        snoozedUpdates.map(async (snooze) => {
          const update = await storage.getFamilyUpdate(snooze.updateId);
          return {
            id: snooze.id,
            updateId: snooze.updateId,
            until: snooze.until,
            update
          };
        })
      );
      
      res.json({ items });
    } catch (error) {
      console.error("Error fetching snoozed updates:", error);
      res.status(500).json({ error: "Failed to fetch snoozed updates" });
    }
  });

  // POST /api/updates/:id/unsnooze - Remove snooze for current user
  app.post("/api/updates/:id/unsnooze", async (req, res) => {
    try {
      const updateId = req.params.id;
      const userId = "user-1"; // TODO: Get from authenticated user
      
      const success = await storage.unsnoozeFamilyUpdate(updateId, userId);
      
      res.json({ ok: true, success });
    } catch (error) {
      console.error("Error unsnoozing update:", error);
      res.status(500).json({ error: "Failed to unsnooze update" });
    }
  });

  // GET /api/updates/snoozed/count - Get count of active snoozed updates for current user
  app.get("/api/updates/snoozed/count", async (req, res) => {
    try {
      const userId = "user-1"; // TODO: Get from authenticated user
      const count = await storage.getUserSnoozedCount(userId);
      
      res.json({ count });
    } catch (error) {
      console.error("Error getting snoozed count:", error);
      res.status(500).json({ error: "Failed to get snoozed count" });
    }
  });

  // POST /api/updates/generate - Generate updates for testing (development only)
  app.post("/api/updates/generate", async (req, res) => {
    try {
      const familyId = "family-1";
      await generateFamilyUpdates(familyId);
      res.json({ success: true, message: "Updates generated" });
    } catch (error) {
      console.error("Error generating updates:", error);
      res.status(500).json({ error: "Failed to generate updates" });
    }
  });

  // POST /api/family/activity/test - Create test activity (development only)
  app.post("/api/family/activity/test", async (req, res) => {
    try {
      const testActivities = [
        {
          familyId: "family-1",
          userId: "current-user", 
          activityType: "document_upload",
          title: "New document uploaded",
          description: "Tax documents for 2025 have been uploaded",
          priority: "medium"
        },
        {
          familyId: "family-1",
          userId: "sarah@family.com",
          activityType: "document_approve", 
          title: "Document approved",
          description: "Passport renewal request has been approved",
          priority: "low"
        },
        {
          familyId: "family-1", 
          userId: "john@family.com",
          activityType: "message",
          title: "New family message",
          description: "Planning next weekend's family gathering", 
          priority: "low"
        }
      ];
      
      // Pick random test activity
      const randomActivity = testActivities[Math.floor(Math.random() * testActivities.length)];
      
      // Log and broadcast the activity
      const activity = await logFamilyActivity(randomActivity);
      
      res.json({ 
        success: true, 
        activity: {
          id: activity.id,
          type: activity.activityType,
          title: activity.title,
          description: activity.description,
          timestamp: activity.createdAt?.toISOString(),
          author: { id: activity.userId, name: activity.userId },
          priority: activity.priority
        }
      });
    } catch (error) {
      console.error("Error creating test activity:", error);
      res.status(500).json({ error: "Failed to create test activity" });
    }
  });

  // GET /api/family/stats - Get family statistics
  app.get("/api/family/stats", async (req, res) => {
    try {
      // Mock stats data - in production, this would calculate from database
      const stats = {
        totalMembers: 4,
        recentlyAdded: [
          { id: "alex", name: "Alex Johnson", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { id: "sarah", name: "Sarah Johnson", createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }
        ]
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching family stats:", error);
      res.status(500).json({ error: "Failed to fetch family stats" });
    }
  });

  // GET /api/dashboard/widget/:type - Get dashboard widget data
  app.get("/api/dashboard/widget/:type", async (req, res) => {
    try {
      const { type } = req.params;
      
      // Mock widget data based on type
      let data = {};
      
      switch (type) {
        case 'stats':
          data = {
            totalMembers: 4,
            totalDocuments: 23,
            unreadMessages: 3,
            upcomingEvents: 2,
            securityScore: 95,
            storageUsed: 2.4,
            lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          };
          break;
        case 'activity':
          data = {
            recentActivities: [
              { type: "message", title: "New family message", timestamp: "2 min ago" },
              { type: "document", title: "Document uploaded", timestamp: "1 hour ago" }
            ]
          };
          break;
        case 'reminders':
          data = {
            items: [
              { title: "Insurance renewal", dueDate: "2024-03-15", priority: "high" },
              { title: "Doctor appointment", dueDate: "2024-03-10", priority: "medium" }
            ]
          };
          break;
        default:
          data = { message: "Widget type not found" };
      }
      
      res.json(data);
    } catch (error) {
      console.error("Error fetching widget data:", error);
      res.status(500).json({ error: "Failed to fetch widget data" });
    }
  });

  // Twilio webhook handler for SMS delivery status
  app.post("/api/twilio/status", async (req, res) => {
    try {
      const {
        MessageSid,
        MessageStatus,
        To,
        ErrorCode,
        ErrorMessage
      } = req.body || {};

      console.log("Twilio delivery status:", {
        MessageSid,
        MessageStatus,
        To,
        ErrorCode,
        ErrorMessage
      });

      // Log delivery status for monitoring/debugging
      if (MessageStatus === 'failed' || ErrorCode) {
        console.error(`SMS delivery failed for ${To}:`, {
          messageId: MessageSid,
          error: ErrorMessage || `Code: ${ErrorCode}`
        });
      } else if (MessageStatus === 'delivered') {
        console.log(`SMS delivered successfully to ${To}: ${MessageSid}`);
      }

      // Optionally store delivery status in database for auditing
      // await storage.logSMSDeliveryStatus({ MessageSid, MessageStatus, To, ErrorCode });

      res.sendStatus(204); // Acknowledge receipt
    } catch (error) {
      console.error("Error processing Twilio webhook:", error);
      res.sendStatus(500);
    }
  });

  // User presence endpoints for SMS optimization
  app.post("/api/presence/online", async (req, res) => {
    try {
      const userId = "current-user"; // TODO: Get from authenticated session
      markUserOnline(userId);
      res.json({ status: "online" });
    } catch (error) {
      console.error("Error marking user online:", error);
      res.status(500).json({ error: "Failed to update presence" });
    }
  });

  app.post("/api/presence/offline", async (req, res) => {
    try {
      const userId = "current-user"; // TODO: Get from authenticated session
      markUserOffline(userId);
      res.json({ status: "offline" });
    } catch (error) {
      console.error("Error marking user offline:", error);
      res.status(500).json({ error: "Failed to update presence" });
    }
  });

  // Typing indicators endpoints
  app.post("/api/threads/:id/typing/start", async (req, res) => {
    try {
      const userId = "current-user"; // TODO: Get from authenticated session
      const threadId = req.params.id;
      
      const realtimeManager = getRealtimeManager();
      if (realtimeManager) {
        // Find client and trigger typing start
        // This would be more elegant with proper session management
        console.log(`[typing] User ${userId} started typing in thread ${threadId}`);
        res.json({ status: "typing:started" });
      } else {
        res.status(503).json({ error: "Realtime system not available" });
      }
    } catch (error) {
      console.error("Error starting typing indicator:", error);
      res.status(500).json({ error: "Failed to start typing" });
    }
  });

  app.post("/api/threads/:id/typing/stop", async (req, res) => {
    try {
      const userId = "current-user"; // TODO: Get from authenticated session
      const threadId = req.params.id;
      
      const realtimeManager = getRealtimeManager();
      if (realtimeManager) {
        console.log(`[typing] User ${userId} stopped typing in thread ${threadId}`);
        res.json({ status: "typing:stopped" });
      } else {
        res.status(503).json({ error: "Realtime system not available" });
      }
    } catch (error) {
      console.error("Error stopping typing indicator:", error);
      res.status(500).json({ error: "Failed to stop typing" });
    }
  });

  // Realtime stats endpoint for monitoring
  app.get("/api/realtime/stats", async (req, res) => {
    try {
      const realtimeManager = getRealtimeManager();
      if (realtimeManager) {
        const stats = realtimeManager.getStats();
        res.json(stats);
      } else {
        res.json({ error: "Realtime system not initialized", connectedClients: 0 });
      }
    } catch (error) {
      console.error("Error fetching realtime stats:", error);
      res.status(500).json({ error: "Failed to fetch realtime stats" });
    }
  });

  // Calendar Events API
  // GET /api/calendar/events - Fetch calendar events for date range
  app.get("/api/calendar/events", async (req, res) => {
    try {
      const { from, to } = req.query;
      const familyId = "family-1"; // TODO: Get from user's family
      
      const events = await storage.getCalendarEvents(familyId, from as string, to as string);
      res.json({ events });
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  // POST /api/calendar/events - Create new calendar event
  app.post("/api/calendar/events", async (req, res) => {
    try {
      const eventData = req.body;
      const familyId = "family-1"; // TODO: Get from user's family
      const createdBy = "current-user"; // TODO: Get from authenticated session
      
      const event = await storage.createCalendarEvent({
        ...eventData,
        familyId,
        createdBy
      });
      
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({ error: "Failed to create calendar event" });
    }
  });

  // ICE (In Case of Emergency) API
  // GET /api/ice - Fetch family ICE data
  app.get("/api/ice", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      
      const iceData = await storage.getFamilyICEData(familyId);
      if (!iceData) {
        return res.status(404).json({ error: "ICE data not found" });
      }
      
      res.json(iceData);
    } catch (error) {
      console.error("Error fetching ICE data:", error);
      res.status(500).json({ error: "Failed to fetch ICE data" });
    }
  });

  // PUT /api/ice - Update family ICE data
  app.put("/api/ice", async (req, res) => {
    try {
      const iceData = req.body;
      const familyId = "family-1"; // TODO: Get from user's family
      const lastUpdatedBy = "current-user"; // TODO: Get from authenticated session
      
      const updatedICEData = await storage.updateFamilyICEData({
        ...iceData,
        familyId,
        lastUpdatedBy
      });
      
      res.json(updatedICEData);
    } catch (error) {
      console.error("Error updating ICE data:", error);
      res.status(500).json({ error: "Failed to update ICE data" });
    }
  });

  // GET /api/ice/print - Generate ICE PDF for download
  app.get("/api/ice/print", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      
      const iceData = await storage.getFamilyICEData(familyId);
      if (!iceData) {
        return res.status(404).json({ error: "ICE data not found" });
      }

      // Generate PDF using pdfkit
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="family-ice-information.pdf"');
      
      // Pipe the PDF to response
      doc.pipe(res);

      // PDF Header
      doc.fontSize(20).fillColor('#D4AF37').text("In Case of Emergency (ICE)", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).fillColor('gray').text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
      doc.moveDown(2);

      // Helper functions for consistent formatting
      const section = (title: string) => { 
        doc.fontSize(14).fillColor('black').text(title, { underline: true });
        doc.moveDown(0.5);
      };
      
      const field = (label: string, value?: string) => { 
        doc.fontSize(11).fillColor('gray').text(`${label}: `, { continued: true }); 
        doc.fillColor('black').text(value || "Not provided"); 
      };

      // Emergency Contacts Section
      section("Emergency Contacts");
      if (iceData.emergencyContacts) {
        field("Primary Contact", iceData.emergencyContacts.primary);
        field("Doctor", iceData.emergencyContacts.doctor);
        field("Neighbor/Friend", iceData.emergencyContacts.neighbor);
      } else {
        doc.fontSize(11).fillColor('gray').text("No emergency contacts configured");
      }
      doc.moveDown(2);

      // Medical Information Section
      section("Medical Information");
      if (iceData.medicalInfo) {
        field("Allergies", iceData.medicalInfo.allergies);
        field("Medical Conditions", iceData.medicalInfo.conditions);
        field("Current Medications", iceData.medicalInfo.medications);
      } else {
        doc.fontSize(11).fillColor('gray').text("No medical information provided");
      }
      doc.moveDown(2);

      // Blood Types Section
      section("Blood Types");
      if (iceData.bloodTypes) {
        field("Father", iceData.bloodTypes.dad);
        field("Mother", iceData.bloodTypes.mom);
        field("Children", iceData.bloodTypes.kids);
      } else {
        doc.fontSize(11).fillColor('gray').text("No blood type information provided");
      }
      doc.moveDown(2);

      // Additional Notes Section
      if (iceData.additionalNotes) {
        section("Additional Notes");
        doc.fontSize(11).fillColor('black').text(iceData.additionalNotes, { 
          width: 500,
          align: 'left'
        });
      }

      // Footer
      doc.moveDown(4);
      doc.fontSize(10).fillColor('#D4AF37').text("© 2025 Family Portal - Emergency Information", { 
        align: "center" 
      });

      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("Error generating ICE PDF:", error);
      res.status(500).json({ error: "Failed to generate ICE PDF" });
    }
  });

  // Chores & Allowance API endpoints
  // Import statements are at the top of the file

  // GET /api/chores/summary - Get chores counts for Action Center
  app.get("/api/chores/summary", softLimit, cacheSeconds(30), async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from user's family
      const now = new Date();
      const soon = new Date();
      soon.setDate(soon.getDate() + 2); // Next 2 days

      // Count pending approvals (chores marked as done but not approved)
      const pendingApprovals = await db.select().from(chores)
        .where(and(eq(chores.familyId, familyId), eq(chores.status, "done")));

      // Count chores due soon (next 2 days)
      const dueSoon = await db.select().from(chores)
        .where(and(
          eq(chores.familyId, familyId), 
          eq(chores.status, "todo"),
          sql`${chores.dueAt} BETWEEN ${now.toISOString()} AND ${soon.toISOString()}`
        ));

      // Count overdue chores
      const overdue = await db.select().from(chores)
        .where(and(
          eq(chores.familyId, familyId), 
          eq(chores.status, "todo"),
          sql`${chores.dueAt} < ${now.toISOString()}`
        ));

      res.json({
        pendingApprovals: pendingApprovals.length,
        dueSoon: dueSoon.length,
        overdue: overdue.length
      });
    } catch (error) {
      console.error("Error fetching chores summary:", error);
      res.status(500).json({ error: "Failed to fetch chores summary" });
    }
  });

  // GET /api/chores - List chores (optionally for a specific assignee)
  app.get("/api/chores", async (req, res) => {
    try {
      const { since, assigneeId, scope } = req.query;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const currentUserId = "current-user"; // TODO: Get from session
      
      let whereConditions = [eq(chores.familyId, familyId)];
      
      // Handle scope parameter (family vs mine)
      if (scope === "mine") {
        whereConditions.push(eq(chores.assigneeId, currentUserId));
      } else if (assigneeId === "me") {
        whereConditions.push(eq(chores.assigneeId, currentUserId));
      } else if (assigneeId) {
        whereConditions.push(eq(chores.assigneeId, assigneeId as string));
      }
      
      if (since) {
        whereConditions.push(sql`${chores.dueAt} >= ${new Date(since as string).toISOString()}`);
      }

      const choresList = await db.select({
        id: chores.id,
        title: chores.title,
        details: chores.details,
        dueAt: chores.dueAt,
        points: chores.points,
        status: chores.status,
        assigneeId: chores.assigneeId,
        assignee: {
          id: familyMembers.id,
          name: familyMembers.name,
          role: familyMembers.role
        }
      })
      .from(chores)
      .leftJoin(familyMembers, eq(chores.assigneeId, familyMembers.id))
      .where(and(...whereConditions))
      .orderBy(chores.status, chores.dueAt);

      res.json(choresList);
    } catch (error) {
      console.error("Error fetching chores:", error);
      res.status(500).json({ error: "Failed to fetch chores" });
    }
  });

  // POST /api/chores - Create chore (parents only)
  app.post("/api/chores", async (req, res) => {
    try {
      const { title, details, assigneeId, dueAt, points, rotationKey } = req.body;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const createdById = "current-user"; // TODO: Get from session
      
      // TODO: Check if user is parent role
      
      if (!title || !assigneeId || !dueAt) {
        return res.status(400).json({ error: "Title, assigneeId, and dueAt are required" });
      }

      const newChore = await db.insert(chores).values({
        title: title.trim(),
        details: details?.trim() || null,
        assigneeId,
        dueAt: new Date(dueAt),
        points: points || 10,
        rotationKey: rotationKey?.trim() || null,
        familyId,
        createdById,
        status: "todo"
      }).returning();

      res.status(201).json(newChore[0]);
    } catch (error) {
      console.error("Error creating chore:", error);
      res.status(500).json({ error: "Failed to create chore" });
    }
  });

  // POST /api/chores/:id/done - Mark chore done (self only)
  app.post("/api/chores/:id/done", async (req, res) => {
    try {
      const choreId = req.params.id;
      const userId = "current-user"; // TODO: Get from session
      const familyId = "family-1"; // TODO: Get from session
      
      // Find the chore
      const chore = await db.select().from(chores)
        .where(and(eq(chores.id, choreId), eq(chores.familyId, familyId)))
        .limit(1);

      if (!chore.length) {
        return res.status(404).json({ error: "Chore not found" });
      }

      // Check if user is assignee or parent
      // TODO: Add role check for parents
      if (chore[0].assigneeId !== userId) {
        return res.status(403).json({ error: "Only assignee can mark chore as done" });
      }

      const updatedChore = await db.update(chores)
        .set({ status: "done" })
        .where(eq(chores.id, choreId))
        .returning();

      res.json(updatedChore[0]);
    } catch (error) {
      console.error("Error marking chore done:", error);
      res.status(500).json({ error: "Failed to mark chore done" });
    }
  });

  // POST /api/chores/:id/approve - Approve chore (parents only) → adds ledger points
  app.post("/api/chores/:id/approve", async (req, res) => {
    try {
      const choreId = req.params.id;
      const familyId = "family-1"; // TODO: Get from session
      const createdById = "current-user"; // TODO: Get from session
      
      // TODO: Check if user is parent role
      
      // Find the chore
      const chore = await db.select().from(chores)
        .where(and(eq(chores.id, choreId), eq(chores.familyId, familyId)))
        .limit(1);

      if (!chore.length) {
        return res.status(404).json({ error: "Chore not found" });
      }

      if (chore[0].status !== "done") {
        return res.status(400).json({ error: "Chore must be marked done before approval" });
      }

      // Transaction: approve chore and add points to ledger
      const result = await db.transaction(async (tx) => {
        const updatedChore = await tx.update(chores)
          .set({ status: "approved" })
          .where(eq(chores.id, choreId))
          .returning();

        await tx.insert(allowanceLedger).values({
          familyId,
          memberId: chore[0].assigneeId,
          deltaPoints: chore[0].points,
          reason: `Chore: ${chore[0].title} (${chore[0].dueAt.toISOString().slice(0, 10)})`,
          createdById
        });

        return updatedChore[0];
      });

      res.json(result);
    } catch (error) {
      console.error("Error approving chore:", error);
      res.status(500).json({ error: "Failed to approve chore" });
    }
  });

  // PATCH /api/chores/:id/complete - Mark chore complete (assignee only) 
  app.patch("/api/chores/:id/complete", async (req, res) => {
    try {
      const choreId = req.params.id;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const currentUserId = "current-user"; // TODO: Get from session
      
      // Find the chore
      const chore = await db.select().from(chores)
        .where(and(eq(chores.id, choreId), eq(chores.familyId, familyId)))
        .limit(1);

      if (!chore.length) {
        return res.status(404).json({ error: "Chore not found" });
      }

      // Only assignee can mark complete
      if (chore[0].assigneeId !== currentUserId) {
        return res.status(403).json({ error: "Only the assignee can mark this chore complete" });
      }

      if (chore[0].status === "approved") {
        return res.status(400).json({ error: "Chore is already approved" });
      }

      const updatedChore = await db.update(chores)
        .set({ status: "done" })
        .where(eq(chores.id, choreId))
        .returning();

      res.json(updatedChore[0]);
    } catch (error) {
      console.error("Error completing chore:", error);
      res.status(500).json({ error: "Failed to complete chore" });
    }
  });

  // PATCH /api/chores/:id/unapprove - Unapprove chore (parents only) → compensating ledger
  app.patch("/api/chores/:id/unapprove", async (req, res) => {
    try {
      const choreId = req.params.id;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const approverId = "parent-user"; // TODO: Get from session
      const currentUserRole = "parent"; // TODO: Get from session
      
      if (currentUserRole !== "parent") {
        return res.status(403).json({ error: "Only parents can unapprove chores" });
      }
      
      // Find the chore
      const chore = await db.select().from(chores)
        .where(and(eq(chores.id, choreId), eq(chores.familyId, familyId)))
        .limit(1);

      if (!chore.length) {
        return res.status(404).json({ error: "Chore not found" });
      }

      if (chore[0].status !== "approved") {
        return res.status(400).json({ error: "Chore is not approved" });
      }

      // Transaction: unapprove chore and add compensating ledger entry
      const result = await db.transaction(async (tx) => {
        const updatedChore = await tx.update(chores)
          .set({ status: "done" })
          .where(eq(chores.id, choreId))
          .returning();

        // Compensate the points
        await tx.insert(allowanceLedger).values({
          familyId,
          memberId: chore[0].assigneeId,
          deltaPoints: -chore[0].points,
          reason: `Reversed approval: ${chore[0].title}`,
          createdById: approverId
        });

        return updatedChore[0];
      });

      res.json(result);
    } catch (error) {
      console.error("Error unapproving chore:", error);
      res.status(500).json({ error: "Failed to unapprove chore" });
    }
  });

  // PATCH /api/chores/:id/reject - Reject chore back to todo (parents only)
  app.patch("/api/chores/:id/reject", async (req, res) => {
    try {
      const choreId = req.params.id;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const currentUserRole = "parent"; // TODO: Get from session
      
      if (currentUserRole !== "parent") {
        return res.status(403).json({ error: "Only parents can reject chores" });
      }
      
      // Find the chore
      const chore = await db.select().from(chores)
        .where(and(eq(chores.id, choreId), eq(chores.familyId, familyId)))
        .limit(1);

      if (!chore.length) {
        return res.status(404).json({ error: "Chore not found" });
      }

      if (chore[0].status === "approved") {
        return res.status(400).json({ error: "Cannot reject an approved chore. Unapprove first." });
      }

      const updatedChore = await db.update(chores)
        .set({ status: "todo" })
        .where(eq(chores.id, choreId))
        .returning();

      res.json(updatedChore[0]);
    } catch (error) {
      console.error("Error rejecting chore:", error);
      res.status(500).json({ error: "Failed to reject chore" });
    }
  });

  // GET /api/allowance/summary - Get allowance points balance and history
  app.get("/api/allowance/summary", softLimit, cacheSeconds(15), async (req, res) => {
    try {
      const { memberId } = req.query;
      const familyId = "family-1"; // TODO: Get from session
      const userId = memberId === "me" ? "current-user" : (memberId || "current-user");
      
      const ledgerItems = await db.select().from(allowanceLedger)
        .where(and(eq(allowanceLedger.familyId, familyId), eq(allowanceLedger.memberId, userId)))
        .orderBy(desc(allowanceLedger.createdAt))
        .limit(50);

      const balance = ledgerItems.reduce((sum, item) => sum + item.deltaPoints, 0);

      res.json({
        balance,
        items: ledgerItems.slice(0, 5) // Only return top 5 for summary
      });
    } catch (error) {
      console.error("Error fetching allowance summary:", error);
      res.status(500).json({ error: "Failed to fetch allowance summary" });
    }
  });

  // GET /api/members - Get family members (for chore assignment)
  app.get("/api/members", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from session
      
      const members = await db.select({
        id: familyMembers.id,
        name: familyMembers.name,
        role: familyMembers.role
      }).from(familyMembers)
        .where(eq(familyMembers.familyId, familyId));

      res.json(members);
    } catch (error) {
      console.error("Error fetching family members:", error);
      res.status(500).json({ error: "Failed to fetch family members" });
    }
  });

  // Meal Planning & Recipe API endpoints
  
  // GET /api/recipes - List family recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      const recipesList = await db.select().from(recipes)
        .where(eq(recipes.familyId, familyId))
        .orderBy(desc(recipes.createdAt))
        .limit(100);

      res.json(recipesList);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });

  // POST /api/recipes - Create new recipe (Quick Add)
  app.post("/api/recipes", async (req, res) => {
    try {
      const { title, notes, ingredients, category, prepTime, cookTime, servings, difficulty, tags } = req.body;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const createdById = "current-user"; // TODO: Get from session
      
      if (!title || !ingredients) {
        return res.status(400).json({ error: "Title and ingredients are required" });
      }

      const newRecipe = await db.insert(recipes).values({
        title: title.trim(),
        notes: notes?.trim() || null,
        ingredients: ingredients.trim(),
        category: category?.trim() || "Main Course",
        prepTime: prepTime || null,
        cookTime: cookTime || null,
        servings: servings || null,
        difficulty: difficulty || "Easy",
        tags: tags?.trim() || null,
        familyId,
        createdById,
      }).returning();

      res.status(201).json(newRecipe[0]);
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({ error: "Failed to create recipe" });
    }
  });

  // GET /api/mealplan/week - Get weekly meal plan
  app.get("/api/mealplan/week", async (req, res) => {
    try {
      const startParam = req.query.start as string | undefined;
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      // Calculate week boundaries (Monday to Sunday)
      const now = startParam ? new Date(startParam) : new Date();
      const day = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((day + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      const entries = await db.select({
        id: mealPlanEntries.id,
        date: mealPlanEntries.date,
        mealType: mealPlanEntries.mealType,
        title: mealPlanEntries.title,
        recipeId: mealPlanEntries.recipeId,
        recipe: {
          id: recipes.id,
          title: recipes.title,
          ingredients: recipes.ingredients
        }
      })
      .from(mealPlanEntries)
      .leftJoin(recipes, eq(mealPlanEntries.recipeId, recipes.id))
      .where(and(
        eq(mealPlanEntries.familyId, familyId),
        sql`${mealPlanEntries.date} >= ${monday.toISOString().split('T')[0]}`,
        sql`${mealPlanEntries.date} <= ${sunday.toISOString().split('T')[0]}`
      ))
      .orderBy(mealPlanEntries.date, mealPlanEntries.mealType);

      res.json({ 
        start: monday.toISOString(),
        end: sunday.toISOString(),
        entries 
      });
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      res.status(500).json({ error: "Failed to fetch meal plan" });
    }
  });

  // POST /api/mealplan/set - Set a meal for specific day/meal type
  app.post("/api/mealplan/set", async (req, res) => {
    try {
      const { date, mealType, recipeId, title } = req.body;
      const familyId = "family-1"; // TODO: Get from authenticated session
      const createdById = "current-user"; // TODO: Get from session
      
      if (!date || !mealType) {
        return res.status(400).json({ error: "Date and mealType are required" });
      }

      const dayDate = new Date(date).toISOString().split('T')[0];
      
      // Check if entry exists for this day/meal combination
      const existingEntry = await db.select().from(mealPlanEntries)
        .where(and(
          eq(mealPlanEntries.familyId, familyId),
          sql`${mealPlanEntries.date} = ${dayDate}`,
          eq(mealPlanEntries.mealType, mealType)
        ))
        .limit(1);

      let result;
      if (existingEntry.length > 0) {
        // Update existing entry
        result = await db.update(mealPlanEntries)
          .set({
            recipeId: recipeId || null,
            title: recipeId ? null : (title?.trim() || null),
          })
          .where(eq(mealPlanEntries.id, existingEntry[0].id))
          .returning();
      } else {
        // Create new entry
        result = await db.insert(mealPlanEntries).values({
          familyId,
          date: dayDate,
          mealType,
          recipeId: recipeId || null,
          title: recipeId ? null : (title?.trim() || null),
          createdById,
        }).returning();
      }

      res.json(result[0]);
    } catch (error) {
      console.error("Error setting meal:", error);
      res.status(500).json({ error: "Failed to set meal" });
    }
  });

  // POST /api/mealplan/generate-shopping-list - Generate shopping list from week's recipes
  app.post("/api/mealplan/generate-shopping-list", async (req, res) => {
    try {
      const startParam = req.body.start as string | undefined;
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      // Calculate week boundaries
      const now = startParam ? new Date(startParam) : new Date();
      const day = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((day + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      // Get meal plan entries with recipes for the week
      const entries = await db.select({
        recipe: {
          title: recipes.title,
          ingredients: recipes.ingredients
        }
      })
      .from(mealPlanEntries)
      .leftJoin(recipes, eq(mealPlanEntries.recipeId, recipes.id))
      .where(and(
        eq(mealPlanEntries.familyId, familyId),
        sql`${mealPlanEntries.date} >= ${monday.toISOString().split('T')[0]}`,
        sql`${mealPlanEntries.date} <= ${sunday.toISOString().split('T')[0]}`,
        sql`${mealPlanEntries.recipeId} IS NOT NULL`
      ));

      // Parse ingredients and create shopping items
      const itemsToAdd: { name: string; qty?: string; source: string }[] = [];
      
      for (const entry of entries) {
        if (entry.recipe?.ingredients) {
          const source = entry.recipe.title || "Meal";
          const lines = entry.recipe.ingredients.split(/\n|,/).map(s => s.trim()).filter(Boolean);
          
          for (const line of lines) {
            itemsToAdd.push({
              name: line,
              source
            });
          }
        }
      }

      // Insert shopping items
      if (itemsToAdd.length > 0) {
        await db.insert(shoppingItems).values(
          itemsToAdd.map(item => ({
            familyId,
            name: item.name,
            qty: item.qty || null,
            checked: false,
            source: item.source
          }))
        );
      }

      res.json({ added: itemsToAdd.length });
    } catch (error) {
      console.error("Error generating shopping list:", error);
      res.status(500).json({ error: "Failed to generate shopping list" });
    }
  });

  // GET /api/shopping - Get shopping list items
  app.get("/api/shopping", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      const items = await db.select().from(shoppingItems)
        .where(eq(shoppingItems.familyId, familyId))
        .orderBy(shoppingItems.checked, desc(shoppingItems.createdAt));

      res.json(items);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
      res.status(500).json({ error: "Failed to fetch shopping list" });
    }
  });

  // POST /api/shopping - Add shopping list item manually
  app.post("/api/shopping", async (req, res) => {
    try {
      const { name, qty } = req.body;
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const newItem = await db.insert(shoppingItems).values({
        familyId,
        name: name.trim(),
        qty: qty?.trim() || null,
        checked: false,
        source: "Manual"
      }).returning();

      res.status(201).json(newItem[0]);
    } catch (error) {
      console.error("Error adding shopping item:", error);
      res.status(500).json({ error: "Failed to add shopping item" });
    }
  });

  // PATCH /api/shopping/:id - Update shopping item (mainly for checking/unchecking)
  app.patch("/api/shopping/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { checked } = req.body;
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      const updatedItem = await db.update(shoppingItems)
        .set({ checked: Boolean(checked) })
        .where(and(
          eq(shoppingItems.id, id),
          eq(shoppingItems.familyId, familyId)
        ))
        .returning();

      if (!updatedItem.length) {
        return res.status(404).json({ error: "Shopping item not found" });
      }

      res.json(updatedItem[0]);
    } catch (error) {
      console.error("Error updating shopping item:", error);
      res.status(500).json({ error: "Failed to update shopping item" });
    }
  });

  // DELETE /api/shopping/:id - Delete shopping item
  app.delete("/api/shopping/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      const deleted = await db.delete(shoppingItems)
        .where(and(
          eq(shoppingItems.id, id),
          eq(shoppingItems.familyId, familyId)
        ))
        .returning();

      if (!deleted.length) {
        return res.status(404).json({ error: "Shopping item not found" });
      }

      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting shopping item:", error);
      res.status(500).json({ error: "Failed to delete shopping item" });
    }
  });

  // ===========================
  // AI INBOX API ENDPOINTS
  // ===========================
  
  // POST /api/inbox/register - Register an upload for AI analysis
  app.post("/api/inbox/register", async (req, res) => {
    try {
      const { userId, fileKey, fileName, mime, size } = req.body;
      
      console.log("📝 Registering upload:", { userId, fileKey, fileName, mime, size });
      
      if (!userId || !fileKey || !fileName) {
        return res.status(422).json({ error: "userId, fileKey, fileName required" });
      }
      
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      const id = crypto.randomUUID();
      
      console.log("🆔 Generated upload ID:", id);
      
      await db.insert(inboxItems).values({
        id,
        familyId,
        userId,
        filename: fileName,
        fileUrl: fileKey, // Using fileKey as fileUrl for compatibility
        fileSize: size,
        mimeType: mime,
        status: "analyzing",
        analysisCompleted: false,
      });
      
      console.log("✅ Inbox item created successfully with ID:", id);
      
      res.json({ uploadId: id });
    } catch (error) {
      console.error("❌ Error registering upload:", error);
      res.status(500).json({ error: "Failed to register upload" });
    }
  });

  // POST /api/inbox/:id/analyze - Run OCR analysis and build suggestion
  app.post("/api/inbox/:id/analyze", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, fileKey, fileName, retryAttempt } = req.body || {};
      
      console.log("🔍 Looking for inbox item with ID:", id, `(attempt ${retryAttempt || 1})`);
      
      // Get the inbox item
      let [item] = await db.select().from(inboxItems).where(eq(inboxItems.id, id));
      
      console.log("📦 Found item:", item ? "YES" : "NO", item ? `(${item.filename})` : "");
      
      // Self-healing: if item not found but we have context, create it
      if (!item && userId && fileKey && fileName) {
        console.log("🔧 Self-healing: Creating missing inbox item with provided context");
        
        const familyId = "family-1"; // TODO: Get from authenticated session
        
        await db.insert(inboxItems).values({
          id,
          familyId,
          userId,
          filename: fileName,
          fileUrl: fileKey,
          fileSize: 0, // Will be updated later if needed
          mimeType: "application/octet-stream", // Will be updated later if needed
          status: "analyzing",
          analysisCompleted: false,
        });
        
        // Fetch the newly created item
        [item] = await db.select().from(inboxItems).where(eq(inboxItems.id, id));
        console.log("✅ Self-healing successful, created item:", item?.filename);
      }
      
      if (!item) {
        console.log("❌ Item not found even after self-healing attempt");
        const allItems = await db.select().from(inboxItems).limit(10);
        console.log("📋 All items in DB:", allItems.map(i => ({ id: i.id, filename: i.filename })));
        return res.status(404).json({ error: "Inbox item not found" });
      }

      // Update status to analyzing
      await db.update(inboxItems)
        .set({ status: "analyzing" })
        .where(eq(inboxItems.id, id));

      // Run OCR analysis - extract key information from the document
      console.log("🔍 Starting OCR analysis for file:", item.fileUrl);
      const fields = await runOcr({ url: item.fileUrl });
      console.log("📄 Extracted fields:", fields);

      // Store extracted fields in database
      for (const field of fields) {
        await db.insert(extractedFields).values({
          id: crypto.randomUUID(),
          inboxItemId: id,
          fieldKey: field.key,
          fieldValue: field.value,
          confidence: field.confidence,
          isPii: field.pii || false,
        });
      }

      // Import the family matching service
      const { getFamilyMembersForUser, suggestMember } = await import("./services/family-matcher");

      // Get family members for suggestion matching
      const members = await getFamilyMembersForUser(item.familyId);

      // Extract relevant data for matching
      const extractedData = {
        name: fields.find(f => f.key.toLowerCase().includes("name"))?.value,
        dob: fields.find(f => f.key.toLowerCase().includes("birth") || f.key.toLowerCase().includes("dob"))?.value,
        ssn: fields.find(f => f.key.toLowerCase().includes("ssn") || f.key.toLowerCase().includes("social"))?.value,
      };

      // Build intelligent suggestion using matching algorithm
      const suggestion = suggestMember(extractedData, members);

      // Update inbox item with suggestion
      await db.update(inboxItems).set({
        status: suggestion ? "suggested" : "dismissed",
        analysisCompleted: true,
        suggestedMemberId: suggestion?.memberId || null,
        confidence: suggestion?.confidence || null,
        processedAt: new Date(),
      }).where(eq(inboxItems.id, id));

      res.json({ suggestion, fields });
    } catch (error) {
      console.error("Error analyzing upload:", error);
      
      // Update item status to failed
      await db.update(inboxItems)
        .set({ status: "dismissed", analysisCompleted: true })
        .where(eq(inboxItems.id, req.params.id));
        
      res.status(500).json({ error: "Failed to analyze upload" });
    }
  });

  // POST /api/inbox/:id/accept - Accept suggestion and assign file to member
  app.post("/api/inbox/:id/accept", async (req, res) => {
    try {
      const { id } = req.params;
      const { memberId, fields } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated session
      
      // Get the inbox item
      const [item] = await db.select().from(inboxItems).where(eq(inboxItems.id, id));
      if (!item) {
        return res.status(404).json({ error: "Inbox item not found" });
      }

      // Create member file assignment
      await db.insert(memberFileAssignments).values({
        id: crypto.randomUUID(),
        familyId: item.familyId,
        memberId,
        fileUrl: item.fileUrl,
        filename: item.filename,
        category: "document", // Default category
        metadata: fields || {},
        assignedBy: userId,
      });

      // Update inbox item status
      await db.update(inboxItems).set({
        status: "accepted",
        acceptedAt: new Date(),
      }).where(eq(inboxItems.id, id));

      res.json({ ok: true });
    } catch (error) {
      console.error("Error accepting suggestion:", error);
      res.status(500).json({ error: "Failed to accept suggestion" });
    }
  });

  // POST /api/inbox/:id/dismiss - Dismiss suggestion
  app.post("/api/inbox/:id/dismiss", async (req, res) => {
    try {
      const { id } = req.params;
      
      await db.update(inboxItems).set({
        status: "dismissed",
        dismissedAt: new Date(),
      }).where(eq(inboxItems.id, id));

      res.json({ ok: true });
    } catch (error) {
      console.error("Error dismissing suggestion:", error);
      res.status(500).json({ error: "Failed to dismiss suggestion" });
    }
  });

  // POST /api/inbox/:id/accept-autofill - Accept autofill suggestion from banner
  app.post("/api/inbox/:id/accept-autofill", async (req, res) => {
    try {
      const { id } = req.params;
      const { memberId, fields } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated session
      
      console.log("📋 Accepting autofill for item:", id, "to member:", memberId);
      
      // Get the inbox item
      const [item] = await db.select().from(inboxItems).where(eq(inboxItems.id, id));
      if (!item) {
        return res.status(404).json({ error: "Inbox item not found" });
      }

      // Create member file assignment if memberId provided
      if (memberId) {
        await db.insert(memberFileAssignments).values({
          id: crypto.randomUUID(),
          familyId: item.familyId,
          memberId,
          fileUrl: item.fileUrl,
          filename: item.filename,
          category: "document", // Default category, could be derived from fields
          metadata: fields || {},
          assignedBy: userId,
        });
        console.log("✅ File assigned to member:", memberId);
      }

      // Update inbox item status to accepted
      await db.update(inboxItems).set({
        status: "accepted",
        acceptedAt: new Date(),
      }).where(eq(inboxItems.id, id));

      res.json({ 
        ok: true, 
        message: memberId ? "File assigned to member" : "Autofill accepted" 
      });
      
    } catch (error) {
      console.error("Error accepting autofill:", error);
      res.status(500).json({ error: "Failed to accept autofill" });
    }
  });

  // GET /api/ai-status - Check AI availability for progressive enhancement
  app.get("/api/ai-status", async (req, res) => {
    try {
      // Check if AI services are available
      const available = true; // For now, always available - could check OCR service health
      
      res.json({ 
        available,
        features: {
          ocr: true,
          familyMatching: true,
          autofill: true
        }
      });
    } catch (error) {
      console.error("Error checking AI status:", error);
      res.json({ available: false });
    }
  });

  // GET /api/inbox - List inbox items for the drawer
  app.get("/api/inbox", async (req, res) => {
    try {
      const familyId = "family-1"; // TODO: Get from authenticated session
      
      // Get inbox items with their extracted fields
      const items = await db.select({
        id: inboxItems.id,
        filename: inboxItems.filename,
        fileUrl: inboxItems.fileUrl,
        fileSize: inboxItems.fileSize,
        mimeType: inboxItems.mimeType,
        status: inboxItems.status,
        analysisCompleted: inboxItems.analysisCompleted,
        suggestedMemberId: inboxItems.suggestedMemberId,
        confidence: inboxItems.confidence,
        uploadedAt: inboxItems.uploadedAt,
        processedAt: inboxItems.processedAt,
      })
      .from(inboxItems)
      .where(
        and(
          eq(inboxItems.familyId, familyId),
          sql`${inboxItems.status} != 'dismissed'`
        )
      )
      .orderBy(desc(inboxItems.uploadedAt));

      // Get extracted fields for each item
      const itemsWithFields = await Promise.all(
        items.map(async (item) => {
          const fields = await db.select().from(extractedFields)
            .where(eq(extractedFields.inboxItemId, item.id));
          
          let memberName = null;
          if (item.suggestedMemberId) {
            const [member] = await db.select().from(familyMembers)
              .where(eq(familyMembers.id, item.suggestedMemberId));
            memberName = member?.name || null;
          }

          return {
            ...item,
            fields,
            suggestion: item.suggestedMemberId ? {
              memberId: item.suggestedMemberId,
              memberName,
              confidence: item.confidence || 0,
              fields
            } : null
          };
        })
      );

      res.json(itemsWithFields);
    } catch (error) {
      console.error("Error fetching inbox items:", error);
      res.status(500).json({ error: "Failed to fetch inbox items" });
    }
  });

  const httpServer = createServer(app);
  
  // Initialize realtime WebSocket system
  initializeRealtime(httpServer);
  
  return httpServer;
}
