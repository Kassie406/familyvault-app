import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { TestTube, Save, X } from 'lucide-react';

type FlagDraft = {
  id?: string;
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
};

interface AdvancedFlagEditorProps {
  initial?: FlagDraft;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdvancedFlagEditor({ initial, onClose, onSaved }: AdvancedFlagEditorProps) {
  const { toast } = useToast();
  const [draft, setDraft] = useState<FlagDraft>(initial || {
    key: '',
    name: '',
    status: 'active',
    targeting: { percentage: 0, allowDomains: [], allowUserIds: [], blockUserIds: [] }
  });
  const [testingUser, setTestingUser] = useState('');
  const [preview, setPreview] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  const isEdit = Boolean(initial?.id);

  function update<K extends keyof FlagDraft>(k: K, v: FlagDraft[K]) {
    setDraft(d => ({ ...d, [k]: v }));
  }

  function updateTargeting<K extends keyof FlagDraft['targeting']>(k: K, v: FlagDraft['targeting'][K]) {
    setDraft(d => ({ ...d, targeting: { ...d.targeting, [k]: v } }));
  }

  async function save() {
    if (!draft.key || !draft.name) {
      toast({
        title: 'Validation Error',
        description: 'Key and name are required',
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
      const url = isEdit ? `/api/admin/flags/${draft.id}` : '/api/admin/flags';
      const r = await fetch(url, opts);
      
      if (!r.ok) {
        throw new Error('Save failed');
      }
      
      toast({
        title: 'Success',
        description: `Flag ${isEdit ? 'updated' : 'created'} successfully`,
      });
      onSaved();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save flag',
        variant: 'destructive',
      });
    }
    setSaving(false);
  }

  async function testUser() {
    if (!testingUser) return;
    
    setTesting(true);
    try {
      const r = await fetch('/api/flags/mine', {
        credentials: 'include',
        headers: { 'X-Preview-User': testingUser }
      });
      const flags = await r.json();
      setPreview(Boolean(flags[draft.key]));
    } catch (error) {
      toast({
        title: 'Test Error', 
        description: 'Failed to test flag evaluation',
        variant: 'destructive',
      });
    }
    setTesting(false);
  }

  // Keep force_on/off mutually exclusive
  useEffect(() => {
    if (draft.force_on && draft.force_off) {
      setDraft(d => ({ ...d, force_off: false }));
    }
  }, [draft.force_on]);

  useEffect(() => {
    if (draft.force_off && draft.force_on) {
      setDraft(d => ({ ...d, force_on: false }));
    }
  }, [draft.force_off]);

  const handleDomainsChange = (value: string) => {
    const domains = value.split(',').map(s => s.trim()).filter(Boolean);
    updateTargeting('allowDomains', domains);
  };

  const handleAllowUsersChange = (value: string) => {
    const users = value.split(',').map(s => s.trim()).filter(Boolean);
    updateTargeting('allowUserIds', users);
  };

  const handleBlockUsersChange = (value: string) => {
    const users = value.split(',').map(s => s.trim()).filter(Boolean);
    updateTargeting('blockUserIds', users);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? 'Edit Flag' : 'Create Flag'}
            {draft.status === 'active' && (
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key">Flag Key</Label>
              <Input
                id="key"
                value={draft.key}
                onChange={e => update('key', e.target.value)}
                placeholder="new-billing-ui"
                disabled={isEdit}
                data-testid="input-flag-key"
              />
              {!isEdit && (
                <p className="text-sm text-gray-500">Unique identifier (cannot be changed after creation)</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={e => update('name', e.target.value)}
                placeholder="New Billing UI"
                data-testid="input-flag-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={draft.description || ''}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe what this feature flag controls..."
              rows={3}
              data-testid="textarea-flag-description"
            />
          </div>

          {/* Rollout Configuration */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Rollout Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rollout Percentage: {draft.targeting.percentage || 0}%</Label>
                <Slider
                  value={[draft.targeting.percentage || 0]}
                  onValueChange={(value) => updateTargeting('percentage', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                  data-testid="slider-rollout-percentage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={draft.status} onValueChange={(value: 'active' | 'archived') => update('status', value)}>
                  <SelectTrigger data-testid="select-flag-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Force Override Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="force-on"
                  checked={!!draft.force_on}
                  onCheckedChange={(checked) => update('force_on', checked)}
                  data-testid="switch-force-on"
                />
                <Label htmlFor="force-on">Force ON (overrides all targeting)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="force-off"
                  checked={!!draft.force_off}
                  onCheckedChange={(checked) => update('force_off', checked)}
                  data-testid="switch-force-off"
                />
                <Label htmlFor="force-off">Force OFF (overrides all targeting)</Label>
              </div>
            </div>
          </div>

          {/* Advanced Targeting */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Advanced Targeting</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allow-domains">Allow Domains</Label>
                <Input
                  id="allow-domains"
                  placeholder="@mycompany.com, @partner.org"
                  value={(draft.targeting.allowDomains || []).join(', ')}
                  onChange={e => handleDomainsChange(e.target.value)}
                  data-testid="input-allow-domains"
                />
                <p className="text-sm text-gray-500">Comma-separated email domains (include @)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allow-users">Allow User IDs</Label>
                <Input
                  id="allow-users"
                  placeholder="user-123, user-456"
                  value={(draft.targeting.allowUserIds || []).join(', ')}
                  onChange={e => handleAllowUsersChange(e.target.value)}
                  data-testid="input-allow-users"
                />
                <p className="text-sm text-gray-500">Comma-separated user IDs or emails</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="block-users">Block User IDs</Label>
                <Input
                  id="block-users"
                  placeholder="user-789, user-000"
                  value={(draft.targeting.blockUserIds || []).join(', ')}
                  onChange={e => handleBlockUsersChange(e.target.value)}
                  data-testid="input-block-users"
                />
                <p className="text-sm text-gray-500">Comma-separated user IDs or emails to exclude</p>
              </div>
            </div>
          </div>

          {/* Flag Testing */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
            <h3 className="font-semibold flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Test Flag Evaluation
            </h3>
            
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter user ID or email to test..."
                value={testingUser}
                onChange={e => setTestingUser(e.target.value)}
                className="flex-1"
                data-testid="input-test-user"
              />
              <Button
                onClick={testUser}
                disabled={!testingUser || testing}
                variant="outline"
                data-testid="button-test-flag"
              >
                {testing ? 'Testing...' : 'Test'}
              </Button>
              {preview !== null && (
                <Badge 
                  className={`${preview ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  data-testid="badge-test-result"
                >
                  {preview ? 'ENABLED' : 'DISABLED'}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} data-testid="button-cancel">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} data-testid="button-save-flag">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : isEdit ? 'Update Flag' : 'Create Flag'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}