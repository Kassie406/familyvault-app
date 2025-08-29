import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { type AuthenticatedRequest, optionalAuth, requireAuth, loginUser, registerUser } from "./auth";
import { storage } from "./storage";

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
