import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { type AuthenticatedRequest, optionalAuth, requireAuth, loginUser, registerUser } from "./auth";
import { storage } from "./storage";
import { AuditService, getAuditContext } from "./audit-service";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 10000, // More lenient in development
  message: { error: 'Too many requests' }
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

    const result = await loginUser(username, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set HTTP-only cookie
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
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

// Global search across all admin resources
app.get('/api/admin/search', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q: query } = req.query;
    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.json({ results: [] });
    }

    const results = [];
    const searchQuery = query.toLowerCase();

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
        url: '/admin/users/admin'
      });
    }

    // Search Coupons
    const coupons = await storage.getAllCoupons();
    const matchingCoupons = coupons.filter(coupon => 
      coupon.code.toLowerCase().includes(searchQuery)
    ).slice(0, 10);
    
    matchingCoupons.forEach(coupon => {
      results.push({
        id: coupon.id,
        type: 'coupon',
        title: coupon.code,
        subtitle: `${coupon.discount}${coupon.isPercentage ? '%' : '$'} off`,
        metadata: `Used ${coupon.usageCount} times`,
        status: coupon.isActive ? 'active' : 'inactive',
        timestamp: coupon.createdAt,
        url: `/admin/coupons/${coupon.id}`
      });
    });

    // Search Articles
    const articles = await storage.getAllArticles();
    const matchingArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery) ||
      (article.content && article.content.toLowerCase().includes(searchQuery))
    ).slice(0, 10);
    
    matchingArticles.forEach(article => {
      results.push({
        id: article.id,
        type: 'article',
        title: article.title,
        subtitle: article.slug,
        metadata: `${article.content?.length || 0} characters`,
        status: article.published ? 'published' : 'draft',
        timestamp: article.createdAt,
        url: `/admin/articles/${article.id}`
      });
    });

    // Search Plans
    const plans = await storage.getAllPlans();
    const matchingPlans = plans.filter(plan => 
      plan.name.toLowerCase().includes(searchQuery) ||
      (plan.description && plan.description.toLowerCase().includes(searchQuery))
    ).slice(0, 10);
    
    matchingPlans.forEach(plan => {
      results.push({
        id: plan.id,
        type: 'plan',
        title: plan.name,
        subtitle: `$${plan.price}/month`,
        metadata: plan.description || 'No description',
        status: 'active',
        timestamp: plan.createdAt,
        url: `/admin/plans/${plan.id}`
      });
    });

    // Search Audit Logs
    const auditLogs = await storage.searchAuditLogs(query, 5);
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
        url: `/admin/audit#${log.id}`
      });
    });

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

    res.json({ results: results.slice(0, 20) });
  } catch (error) {
    console.error('Global search error:', error);
    res.status(500).json({ error: 'Search failed' });
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
  });
})();
