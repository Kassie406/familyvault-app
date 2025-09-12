import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { io, type Socket } from 'socket.io-client';
import { 
  Activity, 
  Filter, 
  RefreshCw,
  Clock,
  MessageCircle,
  FileText,
  Users,
  Shield,
  Calendar,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Share,
  Heart,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

type ActivityType = 
  | 'message' | 'document_upload' | 'document_view' | 'document_edit' | 'document_delete'
  | 'member_join' | 'member_leave' | 'member_update'
  | 'security_login' | 'security_logout' | 'security_change'
  | 'calendar_event' | 'calendar_update'
  | 'system_backup' | 'system_update'
  | 'share_link' | 'emergency_alert';

type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  metadata?: {
    filename?: string;
    memberCount?: number;
    documentType?: string;
    location?: string;
    ipAddress?: string;
    [key: string]: any;
  };
  priority: 'low' | 'medium' | 'high';
};

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'message': return MessageCircle;
    case 'document_upload': return Upload;
    case 'document_view': return Eye;
    case 'document_edit': return Edit;
    case 'document_delete': return Trash2;
    case 'member_join': case 'member_leave': case 'member_update': return Users;
    case 'security_login': case 'security_logout': case 'security_change': return Shield;
    case 'calendar_event': case 'calendar_update': return Calendar;
    case 'system_backup': case 'system_update': return RefreshCw;
    case 'share_link': return Share;
    case 'emergency_alert': return AlertTriangle;
    default: return Activity;
  }
};

const getActivityColor = (type: ActivityType, priority: string) => {
  if (priority === 'high') return 'text-red-400 bg-red-400/10 border-red-400/20';
  if (priority === 'medium') return 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20';
  
  switch (type) {
    case 'message': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'document_upload': case 'document_edit': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'document_view': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    case 'document_delete': return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'member_join': case 'member_update': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'member_leave': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    case 'security_login': case 'security_logout': case 'security_change': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'calendar_event': case 'calendar_update': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
    case 'share_link': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
    case 'emergency_alert': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

interface ActivityFeedProps {
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export function ActivityFeed({ limit = 10, showFilters = true, className = '' }: ActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | ActivityType>('all');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch initial activity data
  const { data: initialActivities = [], isLoading, refetch, isFetching } = useQuery<ActivityItem[]>({
    queryKey: ['/api/family/activity', filter, timeRange, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      params.append('timeRange', timeRange);
      params.append('limit', limit.toString());
      
      try {
        const res = await fetch(`/api/family/activity?${params.toString()}`);
        if (!res.ok) {
          console.warn('Activity API failed:', res.status);
          return []; // Return empty array on error
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.warn('Activity fetch error:', error);
        return []; // Return empty array on error
      }
    },
  });

  // State for real-time activities
  const [realtimeActivities, setRealtimeActivities] = useState<ActivityItem[]>([]);
  
  // Ensure we always have arrays to work with
  const safeInitialActivities = Array.isArray(initialActivities) ? initialActivities : [];
  const safeRealtimeActivities = Array.isArray(realtimeActivities) ? realtimeActivities : [];
  
  // Combine initial and real-time activities
  const activities = safeRealtimeActivities.length > 0 
    ? [...safeRealtimeActivities, ...safeInitialActivities].slice(0, limit)
    : safeInitialActivities;

  const filteredActivities = filter === 'all' 
    ? activities.slice(0, limit)
    : activities.filter(activity => activity && activity.type === filter).slice(0, limit);

  // Real-time Socket.IO connection for live activity updates
  useEffect(() => {
    const socket: Socket = io({
      path: "/socket.io/",
      auth: {
        user: {
          id: "current-user", // TODO: Get from auth context
          familyId: "family-1", // TODO: Get from user's family
          name: "Current User"
        }
      }
    });

    // Listen for real-time family activity updates
    socket.on("family:activity", (data) => {
      if (data.type === "activity:new" && data.activity) {
        const newActivity = data.activity as ActivityItem;
        setRealtimeActivities(prev => {
          // Avoid duplicates and keep most recent 20 activities
          const filtered = prev.filter(activity => activity.id !== newActivity.id);
          return [newActivity, ...filtered].slice(0, 20);
        });
        console.log("[ActivityFeed] Received real-time activity:", newActivity.title);
      }
    });

    // Join family room for activity updates
    socket.emit("family:join", { familyId: "family-1" });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []); // Run once on mount

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getActivityDescription = (activity: ActivityItem) => {
    let description = activity.description;
    
    if (activity.metadata?.filename) {
      description += ` (${activity.metadata.filename})`;
    }
    if (activity.metadata?.location) {
      description += ` in ${activity.metadata.location}`;
    }
    
    return description;
  };

  return (
    <LuxuryCard className={`${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
              <Activity className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Family Activity</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {showFilters && (
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4 text-white/70" />
              </button>
            )}
            <button
              onClick={async () => {
                setIsRefreshing(true);
                await refetch();
                // Minimum 1 second spin so user can see the feedback
                setTimeout(() => setIsRefreshing(false), 1000);
              }}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              data-testid="button-refresh-activity"
            >
              <RefreshCw className={`h-4 w-4 text-white/70 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFiltersPanel && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Activity Type</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  data-testid="select-activity-filter"
                >
                  <option value="all">All Activities</option>
                  <option value="message">Messages</option>
                  <option value="document_upload">Document Uploads</option>
                  <option value="member_join">Member Changes</option>
                  <option value="security_login">Security Events</option>
                  <option value="calendar_event">Calendar Events</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  data-testid="select-time-range"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity List */}
      <div className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type, activity.priority);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 group hover:bg-white/2 p-3 rounded-lg transition-colors"
                  data-testid={`activity-${activity.id}`}
                >
                  {/* Timeline connector */}
                  <div className="relative">
                    <div className={`p-2 rounded-lg border ${colorClass}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    {index < filteredActivities.length - 1 && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-px h-6 bg-white/10"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white text-sm">
                        {activity.title}
                      </h4>
                      {activity.priority === 'high' && (
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className="text-sm text-white/70 mb-2">
                      {getActivityDescription(activity)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{activity.author.name}</span>
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {activities.length > limit && (
        <div className="p-4 border-t border-white/10 text-center">
          <button className="text-sm text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors">
            View all activity
          </button>
        </div>
      )}
    </LuxuryCard>
  );
}

export default ActivityFeed;