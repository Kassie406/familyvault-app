import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import storageRoutes from "./storage-routes";
import fileRoutes from "./routes/files";
import mobileUploadRoutes from "./routes/mobile-upload";
import { 
  insertInviteSchema, 
  insertFamilyMemberSchema,
  insertFamilySchema,
  insertFamilyBusinessItemSchema,
  insertFamilyLegalItemSchema,
  insertFamilyInsuranceItemSchema,
  insertFamilyTaxItemSchema,
  insertMessageThreadSchema,
  insertThreadMemberSchema,
  insertMessageSchema
} from "@shared/schema";
import crypto from "crypto";

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

  // Mount file status routes for real-time updates
  app.use("/api/files", fileRoutes);

  // Mount mobile upload routes
  app.use("/api/mobile-upload", mobileUploadRoutes);

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

  // POST /api/threads/:id/messages - Send a message
  app.post("/api/threads/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const { body, fileIds = [] } = req.body;
      const userId = "current-user"; // TODO: Get from authenticated user
      
      if (!body && (!fileIds || fileIds.length === 0)) {
        return res.status(400).json({ error: "Message body or files required" });
      }

      const messageData = {
        threadId: id,
        authorId: userId,
        body,
        fileIds
      };

      const message = await storage.createMessage(messageData);
      
      // TODO: Broadcast via WebSocket to thread members
      console.log(`Broadcasting message ${message.id} to thread ${id}`);
      
      res.status(201).json({ message });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
