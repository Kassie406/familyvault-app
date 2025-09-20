import type { Express } from "express";
import { createServer, type Server } from "http";
import { prisma as storage } from "./storage";
import { db } from "./db";
import { sql, desc, eq, and } from "drizzle-orm";
import { familyActivity, chores, allowanceLedger, familyMembers, recipes, mealPlanEntries, shoppingItems, familyUpdates, coupleActivities, coupleChores, inboxItems, extractedFields, memberFileAssignments, type InsertFamilyUpdate, type InsertInboxItem, type InsertExtractedField, type InsertMemberFileAssignment } from "@shared/schema";
import storageRoutes from "./storage-routes";
import fileRoutes from "./routes/files";
import mobileUploadRoutes from "./routes/mobile-upload";
import uploadsRouter from "./routes/uploads";
import trustworthyRouter from "./routes/trustworthy";
import smsRoutes from "./sms";
import threadsListRouter from "./routes/threadsList";
import threadMessagesRouter from "./routes/threadMessages";
import apiServicesRouter from "./routes/apiServices";
import documentsRouter from "./routes/documents";
import { calendarRouter } from "./routes/calendar";
import familyMeetingsRouter from "./routes/family-meetings";
import { aiInboxRouter } from "./routes/ai-inbox";
import aiAgentRouter from "./routes/ai-agent";
import { getActivity, markActivityRead, markAllActivityRead, emitActivity } from "./routes/activity";
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
      const family = await storage.family.findFirst({ where: { ownerId: userId } });
      
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
      const family = await storage.family.create({ data: familyData });
      
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
      const members = await storage.familyMember.findMany({ where: { familyId } });
      
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
      
      const member = await storage.familyMember.create({ data: { ...memberData, familyId } });
      
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating family member:", error);
      res.status(500).json({ error: "Failed to create family member" });
    }
  });

  // Mount storage routes for file uploads
  app.use("/api/storage", storageRoutes);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/trustworthy", trustworthyRouter);
  app.use("/api/inbox", aiInboxRouter);
  app.use("/api/ai-agent", aiAgentRouter);

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

  // Mount SMS routes
  app.use("/api", smsRoutes);

  // Activity API endpoints
  app.get("/api/activity", getActivity);
  app.post("/api/activity/mark-read", markActivityRead);
  app.post("/api/activity/mark-all-read", markAllActivityRead);
  app.post("/api/activity/emit", emitActivity);

  const httpServer = createServer(app);
  
  // Initialize realtime WebSocket system
  initializeRealtime(httpServer);
  
  return httpServer;
}
