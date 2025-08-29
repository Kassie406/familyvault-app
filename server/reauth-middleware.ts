import { Request, Response, NextFunction } from 'express';

const THIRTY_MIN = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * High-risk action middleware requiring recent strong authentication
 * Used for sensitive operations like billing changes, security settings, etc.
 */
export function requireRecentReauth(req: any, res: Response, next: NextFunction) {
  const lastStrongAuthAt = req.session?.lastStrongAuthAt;
  
  if (lastStrongAuthAt && (Date.now() - lastStrongAuthAt) < THIRTY_MIN) {
    return next();
  }
  
  return res.status(401).json({ 
    error: 're_auth_required',
    message: 'This action requires recent authentication. Please sign in again with your passkey or password.',
    lastAuthAge: lastStrongAuthAt ? Date.now() - lastStrongAuthAt : null
  });
}

/**
 * Mark that the user has completed strong authentication
 * Call this after successful WebAuthn, TOTP, or password verification
 */
export function markStrongAuth(req: any) {
  if (!req.session) {
    req.session = {};
  }
  req.session.lastStrongAuthAt = Date.now();
}

/**
 * Check if user has recent strong authentication without blocking
 */
export function hasRecentAuth(req: any): boolean {
  const lastStrongAuthAt = req.session?.lastStrongAuthAt;
  return lastStrongAuthAt && (Date.now() - lastStrongAuthAt) < THIRTY_MIN;
}

/**
 * Get time since last strong authentication
 */
export function getAuthAge(req: any): number | null {
  const lastStrongAuthAt = req.session?.lastStrongAuthAt;
  return lastStrongAuthAt ? Date.now() - lastStrongAuthAt : null;
}