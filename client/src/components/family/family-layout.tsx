import { useLocation, Link } from 'wouter';
import { useState } from 'react';
import { 
  Shield, Home, Users, FileText, MessageCircle, Bell, Settings,
  Calendar, Image, Heart, Menu, X, User, LogOut
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Family Home', icon: Home, href: '/family', description: 'Family dashboard' },
    { id: 'members', label: 'Family Members', icon: Users, href: '/family/members', description: 'Manage family profiles' },
    { id: 'documents', label: 'Documents', icon: FileText, href: '/family/documents', description: 'Shared family documents' },
    { id: 'messages', label: 'Family Chat', icon: MessageCircle, href: '/family/messages', description: 'Private family communication' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, href: '/family/calendar', description: 'Family schedule & events' },
    { id: 'photos', label: 'Photo Gallery', icon: Image, href: '/family/photos', description: 'Shared family memories' },
    { id: 'emergency', label: 'Emergency Info', icon: Shield, href: '/family/emergency', description: 'Critical family information' },
  ];

  const currentPath = location;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Family Portal Header */}
      <header className="bg-white shadow-sm border-b border-indigo-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FamilyCircle</h1>
                <p className="text-sm text-indigo-600 font-medium">Private Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigationItems.slice(0, 4).map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || 
                  (item.href !== '/family' && currentPath.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">Family Member</span>
              </div>

              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.href || 
                  (item.href !== '/family' && currentPath.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-gray-600">© 2025 FamilyCircle Secure - Private Family Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/family/settings" className="text-sm text-gray-600 hover:text-indigo-600">
                <Settings className="w-4 h-4 inline mr-1" />
                Settings
              </Link>
              <button className="text-sm text-gray-600 hover:text-red-600">
                <LogOut className="w-4 h-4 inline mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}