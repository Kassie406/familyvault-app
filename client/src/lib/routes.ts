// Route constants for admin dashboard navigation
export const ROUTES = {
  // Core admin routes (matching actual router paths)
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/security-settings', // Temporary redirect to existing page
  USERS_ADMINS: '/admin/security-settings',
  PLANS_CLIENT: '/admin/security-settings', 
  COUPONS: '/admin/security-settings',
  COUPONS_NEW: '/admin/security-settings',
  CONTENT_PUBLISHED: '/admin/security-settings',
  SECURITY: '/admin/security-settings',
  COMPLIANCE: '/admin/security-settings',
  WEBHOOKS: '/admin/security-settings',
  
  // Security deep-links (all redirect to security-settings for now)
  SECURITY_STATUS: (service: string) => '/admin/security-settings',
  SECURITY_2FA: '/admin/security-settings',
  SECURITY_SESSIONS: '/admin/security-settings',
  SECURITY_ALLOWLIST: '/admin/security-settings', 
  SECURITY_KEYS: '/admin/security-settings',
  SECURITY_AUDIT: '/admin/security-settings',
  
  // Webhook deep-links
  WEBHOOKS_DELIVERIES: '/admin/security-settings',
  
  // Subscription plans deep-links
  PLANS_STRIPE: '/admin/security-settings',
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