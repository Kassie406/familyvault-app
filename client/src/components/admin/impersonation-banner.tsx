import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, X, Clock, User, Shield 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface ImpersonationStatus {
  active: boolean;
  sessionId?: string;
  targetId?: string;
  targetEmail?: string;
  expiresAt?: string;
}

export default function ImpersonationBanner() {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState<string>('');

  const { data: status } = useQuery({
    queryKey: ['/api/admin/impersonation/status'],
    queryFn: async () => {
      const response = await fetch('/api/admin/impersonation/status');
      if (!response.ok) return { active: false };
      return response.json() as ImpersonationStatus;
    },
    refetchInterval: 5000, // Check every 5 seconds
  });

  const stopMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/impersonation/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'ended-by-banner' }),
      });
      if (!response.ok) throw new Error('Failed to stop impersonation');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Impersonation session ended' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/impersonation/status'] });
    },
    onError: () => {
      toast({ title: 'Failed to end impersonation', variant: 'destructive' });
    },
  });

  // Update countdown timer
  useEffect(() => {
    if (!status?.active || !status.expiresAt) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(status.expiresAt!).getTime();
      const difference = expires - now;

      if (difference > 0) {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Expired');
        // Auto-refresh to check if session is still active
        queryClient.invalidateQueries({ queryKey: ['/api/admin/impersonation/status'] });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [status, queryClient]);

  // Handle keyboard shortcut (⌥Esc)
  useEffect(() => {
    if (!status?.active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'Escape') {
        event.preventDefault();
        stopMutation.mutate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [status?.active, stopMutation]);

  if (!status?.active) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert className="border-red-500 bg-red-50 rounded-none border-b-2 border-l-0 border-r-0 border-t-0">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between w-full text-red-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <strong>Admin Impersonation Active</strong>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="h-3 w-3" />
              <span>Impersonating: {status.targetEmail || status.targetId}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <Badge className="bg-red-100 text-red-800 border-red-200">
                {timeLeft}
              </Badge>
            </div>
            
            <div className="text-xs opacity-75">
              Press ⌥Esc to stop
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => stopMutation.mutate()}
            disabled={stopMutation.isPending}
            data-testid="button-stop-impersonation-banner"
          >
            <X className="h-3 w-3 mr-1" />
            Stop Impersonation
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}