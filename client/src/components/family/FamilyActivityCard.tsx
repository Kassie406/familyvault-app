import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Activity, Filter, RefreshCw, Clock, ChevronDown } from 'lucide-react';
import { ActivityItem, ActivityFilter, ActivityTimeRange, ActivityResponse } from '@/lib/activity/types';
import { getActivityIcon, getSeverityColor } from '@/lib/activity/emit';

interface FamilyActivityCardProps {
  className?: string;
}

export function FamilyActivityCard({ className = '' }: FamilyActivityCardProps) {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('7d');
  const [lastSeen, setLastSeen] = useState<string>(new Date().toISOString());
  const [newItemsCount, setNewItemsCount] = useState(0);
  const [showNewItemsToast, setShowNewItemsToast] = useState(false);

  // Fetch activity data
  const { data: activityData, isLoading, refetch } = useQuery<ActivityResponse>({
    queryKey: ['/api/activity', filter, timeRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('limit', '10');
      params.append('timeRange', timeRange);
      
      if (filter === 'me') {
        // TODO: Filter by current user's activities
      } else if (filter === 'alerts') {
        params.append('severity', 'warning,critical');
      }
      
      const response = await fetch(`/api/activity?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      return response.json();
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Check for new items since last seen
  useEffect(() => {
    if (!activityData?.items) return;
    
    const newItems = activityData.items.filter(item => 
      new Date(item.createdAt) > new Date(lastSeen)
    );
    
    if (newItems.length > 0) {
      setNewItemsCount(newItems.length);
      setShowNewItemsToast(true);
    }
  }, [activityData, lastSeen]);

  const handleItemClick = (item: ActivityItem) => {
    // Mark as read
    markAsRead([item.id]);
    // Navigate to the item
    setLocation(item.link);
  };

  const markAsRead = async (ids: string[]) => {
    try {
      await fetch('/api/activity/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      refetch();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/activity/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      refetch();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const refreshActivity = () => {
    setLastSeen(new Date().toISOString());
    setShowNewItemsToast(false);
    setNewItemsCount(0);
    refetch();
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const activities = activityData?.items || [];
  const unreadCount = activities.filter(item => !item.read).length;

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-4 h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-[#D4AF37]/10">
          <Activity className="h-5 w-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1">
          <h3 className="text-gray-200 font-semibold">Family Activity</h3>
          <p className="text-xs text-gray-500">Recent family updates</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshActivity}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          {(['all', 'me', 'alerts'] as ActivityFilter[]).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                filter === filterOption
                  ? 'bg-[#D4AF37] text-black font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {filterOption === 'all' ? 'All' : filterOption === 'me' ? 'Me' : 'Alerts'}
            </button>
          ))}
        </div>
        
        <div className="ml-auto flex items-center gap-1">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as ActivityTimeRange)}
            className="text-xs bg-transparent text-white/70 border-none outline-none cursor-pointer"
          >
            <option value="7d">7d</option>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
          </select>
          <ChevronDown className="h-3 w-3 text-white/50" />
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* New Items Toast */}
      {showNewItemsToast && (
        <div className="mb-3 p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg">
          <button
            onClick={refreshActivity}
            className="w-full text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
          >
            {newItemsCount} new update{newItemsCount > 1 ? 's' : ''} • Click to refresh
          </button>
        </div>
      )}

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto" aria-live="polite">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-2">
                <div className="w-7 h-7 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-white/10 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-white/10 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-white/70 mb-2">No recent activity yet</p>
            <p className="text-xs text-white/50">Activity will appear here as your family uses the app</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {activities.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a1a20] cursor-pointer transition-colors"
                onClick={() => handleItemClick(item)}
                aria-label={`${item.title} – ${formatTimeAgo(item.createdAt)}`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#15151a] text-sm">
                  {getActivityIcon(item.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white">{item.title}</div>
                  <div className="text-xs opacity-70 text-white/60">
                    {item.source} • {formatTimeAgo(item.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.severity && item.severity !== 'info' && (
                    <span className={`h-2 w-2 rounded-full ${getSeverityColor(item.severity)}`} />
                  )}
                  {!item.read && (
                    <span className="h-2 w-2 rounded-full bg-[#c5a000]" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <button
          onClick={() => setLocation('/activity')}
          className="w-full text-sm text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors text-center"
        >
          View all activity →
        </button>
      </div>
    </div>
  );
}
