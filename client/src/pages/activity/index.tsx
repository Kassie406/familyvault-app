import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Activity, 
  Filter, 
  RefreshCw, 
  ArrowLeft, 
  ChevronDown,
  Search,
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react';
import { ActivityItem, ActivityFilter, ActivityTimeRange, ActivityResponse } from '@/lib/activity/types';
import { getActivityIcon, getSeverityColor } from '@/lib/activity/emit';

export default function ActivityPage() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<ActivityFilter>('all');
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');
  const [cursor, setCursor] = useState<string | undefined>();
  const [allItems, setAllItems] = useState<ActivityItem[]>([]);

  // Fetch activity data
  const { data: activityData, isLoading, refetch } = useQuery<ActivityResponse>({
    queryKey: ['/api/activity', filter, timeRange, selectedSeverity, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('limit', '50');
      params.append('timeRange', timeRange);
      
      if (filter === 'me') {
        // TODO: Filter by current user's activities
      } else if (filter === 'alerts') {
        params.append('severity', 'warning,critical');
      }
      
      if (selectedSeverity) {
        params.append('severity', selectedSeverity);
      }
      
      const response = await fetch(`/api/activity?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }
      return response.json();
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Update all items when data changes
  useEffect(() => {
    if (activityData?.items) {
      if (cursor) {
        // Append new items for pagination
        setAllItems(prev => [...prev, ...activityData.items]);
      } else {
        // Replace items for new query
        setAllItems(activityData.items);
      }
    }
  }, [activityData, cursor]);

  // Reset pagination when filters change
  useEffect(() => {
    setCursor(undefined);
    setAllItems([]);
  }, [filter, timeRange, selectedSeverity, searchQuery]);

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

  const loadMore = () => {
    if (activityData?.nextCursor) {
      setCursor(activityData.nextCursor);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return date.toLocaleDateString();
  };

  // Filter items by search query
  const filteredItems = allItems.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.summary?.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.actor?.name.toLowerCase().includes(query)
    );
  });

  const unreadCount = filteredItems.filter(item => !item.read).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLocation('/family')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-white/70" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                  <Activity className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Family Activity</h1>
                  <p className="text-sm text-white/60">
                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                    {filteredItems.length > 0 && ` • ${filteredItems.length} total`}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="h-5 w-5 text-white/70" />
              </button>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-lg hover:bg-[#D4AF37]/80 transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <input
                type="text"
                placeholder="Search activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              />
            </div>
            
            {/* Filter Chips */}
            <div className="flex items-center gap-2">
              {(['all', 'me', 'alerts'] as ActivityFilter[]).map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    filter === filterOption
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'bg-zinc-800 text-white/70 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {filterOption === 'all' ? 'All' : filterOption === 'me' ? 'Me' : 'Alerts'}
                </button>
              ))}
            </div>
            
            {/* Time Range */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-white/50" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as ActivityTimeRange)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            
            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-white/50" />
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">All priorities</option>
                <option value="critical">Critical only</option>
                <option value="warning">Warning & Critical</option>
                <option value="info">Info only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        {isLoading && filteredItems.length === 0 ? (
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-zinc-900 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No activity found</h3>
            <p className="text-white/60 mb-6">
              {searchQuery 
                ? `No results for "${searchQuery}". Try adjusting your search or filters.`
                : 'Activity will appear here as your family uses the app.'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-zinc-900 hover:bg-zinc-800 rounded-lg p-4 transition-colors cursor-pointer border border-zinc-800 hover:border-zinc-700"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-lg">
                      {getActivityIcon(item.type)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1">{item.title}</h3>
                        {item.summary && (
                          <p className="text-sm text-white/70 mb-2">{item.summary}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span>{item.source}</span>
                          {item.actor && <span>by {item.actor.name}</span>}
                          <span>{formatTimeAgo(item.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {item.severity && item.severity !== 'info' && (
                          <span className={`h-2 w-2 rounded-full ${getSeverityColor(item.severity)}`} />
                        )}
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-[#c5a000]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Load More Button */}
            {activityData?.hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={loadMore}
                  className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Load more activity
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
