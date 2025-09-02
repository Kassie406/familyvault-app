import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Shield, LogOut, User, Settings, LayoutDashboard, Users, CreditCard, 
  Ticket, FileText, ShieldCheck, Activity, Search, Bell, 
  Flag, UserX, Webhook, Tag, Megaphone, AlertTriangle, Key, Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import GlobalSearch, { useGlobalSearch } from './global-search';
import ImpersonationBanner from './impersonation-banner';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function AdminLayout({ activeSection = 'overview', onSectionChange }: Omit<AdminLayoutProps, 'children'>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isOpen: isSearchOpen, setIsOpen: setIsSearchOpen } = useGlobalSearch();

  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: () => fetch('/api/auth/me').then(res => res.ok ? res.json() : null),
    retry: false,
  });

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({ title: 'Logged out successfully' });
      navigate('/admin/login');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  };

  // Redirect to login if not authenticated or not admin
  useEffect(() => {
    if (user !== undefined && (!user?.user || !['ADMIN', 'PRESIDENT'].includes(user.user.role))) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Show loading while checking auth
  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Don't render if not authenticated (useEffect will handle redirect)
  if (!user?.user || !['ADMIN', 'PRESIDENT'].includes(user.user.role)) {
    return null;
  }

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, description: 'Analytics & overview', href: '/admin/dashboard' },
    { id: 'users', label: 'Users', icon: Users, description: 'User management' },
    { id: 'plans', label: 'Subscription Plans', icon: CreditCard, description: 'Pricing & billing' },
    { id: 'coupons', label: 'Coupons', icon: Ticket, description: 'Promotional codes' },
    { id: 'content', label: 'Content', icon: FileText, description: 'CMS & articles' },
    { id: 'feature-flags', label: 'Feature Flags', icon: Flag, description: 'Rollouts & targeting' },
    { id: 'advanced-feature-flags', label: 'Advanced Flags', icon: Flag, description: 'Enhanced flag management' },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook, description: 'Outbound integrations' },
    { id: 'advanced-webhooks', label: 'Advanced Webhooks', icon: Webhook, description: 'Enhanced webhook management' },
    { id: 'tamper-audit', label: 'Tamper-Evident Audit', icon: Shield, description: 'Cryptographic audit trail' },
    { id: 'marketing-promotions', label: 'Marketing Promotions', icon: Megaphone, description: 'Banners & popup campaigns' },
    { id: 'impersonation', label: 'Impersonation', icon: UserX, description: 'Admin user support' },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck, description: 'GDPR & privacy' },
    { id: 'security', label: 'Security', icon: Activity, description: 'Audit & monitoring' },
  ];

  return (
    <>
      {/* Impersonation Banner */}
      <ImpersonationBanner />
      
      <div className="app-shell">
        {/* Sidebar */}
        <aside className="sidebar" id="sidebar">
          <div className="sidebar__scroll">
            {/* Logo Header */}
            <div className="p-6 border-b border-[#2C2C2C]">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-[#007BFF]" />
            <div>
              <h1 className="text-lg font-bold">FamilyCircle Secure</h1>
              <p className="text-sm text-[#CED4DA]">Management Console</p>
            </div>
          </div>
        </div>

            {/* Navigation Menu */}
            <div className="sidebar__nav">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.href) {
                          navigate(item.href);
                        } else {
                          onSectionChange?.(item.id);
                        }
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-[#007BFF] text-white shadow-lg' 
                          : 'text-[#CED4DA] hover:bg-[#1F6FEB] hover:text-white'
                      }`}
                      data-testid={`nav-${item.id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs opacity-80">{item.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Spacer to push admin to bottom */}
            <div className="sidebar__spacer"></div>

            {/* Admin Section at Bottom */}
            <div className="sidebar__admin">
              <div className="admin-card">
                <div className="admin-id">
                  <span className="avatar">
                    {(user.user.name || user.user.username).charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="name">{user.user.name || user.user.username}</div>
                    <div className="role">{user.user.role}</div>
                  </div>
                </div>
                <nav className="admin-links pointer-events-auto relative z-50">
                  <NavLink to="/admin/profile" data-testid="menu-profile">
                    <User className="w-4 h-4" />
                    Profile
                  </NavLink>
                  <NavLink to="/admin/settings" data-testid="menu-settings">
                    <Settings className="w-4 h-4" />
                    Settings
                  </NavLink>
                  <button type="button" className="logout" onClick={handleLogout} data-testid="menu-logout">
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main" id="main">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {navigationItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {navigationItems.find(item => item.id === activeSection)?.description || 'Platform management overview'}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Global Search (⌘K) */}
                  <button 
                    className="w-64 justify-start text-gray-500 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center"
                    onClick={() => setIsSearchOpen(true)}
                    data-testid="button-global-search"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search everywhere... ⌘K
                  </button>
                  
                  {/* Toolbar Actions */}
                  <button className="px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50">
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-6 bg-gray-50 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
        onNavigate={onSectionChange}
      />
    </>
  );
}