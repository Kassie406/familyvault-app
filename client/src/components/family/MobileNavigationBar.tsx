import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  MessageCircle, 
  Bell, 
  Users, 
  Settings,
  Menu,
  X,
  Zap,
  Search
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

interface MobileNavigationBarProps {
  onQuickAccessOpen?: () => void;
}

const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, href: '/family' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/family/messages' },
  { id: 'family', label: 'Family', icon: Users, href: '/family/ids' },
  { id: 'quick', label: 'Quick', icon: Zap, action: 'quick-access' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/family/settings' }
];

export function MobileNavigationBar({ onQuickAccessOpen }: MobileNavigationBarProps) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleItemClick = (item: typeof navigationItems[0]) => {
    if (item.action === 'quick-access') {
      onQuickAccessOpen?.();
    } else if (item.href) {
      setMenuOpen(false);
    }
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return location === href || (href !== '/family' && location.startsWith(href));
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <LuxuryCard className="rounded-none border-l-0 border-r-0 border-b-0">
          <div className="flex items-center justify-around py-2 px-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              const NavButton = (
                <button
                  onClick={() => handleItemClick(item)}
                  className={`mobile-qa-btn flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                    active 
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  data-testid={`mobile-nav-${item.id}`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );

              if (item.href) {
                return (
                  <Link key={item.id} href={item.href}>
                    {NavButton}
                  </Link>
                );
              }

              return <div key={item.id}>{NavButton}</div>;
            })}
          </div>
        </LuxuryCard>
      </div>

      {/* Mobile Top Header */}
      <div className="sticky top-0 z-30 md:hidden">
        <LuxuryCard className="rounded-none border-l-0 border-r-0 border-t-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4AF37] rounded-lg">
                <Home className="h-5 w-5 text-black" />
              </div>
              <div>
                <h1 className="font-semibold text-white">Family Portal</h1>
                <p className="text-xs text-white/60">Stay connected & organized</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="header-icon p-2 rounded-lg transition-colors relative"
                data-testid="mobile-notifications"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-white/70" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="header-icon p-2 rounded-lg transition-colors"
                data-testid="mobile-menu-open"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5 text-white/70" />
              </button>
            </div>
          </div>
        </LuxuryCard>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw]">
            <LuxuryCard className="h-full rounded-none border-r-0">
              {/* Menu Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="header-menu-btn p-2 rounded-lg transition-colors"
                  data-testid="mobile-menu-close"
                >
                  <X className="h-5 w-5 text-white/70" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="p-4 space-y-2">
                <div className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3">
                  Navigation
                </div>
                
                <Link href="/family" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-colors">
                    <Home className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-white">Dashboard</span>
                  </div>
                </Link>
                
                <Link href="/family/messages" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-colors">
                    <MessageCircle className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-white">Messages</span>
                  </div>
                </Link>
                
                <Link href="/family/ids" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-colors">
                    <Users className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-white">Family Members</span>
                  </div>
                </Link>

                <div className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3 mt-6">
                  Quick Actions
                </div>
                
                <button
                  onClick={() => {
                    onQuickAccessOpen?.();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Zap className="h-5 w-5 text-[#D4AF37]" />
                  <span className="text-white">Quick Access</span>
                </button>
                
                <Link href="/family/search" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-colors">
                    <Search className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-white">Search</span>
                  </div>
                </Link>

                <div className="text-sm font-medium text-white/60 uppercase tracking-wider mb-3 mt-6">
                  Settings
                </div>
                
                <Link href="/family/settings" onClick={() => setMenuOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-lg transition-colors">
                    <Settings className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-white">Settings</span>
                  </div>
                </Link>
              </div>
            </LuxuryCard>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNavigationBar;