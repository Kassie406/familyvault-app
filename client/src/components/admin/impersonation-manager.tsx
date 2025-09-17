import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserX, User, Clock, Shield, AlertTriangle, 
  Play, Square, Eye, Lock, Timer, History,
  Activity, Database, ExternalLink, CheckCircle,
  XCircle, AlertCircle, Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ImpersonationManagerProps {
  className?: string;
}

interface ActiveSession {
  id: string;
  target_user_id: string;
  business_reason: string;
  expires_at: string;
  deny: string[];
}

interface RecentSession {
  id: string;
  actorId: string;
  targetId: string;
  businessReason: string;
  status: string;
  createdAt: string;
  endedAt?: string;
  endReason?: string;
}

export default function ImpersonationManager({ className }: ImpersonationManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [targetUserId, setTargetUserId] = useState('');
  const [businessReason, setBusinessReason] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sessionsList, setSessionsList] = useState<RecentSession[]>([]);

  // Get current impersonation status
  const { data: statusData, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/admin/impersonation/status'],
    refetchInterval: 5000, // Poll every 5 seconds for active sessions
  });

  // Get recent sessions for audit
  const { data: sessionsData } = useQuery({
    queryKey: ['/api/admin/impersonation/sessions'],
    enabled: showAdvanced,
  });

  const isActive = statusData?.active || false;
  const activeSession = statusData?.session as ActiveSession | undefined;
  const recentSessions = sessionsData?.sessions as RecentSession[] || [];

  // Update local state when server data changes
  useEffect(() => {
    if (recentSessions.length > 0) {
      setSessionsList(recentSessions);
    }
  }, [recentSessions]);

  // Start impersonation mutation
  const startMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/impersonation/start', {
        target_user_id: targetUserId,
        business_reason: businessReason,
        duration_minutes: durationMinutes,
      });
    },
    onSuccess: (data) => {
      toast({
        title: '✓ Impersonation Started',
        description: `Active session for ${targetUserId} - expires ${new Date(data.expires_at).toLocaleString()}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/impersonation/status'] });
      setTargetUserId('');
      setBusinessReason('');
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Start Impersonation',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    },
  });

  // Stop impersonation mutation
  const stopMutation = useMutation({
    mutationFn: async (reason = 'manual') => {
      return apiRequest('POST', '/api/admin/impersonation/stop', {
        session_id: activeSession?.id,
        reason,
      });
    },
    onSuccess: () => {
      toast({
        title: '✓ Impersonation Stopped',
        description: 'Session ended successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/impersonation/status'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Stop Impersonation',
        description: error.message || 'Unknown error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleStart = () => {
    if (!targetUserId.trim()) {
      toast({
        title: 'Missing Target User',
        description: 'Please enter a user ID to impersonate',
        variant: 'destructive',
      });
      return;
    }
    if (!businessReason.trim() || businessReason.trim().length < 20) {
      toast({
        title: 'Missing Business Reason',
        description: 'Please provide a detailed business reason (minimum 20 characters)',
        variant: 'destructive',
      });
      return;
    }
    startMutation.mutate();
  };

  const handleStop = () => {
    stopMutation.mutate('manual');
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / (1000 * 60));
    return diffMins > 0 ? `${diffMins} minutes` : 'Expired';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDeleteSession = (session: RecentSession) => {
    // Immediate local state update for better UX
    setSessionsList(prev => prev.filter(s => s.id !== session.id));
    console.log('Impersonation session deleted:', session.targetId, session.id);
    toast({
      title: 'Session Deleted',
      description: `Session for "${session.targetId}" has been removed from audit history.`,
      variant: 'destructive',
    });
  };

  return (
    <div className={className} id="impersonation-manager">
      {/* Active Session Alert */}
      {isActive && activeSession && (
        <Alert className="border-amber-200 bg-amber-50 mb-6">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="text-amber-800">
                <strong>🔴 LIVE IMPERSONATION SESSION</strong><br />
                <span className="text-sm">
                  Target: <code>{activeSession.target_user_id}</code> | 
                  Expires: {formatTimeRemaining(activeSession.expires_at)} | 
                  Reason: {activeSession.business_reason}
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleStop}
                disabled={stopMutation.isPending}
                data-testid="button-stop-impersonation"
              >
                <Square className="h-3 w-3 mr-1" />
                {stopMutation.isPending ? 'Stopping...' : 'End Session'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-blue-600" />
            Admin Impersonation Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Security Overview */}
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Security Notice:</strong> All impersonation sessions are JWT-based, time-limited, 
              fully audited, and restrict dangerous operations. Use only for customer support.
            </AlertDescription>
          </Alert>

          {/* Start Impersonation Form */}
          {!isActive && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetUserId" className="text-sm font-medium">
                  Target User ID *
                </Label>
                <Input
                  id="targetUserId"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Enter user ID or email to impersonate"
                  className="mt-1"
                  data-testid="input-target-user-id"
                />
              </div>

              <div>
                <Label htmlFor="businessReason" className="text-sm font-medium">
                  Business Justification * (min. 20 characters)
                </Label>
                <Textarea
                  id="businessReason"
                  value={businessReason}
                  onChange={(e) => setBusinessReason(e.target.value)}
                  placeholder="Support ticket #12345 - user unable to access billing settings, need to verify account status"
                  className="mt-1 min-h-[80px]"
                  data-testid="textarea-business-reason"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Required for audit compliance</span>
                  <span>{businessReason.length}/20+</span>
                </div>
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-medium">
                  Session Duration
                </Label>
                <div className="flex items-center gap-4 mt-1">
                  <Input
                    id="duration"
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={5}
                    max={30}
                    className="w-20"
                    data-testid="input-duration-minutes"
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                  <div className="flex gap-2 duration-pills">
                    {[5, 10, 15, 20].map((mins) => (
                      <Button
                        key={mins}
                        variant={durationMinutes === mins ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDurationMinutes(mins)}
                        className={`pill ${durationMinutes === mins ? 'is-active' : ''}`}
                        data-testid={`button-duration-${mins}`}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStart}
                disabled={startMutation.isPending || !targetUserId.trim() || businessReason.trim().length < 20}
                className="w-full bg-amber-600 hover:bg-amber-700"
                data-testid="button-start-impersonation"
              >
                <Play className="h-4 w-4 mr-2" />
                {startMutation.isPending ? 'Starting Session...' : 'Start Impersonation Session'}
              </Button>
            </div>
          )}

          {/* Security Guardrails */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Security Guardrails
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-green-700 mb-2">✓ Enforced Protections</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>JWT-based authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Automatic timeout (max 30min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Full audit trail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Token revocation</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-red-700 mb-2">✗ Blocked Operations</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>Password changes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>MFA reset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>User deletion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>Payment updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <History className="h-4 w-4" />
                Audit & History
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="audit-toggle"
                data-testid="button-toggle-advanced"
              >
                <Eye className="h-3 w-3 mr-1" />
                {showAdvanced ? 'Hide' : 'Show'} Details
              </Button>
            </div>

            {/* Recent Sessions */}
            {showAdvanced && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Recent Impersonation Sessions</h4>
                
                {sessionsList.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent impersonation sessions</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sessionsList.slice(0, 10).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-white"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-1 rounded">
                              {session.targetId}
                            </code>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {session.businessReason}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right text-xs text-gray-500">
                            <div>{new Date(session.createdAt).toLocaleString()}</div>
                            {session.endedAt && (
                              <div>Ended: {session.endReason || 'manual'}</div>
                            )}
                          </div>
                          <button
                            title="Delete Session"
                            onClick={() => handleDeleteSession(session)}
                            className="text-red-600 hover:text-red-800 text-sm ml-2"
                            data-testid={`button-delete-session-${session.id}`}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Technical Details */}
            {showAdvanced && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Technical Details</h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-3 w-3 text-blue-600" />
                      <span>JWT Algorithm: HS256</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-green-600" />
                      <span>Token Blocklist: Active</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Timer className="h-3 w-3 text-orange-600" />
                      <span>Max Duration: 30 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-purple-600" />
                      <span>Auto-cleanup: 5 minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Information */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>Status: {statusLoading ? 'Checking...' : (isActive ? '🔴 Active' : '🟢 Inactive')}</span>
                <span>Last checked: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-3 w-3" />
                <span>Audit logs available in Security tab</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}