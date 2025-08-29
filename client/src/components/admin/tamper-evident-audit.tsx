import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Eye, 
  Calendar, 
  User, 
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Clock,
  GitCompare
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface AuditLogEntry {
  id: string;
  ts: string;
  actor_user_id: string;
  actor_email: string;
  actor_role: string;
  actor_ip?: string;
  action: string;
  object_type: string;
  object_id: string;
  before?: any;
  after?: any;
  reason?: string;
  tamper_hash: string;
  prev_tamper_hash?: string;
}

function DiffViewer({ before, after, title }: { before: any; after: any; title: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid={`button-view-diff-${title.toLowerCase()}`}>
          <GitCompare className="h-4 w-4 mr-2" />
          View Changes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Change Details: {title}</DialogTitle>
          <DialogDescription>Before and after comparison</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">Before</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                {before ? JSON.stringify(before, null, 2) : 'No previous data'}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">After</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-auto">
                {after ? JSON.stringify(after, null, 2) : 'No new data'}
              </pre>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (action.includes('update')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (action.includes('delete') || action.includes('archive')) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  };

  const getRoleColor = (role: string) => {
    if (role === 'ADMIN') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    if (role === 'PRESIDENT') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <Card className="mb-4" data-testid={`audit-entry-${entry.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getActionColor(entry.action)} data-testid="badge-action">
              {entry.action}
            </Badge>
            <Badge variant="outline" data-testid="badge-object-type">
              {entry.object_type}:{entry.object_id}
            </Badge>
          </div>
          <Badge className={getRoleColor(entry.actor_role)} data-testid="badge-role">
            {entry.actor_role}
          </Badge>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center" data-testid="text-actor">
            <User className="h-4 w-4 mr-1" />
            {entry.actor_email}
          </div>
          <div className="flex items-center" data-testid="text-timestamp">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(entry.ts).toLocaleString()}
          </div>
          {entry.actor_ip && (
            <div className="flex items-center" data-testid="text-ip">
              <ExternalLink className="h-4 w-4 mr-1" />
              {entry.actor_ip}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {(entry.before || entry.after) && (
              <DiffViewer 
                before={entry.before} 
                after={entry.after} 
                title={`${entry.object_type} ${entry.object_id}`}
              />
            )}
            {entry.reason && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-view-reason">
                    <Eye className="h-4 w-4 mr-2" />
                    View Reason
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reason for Change</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm">{entry.reason}</p>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="text-xs text-muted-foreground font-mono" data-testid="text-hash">
            Hash: {entry.tamper_hash.substring(0, 8)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TamperEvidentAudit() {
  const [verifyingIntegrity, setVerifyingIntegrity] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<{ valid: boolean; brokenAt?: string } | null>(null);

  const { data: auditLogs, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/audit-v2'],
    queryFn: async () => {
      const response = await apiRequest('/api/admin/audit-v2', { method: 'GET' });
      return response;
    }
  });

  const verifyIntegrity = async () => {
    setVerifyingIntegrity(true);
    try {
      const result = await apiRequest('/api/admin/audit-v2/verify', { method: 'GET' });
      setIntegrityResult(result);
    } catch (error) {
      console.error('Failed to verify integrity:', error);
    } finally {
      setVerifyingIntegrity(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="tamper-evident-audit">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center" data-testid="title-audit">
            <Shield className="h-6 w-6 mr-2" />
            Tamper-Evident Audit Log
          </h2>
          <p className="text-muted-foreground mt-1" data-testid="description-audit">
            Cryptographically secured audit trail with hash chaining for enterprise compliance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={verifyIntegrity} 
            disabled={verifyingIntegrity}
            variant="outline"
            data-testid="button-verify-integrity"
          >
            <Shield className="h-4 w-4 mr-2" />
            {verifyingIntegrity ? 'Verifying...' : 'Verify Integrity'}
          </Button>
          <Button onClick={() => refetch()} variant="outline" data-testid="button-refresh">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {integrityResult && (
        <Card className={integrityResult.valid ? 'border-green-200 dark:border-green-800' : 'border-red-200 dark:border-red-800'}>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              {integrityResult.valid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-semibold" data-testid="text-integrity-valid">
                    Audit log integrity verified - No tampering detected
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-600 font-semibold" data-testid="text-integrity-invalid">
                    Integrity violation detected
                    {integrityResult.brokenAt && ` at entry: ${integrityResult.brokenAt}`}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle data-testid="title-recent-activities">Recent Administrative Activities</CardTitle>
          <CardDescription data-testid="description-activities">
            All administrative actions are logged with cryptographic verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (auditLogs as any)?.items?.length > 0 ? (
            <div className="space-y-4" data-testid="list-audit-entries">
              {(auditLogs as any).items.map((entry: AuditLogEntry) => (
                <AuditLogRow key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground" data-testid="text-no-entries">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit entries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}