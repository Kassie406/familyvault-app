import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Shield, LogOut, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-red-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FamilyCircle Secure</h1>
                  <p className="text-sm text-gray-600">Admin Console</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.user.name || user.user.username}</p>
                <p className="text-xs text-gray-500">{user.user.role}</p>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="button-admin-menu">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-red-600 text-white">
                        {(user.user.name || user.user.username).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}