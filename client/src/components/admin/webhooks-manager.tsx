import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  const { data: webhooks = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/webhooks'],
    queryFn: async () => {
      const response = await fetch('/api/admin/webhooks');
      if (!response.ok) throw new Error('Failed to fetch webhooks');
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

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Webhook className="h-5 w-5 text-purple-500" />
              Webhook Endpoints
            </div>
            <Button onClick={() => setCreating(true)} data-testid="button-new-webhook">
              <Plus className="h-4 w-4 mr-2" />
              New Endpoint
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No webhook endpoints configured</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setCreating(true)}
              >
                Create your first endpoint
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  data-testid={`webhook-${webhook.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="h-4 w-4 text-purple-500" />
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {webhook.url}
                        </code>
                        <Badge
                          className={
                            webhook.active
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                          }
                        >
                          {webhook.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
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
                            <Badge
                              key={event}
                              variant="outline"
                              className="text-xs"
                            >
                              {event}
                            </Badge>
                          ))}
                          {webhook.events.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{webhook.events.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testMutation.mutate(webhook.id)}
                        disabled={testMutation.isPending}
                        data-testid={`button-test-${webhook.id}`}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(webhook)}
                        data-testid={`button-edit-${webhook.id}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
        <Label htmlFor="url">Endpoint URL *</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://api.yoursite.com/webhooks"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be a valid HTTPS URL that can receive POST requests
        </p>
      </div>

      <div>
        <Label htmlFor="secret">Webhook Secret (optional)</Label>
        <Input
          id="secret"
          type="password"
          value={formData.secret}
          onChange={(e) => setFormData(prev => ({ ...prev, secret: e.target.value }))}
          placeholder="Leave empty to auto-generate"
        />
        <p className="text-xs text-gray-500 mt-1">
          Used to verify webhook authenticity via HMAC signature
        </p>
      </div>

      <div>
        <Label>Events to Subscribe *</Label>
        <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
          {AVAILABLE_EVENTS.map((event) => (
            <label
              key={event}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Checkbox
                checked={formData.events.includes(event)}
                onCheckedChange={() => toggleEvent(event)}
              />
              <span className="text-sm">{event}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Select which events will trigger this webhook ({formData.events.length} selected)
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: !!checked }))}
        />
        <Label htmlFor="active">Active (start receiving events immediately)</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!formData.url || formData.events.length === 0}
        >
          {webhook ? 'Update Endpoint' : 'Create Endpoint'}
        </Button>
      </div>
    </form>
  );
}