import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface SecurityPosture {
  score: number;
  subtitle: string;
  issues: Array<{
    type: 'bad' | 'warn' | 'ok';
    text: string;
  }>;
  actions: Array<{
    id: string;
    text: string;
    primary: boolean;
    handler: string;
  }>;
}

interface SecurityPostureSummaryProps {
  className?: string;
}

export default function SecurityPostureSummary({ className }: SecurityPostureSummaryProps) {
  const { toast } = useToast();
  const [ringOffset, setRingOffset] = useState(119.38); // Start at 0%

  const { data: posture, isLoading } = useQuery({
    queryKey: ['/api/admin/security/posture'],
    queryFn: async (): Promise<SecurityPosture> => {
      const response = await fetch('/api/admin/security/posture');
      if (!response.ok) throw new Error('Failed to fetch security posture');
      return await response.json();
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const actionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      const response = await fetch(`/api/admin/security/actions/${actionId}`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to execute action');
      return response.json();
    },
    onSuccess: (data, actionId) => {
      toast({
        title: 'Action completed',
        description: `Security action executed successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/security/posture'] });
    },
    onError: (error) => {
      toast({
        title: 'Action failed',
        description: 'Failed to execute security action',
        variant: 'destructive',
      });
    },
  });

  // Animate score ring when data loads
  useEffect(() => {
    if (posture?.score !== undefined) {
      const percentage = posture.score / 100;
      const circumference = 119.38; // 2 * π * r (where r = 19)
      const offset = circumference * (1 - percentage);
      
      // Animate from current offset to new offset
      const timer = setTimeout(() => {
        setRingOffset(offset);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [posture?.score]);

  const handleAction = async (actionId: string, handler: string) => {
    switch (handler) {
      case 'enable_2fa':
        // Navigate to 2FA settings or show modal
        break;
      case 'verify_chain':
        await actionMutation.mutateAsync(actionId);
        break;
      case 'rotate_keys':
        if (confirm('Rotate API keys? This will invalidate existing keys.')) {
          await actionMutation.mutateAsync(actionId);
        }
        break;
      case 'configure_ip':
        // Navigate to IP settings
        break;
      default:
        await actionMutation.mutateAsync(actionId);
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <section id="sec-posture" className="posture card" aria-label="Security posture summary">
          <div className="posture-left">
            <div className="score-ring" role="img" aria-label="Security score">
              <svg viewBox="0 0 44 44" width="52" height="52" aria-hidden="true">
                <circle cx="22" cy="22" r="19" className="ring-bg"/>
                <circle cx="22" cy="22" r="19" className="ring-val" strokeDasharray="119.38" strokeDashoffset="119.38"/>
              </svg>
              <div className="score-num">—</div>
            </div>
            <div>
              <div className="title">Security posture</div>
              <div className="subtle">Loading...</div>
            </div>
          </div>
          <div className="posture-issues"></div>
          <div className="posture-actions"></div>
        </section>
      </div>
    );
  }

  return (
    <div className={className}>
      <section id="sec-posture" className="posture card" aria-label="Security posture summary">
        <div className="posture-left">
          <div className="score-ring" role="img" aria-label="Security score">
            <svg viewBox="0 0 44 44" width="52" height="52" aria-hidden="true">
              <circle cx="22" cy="22" r="19" className="ring-bg"/>
              <circle 
                cx="22" 
                cy="22" 
                r="19" 
                className="ring-val" 
                strokeDasharray="119.38" 
                strokeDashoffset={ringOffset}
              />
            </svg>
            <div className="score-num" id="sp-score">
              {posture?.score ?? '—'}
            </div>
          </div>
          <div>
            <div className="title">Security posture</div>
            <div className="subtle" id="sp-subtitle">
              {posture?.subtitle ?? 'Calculating...'}
            </div>
          </div>
        </div>

        <div className="posture-issues" id="sp-issues">
          {posture?.issues?.map((issue, index) => (
            <span key={index} className={`issue ${issue.type}`}>
              {issue.text}
            </span>
          ))}
        </div>

        <div className="posture-actions">
          {posture?.actions?.map((action) => (
            <button 
              key={action.id}
              className={`btn ${action.primary ? 'primary' : ''}`}
              onClick={() => handleAction(action.id, action.handler)}
              disabled={actionMutation.isPending}
              data-testid={`button-action-${action.id}`}
            >
              {action.text}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}