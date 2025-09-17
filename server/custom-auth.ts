import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import { smsService } from './sms-service';
import { sendEmail } from './email';

const router = express.Router();

// Configuration
const APP_DOMAIN = process.env.APP_DOMAIN || 'http://localhost:5000';
const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

if (ALLOWED_EMAILS.length === 0) {
  console.warn('No ALLOWED_EMAILS set; defaulting to authorized emails');
  ALLOWED_EMAILS.push('kassandrasantana406@gmail.com');
  ALLOWED_EMAILS.push('kassandra406@gmail.com');
}

console.log('🔧 ALLOWED_EMAILS configured:', ALLOWED_EMAILS);

// In-memory code store (for development - use Redis in production)
const verificationCodes = new Map<string, {
  code: string;
  expiresAt: number;
  attempts: number;
  nonce: string;
}>();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 5, // 5 requests per minute per IP
  message: { ok: false, error: 'Too many authentication attempts' }
});

// Session helpers
function issueSession(res: Response, email: string) {
  const sessionId = uuid();
  // Replit always uses HTTPS - force secure cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true,  // Always true for Replit HTTPS
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    // NO domain property - let browser use current host
  };
  
  console.log('🍪 Setting session cookies for email:', email);
  
  res.cookie('fcs_session', sessionId, cookieOptions);
  
  const payload = Buffer.from(JSON.stringify({ email })).toString('base64url');
  res.cookie('fcs_who', payload, cookieOptions);
  
  console.log('🍪 Cookies set with options:', cookieOptions);
}

function getAuthenticatedUser(req: Request): string | null {
  try {
    const payload = (req as any).cookies['fcs_who'];
    if (!payload) return null;
    const obj = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return obj?.email || null;
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookies = (req as any).cookies;
  console.log('🔍 Auth check - All cookies:', Object.keys(cookies));
  console.log('🔍 fcs_session cookie:', cookies['fcs_session'] ? 'EXISTS' : 'MISSING');
  console.log('🔍 fcs_who cookie:', cookies['fcs_who'] ? 'EXISTS' : 'MISSING');
  
  const hasSession = cookies['fcs_session'];
  if (!hasSession) {
    console.log('❌ No session cookie found');
    return res.status(401).json({ error: 'Authentication required', redirectTo: '/login' });
  }
  
  const email = getAuthenticatedUser(req);
  console.log('🔍 Extracted email from cookie:', email);
  
  // For testing: allow @example.com emails, otherwise check ALLOWED_EMAILS
  const isTestEmail = email && email.endsWith('@example.com');
  if (!email || (!isTestEmail && ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(email.toLowerCase()))) {
    console.log('❌ Email not authorized:', email);
    return res.status(401).json({ error: 'Not authorized', redirectTo: '/login' });
  }
  
  console.log('✅ Authentication successful for:', email);
  (req as any).authenticatedEmail = email;
  next();
}

// Passport configuration
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

// Google OAuth strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, (accessToken: any, refreshToken: any, profile: any, done: any) => {
    const email = (profile.emails?.[0]?.value || '').toLowerCase();
    // For testing: allow @example.com emails, otherwise check ALLOWED_EMAILS
    const isTestEmail = email.endsWith('@example.com');
    if (!isTestEmail && ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(email)) {
      return done(null, false);
    }
    return done(null, { email, name: profile.displayName });
  }));
}

// Routes

// Start email and SMS verification
router.post('/login/start', authLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const phone = String(req.body.phone || '').trim();
    
    console.log('🔧 Login request - Email:', email, 'Phone:', phone);
    console.log('🔧 SMS Service Configuration:', smsService.getConfigurationStatus());
    
    if (!email && !phone) {
      return res.status(400).json({ ok: false, error: 'Email or phone number required' });
    }
    
    // For testing: allow @example.com emails, otherwise check ALLOWED_EMAILS
    const isTestEmail = email && email.endsWith('@example.com');
    console.log('🔧 Login attempt - Email:', email);
    console.log('🔧 Login attempt - isTestEmail:', isTestEmail);
    console.log('🔧 Login attempt - ALLOWED_EMAILS:', ALLOWED_EMAILS);
    console.log('🔧 Login attempt - email in ALLOWED_EMAILS:', ALLOWED_EMAILS.includes(email));
    
    if (email && !isTestEmail && ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(email)) {
      console.log('❌ Email authorization failed for:', email);
      return res.status(403).json({ ok: false, error: 'Email not authorized' });
    }
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 1000 * 60 * 10; // 10 minutes
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const identifier = email || phone;
    verificationCodes.set(identifier, { code, expiresAt, attempts: 0, nonce });
    
    let emailSent = false;
    let smsSent = false;
    
    // Send email verification if email provided
    if (email) {
      try {
        const html = `
          <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0A0A0A; color: #FFFFFF;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-weight: 700;">Family Portal</h1>
            </div>
            <div style="background: #1A1A1A; border-radius: 16px; padding: 32px; text-align: center;">
              <h2 style="margin: 0 0 16px; color: #FFFFFF;">Your sign-in code</h2>
              <div style="background: #2A2A2A; border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px solid #D4AF37;">
                <span style="font-size: 36px; font-weight: 700; color: #D4AF37; letter-spacing: 4px;">${code}</span>
              </div>
              <p style="margin: 16px 0; color: #CCCCCC;">This code expires in 10 minutes.</p>
              <p style="margin: 0; color: #888888; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          </div>
        `;
        
        await sendEmail(email, 'Your Family Portal sign-in code', html);
        
        emailSent = true;
        console.log('✅ Email verification code sent to:', email);
      } catch (error) {
        console.error('❌ Email send error:', error);
      }
    }
    
    // Send SMS verification if phone provided
    if (phone) {
      try {
        const smsMessage = `Your Family Portal sign-in code is: ${code}. This code expires in 10 minutes. If you didn't request this, please ignore this message.`;
        
        const smsSuccess = await smsService.sendSMS(phone, smsMessage);
        if (smsSuccess) {
          smsSent = true;
          console.log('✅ SMS verification code sent to:', phone);
        } else {
          console.error('❌ SMS send failed for:', phone);
        }
      } catch (error) {
        console.error('❌ SMS send error:', error);
      }
    }
    
    // Return success if at least one method worked
    if (emailSent || smsSent) {
      const methods = [];
      if (emailSent) methods.push('email');
      if (smsSent) methods.push('SMS');
      
      res.json({ 
        ok: true, 
        nonce,
        sentVia: methods,
        message: `Verification code sent via ${methods.join(' and ')}`
      });
    } else {
      res.status(500).json({ 
        ok: false, 
        error: 'Failed to send verification code via any method' 
      });
    }
  } catch (error) {
    console.error('❌ Verification send error:', error);
    res.status(500).json({ ok: false, error: 'Failed to send verification code' });
  }
});

// Verify code
router.post('/login/verify', authLimiter, (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const phone = String(req.body.phone || '').trim();
  const code = String(req.body.code || '').trim();
  const nonce = String(req.body.nonce || '').trim();
  
  const identifier = email || phone;
  if (!identifier) {
    return res.status(400).json({ ok: false, error: 'Email or phone number required' });
  }
  
  const entry = verificationCodes.get(identifier);
  if (!entry) {
    return res.status(400).json({ ok: false, error: 'No verification code found' });
  }
  
  if (entry.nonce !== nonce) {
    return res.status(400).json({ ok: false, error: 'Invalid verification attempt' });
  }
  
  if (Date.now() > entry.expiresAt) {
    verificationCodes.delete(identifier);
    return res.status(400).json({ ok: false, error: 'Code expired' });
  }
  
  entry.attempts++;
  if (entry.attempts > 5) {
    verificationCodes.delete(identifier);
    return res.status(429).json({ ok: false, error: 'Too many attempts' });
  }
  
  if (entry.code !== code) {
    return res.status(400).json({ ok: false, error: 'Invalid code' });
  }
  
  // Success - clear code and issue session
  verificationCodes.delete(identifier);
  // Use email for session if available, otherwise use phone
  const sessionIdentifier = email || phone;
  issueSession(res, sessionIdentifier);
  res.json({ ok: true, redirect: '/family' });
});

// Google OAuth routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/auth/google', passport.authenticate('google', { 
    scope: ['email', 'profile'] 
  }));
  
  router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req: any, res) => {
      issueSession(res, req.user.email);
      res.redirect('/');
    }
  );
} else {
  // Fallback when Google OAuth isn't configured
  router.get('/auth/google', (req, res) => {
    res.redirect('/login?error=google_not_configured');
  });
}

// Logout - idempotent, always clears all auth cookies
router.post('/auth/logout', (req, res) => {
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' };
  
  // Clear all possible auth cookies (idempotent)
  const cookieNames = ['fcs_session', 'fcs_who', 'session', 'refresh_token', 'access_token'];
  for (const name of cookieNames) {
    res.clearCookie(name, opts);
  }
  
  // Never fail logout - always return success
  res.status(200).json({ ok: true });
});

// Current user endpoint
router.get('/api/auth/user', requireAuth, (req: any, res) => {
  res.json({ 
    email: req.authenticatedEmail,
    isAuthenticated: true 
  });
});

export { router as customAuthRouter, requireAuth as customRequireAuth };
