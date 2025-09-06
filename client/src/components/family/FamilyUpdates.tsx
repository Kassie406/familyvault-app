import { useState, useEffect } from 'react';
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
  Bell
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';
import { apiRequest } from '@/lib/queryClient';
import ComposeUpdateModal from './ComposeUpdateModal';
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

export default function FamilyUpdates() {
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: userLoading } = useUserRole();
  
  // Fetch family updates
  const { data: updates = [], isLoading, refetch } = useQuery<FamilyUpdateType[]>({
    queryKey: ['/api/updates'],
    queryFn: async () => {
      const response = await fetch('/api/updates');
      const data = await response.json();
      return data.items || [];
    }
  });

  // Dismiss update mutation
  const dismissMutation = useMutation({
    mutationFn: async (updateId: string) => {
      return apiRequest(`/api/updates/${updateId}/dismiss`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/updates'] });
    }
  });

  const handleDismiss = (updateId: string) => {
    dismissMutation.mutate(updateId);
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
      {/* Admin compose button */}
      {isAdmin && (
        <div className="flex justify-end mb-2">
          <ComposeUpdateModal afterCreate={() => refetch()} />
        </div>
      )}
      
      <div className="space-y-3" data-testid="family-updates-list">
      {updates.map((update) => {
        const Icon = getUpdateIcon(update.type);
        const dueText = formatDueDate(update.dueAt);
        
        return (
          <div 
            key={update.id} 
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 transition-all duration-200 hover:border-zinc-700"
            data-testid={`update-item-${update.id}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Status dot and icon */}
                <div className="flex items-center gap-2 mt-0.5">
                  <span 
                    className={`inline-block h-2 w-2 rounded-full ${getSeverityColor(update.severity)}`}
                    data-testid={`severity-indicator-${update.severity}`}
                  />
                  <Icon className="h-4 w-4 text-white/60 flex-shrink-0" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm mb-1">
                    {update.title}
                  </div>
                  
                  {update.body && (
                    <div className="text-sm text-white/70 mb-2 leading-relaxed">
                      {update.body}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-white/50">
                    {dueText && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Due: {dueText}</span>
                      </div>
                    )}
                    {!dueText && (
                      <span>Action recommended</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {update.actionUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-200 h-8 px-3 text-xs"
                    onClick={() => window.location.href = update.actionUrl!}
                    data-testid={`action-button-${update.id}`}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Open
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200 h-8 w-8 p-0"
                  onClick={() => handleDismiss(update.id)}
                  disabled={dismissMutation.isPending}
                  data-testid={`dismiss-button-${update.id}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}