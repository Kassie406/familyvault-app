import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Info, 
  Clock, 
  ExternalLink,
  X,
  Shield,
  Calendar,
  CreditCard,
  Heart,
  Users,
  Bell,
  PauseCircle,
  RefreshCw
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';
import { apiRequest } from '@/lib/queryClient';
import ComposeUpdateModal from './ComposeUpdateModal';
import SnoozeUntilModal from './SnoozeUntilModal';
import SnoozedList from './SnoozedList';
import { useUserRole } from '@/hooks/useUserRole';

type FamilyUpdateType = {
  id: string;
  type: string;
  title: string;
  body: string;
  severity: 'info' | 'warning' | 'urgent';
  dueAt: string | null;
  actionUrl: string | null;
  metadata: any;
  isDismissed: boolean;
  createdAt: string;
};

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'urgent':
      return 'bg-red-500';
    case 'warning':
      return 'bg-[#D4AF37]';
    default:
      return 'bg-blue-400';
  }
}

function getUpdateIcon(type: string) {
  switch (type) {
    case 'insurance_renewal':
      return CreditCard;
    case 'security_reminder':
      return Shield;
    case 'birthday':
      return Heart;
    case 'family_meeting':
      return Calendar;
    case 'password_security':
      return Shield;
    default:
      return Bell;
  }
}

function formatDueDate(dueAt: string | null) {
  if (!dueAt) return null;
  
  const date = new Date(dueAt);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0) return "Overdue";
  
  return date.toLocaleDateString();
}

const FamilyUpdates = forwardRef<{ refresh: () => Promise<void> }>((props, ref) => {
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: userLoading } = useUserRole();
  const [updates, setUpdates] = useState<FamilyUpdateType[]>([]);
  const [snoozedCount, setSnoozedCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch family updates
  const { data: updatesData = [], isLoading, refetch } = useQuery<FamilyUpdateType[]>({
    queryKey: ['/api/updates'],
    queryFn: async () => {
      const response = await fetch('/api/updates', { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await response.json();
      return data.items || [];
    }
  });

  // Update local state when data changes
  useEffect(() => {
    setUpdates(updatesData);
  }, [updatesData]);

  // Load snoozed count - memoized to prevent infinite re-renders
  const loadSnoozedCount = useCallback(async () => {
    try {
      const response = await fetch('/api/updates/snoozed/count', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const data = await response.json();
      setSnoozedCount(data.count || 0);
    } catch (error) {
      console.error('Failed to load snoozed count:', error);
    }
  }, []);

  // Internal refresh function with minimum 1s spin
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent double-firing
    
    setIsRefreshing(true);
    try {
      // Ensure spinner shows at least 1s so user sees it
      const minSpin = new Promise(resolve => setTimeout(resolve, 1000));
      await Promise.all([
        refetch(),
        loadSnoozedCount(),
        minSpin
      ]);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Expose refresh function via ref
  useImperativeHandle(ref, () => ({
    refresh: handleRefresh
  }));

  useEffect(() => {
    loadSnoozedCount();
  }, [loadSnoozedCount]);

  // Dismiss update mutation
  const dismissMutation = useMutation({
    mutationFn: async (updateId: string) => {
      const response = await fetch(`/api/updates/${updateId}/dismiss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/updates'] });
    }
  });

  const handleDismiss = (updateId: string) => {
    dismissMutation.mutate(updateId);
  };

  const handleSnoozed = (updateId: string) => {
    // Remove the snoozed update from the list immediately for better UX
    setUpdates(prev => prev.filter(update => update.id !== updateId));
    // Increment snoozed count
    setSnoozedCount(count => count + 1);
  };

  const handleRestored = (updateId: string) => {
    // Refetch updates when an item is restored from snooze
    refetch();
    // Decrement snoozed count
    setSnoozedCount(count => Math.max(0, count - 1));
  };

  if (isLoading || userLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse rounded-2xl bg-zinc-800 h-20"></div>
        <div className="animate-pulse rounded-2xl bg-zinc-800 h-20"></div>
        <div className="animate-pulse rounded-2xl bg-zinc-800 h-20"></div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Bell className="h-12 w-12 text-white/20 mb-4" />
        <div className="text-white/60 text-sm">
          No updates right now
        </div>
        <div className="text-white/40 text-xs mt-1">
          We'll notify you of important reminders and notices
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with snoozed count badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-white">Family Updates</h3>
          {snoozedCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] bg-[#D4AF37]/5">
              {snoozedCount} snoozed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-full px-2 py-2 text-zinc-300 bg-transparent ring-2 ring-[#D4AF37]/30 ring-offset-2 ring-offset-zinc-900 hover:ring-[#D4AF37]/50 disabled:opacity-100 disabled:cursor-wait transition-all duration-200"
            title="Refresh family updates"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          {/* Admin compose button */}
          {isAdmin && (
            <ComposeUpdateModal afterCreate={() => refetch()} />
          )}
        </div>
      </div>
      
      <div className="space-y-3" data-testid="family-updates-list">
      {updates.map((update) => {
        const Icon = getUpdateIcon(update.type);
        const dueText = formatDueDate(update.dueAt);
        
        return (
          <div 
            key={update.id} 
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 flex justify-between items-start transition-all duration-200 hover:border-zinc-700"
            data-testid={`update-item-${update.id}`}
          >
            <div className="flex-1 min-w-0">
              {/* Title with severity dot */}
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className={`inline-block h-2 w-2 rounded-full ${getSeverityColor(update.severity)}`}
                  data-testid={`severity-indicator-${update.severity}`}
                />
                <Icon className="h-4 w-4 text-white/60 flex-shrink-0" />
                <div className="font-semibold text-white">
                  {update.title}
                </div>
              </div>
              
              {/* Body text */}
              {update.body && (
                <div className="text-sm text-white/60 mb-2 ml-6">
                  {update.body}
                </div>
              )}
              
              {/* Due date or action text */}
              <div className="text-xs text-white/40 ml-6">
                {dueText ? `Due: ${dueText}` : 'Action recommended'}
              </div>
            </div>
            
            {/* Action buttons - vertical stack for better alignment */}
            <div className="flex flex-col gap-2 ml-4">
              {update.actionUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-200"
                  onClick={() => window.location.href = update.actionUrl!}
                  data-testid={`action-button-${update.id}`}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
              )}
              
              <div className="flex items-center gap-1">
                <SnoozeUntilModal 
                  update={update} 
                  onSnoozed={handleSnoozed} 
                />
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 h-8 w-8 p-0"
                    onClick={() => handleDismiss(update.id)}
                    disabled={dismissMutation.isPending}
                    data-testid={`dismiss-button-${update.id}`}
                    title="Dismiss for everyone"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      </div>
      
      <SnoozedList onRestored={handleRestored} />
    </div>
  );
});

FamilyUpdates.displayName = 'FamilyUpdates';
export default FamilyUpdates;