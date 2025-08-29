import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { 
  Shield, LogOut, User, Settings, LayoutDashboard, Users, CreditCard, 
  Ticket, FileText, ShieldCheck, Activity, Search, Filter, Bell, 
  Flag, UserX, Webhook 
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
  };

  // Redirect to login if not authenticated or not admin
  if (!user?.user || !['ADMIN', 'PRESIDENT'].includes(user.user.role)) {
    setLocation('/admin/login');
    return null;
  }

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, description: 'Analytics & overview' },
    { id: 'users', label: 'Users', icon: Users, description: 'User management' },
    { id: 'plans', label: 'Subscription Plans', icon: CreditCard, description: 'Pricing & billing' },
    { id: 'coupons', label: 'Coupons', icon: Ticket, description: 'Promotional codes' },
    { id: 'content', label: 'Content', icon: FileText, description: 'CMS & articles' },
    { id: 'feature-flags', label: 'Feature Flags', icon: Flag, description: 'Rollouts & targeting' },
    { id: 'advanced-feature-flags', label: 'Advanced Flags', icon: Flag, description: 'Enhanced flag management' },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook, description: 'Outbound integrations' },
    { id: 'advanced-webhooks', label: 'Advanced Webhooks', icon: Webhook, description: 'Enhanced webhook management' },
    { id: 'impersonation', label: 'Impersonation', icon: UserX, description: 'Admin user support' },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck, description: 'GDPR & privacy' },
    { id: 'security', label: 'Security', icon: Activity, description: 'Audit & monitoring' },
  ];

  return (
    <>
      {/* Impersonation Banner */}
      <ImpersonationBanner />
      
      <div className="min-h-screen bg-gray-100 flex">
        {/* Dark Sidebar */}
      <div className="w-72 bg-gray-900 text-white flex flex-col">
        {/* Logo Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-lg font-bold">FamilyCircle Secure</h1>
              <p className="text-sm text-gray-400">Management Console</p>
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
                  onClick={() => onSectionChange?.(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
        <div className="p-4 border-t border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-red-600 text-white">
                    {(user.user.name || user.user.username).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-medium">{user.user.name || user.user.username}</div>
                  <div className="text-xs text-gray-400">{user.user.role}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex-col items-start">
                <div className="font-medium">{user.user.name || user.user.username}</div>
                <div className="text-xs text-muted-foreground">{user.user.email}</div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem data-testid="menu-profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
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
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
      </div>
    </>
  );
}