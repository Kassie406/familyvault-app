import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Shield, User, Clock, Database, 
  FileText, Eye, AlertTriangle, CheckCircle,
  Activity, Settings, UserPlus, Trash2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuditLog {
  id: string;
  actorId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  beforeState?: string;
  afterState?: string;
  ip?: string;
  userAgent?: string;
  meta?: string;
  createdAt: string;
}

interface AuditLogViewerProps {
  className?: string;
}

export default function EnhancedAuditLogViewer({ className }: AuditLogViewerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/audit', searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/admin/audit/search?q=${encodeURIComponent(searchQuery)}`
        : '/api/admin/audit';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      return data.logs as AuditLog[];
    },
  });

  const getActionIcon = (action: string) => {
    if (action.includes('created') || action.includes('login')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (action.includes('deleted') || action.includes('failed')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (action.includes('updated') || action.includes('changed')) return <Settings className="h-4 w-4 text-blue-500" />;
    if (action.includes('viewed') || action.includes('accessed')) return <Eye className="h-4 w-4 text-gray-500" />;
    return <Activity className="h-4 w-4 text-purple-500" />;
  };

  const getActionSeverity = (action: string): 'low' | 'medium' | 'high' | 'critical' => {
    if (action.includes('deleted') || action.includes('failed') || action.includes('revoked')) return 'critical';
    if (action.includes('role_changed') || action.includes('admin:') || action.includes('security:')) return 'high';
    if (action.includes('updated') || action.includes('created')) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAction = (action: string) => {
    return action.split(':').map(part => 
      part.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(' → ');
  };

  const parseStateChange = (beforeState: string | null, afterState: string | null) => {
    try {
      const before = beforeState ? JSON.parse(beforeState) : null;
      const after = afterState ? JSON.parse(afterState) : null;
      
      if (!before && after) {
        return { type: 'created', data: after };
      }
      
      if (before && !after) {
        return { type: 'deleted', data: before };
      }
      
      if (before && after) {
        const changes: any = {};
        Object.keys(after).forEach(key => {
          if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            changes[key] = { from: before[key], to: after[key] };
          }
        });
        return { type: 'updated', changes };
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const DetailedLogView = ({ log }: { log: AuditLog }) => {
    const stateChange = parseStateChange(log.beforeState, log.afterState);
    
    return (
      <Card className="mt-4 border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getActionIcon(log.action)}
            {formatAction(log.action)}
            <Badge className={getSeverityColor(getActionSeverity(log.action))}>
              {getActionSeverity(log.action).toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Resource:</strong> {log.resource}
              {log.resourceId && <><br /><strong>Resource ID:</strong> {log.resourceId}</>}
            </div>
            <div>
              <strong>Actor:</strong> {log.actorId || 'System'}
              <br />
              <strong>Timestamp:</strong> {format(new Date(log.createdAt), 'PPpp')}
            </div>
            {log.ip && (
              <div>
                <strong>IP Address:</strong> {log.ip}
              </div>
            )}
            {log.userAgent && (
              <div>
                <strong>User Agent:</strong> {log.userAgent.substring(0, 50)}...
              </div>
            )}
          </div>

          {stateChange && (
            <div className="border-t pt-4">
              <strong className="text-sm">State Changes:</strong>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                {stateChange.type === 'created' && (
                  <div>
                    <Badge className="mb-2 bg-green-100 text-green-800">CREATED</Badge>
                    <pre className="text-xs overflow-auto">{JSON.stringify(stateChange.data, null, 2)}</pre>
                  </div>
                )}
                
                {stateChange.type === 'deleted' && (
                  <div>
                    <Badge className="mb-2 bg-red-100 text-red-800">DELETED</Badge>
                    <pre className="text-xs overflow-auto">{JSON.stringify(stateChange.data, null, 2)}</pre>
                  </div>
                )}
                
                {stateChange.type === 'updated' && (
                  <div>
                    <Badge className="mb-2 bg-blue-100 text-blue-800">UPDATED</Badge>
                    {Object.entries(stateChange.changes).map(([field, change]: [string, any]) => (
                      <div key={field} className="mb-2 p-2 border rounded">
                        <strong>{field}:</strong>
                        <div className="flex gap-2 mt-1">
                          <div className="flex-1">
                            <span className="text-xs text-red-600">FROM:</span>
                            <pre className="text-xs bg-red-50 p-1 rounded">{JSON.stringify(change.from, null, 2)}</pre>
                          </div>
                          <div className="flex-1">
                            <span className="text-xs text-green-600">TO:</span>
                            <pre className="text-xs bg-green-50 p-1 rounded">{JSON.stringify(change.to, null, 2)}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Enhanced Audit Log
          </CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs by action, resource, or actor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-audit-search"
              />
            </div>
            <Button onClick={() => refetch()} variant="outline" data-testid="button-refresh-logs">
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : logs.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {searchQuery ? 'No audit logs found matching your search.' : 'No audit logs available.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedLog?.id === log.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                  data-testid={`audit-log-${log.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getActionIcon(log.action)}
                      <div>
                        <div className="font-medium">{formatAction(log.action)}</div>
                        <div className="text-sm text-gray-500">
                          {log.resource} {log.resourceId && `• ${log.resourceId.substring(0, 8)}...`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getSeverityColor(getActionSeverity(log.action))}>
                        {getActionSeverity(log.action).toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(log.createdAt), 'MMM dd, HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {selectedLog && <DetailedLogView log={selectedLog} />}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}