import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Zap, 
  MessageCircle, 
  Upload, 
  Users, 
  Search, 
  Calendar,
  Shield,
  Phone,
  CreditCard,
  FileText,
  Settings,
  Camera,
  MapPin,
  Heart,
  Key,
  ChevronRight,
  X
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';
import "@/styles/quick-access.css";

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href?: string;
  onClick?: () => void;
  color: string;
  category: 'communication' | 'documents' | 'emergency' | 'management';
};

const quickActions: QuickAction[] = [
  // Communication
  {
    id: 'send-message',
    title: 'Send Message',
    description: 'Quick family chat',
    icon: MessageCircle,
    href: '/family/messages',
    color: 'bg-blue-500 hover:bg-blue-600',
    category: 'communication'
  },
  {
    id: 'emergency-call',
    title: 'Emergency Call',
    description: 'Quick dial emergency contacts',
    icon: Phone,
    href: '/family/emergency-contacts',
    color: 'bg-red-500 hover:bg-red-600',
    category: 'emergency'
  },
  
  // Documents
  {
    id: 'upload-document',
    title: 'Upload Document',
    description: 'Add family document',
    icon: Upload,
    href: '/family/documents/upload',
    color: 'bg-green-500 hover:bg-green-600',
    category: 'documents'
  },
  {
    id: 'take-photo',
    title: 'Take Photo',
    description: 'Capture and save',
    icon: Camera,
    href: '/family/photos/capture',
    color: 'bg-purple-500 hover:bg-purple-600',
    category: 'documents'
  },
  
  // Emergency
  {
    id: 'safety-check',
    title: 'Safety Check',
    description: 'Send family safety status',
    icon: Shield,
    href: '/family/safety-check',
    color: 'bg-orange-500 hover:bg-orange-600',
    category: 'emergency'
  },
  {
    id: 'share-location',
    title: 'Share Location',
    description: 'Send current location',
    icon: MapPin,
    onClick: () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // In production, this would send location to family
          console.log('Location shared:', position.coords);
        });
      }
    },
    color: 'bg-indigo-500 hover:bg-indigo-600',
    category: 'emergency'
  },
  
  // Management
  {
    id: 'search-family',
    title: 'Search',
    description: 'Find family information',
    icon: Search,
    href: '/family/search',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    category: 'management'
  },
  {
    id: 'invite-member',
    title: 'Invite Member',
    description: 'Add family member',
    icon: Users,
    href: '/family/invite',
    color: 'bg-teal-500 hover:bg-teal-600',
    category: 'management'
  },
  {
    id: 'quick-settings',
    title: 'Settings',
    description: 'Account preferences',
    icon: Settings,
    href: '/family/settings',
    color: 'bg-gray-500 hover:bg-gray-600',
    category: 'management'
  }
];

interface QuickAccessPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAccessPanel({ isOpen, onClose }: QuickAccessPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All', icon: Zap },
    { id: 'communication', label: 'Chat', icon: MessageCircle },
    { id: 'documents', label: 'Files', icon: FileText },
    { id: 'emergency', label: 'Emergency', icon: Shield },
    { id: 'management', label: 'Manage', icon: Settings }
  ];

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <LuxuryCard id="quick-access-modal" className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
              <Zap className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Quick Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            data-testid="button-close-quick-access"
          >
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'bg-[#D4AF37] text-black font-medium' 
                      : 'text-white/70'
                  }`}
                  data-testid={`filter-${category.id}`}
                >
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredActions.map((action) => {
              const IconComponent = action.icon;
              
              const ActionButton = (
                <div
                  className="qa-tile p-4"
                  data-testid={`quick-action-${action.id}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${action.color} transition-all group-hover:scale-110`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                  
                  <h3 className="font-medium text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-white/60">
                    {action.description}
                  </p>
                </div>
              );

              if (action.href) {
                return (
                  <Link key={action.id} href={action.href} onClick={onClose}>
                    {ActionButton}
                  </Link>
                );
              }

              return (
                <div
                  key={action.id}
                  onClick={() => {
                    action.onClick?.();
                    onClose();
                  }}
                >
                  {ActionButton}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/50">
            Press <kbd className="px-2 py-1 bg-white/10 rounded text-[#D4AF37]">Ctrl+K</kbd> to open Quick Access anywhere
          </p>
        </div>
      </LuxuryCard>
    </div>
  );
}

export default QuickAccessPanel;