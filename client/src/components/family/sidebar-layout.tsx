import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home as HomeIcon, Inbox, AlarmClock, Users, DollarSign, 
  Key, Umbrella, Receipt, Scale, Building2, BookOpen, 
  Phone, Heart
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [location] = useLocation();
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
    return 'dashboard';
  });

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
    { id: 'contacts', label: 'Contacts', icon: Phone, href: '/family/contacts' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F8F8]">
      {/* Sidebar */}
      <div className="w-64 bg-[#111111] border-r border-gray-800 flex flex-col fixed h-full z-30">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#D4AF37] rounded-lg">
              <Heart className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-lg font-semibold text-white">Family Circle Secure</h2>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeSection;
            return (
              <Link
                key={item.id}
                to={item.href}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 relative group ${
                  isActive
                    ? 'text-[#D4AF37] border-r-2 border-[#D4AF37] bg-[#1a1a1a]'
                    : 'text-gray-300 hover:text-[#D4AF37] hover:bg-[#1a1a1a]'
                }`}
                data-testid={`sidebar-${item.id}`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? 'text-[#D4AF37]' : 'text-gray-400 group-hover:text-[#D4AF37]'
                }`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-800">
          <Link
            to="/family/referrals"
            className="flex items-center text-sm font-medium text-[#2ECC71] hover:text-[#D4AF37] transition-colors group"
          >
            <DollarSign className="w-4 h-4 mr-2 group-hover:text-[#D4AF37]" />
            Refer & earn
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}