import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { orgSecuritySettings } from '@shared/schema';
import { requireRecentReauth } from './reauth-middleware.js';
import { Request, Response, NextFunction } from 'express';

interface OrgSecuritySettings {
  orgId: string;
  requireMfaForDownloads: boolean;
  requireMfaForShares: boolean;
  updatedAt: Date;
}

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    orgId?: string;
    role?: string;
  };
}

/**
 * Get organization security settings
 */
export async function getOrgSecuritySettings(orgId: string): Promise<OrgSecuritySettings | null> {
  const result = await db
    .select()
    .from(orgSecuritySettings)
    .where(eq(orgSecuritySettings.orgId, orgId))
    .limit(1);

  return result[0] || null;
}

/**
 * Update organization security settings
 */
export async function setOrgSecuritySettings(
  orgId: string, 
  updates: Partial<Pick<OrgSecuritySettings, 'requireMfaForDownloads' | 'requireMfaForShares'>>
): Promise<OrgSecuritySettings> {
  // Upsert the settings
  const result = await db
    .insert(orgSecuritySettings)
    .values({
      orgId,
      requireMfaForDownloads: updates.requireMfaForDownloads ?? true,
      requireMfaForShares: updates.requireMfaForShares ?? true,
      updatedAt: new Date()
    })
    .onConflictDoUpdate({
      target: orgSecuritySettings.orgId,
      set: {
        requireMfaForDownloads: updates.requireMfaForDownloads ?? orgSecuritySettings.requireMfaForDownloads,
        requireMfaForShares: updates.requireMfaForShares ?? orgSecuritySettings.requireMfaForShares,
        updatedAt: new Date()
      }
    })
    .returning();

  return result[0];
}

/**
 * Middleware factory to enforce MFA requirements for sensitive actions
 */
export function guardFor(action: 'download' | 'share') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orgId = req.user?.orgId;
      
      if (!orgId) {
        // If no org, allow action (backwards compatibility)
        return next();
      }

      const settings = await getOrgSecuritySettings(orgId);
      
      if (!settings) {
        // No settings found, allow action (default behavior)
        return next();
      }

      const requireMfa = action === 'download' 
        ? settings.requireMfaForDownloads
        : settings.requireMfaForShares;

      if (!requireMfa) {
        // MFA not required for this action
        return next();
      }

      // MFA is required - enforce recent re-authentication
      return requireRecentReauth(req, res, next);
      
    } catch (error) {
      console.error(`Security guard error for ${action}:`, error);
      // On error, be conservative and require re-auth
      return requireRecentReauth(req, res, next);
    }
  };
}

/**
 * Initialize default security settings for an organization
 */
export async function initializeOrgSecuritySettings(orgId: string): Promise<OrgSecuritySettings> {
  return await setOrgSecuritySettings(orgId, {
    requireMfaForDownloads: true,
    requireMfaForShares: true
  });
}

/**
 * Check if user has permission to modify org security settings
 */
export function canModifyOrgSecurity(userRole: string | undefined): boolean {
  return userRole === 'PRESIDENT' || userRole === 'ADMIN';
}