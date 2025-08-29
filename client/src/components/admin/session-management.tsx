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

  const getStatusBadge = (session: AdminSession) => {
    if (session.isCurrent) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Current</Badge>;
    }
    if (session.isActive) {
      const lastActivity = new Date(session.lastActivity);
      const now = new Date();
      const minutesAgo = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
      
      if (minutesAgo < 5) {
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      } else if (minutesAgo < 30) {
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Recent</Badge>;
      } else {
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Idle</Badge>;
      }
    }
    return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>;
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Active Admin Sessions
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Monitor and manage active administrator sessions
            </p>
            <div className="flex gap-2">
              {selectedSessions.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => revokeMultipleSessionsMutation.mutate(selectedSessions)}
                  disabled={revokeMultipleSessionsMutation.isPending}
                  data-testid="button-revoke-multiple"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Revoke {selectedSessions.length} Sessions
                </Button>
              )}
              <Button onClick={() => refetch()} variant="outline" size="sm" data-testid="button-refresh-sessions">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : sessions.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>No admin sessions found.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {/* Active Sessions */}
              {activeSessions.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Active Sessions ({activeSessions.length})
                    </h3>
                    {activeSessions.filter(s => !s.isCurrent).length > 0 && (
                      <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        {selectedSessions.length === activeSessions.filter(s => !s.isCurrent).length 
                          ? 'Deselect All' 
                          : 'Select All'
                        }
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          session.isCurrent 
                            ? 'bg-green-50 border-green-200' 
                            : selectedSessions.includes(session.id)
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        data-testid={`session-${session.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {!session.isCurrent && (
                              <input
                                type="checkbox"
                                checked={selectedSessions.includes(session.id)}
                                onChange={() => handleSessionSelect(session.id)}
                                className="rounded border-gray-300"
                                data-testid={`checkbox-session-${session.id}`}
                              />
                            )}
                            {getDeviceIcon(session.deviceType)}
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {session.deviceName || `${session.deviceType} Device`}
                                {getStatusBadge(session)}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>{session.browser} on {session.os}</div>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {session.ip} {session.location && `• ${session.location}`}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Last active: {format(new Date(session.lastActivity), 'MMM dd, HH:mm')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" data-testid={`button-view-session-${session.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {!session.isCurrent && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => revokeSessionMutation.mutate(session.id)}
                                disabled={revokeSessionMutation.isPending}
                                data-testid={`button-revoke-session-${session.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inactive Sessions */}
              {inactiveSessions.length > 0 && (
                <div>
                  <h3 className="font-medium flex items-center gap-2 mb-4">
                    <X className="h-4 w-4 text-red-500" />
                    Recently Revoked Sessions ({inactiveSessions.length})
                  </h3>
                  <div className="space-y-2">
                    {inactiveSessions.slice(0, 5).map((session) => (
                      <div
                        key={session.id}
                        className="p-3 border rounded-lg bg-gray-50 opacity-75"
                        data-testid={`inactive-session-${session.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getDeviceIcon(session.deviceType)}
                            <div>
                              <div className="font-medium text-sm text-gray-700">
                                {session.deviceName || `${session.deviceType} Device`}
                              </div>
                              <div className="text-xs text-gray-500">
                                Revoked {format(new Date(session.lastActivity), 'MMM dd, HH:mm')}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-red-100 text-red-800 border-red-200">Revoked</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}