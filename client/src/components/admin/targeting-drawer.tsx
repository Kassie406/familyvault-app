import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Trash2 } from 'lucide-react';

interface Rule {
  type: 'attribute' | 'segment';
  attr?: string;
  op?: string;
  val?: string;
  segmentId?: string;
}

interface ScheduleSettings {
  start: string | null;
  end: string | null;
}

interface EnvironmentConfig {
  active: boolean;
  updatedAt: string | null;
  rules: Rule[];
  rollout: number;
  rolloutKey: string;
  schedule: ScheduleSettings;
  tenants: string[];
}

interface TargetingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  flagKey: string;
  flagName: string;
}

const segmentsCache = [
  { id: 'beta_testers', name: 'Beta Testers' },
  { id: 'internal_staff', name: 'Internal Staff' },
  { id: 'family_portal', name: 'Family Portal Users' },
  { id: 'high_value', name: 'High Value Clients' }
];

export function TargetingDrawer({ isOpen, onClose, flagKey, flagName }: TargetingDrawerProps) {
  const [activeEnv, setActiveEnv] = useState<'prod' | 'staging' | 'dev'>('prod');
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState<'Unknown' | 'Enabled' | 'Disabled'>('Unknown');
  
  const [model, setModel] = useState<Record<string, EnvironmentConfig>>({
    prod: {
      active: true,
      updatedAt: new Date().toISOString(),
      rules: [{ type: 'attribute', attr: 'user.email', op: 'endsWith', val: '@familycirclesecure.com' }],
      rollout: 25,
      rolloutKey: 'user.id',
      schedule: { start: null, end: null },
      tenants: ['Public', 'Family', 'Staff']
    },
    staging: {
      active: true,
      updatedAt: null,
      rules: [],
      rollout: 0,
      rolloutKey: 'user.id',
      schedule: { start: null, end: null },
      tenants: ['Public', 'Family', 'Staff']
    },
    dev: {
      active: true,
      updatedAt: null,
      rules: [],
      rollout: 0,
      rolloutKey: 'user.id',
      schedule: { start: null, end: null },
      tenants: ['Public', 'Family', 'Staff']
    }
  });

  const currentConfig = model[activeEnv];

  const updateCurrentConfig = (updates: Partial<EnvironmentConfig>) => {
    setModel(prev => ({
      ...prev,
      [activeEnv]: { ...prev[activeEnv], ...updates }
    }));
  };

  const toggleTenant = (tenant: string) => {
    const newTenants = currentConfig.tenants.includes(tenant)
      ? currentConfig.tenants.filter(t => t !== tenant)
      : [...currentConfig.tenants, tenant];
    
    // Prevent empty tenants array
    if (newTenants.length === 0) {
      newTenants.push(tenant);
    }
    
    updateCurrentConfig({ tenants: newTenants });
  };

  const addRule = () => {
    const newRule: Rule = { type: 'attribute', attr: 'user.tenant', op: 'equals', val: 'Family' };
    updateCurrentConfig({ rules: [...currentConfig.rules, newRule] });
  };

  const updateRule = (index: number, updates: Partial<Rule>) => {
    const newRules = [...currentConfig.rules];
    newRules[index] = { ...newRules[index], ...updates };
    updateCurrentConfig({ rules: newRules });
  };

  const removeRule = (index: number) => {
    const newRules = currentConfig.rules.filter((_, i) => i !== index);
    updateCurrentConfig({ rules: newRules });
  };

  const toggleFlag = () => {
    if (currentConfig.active) {
      if (confirm('Disable this flag in the current environment?')) {
        updateCurrentConfig({ active: false });
      }
    } else {
      updateCurrentConfig({ active: true });
    }
  };

  const testUser = () => {
    // Mock user evaluation logic
    const user = {
      user: {
        email: testInput,
        id: testInput,
        tenant: testInput.includes('@familycirclesecure.com') ? 'Staff' : 'Public',
        role: testInput.includes('@familycirclesecure.com') ? 'Staff' : 'User'
      }
    };

    const result = evalUser(user);
    setTestResult(result ? 'Enabled' : 'Disabled');
  };

  const evalUser = (user: any): boolean => {
    if (!currentConfig.active) return false;

    // Tenant gate
    const tenant = user.user?.tenant || 'Public';
    if (!currentConfig.tenants.includes(tenant)) return false;

    // Schedule check
    if (currentConfig.schedule.start && new Date() < new Date(currentConfig.schedule.start)) return false;
    if (currentConfig.schedule.end && new Date() > new Date(currentConfig.schedule.end)) return false;

    // Rules check
    if (currentConfig.rules.length && !currentConfig.rules.every(rule => matchesRule(user, rule))) return false;

    // Percentage rollout
    const key = currentConfig.rolloutKey.split('.').reduce((o, k) => o?.[k], user) ?? '';
    if (!currentConfig.rollout || !key) return currentConfig.rules.length > 0;
    
    const hashValue = hashString(String(key)) % 100;
    return hashValue < currentConfig.rollout;
  };

  const matchesRule = (user: any, rule: Rule): boolean => {
    if (rule.type === 'segment') {
      return userInSegments(user)(rule.segmentId);
    }
    
    const value = rule.attr?.split('.').reduce((o, k) => o?.[k], user) ?? '';
    switch (rule.op) {
      case 'equals': return value == rule.val;
      case 'notEquals': return value != rule.val;
      case 'contains': return (value + '').includes(rule.val || '');
      case 'endsWith': return (value + '').endsWith(rule.val || '');
      case 'startsWith': return (value + '').startsWith(rule.val || '');
      case 'in': return (rule.val || '').split(',').map(s => s.trim()).includes(value + '');
      default: return false;
    }
  };

  const userInSegments = (user: any) => {
    const segmentMap: Record<string, (u: any) => boolean> = {
      beta_testers: (u) => (u.user?.email || '').endsWith('@familycirclesecure.com'),
      internal_staff: (u) => (u.user?.role || '') === 'Staff',
      family_portal: (u) => (u.user?.tenant || '') === 'Family',
      high_value: (u) => (u.user?.tier || '') === 'Gold'
    };
    
    return (segmentId?: string) => segmentMap[segmentId || '']?.(user) ?? false;
  };

  const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash >>> 0;
  };

  const handleSave = () => {
    // TODO: Implement save to backend
    console.log('Saving flag configuration:', { flagKey, env: activeEnv, config: currentConfig });
    onClose();
  };

  useEffect(() => {
    setTestResult('Unknown');
  }, [activeEnv]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-50"
        onClick={onClose}
        data-testid="targeting-drawer-backdrop"
      />
      
      {/* Drawer */}
      <aside 
        className="fixed top-0 right-0 h-full w-full max-w-[980px] bg-white border-l border-[#E5EAF2] shadow-2xl z-50 flex flex-col transform transition-transform duration-200"
        style={{ borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="targeting-drawer-title"
        data-testid="targeting-drawer"
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-[#EEF1F5]">
          <div>
            <div className="text-xs text-[#6B7280] uppercase tracking-wide">Feature flag</div>
            <h3 id="targeting-drawer-title" className="text-lg font-semibold text-[#111827]">
              {flagKey}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#667085] hover:text-[#1F6FEB]"
            data-testid="button-close-drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        {/* Environment Tabs */}
        <div className="flex gap-2 p-3 border-b border-[#EEF1F5]" role="tablist" aria-label="Environments">
          {(['prod', 'staging', 'dev'] as const).map(env => (
            <Button
              key={env}
              role="tab"
              aria-selected={activeEnv === env}
              onClick={() => setActiveEnv(env)}
              className={`rounded-lg px-3 py-2 text-sm capitalize ${
                activeEnv === env
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-[#111827] text-[#F9FAFB] border-[#1F2937] hover:bg-[#1F2937] hover:text-white'
              }`}
              data-testid={`tab-env-${env}`}
            >
              {env}
            </Button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          
          {/* Status Section */}
          <section className="border border-[#E5EAF2] rounded-xl p-3 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={currentConfig.active ? "default" : "secondary"}
                  className={currentConfig.active ? "bg-[#E8F6EE] text-[#1B7F3B]" : "bg-[#EEF1F5] text-[#374151]"}
                  data-testid="badge-flag-status"
                >
                  {currentConfig.active ? 'Active' : 'Disabled'}
                </Badge>
                <span className="text-sm text-[#6B7280]">
                  Updated {currentConfig.updatedAt ? new Date(currentConfig.updatedAt).toLocaleString() : '—'}
                </span>
              </div>
              <div className="flex gap-2">
                {currentConfig.active ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFlag}
                    className="text-[#B42318] border-[#F3C3C3] hover:bg-[#FEECEC] hover:border-[#F3C3C3]"
                    data-testid="button-disable-flag"
                  >
                    ⛔ Disable in this env
                  </Button>
                ) : (
                  <Button
                    onClick={toggleFlag}
                    size="sm"
                    className="bg-[#1F6FEB] text-white hover:bg-[#195BD2]"
                    data-testid="button-enable-flag"
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Tenants Section */}
          <section className="border border-[#E5EAF2] rounded-xl p-3 bg-white">
            <div className="font-semibold mb-2">Tenants</div>
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Tenant targeting">
              {['Public', 'Family', 'Staff'].map(tenant => (
                <Button
                  key={tenant}
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTenant(tenant)}
                  className={`rounded-full px-3 py-2 ${
                    currentConfig.tenants.includes(tenant)
                      ? 'bg-[#E9F2FF] border-[#BFD3FF] text-[#0D6EFD]'
                      : 'bg-white border-[#D7DEE8] text-[#344054] hover:bg-[#F6F8FB]'
                  }`}
                  data-testid={`chip-tenant-${tenant.toLowerCase()}`}
                >
                  {tenant}
                </Button>
              ))}
            </div>
            <div className="text-sm text-[#6B7280] mt-2">
              Only users from the selected tenants can receive this flag.
            </div>
          </section>

          {/* Targeting Rules */}
          <section className="border border-[#E5EAF2] rounded-xl p-3 bg-white">
            <div className="font-semibold mb-2">Targeting rules</div>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5EAF2]">
                    <th className="text-left py-2 px-3 font-medium text-[#111827] w-[16%]">Type</th>
                    <th className="text-left py-2 px-3 font-medium text-[#111827] w-[22%]">Attribute / Segment</th>
                    <th className="text-left py-2 px-3 font-medium text-[#111827] w-[20%]">Operator</th>
                    <th className="text-left py-2 px-3 font-medium text-[#111827]">Value</th>
                    <th className="text-left py-2 px-3 font-medium text-[#111827] w-[60px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentConfig.rules.map((rule, index) => (
                    <RuleRow
                      key={index}
                      rule={rule}
                      index={index}
                      onUpdate={(updates) => updateRule(index, updates)}
                      onRemove={() => removeRule(index)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addRule}
                className="border-[#D7DEE8] hover:bg-[#F6F8FB]"
                data-testid="button-add-rule"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add rule
              </Button>
            </div>
          </section>

          {/* Percentage Rollout */}
          <section className="border border-[#E5EAF2] rounded-xl p-3 bg-white">
            <div className="font-semibold mb-2">Percentage rollout</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={currentConfig.rollout}
                onChange={(e) => updateCurrentConfig({ rollout: Number(e.target.value) })}
                className="w-48"
                data-testid="slider-rollout-percentage"
              />
              <Badge variant="secondary" className="bg-[#EEF1F5] text-[#374151]">
                {currentConfig.rollout}%
              </Badge>
              <span className="text-sm text-[#6B7280]">Hash by</span>
              <Select
                value={currentConfig.rolloutKey}
                onValueChange={(value) => updateCurrentConfig({ rolloutKey: value })}
              >
                <SelectTrigger className="w-32" data-testid="select-rollout-key">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user.id">user.id</SelectItem>
                  <SelectItem value="user.email">user.email</SelectItem>
                  <SelectItem value="session.id">session.id</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Schedule */}
          <section className="border border-[#E5EAF2] rounded-xl p-3 bg-white">
            <div className="font-semibold mb-2">Schedule</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-[#374151] mb-1">Start</Label>
                <Input
                  type="datetime-local"
                  value={currentConfig.schedule.start || ''}
                  onChange={(e) => updateCurrentConfig({ 
                    schedule: { ...currentConfig.schedule, start: e.target.value || null }
                  })}
                  className="border-[#D7DEE8]"
                  data-testid="input-schedule-start"
                />
              </div>
              <div>
                <Label className="text-sm text-[#374151] mb-1">End (optional)</Label>
                <Input
                  type="datetime-local"
                  value={currentConfig.schedule.end || ''}
                  onChange={(e) => updateCurrentConfig({ 
                    schedule: { ...currentConfig.schedule, end: e.target.value || null }
                  })}
                  className="border-[#D7DEE8]"
                  data-testid="input-schedule-end"
                />
              </div>
            </div>
          </section>

          {/* Preview Tester */}
          <section className="border border-[#E5EAF2] rounded-xl p-3 bg-white">
            <div className="font-semibold mb-2">Preview tester</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-[#374151] mb-1">User ID / Email</Label>
                <Input
                  placeholder="e.g. alex@company.com"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="border-[#D7DEE8]"
                  data-testid="input-test-user"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testUser}
                  className="border-[#D7DEE8] hover:bg-[#F6F8FB]"
                  data-testid="button-test-user"
                >
                  Test
                </Button>
                <Badge 
                  variant="secondary"
                  className={`${
                    testResult === 'Enabled' ? 'bg-[#E8F6EE] text-[#1B7F3B]' :
                    testResult === 'Disabled' ? 'bg-[#FEECEC] text-[#B42318]' :
                    'bg-[#EEF1F5] text-[#374151]'
                  }`}
                  data-testid="badge-test-result"
                >
                  {testResult}
                </Badge>
              </div>
            </div>
            <div className="text-sm text-[#6B7280] mt-2">
              The tester runs your rules + rollout hash for the selected environment.
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center p-4 border-t border-[#EEF1F5]">
          <div className="text-sm text-[#6B7280]">
            All changes are logged in the audit trail.
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#D7DEE8] hover:bg-[#F6F8FB]"
              data-testid="button-cancel-targeting"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#1F6FEB] text-white hover:bg-[#195BD2]"
              data-testid="button-save-targeting"
            >
              Save changes
            </Button>
          </div>
        </footer>
      </aside>
    </>
  );
}

interface RuleRowProps {
  rule: Rule;
  index: number;
  onUpdate: (updates: Partial<Rule>) => void;
  onRemove: () => void;
}

function RuleRow({ rule, index, onUpdate, onRemove }: RuleRowProps) {
  const isSegmentType = rule.type === 'segment';

  return (
    <tr className="border-b border-[#F2F4F8]">
      <td className="py-2 px-3">
        <Select
          value={rule.type}
          onValueChange={(value: 'attribute' | 'segment') => {
            const updates: Partial<Rule> = { type: value };
            if (value === 'segment') {
              updates.segmentId = segmentsCache[0]?.id;
            }
            onUpdate(updates);
          }}
        >
          <SelectTrigger className="border-[#D7DEE8]" data-testid={`select-rule-type-${index}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="attribute">Attribute</SelectItem>
            <SelectItem value="segment">Segment</SelectItem>
          </SelectContent>
        </Select>
      </td>
      
      <td className="py-2 px-3">
        {isSegmentType ? (
          <Select
            value={rule.segmentId}
            onValueChange={(value) => onUpdate({ segmentId: value })}
          >
            <SelectTrigger className="border-[#D7DEE8]" data-testid={`select-rule-segment-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {segmentsCache.map(segment => (
                <SelectItem key={segment.id} value={segment.id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={rule.attr}
            onValueChange={(value) => onUpdate({ attr: value })}
          >
            <SelectTrigger className="border-[#D7DEE8]" data-testid={`select-rule-attr-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user.email">user.email</SelectItem>
              <SelectItem value="user.id">user.id</SelectItem>
              <SelectItem value="user.tenant">user.tenant</SelectItem>
              <SelectItem value="user.role">user.role</SelectItem>
            </SelectContent>
          </Select>
        )}
      </td>
      
      <td className="py-2 px-3">
        {!isSegmentType && (
          <Select
            value={rule.op}
            onValueChange={(value) => onUpdate({ op: value })}
          >
            <SelectTrigger className="border-[#D7DEE8]" data-testid={`select-rule-op-${index}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equals">equals</SelectItem>
              <SelectItem value="notEquals">notEquals</SelectItem>
              <SelectItem value="contains">contains</SelectItem>
              <SelectItem value="endsWith">endsWith</SelectItem>
              <SelectItem value="startsWith">startsWith</SelectItem>
              <SelectItem value="in">in</SelectItem>
            </SelectContent>
          </Select>
        )}
      </td>
      
      <td className="py-2 px-3">
        {!isSegmentType && (
          <Input
            value={rule.val || ''}
            onChange={(e) => onUpdate({ val: e.target.value })}
            placeholder="Value…"
            className="border-[#D7DEE8]"
            data-testid={`input-rule-value-${index}`}
          />
        )}
      </td>
      
      <td className="py-2 px-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="bg-white border-[#D7DEE8] rounded-lg p-1.5 text-[#667085] hover:text-[#B42318]"
          data-testid={`button-remove-rule-${index}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}