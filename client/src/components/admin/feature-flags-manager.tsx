import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Flag, Users, Percent, Target, Eye, Edit, 
  ToggleLeft, ToggleRight, Plus, Trash2, 
  Zap, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description?: string;
  status: 'active' | 'archived';
  forceOn?: boolean;
  forceOff?: boolean;
  targeting: {
    percentage?: number;
    allowDomains?: string[];
    allowUserIds?: string[];
    blockUserIds?: string[];
    allowRoles?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface FeatureFlagsManagerProps {
  className?: string;
}

export default function FeatureFlagsManager({ className }: FeatureFlagsManagerProps) {
  const { toast } = useToast();
  const [newFlagOpen, setNewFlagOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [previewUserId, setPreviewUserId] = useState('');

  const { data: flags = [], isLoading } = useQuery({
    queryKey: ['/api/admin/feature-flags'],
    queryFn: async () => {
      const response = await fetch('/api/admin/feature-flags');
      if (!response.ok) throw new Error('Failed to fetch feature flags');
      const data = await response.json();
      return data.flags as FeatureFlag[];
    },
  });

  const createFlagMutation = useMutation({
    mutationFn: async (flagData: Partial<FeatureFlag>) => {
      const response = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flagData),
      });
      if (!response.ok) throw new Error('Failed to create feature flag');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Feature flag created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/feature-flags'] });
      setNewFlagOpen(false);
    },
    onError: () => {
      toast({ title: 'Failed to create feature flag', variant: 'destructive' });
    },
  });

  const updateFlagMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FeatureFlag> & { id: string }) => {
      const response = await fetch(`/api/admin/feature-flags/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update feature flag');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Feature flag updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/feature-flags'] });
    },
    onError: () => {
      toast({ title: 'Failed to update feature flag', variant: 'destructive' });
    },
  });

  const toggleFlag = (flag: FeatureFlag, type: 'on' | 'off') => {
    updateFlagMutation.mutate({
      id: flag.id,
      forceOn: type === 'on' ? true : false,
      forceOff: type === 'off' ? true : false,
    });
  };

  const updateRollout = (flag: FeatureFlag, percentage: number) => {
    updateFlagMutation.mutate({
      id: flag.id,
      targeting: {
        ...flag.targeting,
        percentage,
      },
    });
  };

  const getStatusBadge = (flag: FeatureFlag) => {
    if (flag.forceOn) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Force ON</Badge>;
    }
    if (flag.forceOff) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Force OFF</Badge>;
    }
    if (flag.targeting?.percentage) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">{flag.targeting.percentage}% Rollout</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-blue-500" />
              Feature Flags Management
            </div>
            <Button onClick={() => setNewFlagOpen(true)} data-testid="button-new-flag">
              <Plus className="h-4 w-4 mr-2" />
              New Flag
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : flags.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No feature flags created yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setNewFlagOpen(true)}
              >
                Create your first flag
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Flag Test Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Test Flag Evaluation
                </h3>
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Enter user ID to test..."
                    value={previewUserId}
                    onChange={(e) => setPreviewUserId(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button variant="outline" size="sm">
                    Test All Flags
                  </Button>
                </div>
              </div>

              {/* Flags List */}
              <div className="space-y-3">
                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    data-testid={`flag-${flag.key}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">{flag.name}</h4>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {flag.key}
                          </code>
                          {getStatusBadge(flag)}
                        </div>
                        {flag.description && (
                          <p className="text-sm text-gray-600 mb-3">{flag.description}</p>
                        )}
                        
                        {/* Rollout Controls */}
                        <div className="space-y-3">
                          {/* Percentage Rollout */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                              <Percent className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Rollout:</span>
                            </div>
                            <div className="flex-1 max-w-xs">
                              <Slider
                                value={[flag.targeting?.percentage || 0]}
                                onValueChange={([value]) => updateRollout(flag, value)}
                                max={100}
                                step={1}
                                className="w-full"
                              />
                            </div>
                            <span className="text-sm text-gray-600 min-w-0">
                              {flag.targeting?.percentage || 0}%
                            </span>
                          </div>

                          {/* Targeting Rules */}
                          {(flag.targeting?.allowDomains?.length || flag.targeting?.allowRoles?.length) && (
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-green-500" />
                              <span className="text-sm">
                                Targeting: {flag.targeting.allowDomains?.join(', ')} {flag.targeting.allowRoles?.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Force Toggle Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant={flag.forceOn ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => toggleFlag(flag, 'on')}
                            data-testid={`button-force-on-${flag.key}`}
                          >
                            {flag.forceOn ? <CheckCircle className="h-3 w-3" /> : <ToggleRight className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant={flag.forceOff ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => toggleFlag(flag, 'off')}
                            data-testid={`button-force-off-${flag.key}`}
                          >
                            {flag.forceOff ? <AlertTriangle className="h-3 w-3" /> : <ToggleLeft className="h-3 w-3" />}
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFlag(flag)}
                          data-testid={`button-edit-${flag.key}`}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Flag Dialog */}
      <Dialog open={newFlagOpen || !!editingFlag} onOpenChange={(open) => {
        if (!open) {
          setNewFlagOpen(false);
          setEditingFlag(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFlag ? 'Edit Feature Flag' : 'Create Feature Flag'}
            </DialogTitle>
          </DialogHeader>
          <FlagForm 
            flag={editingFlag}
            onSubmit={(data) => {
              if (editingFlag) {
                updateFlagMutation.mutate({ id: editingFlag.id, ...data });
              } else {
                createFlagMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setNewFlagOpen(false);
              setEditingFlag(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FlagForm({ 
  flag, 
  onSubmit, 
  onCancel 
}: { 
  flag?: FeatureFlag | null;
  onSubmit: (data: Partial<FeatureFlag>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    key: flag?.key || '',
    name: flag?.name || '',
    description: flag?.description || '',
    targeting: {
      percentage: flag?.targeting?.percentage || 0,
      allowDomains: flag?.targeting?.allowDomains?.join(', ') || '',
      allowRoles: flag?.targeting?.allowRoles?.join(', ') || '',
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      key: formData.key,
      name: formData.name,
      description: formData.description,
      targeting: {
        percentage: formData.targeting.percentage,
        allowDomains: formData.targeting.allowDomains ? formData.targeting.allowDomains.split(',').map(s => s.trim()) : [],
        allowRoles: formData.targeting.allowRoles ? formData.targeting.allowRoles.split(',').map(s => s.trim()) : [],
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="key">Flag Key *</Label>
          <Input
            id="key"
            value={formData.key}
            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
            placeholder="new-feature-ui"
            required
          />
        </div>
        <div>
          <Label htmlFor="name">Display Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="New Feature UI"
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
          placeholder="Enable the new redesigned user interface"
        />
      </div>

      <div>
        <Label>Rollout Percentage</Label>
        <div className="flex items-center gap-4 mt-2">
          <Slider
            value={[formData.targeting.percentage]}
            onValueChange={([value]) => setFormData(prev => ({ 
              ...prev, 
              targeting: { ...prev.targeting, percentage: value } 
            }))}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="min-w-0 text-sm">
            {formData.targeting.percentage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="allowDomains">Allowed Domains</Label>
          <Input
            id="allowDomains"
            value={formData.targeting.allowDomains}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              targeting: { ...prev.targeting, allowDomains: e.target.value }
            }))}
            placeholder="@company.com, @partner.com"
          />
        </div>
        <div>
          <Label htmlFor="allowRoles">Allowed Roles</Label>
          <Input
            id="allowRoles"
            value={formData.targeting.allowRoles}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              targeting: { ...prev.targeting, allowRoles: e.target.value }
            }))}
            placeholder="ADMIN, BETA_USER"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {flag ? 'Update Flag' : 'Create Flag'}
        </Button>
      </div>
    </form>
  );
}