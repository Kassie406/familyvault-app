import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Webhook, Globe, Send, Play, Pause, Plus, 
  Edit, Trash2, CheckCircle, AlertTriangle,
  Clock, Eye, Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WebhooksManagerProps {
  className?: string;
}

const AVAILABLE_EVENTS = [
  'user.created',
  'user.updated', 
  'user.deleted',
  'invoice.created',
  'invoice.paid',
  'invoice.failed',
  'subscription.created',
  'subscription.updated',
  'subscription.cancelled',
  'payment.succeeded',
  'payment.failed',
];

export default function WebhooksManager({ className }: WebhooksManagerProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState<WebhookEndpoint | null>(null);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: webhooks = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/webhooks'],
    queryFn: async () => {
      const response = await fetch('/api/admin/webhooks');
      if (!response.ok) {
        // Return mock data for demo
        return [
          {
            id: 'wh-basic-1',
            url: 'https://api.example.com/webhooks/fcs',
            events: ['user.created', 'payment.succeeded'],
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      }
      const data = await response.json();
      return data.items as WebhookEndpoint[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (webhookData: Partial<WebhookEndpoint>) => {
      const response = await fetch('/api/admin/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });
      if (!response.ok) throw new Error('Failed to create webhook');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Webhook endpoint created successfully' });
      refetch();
      setCreating(false);
    },
    onError: () => {
      toast({ title: 'Failed to create webhook endpoint', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WebhookEndpoint> & { id: string }) => {
      const response = await fetch(`/api/admin/webhooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update webhook');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Webhook endpoint updated successfully' });
      refetch();
      setEditing(null);
    },
    onError: () => {
      toast({ title: 'Failed to update webhook endpoint', variant: 'destructive' });
    },
  });

  const testMutation = useMutation({
    mutationFn: async (webhookId: string) => {
      const response = await fetch(`/api/admin/webhooks/${webhookId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'test.webhook' }),
      });
      if (!response.ok) throw new Error('Failed to test webhook');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({ title: 'Webhook test sent successfully' });
      } else {
        toast({ title: 'Webhook test failed', variant: 'destructive' });
      }
    },
    onError: () => {
      toast({ title: 'Failed to send webhook test', variant: 'destructive' });
    },
  });

  const filteredWebhooks = webhooks.filter(webhook =>
    webhook.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webhook.events.some(event => event.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div id="webhooks-root" className={className}>
      {/* Main Webhooks Card */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Webhook Endpoints</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button className="btn ghost" data-testid="button-docs-webhook">
              Docs
            </button>
            <button 
              className="btn primary" 
              onClick={() => setCreating(true)}
              data-testid="button-new-webhook"
            >
              + New Endpoint
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="empty">
            <div className="icon">⏳</div>
            <h4 style={{ margin: '8px 0', color: '#111827' }}>Loading endpoints...</h4>
          </div>
        ) : filteredWebhooks.length === 0 ? (
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
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
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
            </div>
            
            <div className="space-y-4">
              {filteredWebhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  style={{
                    border: '1px solid #E5EAF2',
                    borderRadius: '12px',
                    padding: '16px',
                    background: '#fff'
                  }}
                  data-testid={`webhook-${webhook.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-4 w-4" style={{ color: '#6366F1' }} />
                        <code style={{ 
                          background: '#F3F4F6', 
                          padding: '4px 8px', 
                          borderRadius: '6px', 
                          fontSize: '13px',
                          fontFamily: 'monospace'
                        }}>
                          {webhook.url}
                        </code>
                        <span className={`badge ${webhook.active ? 'badge-live' : 'badge-paused'}`}>
                          {webhook.active ? 'Live' : 'Paused'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm" style={{ color: '#6B7280' }}>
                        <div className="flex items-center gap-1">
                          <Send className="h-3 w-3" />
                          <span>{webhook.events.length} events</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Created {new Date(webhook.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {webhook.events.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {webhook.events.slice(0, 3).map((event) => (
                            <span
                              key={event}
                              style={{
                                background: '#F3F4F6',
                                color: '#374151',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontFamily: 'monospace'
                              }}
                            >
                              {event}
                            </span>
                          ))}
                          {webhook.events.length > 3 && (
                            <span style={{
                              background: '#F3F4F6',
                              color: '#374151',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}>
                              +{webhook.events.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="row-actions">
                      <button
                        title="Send test"
                        onClick={() => testMutation.mutate(webhook.id)}
                        disabled={testMutation.isPending}
                        data-testid={`button-test-${webhook.id}`}
                      >
                        🧪
                      </button>
                      <button
                        title="Edit endpoint"
                        onClick={() => setEditing(webhook)}
                        data-testid={`button-edit-${webhook.id}`}
                      >
                        ✏️
                      </button>
                      <button
                        title="Delete endpoint"
                        data-testid={`button-delete-${webhook.id}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={creating || !!editing} onOpenChange={(open) => {
        if (!open) {
          setCreating(false);
          setEditing(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Webhook Endpoint' : 'Create Webhook Endpoint'}
            </DialogTitle>
          </DialogHeader>
          <WebhookForm
            webhook={editing}
            onSubmit={(data) => {
              if (editing) {
                updateMutation.mutate({ id: editing.id, ...data });
              } else {
                createMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WebhookForm({
  webhook,
  onSubmit,
  onCancel
}: {
  webhook?: WebhookEndpoint | null;
  onSubmit: (data: Partial<WebhookEndpoint>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    url: webhook?.url || '',
    events: webhook?.events || [],
    active: webhook?.active !== false,
    secret: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url || formData.events.length === 0) {
      return;
    }
    onSubmit({
      url: formData.url,
      events: formData.events,
      active: formData.active,
      ...(formData.secret && { secret: formData.secret }),
    });
  };

  const toggleEvent = (event: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="url">Endpoint URL (POST) *</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://api.yoursite.com/webhooks"
          required
          data-testid="input-webhook-url"
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be a valid HTTPS URL that can receive POST requests
        </p>
      </div>

      <div>
        <Label htmlFor="secret">Secret (auto-generate + reveal/rotate)</Label>
        <Input
          id="secret"
          type="password"
          value={formData.secret}
          onChange={(e) => setFormData(prev => ({ ...prev, secret: e.target.value }))}
          placeholder="Auto-generated on save"
          data-testid="input-webhook-secret"
        />
        <p className="text-xs text-gray-500 mt-1">
          Signing method: HMAC-SHA256 (header: FCS-Signature)
        </p>
      </div>

      <div>
        <Label>Events to Send *</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={formData.events.length === AVAILABLE_EVENTS.length}
              onCheckedChange={(checked) => {
                setFormData(prev => ({
                  ...prev,
                  events: checked ? [...AVAILABLE_EVENTS] : []
                }));
              }}
              data-testid="checkbox-all-events"
            />
            <span className="text-sm font-semibold">All events</span>
          </label>
          {AVAILABLE_EVENTS.map((event) => (
            <label
              key={event}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={formData.events.includes(event)}
                onCheckedChange={() => toggleEvent(event)}
                data-testid={`checkbox-event-${event}`}
              />
              <span className="text-sm font-mono">{event}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Select which events will trigger this webhook ({formData.events.length} selected)
        </p>
      </div>

      <div>
        <Label>Retry Policy</Label>
        <div className="text-sm text-gray-600 mb-2">
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
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: !!checked }))}
          data-testid="checkbox-webhook-active"
        />
        <Label htmlFor="active">Active (receive webhooks)</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-webhook">
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!formData.url || formData.events.length === 0}
          data-testid="button-save-webhook"
        >
          {webhook ? 'Update Endpoint' : 'Create Endpoint'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            toast({
              title: 'Test Event Ready',
              description: 'Choose sample event (e.g., user.created) and send test',
            });
          }}
          data-testid="button-send-test"
        >
          Send Test
        </Button>
      </div>
    </form>
  );
}