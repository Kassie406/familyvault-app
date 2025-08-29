import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  UserX, User, Clock, Shield, AlertTriangle, 
  Play, Square, Eye, Lock, Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImpersonationManagerProps {
  className?: string;
}

export default function ImpersonationManager({ className }: ImpersonationManagerProps) {
  const { toast } = useToast();
  const [targetUserId, setTargetUserId] = useState('');
  const [reason, setReason] = useState('');
  const [ttlMinutes, setTtlMinutes] = useState(20);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const startImpersonationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/impersonation/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: targetUserId,
          reason,
          ttlMinutes,
        }),
      });
      if (!response.ok) throw new Error('Failed to start impersonation');
      return response.json();
    },
    onSuccess: (data) => {
      setIsImpersonating(true);
      setCurrentSession(data);
      toast({ 
        title: 'Impersonation started', 
        description: `Now impersonating user for ${ttlMinutes} minutes` 
      });
      // Clear form
      setTargetUserId('');
      setReason('');
    },
    onError: (error: any) => {
      toast({ 
        title: 'Failed to start impersonation', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const stopImpersonationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/impersonation/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'ended-by-admin' }),
      });
      if (!response.ok) throw new Error('Failed to stop impersonation');
      return response.json();
    },
    onSuccess: () => {
      setIsImpersonating(false);
      setCurrentSession(null);
      toast({ title: 'Impersonation stopped' });
    },
    onError: () => {
      toast({ 
        title: 'Failed to stop impersonation', 
        variant: 'destructive' 
      });
    },
  });

  const handleStartImpersonation = () => {
    if (!targetUserId || !reason) {
      toast({ 
        title: 'Missing information', 
        description: 'Please provide both user ID and reason',
        variant: 'destructive' 
      });
      return;
    }
    startImpersonationMutation.mutate();
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-amber-500" />
            Admin Impersonation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Warning */}
          <Alert className="border-amber-200 bg-amber-50">
            <Shield className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Security Notice:</strong> Impersonation sessions are limited to {ttlMinutes} minutes, 
              fully audited, and restrict dangerous operations. Use only for customer support.
            </AlertDescription>
          </Alert>

          {/* Active Session Status */}
          {isImpersonating && currentSession && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Active Impersonation Session</strong><br />
                    Session expires: {new Date(currentSession.expiresAt).toLocaleString()}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => stopImpersonationMutation.mutate()}
                    disabled={stopImpersonationMutation.isPending}
                    data-testid="button-stop-impersonation"
                  >
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Start Impersonation Form */}
          {!isImpersonating && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetUserId">Target User ID *</Label>
                <Input
                  id="targetUserId"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  placeholder="Enter user ID to impersonate"
                  data-testid="input-target-user-id"
                />
              </div>

              <div>
                <Label htmlFor="reason">Business Reason *</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Customer support ticket #12345 - user unable to access billing"
                  data-testid="textarea-impersonation-reason"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide specific business justification for audit compliance
                </p>
              </div>

              <div>
                <Label htmlFor="ttlMinutes">Session Duration (minutes)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="ttlMinutes"
                    type="number"
                    value={ttlMinutes}
                    onChange={(e) => setTtlMinutes(Number(e.target.value))}
                    min={5}
                    max={60}
                    className="w-24"
                    data-testid="input-ttl-minutes"
                  />
                  <div className="flex gap-2">
                    {[10, 20, 30].map((minutes) => (
                      <Button
                        key={minutes}
                        variant="outline"
                        size="sm"
                        onClick={() => setTtlMinutes(minutes)}
                      >
                        {minutes}m
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleStartImpersonation}
                disabled={startImpersonationMutation.isPending || !targetUserId || !reason}
                className="w-full"
                data-testid="button-start-impersonation"
              >
                <Play className="h-4 w-4 mr-2" />
                {startImpersonationMutation.isPending ? 'Starting...' : 'Start Impersonation'}
              </Button>
            </div>
          )}

          {/* Guardrails Information */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security Guardrails
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">✓</Badge>
                  <span>Automatic timeout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">✓</Badge>
                  <span>Full audit logging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">✓</Badge>
                  <span>Session isolation</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">✗</Badge>
                  <span>Password changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">✗</Badge>
                  <span>Payment updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">✗</Badge>
                  <span>User deletion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Impersonation Sessions
            </h3>
            <div className="space-y-2">
              {/* Mock recent sessions */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">user-12345</div>
                  <div className="text-sm text-gray-600">Support ticket #67890</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">2 hours ago</div>
                  <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}