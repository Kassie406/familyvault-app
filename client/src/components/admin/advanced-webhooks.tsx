import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, TestTube, Trash2, Send, Globe, Shield } from 'lucide-react';

type WebhookEndpoint = {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
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

  async function loadEndpoints() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/webhooks', { credentials: 'include' });
      const data = await r.json();
      setEndpoints(data.items || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load webhook endpoints',
        variant: 'destructive',
      });
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

  async function deleteEndpoint(endpoint: WebhookEndpoint) {
    if (!confirm(`Delete webhook endpoint: ${endpoint.url}?`)) return;

    try {
      const r = await fetch(`/api/admin/webhooks/${endpoint.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (r.ok) {
        toast({
          title: 'Success',
          description: 'Webhook endpoint deleted',
        });
        loadEndpoints();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete webhook endpoint',
        variant: 'destructive',
      });
    }
  }

  useEffect(() => { loadEndpoints(); }, []);

  const getStatusBadge = (active: boolean) => {
    return active 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Webhook Endpoints</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage outbound webhook integrations</p>
        </div>
        <Button onClick={() => setCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Endpoint
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Active Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading endpoints...</div>
          ) : (
            <div className="space-y-4">
              {endpoints.map(endpoint => (
                <div key={endpoint.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                          {endpoint.url}
                        </code>
                        {getStatusBadge(endpoint.active)}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {endpoint.events.map(event => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Created: {new Date(endpoint.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testEndpoint(endpoint)}
                        disabled={testing === endpoint.id}
                        className="flex items-center gap-1"
                        data-testid={`button-test-webhook-${endpoint.id}`}
                      >
                        <TestTube className="w-3 h-3" />
                        {testing === endpoint.id ? 'Testing...' : 'Test'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(endpoint)}
                        className="flex items-center gap-1"
                        data-testid={`button-edit-webhook-${endpoint.id}`}
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteEndpoint(endpoint)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        data-testid={`button-delete-webhook-${endpoint.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {endpoints.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No webhook endpoints configured
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
            <Label htmlFor="webhook-url">Endpoint URL</Label>
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

          <div className="space-y-3">
            <Label>Events to Subscribe</Label>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded p-3">
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
            <p className="text-sm text-gray-500">
              Select which events should trigger this webhook
            </p>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}