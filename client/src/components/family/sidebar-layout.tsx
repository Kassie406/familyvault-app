import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home as HomeIcon, Inbox, AlarmClock, Users, DollarSign, 
  Key, Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, Heart, Baby, UserCheck, HeartHandshake, Plane, Package,
  AlertTriangle, FileText, Home as HouseIcon, Users as FamilyIcon, Leaf,
  Menu, X, ChevronLeft, ChevronRight, UserPlus, User
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import EnhancedLeftSidebar from './EnhancedLeftSidebar';
import EnhancedRemindersSidebar from './EnhancedRemindersSidebar';
import { useQuery } from '@tanstack/react-query';

interface SidebarLayoutProps {
  children: React.ReactNode;
  onInboxClick?: () => void;
}

export default function SidebarLayout({ children, onInboxClick }: SidebarLayoutProps) {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [remindersSidebarOpen, setRemindersSidebarOpen] = useState(false);
  const [isMainMenuCollapsed, setIsMainMenuCollapsed] = useState(false);

  // Fetch family members for the submenu
  const { data: familyMembers } = useQuery<Array<{ id: string; name: string; relationship?: string }>>({
    queryKey: ['/api/family/members'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const [activeSection, setActiveSection] = useState(() => {
    // Determine active section based on current path
    if (location === '/family' || location === '/') return 'dashboard';
    if (location.startsWith('/family/inbox')) return 'inbox';
    if (location.startsWith('/family/reminders')) return 'reminders';
    if (location.startsWith('/family/ids')) return 'family-ids';
    if (location.startsWith('/family/finance')) return 'finance';
    if (location.startsWith('/family/property')) return 'property';
    if (location.startsWith('/family/passwords')) return 'passwords';
    if (location.startsWith('/family/insurance')) return 'insurance';
    if (location.startsWith('/family/taxes')) return 'taxes';
    if (location.startsWith('/family/legal')) return 'legal';
    if (location.startsWith('/family/business')) return 'business';
    if (location.startsWith('/family/resources')) return 'family-resources';
    if (location.startsWith('/family/contacts')) return 'contacts';
    if (location.startsWith('/family/child-information')) return 'child-information';
    if (location.startsWith('/family/elderly-parents')) return 'elderly-parents';
    if (location.startsWith('/family/getting-married')) return 'getting-married';
    if (location.startsWith('/family/international-travel')) return 'international-travel';
    if (location.startsWith('/family/moving')) return 'moving';
    if (location.startsWith('/family/disaster-planning')) return 'disaster-planning';
    if (location.startsWith('/family/estate-planning')) return 'estate-planning';
    if (location.startsWith('/family/home-buying')) return 'home-buying';
    if (location.startsWith('/family/starting-family')) return 'starting-family';
    if (location.startsWith('/family/when-someone-dies')) return 'when-someone-dies';
    return 'dashboard';
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false); // Close mobile sidebar when switching to desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      if (sidebar && !sidebar.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen]);

  const handleInboxClick = () => {
    setLeftSidebarOpen(true);
    setRemindersSidebarOpen(false); // Close reminders if open
    setIsMainMenuCollapsed(true); // ✅ Collapse main menu to icons
    if (onInboxClick) {
      onInboxClick();
    }
  };

  const handleRemindersClick = () => {
    setRemindersSidebarOpen(true);
    setLeftSidebarOpen(false); // Close inbox if open
    setIsMainMenuCollapsed(true); // ✅ Collapse main menu to icons
  };

  const handleLeftSidebarClose = () => {
    setLeftSidebarOpen(false);
    setIsMainMenuCollapsed(false); // ✅ Expand main menu back
  };

  const handleRemindersSidebarClose = () => {
    setRemindersSidebarOpen(false);
    setIsMainMenuCollapsed(false); // ✅ Expand main menu back
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, href: '/family' },
    { id: 'inbox', label: 'Inbox', icon: Inbox, href: '/family/inbox', onClick: handleInboxClick },
    { id: 'reminders', label: 'Reminders', icon: AlarmClock, href: '/family/reminders', onClick: handleRemindersClick },
    { id: 'family-ids', label: 'Family IDs', icon: Users, href: '/family/ids' },
    { id: 'finance', label: 'Finance', icon: DollarSign, href: '/family/finance' },
    { id: 'property', label: 'Property', icon: HomeIcon, href: '/family/property' },
    { id: 'passwords', label: 'Passwords', icon: Key, href: '/family/passwords' },
    { id: 'insurance', label: 'Insurance', icon: Umbrella, href: '/family/insurance' },
    { id: 'taxes', label: 'Taxes', icon: Receipt, href: '/family/taxes' },
    { id: 'legal', label: 'Legal', icon: Scale, href: '/family/legal' },
    { id: 'business', label: 'Business', icon: Building2, href: '/family/business' },
    { id: 'family-resources', label: 'Family Resources', icon: BookOpen, href: '/family/resources' },
    { id: 'child-information', label: 'Child Information', icon: Baby, href: '/family/child-information' },
    { id: 'elderly-parents', label: 'Elderly Parents', icon: UserCheck, href: '/family/elderly-parents' },
    { id: 'getting-married', label: 'Getting Married', icon: HeartHandshake, href: '/family/getting-married' },
    { id: 'international-travel', label: 'International Travel', icon: Plane, href: '/family/international-travel' },
    { id: 'moving', label: 'Moving', icon: Package, href: '/family/moving' },
    { id: 'disaster-planning', label: 'Disaster Planning', icon: AlertTriangle, href: '/family/disaster-planning' },
    { id: 'estate-planning', label: 'Estate Planning', icon: FileText, href: '/family/estate-planning' },
    { id: 'home-buying', label: 'Home Buying', icon: HouseIcon, href: '/family/home-buying' },
    { id: 'starting-family', label: 'Starting a Family', icon: FamilyIcon, href: '/family/starting-family' },
    { id: 'when-someone-dies', label: 'When Someone Dies', icon: Leaf, href: '/family/when-someone-dies' },
    { id: 'contacts', label: 'Contacts', icon: Phone, href: '/family/contacts' },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-900)]">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-850)] border-b border-[var(--line-700)] p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-[var(--ink-100)] hover:text-[var(--gold)] transition-colors"
              data-testid="mobile-sidebar-toggle"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] rounded-lg">
                <Heart className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--ink-100)]">Family Circle</h2>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className={`${isMobile ? 'hidden' : `${desktopSidebarCollapsed || isMainMenuCollapsed ? 'w-16' : 'w-64'} bg-[var(--bg-850)] border-r border-[var(--line-700)] flex flex-col fixed h-full z-40`}`} style={{ transition: 'width 300ms ease-in-out' }}>
        {/* Desktop Sidebar Header */}
        {!isMobile && (
          <div className="p-6 border-b border-[var(--line-700)] relative">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] rounded-lg">
                <Heart className="w-5 h-5 text-black" />
              </div>
              {!desktopSidebarCollapsed && (
                <h2 className="text-lg font-semibold text-[var(--ink-100)] transition-opacity duration-200">
                  Family Circle Secure
                </h2>
              )}
            </div>
            
            {/* Desktop Toggle Button */}
            <button
              onClick={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[var(--bg-850)] border border-[var(--line-700)] rounded-full p-1.5 text-[var(--ink-300)] hover:text-[var(--gold)] hover:bg-[var(--bg-800)] transition-all duration-200 shadow-lg z-10"
              data-testid="desktop-sidebar-toggle"
              title={desktopSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {desktopSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Desktop Sidebar Navigation */}
        {!isMobile && (
          <nav id="desktop-sidebar-nav" className="flex-1 py-4 overflow-y-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection;
              
              // Special handling for Family IDs with submenu using Radix Popover
              if (item.id === 'family-ids') {
                const [open, setOpen] = useState(false);
                const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
                const canShow = !desktopSidebarCollapsed && !isMainMenuCollapsed;
                
                const handleMouseEnter = () => {
                  if (hoverTimeout) {
                    clearTimeout(hoverTimeout);
                    setHoverTimeout(null);
                  }
                  setOpen(true);
                };
                
                const handleMouseLeave = () => {
                  const timeout = setTimeout(() => {
                    setOpen(false);
                  }, 150); // 150ms delay before closing
                  setHoverTimeout(timeout);
                };
                
                return (
                  <div key={item.id} className="relative group">
                    <Popover.Root open={open && canShow} onOpenChange={setOpen}>
                      <Popover.Trigger asChild>
                        <div
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          className="relative"
                        >
                          <Link
                            to={item.href}
                            onClick={() => setActiveSection(item.id)}
                            className={`sidebar-nav-link group flex items-center ${desktopSidebarCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-sm font-medium transition-all duration-200 relative ${
                              isActive
                                ? 'text-[#c5a000] border-r-2 border-[#c5a000] bg-[var(--bg-800)]'
                                : 'text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[var(--bg-800)] focus:text-[#c5a000]'
                            }`}
                            data-testid={`sidebar-${item.id}`}
                            style={isActive ? { color: '#c5a000' } : {}}
                          >
                            <div className={`relative ${isActive && desktopSidebarCollapsed ? 'ring-2 ring-[var(--gold)] ring-opacity-50 rounded-lg p-1' : ''}`}>
                              <Icon className={`w-5 h-5 ${desktopSidebarCollapsed ? '' : 'mr-3'} transition-colors ${
                                isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-300)] group-hover:text-[var(--gold)]'
                              }`} />
                            </div>
                            {!desktopSidebarCollapsed && (
                              <span className={`transition-opacity duration-200 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                            )}
                          </Link>
                        </div>
                      </Popover.Trigger>

                      <Popover.Portal>
                        <Popover.Content
                          side="right"
                          align="start"
                          sideOffset={8}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          className="z-[9999] w-64 bg-[var(--bg-850)] border-r border-[var(--line-700)] shadow-xl outline-none"
                        >
                          <span className="pointer-events-none absolute -left-2 top-4 h-3 w-3 rotate-45 bg-[var(--bg-850)] border-l border-t border-[var(--line-700)]" />
                          
                          <div className="p-6 border-b border-[var(--line-700)]">
                            <div className="text-xs font-medium text-[var(--ink-400)]">Family Members</div>
                          </div>
                          
                          <nav className="py-4">
                            <Link
                              to="/family/ids/kassandra-santana"
                              className="sidebar-nav-link group flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[rgba(212,175,55,0.14)] focus:text-[#c5a000]"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-xs font-semibold mr-3 transition-colors group-hover:text-black">
                                KS
                              </div>
                              <div className="flex-1">
                                <div className="text-[var(--ink-100)] group-hover:text-[#c5a000] leading-tight">Kassandra Santana</div>
                                <div className="text-[11px] text-zinc-500 group-hover:text-[#c5a000] opacity-70">Main Household, Parent</div>
                              </div>
                            </Link>
                            
                            <Link
                              to="/family/ids/angel-quintana"
                              className="sidebar-nav-link group flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[rgba(212,175,55,0.14)] focus:text-[#c5a000]"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#3498DB] flex items-center justify-center text-white text-xs font-semibold mr-3 transition-colors group-hover:text-white">
                                AQ
                              </div>
                              <div className="flex-1">
                                <div className="text-[var(--ink-100)] group-hover:text-[#c5a000] leading-tight">Angel Quintana</div>
                                <div className="text-[11px] text-zinc-500 group-hover:text-[#c5a000] opacity-70">Husband, Parent</div>
                              </div>
                            </Link>
                            
                            <Link
                              to="/family/ids/emma-johnson"
                              className="sidebar-nav-link group flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[rgba(212,175,55,0.14)] focus:text-[#c5a000]"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#2ECC71] flex items-center justify-center text-white text-xs font-semibold mr-3 transition-colors group-hover:text-white">
                                EJ
                              </div>
                              <div className="flex-1">
                                <div className="text-[var(--ink-100)] group-hover:text-[#c5a000] leading-tight">Emma Johnson</div>
                                <div className="text-[11px] text-zinc-500 group-hover:text-[#c5a000] opacity-70">Child</div>
                              </div>
                            </Link>
                            
                            <Link
                              to="/family/ids/linda-johnson"
                              className="sidebar-nav-link group flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[rgba(212,175,55,0.14)] focus:text-[#c5a000]"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#E74C3C] flex items-center justify-center text-white text-xs font-semibold mr-3 transition-colors group-hover:text-white">
                                LJ
                              </div>
                              <div className="flex-1">
                                <div className="text-[var(--ink-100)] group-hover:text-[#c5a000] leading-tight">Linda Johnson</div>
                                <div className="text-[11px] text-zinc-500 group-hover:text-[#c5a000] opacity-70">Grandparent</div>
                              </div>
                            </Link>
                          </nav>
                          
                          <div className="p-6 border-t border-[var(--line-700)]">
                            <Link
                              to="/family/ids"
                              className="sidebar-nav-link group flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative text-[#c5a000] hover:text-[var(--gold)] focus:text-[var(--gold)]"
                            >
                              <UserPlus className="w-5 h-5 mr-3 transition-colors group-hover:text-[#D4AF37]" />
                              <span className="group-hover:text-[var(--gold)]">Add Family Member</span>
                            </Link>
                          </div>
                        </Popover.Content>
                      </Popover.Portal>
                      
                      {/* Tooltip for collapsed state */}
                      {desktopSidebarCollapsed && (
                        <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-900)] text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-[var(--line-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                          {item.label}
                          <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[var(--bg-900)] border-l border-b border-[var(--line-700)] rotate-45"></div>
                        </div>
                      )}
                    </Popover.Root>
                  </div>
                );
              }
              
              // Regular menu items
              return item.onClick ? (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      item.onClick();
                    }}
                    className={`sidebar-nav-link group flex items-center w-full ${desktopSidebarCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#c5a000] border-r-2 border-[#c5a000] bg-[var(--bg-800)]'
                        : 'text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[var(--bg-800)] focus:text-[#c5a000]'
                    } [&:hover]:!text-[#c5a000]`}
                    data-testid={`sidebar-${item.id}`}
                    style={isActive ? { color: '#c5a000' } : {}}
                  >
                    <div className={`relative ${isActive && desktopSidebarCollapsed ? 'ring-2 ring-[var(--gold)] ring-opacity-50 rounded-lg p-1' : ''}`}>
                      <Icon className={`w-5 h-5 ${desktopSidebarCollapsed ? '' : 'mr-3'} transition-colors ${
                        isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-300)] group-hover:text-[var(--gold)]'
                      }`} />
                    </div>
                    {!desktopSidebarCollapsed && (
                      <span className={`transition-opacity duration-200 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                    )}
                  </button>
                  
                  {/* Tooltip for collapsed state */}
                  {desktopSidebarCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-900)] text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-[var(--line-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[var(--bg-900)] border-l border-b border-[var(--line-700)] rotate-45"></div>
                    </div>
                  )}
                </div>
              ) : (
                <div key={item.id} className="relative group">
                  <Link
                    to={item.href}
                    onClick={() => setActiveSection(item.id)}
                    className={`sidebar-nav-link group flex items-center ${desktopSidebarCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-[#c5a000] border-r-2 border-[#c5a000] bg-[var(--bg-800)]'
                        : 'text-[var(--ink-300)] hover:text-[#c5a000] hover:bg-[var(--bg-800)] focus:text-[#c5a000]'
                    }`}
                    data-testid={`sidebar-${item.id}`}
                    style={isActive ? { color: '#c5a000' } : {}}
                  >
                    <div className={`relative ${isActive && desktopSidebarCollapsed ? 'ring-2 ring-[var(--gold)] ring-opacity-50 rounded-lg p-1' : ''}`}>
                      <Icon className={`w-5 h-5 ${desktopSidebarCollapsed ? '' : 'mr-3'} transition-colors ${
                        isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-300)] group-hover:text-[var(--gold)]'
                      }`} />
                    </div>
                    {!desktopSidebarCollapsed && (
                      <span className={`transition-opacity duration-200 ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                    )}
                  </Link>
                  
                  {/* Tooltip for collapsed state */}
                  {desktopSidebarCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-[var(--bg-900)] text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-[var(--line-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[var(--bg-900)] border-l border-b border-[var(--line-700)] rotate-45"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Desktop Sidebar Footer */}
        {!isMobile && (
          <div className="p-6 border-t border-[var(--line-700)]">
            <Link
              to="/family/referrals"
              className={`flex items-center text-sm font-medium text-[#2ECC71] hover:text-[var(--gold)] transition-colors group ${
                desktopSidebarCollapsed ? 'justify-center' : ''
              }`}
              title={desktopSidebarCollapsed ? 'Refer & earn' : ''}
            >
              <DollarSign className={`w-4 h-4 ${desktopSidebarCollapsed ? '' : 'mr-2'} group-hover:text-[#D4AF37]`} />
              {!desktopSidebarCollapsed && (
                <span className="transition-opacity duration-200">Refer & earn</span>
              )}
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          id="mobile-sidebar"
          className={`fixed top-0 left-0 h-full w-80 bg-[var(--bg-850)] border-r border-[var(--line-700)] z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-6 border-b border-[var(--line-700)] pt-20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] rounded-lg">
                <Heart className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--ink-100)]">Family Circle</h2>
            </div>
          </div>

          {/* Mobile Sidebar Navigation */}
          <nav id="mobile-sidebar-nav" className="flex-1 py-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection;
              return item.onClick ? (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                    item.onClick();
                  }}
                  className={`sidebar-nav-link flex items-center w-full px-6 py-4 text-sm font-medium transition-all duration-200 relative group touch-manipulation ${
                    isActive
                      ? 'text-[var(--gold)] border-r-2 border-[var(--gold)] bg-[var(--bg-800)]'
                      : 'text-[var(--ink-300)]'
                  }`}
                  data-testid={`mobile-sidebar-${item.id}`}
                >
                  <Icon className={`w-6 h-6 mr-4 transition-colors ${
                    isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-300)] group-hover:text-[var(--gold)]'
                  }`} />
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                  className={`sidebar-nav-link flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 relative group touch-manipulation ${
                    isActive
                      ? 'text-[var(--gold)] border-r-2 border-[var(--gold)] bg-[var(--bg-800)]'
                      : 'text-[var(--ink-300)]'
                  }`}
                  data-testid={`mobile-sidebar-${item.id}`}
                >
                  <Icon className={`w-6 h-6 mr-4 transition-colors ${
                    isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-300)] group-hover:text-[var(--gold)]'
                  }`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Sidebar Footer */}
          <div className="p-6 border-t border-[var(--line-700)]">
            <Link
              to="/family/referrals"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center text-sm font-medium text-[#2ECC71] hover:text-[var(--gold)] transition-colors group touch-manipulation"
            >
              <DollarSign className="w-5 h-5 mr-3 group-hover:text-[#D4AF37]" />
              Refer & earn
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isMobile 
          ? 'pt-16' 
          : (desktopSidebarCollapsed || isMainMenuCollapsed)
            ? 'ml-16' 
            : 'ml-64'
      }`}>
        {children}
      </div>

      {/* Enhanced Left Sidebar */}
      <EnhancedLeftSidebar
        isOpen={leftSidebarOpen}
        onClose={handleLeftSidebarClose}
        mainMenuWidth={isMainMenuCollapsed ? 64 : 256}
        documents={[]} // This will be populated with actual documents
        onDocumentAnalyze={(doc, analysis) => {
          console.log('Document analyzed:', doc, analysis);
        }}
        onDocumentRoute={(doc, person) => {
          console.log('Document routed:', doc, person);
        }}
      />

      {/* Enhanced Reminders Sidebar */}
      <EnhancedRemindersSidebar
        isOpen={remindersSidebarOpen}
        onClose={handleRemindersSidebarClose}
        mainMenuWidth={isMainMenuCollapsed ? 64 : 256}
      />
    </div>
  );
}
