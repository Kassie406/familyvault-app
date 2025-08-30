import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState, useRef, useEffect } from 'react';
import { 
  Shield, LogOut, User, Settings, LayoutDashboard, Users, CreditCard, 
  Ticket, FileText, ShieldCheck, Activity, Search, Filter, Bell, 
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

export default function AdminLayout({ children, activeSection = 'overview', onSectionChange }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isOpen: isSearchOpen, setIsOpen: setIsSearchOpen } = useGlobalSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
      setLocation('/admin/login');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
    setIsMenuOpen(false);
  };

  // Position dropdown menu
  useEffect(() => {
    if (isMenuOpen && menuRef.current && triggerRef.current) {
      const trigger = triggerRef.current.getBoundingClientRect();
      const menu = menuRef.current;
      const gap = 8;
      
      menu.style.left = Math.min(window.innerWidth - menu.offsetWidth - 8, trigger.left) + 'px';
      menu.style.top = (trigger.bottom + gap) + 'px';
    }
  }, [isMenuOpen]);

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (isMenuOpen) {
        const trigger = triggerRef.current?.getBoundingClientRect();
        const menu = menuRef.current;
        if (trigger && menu) {
          const gap = 8;
          menu.style.left = Math.min(window.innerWidth - menu.offsetWidth - 8, trigger.left) + 'px';
          menu.style.top = (trigger.bottom + gap) + 'px';
        }
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleOutsideClick);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isMenuOpen]);

  // Redirect to login if not authenticated or not admin
  if (!user?.user || !['ADMIN', 'PRESIDENT'].includes(user.user.role)) {
    setLocation('/admin/login');
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
        {/* Dark Sidebar */}
        <div className="sidebar">
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
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.href) {
                      setLocation(item.href);
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
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Admin User Info */}
        <div className="p-4 border-t border-[#2C2C2C]">
          <button 
            ref={triggerRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#1F6FEB] transition-colors"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-[#007BFF] text-white">
                {(user.user.name || user.user.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-medium">{user.user.name || user.user.username}</div>
              <div className="text-xs text-[#CED4DA]">{user.user.role}</div>
            </div>
          </button>

        </div>
        </div>

        {/* Improved Admin Menu Portal - Portal to body to avoid clipping */}
        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="admin-menu-portal"
            role="menu" 
            aria-label="Admin menu"
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsMenuOpen(false);
                triggerRef.current?.focus();
              }
            }}
          >
            <div className="adm-header">
              <div className="adm-name">{user.user.name || user.user.username}</div>
              <div className="adm-sub">{user.user.email || `${user.user.role}@familycirclesecure.com`}</div>
            </div>
            
            <button 
              className="adm-item" 
              role="menuitem" 
              onClick={() => { setIsMenuOpen(false); /* Handle profile navigation */ }}
              data-testid="menu-profile"
            >
              <span>Profile</span>
              <small>Account settings</small>
            </button>
            
            <button 
              className="adm-item" 
              role="menuitem" 
              onClick={() => { setIsMenuOpen(false); /* Handle settings navigation */ }}
              data-testid="menu-settings"
            >
              <span>Settings</span>
              <small>Preferences</small>
            </button>

            <div className="adm-sep" role="separator"></div>

            <button 
              className="adm-item danger" 
              role="menuitem" 
              onClick={handleLogout}
              data-testid="menu-logout"
            >
              <span>Log out</span>
            </button>
          </div>
        )}

      {/* Main Content Area */}
      <div className="main">
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
                <Button 
                  variant="outline" 
                  className="w-64 justify-start text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100"
                  onClick={() => setIsSearchOpen(true)}
                  data-testid="button-global-search"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search everywhere... ⌘K
                </Button>
                
                {/* Toolbar Actions */}
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}