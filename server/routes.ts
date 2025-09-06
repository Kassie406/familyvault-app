import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { sql, desc, eq } from "drizzle-orm";
import { familyActivity } from "@shared/schema";
import storageRoutes from "./storage-routes";
import fileRoutes from "./routes/files";
import mobileUploadRoutes from "./routes/mobile-upload";
import uploadsRouter from "./routes/uploads";
import smsRoutes from "./sms";
import threadsListRouter from "./routes/threadsList";
import threadMessagesRouter from "./routes/threadMessages";
import apiServicesRouter from "./routes/apiServices";
import documentsRouter from "./routes/documents";
import axios from "axios";
import { sendSMSNotification } from "./lib/twilio";
import { sendSMSNotificationsForMessage, markUserOnline, markUserOffline } from "./lib/sms-notifications";
import { getOrCreateFamilyChatId } from "./lib/chat-default";
import { initializeRealtime, getRealtimeManager } from "./lib/realtime.js";
import { emitFamilyActivity } from "./realtime";
import { logFamilyActivity } from "./lib/activity";
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

  // Mount threads list routes for chat dashboard
  app.use("/api/threads", threadsListRouter);

  // Mount thread messages routes for individual conversation views
  app.use("/api/threads", threadMessagesRouter);

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

  const httpServer = createServer(app);
  
  // Initialize realtime WebSocket system
  initializeRealtime(httpServer);
  
  return httpServer;
}
