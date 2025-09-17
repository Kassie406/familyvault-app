import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Flag, Users, Percent, Target, Eye, Edit, 
  ToggleLeft, ToggleRight, Plus, Trash2, 
  Zap, AlertTriangle, CheckCircle, Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { TargetingDrawer } from './targeting-drawer';

interface Flag {
  id: string;
  key: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  force_on?: boolean;
  force_off?: boolean;
  targeting: {
    percentage?: number;
    allowDomains?: string[];
    allowUserIds?: string[];
    blockUserIds?: string[];
  };
  updated_at: string;
}

interface EnhancedFeatureFlagsProps {
  className?: string;
}

export default function EnhancedFeatureFlags({ className }: EnhancedFeatureFlagsProps) {
  const { toast } = useToast();
  const [editing, setEditing] = useState<Flag | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');
  const [targetingFlag, setTargetingFlag] = useState<Flag | null>(null);

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/flags'],
    queryFn: async () => {
      const response = await fetch('/api/admin/flags');
      if (!response.ok) throw new Error('Failed to fetch feature flags');
      const data = await response.json();
      return data.flags as Flag[];
    },
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(f =>
      f.key.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q)
    );
  }, [items, query]);

  const createMutation = useMutation({
    mutationFn: async (flagData: Partial<Flag>) => {
      const response = await fetch('/api/admin/flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flagData),
      });
      if (!response.ok) throw new Error('Failed to create flag');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Feature flag created successfully' });
      refetch();
      setCreating(false);
    },
    onError: () => {
      toast({ title: 'Failed to create feature flag', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Flag> & { id: string }) => {
      const response = await fetch(`/api/admin/flags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update flag');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Feature flag updated successfully' });
      refetch();
      setEditing(null);
    },
    onError: () => {
      toast({ title: 'Failed to update feature flag', variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Enhanced Feature Flags</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage feature rollouts with advanced targeting and preview</p>
        </div>
        <Button onClick={() => setCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Flag
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-[#111827] text-white border-[#1F2937] hover:bg-[#1F2937] hover:text-white">
                All Envs ▾
              </Button>
              <Button variant="outline" className="bg-[#111827] text-white border-[#1F2937] hover:bg-[#1F2937] hover:text-white">
                All Status ▾
              </Button>
              <Button variant="outline" className="bg-[#111827] text-white border-[#1F2937] hover:bg-[#1F2937] hover:text-white">
                All Owners ▾
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search flags..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-300"
                  data-testid="input-search-flags"
                />
              </div>
              <Button 
                onClick={() => setCreating(true)} 
                className="bg-[#F4B400] text-black hover:bg-[#E6A200] border-0"
                data-testid="button-new-flag"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Flag
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading flags...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5EAF2]">
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Key</th>
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Rollout</th>
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Force</th>
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Updated</th>
                    <th className="text-left py-3 px-4 font-medium text-[#111827]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(flag => (
                    <tr key={flag.id} className="border-b">
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {flag.key}
                        </code>
                      </td>
                      <td className="py-3 px-4 font-medium">{flag.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {flag.targeting?.percentage ?? 0}%
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {flag.force_on ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">ON</Badge>
                        ) : flag.force_off ? (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">OFF</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-600">Off</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {flag.status === 'active' 
                          ? <Badge className="bg-green-100 text-green-800">Active</Badge>
                          : <Badge variant="secondary">Archived</Badge>
                        }
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(flag.updated_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTargetingFlag(flag)}
                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300"
                            data-testid={`button-target-${flag.key}`}
                          >
                            <Target className="h-3 w-3 mr-1" />
                            Target
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(flag)}
                            data-testid={`button-edit-${flag.key}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        {query ? `No flags match "${query}"` : 'No feature flags created yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
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
              {editing ? 'Edit Feature Flag' : 'Create Feature Flag'}
            </DialogTitle>
          </DialogHeader>
          <FlagEditor
            flag={editing}
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

      {/* Targeting Drawer */}
      <TargetingDrawer
        isOpen={!!targetingFlag}
        onClose={() => setTargetingFlag(null)}
        flagKey={targetingFlag?.key || ''}
        flagName={targetingFlag?.name || ''}
      />
    </div>
  );
}

function FlagEditor({
  flag,
  onSubmit,
  onCancel
}: {
  flag?: Flag | null;
  onSubmit: (data: Partial<Flag>) => void;
  onCancel: () => void;
}) {
  const isEdit = Boolean(flag?.id);
  const [formData, setFormData] = useState({
    key: flag?.key || '',
    name: flag?.name || '',
    description: flag?.description || '',
    status: flag?.status || 'active' as const,
    force_on: flag?.force_on || false,
    force_off: flag?.force_off || false,
    targeting: {
      percentage: flag?.targeting?.percentage ?? 0,
      allowDomains: flag?.targeting?.allowDomains?.join(', ') || '',
      allowUserIds: flag?.targeting?.allowUserIds?.join(', ') || '',
      blockUserIds: flag?.targeting?.blockUserIds?.join(', ') || '',
    }
  });
  const [testingUser, setTestingUser] = useState('');
  const [preview, setPreview] = useState<boolean | null>(null);

  // Keep force_on/off mutually exclusive
  useEffect(() => {
    if (formData.force_on && formData.force_off) {
      setFormData(d => ({ ...d, force_off: false }));
    }
  }, [formData.force_on]);

  useEffect(() => {
    if (formData.force_off && formData.force_on) {
      setFormData(d => ({ ...d, force_on: false }));
    }
  }, [formData.force_off]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      key: formData.key,
      name: formData.name,
      description: formData.description,
      status: formData.status,
      force_on: formData.force_on,
      force_off: formData.force_off,
      targeting: {
        percentage: formData.targeting.percentage,
        allowDomains: formData.targeting.allowDomains 
          ? formData.targeting.allowDomains.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        allowUserIds: formData.targeting.allowUserIds
          ? formData.targeting.allowUserIds.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        blockUserIds: formData.targeting.blockUserIds
          ? formData.targeting.blockUserIds.split(',').map(s => s.trim()).filter(Boolean)
          : [],
      }
    });
  };

  const testUser = async () => {
    if (!testingUser) return;
    // Simple simulation of flag evaluation
    const result = Math.random() < (formData.targeting.percentage / 100);
    setPreview(formData.force_on ? true : formData.force_off ? false : result);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="key">Flag Key *</Label>
          <Input
            id="key"
            value={formData.key}
            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
            placeholder="new-billing-ui"
            disabled={isEdit}
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Display Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="New Billing UI"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Enables the redesigned billing interface"
        />
      </div>

      {/* Rollout & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Rollout Percentage</Label>
          <div className="flex items-center gap-4 mt-2">
            <Input
              type="number"
              min={0}
              max={100}
              value={formData.targeting.percentage}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targeting: { ...prev.targeting, percentage: Number(e.target.value) }
              }))}
              className="w-20"
            />
            <span className="text-sm text-gray-600">
              {formData.targeting.percentage}%
            </span>
          </div>
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'active' | 'archived') =>
              setFormData(prev => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Force Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="force-on"
            checked={formData.force_on}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, force_on: checked }))
            }
          />
          <Label htmlFor="force-on">Force ON (override all rules)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="force-off"
            checked={formData.force_off}
            onCheckedChange={(checked) =>
              setFormData(prev => ({ ...prev, force_off: checked }))
            }
          />
          <Label htmlFor="force-off">Force OFF (kill switch)</Label>
        </div>
      </div>

      {/* Targeting Rules */}
      <div className="space-y-4">
        <h3 className="font-medium">Targeting Rules</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="allow-domains">Allowed Domains</Label>
            <Input
              id="allow-domains"
              value={formData.targeting.allowDomains}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targeting: { ...prev.targeting, allowDomains: e.target.value }
              }))}
              placeholder="@company.com, @partner.org"
            />
          </div>
          <div>
            <Label htmlFor="allow-users">Allowed User IDs</Label>
            <Input
              id="allow-users"
              value={formData.targeting.allowUserIds}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targeting: { ...prev.targeting, allowUserIds: e.target.value }
              }))}
              placeholder="uuid1, uuid2"
            />
          </div>
          <div>
            <Label htmlFor="block-users">Blocked User IDs</Label>
            <Input
              id="block-users"
              value={formData.targeting.blockUserIds}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targeting: { ...prev.targeting, blockUserIds: e.target.value }
              }))}
              placeholder="uuid1, uuid2"
            />
          </div>
        </div>
      </div>

      {/* Preview Testing */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <Label>Test Flag Evaluation</Label>
        <div className="flex items-center gap-4 mt-2">
          <Input
            placeholder="Preview as user ID or email..."
            value={testingUser}
            onChange={(e) => setTestingUser(e.target.value)}
            className="flex-1"
          />
          <Button type="button" onClick={testUser} disabled={!testingUser}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {preview !== null && (
            <Badge
              className={
                preview
                  ? 'bg-green-100 text-green-800 border-green-200'
                  : 'bg-red-100 text-red-800 border-red-200'
              }
            >
              {preview ? 'ENABLED' : 'DISABLED'}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEdit ? 'Update Flag' : 'Create Flag'}
        </Button>
      </div>
    </form>
  );
}