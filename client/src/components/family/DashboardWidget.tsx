import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  FileText, 
  MessageCircle, 
  Shield,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Zap,
  MoreHorizontal,
  Eye,
  EyeOff,
  Settings,
  Maximize2,
  X
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

type WidgetType = 'stats' | 'activity' | 'reminders' | 'members' | 'security' | 'messages' | 'calendar';

type Widget = {
  id: string;
  type: WidgetType;
  title: string;
  position: { row: number; col: number };
  size: { width: number; height: number };
  visible: boolean;
  config?: any;
};

type DashboardStats = {
  totalMembers: number;
  totalDocuments: number;
  unreadMessages: number;
  upcomingEvents: number;
  securityScore: number;
  storageUsed: number;
  lastBackup: string;
};

interface DashboardWidgetProps {
  widget: Widget;
  onToggleVisibility?: (widgetId: string) => void;
  onRemove?: (widgetId: string) => void;
  onConfigure?: (widgetId: string) => void;
}

const getWidgetIcon = (type: WidgetType) => {
  switch (type) {
    case 'stats': return TrendingUp;
    case 'activity': return Clock;
    case 'reminders': return AlertTriangle;
    case 'members': return Users;
    case 'security': return Shield;
    case 'messages': return MessageCircle;
    case 'calendar': return Calendar;
    default: return Star;
  }
};

export function DashboardWidget({ 
  widget, 
  onToggleVisibility, 
  onRemove, 
  onConfigure 
}: DashboardWidgetProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch widget-specific data
  const { data, isLoading } = useQuery({
    queryKey: [`/api/dashboard/widget/${widget.type}`, widget.config],
    enabled: widget.visible,
    refetchInterval: widget.type === 'stats' ? 60000 : 30000, // Different refresh rates
  });

  const IconComponent = getWidgetIcon(widget.type);

  const renderWidgetContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#D4AF37] border-t-transparent"></div>
        </div>
      );
    }

    switch (widget.type) {
      case 'stats':
        return <StatsWidget data={data as DashboardStats} />;
      case 'activity':
        return <ActivityWidget data={data} />;
      case 'reminders':
        return <RemindersWidget data={data} />;
      case 'members':
        return <MembersWidget data={data} />;
      case 'security':
        return <SecurityWidget data={data} />;
      case 'messages':
        return <MessagesWidget data={data} />;
      case 'calendar':
        return <CalendarWidget data={data} />;
      default:
        return <div className="p-4 text-white/60">Widget content</div>;
    }
  };

  if (!widget.visible) return null;

  return (
    <LuxuryCard 
      className={`relative ${isExpanded ? 'fixed inset-4 z-50' : ''} transition-all duration-300`}
      style={{
        gridColumn: `span ${widget.size.width}`,
        gridRow: `span ${widget.size.height}`
      }}
    >
      {/* Widget Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
            <IconComponent className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <h3 className="font-medium text-white">{widget.title}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              data-testid={`button-minimize-${widget.id}`}
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          )}
          
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              data-testid={`button-expand-${widget.id}`}
            >
              <Maximize2 className="h-4 w-4 text-white/70" />
            </button>
          )}
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              data-testid={`button-menu-${widget.id}`}
            >
              <MoreHorizontal className="h-4 w-4 text-white/70" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-[var(--bg-800)] border border-white/10 rounded-lg shadow-lg z-10">
                <div className="p-1">
                  <button
                    onClick={() => {
                      onConfigure?.(widget.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                  <button
                    onClick={() => {
                      onToggleVisibility?.(widget.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10 rounded transition-colors"
                  >
                    {widget.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {widget.visible ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => {
                      onRemove?.(widget.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Content */}
      <div className="p-4 flex-1 overflow-hidden">
        {renderWidgetContent()}
      </div>
    </LuxuryCard>
  );
}

// Individual widget components
function StatsWidget({ data }: { data?: DashboardStats }) {
  if (!data) return null;

  const stats = [
    { label: 'Family Members', value: data.totalMembers, icon: Users, color: 'text-blue-400' },
    { label: 'Documents', value: data.totalDocuments, icon: FileText, color: 'text-green-400' },
    { label: 'Unread Messages', value: data.unreadMessages, icon: MessageCircle, color: 'text-purple-400' },
    { label: 'Security Score', value: `${data.securityScore}%`, icon: Shield, color: 'text-[#D4AF37]' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div key={stat.label} className="text-center">
            <div className={`inline-flex p-2 rounded-lg bg-white/5 mb-2 ${stat.color}`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/60">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function ActivityWidget({ data }: { data?: any }) {
  // Simplified activity display
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
        <MessageCircle className="h-4 w-4 text-blue-400" />
        <div className="flex-1">
          <div className="text-sm text-white">New family message</div>
          <div className="text-xs text-white/60">2 minutes ago</div>
        </div>
      </div>
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
        <FileText className="h-4 w-4 text-green-400" />
        <div className="flex-1">
          <div className="text-sm text-white">Document uploaded</div>
          <div className="text-xs text-white/60">1 hour ago</div>
        </div>
      </div>
    </div>
  );
}

function RemindersWidget({ data }: { data?: any }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[#D4AF37]">
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Insurance renewal due</span>
      </div>
      <div className="text-xs text-white/60">Due in 3 days</div>
    </div>
  );
}

function MembersWidget({ data }: { data?: any }) {
  const members = [
    { name: 'John Doe', status: 'online', avatar: 'JD' },
    { name: 'Jane Doe', status: 'offline', avatar: 'JA' },
    { name: 'Alex Doe', status: 'away', avatar: 'AD' }
  ];

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.name} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs text-[#D4AF37] font-medium">
            {member.avatar}
          </div>
          <div className="flex-1">
            <div className="text-sm text-white">{member.name}</div>
            <div className={`text-xs ${member.status === 'online' ? 'text-green-400' : 'text-white/60'}`}>
              {member.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SecurityWidget({ data }: { data?: any }) {
  return (
    <div className="text-center">
      <div className="inline-flex p-3 rounded-full bg-green-400/10 mb-3">
        <CheckCircle className="h-6 w-6 text-green-400" />
      </div>
      <div className="text-lg font-semibold text-white mb-1">Secure</div>
      <div className="text-sm text-white/60">All family accounts protected</div>
    </div>
  );
}

function MessagesWidget({ data }: { data?: any }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[#D4AF37] mb-2">3</div>
      <div className="text-sm text-white/60">Unread messages</div>
      <button className="mt-2 text-xs text-[#D4AF37] hover:text-[#D4AF37]/80">
        View all
      </button>
    </div>
  );
}

function CalendarWidget({ data }: { data?: any }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-white font-medium">Today</div>
      <div className="p-2 rounded-lg bg-white/5">
        <div className="text-sm text-white">Family dinner</div>
        <div className="text-xs text-white/60">6:00 PM</div>
      </div>
    </div>
  );
}

export default DashboardWidget;