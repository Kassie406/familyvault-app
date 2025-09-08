import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Calendar, Target, CheckCircle } from 'lucide-react';
import type { CoupleActivity } from '@shared/schema';

const activityIcons = {
  memory: <Heart className="w-4 h-4 text-pink-400" />,
  plan_date: <Calendar className="w-4 h-4 text-blue-400" />,
  love_note: <Heart className="w-4 h-4 text-red-400" />,
  goal: <Target className="w-4 h-4 text-green-400" />,
  chore_complete: <CheckCircle className="w-4 h-4 text-purple-400" />
};

export default function ActivityFeed() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['/api/couple/activities', refreshKey],
    retry: false
  });

  // Listen for feed updates
  useEffect(() => {
    const handleFeedUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    document.addEventListener('feed:update', handleFeedUpdate);
    return () => document.removeEventListener('feed:update', handleFeedUpdate);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getActivityMessage = (activity: CoupleActivity) => {
    switch (activity.type) {
      case 'memory':
        return 'Added a memory';
      case 'plan_date':
        return 'Planned a date';
      case 'love_note':
        return 'Sent a love note';
      case 'goal':
        return 'Set a goal';
      case 'chore_complete':
        return 'Completed';
      default:
        return 'Activity';
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900" data-testid="activity-feed-loading">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="text-sm text-neutral-400">COUPLE'S CONNECTION — RECENT</div>
          <button className="text-sm text-[#D4AF37] hover:underline">View all</button>
        </div>
        <div className="p-8 text-center text-neutral-500">
          <div className="animate-pulse">Loading activities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900" data-testid="activity-feed">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="text-sm text-neutral-400">COUPLE'S CONNECTION — RECENT</div>
        <button 
          className="text-sm text-[#D4AF37] hover:underline transition-colors"
          data-testid="link-view-all"
        >
          View all
        </button>
      </div>
      
      {activities.length === 0 ? (
        <div className="p-6 text-center text-neutral-500" data-testid="text-no-activity">
          No recent activity
        </div>
      ) : (
        <div className="divide-y divide-neutral-800">
          {activities.map((activity: CoupleActivity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors"
              data-testid={`activity-item-${activity.id}`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {activityIcons[activity.type as keyof typeof activityIcons] || 
                   <div className="w-4 h-4 bg-neutral-600 rounded" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-neutral-200">
                    <span className="text-sm text-neutral-400">
                      {getActivityMessage(activity)}:
                    </span>
                    <span className="font-medium truncate">
                      {activity.title}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {formatDate(activity.createdAt || '')}
                  </div>
                  {activity.payload && typeof activity.payload === 'object' && 'details' in activity.payload && (
                    <div className="text-sm text-neutral-400 mt-1 truncate">
                      {activity.payload.details as string}
                    </div>
                  )}
                </div>
              </div>
              
              {activity.points !== 0 && (
                <div className="flex-shrink-0 ml-4">
                  <span 
                    className={`text-sm font-semibold ${
                      activity.points > 0 
                        ? 'text-[#D4AF37]' 
                        : 'text-red-400'
                    }`}
                    data-testid={`points-${activity.id}`}
                  >
                    {activity.points > 0 ? '+' : ''}{activity.points}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}