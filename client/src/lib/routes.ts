// Route constants for admin dashboard navigation
export const ROUTES = {
  // Core admin routes (matching AdminRouter paths - no /admin prefix)
  DASHBOARD: '/dashboard',
  USERS: '/security-settings', // Temporary redirect to existing page
  USERS_ADMINS: '/security-settings',
  PLANS_CLIENT: '/security-settings', 
  COUPONS: '/security-settings',
  COUPONS_NEW: '/security-settings',
  CONTENT_PUBLISHED: '/security-settings',
  SECURITY: '/security-settings',
  COMPLIANCE: '/security-settings',
  WEBHOOKS: '/security-settings',
  
  // Security deep-links (all redirect to security-settings for now)
  SECURITY_STATUS: (service: string) => '/security-settings',
  SECURITY_2FA: '/security-settings',
  SECURITY_SESSIONS: '/security-settings',
  SECURITY_ALLOWLIST: '/security-settings', 
  SECURITY_KEYS: '/security-settings',
  SECURITY_AUDIT: '/security-settings',
  
  // Webhook deep-links
  WEBHOOKS_DELIVERIES: '/security-settings',
  
  // Subscription plans deep-links
  PLANS_STRIPE: '/security-settings',
} as const;

// Navigation helper function using client-side routing
export function navigate(to: string) {
  if (typeof window !== 'undefined') {
    // Use client-side navigation instead of full page reload
    window.history.pushState({}, '', to);
    // Trigger a popstate event to update the router
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

// Analytics tracking helper (optional)
export function trackAdminClick(action: string, meta: any = {}) {
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/admin-click', JSON.stringify({
      action,
      meta,
      timestamp: Date.now()
    }));
  }
}