import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Target } from 'lucide-react';
import AdvancedFlagEditor from './advanced-flag-editor';
import { TargetingDrawer } from './targeting-drawer';

type Flag = {
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
};

export default function AdvancedFeatureFlags() {
  const [items, setItems] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Flag | null>(null);
  const [creating, setCreating] = useState(false);
  const [targeting, setTargeting] = useState<Flag | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(f =>
      f.key.toLowerCase().includes(q) ||
      f.name.toLowerCase().includes(q)
    );
  }, [items, query]);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/flags', { credentials: 'include' });
      const j = await r.json();
      setItems(j.items || []);
    } catch (error) {
      console.error('Failed to load flags:', error);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const getForceStatus = (flag: Flag) => {
    if (flag.force_on) return <Badge variant="secondary" className="bg-green-100 text-green-800">ON</Badge>;
    if (flag.force_off) return <Badge variant="secondary" className="bg-red-100 text-red-800">OFF</Badge>;
    return <Badge variant="outline" className="bg-gray-100 text-gray-600">Off</Badge>;
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? <Badge className="bg-green-100 text-green-800">Active</Badge>
      : <Badge variant="secondary">Archived</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Feature Flags</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage feature rollouts with targeting and preview</p>
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
          {loading ? (
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
                    <tr key={flag.id} className="border-b hover:bg-[#F7FAFF] transition-colors duration-150">
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                          {flag.key}
                        </code>
                      </td>
                      <td className="py-3 px-4 font-medium">{flag.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${flag.targeting?.percentage || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{flag.targeting?.percentage || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getForceStatus(flag)}</td>
                      <td className="py-3 px-4">{getStatusBadge(flag.status)}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {(() => {
                          if (!flag.updated_at) return '—';
                          const d = new Date(flag.updated_at);
                          return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
                        })()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTargeting(flag)}
                            className="bg-white border-gray-300 hover:bg-green-50 hover:border-green-300 text-gray-700 hover:text-green-700"
                            data-testid={`button-target-flag-${flag.key}`}
                          >
                            <Target className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(flag)}
                            className="bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300 text-gray-700 hover:text-blue-700"
                            data-testid={`button-edit-flag-${flag.key}`}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        {query ? 'No flags match your search' : 'No flags created yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {(creating || editing) && (
        <AdvancedFlagEditor
          initial={editing || undefined}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={() => { setCreating(false); setEditing(null); load(); }}
        />
      )}

      {targeting && (
        <TargetingDrawer
          isOpen={!!targeting}
          onClose={() => setTargeting(null)}
          flagKey={targeting.key}
          flagName={targeting.name}
        />
      )}
    </div>
  );
}