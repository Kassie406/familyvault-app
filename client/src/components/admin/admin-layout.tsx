import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Shield, LogOut, User, Settings, LayoutDashboard, Users, CreditCard, 
  Ticket, FileText, ShieldCheck, Activity, Search, Bell, 
  Flag, UserX, Webhook, Tag, Megaphone, AlertTriangle, Key, Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  
  // Notification state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'System Alert',
      message: 'Database backup completed successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      read: false
    },
    {
      id: '2', 
      title: 'Security Warning',
      message: 'Failed login attempt detected from IP 192.168.1.100',
      type: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false
    },
    {
      id: '3',
      title: 'User Activity',
      message: '15 new user registrations in the last hour',
      type: 'info',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      read: true
    },
    {
      id: '4',
      title: 'System Update',
      message: 'Scheduled maintenance window begins in 2 hours',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Helper functions
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <ShieldCheck className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <Shield className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

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
                  
                  {/* Notifications */}
                  <Popover open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                    <PopoverTrigger asChild>
                      <button 
                        className="relative px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                        data-testid="button-notifications"
                      >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                          <Badge 
                            variant="destructive" 
                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Badge>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0 mr-6" align="end">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Notifications</h3>
                          {unreadCount > 0 && (
                            <button 
                              onClick={markAllAsRead}
                              className="text-sm text-blue-600 hover:text-blue-800"
                              data-testid="button-mark-all-read"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                      </div>
                      <ScrollArea className="max-h-96">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No notifications
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                              <div 
                                key={notification.id}
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => markAsRead(notification.id)}
                                data-testid={`notification-${notification.id}`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium text-sm text-gray-900 truncate">
                                        {notification.title}
                                      </p>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 flex-shrink-0" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                      {formatTime(notification.timestamp)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50">
                          <button 
                            className="w-full text-sm text-gray-600 hover:text-gray-800 text-center"
                            onClick={() => setIsNotificationOpen(false)}
                            data-testid="button-view-all-notifications"
                          >
                            View all notifications
                          </button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
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