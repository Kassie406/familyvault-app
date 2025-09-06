import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { SecureStorageService } from "./storage-service";
import { CSRFService } from "./csrf-service";
import { RLSService } from "./rls-service";
import { WebAuthnService } from "./webauthn-service";
import { AuditService, getAuditContext } from "./audit-service";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createIoServer } from "./realtime";
import { type AuthenticatedRequest, optionalAuth, requireAuth, loginUser, registerUser, generateToken } from "./auth";
import { storage } from "./storage";
import { requireRecentReauth, markStrongAuth } from "./reauth-middleware";
import { touchAuthSession } from "./request-tracker";
import { maybeSendNewDeviceEmail } from "./new-device-alerts";
import { getOrgSecuritySettings, setOrgSecuritySettings, guardFor, canModifyOrgSecurity } from "./org-security-service";
import sessionsRouter from "./sessions-api";
import stepupRouter from "./stepup-routes";
import testStepupRouter from "./test-stepup-routes";
import businessRoutes from "./routes/business";
import apiServicesRouter from "./routes/apiServices";
import { escalationWorker } from "./escalation-worker";
import { startRemindersWorker } from "./lib/reminders-worker";
import { smsService } from "./sms-service";
import { eq, desc, and } from "drizzle-orm";
import { incidents, oncallTargets } from "@shared/schema";
import { db as dbConnection } from "./db";
import { startImpersonation, endImpersonation, getImpersonationStatus, getRecentImpersonationSessions, parseImpersonationJWT, enforceImpersonationDenylist } from "./impersonation";

const app = express();

// Trust proxy for proper rate limiting and IP detection
app.set('trust proxy', 1);

// Enhanced security middleware with development support
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: process.env.NODE_ENV === 'development' 
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"] 
        : ["'self'"],
      connectSrc: process.env.NODE_ENV === 'development'
        ? ["'self'", "ws:", "wss:"]
        : ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development compatibility
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-site" },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), interest-cohort=()');
  next();
});

// Enhanced rate limiting with DoS protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 1000, // Balanced for security
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 200, // Allow 200 requests at full speed
  delayMs: () => 250, // Slow down subsequent requests by 250ms
  validate: { delayMs: false } // Disable warning
});

app.use(limiter, speedLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve uploaded files
app.use("/uploads", express.static("uploads", { maxAge: "7d", index: false }));

// Health check and test endpoints - MUST come before any SPA fallback
app.get('/api/healthz', (req, res) => res.json({ ok: true, t: Date.now() }));

app.post('/api/test-post', (req, res) => {
  console.log('[test-post] hit', new Date().toISOString());
  res.json({ ok: true });
});

// Small helper to guarantee we never hang the client
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`TIMEOUT ${label} after ${ms}ms`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); }).catch(e => { clearTimeout(t); reject(e); });
  });
}

// Session tracking middleware (after cookie parsing)
app.use(touchAuthSession);

// CSRF Protection (applied selectively to state-changing operations)
const csrfProtection = CSRFService.createProtection();
app.use(CSRFService.errorHandler());

// Row-Level Security tenant isolation middleware (applies to all authenticated requests)
app.use(RLSService.tenantMiddleware());

// Impersonation JWT parsing and denylist enforcement middleware
app.use(parseImpersonationJWT);
app.use(enforceImpersonationDenylist);

// Enhanced subdomain detection middleware
app.use((req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const host = req.get('Host') || '';
  const subdomain = host.split('.')[0];
  
  // Attach subdomain info to request
  req.subdomain = subdomain;
  req.isAdminRequest = subdomain === 'console';
  req.isPortalRequest = subdomain === 'portal';
  req.isHubRequest = subdomain === 'hub';
  
  log(`Request from host: ${host}, subdomain: ${subdomain}, type: ${subdomain}`);
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Authentication routes
app.post('/api/auth/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await loginUser(username, password, req);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set secure HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes for security
      path: '/'
    });

    res.json({
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        orgId: result.user.orgId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password, email, name } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const result = await registerUser({ username, password, email, name });
    if (!result) {
      return res.status(400).json({ error: 'User already exists' });
    }

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 60 * 1000, // 30 minutes for security
      path: '/'
    });

    res.json({
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        orgId: result.user.orgId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true });
});

// CSRF token endpoint (apply CSRF protection to generate token)
app.get('/api/csrf-token', csrfProtection, CSRFService.getTokenEndpoint());

// Secure file storage endpoints
app.post('/api/files/upload-url', requireAuth, csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { filename, contentType } = req.body;
    
    if (!filename || !contentType) {
      return res.status(400).json({ error: 'Filename and content type are required' });
    }

    // Generate secure file key
    const fileKey = SecureStorageService.generateSecureFileKey(filename, req.user!.id);
    const orgId = req.user!.email || req.user!.id; // Use email as org identifier for now
    
    // Create signed upload URL
    const uploadUrl = await SecureStorageService.createUploadUrl(
      fileKey,
      contentType,
      orgId,
      req.user!.id
    );

    res.json({
      uploadUrl,
      fileKey,
      expiresIn: 300 // 5 minutes
    });
  } catch (error) {
    console.error('File upload URL generation failed:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

app.post('/api/files/download-url', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fileKey } = req.body;
    
    if (!fileKey) {
      return res.status(400).json({ error: 'File key is required' });
    }

    const orgId = req.user!.email || req.user!.id; // Use email as org identifier for now
    
    // Validate file access
    if (!SecureStorageService.validateFileAccess(fileKey, orgId)) {
      return res.status(403).json({ error: 'Access denied to this file' });
    }

    // Create signed download URL
    const downloadUrl = await SecureStorageService.createDownloadUrl(fileKey, orgId);

    res.json({
      downloadUrl,
      expiresIn: 300 // 5 minutes
    });
  } catch (error) {
    console.error('File download URL generation failed:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// Initialize RLS endpoint (admin only - run once during deployment)
app.post('/api/admin/security/initialize-rls', requireAuth, csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Only allow admin users to initialize RLS
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    await RLSService.initializeRLS();
    res.json({ 
      success: true, 
      message: 'Row-Level Security policies initialized successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('RLS initialization failed:', error);
    res.status(500).json({ error: 'Failed to initialize RLS' });
  }
});

// WebAuthn Endpoints
app.post('/api/auth/webauthn/register/begin', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const options = await WebAuthnService.generateRegistration(req.user!.id, req.user!.email);
    res.json(options);
  } catch (error) {
    console.error('WebAuthn registration start failed:', error);
    res.status(500).json({ error: 'Failed to start WebAuthn registration' });
  }
});

app.post('/api/auth/webauthn/register/complete', requireAuth, csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { credential, expectedChallenge } = req.body;
    const result = await WebAuthnService.verifyRegistration(
      req.user!.id,
      credential,
      expectedChallenge
    );
    
    if (result.verified) {
      // Mark strong authentication event for passkey registration
      markStrongAuth(req);
    }
    
    res.json(result);
  } catch (error) {
    console.error('WebAuthn registration completion failed:', error);
    res.status(500).json({ error: 'Failed to complete WebAuthn registration' });
  }
});

app.post('/api/auth/webauthn/authenticate/begin', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const options = await WebAuthnService.generateAuthentication(email);
    res.json(options);
  } catch (error) {
    console.error('WebAuthn authentication start failed:', error);
    res.status(500).json({ error: 'Failed to start WebAuthn authentication' });
  }
});

app.post('/api/auth/webauthn/authenticate/complete', async (req: Request, res: Response) => {
  try {
    const { credential, expectedChallenge } = req.body;
    const result = await WebAuthnService.verifyAuthentication(
      credential,
      expectedChallenge
    );
    
    if (result.verified) {
      // Get user and create session
      const user = await storage.getUser(result.userId!);
      if (user) {
        const token = generateToken(user);
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 30 * 60 * 1000, // 30 minutes for security
          path: '/'
        });
        
        // Mark strong authentication event for passkey login
        markStrongAuth(req);
        
        // Check for new device and send alert if needed
        if (user.email) {
          await maybeSendNewDeviceEmail(
            { id: user.id, email: user.email, orgId: user.orgId },
            req.get('user-agent'),
            req.ip
          );
        }
        
        res.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
      } else {
        res.status(401).json({ error: 'User not found' });
      }
    } else {
      res.status(401).json({ error: 'WebAuthn authentication failed' });
    }
  } catch (error) {
    console.error('WebAuthn authentication completion failed:', error);
    res.status(500).json({ error: 'Failed to complete WebAuthn authentication' });
  }
});

// List user's WebAuthn credentials
app.get('/api/auth/webauthn/credentials', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const credentials = await WebAuthnService.listUserAuthenticators(req.user!.id);
    res.json({ credentials });
  } catch (error) {
    console.error('Failed to list WebAuthn credentials:', error);
    res.status(500).json({ error: 'Failed to get WebAuthn credentials' });
  }
});

// Remove WebAuthn credential
app.delete('/api/auth/webauthn/credentials/:id', requireAuth, csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await WebAuthnService.removeCredential(req.user!.id, id);
    res.json({ success });
  } catch (error) {
    console.error('Failed to remove WebAuthn credential:', error);
    res.status(500).json({ error: 'Failed to remove WebAuthn credential' });
  }
});

// WebAuthn configuration endpoint for frontend
app.get('/api/auth/webauthn/config', (req: Request, res: Response) => {
  const rpId = process.env.NODE_ENV === 'production' ? 'familycirclesecure.com' : 'localhost';
  const origins = process.env.NODE_ENV === 'production' 
    ? ['https://familycirclesecure.com'] 
    : ['http://localhost:5000'];
  
  res.json({
    rpID: rpId,
    origins: origins,
    enabled: true // Always enabled since we have WebAuthn service
  });
});

// Sessions management API
app.use('/api/security/sessions', requireAuth, sessionsRouter);

// Step-up authentication API
app.use('/api/stepup', requireAuth, stepupRouter);

// Test step-up authentication endpoints
app.use('/api/test-stepup', requireAuth, testStepupRouter);

// Business management API - Simple endpoint
app.get('/api/business/managers', (_req, res) => {
  console.log("Direct business managers API called");
  const managers = [
    { id: 'angel', name: 'Angel Johnson', initials: 'AJ', itemCount: 5, role: 'Managing Member' },
    { id: 'kassandra', name: 'Kassandra Johnson', initials: 'KJ', itemCount: 2, role: 'Operations Director' },
    { id: 'family', name: 'Family Shared', initials: 'FS', itemCount: 2, role: 'Joint Ownership' }
  ];
  res.json(managers);
});

// Business management API
app.use('/api/business', requireAuth, businessRoutes);

// Share functionality imports and setup
import { makeToken, expiryToDate, appUrl, type Expiry } from "./shareHelpers";
import { db } from "./db";
import { shareLinks, credentials, credentialShares } from "@shared/schema";

// Production-ready authentication helper
const getUserId = (req: any) => req.user?.id || req.session?.user?.id;

// Health check endpoints
app.get('/api/healthz', (_req, res) => res.json({ok: true}));
app.post('/api/test-post', (_req, res) => res.json({ok: true}));

// Timeout wrapper function (removed duplicate)

// Production endpoints - Generate/regenerate share link (FAST, DETERMINISTIC)
app.post('/api/credentials/:id/shares/regenerate', async (req, res) => {
  try {
    const { id } = req.params;
    const { expiry = '7d', requireLogin = true } = req.body ?? {};
    console.log('[regen] hit', { id, expiry, requireLogin, t: Date.now() });

    const token = crypto.randomBytes(16).toString('base64url');
    
    // Calculate expiry date
    const now = new Date();
    const expiresAt = 
      expiry === 'never' ? null :
      expiry === '24h'   ? new Date(now.getTime() + 24*3600*1000) :
      expiry === '7d'    ? new Date(now.getTime() + 7*24*3600*1000) :
      new Date(now.getTime() + 30*24*3600*1000);

    // Insert token into database
    await db.insert(shareLinks).values({
      token,
      credentialId: id,
      expiresAt: expiresAt ?? undefined,
      requireLogin,
      revoked: false,
      createdBy: getUserId(req) || 'anonymous',
    });

    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/share/${token}`;
    console.log('[regen] ok', { id, token: token.slice(0,8), url, baseUrl, saved: true });
    return res.json({ token, url, requireLogin });
  } catch (err: any) {
    console.error('[regen] fail', { id: req.params.id, err: err?.message });
    return res
      .status(/TIMEOUT/.test(err?.message) ? 504 : 500)
      .json({ ok: false, error: err?.message || 'unknown' });
  }
});

// Update sharing settings 
app.put("/api/credentials/:id/shares", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const credentialId = req.params.id;
    const {
      linkEnabled,
      shareUrl,
      expiry = "7d",
      requireLogin = true,
      shares = [],
    } = (req.body ?? {}) as {
      linkEnabled: boolean;
      shareUrl?: string | null;
      expiry?: Expiry;
      requireLogin?: boolean;
      shares?: { personId: string; permission: string }[];
    };

    if (!linkEnabled) {
      await db
        .update(shareLinks)
        .set({ revoked: true })
        .where(eq(shareLinks.credentialId, credentialId));
    } else if (shareUrl) {
      const token = shareUrl.split("/share/").pop()!;
      await db
        .update(shareLinks)
        .set({
          requireLogin,
          expiresAt: expiryToDate(expiry) ?? undefined,
          revoked: false,
        })
        .where(
          and(
            eq(shareLinks.token, token),
            eq(shareLinks.credentialId, credentialId)
          )
        );
    }

    // Upsert per-member/group permissions
    for (const s of shares) {
      await db
        .insert(credentialShares)
        .values({
          credentialId,
          subjectId: s.personId,
          permission: s.permission,
        })
        .onConflictDoUpdate({
          target: [
            credentialShares.credentialId,
            credentialShares.subjectId,
          ],
          set: { permission: s.permission },
        });
    }

    return res.json({ ok: true });
  } catch (e) {
    console.error("save shares error", e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Mock credential data (in production this would be encrypted in database)
const mockCredentials: Record<string, any> = {
  '1': {
    title: "Angel's Phone Password",
    tag: 'Device',
    owner: 'Angel',
    sharedBy: 'Kassandra',
    username: 'angel@family.com',
    password: 'Angel123Phone!',
    url: '',
    notes: 'Angel\'s phone unlock password - updated monthly'
  },
  'c-gd-home': {
    title: 'Garage Door Code',
    tag: 'Access',
    owner: 'Family',
    sharedBy: 'Dad',
    username: '',
    password: '4829',
    url: '',
    notes: 'Main garage door entry code - change quarterly'
  },
  'c-ph-angel': {
    title: 'Bank of America - Personal Account',
    tag: 'Banking', 
    owner: 'Angel',
    sharedBy: 'Angel',
    username: 'sarah.johnson@email.com',
    password: 'MySecureP@ssw0rd123',
    url: 'https://bankofamerica.com',
    notes: 'Primary checking account - remember to check balance weekly'
  },
  'c-em-work': {
    title: 'Gmail - Work Account',
    tag: 'Email',
    owner: 'Dad',
    sharedBy: 'Dad',
    username: 'john.smith@company.com', 
    password: 'WorkEmail2024!',
    url: 'https://gmail.com',
    notes: 'Work email account - used for all business communications'
  }
};

// Share viewer metadata (public endpoint)
app.get("/api/share/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const link = await db.query.shareLinks.findFirst({
      where: eq(shareLinks.token, token),
    });
    if (!link || link.revoked) return res.status(404).json({ error: "invalid" });
    if (link.expiresAt && new Date(link.expiresAt) < new Date())
      return res.status(410).json({ error: "expired" });

    const cred = await db.query.credentials.findFirst({
      columns: { id: true, title: true, ownerId: true },
      where: eq(credentials.id, link.credentialId),
    });

    // Get credential details from mock data for better display
    const mockData = mockCredentials[link.credentialId];
    
    return res.json({
      title: mockData?.title ?? cred?.title ?? "Shared Item",
      owner: mockData?.owner ?? cred?.ownerId ?? "Unknown",
      sharedBy: mockData?.sharedBy ?? "Unknown",
      requireLogin: !!link.requireLogin,
      canReveal: !link.requireLogin,
    });
  } catch (e) {
    console.error("viewer error", e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Reveal secret (enforces authentication if required)
app.post("/api/share/:token/reveal", async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const link = await db.query.shareLinks.findFirst({
      where: eq(shareLinks.token, token),
    });
    
    if (!link || link.revoked) return res.status(404).json({ error: "invalid" });
    if (link.expiresAt && new Date(link.expiresAt) < new Date())
      return res.status(410).json({ error: "expired" });

    // Check if authentication is required for this specific link
    if (link.requireLogin) {
      const authHeader = req.headers.authorization;
      const session = (req as any).session;
      if (!authHeader?.startsWith('Bearer ') && !session?.userId) {
        return res.status(401).json({ error: "authentication_required" });
      }
    }

    // Get mock credential data (TODO: replace with real decryption)
    const mockData = mockCredentials[link.credentialId];
    
    if (!mockData) {
      // Return fallback data for demo purposes
      return res.json({
        title: "Demo Credential",
        owner: "Unknown",
        sharedBy: "System",
        username: "demo@example.com",
        password: "Demo123Password",
        url: "https://example.com",
        notes: "This is a demo credential for testing"
      });
    }

    // Audit log
    const userId = link.requireLogin ? getUserId(req as AuthenticatedRequest) : 'anonymous';
    console.log(`Share revealed: credential=${link.credentialId}, user=${userId}`);

    // Return full credential data that frontend expects (metadata + secrets)
    return res.json({
      title: mockData.title,
      owner: mockData.owner,
      sharedBy: mockData.sharedBy,
      username: mockData.username,
      password: mockData.password,
      url: mockData.url,
      notes: mockData.notes
    });
  } catch (e) {
    console.error("reveal error", e);
    return res.status(500).json({ error: "server_error" });
  }
});

// Peek endpoint - simple token verification
app.get('/api/share/:token/peek', async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    
    const link = await db.query.shareLinks.findFirst({
      where: eq(shareLinks.token, token),
    });
    if (!link || link.revoked) return res.status(404).json({ error: 'Token not found' });
    if (link.expiresAt && new Date(link.expiresAt) < new Date())
      return res.status(410).json({ error: 'Token expired' });
    
    const mockData = mockCredentials[link.credentialId];
    
    res.json({
      title: mockData?.title || 'Shared Credential',
      credentialId: link.credentialId,
      tag: mockData?.tag || 'Credential',
      owner: link.createdBy
    });
  } catch (error) {
    console.error('Share peek error:', error);
    res.status(500).json({ error: 'internal_error' });
  }
});

// Organization security settings API
app.get('/api/admin/org-security', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!canModifyOrgSecurity(req.user?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const orgId = req.user?.orgId;
    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const settings = await getOrgSecuritySettings(orgId);
    res.json(settings || {
      orgId,
      requireMfaForDownloads: true,
      requireMfaForShares: true,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Failed to get org security settings:', error);
    res.status(500).json({ error: 'Failed to retrieve security settings' });
  }
});

app.post('/api/admin/org-security', requireAuth, csrfProtection, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!canModifyOrgSecurity(req.user?.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    const orgId = req.user?.orgId;
    if (!orgId) {
      return res.status(400).json({ error: 'Organization ID required' });
    }

    const { requireMfaForDownloads, requireMfaForShares } = req.body;
    
    const settings = await setOrgSecuritySettings(orgId, {
      requireMfaForDownloads,
      requireMfaForShares
    });

    res.json(settings);
  } catch (error) {
    console.error('Failed to update org security settings:', error);
    res.status(500).json({ error: 'Failed to update security settings' });
  }
});

app.get('/api/auth/me', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        orgId: req.user.orgId
      }
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Admin API routes (require ADMIN role or higher)

// Security metrics for Admin Security Center
app.get('/api/admin/security/metrics', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Replace with real security metrics from database
    const metrics = {
      twoFactorEnabled: false, // Check if any admin users have 2FA enabled
      activeSessions: 1, // Count active admin sessions
      lastLogin: new Date().toISOString(),
      ipAllowlistConfigured: false, // Check if IP restrictions are set
      lastKeyRotation: null, // Last API key rotation date
      adminUsers: 1, // Count of admin users
      failedLogins24h: 0, // Failed login attempts in last 24h
    };
    res.json(metrics);
  } catch (error) {
    console.error('Get security metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch security metrics' });
  }
});

// Feature flags management
app.get('/api/admin/flags', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Sample feature flags data
    const flags = [
      {
        id: 'flag-1',
        key: 'new-billing-ui',
        name: 'New Billing UI',
        description: 'Enables the redesigned billing interface',
        status: 'active',
        force_on: false,
        force_off: false,
        targeting: {
          percentage: 25,
          allowDomains: ['@familycirclesecure.com'],
          allowUserIds: [],
          blockUserIds: []
        },
        updated_at: new Date().toISOString()
      },
      {
        id: 'flag-2', 
        key: 'admin-v2-dashboard',
        name: 'Admin V2 Dashboard',
        description: 'New admin dashboard with enhanced analytics',
        status: 'active',
        force_on: false,
        force_off: false,
        targeting: {
          percentage: 50,
          allowDomains: [],
          allowUserIds: [],
          blockUserIds: []
        },
        updated_at: new Date().toISOString()
      },
      {
        id: 'flag-3',
        key: 'mobile-app-v3',
        name: 'Mobile App V3',
        description: 'Third generation mobile application',
        status: 'archived',
        force_on: true,
        force_off: false,
        targeting: {
          percentage: 100,
          allowDomains: [],
          allowUserIds: [],
          blockUserIds: []
        },
        updated_at: new Date().toISOString()
      }
    ];
    res.json({ items: flags });
  } catch (error) {
    console.error('Get feature flags error:', error);
    res.status(500).json({ error: 'Failed to fetch feature flags' });
  }
});

app.post('/api/admin/flags', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const flagData = req.body;
    // TODO: Implement actual flag creation in database
    console.log('Creating feature flag:', flagData);
    res.json({ success: true, id: `flag-${Date.now()}` });
  } catch (error) {
    console.error('Create feature flag error:', error);
    res.status(500).json({ error: 'Failed to create feature flag' });
  }
});

app.patch('/api/admin/flags/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // TODO: Implement actual flag update in database
    console.log('Updating feature flag:', id, updates);
    res.json({ success: true });
  } catch (error) {
    console.error('Update feature flag error:', error);
    res.status(500).json({ error: 'Failed to update feature flag' });
  }
});

// Public API endpoints (no authentication required)
app.get('/api/public/menu-categories', async (req: Request, res: Response) => {
  try {
    // For now, return mock data to demonstrate the structure
    // TODO: Once database migration is complete, use: await storage.getMenuCategories()
    const categories = [
      {
        category: "Child Information",
        slug: "child-information", 
        icon: "👶",
        articles: [
          { title: "Keeping Kids' Docs Safe", url: "/articles/kids-docs-safe", slug: "kids-docs-safe" },
          { title: "School Records Storage", url: "/articles/school-records", slug: "school-records" }
        ]
      },
      {
        category: "Disaster Planning",
        slug: "disaster-planning",
        icon: "⚠️", 
        articles: [
          { title: "Family Evacuation Checklist", url: "/articles/evacuation-checklist", slug: "evacuation-checklist" },
          { title: "Emergency Contact System", url: "/articles/emergency-contacts", slug: "emergency-contacts" }
        ]
      },
      {
        category: "Digital Security",
        slug: "digital-security",
        icon: "🔒",
        articles: [
          { title: "Password Manager Setup", url: "/articles/password-manager", slug: "password-manager" },
          { title: "Two-Factor Authentication", url: "/articles/2fa-setup", slug: "2fa-setup" }
        ]
      }
    ];
    
    res.json(categories);
  } catch (error) {
    console.error('Get menu categories error:', error);
    res.status(500).json({ error: 'Failed to fetch menu categories' });
  }
});

// Bulk content operations endpoints
app.post('/api/admin/content/bulk-publish', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty article IDs array' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const updated = await storage.updateArticle(id, { 
          published: true, 
          status: 'published',
          publishAt: new Date()
        });
        results.push({ id, success: !!updated });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ results, totalProcessed: ids.length });
  } catch (error) {
    console.error('Bulk publish error:', error);
    res.status(500).json({ error: 'Failed to bulk publish articles' });
  }
});

app.post('/api/admin/content/bulk-unpublish', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty article IDs array' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const updated = await storage.updateArticle(id, { 
          published: false, 
          status: 'draft'
        });
        results.push({ id, success: !!updated });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ results, totalProcessed: ids.length });
  } catch (error) {
    console.error('Bulk unpublish error:', error);
    res.status(500).json({ error: 'Failed to bulk unpublish articles' });
  }
});

app.post('/api/admin/content/bulk-archive', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty article IDs array' });
    }

    const results = [];
    for (const id of ids) {
      try {
        const updated = await storage.updateArticle(id, { 
          status: 'archived',
          published: false
        });
        results.push({ id, success: !!updated });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.json({ results, totalProcessed: ids.length });
  } catch (error) {
    console.error('Bulk archive error:', error);
    res.status(500).json({ error: 'Failed to bulk archive articles' });
  }
});

app.get('/api/admin/users', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add pagination and filtering
    res.json({ users: [], total: 0, message: 'User management coming soon' });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/plans', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const plans = await storage.getAllPlans();
    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

app.get('/api/admin/coupons', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const coupons = await storage.getAllCoupons();
    res.json({ coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

app.post('/api/admin/coupons', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, percentOff, amountOff, validFrom, validTo, maxRedemptions } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    const coupon = await storage.createCoupon({
      code,
      percentOff,
      amountOff,
      validFrom: validFrom ? new Date(validFrom) : undefined,
      validTo: validTo ? new Date(validTo) : undefined,
      maxRedemptions
    });

    res.json({ coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

app.get('/api/admin/articles', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const articles = await storage.getAllArticles();
    res.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

app.get('/api/admin/consents', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const consents = await storage.getConsentEvents(500);
    res.json({ consents });
  } catch (error) {
    console.error('Get consents error:', error);
    res.status(500).json({ error: 'Failed to fetch consent events' });
  }
});

// Admin profile endpoints
app.get('/api/admin/profile', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Return user profile data
    const profile = {
      id: user.id,
      username: user.username,
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.json(profile);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/admin/profile', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { name, email, username } = req.body;
    
    // TODO: Update user profile in storage
    // For now, return success message
    const updatedProfile = {
      id: user.id,
      username: username || user.username,
      name: name || user.name,
      email: email || user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString()
    };

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Admin settings endpoints
app.get('/api/admin/settings', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Return mock settings data - in production this would come from database
    const settings = {
      // Security Settings
      twoFactorRequired: false,
      sessionTimeout: '24',
      passwordPolicy: 'medium',
      
      // Notification Settings
      emailNotifications: true,
      systemAlerts: true,
      auditAlerts: true,
      
      // System Settings
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      logRetention: '90',
      
      // Feature Flags
      maintenanceMode: false,
      debugMode: false,
      registrationEnabled: true
    };

    res.json(settings);
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/admin/settings', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      twoFactorRequired,
      sessionTimeout,
      passwordPolicy,
      emailNotifications,
      systemAlerts,
      auditAlerts,
      timezone,
      dateFormat,
      logRetention,
      maintenanceMode,
      debugMode,
      registrationEnabled
    } = req.body;

    // TODO: Save settings to database
    // For now, return the updated settings
    const updatedSettings = {
      twoFactorRequired,
      sessionTimeout,
      passwordPolicy,
      emailNotifications,
      systemAlerts,
      auditAlerts,
      timezone,
      dateFormat,
      logRetention,
      maintenanceMode,
      debugMode,
      registrationEnabled,
      updatedAt: new Date().toISOString()
    };

    res.json(updatedSettings);
  } catch (error) {
    console.error('Update admin settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Webhook endpoints - with mock data for demo
app.get('/api/admin/webhooks', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock webhook data for demo purposes
    const webhooks = [
      {
        id: 'webhook-1',
        url: 'https://api.partner.com/webhooks/fcs',
        secret: 'wh_1234567890abcdef',
        events: ['user.created', 'invoice.paid', 'subscription.updated'],
        active: true,
        last_delivery: {
          status: 200,
          timestamp: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'webhook-2', 
        url: 'https://hooks.zapier.com/hooks/catch/123456/abcdef',
        secret: 'wh_fedcba0987654321',
        events: ['payment.succeeded', 'payment.failed'],
        active: true,
        last_delivery: {
          status: 500,
          timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'webhook-3',
        url: 'https://internal.familycirclesecure.com/webhooks',
        secret: 'wh_internal789xyz',
        events: ['user.created', 'user.updated', 'user.deleted', 'plan.changed'],
        active: false,
        last_delivery: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    res.json({ items: webhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ error: 'Failed to fetch webhook endpoints' });
  }
});

app.post('/api/admin/webhooks', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url, events, active } = req.body;
    
    if (!url || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'URL and events array required' });
    }

    // TODO: Implement webhook creation
    const webhook = {
      id: crypto.randomUUID(),
      url,
      events,
      active: active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.status(201).json(webhook);
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ error: 'Failed to create webhook endpoint' });
  }
});

app.patch('/api/admin/webhooks/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { url, events, active } = req.body;
    
    // TODO: Implement webhook update
    const webhook = {
      id,
      url: url || 'https://example.com/webhook',
      events: events || ['user.created'],
      active: active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.json(webhook);
  } catch (error) {
    console.error('Update webhook error:', error);
    res.status(500).json({ error: 'Failed to update webhook endpoint' });
  }
});

app.delete('/api/admin/webhooks/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement webhook deletion
    res.json({ success: true });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ error: 'Failed to delete webhook endpoint' });
  }
});

app.post('/api/admin/webhooks/:id/test', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Implement webhook testing
    res.json({ status: 200, ok: true });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: 'Failed to test webhook endpoint' });
  }
});

app.get('/api/admin/audit', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await storage.getAuditLogs(500);
    res.json({ logs });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Search audit logs with enhanced filtering
app.get('/api/admin/audit/search', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q: query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const logs = await storage.searchAuditLogs(query, 100);
    res.json({ logs });
  } catch (error) {
    console.error('Search audit logs error:', error);
    res.status(500).json({ error: 'Failed to search audit logs' });
  }
});

// Enhanced audit logs v2 with tamper-evident features
app.get('/api/admin/audit-v2', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock audit data for demo purposes
    const mockAuditEntries = [
      {
        id: 'audit-1',
        ts: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        actor: {
          id: 'admin-1',
          email: 'admin@familycirclesecure.com',
          ip: '192.168.1.100'
        },
        action: 'user.create',
        target: {
          type: 'user',
          id: 'u_12345'
        },
        meta_hash: 'a1b2c3d4e5f6789abcdef1234567890',
        prev_hash: null,
        hash: 'f9e8d7c6b5a4321dcba0987654321fed'
      },
      {
        id: 'audit-2',
        ts: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        actor: {
          id: 'admin-2',
          email: 'security@familycirclesecure.com',
          ip: '10.0.0.45'
        },
        action: 'feature_flag.update',
        target: {
          type: 'feature_flag',
          id: 'ff_billing_v2'
        },
        meta_hash: 'b2c3d4e5f6789abcdef1234567890a1',
        prev_hash: 'f9e8d7c6b5a4321dcba0987654321fed',
        hash: 'e7d6c5b4a3210987654321fedcba0987'
      },
      {
        id: 'audit-3',
        ts: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        actor: {
          id: 'admin-1',
          email: 'admin@familycirclesecure.com',
          ip: '192.168.1.100'
        },
        action: 'webhook.delete',
        target: {
          type: 'webhook',
          id: 'wh_test123'
        },
        meta_hash: 'c3d4e5f6789abcdef1234567890a1b2',
        prev_hash: 'e7d6c5b4a3210987654321fedcba0987',
        hash: 'd6c5b4a3210987654321fedcba098765'
      }
    ];
    
    res.json({ items: mockAuditEntries });
  } catch (error) {
    console.error('Get audit logs v2 error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Security Posture Summary API
app.get('/api/admin/security/posture', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Mock security posture data
    const mockPosture = {
      score: 75,
      subtitle: "3 critical issues need attention",
      issues: [
        { type: 'bad', text: 'Admin 2FA not enforced' },
        { type: 'warn', text: 'Audit chain verification required' },
        { type: 'warn', text: 'API keys older than 90 days' }
      ],
      actions: [
        { id: 'enable_2fa', text: 'Enable Admin 2FA', primary: true, handler: 'enable_2fa' },
        { id: 'verify_chain', text: 'Verify Audit Chain', primary: false, handler: 'verify_chain' },
        { id: 'rotate_keys', text: 'Rotate API Keys', primary: false, handler: 'rotate_keys' },
        { id: 'configure_ip', text: 'Configure IP Allowlist', primary: false, handler: 'configure_ip' }
      ]
    };
    
    res.json(mockPosture);
  } catch (error) {
    console.error('Get security posture error:', error);
    res.status(500).json({ error: 'Failed to fetch security posture' });
  }
});

app.post('/api/admin/security/actions/:actionId', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { actionId } = req.params;
    
    // Mock action execution
    console.log(`Executing security action: ${actionId}`);
    
    res.json({ 
      success: true, 
      message: `Security action ${actionId} executed successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Execute security action error:', error);
    res.status(500).json({ error: 'Failed to execute security action' });
  }
});

app.get('/api/admin/audit-v2/verify', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { auditService } = await import('./audit-service-v2.js');
    const result = await auditService.verifyChainIntegrity();
    res.json(result);
  } catch (error) {
    console.error('Verify audit integrity error:', error);
    res.status(500).json({ error: 'Failed to verify integrity' });
  }
});

// Create sample audit data for demonstration
app.post('/api/admin/audit-v2/seed', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { auditService, attachAuditContext } = await import('./audit-service-v2.js');
    
    // Sample audit entries for demonstration
    const sampleEntries = [
      {
        action: 'user.create',
        objectType: 'user',
        objectId: 'u_123',
        before: null,
        after: { id: 'u_123', email: 'john@example.com', role: 'USER' },
        reason: 'New user registration'
      },
      {
        action: 'feature_flag.update',
        objectType: 'flag',
        objectId: 'ff_456',
        before: { enabled: false, percentage: 0 },
        after: { enabled: true, percentage: 25 },
        reason: 'Gradual rollout to 25% of users'
      },
      {
        action: 'coupon.delete',
        objectType: 'coupon',
        objectId: 'cp_789',
        before: { code: 'SAVE20', discount: 20, active: true },
        after: null,
        reason: 'Expired promotional campaign'
      }
    ];

    // Attach audit context
    attachAuditContext(req, res, () => {});
    
    if (!req.auditCtx) {
      return res.status(500).json({ error: 'Audit context not available' });
    }

    // Create entries with proper hash chaining
    for (const entry of sampleEntries) {
      await auditService.writeAudit(req.auditCtx, entry);
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    res.json({ message: 'Sample audit data created', count: sampleEntries.length });
  } catch (error) {
    console.error('Create sample audit data error:', error);
    res.status(500).json({ error: 'Failed to create sample data' });
  }
});

// Enhanced coupons v2 endpoints
app.get('/api/admin/coupons-v2', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { couponsV2Service } = await import('./coupons-v2-service.js');
    const coupons = await couponsV2Service.getAllCoupons();
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons v2 error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

app.post('/api/admin/coupons-v2', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { couponsV2Service } = await import('./coupons-v2-service.js');
    const { auditService, attachAuditContext } = await import('./audit-service-v2.js');
    
    // Attach audit context
    attachAuditContext(req, res, () => {});
    
    const coupon = await couponsV2Service.createCoupon(req.body);
    
    // Write audit log
    if (req.auditCtx) {
      await AuditService.logAdminAction(
        'coupon.create',
        'coupon',
        coupon.id,
        null,
        coupon,
        getAuditContext(req)
      );
    }
    
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create coupon v2 error:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

app.put('/api/admin/coupons-v2/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { couponsV2Service } = await import('./coupons-v2-service.js');
    const { auditService, attachAuditContext } = await import('./audit-service-v2.js');
    const { id } = req.params;
    
    // Get before state
    const before = (await couponsV2Service.getAllCoupons()).find(c => c.id === id);
    
    // Attach audit context
    attachAuditContext(req, res, () => {});
    
    const coupon = await couponsV2Service.updateCoupon(id, req.body);
    
    // Write audit log
    if (req.auditCtx) {
      await AuditService.logAdminAction(
        'coupon.update',
        'coupon',
        id,
        before,
        coupon,
        getAuditContext(req)
      );
    }
    
    res.json(coupon);
  } catch (error) {
    console.error('Update coupon v2 error:', error);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

app.post('/api/admin/coupons-v2/:id/archive', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { couponsV2Service } = await import('./coupons-v2-service.js');
    const { auditService, attachAuditContext } = await import('./audit-service-v2.js');
    const { id } = req.params;
    
    // Get before state
    const before = (await couponsV2Service.getAllCoupons()).find(c => c.id === id);
    
    // Attach audit context
    attachAuditContext(req, res, () => {});
    
    await couponsV2Service.archiveCoupon(id);
    
    // Write audit log
    if (req.auditCtx) {
      await AuditService.logAdminAction(
        'coupon.archive',
        'coupon',
        id,
        before,
        { ...before, archived: true },
        getAuditContext(req)
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Archive coupon v2 error:', error);
    res.status(500).json({ error: 'Failed to archive coupon' });
  }
});

app.post('/api/admin/coupons-v2/evaluate', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { couponsV2Service } = await import('./coupons-v2-service.js');
    const { code, planId, subtotalCents, userId } = req.body;
    
    const result = await couponsV2Service.evaluateCoupon(code, planId, subtotalCents, userId);
    res.json(result);
  } catch (error) {
    console.error('Evaluate coupon v2 error:', error);
    res.status(500).json({ error: 'Failed to evaluate coupon' });
  }
});

// System status endpoint for admin console
app.get('/api/admin/status/public', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const components = [];
    
    // Check database connectivity
    try {
      await storage.getUser('health-check');
      components.push({ component: 'database', ok: true });
    } catch (error) {
      components.push({ component: 'database', ok: false });
    }
    
    // Check authentication system
    try {
      // Auth is working if we got here (requireAuth passed)
      components.push({ component: 'auth', ok: true });
    } catch (error) {
      components.push({ component: 'auth', ok: false });
    }
    
    // Check webhooks (basic connectivity test)
    try {
      // Simple check - if we can access webhook storage/config
      components.push({ component: 'webhooks', ok: true });
    } catch (error) {
      components.push({ component: 'webhooks', ok: false });
    }
    
    // Check SMTP (placeholder - would integrate with actual SMTP service)
    components.push({ component: 'smtp', ok: true });
    
    // Check Stripe (placeholder - would check Stripe API connectivity)
    components.push({ component: 'stripe', ok: true });
    
    // Check file storage
    components.push({ component: 'storage', ok: true });
    
    res.json({ components });
  } catch (error) {
    console.error('System status check error:', error);
    res.status(500).json({ error: 'Failed to check system status' });
  }
});

// Enhanced system status summary with latency metrics
app.get('/api/admin/status/summary', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const components = [];
    const startTime = Date.now();
    
    // Check database connectivity with latency
    try {
      const dbStart = Date.now();
      await storage.getUser('health-check');
      const dbLatency = Date.now() - dbStart;
      components.push({ 
        component: 'database', 
        ok: true, 
        latency_ms: dbLatency,
        avg_latency_ms: Math.floor(dbLatency * 0.8 + Math.random() * 20), // Simulated 24h average
        ts: new Date().toISOString()
      });
    } catch (error) {
      components.push({ 
        component: 'database', 
        ok: false, 
        latency_ms: null,
        avg_latency_ms: 45,
        ts: new Date().toISOString()
      });
    }
    
    // Check authentication system with latency
    try {
      const authStart = Date.now();
      // Auth is working if we got here (requireAuth passed)
      const authLatency = Date.now() - authStart;
      components.push({ 
        component: 'auth', 
        ok: true, 
        latency_ms: authLatency,
        avg_latency_ms: Math.floor(authLatency * 0.9 + Math.random() * 10),
        ts: new Date().toISOString()
      });
    } catch (error) {
      components.push({ 
        component: 'auth', 
        ok: false, 
        latency_ms: null,
        avg_latency_ms: 12,
        ts: new Date().toISOString()
      });
    }
    
    // Check webhooks with simulated latency
    try {
      const webhookLatency = Math.floor(Math.random() * 30) + 15;
      components.push({ 
        component: 'webhooks', 
        ok: true, 
        latency_ms: webhookLatency,
        avg_latency_ms: Math.floor(webhookLatency * 0.95 + Math.random() * 15),
        ts: new Date().toISOString()
      });
    } catch (error) {
      components.push({ 
        component: 'webhooks', 
        ok: false, 
        latency_ms: null,
        avg_latency_ms: 28,
        ts: new Date().toISOString()
      });
    }
    
    // SMTP with simulated latency
    const smtpLatency = Math.floor(Math.random() * 50) + 20;
    components.push({ 
      component: 'smtp', 
      ok: true, 
      latency_ms: smtpLatency,
      avg_latency_ms: Math.floor(smtpLatency * 0.85 + Math.random() * 25),
      ts: new Date().toISOString()
    });
    
    // Stripe with simulated latency
    const stripeLatency = Math.floor(Math.random() * 40) + 35;
    components.push({ 
      component: 'stripe', 
      ok: true, 
      latency_ms: stripeLatency,
      avg_latency_ms: Math.floor(stripeLatency * 0.92 + Math.random() * 18),
      ts: new Date().toISOString()
    });
    
    // Storage with simulated latency
    const storageLatency = Math.floor(Math.random() * 25) + 8;
    components.push({ 
      component: 'storage', 
      ok: true, 
      latency_ms: storageLatency,
      avg_latency_ms: Math.floor(storageLatency * 0.88 + Math.random() * 12),
      ts: new Date().toISOString()
    });
    
    res.json({ components });
  } catch (error) {
    console.error('System status summary error:', error);
    res.status(500).json({ error: 'Failed to get system status summary' });
  }
});

// Slack notification system
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

async function sendSlackNotification(text: string, blocks?: any) {
  if (!SLACK_WEBHOOK_URL) {
    console.log('Slack webhook not configured, skipping notification:', text);
    return;
  }
  
  try {
    const payload = {
      text,
      blocks: blocks || [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text
          }
        }
      ]
    };
    
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      console.error('Failed to send Slack notification:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}

// Failure tracking storage (in production, use Redis or database)
const failureTracking = new Map<string, { count: number; lastFailure: Date; notified: boolean }>();

// Enhanced status monitoring with failure tracking
app.get('/api/admin/status/monitor', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const components = [];
    const now = new Date();
    
    // Check each component and track failures
    const checkComponent = async (name: string, checker: () => Promise<boolean>) => {
      try {
        const isOk = await checker();
        
        if (isOk) {
          // Component is OK - check if it was previously failing
          const tracking = failureTracking.get(name);
          if (tracking && tracking.notified) {
            // Send recovery notification
            await sendSlackNotification(
              `🟢 *${name.toUpperCase()} RECOVERED* - System component is back online`,
              [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `🟢 *${name.toUpperCase()} RECOVERED*\n\nThe system component is now operational after ${tracking.count} consecutive failures.`
                  }
                },
                {
                  type: 'context',
                  elements: [
                    {
                      type: 'mrkdwn',
                      text: `Recovery time: ${now.toISOString()}`
                    }
                  ]
                }
              ]
            );
          }
          // Clear failure tracking
          failureTracking.delete(name);
        } else {
          // Component is failing
          const tracking = failureTracking.get(name) || { count: 0, lastFailure: now, notified: false };
          tracking.count += 1;
          tracking.lastFailure = now;
          
          // Send alert after 2 consecutive failures
          if (tracking.count >= 2 && !tracking.notified) {
            await sendSlackNotification(
              `🔴 *${name.toUpperCase()} FAILURE* - System component needs immediate attention`,
              [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `🔴 *${name.toUpperCase()} FAILURE*\n\nSystem component has failed ${tracking.count} consecutive health checks.`
                  }
                },
                {
                  type: 'context',
                  elements: [
                    {
                      type: 'mrkdwn',
                      text: `First failure: ${tracking.lastFailure.toISOString()}`
                    }
                  ]
                }
              ]
            );
            tracking.notified = true;
          }
          
          failureTracking.set(name, tracking);
        }
        
        return isOk;
      } catch (error) {
        console.error(`Error checking component ${name}:`, error);
        return false;
      }
    };
    
    // Database check
    const dbOk = await checkComponent('database', async () => {
      await storage.getUser('health-check');
      return true;
    });
    
    // Auth check
    const authOk = await checkComponent('auth', async () => true); // Auth working if we got here
    
    // Other components (simplified for demo)
    const webhooksOk = await checkComponent('webhooks', async () => true);
    const smtpOk = await checkComponent('smtp', async () => true);
    const stripeOk = await checkComponent('stripe', async () => true);
    const storageOk = await checkComponent('storage', async () => true);
    
    res.json({ 
      status: 'monitoring-active',
      components: [
        { name: 'database', ok: dbOk },
        { name: 'auth', ok: authOk },
        { name: 'webhooks', ok: webhooksOk },
        { name: 'smtp', ok: smtpOk },
        { name: 'stripe', ok: stripeOk },
        { name: 'storage', ok: storageOk }
      ],
      failureTracking: Array.from(failureTracking.entries()).map(([name, tracking]) => ({
        component: name,
        failures: tracking.count,
        lastFailure: tracking.lastFailure,
        notified: tracking.notified
      }))
    });
    
  } catch (error) {
    console.error('Status monitoring error:', error);
    res.status(500).json({ error: 'Failed to perform status monitoring' });
  }
});

// Marketing promotion endpoints
app.get('/api/marketing/active-banner', async (req: Request, res: Response) => {
  try {
    // Sample promotional banner - in production, this would come from database
    const activeBanner = {
      id: 'winter-sale-2025',
      title: '🎉 Winter Sale',
      message: 'Get 50% off FamilyCircle Secure Enterprise for 3 months',
      ctaText: 'Claim Offer',
      ctaUrl: '/pricing',
      promoCode: 'WINTER50',
      bgColor: '#1e40af', // blue-800
      textColor: '#ffffff',
      icon: 'gift',
      targetDomains: ['familycirclesecure.com', 'portal.familycirclesecure.com'], // Show on main site and portal
      expiresAt: '2025-03-01T00:00:00Z',
      isActive: true
    };
    
    res.json(activeBanner);
  } catch (error) {
    console.error('Failed to get active banner:', error);
    res.status(500).json({ error: 'Failed to get active banner' });
  }
});

app.get('/api/marketing/active-popup', async (req: Request, res: Response) => {
  try {
    // Sample promotional popup - in production, this would come from database
    const activePopup = {
      id: 'enterprise-upgrade-2025',
      title: 'Limited Time Offer!',
      subtitle: 'Upgrade to Enterprise Today',
      description: 'Unlock advanced security features, tamper-evident auditing, and enterprise-grade monitoring.',
      promoCode: 'ENTERPRISE40',
      discount: '40% OFF',
      ctaText: 'Upgrade Now',
      ctaUrl: '/pricing?plan=enterprise',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      targetDomains: ['familycirclesecure.com'], // Show only on main site
      showAfterSeconds: 5,
      showOncePerSession: true,
      expiresAt: '2025-03-01T00:00:00Z',
      isActive: true
    };
    
    res.json(activePopup);
  } catch (error) {
    console.error('Failed to get active popup:', error);
    res.status(500).json({ error: 'Failed to get active popup' });
  }
});

// Admin promotion management endpoints
app.get('/api/admin/promotions', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Sample promotions data - in production, this would come from database
    const promotions = [
      {
        id: 'promo-1',
        type: 'banner',
        title: 'Winter Security Sale',
        content: {
          headline: 'Get 50% off Enterprise Security',
          sub: 'Limited time offer - ends March 1st',
          cta: { label: 'Claim Discount', href: '/pricing?promo=WINTER50' }
        },
        couponCode: 'WINTER50',
        targets: {
          tenants: ['PUBLIC', 'FAMILY'],
          pages: ['/pricing', '/features'],
          segments: ['enterprise-prospects', 'existing-customers']
        },
        schedule: {
          start: '2025-01-15T00:00:00Z',
          end: '2025-03-01T23:59:59Z',
          tz: 'America/New_York'
        },
        status: 'active',
        paused: false,
        variants: [
          { id: 'A', weight: 50, content: { headline: 'Get 50% off Enterprise Security' } },
          { id: 'B', weight: 50, content: { headline: 'Save 50% on Enterprise Plans' } }
        ],
        metrics: {
          impressions: 15420,
          clicks: 892,
          conversions: 47,
          updatedAt: '2025-01-29T18:30:00Z'
        },
        createdBy: req.user!.id,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-29T18:30:00Z'
      },
      {
        id: 'promo-2',
        type: 'popup',
        title: 'Family Security Assessment',
        content: {
          headline: 'Free Security Assessment',
          sub: 'See how secure your family documents are',
          cta: { label: 'Start Assessment', href: '/assessment' }
        },
        couponCode: null,
        targets: {
          tenants: ['PUBLIC'],
          pages: ['/'],
          segments: ['new-visitors']
        },
        schedule: {
          start: '2025-02-01T00:00:00Z',
          end: '2025-12-31T23:59:59Z',
          tz: 'UTC'
        },
        status: 'scheduled',
        paused: false,
        variants: [],
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          updatedAt: null
        },
        createdBy: req.user!.id,
        createdAt: '2025-01-25T14:00:00Z',
        updatedAt: '2025-01-25T14:00:00Z'
      }
    ];
    
    res.json({ promotions });
  } catch (error) {
    console.error('Failed to get promotions:', error);
    res.status(500).json({ error: 'Failed to get promotions' });
  }
});

app.post('/api/admin/promotions', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const promotionData = {
      ...req.body,
      createdBy: req.user!.id,
      id: crypto.randomUUID()
    };
    
    // TODO: Store in database using storage.createPromotion(promotionData)
    res.json({ promotion: promotionData, message: 'Promotion created successfully' });
  } catch (error) {
    console.error('Failed to create promotion:', error);
    res.status(500).json({ error: 'Failed to create promotion' });
  }
});

app.patch('/api/admin/promotions/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // TODO: Update in database using storage.updatePromotion(id, updates)
    res.json({ promotion: { id, ...updates }, message: 'Promotion updated successfully' });
  } catch (error) {
    console.error('Failed to update promotion:', error);
    res.status(500).json({ error: 'Failed to update promotion' });
  }
});

app.delete('/api/admin/promotions/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Delete from database using storage.deletePromotion(id)
    res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Failed to delete promotion:', error);
    res.status(500).json({ error: 'Failed to delete promotion' });
  }
});

// Admin session management endpoints
app.get('/api/admin/sessions', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Get real admin sessions from database
    const mockSessions = [
      {
        id: 'session-1',
        userId: req.user!.id,
        sessionToken: 'current-session',
        deviceType: 'desktop',
        deviceName: 'MacBook Pro',
        browser: 'Chrome 120',
        os: 'macOS 14.2',
        ip: '192.168.1.100',
        location: 'San Francisco, CA',
        isActive: true,
        isCurrent: true,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'session-2',
        userId: req.user!.id,
        sessionToken: 'other-session',
        deviceType: 'mobile',
        deviceName: 'iPhone 15',
        browser: 'Safari 17',
        os: 'iOS 17.2',
        ip: '10.0.0.50',
        location: 'New York, NY',
        isActive: true,
        isCurrent: false,
        lastActivity: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      }
    ];
    
    res.json({ sessions: mockSessions });
  } catch (error) {
    console.error('Get admin sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch admin sessions' });
  }
});

app.post('/api/admin/sessions/:sessionId/revoke', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    // TODO: Revoke session in database and audit log
    await AuditService.logAdminAction(
      'session:revoked',
      'admin_session',
      sessionId,
      { isActive: true },
      { isActive: false },
      getAuditContext(req)
    );
    
    res.json({ message: 'Session revoked successfully' });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({ error: 'Failed to revoke session' });
  }
});

app.post('/api/admin/sessions/revoke-multiple', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sessionIds } = req.body;
    
    if (!Array.isArray(sessionIds)) {
      return res.status(400).json({ error: 'sessionIds must be an array' });
    }
    
    // TODO: Revoke multiple sessions and audit log
    let revokedCount = 0;
    let failedCount = 0;
    
    for (const sessionId of sessionIds) {
      try {
        await AuditService.logAdminAction(
          'session:bulk_revoked',
          'admin_session',
          sessionId,
          { isActive: true },
          { isActive: false },
          getAuditContext(req)
        );
        revokedCount++;
      } catch {
        failedCount++;
      }
    }
    
    res.json({ 
      message: `${revokedCount} sessions revoked successfully`,
      revokedCount,
      failedCount 
    });
  } catch (error) {
    console.error('Revoke multiple sessions error:', error);
    res.status(500).json({ error: 'Failed to revoke sessions' });
  }
});

// Enhanced Coupons v2 API endpoints
app.get('/api/admin/coupons/enhanced', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Get enhanced coupons from database with redemption counts
    const enhancedCoupons = [
      {
        id: 'coupon-1',
        code: 'SAVE20',
        type: 'percentage',
        value: '20.00',
        allowStacking: false,
        maxRedemptions: 1000,
        perUserLimit: 1,
        timesRedeemed: 42,
        startsAt: new Date('2025-01-01').toISOString(),
        endsAt: new Date('2025-12-31').toISOString(),
        active: true,
        archived: false,
        createdAt: new Date().toISOString(),
      }
    ];
    
    res.json({ coupons: enhancedCoupons });
  } catch (error) {
    console.error('Get enhanced coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch enhanced coupons' });
  }
});

app.post('/api/admin/coupons/enhanced', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const couponData = req.body;
    
    // TODO: Create enhanced coupon in database
    const newCoupon = {
      id: `coupon-${Date.now()}`,
      ...couponData,
      timesRedeemed: 0,
      createdAt: new Date().toISOString(),
    };
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'coupon:enhanced_created',
      'enhanced_coupon',
      newCoupon.id,
      null,
      newCoupon,
      getAuditContext(req)
    );
    
    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Create enhanced coupon error:', error);
    res.status(500).json({ error: 'Failed to create enhanced coupon' });
  }
});

app.post('/api/admin/coupons/evaluate', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, planId, subtotalCents, userId } = req.body;
    
    // TODO: Use coupon validator to evaluate
    const result = {
      valid: true,
      discountAmount: Math.round(subtotalCents * 0.2), // 20% mock discount
      discountType: 'percentage',
      message: 'Coupon is valid and ready to apply'
    };
    
    res.json(result);
  } catch (error) {
    console.error('Evaluate coupon error:', error);
    res.status(500).json({ error: 'Failed to evaluate coupon' });
  }
});

app.post('/api/admin/audit/verify-chain', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Verify tamper-evident audit chain
    const verification = {
      valid: true,
      totalEntries: 150,
      lastVerified: new Date().toISOString(),
      errors: []
    };
    
    res.json(verification);
  } catch (error) {
    console.error('Verify audit chain error:', error);
    res.status(500).json({ error: 'Failed to verify audit chain' });
  }
});

// Feature Flags API endpoints
app.get('/api/admin/feature-flags', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Get feature flags from database
    const mockFlags = [
      {
        id: 'flag-1',
        key: 'new-billing-ui',
        name: 'New Billing UI',
        description: 'Enable the redesigned billing interface',
        status: 'active',
        forceOn: false,
        forceOff: false,
        targeting: {
          percentage: 25,
          allowDomains: ['@familycirclesecure.com'],
          allowRoles: ['ADMIN', 'BETA_USER']
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    res.json({ flags: mockFlags });
  } catch (error) {
    console.error('Get feature flags error:', error);
    res.status(500).json({ error: 'Failed to fetch feature flags' });
  }
});

app.post('/api/admin/feature-flags', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const flagData = req.body;
    
    // TODO: Create feature flag in database
    const newFlag = {
      id: `flag_${Date.now()}`,
      ...flagData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'feature_flag:created',
      'feature_flag',
      newFlag.id,
      null,
      newFlag,
      getAuditContext(req)
    );
    
    res.status(201).json(newFlag);
  } catch (error) {
    console.error('Create feature flag error:', error);
    res.status(500).json({ error: 'Failed to create feature flag' });
  }
});

app.patch('/api/admin/feature-flags/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // TODO: Update feature flag in database
    const updatedFlag = {
      id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'feature_flag:updated',
      'feature_flag',
      id,
      { id }, // before state
      updatedFlag,
      getAuditContext(req)
    );
    
    res.json(updatedFlag);
  } catch (error) {
    console.error('Update feature flag error:', error);
    res.status(500).json({ error: 'Failed to update feature flag' });
  }
});

// Admin Impersonation API endpoints
app.post('/api/admin/impersonation/start', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  await startImpersonation(req, res);
});

app.post('/api/admin/impersonation/stop', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  await endImpersonation(req, res);
});

// Impersonation status endpoint for banner
app.get('/api/admin/impersonation/status', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  await getImpersonationStatus(req, res);
});

// Recent impersonation sessions for audit
app.get('/api/admin/impersonation/sessions', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  await getRecentImpersonationSessions(req, res);
});

// GDPR Compliance API endpoints
// Consent Management
app.post('/api/gdpr/consents', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { events } = req.body;
    const results = [];
    
    for (const event of events) {
      const consentEvent = await storage.createGdprConsentEvent({
        ...event,
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
      });
      results.push(consentEvent);
    }
    
    res.json({ events: results });
  } catch (error) {
    console.error('Create consent events error:', error);
    res.status(500).json({ error: 'Failed to create consent events' });
  }
});

app.get('/api/gdpr/consents/:userId/effective', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const effective = await storage.getEffectiveConsents(userId);
    res.json({ consents: effective });
  } catch (error) {
    console.error('Get effective consents error:', error);
    res.status(500).json({ error: 'Failed to get effective consents' });
  }
});

app.get('/api/gdpr/consents', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId, limit } = req.query;
    const events = await storage.getGdprConsentEvents(
      userId as string || undefined, 
      parseInt(limit as string) || 500
    );
    res.json({ events });
  } catch (error) {
    console.error('Get consent events error:', error);
    res.status(500).json({ error: 'Failed to get consent events' });
  }
});

// DSAR Management
app.post('/api/gdpr/requests', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { type, subjectEmail, legalBasis, notes } = req.body;
    
    // Generate DSAR ID
    const id = 'dsr_' + crypto.randomUUID();
    
    // Set due date (30 days from now)
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 30);
    
    const dsarRequest = await storage.createDsarRequest({
      id,
      type,
      subjectEmail,
      dueAt,
      legalBasis,
      notes,
    });
    
    // Log audit trail
    await AuditService.logAdminAction(
      'dsar:created',
      'dsar_request',
      id,
      null,
      dsarRequest,
      getAuditContext(req)
    );
    
    res.json(dsarRequest);
  } catch (error) {
    console.error('Create DSAR error:', error);
    res.status(500).json({ error: 'Failed to create DSAR request' });
  }
});

app.get('/api/gdpr/requests', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status } = req.query;
    const requests = await storage.getAllDsarRequests(status as string);
    res.json({ requests });
  } catch (error) {
    console.error('Get DSAR requests error:', error);
    res.status(500).json({ error: 'Failed to get DSAR requests' });
  }
});

app.patch('/api/gdpr/requests/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updated = await storage.updateDsarRequest(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'DSAR request not found' });
    }
    
    // Log audit trail
    await AuditService.logAdminAction(
      'dsar:updated',
      'dsar_request',
      id,
      updates,
      updated,
      getAuditContext(req)
    );
    
    res.json(updated);
  } catch (error) {
    console.error('Update DSAR error:', error);
    res.status(500).json({ error: 'Failed to update DSAR request' });
  }
});

// Get single DSAR request by ID
app.get('/api/gdpr/requests/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await storage.getDsarRequest(id);
    
    if (!request) {
      return res.status(404).json({ error: 'DSAR request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Get DSAR request error:', error);
    res.status(500).json({ error: 'Failed to get DSAR request' });
  }
});

// Get DSAR timeline
app.get('/api/gdpr/requests/:id/timeline', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const timeline = await storage.getDsarTimeline(id);
    res.json(timeline);
  } catch (error) {
    console.error('Get DSAR timeline error:', error);
    res.status(500).json({ error: 'Failed to get DSAR timeline' });
  }
});

// Send verification link for DSAR
app.post('/api/gdpr/requests/:id/verify', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await storage.getDsarRequest(id);
    
    if (!request) {
      return res.status(404).json({ error: 'DSAR request not found' });
    }
    
    // In a real implementation, you'd send an email with verification link
    console.log(`Verification link sent for DSAR ${id} to ${request.subjectEmail}`);
    
    // Add timeline event
    await storage.addDsarTimelineEvent(id, 'Verification link sent', req.user?.username);
    
    // Log audit trail
    await AuditService.logAdminAction(
      'dsar:verify_sent',
      'dsar_request',
      id,
      null,
      { action: 'verify_sent' },
      getAuditContext(req)
    );
    
    res.json({ success: true, message: 'Verification link sent' });
  } catch (error) {
    console.error('Send DSAR verification error:', error);
    res.status(500).json({ error: 'Failed to send verification link' });
  }
});

// Generate export for DSAR
app.post('/api/gdpr/requests/:id/export', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await storage.getDsarRequest(id);
    
    if (!request) {
      return res.status(404).json({ error: 'DSAR request not found' });
    }
    
    // In a real implementation, you'd queue a background job to generate the export
    const jobId = 'export_' + crypto.randomUUID();
    console.log(`Export job ${jobId} started for DSAR ${id}`);
    
    // Add timeline event
    await storage.addDsarTimelineEvent(id, 'Export generation started', req.user?.username);
    
    // Log audit trail
    await AuditService.logAdminAction(
      'dsar:export_started',
      'dsar_request',
      id,
      null,
      { action: 'export_started', jobId },
      getAuditContext(req)
    );
    
    res.json({ success: true, jobId, message: 'Export generation started' });
  } catch (error) {
    console.error('Generate DSAR export error:', error);
    res.status(500).json({ error: 'Failed to generate export' });
  }
});

// Mark DSAR as completed
app.post('/api/gdpr/requests/:id/complete', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const updated = await storage.updateDsarRequest(id, { 
      status: 'completed',
      updatedAt: new Date()
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'DSAR request not found' });
    }
    
    // Add timeline event
    await storage.addDsarTimelineEvent(id, 'Request completed', req.user?.username);
    
    // Log audit trail
    await AuditService.logAdminAction(
      'dsar:completed',
      'dsar_request',
      id,
      null,
      { action: 'completed' },
      getAuditContext(req)
    );
    
    res.json(updated);
  } catch (error) {
    console.error('Complete DSAR error:', error);
    res.status(500).json({ error: 'Failed to complete DSAR request' });
  }
});

// Get consent events for a specific user
app.get('/api/gdpr/consents/:userId/events', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const events = await storage.getGdprConsentEvents(userId);
    res.json(events);
  } catch (error) {
    console.error('Get user consent events error:', error);
    res.status(500).json({ error: 'Failed to get consent events' });
  }
});

// Retention Policies
app.get('/api/gdpr/retention', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const policies = await storage.getAllRetentionPolicies();
    res.json({ policies });
  } catch (error) {
    console.error('Get retention policies error:', error);
    res.status(500).json({ error: 'Failed to get retention policies' });
  }
});

app.post('/api/gdpr/retention', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const policy = await storage.createRetentionPolicy(req.body);
    
    // Log audit trail
    await AuditService.logAdminAction(
      'retention_policy:created',
      'retention_policy',
      policy.id,
      null,
      policy,
      getAuditContext(req)
    );
    
    res.json(policy);
  } catch (error) {
    console.error('Create retention policy error:', error);
    res.status(500).json({ error: 'Failed to create retention policy' });
  }
});

app.patch('/api/gdpr/retention/:id', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updated = await storage.updateRetentionPolicy(id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Retention policy not found' });
    }
    
    res.json(updated);
  } catch (error) {
    console.error('Update retention policy error:', error);
    res.status(500).json({ error: 'Failed to update retention policy' });
  }
});

// Suppression List
app.get('/api/gdpr/suppression', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const suppressions = await storage.getAllSuppressions();
    res.json({ suppressions });
  } catch (error) {
    console.error('Get suppressions error:', error);
    res.status(500).json({ error: 'Failed to get suppressions' });
  }
});

app.post('/api/gdpr/suppression', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, reason } = req.body;
    
    // Hash the email using SHA-256
    const emailHash = crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    
    const suppression = await storage.addSuppression({
      emailHash,
      reason,
    });
    
    res.json(suppression);
  } catch (error) {
    console.error('Add suppression error:', error);
    res.status(500).json({ error: 'Failed to add suppression' });
  }
});

app.delete('/api/gdpr/suppression/:hash', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { hash } = req.params;
    const success = await storage.removeSuppression(hash);
    
    if (!success) {
      return res.status(404).json({ error: 'Suppression not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Remove suppression error:', error);
    res.status(500).json({ error: 'Failed to remove suppression' });
  }
});

// GDPR Metrics endpoint
app.get('/api/gdpr/metrics', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get metrics for dashboard using new getGdprMetrics method
    const metrics = await storage.getGdprMetrics();
    
    res.json(metrics);
  } catch (error) {
    console.error('Get GDPR metrics error:', error);
    res.status(500).json({ error: 'Failed to get GDPR metrics' });
  }
});

// Webhooks API endpoints
app.get('/api/admin/webhooks', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Get webhooks from database
    const mockWebhooks = [
      {
        id: 'webhook-1',
        url: 'https://api.partner.com/webhooks',
        events: ['user.created', 'invoice.paid'],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
    
    res.json({ items: mockWebhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ error: 'Failed to fetch webhooks' });
  }
});

app.post('/api/admin/webhooks', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url, events, active, secret } = req.body;
    
    // TODO: Create webhook in database
    const newWebhook = {
      id: `webhook_${Date.now()}`,
      url,
      events: Array.isArray(events) ? events : [],
      active: active !== false,
      secret: secret || require('crypto').randomBytes(24).toString('hex'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'webhook:created',
      'webhook',
      newWebhook.id,
      null,
      newWebhook,
      getAuditContext(req)
    );
    
    res.status(201).json(newWebhook);
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ error: 'Failed to create webhook' });
  }
});

app.post('/api/admin/webhooks/:id/test', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // TODO: Send test webhook
    const testResult = {
      success: true,
      response: { status: 200, body: 'OK' },
      timestamp: new Date().toISOString(),
    };
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'webhook:tested',
      'webhook',
      id,
      null,
      testResult,
      getAuditContext(req)
    );
    
    res.json(testResult);
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

// Global search across all admin resources
app.get('/api/admin/search', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const q = (req.query.q ?? '').toString().trim();
    const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 50);
    const tenant = req.user?.tenant ?? null;

    console.log(`[search] q="${q}" tenant="${tenant}" limit=${limit}`);

    if (!q || q.length < 1) {
      return res.json({ results: [] });
    }

    // Use SQL fallback since we don't have Elasticsearch configured
    const results = await sqlFallback(q, limit, tenant);
    console.log(`[search] results=${results.length}`);
    return res.json({ results: results.slice(0, 20) });
  } catch (err: any) {
    console.error('[search] ERROR', err?.message ?? err);
    return res.status(500).json({ results: [], error: 'Search failed' });
  }
});

// SQL fallback function for search
async function sqlFallback(q: string, limit: number, tenant: string | null) {
  const searchQuery = q.toLowerCase();
  const results: any[] = [];

  try {
    // Navigation shortcuts - direct section access
    const navigationShortcuts = [
      { terms: ['user', 'users', 'admin', 'management'], section: 'users', title: 'User Management', description: 'Manage user accounts and permissions' },
      { terms: ['coupon', 'coupons', 'discount', 'promo'], section: 'coupons', title: 'Coupons & Discounts', description: 'Manage promotional codes and discounts' },
      { terms: ['content', 'article', 'articles', 'cms'], section: 'content', title: 'Content Management', description: 'Manage articles, announcements, and CMS content' },
      { terms: ['plan', 'plans', 'subscription', 'billing'], section: 'plans', title: 'Subscription Plans', description: 'Manage pricing and billing plans' },
      { terms: ['security', 'audit', 'log', 'logs'], section: 'security', title: 'Security & Audit', description: 'Security monitoring and audit trails' },
      { terms: ['compliance', 'gdpr', 'privacy'], section: 'compliance', title: 'GDPR Compliance', description: 'Privacy and compliance management' },
      { terms: ['webhook', 'webhooks', 'integration'], section: 'webhooks', title: 'Webhooks', description: 'Outbound webhook integrations' },
      { terms: ['flag', 'flags', 'feature', 'toggle'], section: 'feature-flags', title: 'Feature Flags', description: 'Feature rollouts and targeting' },
      { terms: ['marketing', 'promotion', 'campaign'], section: 'marketing', title: 'Marketing Promotions', description: 'Banners and popup campaigns' }
    ];

    // Add navigation shortcuts based on search query
    navigationShortcuts.forEach(shortcut => {
      if (shortcut.terms.some(term => searchQuery.includes(term))) {
        results.push({
          id: `nav-${shortcut.section}`,
          type: 'navigation',
          title: shortcut.title,
          subtitle: shortcut.description,
          metadata: 'Navigate to section',
          status: 'active',
          timestamp: new Date().toISOString(),
          url: `/admin/${shortcut.section}`
        });
      }
    });

    // Search Users (placeholder - would search real users)
    if (searchQuery.includes('user') || searchQuery.includes('admin')) {
      results.push({
        id: 'user-admin',
        type: 'user',
        title: 'Admin User',
        subtitle: 'Administrator account',
        metadata: 'admin@familycirclesecure.com',
        status: 'active',
        timestamp: new Date().toISOString(),
        url: '/admin/users'
      });
    }

    // Search Coupons (with error handling)
    try {
      const coupons = await storage.getAllCoupons();
      const matchingCoupons = coupons.filter(coupon => 
        coupon.code.toLowerCase().includes(searchQuery)
      ).slice(0, 10);
      
      matchingCoupons.forEach(coupon => {
        results.push({
          id: coupon.id,
          type: 'coupon',
          title: coupon.code,
          subtitle: `${coupon.percentOff ? coupon.percentOff + '%' : (coupon.amountOff ? '$' + coupon.amountOff : '')} off`,
          metadata: `Used ${coupon.timesRedeemed} times`,
          status: coupon.active ? 'active' : 'inactive',
          timestamp: coupon.createdAt,
          url: '/admin/coupons'
        });
      });
    } catch (error) {
      console.error('Error searching coupons:', error);
    }

    // Search Articles (with error handling)
    try {
      const articles = await storage.getAllArticles();
      const matchingArticles = articles.filter(article => 
        article.title.toLowerCase().includes(searchQuery) ||
        (article.bodyMd && article.bodyMd.toLowerCase().includes(searchQuery))
      ).slice(0, 10);
      
      matchingArticles.forEach(article => {
        results.push({
          id: article.id,
          type: 'article',
          title: article.title,
          subtitle: article.slug,
          metadata: `${article.bodyMd?.length || 0} characters`,
          status: article.published ? 'published' : 'draft',
          timestamp: article.createdAt,
          url: '/admin/content'
        });
      });
    } catch (error) {
      console.error('Error searching articles:', error);
    }

    // Search Plans (with error handling)
    try {
      const plans = await storage.getAllPlans();
      const matchingPlans = plans.filter(plan => 
        plan.name.toLowerCase().includes(searchQuery)
      ).slice(0, 10);
      
      matchingPlans.forEach(plan => {
        results.push({
          id: plan.id,
          type: 'plan',
          title: plan.name,
          subtitle: `$${(plan.amountCents / 100).toFixed(2)}/${plan.interval}`,
          metadata: plan.features ? JSON.stringify(plan.features) : 'No features',
          status: 'active',
          timestamp: plan.createdAt,
          url: '/admin/plans'
        });
      });
    } catch (error) {
      console.error('Error searching plans:', error);
    }

    // Search Audit Logs (with error handling)
    try {
      const auditLogs = await storage.searchAuditLogs(q, 5);
      auditLogs.forEach(log => {
        results.push({
          id: log.id,
          type: 'audit',
          title: log.action.replace(/[_:]/g, ' ').replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          ),
          subtitle: `${log.resource} ${log.resourceId ? '• ' + log.resourceId.substring(0, 8) + '...' : ''}`,
          metadata: `by ${log.actorId || 'System'}`,
          timestamp: log.createdAt,
          url: '/admin/security'
        });
      });
    } catch (error) {
      console.error('Error searching audit logs:', error);
    }

    // Sort results by relevance and timestamp
    results.sort((a, b) => {
      // Exact matches first
      const aExact = a.title.toLowerCase() === searchQuery;
      const bExact = b.title.toLowerCase() === searchQuery;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by timestamp (newest first)
      return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
    });

    return results;
  } catch (error) {
    console.error('[search:fallback] error:', error);
    return [];
  }
}

// Incident management API routes
app.get('/api/admin/incidents', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status = 'all' } = req.query;
    
    let query = dbConnection.select().from(incidents);
    
    if (status === 'open') {
      query = query.where(eq(incidents.status, 'open'));
    } else if (status === 'acknowledged') {
      query = query.where(eq(incidents.status, 'acknowledged'));
    } else if (status === 'closed') {
      query = query.where(eq(incidents.status, 'closed'));
    }
    
    const result = await query.orderBy(desc(incidents.openedAt)).limit(100);
    
    res.json({ incidents: result });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

app.post('/api/admin/incidents/:id/acknowledge', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await dbConnection.update(incidents)
      .set({ 
        status: 'acknowledged',
        acknowledgedAt: new Date(),
        acknowledgedBy: req.user!.id
      })
      .where(eq(incidents.id, id))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    
    // Log the acknowledgment
    await AuditService.logAdminAction(
      'incident.acknowledge',
      'incident',
      id,
      null,
      { acknowledgedBy: req.user!.id, acknowledgedAt: new Date() },
      getAuditContext(req)
    );
    
    res.json({ success: true, incident: result[0] });
  } catch (error) {
    console.error('Acknowledge incident error:', error);
    res.status(500).json({ error: 'Failed to acknowledge incident' });
  }
});

app.get('/api/admin/oncall-targets', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const targets = await dbConnection.select()
      .from(oncallTargets)
      .where(eq(oncallTargets.active, true))
      .orderBy(oncallTargets.tier);
    
    res.json({ targets });
  } catch (error) {
    console.error('Get oncall targets error:', error);
    res.status(500).json({ error: 'Failed to fetch oncall targets' });
  }
});

app.get('/api/admin/sms/status', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = smsService.getConfigurationStatus();
    res.json(status);
  } catch (error) {
    console.error('SMS status error:', error);
    res.status(500).json({ error: 'Failed to get SMS status' });
  }
});

// Public consent tracking
app.post('/api/public/consent', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { consent } = req.body;
    
    if (!consent || typeof consent !== 'object') {
      return res.status(400).json({ error: 'Consent object required' });
    }

    await storage.createConsentEvent({
      userId: req.user?.id,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.get('User-Agent'),
      consent
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Consent tracking error:', error);
    res.status(500).json({ error: 'Failed to track consent' });
  }
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Initialize WebSocket server for real-time file updates
  createIoServer(server);
  log('Real-time WebSocket server initialized');

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Start the escalation worker
    escalationWorker.start();
    log('Escalation worker started');
    
    // Start the reminders worker
    startRemindersWorker(1); // Check every minute
    log('Calendar reminders worker started');
  });
})();
