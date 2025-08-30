// Route constants for admin dashboard navigation
export const ROUTES = {
  // Core admin routes
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  USERS_ADMINS: '/admin/users?role=admin',
  PLANS_CLIENT: '/admin/subscription-plans?audience=client',
  COUPONS: '/admin/coupons',
  COUPONS_NEW: '/admin/coupons/new',
  CONTENT_PUBLISHED: '/admin/content?status=published',
  SECURITY: '/admin/security',
  COMPLIANCE: '/admin/compliance',
  WEBHOOKS: '/admin/webhooks',
  
  // Security deep-links
  SECURITY_STATUS: (service: string) => `/admin/security?tab=status#service=${encodeURIComponent(service)}`,
  SECURITY_2FA: '/admin/security#2fa-policy',
  SECURITY_SESSIONS: '/admin/security#admin-sessions',
  SECURITY_ALLOWLIST: '/admin/security#ip-allowlist',
  SECURITY_KEYS: '/admin/security#api-keys',
  SECURITY_AUDIT: '/admin/security/audit',
  
  // Webhook deep-links
  WEBHOOKS_DELIVERIES: '/admin/webhooks?tab=deliveries',
  
  // Subscription plans deep-links
  PLANS_STRIPE: '/admin/subscription-plans?tab=stripe',
} as const;

// Navigation helper function
export function navigate(to: string) {
  if (typeof window !== 'undefined') {
    window.location.assign(to);
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