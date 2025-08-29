import crypto from 'crypto';

export interface User {
  id: string;
  email?: string;
  role?: string;
}

export interface TargetingRules {
  percentage?: number;  // rollout % (0..100)
  allowDomains?: string[];  // user.email endsWith any
  allowUserIds?: string[];  // explicit allow list
  blockUserIds?: string[];
  allowRoles?: string[];   // role-based targeting
}

/**
 * Deterministic bucketing: user → 0..99
 * Same user + flag always gets same bucket
 */
export function bucket(userId: string, flagKey: string): number {
  const h = crypto.createHash('sha1');
  h.update(`${flagKey}:${userId}`);
  // map to 0..99 (stable per flag+user)
  return parseInt(h.digest('hex').slice(0, 8), 16) % 100;
}

/**
 * Evaluate if a feature flag should be enabled for a user
 */
export function evaluateFlag(
  flag: {
    key: string;
    status: string;
    forceOn?: boolean;
    forceOff?: boolean;
    targeting?: TargetingRules;
  },
  user: User
): boolean {
  // Flag must be active
  if (flag.status !== 'active') return false;
  
  // Hard overrides take precedence
  if (flag.forceOn === true) return true;
  if (flag.forceOff === true) return false;
  
  const targeting = flag.targeting || {};
  
  // Check block list first
  if (targeting.blockUserIds?.includes(user.id)) return false;
  
  // Check explicit allow list
  if (targeting.allowUserIds?.includes(user.id)) return true;
  
  // Check domain targeting
  if (targeting.allowDomains?.length && user.email) {
    const emailLower = user.email.toLowerCase();
    const domainMatch = targeting.allowDomains.some(domain => 
      emailLower.endsWith(domain.toLowerCase())
    );
    if (domainMatch) return true;
  }
  
  // Check role targeting
  if (targeting.allowRoles?.length && user.role) {
    if (targeting.allowRoles.includes(user.role)) return true;
  }
  
  // Percentage rollout
  const percentage = Number(targeting.percentage || 0);
  if (percentage <= 0) return false;
  
  const userBucket = bucket(user.id, flag.key);
  return userBucket < percentage; // 25% → allow buckets 0..24
}

/**
 * Evaluate multiple flags for a user
 */
export function evaluateFlags(
  flags: Array<{
    key: string;
    status: string;
    forceOn?: boolean;
    forceOff?: boolean;
    targeting?: TargetingRules;
  }>,
  user: User
): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  
  for (const flag of flags) {
    result[flag.key] = evaluateFlag(flag, user);
  }
  
  return result;
}