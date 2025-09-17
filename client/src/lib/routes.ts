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
  
  // System Status Routes - Each component now has its dedicated page
  SECURITY_STATUS: (service: string) => {
    switch (service.toLowerCase()) {
      case 'database': return '/database-status';
      case 'auth': 
      case 'authentication': return '/auth-status';
      case 'smtp': 
      case 'email': return '/smtp-status';
      case 'webhooks': return '/webhooks-status';
      case 'stripe': 
      case 'payments': return '/stripe-status';
      case 'storage': return '/storage-status';
      default: return '/security-settings';
    }
  },
  
  // Security deep-links
  SECURITY_2FA: '/security-settings',
  SECURITY_SESSIONS: '/security-settings',
  SECURITY_ALLOWLIST: '/security-settings', 
  SECURITY_KEYS: '/security-settings',
  SECURITY_AUDIT: '/security-settings',
  
  // Direct status page routes
  DATABASE_STATUS: '/database-status',
  AUTH_STATUS: '/auth-status',
  SMTP_STATUS: '/smtp-status',
  WEBHOOKS_STATUS: '/webhooks-status',
  STRIPE_STATUS: '/stripe-status',
  STORAGE_STATUS: '/storage-status',
  
  // Webhook deep-links
  WEBHOOKS_DELIVERIES: '/webhooks-status',
  
  // Subscription plans deep-links
  PLANS_STRIPE: '/stripe-status',
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