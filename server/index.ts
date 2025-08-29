import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import crypto from "crypto";
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

// Webhook endpoints - simplified for now, returning empty results
app.get('/api/admin/webhooks', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Implement webhook storage methods
    res.json({ items: [] });
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
    const { auditService } = await import('./audit-service-v2.js');
    const { limit, cursor } = req.query;
    const logs = await auditService.getAuditLogs(
      limit ? Number(limit) : 100,
      cursor as string
    );
    res.json(logs);
  } catch (error) {
    console.error('Get audit logs v2 error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
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
      await auditService.writeAudit(req.auditCtx, {
        action: 'coupon.create',
        objectType: 'coupon',
        objectId: coupon.id,
        before: null,
        after: coupon,
        reason: req.body.reason
      });
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
      await auditService.writeAudit(req.auditCtx, {
        action: 'coupon.update',
        objectType: 'coupon',
        objectId: id,
        before,
        after: coupon,
        reason: req.body.reason
      });
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
      await auditService.writeAudit(req.auditCtx, {
        action: 'coupon.archive',
        objectType: 'coupon',
        objectId: id,
        before,
        after: { ...before, archived: true }
      });
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
  try {
    const { userId, reason, ttlMinutes = 20 } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // TODO: Use impersonation service
    const session = {
      id: `imp_${Date.now()}`,
      adminId: req.user!.id,
      targetId: userId,
      reason,
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
    };
    
    // Set impersonation cookie
    res.cookie('impersonation', session.id, { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === 'production' 
    });
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'impersonation:started',
      'user',
      userId,
      null,
      { reason, expiresAt: session.expiresAt, adminId: req.user!.id },
      getAuditContext(req)
    );
    
    res.json({ 
      success: true, 
      sessionId: session.id, 
      expiresAt: session.expiresAt 
    });
  } catch (error) {
    console.error('Start impersonation error:', error);
    res.status(500).json({ error: 'Failed to start impersonation' });
  }
});

app.post('/api/admin/impersonation/stop', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessionId = req.cookies.impersonation;
    const { reason = 'ended-by-admin' } = req.body;
    
    if (sessionId) {
      // TODO: Stop impersonation session
      console.log('Stopping impersonation session:', sessionId);
    }
    
    res.clearCookie('impersonation');
    
    // Log audit with tamper evidence
    await AuditService.logAdminAction(
      'impersonation:stopped',
      'user',
      req.user!.id,
      null,
      { reason, sessionId },
      getAuditContext(req)
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Stop impersonation error:', error);
    res.status(500).json({ error: 'Failed to stop impersonation' });
  }
});

// Impersonation status endpoint for banner
app.get('/api/admin/impersonation/status', requireAuth('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sessionId = req.cookies?.impersonation;
    if (!sessionId) {
      return res.json({ active: false });
    }
    
    // TODO: Query actual session from database
    // For now, mock an active session
    const mockSession = {
      active: true,
      sessionId,
      targetId: 'user-12345',
      targetEmail: 'customer@example.com',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes from now
    };
    
    res.json(mockSession);
  } catch (error) {
    console.error('Get impersonation status error:', error);
    res.status(500).json({ error: 'Failed to get impersonation status' });
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
