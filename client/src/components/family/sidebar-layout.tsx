import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useUI } from '@/lib/ui-store';
import {
  Home as HomeIcon, Inbox, AlarmClock, Users, DollarSign, 
  Key, Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, Heart, Baby, UserCheck, HeartHandshake, Plane, Package,
  AlertTriangle, FileText, Home as HouseIcon, Users as FamilyIcon, Leaf,
  Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed, setSidebarCollapsed, inboxOpen } = useUI();
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

  // Manage sidebar body attribute only (inbox is handled by UI store)
  useEffect(() => {
    document.body.toggleAttribute('data-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);


  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, href: '/family' },
    { id: 'inbox', label: 'Inbox', icon: Inbox, href: '/family/inbox' },
    { id: 'reminders', label: 'Reminders', icon: AlarmClock, href: '/family/reminders' },
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
      <div className={`app-sidebar ${isMobile ? 'hidden' : 'bg-[var(--bg-850)] border-r border-[var(--line-700)] flex flex-col'}`} data-collapsed={sidebarCollapsed ? "true" : "false"}>
        {/* Desktop Sidebar Header */}
        {!isMobile && (
          <div className="p-6 border-b border-[var(--line-700)] relative">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#D4AF37] rounded-lg">
                <Heart className="w-5 h-5 text-black" />
              </div>
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold text-[var(--ink-100)] transition-opacity duration-200">
                  Family Circle Secure
                </h2>
              )}
            </div>
            
            {/* Desktop Toggle Button */}
            <button
              onClick={() => !inboxOpen && setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[var(--bg-850)] border border-[var(--line-700)] rounded-full p-1.5 text-[var(--ink-300)] hover:text-[var(--gold)] hover:bg-[var(--bg-800)] transition-all duration-200 shadow-lg z-10"
              data-testid="desktop-sidebar-toggle"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
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
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setActiveSection(item.id)}
                  className={`sidebar-nav-link flex items-center ${sidebarCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-sm font-medium transition-all duration-200 relative group ${
                    isActive
                      ? 'text-[var(--gold)] border-r-2 border-[var(--gold)] bg-[var(--bg-800)]'
                      : 'text-[var(--ink-300)]'
                  }`}
                  data-testid={`sidebar-${item.id}`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} transition-colors ${
                    isActive ? 'text-[var(--gold)]' : 'text-[var(--ink-300)] group-hover:text-[var(--gold)]'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="transition-opacity duration-200">{item.label}</span>
                  )}
                </Link>
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
                sidebarCollapsed ? 'justify-center' : ''
              }`}
              title={sidebarCollapsed ? 'Refer & earn' : ''}
            >
              <DollarSign className={`w-4 h-4 ${sidebarCollapsed ? '' : 'mr-2'} group-hover:text-[#D4AF37]`} />
              {!sidebarCollapsed && (
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
              return (
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
      <div className={`app-main flex-1 ${
        isMobile 
          ? 'pt-16' 
          : ''
      }`}>
        {children}
      </div>
    </div>
  );
}