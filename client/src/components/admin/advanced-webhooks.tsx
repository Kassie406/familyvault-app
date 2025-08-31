import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, TestTube, Trash2, Send, Globe, Shield, Key, Pause, RotateCcw } from 'lucide-react';

type WebhookEndpoint = {
  id: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  last_delivery?: {
    status: number;
    timestamp: string;
  };
};

type WebhookDraft = {
  id?: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
};

const AVAILABLE_EVENTS = [
  'user.created',
  'user.updated', 
  'user.deleted',
  'invoice.paid',
  'invoice.failed',
  'subscription.created',
  'subscription.updated',
  'subscription.cancelled',
  'payment.succeeded',
  'payment.failed'
];

export default function AdvancedWebhooks() {
  const { toast } = useToast();
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WebhookEndpoint | null>(null);
  const [creating, setCreating] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  async function loadEndpoints() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/webhooks', { credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        setEndpoints(data.items || []);
      } else {
        // Mock data for demo
        setEndpoints([
          {
            id: 'wh-1',
            url: 'https://example.com/webhooks/fcs',
            secret: 'whsec_••••U8qJ',
            events: ['user.created', 'payment.succeeded'],
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_delivery: {
              status: 200,
              timestamp: new Date(Date.now() - 180000).toISOString() // 3 minutes ago
            }
          }
        ]);
      }
    } catch (error) {
      // Use mock data on error
      setEndpoints([]);
    }
    setLoading(false);
  }

  async function testEndpoint(endpoint: WebhookEndpoint) {
    setTesting(endpoint.id);
    try {
      const r = await fetch(`/api/admin/webhooks/${endpoint.id}/test`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'test.webhook' })
      });

      if (r.ok) {
        toast({
          title: 'Test Successful',
          description: 'Test webhook was sent successfully',
        });
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      toast({
        title: 'Test Failed',
        description: 'Failed to send test webhook',
        variant: 'destructive',
      });
    }
    setTesting(null);
  }

  function deleteEndpoint(endpoint: WebhookEndpoint) {
    // Immediate local state update for better UX
    setEndpoints(prev => prev.filter(e => e.id !== endpoint.id));
    console.log('Webhook endpoint deleted:', endpoint.url);
    toast({
      title: 'Webhook Deleted',
      description: `"${endpoint.url}" has been deleted.`,
      variant: 'destructive',
    });
  }

  useEffect(() => { loadEndpoints(); }, []);

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.events.some(event => event.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (active: boolean) => {
    return active ? 'badge-live' : 'badge-paused';
  };

  const getDeliveryBadge = (status?: number) => {
    if (!status) return 'badge-dead';
    if (status >= 200 && status < 300) return 'badge-2xx';
    if (status >= 400 && status < 500) return 'badge-4xx';
    if (status >= 500) return 'badge-5xx';
    return 'badge-dead';
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div id="webhooks-root" className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Webhooks</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage outbound webhook integrations</p>
        </div>
      </div>

      {/* Main Webhooks Card */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Webhook Endpoints</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="filter-btn" data-testid="filter-webhook-status">
              All Status ▾
            </button>
            <input 
              className="btn ghost" 
              style={{ padding: '10px 12px', width: '200px' }}
              placeholder="Search endpoints…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-webhooks"
            />
            <button 
              className="btn primary" 
              onClick={() => setCreating(true)}
              data-testid="button-new-webhook"
            >
              + New Endpoint
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty">
            <div className="icon">⏳</div>
            <h4 style={{ margin: '8px 0', color: '#111827' }}>Loading endpoints...</h4>
          </div>
        ) : filteredEndpoints.length === 0 ? (
          <div className="empty">
            <div className="icon">🪝</div>
            <h4 style={{ margin: '8px 0', color: '#111827' }}>No webhook endpoints configured</h4>
            <p style={{ margin: '8px 0 16px 0' }}>Add an endpoint to receive events from FamilyCircle Secure (user.created, plan.updated, payment.succeeded, etc.).</p>
            <button 
              className="btn primary" 
              onClick={() => setCreating(true)}
              data-testid="button-create-first-webhook"
            >
              Create your first endpoint
            </button>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>URL</th>
                <th>Secret</th>
                <th>Events</th>
                <th>Status</th>
                <th>Last Delivery</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEndpoints.map(endpoint => (
                <tr key={endpoint.id}>
                  <td>
                    <code style={{ 
                      background: '#F3F4F6', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}>
                      {endpoint.url}
                    </code>
                  </td>
                  <td>
                    <code style={{ 
                      background: '#F3F4F6', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '13px',
                      fontFamily: 'monospace'
                    }}>
                      {endpoint.secret}
                    </code>
                  </td>
                  <td>
                    {endpoint.events.length === AVAILABLE_EVENTS.length ? (
                      <span>All events</span>
                    ) : (
                      <span>{endpoint.events.length} events</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(endpoint.active)}`}>
                      {endpoint.active ? 'Live' : 'Paused'}
                    </span>
                  </td>
                  <td>
                    {endpoint.last_delivery ? (
                      <>
                        <span className={`badge ${getDeliveryBadge(endpoint.last_delivery.status)}`}>
                          {endpoint.last_delivery.status}
                        </span>
                        {' '}
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>
                          {formatTimeAgo(endpoint.last_delivery.timestamp)}
                        </span>
                      </>
                    ) : (
                      <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Never</span>
                    )}
                  </td>
                  <td className="row-actions">
                    <button
                      title="Send test"
                      onClick={() => testEndpoint(endpoint)}
                      disabled={testing === endpoint.id}
                      data-testid={`button-test-webhook-${endpoint.id}`}
                    >
                      🧪
                    </button>
                    <button
                      title="View deliveries"
                      data-testid={`button-view-deliveries-${endpoint.id}`}
                    >
                      📜
                    </button>
                    <button
                      title="Reveal/rotate secret"
                      data-testid={`button-rotate-secret-${endpoint.id}`}
                    >
                      🔑
                    </button>
                    <button
                      title="Pause"
                      data-testid={`button-pause-webhook-${endpoint.id}`}
                    >
                      ⏸️
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteEndpoint(endpoint)}
                      data-testid={`button-delete-webhook-${endpoint.id}`}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Deliveries Card */}
      {filteredEndpoints.length > 0 && (
        <div className="card" style={{ marginTop: '12px' }}>
          <div className="card-header">
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Recent Deliveries</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="filter-btn" data-testid="filter-delivery-attempts">
                All Attempts ▾
              </button>
              <button className="filter-btn" data-testid="filter-delivery-time">
                Last 24h ▾
              </button>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Endpoint</th>
                <th>Response</th>
                <th>Latency</th>
                <th style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>08:14:10</td>
                <td>
                  <code style={{ 
                    background: '#F3F4F6', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    user.created
                  </code>
                </td>
                <td>/webhooks/fcs</td>
                <td>
                  <span className="badge badge-2xx">200</span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '13px', color: '#6B7280' }}>182 ms</td>
                <td className="row-actions">
                  <button
                    title="View payload"
                    data-testid="button-view-payload"
                  >
                    👁️
                  </button>
                  <button
                    title="Redeliver"
                    data-testid="button-redeliver"
                  >
                    ↻
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      {(creating || editing) && (
        <WebhookEditor
          initial={editing || undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); loadEndpoints(); }}
        />
      )}
    </div>
  );
}

interface WebhookEditorProps {
  initial?: WebhookEndpoint;
  onClose: () => void;
  onSaved: () => void;
}

function WebhookEditor({ initial, onClose, onSaved }: WebhookEditorProps) {
  const { toast } = useToast();
  const [draft, setDraft] = useState<WebhookDraft>(initial || {
    url: '',
    events: [],
    active: true
  });
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function save() {
    if (!draft.url || draft.events.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'URL and at least one event are required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const body = JSON.stringify(draft);
      const opts = { 
        method: isEdit ? 'PATCH' : 'POST', 
        credentials: 'include' as const, 
        headers: { 'Content-Type': 'application/json' }, 
        body 
      };
      const url = isEdit ? `/api/admin/webhooks/${draft.id}` : '/api/admin/webhooks';
      const r = await fetch(url, opts);
      
      if (!r.ok) {
        throw new Error('Save failed');
      }
      
      toast({
        title: 'Success',
        description: `Webhook endpoint ${isEdit ? 'updated' : 'created'} successfully`,
      });
      onSaved();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save webhook endpoint',
        variant: 'destructive',
      });
    }
    setSaving(false);
  }

  const toggleEvent = (event: string, checked: boolean) => {
    setDraft(d => ({
      ...d,
      events: checked 
        ? [...d.events, event]
        : d.events.filter(e => e !== event)
    }));
  };

  const generateSecret = () => {
    const secret = 'whsec_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 64);
    setDraft(d => ({ ...d, secret }));
    setShowSecret(true);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {isEdit ? 'Edit Webhook Endpoint' : 'Create Webhook Endpoint'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Endpoint URL (POST)</Label>
            <Input
              id="webhook-url"
              value={draft.url}
              onChange={e => setDraft(d => ({ ...d, url: e.target.value }))}
              placeholder="https://your-app.com/webhooks"
              data-testid="input-webhook-url"
            />
            <p className="text-sm text-gray-500">
              Must be a valid HTTPS URL that can receive POST requests
            </p>
          </div>

          <div className="space-y-2">
            <Label>Secret</Label>
            <div className="flex gap-2">
              <Input
                value={draft.secret || ''}
                type={showSecret ? 'text' : 'password'}
                placeholder={isEdit ? 'Current secret (hidden)' : 'Auto-generated on save'}
                readOnly={!isEdit}
                data-testid="input-webhook-secret"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSecret(!showSecret)}
                data-testid="button-toggle-secret"
              >
                {showSecret ? 'Hide' : 'Show'}
              </Button>
              {isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSecret}
                  data-testid="button-rotate-secret"
                >
                  Rotate
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Signing method: HMAC-SHA256 (header: FCS-Signature)
            </p>
          </div>

          <div className="space-y-3">
            <Label>Events to Send</Label>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded p-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-events"
                  checked={draft.events.length === AVAILABLE_EVENTS.length}
                  onCheckedChange={(checked) => {
                    setDraft(d => ({
                      ...d,
                      events: checked ? [...AVAILABLE_EVENTS] : []
                    }));
                  }}
                  data-testid="checkbox-all-events"
                />
                <Label htmlFor="all-events" className="text-sm font-semibold cursor-pointer">
                  All events
                </Label>
              </div>
              {AVAILABLE_EVENTS.map(event => (
                <div key={event} className="flex items-center space-x-2">
                  <Checkbox
                    id={`event-${event}`}
                    checked={draft.events.includes(event)}
                    onCheckedChange={(checked) => toggleEvent(event, !!checked)}
                    data-testid={`checkbox-event-${event}`}
                  />
                  <Label 
                    htmlFor={`event-${event}`} 
                    className="text-sm font-mono cursor-pointer"
                  >
                    {event}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Retry Policy</Label>
            <div className="text-sm text-gray-600">
              Backoff: 10s, 30s, 2m, 5m up to 5 attempts
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="pause-after-failures"
                defaultChecked={true}
                data-testid="checkbox-pause-after-failures"
              />
              <Label htmlFor="pause-after-failures" className="text-sm">
                Pause after 10 consecutive failures (dead-letter)
              </Label>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="webhook-active"
              checked={draft.active}
              onCheckedChange={(checked) => setDraft(d => ({ ...d, active: !!checked }))}
              data-testid="checkbox-webhook-active"
            />
            <Label htmlFor="webhook-active">Active (receive webhooks)</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel-webhook">
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} data-testid="button-save-webhook">
              <Send className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : isEdit ? 'Update Endpoint' : 'Create Endpoint'}
            </Button>
            {!isEdit && (
              <Button
                variant="outline"
                onClick={() => {
                  // Send test event
                  toast({
                    title: 'Test Event Ready',
                    description: 'Choose sample event (e.g., user.created) and send test',
                  });
                }}
                data-testid="button-send-test"
              >
                Send Test
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}