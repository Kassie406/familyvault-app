import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield, Clock, Users, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { 
  DsarRequest, InsertDsarRequest, 
  RetentionPolicy, InsertRetentionPolicy,
  Suppression, InsertSuppression,
  GdprConsentEvent
} from '@shared/schema';

type TabType = 'overview' | 'consents' | 'requests' | 'retention' | 'suppression';

interface DrawerState {
  type: 'consent' | 'dsar' | null;
  userId?: string;
  requestId?: string;
}

export function GdprCompliance() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [drawerState, setDrawerState] = useState<DrawerState>({ type: null });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch GDPR metrics for overview
  const { data: metrics } = useQuery({
    queryKey: ['/api/gdpr/metrics'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch data based on active tab
  const { data: consents } = useQuery({
    queryKey: ['/api/gdpr/consents'],
    enabled: activeTab === 'consents',
  });

  const { data: requests } = useQuery({
    queryKey: ['/api/gdpr/requests'],
    enabled: activeTab === 'requests',
  });

  const { data: policies } = useQuery({
    queryKey: ['/api/gdpr/retention'],
    enabled: activeTab === 'retention',
  });

  const { data: suppressions } = useQuery({
    queryKey: ['/api/gdpr/suppression'],
    enabled: activeTab === 'suppression',
  });

  // Mutations
  const createDsarMutation = useMutation({
    mutationFn: (data: Partial<InsertDsarRequest>) =>
      apiRequest('POST', '/api/gdpr/requests', data),
    onSuccess: () => {
      toast({ title: 'DSAR request created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/metrics'] });
    },
  });

  const createRetentionMutation = useMutation({
    mutationFn: (data: InsertRetentionPolicy) =>
      apiRequest('POST', '/api/gdpr/retention', data),
    onSuccess: () => {
      toast({ title: 'Retention policy created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/retention'] });
    },
  });

  const addSuppressionMutation = useMutation({
    mutationFn: (data: { email: string; reason: string }) =>
      apiRequest('POST', '/api/gdpr/suppression', data),
    onSuccess: () => {
      toast({ title: 'Email added to suppression list' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/suppression'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/metrics'] });
    },
  });

  const updateDsarMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<DsarRequest> }) =>
      apiRequest('PATCH', `/api/gdpr/requests/${id}`, updates),
    onSuccess: () => {
      toast({ title: 'DSAR request updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/metrics'] });
    },
  });

  // Form handlers
  const [newDsarForm, setNewDsarForm] = useState({
    type: '',
    subjectEmail: '',
    legalBasis: '',
    notes: '',
  });

  const [newRetentionForm, setNewRetentionForm] = useState({
    dataset: '',
    basis: '',
    ttlDays: 90,
    disposition: 'delete' as const,
  });

  const [suppressionEmail, setSuppressionEmail] = useState('');

  const handleCreateDsar = () => {
    if (!newDsarForm.type || !newDsarForm.subjectEmail) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    createDsarMutation.mutate(newDsarForm);
    setNewDsarForm({ type: '', subjectEmail: '', legalBasis: '', notes: '' });
  };

  const handleCreateRetention = () => {
    if (!newRetentionForm.dataset || !newRetentionForm.basis) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }
    createRetentionMutation.mutate(newRetentionForm);
    setNewRetentionForm({ dataset: '', basis: '', ttlDays: 90, disposition: 'delete' });
  };

  const handleAddSuppression = () => {
    if (!suppressionEmail.trim()) {
      toast({ title: 'Please enter an email address', variant: 'destructive' });
      return;
    }
    addSuppressionMutation.mutate({ 
      email: suppressionEmail.trim(), 
      reason: 'Manual suppression' 
    });
    setSuppressionEmail('');
  };

  const getStatusBadge = (status: string, dueAt?: string) => {
    if (status === 'completed') {
      return <span className="status-pill status-completed">completed</span>;
    }
    if (status === 'rejected') {
      return <span className="status-pill status-rejected">rejected</span>;
    }
    if (dueAt && new Date(dueAt) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
      return <span className="status-pill status-open">due soon</span>;
    }
    if (status === 'open' || status === 'in_progress') {
      return <span className={`status-pill status-${status}`}>{status.replace('_', ' ')}</span>;
    }
    return <span className="status-pill status-open">{status}</span>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Drawer helper functions
  const openConsentDrawer = (userId: string) => {
    setDrawerState({ type: 'consent', userId });
  };

  const openDsarDrawer = (requestId: string) => {
    setDrawerState({ type: 'dsar', requestId });
  };

  const closeDrawer = () => {
    setDrawerState({ type: null });
  };

  return (
    <div id="gdpr-root" className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">GDPR Compliance</h3>
          <div className="seg">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'consents', label: 'Consents' },
              { key: 'requests', label: 'Requests' },
              { key: 'retention', label: 'Retention' },
              { key: 'suppression', label: 'Suppression' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabType)}
                className={activeTab === tab.key ? 'is-active' : ''}
                data-testid={`tab-${tab.key}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="kpi">
                <strong className="text-2xl text-gray-900" id="kpi-open">
                  {metrics?.openDsars || 0}
                </strong>
                <div className="text-sm text-gray-600">Open DSARs</div>
              </div>
              <div className="kpi">
                <strong className="text-2xl text-orange-600" id="kpi-due">
                  {metrics?.dueSoon || 0}
                </strong>
                <div className="text-sm text-gray-600">Due in ≤7 days</div>
              </div>
              <div className="kpi">
                <strong className="text-2xl text-blue-600" id="kpi-consents">
                  {metrics?.consentUpdates30d || 0}
                </strong>
                <div className="text-sm text-gray-600">Consent updates (30d)</div>
              </div>
              <div className="kpi">
                <strong className="text-2xl text-red-600" id="kpi-deletes">
                  {metrics?.totalSuppressions || 0}
                </strong>
                <div className="text-sm text-gray-600">Suppressions active</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Legal Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Data Protection Officer</span>
                    <Badge className="badge-ok">Appointed</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Privacy Policy</span>
                    <Badge className="badge-ok">Current</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Consent Records</span>
                    <Badge className="badge-ok">Compliant</Badge>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Automation Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Retention Policies</span>
                    <Badge className="badge-ok">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-cleanup</span>
                    <Badge className="badge-ok">Running</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Trail</span>
                    <Badge className="badge-ok">Complete</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Consents Tab */}
        {activeTab === 'consents' && (
          <div className="p-4">
            <div className="card-header mb-4">
              <h4 className="font-medium">Consent Ledger</h4>
              <div className="flex gap-2">
                <Button variant="outline" id="import-consents" data-testid="button-import-consents">
                  Import
                </Button>
                <Button className="btn primary" id="export-consents" data-testid="button-export-consents">
                  Export CSV
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Purpose</th>
                    <th>Status</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consents?.events?.map((event: GdprConsentEvent) => (
                    <tr key={event.id}>
                      <td>
                        <button 
                          className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer p-0"
                          onClick={() => openConsentDrawer(event.userId)}
                          data-testid={`button-consent-${event.userId}`}
                        >
                          {event.userId || 'Unknown'}
                        </button>
                      </td>
                      <td>
                        <Badge variant="outline">{event.purpose}</Badge>
                      </td>
                      <td>
                        {event.status === 'granted' ? (
                          <Badge className="badge-ok">Granted</Badge>
                        ) : (
                          <Badge variant="destructive">Denied</Badge>
                        )}
                      </td>
                      <td>{event.method}</td>
                      <td>{formatDate(event.occurredAt)}</td>
                      <td>{event.source}</td>
                      <td>
                        <button 
                          className="tbl-action"
                          onClick={() => openConsentDrawer(event.userId)}
                          data-testid={`button-history-${event.userId}`}
                        >
                          History
                        </button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-4">
                        No consent events found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-4">
            <div className="card-header mb-4">
              <h4 className="font-medium">Data Subject Requests</h4>
              
              {/* Status Legend */}
              <div className="gdpr-legend">
                <span><span className="dot ok"></span>Completed</span>
                <span><span className="dot warn"></span>Open / In progress</span>
                <span><span className="dot due"></span>Due ≤ 7 days</span>
                <span><span className="dot bad"></span>Rejected / Overdue</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const email = prompt('Enter subject email:');
                    const type = prompt('Enter request type (access, erasure, etc.):');
                    if (email && type) {
                      createDsarMutation.mutate({
                        type: type as any,
                        subjectEmail: email,
                        legalBasis: `Article ${type === 'access' ? '15' : '17'} GDPR`,
                        notes: 'Created via admin panel',
                      });
                    }
                  }}
                  data-testid="button-new-dsar"
                >
                  New Request
                </Button>
                <Button variant="outline" data-testid="button-verify-identity">
                  Verify Identity
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Opened</th>
                    <th>Due</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests?.requests?.map((request: DsarRequest) => (
                    <tr key={request.id}>
                      <td>
                        <button 
                          className="tbl-link text-xs bg-gray-100 px-1 rounded border-none cursor-pointer"
                          onClick={() => openDsarDrawer(request.id)}
                          data-testid={`button-dsar-id-${request.id}`}
                        >
                          {request.id}
                        </button>
                      </td>
                      <td>
                        <Badge variant="outline">{request.type}</Badge>
                      </td>
                      <td>{request.subjectEmail || 'Unknown'}</td>
                      <td>{getStatusBadge(request.status, request.dueAt)}</td>
                      <td>{formatDate(request.openedAt)}</td>
                      <td>{formatDate(request.dueAt)}</td>
                      <td>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => openDsarDrawer(request.id)}
                            data-testid={`button-view-${request.id}`}
                          >
                            View
                          </Button>
                          {request.status === 'open' && (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                updateDsarMutation.mutate({
                                  id: request.id,
                                  updates: { status: 'in_progress' }
                                });
                              }}
                              data-testid={`button-start-${request.id}`}
                            >
                              Start
                            </Button>
                          )}
                          {request.status === 'in_progress' && (
                            <Button 
                              size="sm" 
                              className="btn primary"
                              onClick={() => {
                                updateDsarMutation.mutate({
                                  id: request.id,
                                  updates: { status: 'completed', closedAt: new Date() }
                                });
                              }}
                              data-testid={`button-complete-${request.id}`}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-500 py-4">
                        No DSAR requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Retention Tab */}
        {activeTab === 'retention' && (
          <div className="p-4">
            <div className="card-header mb-4">
              <h4 className="font-medium">Retention Policies</h4>
              <Button 
                className="btn primary" 
                onClick={() => {
                  const dataset = prompt('Enter dataset name:');
                  const basis = prompt('Enter legal basis:');
                  const days = prompt('Enter retention days:');
                  if (dataset && basis && days) {
                    createRetentionMutation.mutate({
                      dataset,
                      basis,
                      ttlDays: parseInt(days),
                      disposition: 'delete',
                      enabled: true,
                    });
                  }
                }}
                data-testid="button-add-retention"
              >
                Add Policy
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Dataset</th>
                    <th>Legal Basis</th>
                    <th>Retention</th>
                    <th>Disposition</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {policies?.policies?.map((policy: RetentionPolicy) => (
                    <tr key={policy.id}>
                      <td>
                        <code className="text-xs bg-gray-100 px-1 rounded">
                          {policy.dataset}
                        </code>
                      </td>
                      <td>{policy.basis}</td>
                      <td>{policy.ttlDays} days</td>
                      <td>
                        <Badge variant="outline">{policy.disposition}</Badge>
                      </td>
                      <td>
                        {policy.enabled ? (
                          <Badge className="badge-ok">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-500 py-4">
                        No retention policies configured
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Suppression Tab */}
        {activeTab === 'suppression' && (
          <div className="p-4">
            <div className="card-header mb-4">
              <h4 className="font-medium">Suppression List</h4>
              <div className="flex gap-2">
                <Input
                  placeholder="email to suppress"
                  value={suppressionEmail}
                  onChange={(e) => setSuppressionEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSuppression()}
                  className="w-64"
                  data-testid="input-suppression-email"
                />
                <Button 
                  onClick={handleAddSuppression}
                  disabled={addSuppressionMutation.isPending}
                  data-testid="button-add-suppression"
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Email Hash (SHA256)</th>
                    <th>Reason</th>
                    <th>Added</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {suppressions?.suppressions?.map((suppression: Suppression) => (
                    <tr key={suppression.id}>
                      <td>
                        <code className="text-xs bg-gray-100 px-1 rounded">
                          {suppression.emailHash.substring(0, 16)}...
                        </code>
                      </td>
                      <td>{suppression.reason}</td>
                      <td>{formatDate(suppression.addedAt)}</td>
                      <td>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => {
                            // TODO: Implement remove suppression
                            toast({ title: 'Remove functionality coming soon' });
                          }}
                          data-testid={`button-remove-suppression-${suppression.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4">
                        No suppressed emails
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Components */}
      {drawerState.type === 'consent' && drawerState.userId && (
        <ConsentHistoryDrawer userId={drawerState.userId} onClose={closeDrawer} />
      )}
      {drawerState.type === 'dsar' && drawerState.requestId && (
        <DsarDetailsDrawer requestId={drawerState.requestId} onClose={closeDrawer} />
      )}
    </div>
  );
}

// Consent History Drawer Component
const ConsentHistoryDrawer = ({ userId, onClose }: { userId: string; onClose: () => void }) => {
  const { data: events } = useQuery({
    queryKey: ['/api/gdpr/consents', userId, 'events'],
    enabled: !!userId,
  });

  const { data: effective } = useQuery({
    queryKey: ['/api/gdpr/consents', userId, 'effective'],
    enabled: !!userId,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="gdpr-backdrop" onClick={onClose} />
      <div className="gdpr-drawer open">
        <div className="gdpr-head">
          <div>
            <div className="eyebrow">Consent History</div>
            <h2>User ID: {userId}</h2>
            <div className="subtle">Complete consent ledger and effective status</div>
          </div>
          <button className="icon-x" onClick={onClose}>×</button>
        </div>
        
        <div className="gdpr-body">
          <div className="grid-3">
            <div className="kpi-box">
              <div className="kpi-title">Marketing</div>
              <span className={`badge ${effective?.consents?.marketing ? 'badge-ok' : 'badge-no'}`}>
                {effective?.consents?.marketing ? 'Granted' : 'Denied'}
              </span>
            </div>
            <div className="kpi-box">
              <div className="kpi-title">Analytics</div>
              <span className={`badge ${effective?.consents?.analytics ? 'badge-ok' : 'badge-no'}`}>
                {effective?.consents?.analytics ? 'Granted' : 'Denied'}
              </span>
            </div>
            <div className="kpi-box">
              <div className="kpi-title">Functional</div>
              <span className={`badge ${effective?.consents?.functional ? 'badge-ok' : 'badge-no'}`}>
                {effective?.consents?.functional ? 'Granted' : 'Denied'}
              </span>
            </div>
          </div>
          
          <div className="mt-10">
            <h3>Consent Events Timeline</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Legal Basis</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {events?.map((event: GdprConsentEvent) => (
                  <tr key={event.id}>
                    <td className="muted">{formatDate(event.occurredAt)}</td>
                    <td>{event.category}</td>
                    <td>
                      <span className={`badge ${event.status === 'granted' ? 'badge-ok' : 'badge-no'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="muted">{event.legalBasis}</td>
                    <td className="muted">{event.processingMethod}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No consent events found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="gdpr-foot">
          <span className="muted">Last updated: {new Date().toLocaleString()}</span>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
};

// DSAR Details Drawer Component
const DsarDetailsDrawer = ({ requestId, onClose }: { requestId: string; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: request } = useQuery({
    queryKey: ['/api/gdpr/requests', requestId],
    enabled: !!requestId,
  });

  const { data: timeline } = useQuery({
    queryKey: ['/api/gdpr/requests', requestId, 'timeline'],
    enabled: !!requestId,
  });

  const verifyMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/gdpr/requests/${requestId}/verify`),
    onSuccess: () => {
      toast({ title: 'Verification link sent' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/requests', requestId, 'timeline'] });
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/gdpr/requests/${requestId}/export`),
    onSuccess: () => {
      toast({ title: 'Export generation started' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/requests', requestId, 'timeline'] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/gdpr/requests/${requestId}/complete`),
    onSuccess: () => {
      toast({ title: 'DSAR request completed' });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/gdpr/requests', requestId] });
      onClose();
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!request) return null;

  return (
    <>
      <div className="gdpr-backdrop" onClick={onClose} />
      <div className="gdpr-drawer open">
        <div className="gdpr-head">
          <div>
            <div className="eyebrow">DSAR Request</div>
            <h2>{request.type.toUpperCase()} - {request.subjectEmail}</h2>
            <div className="subtle">Request ID: {request.id}</div>
          </div>
          <button className="icon-x" onClick={onClose}>×</button>
        </div>
        
        <div className="gdpr-body">
          <div className="grid-3">
            <div className="kpi-box">
              <div className="kpi-title">Status</div>
              <span className={`badge badge-${request.status}`}>
                {request.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="kpi-box">
              <div className="kpi-title">Days Remaining</div>
              <strong>{Math.max(0, Math.ceil((new Date(request.dueAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}</strong>
            </div>
            <div className="kpi-box">
              <div className="kpi-title">Legal Basis</div>
              <span className="muted">{request.legalBasis}</span>
            </div>
          </div>
          
          <hr className="sep" />
          
          <div>
            <h3>Actions</h3>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button 
                className="btn primary" 
                onClick={() => verifyMutation.mutate()}
                disabled={verifyMutation.isPending}
              >
                Send Verification
              </button>
              <button 
                className="btn" 
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
              >
                Generate Export
              </button>
              <button 
                className="btn" 
                onClick={() => completeMutation.mutate()}
                disabled={completeMutation.isPending || request.status === 'completed'}
              >
                Mark Complete
              </button>
            </div>
          </div>
          
          <hr className="sep" />
          
          <div>
            <h3>Timeline</h3>
            <ul className="timeline">
              {timeline?.map((event: any, index: number) => (
                <li key={index}>
                  <div className="time">{formatDate(event.at)}</div>
                  <div className="ev">{event.event}</div>
                  <div className="meta">
                    {event.actor && `by ${event.actor}`} {event.note && `- ${event.note}`}
                  </div>
                </li>
              )) || (
                <li>
                  <div className="ev">No timeline events</div>
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="gdpr-foot">
          <span className="muted">Due: {formatDate(request.dueAt)}</span>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
};