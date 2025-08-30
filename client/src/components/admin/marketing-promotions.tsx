import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  type: 'banner' | 'popup' | 'ribbon' | 'inline';
  title: string;
  content: {
    headline: string;
    sub: string;
    cta: {
      label: string;
      href: string;
    };
  };
  couponCode?: string;
  targets: {
    tenants: string[];
    pages: Array<{ op: string; path: string }>;
    segments: string[];
  };
  schedule: {
    start: string | null;
    end: string | null;
    tz: string;
  };
  status: 'active' | 'scheduled' | 'expired' | 'paused';
  paused: boolean;
  variants: Array<{
    key: string;
    label: string;
    weight: number;
    content: {
      headline: string;
      sub: string;
      cta: {
        label: string;
        href: string;
      };
    };
  }>;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    updatedAt: string;
  };
  createdBy: string;
  updatedAt: string;
}

export default function MarketingPromotions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basics');
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [model, setModel] = useState({
    id: null,
    type: 'banner',
    title: '',
    content: { headline: '', sub: '', cta: { label: '', href: '' } },
    couponCode: '',
    targets: { tenants: ['Public', 'Family', 'Staff'], pages: [], segments: [] },
    schedule: { start: null, end: null, tz: 'UTC' },
    variants: [],
    publish: false,
    exclusive: false
  });

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['/api/admin/promotions'],
    queryFn: async () => {
      const response = await fetch('/api/admin/promotions');
      if (!response.ok) throw new Error('Failed to fetch promotions');
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/admin/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create promotion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promotions'] });
      setIsDrawerOpen(false);
      resetModel();
      toast({ title: 'Promotion created successfully' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update promotion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promotions'] });
      setIsDrawerOpen(false);
      resetModel();
      toast({ title: 'Promotion updated successfully' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete promotion');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/promotions'] });
      toast({ title: 'Promotion deleted successfully' });
    }
  });

  const resetModel = () => {
    setModel({
      id: null,
      type: 'banner',
      title: '',
      content: { headline: '', sub: '', cta: { label: '', href: '' } },
      couponCode: '',
      targets: { tenants: ['Public', 'Family', 'Staff'], pages: [], segments: [] },
      schedule: { start: null, end: null, tz: 'UTC' },
      variants: [],
      publish: false,
      exclusive: false
    });
    setEditingPromo(null);
  };

  const openDrawer = (promo?: Promotion) => {
    if (promo) {
      setEditingPromo(promo);
      setModel({
        id: promo.id,
        type: promo.type,
        title: promo.title,
        content: promo.content,
        couponCode: promo.couponCode || '',
        targets: promo.targets,
        schedule: promo.schedule,
        variants: promo.variants || [],
        publish: promo.status === 'active',
        exclusive: false
      });
    } else {
      resetModel();
    }
    setIsDrawerOpen(true);
    setActiveTab('basics');
  };

  const handleSave = () => {
    if (!model.title || !model.content.headline) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    const promoData = {
      type: model.type,
      title: model.title,
      content: model.content,
      couponCode: model.couponCode,
      targets: model.targets,
      schedule: model.schedule,
      variants: model.variants,
      status: model.publish ? 'active' : 'paused',
      paused: !model.publish
    };

    if (editingPromo) {
      updateMutation.mutate({ id: editingPromo.id, data: promoData });
    } else {
      createMutation.mutate(promoData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (promo: Promotion) => {
    if (promo.paused) return { class: 'badge-paused', text: 'Paused' };
    if (promo.status === 'expired') return { class: 'badge-expired', text: 'Expired' };
    if (promo.status === 'scheduled') return { class: 'badge-warn', text: 'Scheduled' };
    return { class: 'badge-active', text: 'Active' };
  };

  const filteredPromotions = promotions.filter((promo: Promotion) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return promo.status === 'active' && !promo.paused;
    if (activeFilter === 'scheduled') return promo.status === 'scheduled';
    if (activeFilter === 'expired') return promo.status === 'expired';
    if (activeFilter === 'paused') return promo.paused;
    return true;
  });

  const formatMetrics = (metrics: Promotion['metrics']) => {
    const ctr = metrics.impressions > 0 ? ((metrics.clicks / metrics.impressions) * 100).toFixed(1) : '0.0';
    const convRate = metrics.clicks > 0 ? ((metrics.conversions / metrics.clicks) * 100).toFixed(1) : '0.0';
    return `Impr ${metrics.impressions.toLocaleString()} • Clicks ${metrics.clicks.toLocaleString()} (${ctr}%) • Conv ${metrics.conversions} (${convRate}%)`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen]);

  return (
    <div id="promos-root" data-testid="marketing-promotions">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>Marketing Promotions</h3>
          <p style={{ color: '#6B7280', margin: '4px 0 0 0' }}>Manage banners, popups, and promotional campaigns</p>
        </div>
        <button 
          className="btn primary"
          onClick={() => openDrawer()}
          data-testid="button-new-promotion"
        >
          + New Promotion
        </button>
      </div>

      {/* Segmented Filter Tabs */}
      <div className="seg" style={{ marginBottom: '24px' }}>
        {['all', 'active', 'scheduled', 'expired', 'paused'].map(filter => (
          <button
            key={filter}
            className={activeFilter === filter ? 'is-active' : ''}
            onClick={() => setActiveFilter(filter)}
            data-testid={`filter-${filter}`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Promotions List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6B7280' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
          <p>Loading promotions...</p>
        </div>
      ) : filteredPromotions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6B7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📢</div>
          <h4 style={{ margin: '0 0 8px 0' }}>No promotions found</h4>
          <p style={{ margin: '0 0 16px 0' }}>Create your first promotional campaign to drive conversions</p>
          <button className="btn primary" onClick={() => openDrawer()}>
            Create Promotion
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredPromotions.map((promo: Promotion) => {
            const badge = getStatusBadge(promo);
            return (
              <div key={promo.id} className="promo-card" data-testid={`promo-card-${promo.id}`}>
                <div className="promo-head">
                  <div className="promo-left">
                    <span className="badge badge-type">{promo.type}</span>
                    <div className="promo-title">{promo.title}</div>
                    <span className={`badge ${badge.class}`}>{badge.text}</span>
                  </div>
                  <div className="actions">
                    <button title="Duplicate" data-testid={`button-duplicate-${promo.id}`}>⧉</button>
                    <button title="Preview" data-testid={`button-preview-${promo.id}`}>👁️</button>
                    <button title="Edit" onClick={() => openDrawer(promo)} data-testid={`button-edit-${promo.id}`}>✏️</button>
                    <button title="Delete" onClick={() => handleDelete(promo.id)} data-testid={`button-delete-${promo.id}`}>🗑️</button>
                  </div>
                </div>

                <div className="promo-meta">
                  {promo.content.headline}
                  {promo.content.sub && <><br />{promo.content.sub}</>}
                  <br />
                  <strong>Code:</strong> {promo.couponCode || '—'} 
                  {promo.schedule.end && (
                    <> &nbsp;•&nbsp; <strong>Expires:</strong> {new Date(promo.schedule.end).toLocaleDateString()}</>
                  )}
                </div>

                <div className="targets" style={{ marginTop: '8px' }}>
                  <strong>Targets:</strong>
                  {promo.targets.tenants.map(tenant => (
                    <span key={tenant} className="chip">{tenant}</span>
                  ))}
                </div>

                {promo.metrics && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
                    {formatMetrics(promo.metrics)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          id="promo-backdrop"
          className="prm-backdrop"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      {isDrawerOpen && (
        <aside
          id="promo-drawer"
          className={`prm-drawer ${isDrawerOpen ? 'open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="prm-title"
          data-testid="promotion-drawer"
        >
          <header className="prm-head">
            <div>
              <div className="eyebrow">Marketing Promotion</div>
              <h3 id="prm-title">{editingPromo ? 'Edit Promotion' : 'New Promotion'}</h3>
            </div>
            <button
              id="prm-close"
              className="icon-x"
              aria-label="Close"
              onClick={() => setIsDrawerOpen(false)}
              data-testid="button-close-drawer"
            >
              ✖
            </button>
          </header>

          <div className="prm-tabs" role="tablist" aria-label="Sections">
            {['basics', 'targeting', 'variants', 'schedule'].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? 'is-active' : ''}`}
                data-tab={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`tab-${tab}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'variants' && ' / A-B'}
              </button>
            ))}
          </div>

          <div className="prm-body">
            {/* BASICS */}
            {activeTab === 'basics' && (
              <section className="pane is-active">
                <div className="grid-2">
                  <div>
                    <label className="lbl">Type</label>
                    <select
                      value={model.type}
                      onChange={(e) => setModel(prev => ({ ...prev, type: e.target.value as any }))}
                      data-testid="select-type"
                    >
                      <option value="banner">Banner</option>
                      <option value="popup">Popup</option>
                      <option value="ribbon">Ribbon</option>
                      <option value="inline">Inline</option>
                    </select>
                  </div>
                  <div>
                    <label className="lbl">Internal Title</label>
                    <input
                      value={model.title}
                      onChange={(e) => setModel(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Winter Sale"
                      data-testid="input-title"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="lbl">Headline</label>
                    <input
                      value={model.content.headline}
                      onChange={(e) => setModel(prev => ({ 
                        ...prev, 
                        content: { ...prev.content, headline: e.target.value }
                      }))}
                      placeholder="Get 50% off Enterprise for 3 months"
                      data-testid="input-headline"
                    />
                  </div>
                  <div>
                    <label className="lbl">Subtext</label>
                    <input
                      value={model.content.sub}
                      onChange={(e) => setModel(prev => ({ 
                        ...prev, 
                        content: { ...prev.content, sub: e.target.value }
                      }))}
                      placeholder="Limited time only"
                      data-testid="input-subtext"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="lbl">CTA Label</label>
                    <input
                      value={model.content.cta.label}
                      onChange={(e) => setModel(prev => ({ 
                        ...prev, 
                        content: { ...prev.content, cta: { ...prev.content.cta, label: e.target.value }}
                      }))}
                      placeholder="Upgrade"
                      data-testid="input-cta-label"
                    />
                  </div>
                  <div>
                    <label className="lbl">CTA Link</label>
                    <input
                      value={model.content.cta.href}
                      onChange={(e) => setModel(prev => ({ 
                        ...prev, 
                        content: { ...prev.content, cta: { ...prev.content.cta, href: e.target.value }}
                      }))}
                      placeholder="/pricing"
                      data-testid="input-cta-href"
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div>
                    <label className="lbl">Coupon Code (optional)</label>
                    <input
                      value={model.couponCode}
                      onChange={(e) => setModel(prev => ({ ...prev, couponCode: e.target.value }))}
                      placeholder="WINTER50"
                      data-testid="input-coupon-code"
                    />
                  </div>
                  <div>
                    <label className="lbl">Link to Coupon</label>
                    <button className="btn ghost" type="button" data-testid="button-open-coupons">
                      Open Coupons
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* TARGETING */}
            {activeTab === 'targeting' && (
              <section className="pane is-active">
                <label className="lbl">Tenants</label>
                <div className="chips">
                  {['Public', 'Family', 'Staff'].map(tenant => (
                    <button
                      key={tenant}
                      className={`chip ${model.targets.tenants.includes(tenant) ? 'is-on' : ''}`}
                      onClick={() => {
                        setModel(prev => ({
                          ...prev,
                          targets: {
                            ...prev.targets,
                            tenants: prev.targets.tenants.includes(tenant)
                              ? prev.targets.tenants.filter(t => t !== tenant)
                              : [...prev.targets.tenants, tenant]
                          }
                        }));
                      }}
                      data-testid={`chip-tenant-${tenant.toLowerCase()}`}
                    >
                      {tenant}
                    </button>
                  ))}
                </div>

                <div className="grid-2 mt-10">
                  <div>
                    <label className="lbl">Page Rules (one per line)</label>
                    <textarea
                      rows={5}
                      placeholder="/, /pricing, contains:/blog"
                      value={model.targets.pages.map(p => `${p.op}:${p.path}`).join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n').filter(line => line.trim());
                        const pages = lines.map(line => {
                          const [op, path] = line.split(':');
                          return { op: op || 'exact', path: path || line };
                        });
                        setModel(prev => ({
                          ...prev,
                          targets: { ...prev.targets, pages }
                        }));
                      }}
                      data-testid="textarea-page-rules"
                    />
                    <div className="hint">Supported: <code>/path</code>, <code>contains:...</code>, <code>regex:/^\/docs\/.+/</code></div>
                  </div>
                  <div>
                    <label className="lbl">Segments</label>
                    <select multiple size={5} data-testid="select-segments">
                      <option value="first_visit">First visit</option>
                      <option value="returning">Returning users</option>
                      <option value="abandoned_checkout">Abandoned checkout</option>
                      <option value="high_value">High value clients</option>
                    </select>
                    <div className="hint">Hold Ctrl/Cmd to select multiple</div>
                  </div>
                </div>
              </section>
            )}

            {/* VARIANTS */}
            {activeTab === 'variants' && (
              <section className="pane is-active">
                <div id="prm-variants">
                  {model.variants.map((variant, index) => (
                    <div key={index} className="variant" data-testid={`variant-${index}`}>
                      <div className="row">
                        <span className="badge badge-variant">Variant {variant.key}</span>
                        <label>Label 
                          <input 
                            value={variant.label}
                            onChange={(e) => {
                              const newVariants = [...model.variants];
                              newVariants[index].label = e.target.value;
                              setModel(prev => ({ ...prev, variants: newVariants }));
                            }}
                            style={{ width: '160px' }}
                          />
                        </label>
                        <label>Weight 
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            value={variant.weight}
                            onChange={(e) => {
                              const newVariants = [...model.variants];
                              newVariants[index].weight = Number(e.target.value);
                              setModel(prev => ({ ...prev, variants: newVariants }));
                            }}
                            style={{ width: '100px' }}
                          />
                        </label>
                        <button 
                          className="btn ghost" 
                          onClick={() => {
                            setModel(prev => ({
                              ...prev,
                              variants: prev.variants.filter((_, i) => i !== index)
                            }));
                          }}
                          style={{ marginLeft: 'auto' }}
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid-2 mt-6">
                        <div>
                          <label className="lbl">Headline</label>
                          <input 
                            value={variant.content.headline}
                            onChange={(e) => {
                              const newVariants = [...model.variants];
                              newVariants[index].content.headline = e.target.value;
                              setModel(prev => ({ ...prev, variants: newVariants }));
                            }}
                          />
                        </div>
                        <div>
                          <label className="lbl">Subtext</label>
                          <input 
                            value={variant.content.sub}
                            onChange={(e) => {
                              const newVariants = [...model.variants];
                              newVariants[index].content.sub = e.target.value;
                              setModel(prev => ({ ...prev, variants: newVariants }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="btn ghost" 
                  type="button"
                  onClick={() => {
                    const newVariant = {
                      key: String.fromCharCode(65 + model.variants.length),
                      label: 'Variant',
                      weight: 0,
                      content: { headline: '', sub: '', cta: { label: '', href: '' } }
                    };
                    setModel(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
                  }}
                  data-testid="button-add-variant"
                >
                  + Add variant
                </button>
                <div className="hint mt-6">Weights must total 100%. Empty = single-variant.</div>
              </section>
            )}

            {/* SCHEDULE */}
            {activeTab === 'schedule' && (
              <section className="pane is-active">
                <div className="grid-3">
                  <div>
                    <label className="lbl">Start</label>
                    <input
                      type="datetime-local"
                      value={model.schedule.start || ''}
                      onChange={(e) => setModel(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, start: e.target.value }
                      }))}
                      data-testid="input-start-date"
                    />
                  </div>
                  <div>
                    <label className="lbl">End (optional)</label>
                    <input
                      type="datetime-local"
                      value={model.schedule.end || ''}
                      onChange={(e) => setModel(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, end: e.target.value }
                      }))}
                      data-testid="input-end-date"
                    />
                  </div>
                  <div>
                    <label className="lbl">Timezone</label>
                    <select
                      value={model.schedule.tz}
                      onChange={(e) => setModel(prev => ({
                        ...prev,
                        schedule: { ...prev.schedule, tz: e.target.value }
                      }))}
                      data-testid="select-timezone"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="America/Chicago">America/Chicago</option>
                      <option value="America/Denver">America/Denver</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                    </select>
                  </div>
                </div>

                <label className="lbl mt-10">Publish state</label>
                <div className="row gap-8">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={model.publish}
                      onChange={(e) => setModel(prev => ({ ...prev, publish: e.target.checked }))}
                      data-testid="checkbox-publish"
                    /> 
                    Publish on save
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={model.exclusive}
                      onChange={(e) => setModel(prev => ({ ...prev, exclusive: e.target.checked }))}
                      data-testid="checkbox-exclusive"
                    /> 
                    Prevent overlapping banners in same slot
                  </label>
                </div>
              </section>
            )}
          </div>

          <footer className="prm-foot">
            <div className="left muted">All changes are logged in the audit trail.</div>
            <div className="right">
              <button className="btn ghost" type="button" data-testid="button-preview">
                Preview
              </button>
              <button 
                className="btn ghost" 
                type="button" 
                onClick={() => setIsDrawerOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </button>
              <button 
                className="btn primary" 
                type="button" 
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </footer>
        </aside>
      )}
    </div>
  );
}