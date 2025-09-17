import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, CheckCircle, Clock, ExternalLink, 
  AlertCircle, Shield, Phone, Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Incident {
  id: string;
  component: string;
  severity: 'S1' | 'S2';
  status: 'open' | 'acknowledged' | 'closed';
  openedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  closedAt?: string;
  lastEscalationTier: number;
  description?: string;
}

interface OncallTarget {
  id: string;
  tier: number;
  kind: 'email' | 'sms' | 'voice';
  to: string;
  name?: string;
  active: boolean;
}

function SeverityBadge({ severity }: { severity: 'S1' | 'S2' }) {
  return (
    <Badge 
      variant={severity === 'S1' ? 'destructive' : 'secondary'}
      className={severity === 'S1' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
      data-testid={`severity-${severity}`}
    >
      {severity === 'S1' ? 'CRITICAL' : 'MAJOR'}
    </Badge>
  );
}

function StatusBadge({ status }: { status: 'open' | 'acknowledged' | 'closed' }) {
  const variants = {
    open: { icon: AlertTriangle, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    acknowledged: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    closed: { icon: CheckCircle, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
  };
  
  const { icon: Icon, color } = variants[status];
  
  return (
    <Badge className={`inline-flex items-center gap-1.5 ${color}`} data-testid={`status-${status}`}>
      <Icon className="w-3 h-3" />
      {status.toUpperCase()}
    </Badge>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function IncidentRow({ incident, onAcknowledge }: { 
  incident: Incident; 
  onAcknowledge: (id: string) => void;
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="font-medium">{incident.component.toUpperCase()}</div>
        <div className="text-sm text-muted-foreground">
          {incident.description || `${incident.component} service failure`}
        </div>
      </td>
      <td className="px-4 py-3">
        <SeverityBadge severity={incident.severity} />
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={incident.status} />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">
          <div>{formatTimeAgo(incident.openedAt)}</div>
          <div className="text-muted-foreground">
            Tier {incident.lastEscalationTier} escalation
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        {incident.status === 'open' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAcknowledge(incident.id)}
            data-testid={`acknowledge-${incident.id}`}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Acknowledge
          </Button>
        )}
        {incident.status === 'acknowledged' && incident.acknowledgedAt && (
          <div className="text-sm text-muted-foreground">
            Acked {formatTimeAgo(incident.acknowledgedAt)}
          </div>
        )}
        {incident.status === 'closed' && incident.closedAt && (
          <div className="text-sm text-muted-foreground">
            Closed {formatTimeAgo(incident.closedAt)}
          </div>
        )}
      </td>
    </tr>
  );
}

function OncallTargetsCard() {
  const { data: targetsData } = useQuery({
    queryKey: ['/api/admin/oncall-targets'],
    queryFn: () => fetch('/api/admin/oncall-targets', { credentials: 'include' }).then(res => res.json()),
  });

  const targets: OncallTarget[] = targetsData?.targets || [];
  
  const tierGroups = targets.reduce((acc, target) => {
    if (!acc[target.tier]) acc[target.tier] = [];
    acc[target.tier].push(target);
    return acc;
  }, {} as Record<number, OncallTarget[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Escalation Targets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(tierGroups).map(([tier, targets]) => (
            <div key={tier} className="border rounded-lg p-3">
              <div className="font-medium mb-2">Tier {tier}</div>
              <div className="space-y-2">
                {targets.map(target => (
                  <div key={target.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {target.kind === 'email' ? (
                        <Mail className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Phone className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm">{target.name || target.to}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {target.kind.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function IncidentsTable() {
  const [activeTab, setActiveTab] = useState('open');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: incidentsData, isLoading } = useQuery({
    queryKey: ['/api/admin/incidents', activeTab],
    queryFn: () => fetch(`/api/admin/incidents?status=${activeTab}`, { 
      credentials: 'include' 
    }).then(res => res.json()),
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (incidentId: string) =>
      fetch(`/api/admin/incidents/${incidentId}/acknowledge`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/incidents'] });
      toast({
        title: 'Incident Acknowledged',
        description: 'The incident has been acknowledged and escalation has stopped.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to acknowledge incident.',
        variant: 'destructive',
      });
    },
  });

  const { data: smsStatusData } = useQuery({
    queryKey: ['/api/admin/sms/status'],
    queryFn: () => fetch('/api/admin/sms/status', { credentials: 'include' }).then(res => res.json()),
  });

  const incidents: Incident[] = incidentsData?.incidents || [];
  const smsConfigured = smsStatusData?.configured || false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Incident Management</h2>
          <p className="text-muted-foreground">
            Monitor and respond to system incidents with automated escalation
          </p>
        </div>
        {!smsConfigured && (
          <Badge variant="outline" className="text-amber-600 border-amber-200">
            <AlertTriangle className="w-4 h-4 mr-1" />
            SMS Not Configured
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Active Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="open" data-testid="tab-open">
                    Open ({incidents.filter(i => i.status === 'open').length})
                  </TabsTrigger>
                  <TabsTrigger value="acknowledged" data-testid="tab-acknowledged">
                    Acknowledged
                  </TabsTrigger>
                  <TabsTrigger value="closed" data-testid="tab-closed">
                    Closed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-4">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading incidents...
                    </div>
                  ) : incidents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <div className="font-medium">No {activeTab} incidents</div>
                      <div>All systems are operating normally</div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/30">
                            <th className="px-4 py-3 text-left font-medium">Component</th>
                            <th className="px-4 py-3 text-left font-medium">Severity</th>
                            <th className="px-4 py-3 text-left font-medium">Status</th>
                            <th className="px-4 py-3 text-left font-medium">Duration</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {incidents.map(incident => (
                            <IncidentRow
                              key={incident.id}
                              incident={incident}
                              onAcknowledge={(id) => acknowledgeMutation.mutate(id)}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <OncallTargetsCard />
        </div>
      </div>
    </div>
  );
}