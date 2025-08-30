import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import argon2 from 'argon2';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { type User } from '@shared/schema';
import { maybeSendNewDeviceEmail } from './new-device-alerts';

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// Role hierarchy for RBAC
const ROLE_HIERARCHY = {
  FAMILY_ACCESSOR: 1,
  MEMBER: 2,
  AGENT: 3,
  ADMIN: 4,
  PRESIDENT: 5
} as const;

type UserRole = keyof typeof ROLE_HIERARCHY;

// Extended request type to include user and subdomain
export interface AuthenticatedRequest extends Request {
  user?: User;
  subdomain?: string;
  isAdminRequest?: boolean;
  isPortalRequest?: boolean;
  isHubRequest?: boolean;
  auditCtx?: {
    actorId: string;
    actorEmail?: string;
    actorRole?: string;
    ip?: string;
    userAgent?: string;
  };
  sessionId?: string;
  deviceId?: string;
}

// JWT utilities
export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email,
      role: user.role,
      orgId: user.orgId 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Enhanced password utilities with Argon2id
export async function hashPassword(password: string): Promise<string> {
  // Use Argon2id for new passwords - more secure than bcrypt
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456, // 19 MiB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  // Support both legacy bcrypt and new Argon2id hashes
  if (hashedPassword.startsWith('$argon2id$')) {
    return await argon2.verify(hashedPassword, password);
  } else {
    // Legacy bcrypt support for migration
    return await bcrypt.compare(password, hashedPassword);
  }
}

// Session security utilities
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateDeviceFingerprint(req: Request): string {
  const components = [
    req.get('User-Agent') || '',
    req.get('Accept-Language') || '',
    req.get('Accept-Encoding') || '',
    req.ip || req.socket?.remoteAddress || '',
  ];
  return crypto.createHash('sha256').update(components.join('|')).digest('hex');
}

// Role checking utility
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// Authentication middleware
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '');
  
  if (!token) {
    return next();
  }

  const decoded = verifyToken(token);
  if (decoded) {
    // Attach user info to request (simplified from token)
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      orgId: decoded.orgId
    } as User;
  }

  next();
}

export function requireAuth(requiredRole?: UserRole) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token || (req.headers.authorization || '').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    try {
      // Get fresh user data from database
      const user = await storage.getUser(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;

      // Check role if required
      if (requiredRole && !hasRole(user.role as UserRole, requiredRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
}

// Audit logging helper
export async function logAction(
  actorId: string,
  action: string,
  resource?: string,
  resourceId?: string,
  meta?: any,
  req?: AuthenticatedRequest
) {
  try {
    await storage.createAuditLog({
      actorId,
      action,
      resource,
      resourceId,
      meta,
      ip: req?.ip || req?.socket?.remoteAddress,
      userAgent: req?.get('User-Agent')
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}

// Authentication routes
export async function loginUser(username: string, password: string, req?: Request): Promise<{ user: User; token: string } | null> {
  try {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
      return null;
    }

    const token = generateToken(user);
    
    // Log successful login
    await logAction(user.id, 'login', 'user', user.id);

    // Send new device email alert if request context is available
    if (req && user.email) {
      await maybeSendNewDeviceEmail(
        { id: user.id, email: user.email, orgId: user.orgId },
        req.get('user-agent'),
        req.ip
      );
    }

    return { user, token };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function registerUser(userData: {
  username: string;
  password: string;
  email?: string;
  name?: string;
  role?: UserRole;
  orgId?: string;
}): Promise<{ user: User; token: string } | null> {
  try {
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return null;
    }

    if (userData.email) {
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return null;
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await storage.createUser({
      username: userData.username,
      password: hashedPassword,
      email: userData.email,
      name: userData.name,
      role: userData.role || 'MEMBER',
      orgId: userData.orgId
    });

    const token = generateToken(user);

    // Log registration
    await logAction(user.id, 'register', 'user', user.id);

    return { user, token };
  } catch (error) {
    console.error('Registration error:', error);
    return null;
  }
}