import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  Bell, Plus, Search, HelpCircle, Settings, User, X, LogOut,
  Heart, MessageCircle, Upload, Camera, Calendar, MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FamilyHeaderProps {
  familyName?: string;
  familyAvatar?: string;
  unreadCount?: number;
  onInboxOpen?: () => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function FamilyHeader({
  familyName = "Family Dashboard",
  familyAvatar,
  unreadCount = 0,
  onInboxOpen,
  onLogout,
  searchQuery = "",
  onSearchChange
}: FamilyHeaderProps) {
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Close quick add menu on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickAddOpen(false);
      }
    };

    if (quickAddOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [quickAddOpen]);

  // Close quick add menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-quick-add]')) {
        setQuickAddOpen(false);
      }
    };

    if (quickAddOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [quickAddOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = '/login';
    }
  };

  return (
    <div className="relative z-20 flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        {/* Family Avatar */}
        {familyAvatar ? (
          <img 
            src={familyAvatar} 
            alt="Family avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
            <Heart className="w-4 h-4 text-black" />
          </div>
        )}
        
        <h2 className="text-xl font-semibold text-white">{familyName}</h2>
        
        {/* Edit Dashboard Name Button */}
        <button 
          className="nav-icon-btn p-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Edit dashboard name"
          data-testid="button-edit-dashboard-name"
          onClick={() => {
            // TODO: Add edit dashboard name functionality
            console.log('Edit dashboard name clicked');
          }}
        >
          <MoreHorizontal className="h-4 w-4 text-white/70 hover:text-[#D4AF37]" />
        </button>
      </div>
      
      <div className="flex items-center gap-4" id="header-nav-icons">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ink-400)] h-4 w-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
            data-testid="input-search"
          />
        </div>
        
        {/* Quick Add (+) Menu */}
        <div className="relative" data-quick-add>
          <button
            aria-haspopup="menu"
            aria-expanded={quickAddOpen}
            onClick={() => setQuickAddOpen(v => !v)}
            className="nav-icon-btn h-10 w-10 rounded-full border border-[#25252b] hover:border-[#c5a000] focus:outline-none focus:ring-2 focus:ring-[#c5a000] grid place-items-center transition-colors"
            title="Quick add"
            data-testid="button-quick-add"
          >
            <Plus size={18} className="text-white/70" />
          </button>
          
          {quickAddOpen && (
            <div 
              role="menu" 
              className="absolute right-0 mt-2 w-48 rounded-xl border border-[#25252b] bg-[#121217] p-1 shadow-lg z-50"
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  const menuItems = e.currentTarget.querySelectorAll('[role="menuitem"]');
                  const firstItem = menuItems[0] as HTMLElement;
                  const lastItem = menuItems[menuItems.length - 1] as HTMLElement;
                  
                  if (e.shiftKey && document.activeElement === firstItem) {
                    e.preventDefault();
                    lastItem?.focus();
                  } else if (!e.shiftKey && document.activeElement === lastItem) {
                    e.preventDefault();
                    firstItem?.focus();
                  }
                }
              }}
            >
              {[
                { label: "Add Message", href: "/inbox/new", icon: MessageCircle },
                { label: "Upload Document", href: "/upload?type=doc", icon: Upload },
                { label: "Upload Photo", href: "/upload?type=photo", icon: Camera },
                { label: "Create Event", href: "/calendar/new", icon: Calendar }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-[#1a1a20] hover:text-[#c5a000] transition-colors focus:outline-none focus:bg-[#1a1a20] focus:text-[#c5a000]"
                  onClick={() => setQuickAddOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.currentTarget.click();
                    }
                  }}
                  tabIndex={0}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Help Button */}
        <button className="nav-icon-btn text-[var(--ink-300)] hover:text-[var(--gold)] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">
          <HelpCircle className="h-4 w-4" />
          <span className="text-sm">Help</span>
        </button>
        
        {/* Notification Bell with Badge */}
        <button 
          className="nav-icon-btn relative p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={onInboxOpen}
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5 text-white/70" />
          {/* Badge - only show when unreadCount > 0 */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              id="header-profile-btn"
              data-testid="button-profile"
              className="profile-chip w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center hover:bg-[#B8860B] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            >
              <span className="text-black text-sm font-medium">KC</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="header-profile-menu w-48 bg-[#1A1A1A] border-[#2A2A33] text-white absolute right-0 mt-2 z-[60]"
          >
            <DropdownMenuItem asChild>
              <Link href="/family/settings" className="flex items-center gap-2 px-2 py-2 hover:bg-[#2A2A33] transition-colors cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2A2A33]" />
            <DropdownMenuItem 
              onClick={onLogout || handleLogout}
              className="flex items-center gap-2 px-2 py-2 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
