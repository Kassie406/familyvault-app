import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Monitor, Smartphone, Tablet, Globe, Shield, 
  Clock, MapPin, X, Eye, AlertTriangle, 
  CheckCircle, RefreshCw, Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface AdminSession {
  id: string;
  userId: string;
  sessionToken: string;
  deviceType: string;
  deviceName?: string;
  browser?: string;
  os?: string;
  ip: string;
  location?: string;
  isActive: boolean;
  isCurrent: boolean;
  lastActivity: string;
  createdAt: string;
}

interface SessionManagementProps {
  className?: string;
}

export default function SessionManagement({ className }: SessionManagementProps) {
  const { toast } = useToast();
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/sessions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      return data.sessions as AdminSession[];
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(`/api/admin/sessions/${sessionId}/revoke`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to revoke session');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Session revoked successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sessions'] });
      setSelectedSessions([]);
    },
    onError: () => {
      toast({ title: 'Failed to revoke session', variant: 'destructive' });
    },
  });

  const revokeMultipleSessionsMutation = useMutation({
    mutationFn: async (sessionIds: string[]) => {
      const response = await fetch('/api/admin/sessions/revoke-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionIds }),
      });
      if (!response.ok) throw new Error('Failed to revoke sessions');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: `${data.revokedCount} sessions revoked successfully`,
        description: data.failedCount > 0 ? `${data.failedCount} sessions failed to revoke` : undefined
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sessions'] });
      setSelectedSessions([]);
    },
    onError: () => {
      toast({ title: 'Failed to revoke sessions', variant: 'destructive' });
    },
  });

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4 text-blue-500" />;
      case 'tablet': return <Tablet className="h-4 w-4 text-green-500" />;
      case 'desktop': return <Monitor className="h-4 w-4 text-purple-500" />;
      default: return <Globe className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSessionStatusBadge = (session: AdminSession) => {
    if (session.isCurrent) {
      return 'Current';
    }
    if (session.isActive) {
      const lastActivity = new Date(session.lastActivity);
      const now = new Date();
      const minutesAgo = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
      
      if (minutesAgo < 30) {
        return 'Recent';
      } else {
        return 'Idle';
      }
    }
    return 'Inactive';
  };

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSessionMutation.mutateAsync(sessionId);
  };

  const handleRevokeMultiple = async () => {
    if (selectedSessions.length === 0) return;
    await revokeMultipleSessionsMutation.mutateAsync(selectedSessions);
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleSelectAll = () => {
    const activeSessionIds = sessions
      .filter(session => session.isActive && !session.isCurrent)
      .map(session => session.id);
    
    if (selectedSessions.length === activeSessionIds.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(activeSessionIds);
    }
  };

  const activeSessions = sessions.filter(session => session.isActive);
  const inactiveSessions = sessions.filter(session => !session.isActive);

  return (
    <div className={className}>
      <div className="card" id="card-sessions">
        <div className="card-header">
          <h3 className="section-title" style={{margin: 0}}>Active Admin Sessions</h3>
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              id="btn-sess-refresh" 
              className="btn"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh-sessions"
            >
              Refresh
            </button>
            {selectedSessions.length > 0 && (
              <button 
                id="btn-sess-terminate" 
                className="btn danger"
                onClick={() => handleRevokeMultiple()}
                disabled={revokeMultipleSessionsMutation.isPending}
                data-testid="button-revoke-multiple"
              >
                Terminate Selected ({selectedSessions.length})
              </button>
            )}
          </div>
        </div>

        <div id="sess-list" style={{padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {isLoading ? (
            <div style={{textAlign: 'center', padding: '32px', color: '#6B7280'}}>
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div style={{textAlign: 'center', padding: '32px', color: '#6B7280'}}>
              No active admin sessions
            </div>
          ) : (
            sessions.filter(s => s.isActive).map((session) => (
              <div
                key={session.id}
                className={`session ${session.isCurrent ? 'current' : ''}`}
                data-testid={`session-${session.id}`}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 700}}>
                      {getDeviceIcon(session.deviceType)} {session.deviceName || `${session.deviceType} Device`}
                      {' '}
                      <span className={`pill ${session.isCurrent ? 'pill-ok' : 'pill-neutral'}`}>
                        {session.isCurrent ? 'Current' : getSessionStatusBadge(session)}
                      </span>
                    </div>
                    <div style={{color: '#475467', fontSize: '14px', marginTop: '2px'}}>
                      {session.browser || 'Unknown Browser'} • {session.os || 'Unknown OS'}
                    </div>
                    <div style={{color: '#475467', fontSize: '14px', marginTop: '2px'}}>
                      <span className="ip" data-ip={session.ip}>•••.•••.•••.•••</span>
                      {session.location && <span> • {session.location}</span>}
                      <span style={{color: '#667085'}}>
                        {' • Last active: '}
                        {format(new Date(session.lastActivity), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    {!session.isCurrent && (
                      <input 
                        type="checkbox" 
                        className="sess-chk" 
                        data-id={session.id}
                        checked={selectedSessions.includes(session.id)}
                        onChange={() => handleSessionSelect(session.id)}
                        data-testid={`checkbox-session-${session.id}`}
                      />
                    )}
                    <button 
                      className="icon-btn" 
                      title="Reveal IP" 
                      data-reveal={session.id}
                      onClick={(e) => {
                        const target = e.currentTarget;
                        const sessionEl = target.closest('.session');
                        const ipEl = sessionEl?.querySelector('.ip') as HTMLElement;
                        if (ipEl) {
                          ipEl.textContent = ipEl.dataset.ip || session.ip;
                        }
                      }}
                      data-testid={`button-view-session-${session.id}`}
                    >
                      👁
                    </button>
                    {!session.isCurrent && (
                      <button 
                        className="icon-btn danger" 
                        title="Terminate" 
                        data-kill={session.id}
                        onClick={() => {
                          if (confirm('Terminate this session?')) {
                            handleRevokeSession(session.id);
                          }
                        }}
                        disabled={revokeSessionMutation.isPending}
                        data-testid={`button-revoke-session-${session.id}`}
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}