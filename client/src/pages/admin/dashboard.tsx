import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ROUTES, navigate, trackAdminClick } from '@/lib/routes';
import { 
  Users, CreditCard, Ticket, FileText, Shield, Activity, Plus, Eye, Edit, Trash2, 
  TrendingUp, BarChart3, PieChart, Server, ShieldCheck, Search, UserPlus, 
  MoreHorizontal, Mail, Power, RotateCcw, X, Filter, Edit3
} from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import SecurityCenterCard from '@/components/admin/security-center-card';
import SessionManagement from '@/components/admin/session-management';
import TamperVerification from '@/components/admin/tamper-verification';
import SecurityPostureSummary from '@/components/admin/security-posture-summary';
import EnhancedCouponForm from '@/components/admin/enhanced-coupon-form';
import FeatureFlagsManager from '@/components/admin/feature-flags-manager';
import ImpersonationManager from '@/components/admin/impersonation-manager';
import EnhancedFeatureFlags from '@/components/admin/enhanced-feature-flags';
import WebhooksManager from '@/components/admin/webhooks-manager';
import AdvancedFeatureFlags from '@/components/admin/advanced-feature-flags';
import AdvancedWebhooks from '@/components/admin/advanced-webhooks';
import { TamperEvidentAudit } from '@/components/admin/tamper-evident-audit';
import { AdvancedCoupons } from '@/components/admin/advanced-coupons';
import StatusWidget from '@/components/admin/status-widget';
import ToastHost from '@/components/admin/toast-host';
import StatusWatcher from '@/components/admin/status-watcher';
import MarketingPromotions from '@/components/admin/marketing-promotions';
import { GdprCompliance } from '@/components/admin/gdpr-compliance';

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCouponOpen, setNewCouponOpen] = useState(false);
  const [newArticleOpen, setNewArticleOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [planScope, setPlanScope] = useState('PUBLIC');
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSlug, setArticleSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [articleStatus, setArticleStatus] = useState('draft');
  const [markdownContent, setMarkdownContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Bulk selection state
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  
  // Article preview drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState('');
  const [previewArticle, setPreviewArticle] = useState<any>(null);
  
  // Users management state
  const [selectedTenant, setSelectedTenant] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Bulk selection helpers
  const toggleArticleSelection = (articleId: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId);
    } else {
      newSelected.add(articleId);
    }
    setSelectedArticles(newSelected);
    
    // Update select all state
    const totalArticles = articles?.articles?.length || 0;
    setIsSelectAllChecked(newSelected.size === totalArticles && totalArticles > 0);
  };

  const toggleSelectAll = () => {
    if (selectedArticles.size === 0) {
      // Select all
      const allIds = new Set<string>(articles?.articles?.map((a: any) => a.id) || []);
      setSelectedArticles(allIds);
      setIsSelectAllChecked(true);
    } else {
      // Deselect all
      setSelectedArticles(new Set<string>());
      setIsSelectAllChecked(false);
    }
  };

  const clearSelection = () => {
    setSelectedArticles(new Set<string>());
    setIsSelectAllChecked(false);
  };

  // Article preview drawer functions
  const sanitizeHTML = (html: string = '') => {
    const div = document.createElement('div');
    div.innerHTML = html;
    // Remove scripts and event handlers
    div.querySelectorAll('script, iframe[sandbox="allow-scripts"]').forEach(n => n.remove());
    div.querySelectorAll('*').forEach(el => {
      [...el.attributes].forEach(a => {
        if (/^on/i.test(a.name)) el.removeAttribute(a.name);
        if (a.name === 'style' && /expression|url\(/i.test(a.value)) el.removeAttribute('style');
      });
    });
    return div.innerHTML;
  };

  const openPreview = async (articleId: string) => {
    setDrawerLoading(true);
    setDrawerError('');
    setDrawerOpen(true);
    
    try {
      // Use sample data for now, replace with API call
      const sampleData = {
        'a_101': {
          id: 'a_101',
          title: 'Family Evacuation Checklist',
          tenant: 'PUBLIC',
          menuCategory: 'Disaster Planning',
          status: 'published',
          authorName: 'Sarah Martinez',
          publishAt: '2025-08-20T10:00:00Z',
          slug: 'family-evacuation-checklist',
          html: '<h2>Emergency Evacuation Procedures</h2><p>In the event of an emergency, having a well-prepared evacuation plan can save lives. <strong>Follow these steps:</strong></p><ul><li>Gather important documents</li><li>Check emergency supplies</li><li>Review escape routes</li><li>Contact emergency services if needed</li></ul><p>Remember to practice your evacuation plan regularly with all family members.</p>'
        },
        'a_102': {
          id: 'a_102',
          title: 'Home Document Binder',
          tenant: 'PUBLIC',
          menuCategory: 'Home Buying',
          status: 'draft',
          authorName: 'John Doe',
          publishAt: null,
          slug: 'home-document-binder',
          html: '<h2>Essential Documents for Home Buying</h2><p>When purchasing a home, organizing your documents is crucial. <strong>Here\'s what you need:</strong></p><ul><li>Pre-approval letters</li><li>Income verification</li><li>Bank statements</li><li>Property inspection reports</li></ul>'
        },
        'a_103': {
          id: 'a_103',
          title: 'SOC Playbook Update',
          tenant: 'STAFF',
          menuCategory: 'Digital Security',
          status: 'scheduled',
          authorName: 'Emily Chen',
          publishAt: '2025-09-01T09:00:00Z',
          slug: 'soc-playbook-update',
          html: '<h2>Security Operations Center Updates</h2><p>This document outlines the latest updates to our SOC procedures. <strong>Key changes include:</strong></p><ul><li>Enhanced threat detection protocols</li><li>Updated incident response procedures</li><li>New monitoring tools integration</li></ul>'
        },
        'a_104': {
          id: 'a_104',
          title: 'Pediatric Records Checklist',
          tenant: 'FAMILY',
          menuCategory: 'Child Information',
          status: 'published',
          authorName: 'Michael Rodriguez',
          publishAt: '2025-08-10T14:20:00Z',
          slug: 'pediatric-records-checklist',
          html: '<h2>Important Medical Records for Children</h2><p>Keeping organized medical records for your children is essential. <strong>Include these documents:</strong></p><ul><li>Vaccination records</li><li>Allergy information</li><li>Insurance cards</li><li>Emergency contacts</li></ul>'
        }
      };
      
      const article = sampleData[articleId as keyof typeof sampleData];
      if (article) {
        setPreviewArticle(article);
      } else {
        setDrawerError('Article not found');
      }
    } catch (error) {
      setDrawerError('Failed to load preview');
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setPreviewArticle(null);
    setDrawerError('');
  };

  const handleDrawerPublish = async () => {
    if (!previewArticle) return;
    
    try {
      // Update the preview article status
      setPreviewArticle({
        ...previewArticle,
        status: 'published',
        publishAt: new Date().toISOString()
      });
      toast({ title: 'Article published successfully!' });
    } catch (error) {
      toast({ title: 'Failed to publish article', variant: 'destructive' });
    }
  };

  const handleDrawerUnpublish = async () => {
    if (!previewArticle) return;
    
    try {
      setPreviewArticle({
        ...previewArticle,
        status: 'draft',
        publishAt: null
      });
      toast({ title: 'Article unpublished successfully!' });
    } catch (error) {
      toast({ title: 'Failed to unpublish article', variant: 'destructive' });
    }
  };

  // Keyboard handler for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (drawerOpen && e.key === 'Escape') {
        closeDrawer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Bulk actions
  const handleBulkPublish = async () => {
    const ids = Array.from(selectedArticles);
    if (ids.length === 0) return;
    
    if (confirm(`Publish ${ids.length} article(s)?`)) {
      try {
        await fetch('/api/admin/content/bulk-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        toast({ title: 'Articles published successfully' });
        clearSelection();
        queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      } catch (error) {
        toast({ title: 'Failed to publish articles', variant: 'destructive' });
      }
    }
  };

  const handleBulkUnpublish = async () => {
    const ids = Array.from(selectedArticles);
    if (ids.length === 0) return;
    
    if (confirm(`Unpublish ${ids.length} article(s)?`)) {
      try {
        await fetch('/api/admin/content/bulk-unpublish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        toast({ title: 'Articles unpublished successfully' });
        clearSelection();
        queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      } catch (error) {
        toast({ title: 'Failed to unpublish articles', variant: 'destructive' });
      }
    }
  };

  const handleBulkArchive = async () => {
    const ids = Array.from(selectedArticles);
    if (ids.length === 0) return;
    
    if (confirm(`Archive ${ids.length} article(s)?`)) {
      try {
        await fetch('/api/admin/content/bulk-archive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids })
        });
        toast({ title: 'Articles archived successfully' });
        clearSelection();
        queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      } catch (error) {
        toast({ title: 'Failed to archive articles', variant: 'destructive' });
      }
    }
  };

  const handleBulkExport = () => {
    const ids = Array.from(selectedArticles);
    if (ids.length === 0) return;
    
    const selectedData = articles?.articles?.filter((a: any) => ids.includes(a.id)) || [];
    const headers = ['id', 'title', 'menu_category', 'tenant', 'author', 'published_at', 'status'];
    const csvRows = [headers.join(',')];
    
    selectedData.forEach((article: any) => {
      const row = [
        article.id,
        `"${(article.title || '').replace(/"/g, '""')}"`,
        `"${(article.menuCategory || '').replace(/"/g, '""')}"`,
        article.tenant || '',
        `"${(article.author || 'Admin').replace(/"/g, '""')}"`,
        article.published ? new Date().toISOString().slice(0, 16).replace('T', ' ') : '—',
        article.status || 'draft'
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `articles_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Fetch admin data
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/admin/plans'],
    queryFn: () => fetch('/api/admin/plans').then(res => res.json()),
  });

  const { data: coupons, isLoading: couponsLoading } = useQuery({
    queryKey: ['/api/admin/coupons'],
    queryFn: () => fetch('/api/admin/coupons').then(res => res.json()),
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['/api/admin/articles'],
    queryFn: async () => {
      // Always return sample data for demo purposes
      return {
        articles: [
          {
            id: 'a_101',
            title: 'Family Evacuation Checklist',
            slug: 'family-evacuation-checklist',
            category: 'announcements',
            menuCategory: 'Disaster Planning',
            tenant: 'PUBLIC',
            status: 'published',
            published: true,
            publishAt: '2025-08-20T10:00:00Z',
            authorName: 'Sarah Martinez',
            createdAt: '2025-08-20T10:00:00Z',
            updatedAt: '2025-08-20T10:00:00Z'
          },
          {
            id: 'a_102',
            title: 'Home Document Binder',
            slug: 'home-document-binder',
            category: 'support',
            menuCategory: 'Home Buying',
            tenant: 'PUBLIC',
            status: 'draft',
            published: false,
            publishAt: null,
            authorName: 'John Doe',
            createdAt: '2025-08-15T14:20:00Z',
            updatedAt: '2025-08-15T14:20:00Z'
          },
          {
            id: 'a_103',
            title: 'SOC Playbook Update',
            slug: 'soc-playbook-update',
            category: 'onboarding',
            menuCategory: 'Digital Security',
            tenant: 'STAFF',
            status: 'scheduled',
            published: false,
            publishAt: '2025-09-01T09:00:00Z',
            authorName: 'Emily Chen',
            createdAt: '2025-08-25T16:30:00Z',
            updatedAt: '2025-08-25T16:30:00Z'
          },
          {
            id: 'a_104',
            title: 'Pediatric Records Checklist',
            slug: 'pediatric-records-checklist',
            category: 'blog',
            menuCategory: 'Child Information',
            tenant: 'FAMILY',
            status: 'published',
            published: true,
            publishAt: '2025-08-10T14:20:00Z',
            authorName: 'Michael Rodriguez',
            createdAt: '2025-08-10T14:20:00Z',
            updatedAt: '2025-08-10T14:20:00Z'
          }
        ]
      };
    },
    // Fallback to sample data if API fails (for demo purposes)
    placeholderData: {
      articles: [
        {
          id: 'a_101',
          title: 'Family Evacuation Checklist',
          slug: 'family-evacuation-checklist',
          category: 'announcements',
          menuCategory: 'Disaster Planning',
          tenant: 'PUBLIC',
          status: 'published',
          published: true,
          publishAt: '2025-08-20T10:00:00Z',
          authorName: 'Sarah Martinez',
          createdAt: '2025-08-20T10:00:00Z',
          updatedAt: '2025-08-20T10:00:00Z'
        },
        {
          id: 'a_102',
          title: 'Home Document Binder',
          slug: 'home-document-binder',
          category: 'support',
          menuCategory: 'Home Buying',
          tenant: 'PUBLIC',
          status: 'draft',
          published: false,
          publishAt: null,
          authorName: 'John Doe',
          createdAt: '2025-08-15T14:20:00Z',
          updatedAt: '2025-08-15T14:20:00Z'
        },
        {
          id: 'a_103',
          title: 'SOC Playbook Update',
          slug: 'soc-playbook-update',
          category: 'onboarding',
          menuCategory: 'Digital Security',
          tenant: 'STAFF',
          status: 'scheduled',
          published: false,
          publishAt: '2025-09-01T09:00:00Z',
          authorName: 'Emily Chen',
          createdAt: '2025-08-25T16:30:00Z',
          updatedAt: '2025-08-25T16:30:00Z'
        },
        {
          id: 'a_104',
          title: 'Pediatric Records Checklist',
          slug: 'pediatric-records-checklist',
          category: 'blog',
          menuCategory: 'Child Information',
          tenant: 'FAMILY',
          status: 'published',
          published: true,
          publishAt: '2025-08-10T14:20:00Z',
          authorName: 'Michael Rodriguez',
          createdAt: '2025-08-10T14:20:00Z',
          updatedAt: '2025-08-10T14:20:00Z'
        }
      ]
    }
  });

  // Debug logging
  console.log('Articles data:', articles);
  console.log('Articles array:', articles?.articles);
  console.log('Articles length:', articles?.articles?.length);

  const { data: consents, isLoading: consentsLoading } = useQuery({
    queryKey: ['/api/admin/consents'],
    queryFn: () => fetch('/api/admin/consents').then(res => res.json()),
  });

  const { data: auditLogs, isLoading: auditLoading } = useQuery({
    queryKey: ['/api/admin/audit'],
    queryFn: () => fetch('/api/admin/audit').then(res => res.json()),
  });

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: formData.get('code'),
          percentOff: formData.get('percentOff') ? Number(formData.get('percentOff')) : undefined,
          amountOff: formData.get('amountOff') ? Number(formData.get('amountOff')) : undefined,
          validFrom: formData.get('validFrom') || undefined,
          validTo: formData.get('validTo') || undefined,
          maxRedemptions: formData.get('maxRedemptions') ? Number(formData.get('maxRedemptions')) : undefined,
        }),
      });

      if (response.ok) {
        toast({ title: 'Coupon created successfully!' });
        setNewCouponOpen(false);
        window.location.reload();
      } else {
        toast({ title: 'Failed to create coupon', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error creating coupon', variant: 'destructive' });
    }
  };

  // Plan modal functionality
  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const tenant = formData.get('tenant') as string;
    const name = (formData.get('name') as string)?.trim();
    
    if (!name) {
      toast({
        title: "Error",
        description: "Plan name is required.",
        variant: "destructive"
      });
      return;
    }

    const payload = {
      tenant,
      status: formData.get('status'),
      name,
      slug: formData.get('slug') || null,
      description: formData.get('description') || null,
      pricing: {
        type: formData.get('pricing_type'),
        amount: formData.get('amount') ? Number(formData.get('amount')) : null,
        interval: formData.get('interval') || null,
        billing_scheme: formData.get('billing_scheme'),
        trial_days: formData.get('trial_days') ? Number(formData.get('trial_days')) : 0,
        tax_behavior: formData.get('tax_behavior')
      },
      stripe: {
        product_id: formData.get('stripe_product_id') || null,
        price_id: formData.get('stripe_price_id') || null
      },
      features: Array.from(form.querySelectorAll('input[name="features[]"]'))
        .map((input: any) => input.value.trim())
        .filter(Boolean),
      visibility: formData.get('visibility'),
      sort: Number(formData.get('sort') || 0),
      badge: formData.get('badge') || null
    };

    // Validation for billable plans
    const needsStripe = (tenant === 'PUBLIC' && payload.pricing.type === 'fixed');
    if (needsStripe && (!payload.pricing.amount || !payload.pricing.interval)) {
      toast({
        title: "Error",
        description: "Amount and interval are required for a fixed-price client plan.",
        variant: "destructive"
      });
      return;
    }

    console.log('Plan payload:', payload);
    toast({
      title: "Success",
      description: "Plan would be saved successfully!",
    });
    setPlanModalOpen(false);
  };

  const updateBillingVisibility = () => {
    setTimeout(() => {
      const tenantSelect = document.getElementById('tenant') as HTMLSelectElement;
      const pricingTypeSelect = document.getElementById('pricing_type') as HTMLSelectElement;
      const billableElements = document.querySelectorAll('.billable-only');
      
      if (tenantSelect && pricingTypeSelect) {
        const selectedOption = tenantSelect.selectedOptions[0];
        const noBillingTenant = selectedOption?.getAttribute('data-nobilling') === 'true';
        const pricingType = pricingTypeSelect.value;
        const isBillable = !noBillingTenant && pricingType === 'fixed';
        
        billableElements.forEach((element) => {
          const htmlElement = element as HTMLElement;
          const inputs = htmlElement.querySelectorAll('input, select');
          if (isBillable) {
            htmlElement.style.opacity = '1';
            inputs.forEach((input) => {
              const formInput = input as HTMLInputElement | HTMLSelectElement;
              formInput.disabled = false;
            });
          } else {
            htmlElement.style.opacity = '0.5';
            inputs.forEach((input) => {
              const formInput = input as HTMLInputElement | HTMLSelectElement;
              formInput.disabled = true;
            });
          }
        });
      }
    }, 0);
  };

  const addFeature = () => {
    const featuresContainer = document.getElementById('features');
    if (featuresContainer) {
      const featureCount = featuresContainer.querySelectorAll('.feature-row').length;
      const row = document.createElement('div');
      row.className = 'feature-row';
      row.innerHTML = `
        <input name="features[]" placeholder="New feature" data-testid="input-feature-${featureCount}" />
        <button type="button" class="icon-btn remove-feature" aria-label="Remove" data-testid="button-remove-feature-${featureCount}">🗑️</button>
      `;
      featuresContainer.appendChild(row);
      
      // Add event listener for the new remove button
      const removeBtn = row.querySelector('.remove-feature');
      removeBtn?.addEventListener('click', () => {
        row.remove();
      });
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.trim();
    const slugInput = document.getElementById('slug') as HTMLInputElement;
    if (slugInput && !slugInput.value) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      slugInput.value = slug;
    }
  };

  // Handle modal keyboard events and initial billing visibility
  useEffect(() => {
    if (planModalOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setPlanModalOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Initial billing visibility update
      setTimeout(updateBillingVisibility, 0);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [planModalOpen]);

  // Coupon filtering and bulk actions functionality
  useEffect(() => {
    const initializeCouponFilters = () => {
      const table = document.getElementById('coupons-table');
      const selectAll = document.getElementById('select-all');
      const bulkBar = document.getElementById('bulk-bar');
      const bulkCount = document.getElementById('bulk-count');
      const fStatus = document.getElementById('f-status');
      const fType = document.getElementById('f-type');
      const fPlan = document.getElementById('f-plan');
      const fSearch = document.getElementById('f-search');
      const fClear = document.getElementById('f-clear');
      const btnEnable = document.getElementById('bulk-enable');
      const btnDisable = document.getElementById('bulk-disable');
      const btnArchive = document.getElementById('bulk-archive');
      const btnExport = document.getElementById('bulk-export');
      const btnClear = document.getElementById('bulk-clear');

      if (!table || !selectAll || !bulkBar) return;

      const getRows = () => Array.from(table.querySelectorAll('tbody tr[data-id]')) as HTMLTableRowElement[];
      const getChecks = () => Array.from(table.querySelectorAll('tbody .row-check')) as HTMLInputElement[];

      // Filter functionality
      const matchPlan = (rowVal: string, filterVal: string) => {
        if (filterVal === 'ALL') return true;
        if (!rowVal) return false;
        if (rowVal === '*') return true;
        return rowVal.split(',').map(s => s.trim()).includes(filterVal);
      };

      const matchesFilters = (row: HTMLTableRowElement) => {
        const statusOK = !(fStatus as HTMLSelectElement)?.value || (fStatus as HTMLSelectElement).value === 'ALL' || row.dataset.status === (fStatus as HTMLSelectElement).value;
        const typeOK = !(fType as HTMLSelectElement)?.value || (fType as HTMLSelectElement).value === 'ALL' || row.dataset.type === (fType as HTMLSelectElement).value;
        const planOK = !(fPlan as HTMLSelectElement)?.value || matchPlan(row.dataset.plans || '', (fPlan as HTMLSelectElement).value);
        
        const searchTerm = (fSearch as HTMLInputElement)?.value?.trim().toLowerCase() || '';
        const searchOK = !searchTerm || 
          (row.dataset.code || '').toLowerCase().includes(searchTerm) ||
          (row.dataset.value || '').toLowerCase().includes(searchTerm);

        return statusOK && typeOK && planOK && searchOK;
      };

      const applyFilters = () => {
        const rows = getRows();
        let visibleCount = 0;
        
        rows.forEach(row => {
          const shouldShow = matchesFilters(row);
          row.style.display = shouldShow ? '' : 'none';
          if (shouldShow) visibleCount++;
        });

        // Update table footer
        const tableFooter = table.querySelector('.px-4.py-3');
        if (tableFooter) {
          tableFooter.textContent = `Showing ${visibleCount} coupons`;
        }
      };

      // Bulk selection functionality
      const updateBulkUI = () => {
        const checks = getChecks();
        const selected = checks.filter(c => c.checked);
        const count = selected.length;
        
        if (!bulkBar || !bulkCount) return;
        
        bulkBar.style.display = count === 0 ? 'none' : 'flex';
        bulkCount.textContent = `${count} selected`;
        
        // Update row styling
        getRows().forEach(row => {
          const checkbox = row.querySelector('.row-check') as HTMLInputElement;
          row.classList.toggle('bg-blue-100', checkbox?.checked || false);
        });
        
        // Update select-all state
        const total = checks.length;
        (selectAll as HTMLInputElement).indeterminate = count > 0 && count < total;
        (selectAll as HTMLInputElement).checked = count === total && total > 0;
      };

      // Event listeners
      selectAll.addEventListener('change', () => {
        const shouldCheck = (selectAll as HTMLInputElement).checked;
        getChecks().forEach(check => {
          const row = check.closest('tr') as HTMLTableRowElement;
          if (row && row.style.display !== 'none') {
            check.checked = shouldCheck;
          }
        });
        updateBulkUI();
      });

      table.addEventListener('change', (e) => {
        if ((e.target as HTMLElement).classList.contains('row-check')) {
          updateBulkUI();
        }
      });

      // Filter event listeners
      [fStatus, fType, fPlan, fSearch].forEach(el => {
        if (el) {
          el.addEventListener('input', applyFilters);
          el.addEventListener('change', applyFilters);
        }
      });

      fClear?.addEventListener('click', () => {
        if (fStatus) (fStatus as HTMLSelectElement).value = 'ALL';
        if (fType) (fType as HTMLSelectElement).value = 'ALL';
        if (fPlan) (fPlan as HTMLSelectElement).value = 'ALL';
        if (fSearch) (fSearch as HTMLInputElement).value = '';
        applyFilters();
      });

      // Bulk action handlers
      const getSelectedIds = () => 
        getChecks().filter(c => c.checked).map(c => c.closest('tr')?.dataset.id).filter(Boolean);

      const confirmAndRun = async (label: string, fn: Function) => {
        const ids = getSelectedIds();
        if (!ids.length) return;
        if (!confirm(`${label} ${ids.length} coupon(s)?`)) return;
        await fn(ids);
        
        // Clear selection after action
        getChecks().forEach(c => c.checked = false);
        updateBulkUI();
      };

      btnEnable?.addEventListener('click', () => 
        confirmAndRun('Enable', async (ids: string[]) => {
          console.log('Enable coupons →', ids);
          // TODO: Implement API call
        })
      );

      btnDisable?.addEventListener('click', () => 
        confirmAndRun('Disable', async (ids: string[]) => {
          console.log('Disable coupons →', ids);
          // TODO: Implement API call  
        })
      );

      btnArchive?.addEventListener('click', () => 
        confirmAndRun('Archive', async (ids: string[]) => {
          console.log('Archive coupons →', ids);
          // TODO: Implement API call
        })
      );

      btnExport?.addEventListener('click', () => {
        const ids = getSelectedIds();
        if (!ids.length) return;
        
        const headers = ['id', 'code', 'type', 'value', 'plans', 'usage', 'expires', 'status'];
        const csvRows = [headers.join(',')];
        
        ids.forEach(id => {
          const row = table.querySelector(`tr[data-id="${id}"]`) as HTMLTableRowElement;
          if (row) {
            const code = (row.dataset.code || '').replace(/,/g, '');
            const type = row.dataset.type || '';
            const value = (row.dataset.value || '').replace(/,/g, '');
            const plans = (row.dataset.plans || '').replace(/,/g, ';');
            const usage = row.children[6]?.textContent?.trim().replace(/,/g, '') || '';
            const expires = row.children[7]?.textContent?.trim() || '';
            const status = row.dataset.status || '';
            csvRows.push([id, code, type, value, plans, usage, expires, status].join(','));
          }
        });
        
        const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `coupons_export_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
      });

      btnClear?.addEventListener('click', () => {
        getChecks().forEach(c => c.checked = false);
        updateBulkUI();
      });

      // Initialize UI
      applyFilters();
      updateBulkUI();
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initializeCouponFilters, 100);
    return () => clearTimeout(timer);
  }, [activeSection, coupons]);

  const EnhancedStatsCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="bg-[#007BFF] text-white cursor-pointer hover:bg-blue-600 transition-colors" 
        onClick={() => {
          trackAdminClick('dashboard_kpi_users');
          setActiveSection('users');
        }}
        data-testid="card-total-users"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#F8F9FA]">Total Users</CardTitle>
          <Users className="h-5 w-5 text-[#F8F9FA]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,247</div>
          <div className="flex items-center text-xs text-[#F8F9FA] mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% from last month
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-[#28A745] text-white cursor-pointer hover:bg-green-600 transition-colors" 
        onClick={() => {
          trackAdminClick('dashboard_kpi_plans');
          setActiveSection('plans');
        }}
        data-testid="card-active-plans"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#F8F9FA]">Active Plans</CardTitle>
          <CreditCard className="h-5 w-5 text-[#F8F9FA]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{plans?.plans?.length || 3}</div>
          <div className="flex items-center text-xs text-[#F8F9FA] mt-1">
            <BarChart3 className="w-3 h-3 mr-1" />
            All plans operational
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-[#6C757D] text-white cursor-pointer hover:bg-gray-600 transition-colors" 
        onClick={() => {
          trackAdminClick('dashboard_kpi_coupons');
          setActiveSection('coupons');
        }}
        data-testid="card-active-coupons"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[#F8F9FA]">Active Coupons</CardTitle>
          <Ticket className="h-5 w-5 text-[#F8F9FA]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{coupons?.coupons?.length || 8}</div>
          <div className="flex items-center text-xs text-[#F8F9FA] mt-1">
            <PieChart className="w-3 h-3 mr-1" />
            85% redemption rate
          </div>
        </CardContent>
      </Card>
      
      <Card 
        className="bg-[#FFC107] text-black cursor-pointer hover:bg-yellow-600 hover:text-white transition-colors" 
        onClick={() => {
          trackAdminClick('dashboard_kpi_content');
          setActiveSection('content');
        }}
        data-testid="card-content-articles"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-black">Content Articles</CardTitle>
          <FileText className="h-5 w-5 text-black" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{articles?.articles?.length || 24}</div>
          <div className="flex items-center text-xs text-black mt-1">
            <Activity className="w-3 h-3 mr-1" />
            3 published today
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatusWidget />
            
            <EnhancedStatsCards />
            
            <SecurityCenterCard setActiveSection={setActiveSection} />
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Activity Widget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest audit log entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {auditLogs?.logs?.slice(0, 5).map((log: any, index: number) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    )) || (
                      <p className="text-muted-foreground text-sm">No audit logs yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Widget */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors"
                    onClick={() => {
                      trackAdminClick('dashboard_quick_action_create_coupon');
                      setActiveSection('coupons');
                    }}
                    data-testid="button-create-new-coupon"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Coupon
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors"
                    onClick={() => {
                      trackAdminClick('dashboard_quick_action_view_users');
                      setActiveSection('users');
                    }}
                    data-testid="button-view-all-users"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors"
                    onClick={() => {
                      trackAdminClick('dashboard_quick_action_security_audit');
                      setActiveSection('security');
                    }}
                    data-testid="button-security-audit"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security Audit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors"
                    onClick={() => {
                      trackAdminClick('dashboard_quick_action_gdpr_compliance');
                      setActiveSection('compliance');
                    }}
                    data-testid="button-gdpr-compliance"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    GDPR Compliance
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'users':
        // Multi-tenant sample users for demonstration
        const sampleUsers = [
          { id: 1, name: "John Doe", email: "john@company.com", tenant: "STAFF", role: "admin", status: "Active", mfaEnabled: true, lastLogin: "2024-01-28" },
          { id: 2, name: "Sarah Martinez", email: "sarah@familycirclesecure.com", tenant: "FAMILY", role: "family_admin", status: "Active", mfaEnabled: true, lastLogin: "2024-01-27" },
          { id: 3, name: "Alex Johnson", email: "alex.client@gmail.com", tenant: "PUBLIC", role: "client_plus", status: "Active", mfaEnabled: false, lastLogin: "2024-01-26" },
          { id: 4, name: "Emily Chen", email: "emily@familycirclesecure.com", tenant: "FAMILY", role: "family_member", status: "Pending", mfaEnabled: false, lastLogin: null },
          { id: 5, name: "Michael Rodriguez", email: "mrodriguez@company.com", tenant: "STAFF", role: "agent", status: "Active", mfaEnabled: true, lastLogin: "2024-01-28" },
          { id: 6, name: "Lisa Wang", email: "lisa.client@outlook.com", tenant: "PUBLIC", role: "client", status: "Suspended", mfaEnabled: false, lastLogin: "2024-01-20" },
        ];
        
        // Filter users based on tenant and search
        const filteredUsers = sampleUsers.filter(user => {
          const matchesTenant = selectedTenant === "all" || user.tenant === selectedTenant;
          const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               user.email.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesTenant && matchesSearch;
        });
        
        // Handle user actions
        const handleInviteUser = () => {
          toast({ title: "Invite User", description: "Opening invite user form..." });
        };
        
        const handleEditUser = (user: any) => {
          setEditingUser(user);
          setEditUserModalOpen(true);
        };
        
        const handleSuspendUser = (user: any) => {
          toast({ title: "User Suspended", description: `${user.name} has been suspended.` });
        };
        
        const handleReactivateUser = (user: any) => {
          toast({ title: "User Reactivated", description: `${user.name} has been reactivated.` });
        };
        
        const handleResendInvite = (user: any) => {
          toast({ title: "Invitation Resent", description: `Invitation resent to ${user.email}` });
        };
        
        const handleRemoveUser = (user: any) => {
          toast({ title: "User Removed", description: `${user.name} has been removed.`, variant: "destructive" });
        };

        const getTenantBadge = (tenant: string) => {
          const styles = {
            PUBLIC: "badge-tenant-public bg-[#0D6EFD1a] text-[#0D6EFD]",
            FAMILY: "badge-tenant-family bg-[#6F42C11a] text-[#6F42C1]", 
            STAFF: "badge-tenant-staff bg-[#24A1481a] text-[#1B7F3B]"
          };
          const labels = {
            PUBLIC: "Public",
            FAMILY: "Family",
            STAFF: "Staff"
          };
          return (
            <span className={`badge px-2 py-1 rounded-full text-xs font-semibold ${styles[tenant as keyof typeof styles] || styles.PUBLIC}`}>
              {labels[tenant as keyof typeof labels] || tenant}
            </span>
          );
        };

        const getRoleBadge = (role: string, tenant: string) => {
          const roleLabels: Record<string, string> = {
            // Staff roles
            admin: "Admin",
            manager: "Manager", 
            agent: "Agent",
            security_officer: "Security",
            // Family roles
            family_admin: "Family Admin",
            family_member: "Member",
            // Public roles
            client: "Client",
            client_plus: "Client+",
            support_view: "Support"
          };
          
          const getStyleByTenant = (tenant: string) => {
            switch(tenant) {
              case 'STAFF': return "bg-gray-100 text-gray-700 border border-gray-300";
              case 'FAMILY': return "bg-purple-100 text-purple-700 border border-purple-300";
              case 'PUBLIC': return "bg-blue-100 text-blue-700 border border-blue-300";
              default: return "bg-gray-100 text-gray-700 border border-gray-300";
            }
          };
          
          return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStyleByTenant(tenant)}`}>
              {roleLabels[role] || role}
            </span>
          );
        };

        const getStatusIndicator = (status: string) => {
          const styles = {
            Active: "badge-status-active bg-[#34C7591a] text-[#2E9950]",
            Pending: "badge-status-pending bg-[#FFC1071a] text-[#AD7A00]",
            Suspended: "badge-status-susp bg-[#DC35451a] text-[#B02A37]"
          };
          const icons = {
            Active: "✓",
            Pending: "⏳", 
            Suspended: "⚠"
          };
          const config = styles[status as keyof typeof styles] || styles.Active;
          const icon = icons[status as keyof typeof icons] || icons.Active;
          return (
            <span className={`badge px-2 py-1 rounded-full text-xs font-semibold ${config}`}>
              {icon} {status}
            </span>
          );
        };

        return (
          <>
            <Card className="shadow-lg rounded-2xl bg-white border-gray-100" style={{ borderRadius: '16px' }}>
            {/* Header Section */}
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">User Management</CardTitle>
                  <CardDescription className="text-[#6C757D] mt-1">Manage team members, roles and access permissions</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Tenant Filter */}
                  <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                    <SelectTrigger 
                      className="w-full sm:w-40 tenant-filter bg-[#1E232A] text-[#E8EEF7] border-[#2B313A] hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors duration-200 rounded-full shadow-sm !bg-[#1E232A] hover:!bg-[#1F6FEB] focus:!bg-[#1F6FEB]" 
                      data-testid="select-tenant-filter"
                      aria-label="Filter users by tenant"
                      style={{
                        background: '#1E232A',
                        color: '#E8EEF7',
                        borderColor: '#2B313A'
                      }}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Tenants" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F141A] border-[#2B313A] shadow-lg" role="menu">
                      <SelectItem value="all" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio" aria-checked="true">
                        All Tenants <span className="text-gray-400 ml-1">({sampleUsers.length})</span>
                      </SelectItem>
                      <SelectItem value="PUBLIC" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio">
                        Public Clients <span className="text-gray-400 ml-1">({sampleUsers.filter(u => u.tenant === 'PUBLIC').length})</span>
                      </SelectItem>
                      <SelectItem value="FAMILY" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio">
                        Family Portal <span className="text-gray-400 ml-1">({sampleUsers.filter(u => u.tenant === 'FAMILY').length})</span>
                      </SelectItem>
                      <SelectItem value="STAFF" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio">
                        Staff Hub <span className="text-gray-400 ml-1">({sampleUsers.filter(u => u.tenant === 'STAFF').length})</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none w-full sm:w-64"
                      data-testid="input-user-search"
                    />
                  </div>
                  
                  {/* Invite User Button */}
                  <Button 
                    onClick={handleInviteUser}
                    className="bg-[#007BFF] hover:bg-[#0056d6] text-white px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-black/20 whitespace-nowrap"
                    data-testid="button-invite-user"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite User
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden" style={{maxHeight: '60vh'}}>
                <div className="overflow-auto" style={{maxHeight: '60vh'}}>
                  <table className="w-full table-auto">
                  <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFA</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} data-tenant={user.tenant} data-row className="hover:bg-[#F6F8FB] focus-within:outline focus-within:outline-2 focus-within:outline-[#1F6FEB33] focus-within:rounded-lg transition-all duration-150 group">
                        {/* Name with Avatar */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-[#007BFF] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-[#007BFF] font-medium text-sm">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900" data-testid={`text-user-name-${user.id}`}>{user.name}</div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Email */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button 
                            className="text-sm text-[#007BFF] hover:text-[#0056d6] hover:underline flex items-center gap-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1F6FEB] focus-visible:rounded"
                            onClick={() => {
                              navigator.clipboard.writeText(user.email);
                              toast({ title: 'Email copied to clipboard!' });
                            }}
                            data-testid={`button-copy-email-${user.id}`}
                            aria-label={`Copy email ${user.email}`}
                          >
                            <Mail className="w-3 h-3" />
                            <span>
                              {user.email.split('@')[0]}
                              <span className="text-gray-400">@{user.email.split('@')[1]}</span>
                            </span>
                          </button>
                        </td>
                        
                        {/* Tenant Badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div data-testid={`badge-tenant-${user.id}`}>
                            {getTenantBadge(user.tenant)}
                          </div>
                        </td>
                        
                        {/* Role Badge */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div data-testid={`badge-role-${user.id}`}>
                            {getRoleBadge(user.role, user.tenant)}
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div data-testid={`status-${user.id}`}>
                            {getStatusIndicator(user.status)}
                          </div>
                        </td>
                        
                        {/* MFA Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div data-testid={`mfa-status-${user.id}`}>
                            {user.mfaEnabled ? (
                              <span className="badge badge-mfa-enabled px-2 py-1 rounded-full text-xs font-semibold bg-[#34C7591a] text-[#2E9950]">
                                ✓ Enabled
                              </span>
                            ) : (
                              <span className="badge badge-mfa-disabled px-2 py-1 rounded-full text-xs font-semibold bg-[#DC35451a] text-[#B02A37]">
                                ⚠ Disabled
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {/* Last Login */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600" data-testid={`last-login-${user.id}`}>
                            {user.lastLogin ? (
                              <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                            ) : (
                              <span className="text-gray-400 italic">Never</span>
                            )}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="col-actions px-4 py-3 whitespace-nowrap text-right" style={{width: '172px'}}>
                          <div className="row-actions flex items-center justify-end gap-1" role="group" aria-label="Row actions">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="appearance-none bg-transparent border-0 p-1.5 ml-1.5 rounded-lg text-[#667085] opacity-90 cursor-pointer transition-all duration-150 hover:bg-[#EEF3FF] hover:text-[#1F6FEB] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F6FEB] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_2px_rgba(31,111,235,0.15)]"
                              data-testid={`button-edit-${user.id}`}
                              aria-label={`Edit user ${user.name}`}
                              data-tip="Edit"
                              style={{
                                position: 'relative'
                              }}
                            >
                              <Edit className="w-3.5 h-3.5" style={{stroke: 'currentColor', fill: 'none'}} />
                            </button>
                            
                            {user.status === 'Suspended' ? (
                              <button 
                                onClick={() => handleReactivateUser(user)}
                                className="appearance-none bg-transparent border-0 p-1.5 ml-1.5 rounded-lg text-[#667085] opacity-90 cursor-pointer transition-all duration-150 hover:bg-[#EEF3FF] hover:text-[#28A745] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F6FEB] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_2px_rgba(31,111,235,0.15)]"
                                data-testid={`button-reactivate-${user.id}`}
                                aria-label={`Reactivate user ${user.name}`}
                                data-tip="Reactivate"
                                style={{
                                  position: 'relative'
                                }}
                              >
                                <Power className="w-3.5 h-3.5" style={{stroke: 'currentColor', fill: 'none'}} />
                              </button>
                            ) : user.status === 'Pending' ? (
                              <button 
                                onClick={() => handleResendInvite(user)}
                                className="appearance-none bg-transparent border-0 p-1.5 ml-1.5 rounded-lg text-[#667085] opacity-90 cursor-pointer transition-all duration-150 hover:bg-[#EEF3FF] hover:text-[#FFC107] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F6FEB] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_2px_rgba(31,111,235,0.15)]"
                                data-testid={`button-resend-${user.id}`}
                                aria-label={`Resend invitation to ${user.name}`}
                                data-tip="Resend Invite"
                                style={{
                                  position: 'relative'
                                }}
                              >
                                <RotateCcw className="w-3.5 h-3.5" style={{stroke: 'currentColor', fill: 'none'}} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleSuspendUser(user)}
                                className="appearance-none bg-transparent border-0 p-1.5 ml-1.5 rounded-lg text-[#667085] opacity-90 cursor-pointer transition-all duration-150 hover:bg-[#EEF3FF] hover:text-[#DC3545] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F6FEB] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_2px_rgba(31,111,235,0.15)]"
                                data-testid={`button-suspend-${user.id}`}
                                aria-label={`Suspend user ${user.name}`}
                                data-tip="Suspend"
                                style={{
                                  position: 'relative'
                                }}
                              >
                                <Power className="w-3.5 h-3.5" style={{stroke: 'currentColor', fill: 'none'}} />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleRemoveUser(user)}
                              className="appearance-none bg-transparent border-0 p-1.5 ml-1.5 rounded-lg text-[#667085] opacity-90 cursor-pointer transition-all duration-150 hover:bg-[#EEF3FF] hover:text-[#DC3545] hover:opacity-100 focus-visible:outline-2 focus-visible:outline-[#1F6FEB] focus-visible:outline-offset-2 focus-visible:shadow-[0_0_0_2px_rgba(31,111,235,0.15)]"
                              data-testid={`button-remove-${user.id}`}
                              aria-label={`Remove user ${user.name}`}
                              data-tip="Remove"
                              style={{
                                position: 'relative'
                              }}
                            >
                              <X className="w-3.5 h-3.5" style={{stroke: 'currentColor', fill: 'none'}} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Empty State Row */}
                    <tr className="empty-row hidden" id="empty-users-row">
                      <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                        <Users className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                        <p className="text-sm font-medium">No users found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
                      </td>
                    </tr>
                  </tbody>
                  </table>
                </div>
              </div>
              
              {/* Mobile Card Layout */}
              <div className="md:hidden">
                {sampleUsers.map((user: any) => (
                  <div key={user.id} className="p-4 border-b border-gray-100 hover:bg-[#f6f8fa] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#007BFF] bg-opacity-10 rounded-full flex items-center justify-center mr-3">
                          <span className="text-[#007BFF] font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900" data-testid={`mobile-user-name-${user.id}`}>{user.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {getTenantBadge(user.tenant)}
                            {getRoleBadge(user.role, user.tenant)}
                            {getStatusIndicator(user.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-[#007BFF] mb-3 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>
                        {user.email.split('@')[0]}
                        <span className="text-gray-400">@{user.email.split('@')[1]}</span>
                      </span>
                    </div>
                    
                    {/* Last Login - Mobile */}
                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      <span>Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleEditUser(user)}
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        data-testid={`mobile-button-edit-${user.id}`}
                      >
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button 
                        onClick={() => {
                          if (user.status === 'Suspended') {
                            handleReactivateUser(user);
                          } else if (user.status === 'Pending') {
                            handleResendInvite(user);
                          } else {
                            handleSuspendUser(user);
                          }
                        }}
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        data-testid={`mobile-button-action-${user.id}`}
                      >
                        {user.status === 'Suspended' ? 'Reactivate' : user.status === 'Pending' ? 'Resend' : 'Suspend'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Table Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <span>Showing {sampleUsers.length} users</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#0D6EFD1a] border border-[#0D6EFD]" />
                      Public ({sampleUsers.filter(u => u.tenant === 'PUBLIC').length})
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#6F42C11a] border border-[#6F42C1]" />
                      Family ({sampleUsers.filter(u => u.tenant === 'FAMILY').length})
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-[#24A1481a] border border-[#1B7F3B]" />
                      Staff ({sampleUsers.filter(u => u.tenant === 'STAFF').length})
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit User Modal */}
          {editUserModalOpen && (
            <Dialog open={editUserModalOpen} onOpenChange={setEditUserModalOpen}>
              <DialogContent className="bg-[#0F141A] border-[#2B313A] text-[#D5DDE7] max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-[#D5DDE7] text-lg font-semibold">
                    Edit User
                  </DialogTitle>
                  <DialogDescription className="text-[#8B949E]">
                    Update user information and settings.
                  </DialogDescription>
                </DialogHeader>
                
                {editingUser && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-user-name" className="text-[#D5DDE7]">Full Name</Label>
                      <Input 
                        id="edit-user-name"
                        defaultValue={editingUser.name}
                        className="bg-[#1C2128] border-[#30363D] text-[#D5DDE7] focus:border-[#1F6FEB]"
                        data-testid="input-edit-user-name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-user-email" className="text-[#D5DDE7]">Email Address</Label>
                      <Input 
                        id="edit-user-email"
                        type="email"
                        defaultValue={editingUser.email}
                        className="bg-[#1C2128] border-[#30363D] text-[#D5DDE7] focus:border-[#1F6FEB]"
                        data-testid="input-edit-user-email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-user-role" className="text-[#D5DDE7]">Role</Label>
                      <Select defaultValue={editingUser.role}>
                        <SelectTrigger className="bg-[#1C2128] border-[#30363D] text-[#D5DDE7]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A]">
                          <SelectItem value="Admin" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Admin</SelectItem>
                          <SelectItem value="Family Admin" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Family Admin</SelectItem>
                          <SelectItem value="Member" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Member</SelectItem>
                          <SelectItem value="Client" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Client</SelectItem>
                          <SelectItem value="Agent" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-user-tenant" className="text-[#D5DDE7]">Tenant</Label>
                      <Select defaultValue={editingUser.tenant}>
                        <SelectTrigger className="bg-[#1C2128] border-[#30363D] text-[#D5DDE7]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A]">
                          <SelectItem value="PUBLIC" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Public Clients</SelectItem>
                          <SelectItem value="FAMILY" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Family Portal</SelectItem>
                          <SelectItem value="STAFF" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Staff Hub</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-user-status" className="text-[#D5DDE7]">Status</Label>
                      <Select defaultValue={editingUser.status}>
                        <SelectTrigger className="bg-[#1C2128] border-[#30363D] text-[#D5DDE7]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A]">
                          <SelectItem value="Active" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Active</SelectItem>
                          <SelectItem value="Pending" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Pending</SelectItem>
                          <SelectItem value="Suspended" className="text-[#D5DDE7] hover:bg-[#1E2A3A]">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={() => {
                          setEditUserModalOpen(false);
                          toast({ title: "User Updated", description: `${editingUser.name} has been updated successfully.` });
                        }}
                        className="flex-1 bg-[#1F6FEB] hover:bg-[#1a5fc9] text-white"
                        data-testid="button-save-user-edit"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setEditUserModalOpen(false)}
                        className="flex-1 border-[#30363D] text-[#D5DDE7] hover:bg-[#1E2A3A]"
                        data-testid="button-cancel-user-edit"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
          </>
        );
      
      case 'plans':
        return (
          <div className="plans-section">
            {/* Plans Header */}
            <div className="plans-header">
              <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
              
              {/* Segmented Tabs */}
              <div className="segmented">
                <button 
                  className={`seg ${planScope === 'PUBLIC' ? 'is-active' : ''}`}
                  onClick={() => setPlanScope('PUBLIC')}
                  data-scope="PUBLIC"
                  data-testid="tab-client-plans"
                >
                  Client Plans
                </button>
                <button 
                  className={`seg ${planScope === 'FAMILY' ? 'is-active' : ''}`}
                  onClick={() => setPlanScope('FAMILY')}
                  data-scope="FAMILY"
                  data-testid="tab-family-plans"
                >
                  Family (no billing)
                </button>
                <button 
                  className={`seg ${planScope === 'STAFF' ? 'is-active' : ''}`}
                  onClick={() => setPlanScope('STAFF')}
                  data-scope="STAFF"
                  data-testid="tab-staff-plans"
                >
                  Staff (no billing)
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="actions">
                <button 
                  className="btn ghost"
                  data-testid="button-sync-stripe"
                >
                  Sync Stripe
                </button>
                <button 
                  className="btn primary"
                  onClick={() => {
                    setEditingPlan(null);
                    setPlanModalOpen(true);
                  }}
                  data-testid="button-new-plan"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Plan
                </button>
              </div>
            </div>

            {/* Dynamic Empty State */}
            {planScope !== 'PUBLIC' && (
              <div className="empty-state">
                <div className="icon">💳</div>
                <h3>
                  {planScope === 'FAMILY' ? 'Family plans do not use billing' : 'Staff plans do not use billing'}
                </h3>
                <p>Access is role-based only. Manage roles and permissions in Users.</p>
              </div>
            )}
            
            {/* Stripe Empty State (for future Stripe disconnected state) */}
            {planScope === 'PUBLIC' && false && ( // Set to true when Stripe is disconnected
              <div className="empty-state">
                <div className="icon">💳</div>
                <h3>Stripe not connected</h3>
                <p>Connect Stripe to create and manage Client subscription plans.</p>
                <button 
                  className="btn primary" 
                  data-testid="button-connect-stripe-empty"
                >
                  Connect Stripe
                </button>
              </div>
            )}

            {/* Plans Table - only show for PUBLIC scope */}
            {planScope === 'PUBLIC' && (
              <div className="card" id="plans-table-container">
              <table className="table" id="plans-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Interval</th>
                    <th>Users</th>
                    <th>Status</th>
                    <th>Stripe ID</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Free Plan */}
                  <tr data-tenant="PUBLIC">
                    <td>
                      <strong>Free</strong> 
                      <span className="badge badge-muted">Most basic</span>
                    </td>
                    <td>$0</td>
                    <td>Forever</td>
                    <td>128 <span className="trend-indicator trend-up">▲12%</span></td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td>
                      <button 
                        className="stripe-link"
                        onClick={() => window.open('https://dashboard.stripe.com/products/prod_free', '_blank')}
                        title="Open in Stripe Dashboard"
                        data-testid="link-stripe-free"
                      >
                        price_free
                      </button>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button 
                          className="tooltip" 
                          title="Edit plan"
                          tabIndex={0}
                          aria-label="Edit plan" 
                          data-testid="button-edit-free"
                        >
                          ✏️
                        </button>
                        <button 
                          className="tooltip" 
                          title="Duplicate plan"
                          tabIndex={0}
                          aria-label="Duplicate plan" 
                          data-testid="button-duplicate-free"
                        >
                          🧬
                        </button>
                        <button 
                          className="tooltip" 
                          title="Archive plan"
                          tabIndex={0}
                          aria-label="Archive plan" 
                          data-testid="button-archive-free"
                        >
                          📦
                        </button>
                        <button 
                          className="tooltip" 
                          title="Open in Stripe Dashboard"
                          tabIndex={0}
                          onClick={() => window.open('https://dashboard.stripe.com/products/prod_free', '_blank')}
                          aria-label="Open in Stripe" 
                          data-testid="button-stripe-free"
                        >
                          🔗
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Silver Plan */}
                  <tr data-tenant="PUBLIC">
                    <td>
                      <strong>Silver</strong> 
                      <span className="badge">Popular</span>
                    </td>
                    <td>$10</td>
                    <td>Monthly (annual billing)</td>
                    <td>43 <span className="trend-indicator trend-up">▲8%</span></td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td>
                      <button 
                        className="stripe-link"
                        onClick={() => window.open('https://dashboard.stripe.com/products/prod_silver', '_blank')}
                        title="Open in Stripe Dashboard"
                        data-testid="link-stripe-silver"
                      >
                        price_silver_10
                      </button>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button 
                          className="tooltip" 
                          title="Edit plan"
                          tabIndex={0}
                          aria-label="Edit plan" 
                          data-testid="button-edit-silver"
                        >
                          ✏️
                        </button>
                        <button 
                          className="tooltip" 
                          title="Duplicate plan"
                          tabIndex={0}
                          aria-label="Duplicate plan" 
                          data-testid="button-duplicate-silver"
                        >
                          🧬
                        </button>
                        <button 
                          className="tooltip" 
                          title="Archive plan"
                          tabIndex={0}
                          aria-label="Archive plan" 
                          data-testid="button-archive-silver"
                        >
                          📦
                        </button>
                        <button 
                          className="tooltip" 
                          title="Open in Stripe Dashboard"
                          tabIndex={0}
                          onClick={() => window.open('https://dashboard.stripe.com/products/prod_silver', '_blank')}
                          aria-label="Open in Stripe" 
                          data-testid="button-stripe-silver"
                        >
                          🔗
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Gold Plan */}
                  <tr data-tenant="PUBLIC">
                    <td>
                      <strong>Gold</strong>
                    </td>
                    <td>$20</td>
                    <td>Monthly (annual billing)</td>
                    <td>25 <span className="trend-indicator trend-up">▲5%</span></td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td>
                      <button 
                        className="stripe-link"
                        onClick={() => window.open('https://dashboard.stripe.com/products/prod_gold', '_blank')}
                        title="Open in Stripe Dashboard"
                        data-testid="link-stripe-gold"
                      >
                        price_gold_20
                      </button>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button 
                          className="tooltip" 
                          title="Edit plan"
                          tabIndex={0}
                          aria-label="Edit plan" 
                          data-testid="button-edit-gold"
                        >
                          ✏️
                        </button>
                        <button 
                          className="tooltip" 
                          title="Duplicate plan"
                          tabIndex={0}
                          aria-label="Duplicate plan" 
                          data-testid="button-duplicate-gold"
                        >
                          🧬
                        </button>
                        <button 
                          className="tooltip" 
                          title="Archive plan"
                          tabIndex={0}
                          aria-label="Archive plan" 
                          data-testid="button-archive-gold"
                        >
                          📦
                        </button>
                        <button 
                          className="tooltip" 
                          title="Open in Stripe Dashboard"
                          tabIndex={0}
                          onClick={() => window.open('https://dashboard.stripe.com/products/prod_gold', '_blank')}
                          aria-label="Open in Stripe" 
                          data-testid="button-stripe-gold"
                        >
                          🔗
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Custom Plan */}
                  <tr data-tenant="PUBLIC">
                    <td>
                      <strong>Custom (Advisors)</strong> 
                      <span className="badge badge-muted">By quote</span>
                    </td>
                    <td>Custom</td>
                    <td>Custom</td>
                    <td>8 <span className="trend-indicator trend-down">▼2%</span></td>
                    <td><span className="badge badge-status-draft">Draft</span></td>
                    <td>
                      <span className="mono" title="Custom pricing - no Stripe ID">
                        custom_quote
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button 
                          className="tooltip" 
                          title="Edit plan"
                          tabIndex={0}
                          aria-label="Edit plan" 
                          data-testid="button-edit-custom"
                        >
                          ✏️
                        </button>
                        <button 
                          className="tooltip" 
                          title="Duplicate plan"
                          tabIndex={0}
                          aria-label="Duplicate plan" 
                          data-testid="button-duplicate-custom"
                        >
                          🧬
                        </button>
                        <button 
                          className="tooltip" 
                          title="Make active"
                          tabIndex={0}
                          aria-label="Activate plan" 
                          data-testid="button-activate-custom"
                        >
                          ✅
                        </button>
                        <button 
                          className="tooltip" 
                          title="No Stripe integration (custom pricing)"
                          tabIndex={0}
                          disabled
                          aria-label="No Stripe integration" 
                          data-testid="button-stripe-disabled-custom"
                          style={{opacity: 0.3, cursor: 'not-allowed'}}
                        >
                          🔗
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="table-foot">Showing 4 plans</div>
              </div>
            )}
          </div>

        );
      
      case 'coupons':
        return (
          <div className="coupons-section">
            {/* Coupons Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Coupons</h2>
                <p className="text-gray-600 mt-1">Promotional codes & discounts</p>
              </div>
              <Dialog open={newCouponOpen} onOpenChange={setNewCouponOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50" 
                    data-testid="button-create-coupon"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                    <DialogDescription>
                      Create promotional codes to offer discounts on subscription plans
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateCoupon} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="code">Coupon Code</Label>
                        <div className="flex gap-2">
                          <Input 
                            id="code" 
                            name="code" 
                            placeholder="WELCOME10" 
                            className="font-mono uppercase"
                            required 
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const randomCode = 'SAVE' + Math.random().toString(36).substring(2, 8).toUpperCase();
                              (document.getElementById('code') as HTMLInputElement).value = randomCode;
                            }}
                          >
                            Generate
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">3-32 characters, A-Z, 0-9, -, _</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="discountType">Discount Type</Label>
                        <Select name="discountType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percent">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                            <SelectItem value="trial">Free Trial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="discountValue">Discount Value</Label>
                        <Input 
                          id="discountValue" 
                          name="discountValue" 
                          type="number" 
                          placeholder="10" 
                          min="1"
                          required 
                        />
                      </div>
                    </div>

                    {/* Scope */}
                    <fieldset className="border border-gray-200 rounded-lg p-4">
                      <legend className="px-2 text-sm font-medium text-gray-900">Applies To</legend>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tenant">Audience</Label>
                          <Select name="tenant" defaultValue="PUBLIC">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PUBLIC">Client Plans (billable)</SelectItem>
                              <SelectItem value="FAMILY" disabled>Family (no billing)</SelectItem>
                              <SelectItem value="STAFF" disabled>Staff (no billing)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="appliesTo">Subscription Plans</Label>
                          <Select name="appliesTo">
                            <SelectTrigger>
                              <SelectValue placeholder="All plans" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Plans</SelectItem>
                              <SelectItem value="silver">Silver Only</SelectItem>
                              <SelectItem value="gold">Gold Only</SelectItem>
                              <SelectItem value="custom">Custom Plans</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">Leave as 'All plans' to apply globally</p>
                        </div>
                      </div>
                    </fieldset>

                    {/* Limits & Expiration */}
                    <fieldset className="border border-gray-200 rounded-lg p-4">
                      <legend className="px-2 text-sm font-medium text-gray-900">Limits & Expiration</legend>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label htmlFor="maxRedemptions">Max Total Uses</Label>
                          <Input 
                            id="maxRedemptions" 
                            name="maxRedemptions" 
                            type="number" 
                            min="1"
                            placeholder="e.g., 100" 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="perCustomer">Per-Customer Limit</Label>
                          <Input 
                            id="perCustomer" 
                            name="perCustomer" 
                            type="number" 
                            min="1"
                            placeholder="e.g., 1" 
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="validTo">Expiration Date</Label>
                          <Input 
                            id="validTo" 
                            name="validTo" 
                            type="date" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="firstInvoiceOnly">First Invoice Only?</Label>
                          <Select name="firstInvoiceOnly" defaultValue="false">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="false">No</SelectItem>
                              <SelectItem value="true">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">If yes, won't repeat on renewals</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="stackable">Stackable?</Label>
                          <Select name="stackable" defaultValue="false">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="false">No</SelectItem>
                              <SelectItem value="true">Yes (allow multiple)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select name="status" defaultValue="active">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="disabled">Disabled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </fieldset>

                    {/* Preview */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-2">
                        <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-900">Preview</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            10% off with code WELCOME10 on all eligible plans
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setNewCouponOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        Create Coupon
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Statistics Header */}
            {(coupons?.coupons?.length > 0) && (
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {coupons.coupons.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Coupons</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {coupons.coupons.filter((c: any) => c.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Active</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {coupons.coupons.reduce((sum: number, c: any) => sum + (c.redemptions || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Redemptions</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(coupons.coupons.reduce((sum: number, c: any) => sum + (c.redemptions || 0), 0) / Math.max(coupons.coupons.length, 1))}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Uses Per Coupon</div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Bar */}
            {(coupons?.coupons?.length > 0) && (
              <>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <select 
                      id="f-status" 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                      aria-label="Filter by status"
                      defaultValue="ALL"
                    >
                      <option value="ALL">Status: All</option>
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                      <option value="expired">Expired</option>
                    </select>
                    
                    <select 
                      id="f-type" 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                      aria-label="Filter by type"
                      defaultValue="ALL"
                    >
                      <option value="ALL">Type: All</option>
                      <option value="percent">Percent</option>
                      <option value="fixed">Fixed</option>
                      <option value="trial">Trial</option>
                    </select>
                    
                    <select 
                      id="f-plan" 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                      aria-label="Filter by plan"
                      defaultValue="ALL"
                    >
                      <option value="ALL">Applies to: All</option>
                      <option value="price_free">Free</option>
                      <option value="price_silver_10">Silver</option>
                      <option value="price_gold_20">Gold</option>
                      <option value="price_custom_quote">Custom</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input 
                      id="f-search" 
                      type="search" 
                      placeholder="Search code or value…" 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
                      aria-label="Search coupons"
                    />
                    <Button 
                      id="f-clear" 
                      variant="outline" 
                      size="sm"
                      className="text-sm"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                {/* Bulk Actions Toolbar */}
                <div id="bulk-bar" className="bg-white border border-gray-200 rounded-lg p-3 mb-4 shadow-sm hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span id="bulk-count" className="font-medium text-gray-900">0 selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button id="bulk-enable" variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-50">
                        Enable
                      </Button>
                      <Button id="bulk-disable" variant="outline" size="sm" className="text-red-700 border-red-300 hover:bg-red-50">
                        Disable
                      </Button>
                      <Button id="bulk-archive" variant="outline" size="sm" className="text-orange-700 border-orange-300 hover:bg-orange-50">
                        Archive
                      </Button>
                      <div className="w-px h-5 bg-gray-300 mx-2"></div>
                      <Button id="bulk-export" variant="outline" size="sm">
                        Export CSV
                      </Button>
                      <Button id="bulk-clear" variant="outline" size="sm">
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Coupons Content */}
            {couponsLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                  <span className="ml-2 text-gray-600">Loading coupons...</span>
                </div>
              </div>
            ) : coupons?.coupons?.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-in fade-in duration-300">
                <table className="w-full" id="coupons-table">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 w-[36px]">
                        <input 
                          type="checkbox" 
                          id="select-all" 
                          className="w-4 h-4 cursor-pointer"
                          aria-label="Select all coupons"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Value</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Applies To</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">Usage</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Expiration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 w-[200px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample Data Row 1 */}
                    <tr 
                      className="border-b border-gray-100 hover:bg-blue-50 hover:bg-opacity-30 transition-all duration-200"
                      data-id="c_welcome10"
                      data-status="active"
                      data-type="percent"
                      data-plans="*"
                      data-code="WELCOME10"
                      data-value="10% off"
                    >
                      <td className="py-4 px-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer row-check"
                          aria-label="Select WELCOME10"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                          WELCOME10
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Percent
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">10% off</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">All Plans</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-gray-900">143</span>
                        <span className="text-gray-500 text-sm"> / ∞</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">12/31/2025</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Edit coupon"
                            data-testid="button-edit-coupon"
                          >
                            ✏️
                          </button>
                          <button 
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                            title="Disable coupon"
                            data-testid="button-disable-coupon"
                          >
                            🚫
                          </button>
                          <button 
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Duplicate coupon"
                            data-testid="button-duplicate-coupon"
                          >
                            🧬
                          </button>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Archive coupon"
                            data-testid="button-archive-coupon"
                          >
                            📦
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sample Data Row 2 */}
                    <tr 
                      className="border-b border-gray-100 hover:bg-blue-50 hover:bg-opacity-30 transition-all duration-200"
                      data-id="c_free3mo"
                      data-status="active"
                      data-type="trial"
                      data-plans="price_silver_10,price_gold_20"
                      data-code="FREE3MO"
                      data-value="3 months free"
                    >
                      <td className="py-4 px-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer row-check"
                          aria-label="Select FREE3MO"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                          FREE3MO
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Trial
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">3 months free</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">Gold + Silver</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-gray-900">87</span>
                        <span className="text-gray-500 text-sm"> / 500</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">06/30/2025</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Edit coupon"
                            data-testid="button-edit-coupon-2"
                          >
                            ✏️
                          </button>
                          <button 
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                            title="Disable coupon"
                            data-testid="button-disable-coupon-2"
                          >
                            🚫
                          </button>
                          <button 
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Duplicate coupon"
                            data-testid="button-duplicate-coupon-2"
                          >
                            🧬
                          </button>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Archive coupon"
                            data-testid="button-archive-coupon-2"
                          >
                            📦
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Sample Data Row 3 */}
                    <tr 
                      className="border-b border-gray-100 hover:bg-blue-50 hover:bg-opacity-30 transition-all duration-200"
                      data-id="c_beta2025"
                      data-status="disabled"
                      data-type="fixed"
                      data-plans="price_silver_10"
                      data-code="BETA2025"
                      data-value="$5 off"
                    >
                      <td className="py-4 px-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 cursor-pointer row-check"
                          aria-label="Select BETA2025"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm inline-block">
                          BETA2025
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Fixed
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">$5 off</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">Silver Only</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-gray-900">23</span>
                        <span className="text-gray-500 text-sm"> / ∞</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">—</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Disabled
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                            title="Edit coupon"
                            data-testid="button-edit-coupon-3"
                          >
                            ✏️
                          </button>
                          <button 
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Enable coupon"
                            data-testid="button-enable-coupon-3"
                          >
                            ✅
                          </button>
                          <button 
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                            title="Duplicate coupon"
                            data-testid="button-duplicate-coupon-3"
                          >
                            🧬
                          </button>
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                            title="Archive coupon"
                            data-testid="button-archive-coupon-3"
                          >
                            📦
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                  Showing 3 coupons
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Ticket className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Coupons Yet</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Coupons let you offer discounts on subscription plans. Apply them globally or restrict to specific plans. 
                    Set fixed or percentage discounts with optional expiration dates.
                  </p>
                  <Dialog open={newCouponOpen} onOpenChange={setNewCouponOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" data-testid="button-create-first-coupon">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Coupon
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'content':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h2>
                <p className="text-gray-600">Manage articles, announcements, and CMS content</p>
              </div>
              {(articles?.articles?.length || 0) > 0 && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setNewArticleOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-600"
                    data-testid="button-create-article"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Article
                  </Button>
                </div>
              )}
            </div>

            {(articles?.articles?.length || 0) > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden fade-in">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Select defaultValue="ALL">
                        <SelectTrigger className="w-[140px] bg-[#1E232A] text-white border-[#2B313A] hover:bg-[#374151] hover:text-white hover:border-[#4B5563] focus:bg-[#374151] focus:text-white" data-testid="filter-tenant">
                          <SelectValue placeholder="Tenant" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A] shadow-lg">
                          <SelectItem value="ALL" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">All Tenants</SelectItem>
                          <SelectItem value="PUBLIC" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Public</SelectItem>
                          <SelectItem value="FAMILY" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Family</SelectItem>
                          <SelectItem value="STAFF" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="ALL">
                        <SelectTrigger className="w-[180px] bg-[#1E232A] text-white border-[#2B313A] hover:bg-[#374151] hover:text-white hover:border-[#4B5563] focus:bg-[#374151] focus:text-white" data-testid="filter-menu-category">
                          <SelectValue placeholder="Menu Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A] shadow-lg">
                          <SelectItem value="ALL" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">All Menu Categories</SelectItem>
                          <SelectItem value="no-category" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">No Menu Category</SelectItem>
                          <SelectItem value="Child Information" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Child Information</SelectItem>
                          <SelectItem value="Disaster Planning" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Disaster Planning</SelectItem>
                          <SelectItem value="Elderly Parents" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Elderly Parents</SelectItem>
                          <SelectItem value="Estate Planning" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Estate Planning</SelectItem>
                          <SelectItem value="Getting Married" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Getting Married</SelectItem>
                          <SelectItem value="Home Buying" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Home Buying</SelectItem>
                          <SelectItem value="International Travel" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">International Travel</SelectItem>
                          <SelectItem value="Starting a Family" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Starting a Family</SelectItem>
                          <SelectItem value="Moving" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Moving</SelectItem>
                          <SelectItem value="When Someone Dies" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">When Someone Dies</SelectItem>
                          <SelectItem value="Digital Security" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Digital Security</SelectItem>
                          <SelectItem value="Neurodiversity" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Neurodiversity</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[160px] bg-[#1E232A] text-white border-[#2B313A] hover:bg-[#374151] hover:text-white hover:border-[#4B5563] focus:bg-[#374151] focus:text-white" data-testid="filter-category">
                          <SelectValue placeholder="Content Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A] shadow-lg">
                          <SelectItem value="all" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">All Types</SelectItem>
                          <SelectItem value="announcements" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Announcements</SelectItem>
                          <SelectItem value="support" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Support</SelectItem>
                          <SelectItem value="onboarding" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Onboarding</SelectItem>
                          <SelectItem value="blog" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Blog</SelectItem>
                          <SelectItem value="other" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[130px] bg-[#1E232A] text-white border-[#2B313A] hover:bg-[#374151] hover:text-white hover:border-[#4B5563] focus:bg-[#374151] focus:text-white" data-testid="filter-status">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0F141A] border-[#2B313A] shadow-lg">
                          <SelectItem value="all" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">All Status</SelectItem>
                          <SelectItem value="published" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Published</SelectItem>
                          <SelectItem value="draft" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Draft</SelectItem>
                          <SelectItem value="scheduled" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Scheduled</SelectItem>
                          <SelectItem value="archived" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input 
                          placeholder="Search articles..." 
                          className="pl-10 w-64"
                          data-testid="input-search-articles"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bulk Actions Toolbar */}
                {selectedArticles.size > 0 && (
                  <div className="mx-6 my-4 flex items-center justify-between gap-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-blue-900" data-testid="text-bulk-count">
                        {selectedArticles.size} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBulkPublish}
                        className="text-green-700 hover:bg-green-100"
                        data-testid="button-bulk-publish"
                      >
                        Publish
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBulkUnpublish}
                        className="text-gray-700 hover:bg-gray-100"
                        data-testid="button-bulk-unpublish"
                      >
                        Unpublish
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBulkArchive}
                        className="text-red-700 hover:bg-red-100"
                        data-testid="button-bulk-archive"
                      >
                        Archive
                      </Button>
                      <div className="w-px h-5 bg-gray-300" />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBulkExport}
                        className="text-blue-700 hover:bg-blue-100"
                        data-testid="button-bulk-export"
                      >
                        Export CSV
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearSelection}
                        className="text-gray-500 hover:bg-gray-100"
                        data-testid="button-bulk-clear"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={isSelectAllChecked}
                            onChange={toggleSelectAll}
                            data-testid="checkbox-select-all" 
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {articles.articles.map((article: any) => (
                        <tr 
                          key={article.id} 
                          className={`hover:bg-[#F9FAFB] transition-colors duration-150 ${
                            selectedArticles.has(article.id) ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              checked={selectedArticles.has(article.id)}
                              onChange={() => toggleArticleSelection(article.id)}
                              data-testid={`checkbox-article-${article.id}`} 
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900" data-testid={`text-article-title-${article.id}`}>
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs" data-testid={`text-article-slug-${article.id}`}>
                              {article.slug}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant="secondary" 
                              className="bg-gray-100 text-gray-700"
                              data-testid={`badge-menu-category-${article.id}`}
                            >
                              {article.menuCategory || '—'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={article.tenant === 'PUBLIC' ? 'default' : article.tenant === 'FAMILY' ? 'secondary' : 'outline'}
                              className={article.tenant === 'PUBLIC' ? 'bg-blue-100 text-blue-700' : article.tenant === 'FAMILY' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}
                              data-testid={`badge-tenant-${article.id}`}
                            >
                              {article.tenant === 'PUBLIC' ? 'Public' : article.tenant === 'FAMILY' ? 'Family' : 'Staff'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" data-testid={`text-author-${article.id}`}>
                            {article.authorName || 'Admin'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`text-published-${article.id}`}>
                            {article.publishAt ? new Date(article.publishAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant="secondary"
                              className={
                                article.status === 'published' ? 'bg-green-100 text-green-700' :
                                article.status === 'scheduled' ? 'bg-amber-100 text-amber-700' :
                                article.status === 'draft' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }
                              data-testid={`badge-status-${article.id}`}
                            >
                              {article.status === 'published' ? 'Published' :
                               article.status === 'scheduled' ? 'Scheduled' :
                               article.status === 'draft' ? 'Draft' :
                               'Archived'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingArticle(article);
                                  setNewArticleOpen(true);
                                }}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                data-testid={`button-edit-${article.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openPreview(article.id)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                data-testid={`button-preview-${article.id}`}
                                aria-label="Preview article"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                data-testid={`button-delete-${article.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
                  Showing {articles.articles.length} articles
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12">
                <div className="text-center max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Edit3 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Yet</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Create and manage articles, announcements, and support docs for your users and team.
                    <br />
                    Perfect for system updates, knowledge base articles, and blog posts.
                    <br />
                    <span className="text-emerald-600 font-medium">Assign content to menu categories to display directly on familycirclesecure.com.</span>
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Dialog open={newArticleOpen} onOpenChange={setNewArticleOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" data-testid="button-create-first-article">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Article
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                    <Button variant="ghost" className="border border-emerald-200 text-emerald-700 hover:bg-emerald-50" data-testid="button-import-template">
                      Import from Template
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">
                    Need help? See our <button className="text-emerald-600 hover:text-emerald-700 underline">Content Guide</button>
                  </p>
                </div>
              </div>
            )}

            {/* Article Preview Drawer */}
            {drawerOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="drawer-backdrop" 
                  onClick={closeDrawer}
                  data-testid="drawer-backdrop"
                />
                
                {/* Drawer */}
                <aside 
                  className={`drawer ${drawerOpen ? 'open' : ''}`}
                  role="dialog" 
                  aria-modal="true" 
                  aria-labelledby="drawer-title"
                  data-testid="article-drawer"
                >
                  <header className="drawer-header">
                    <div className="drawer-title-wrap">
                      <div className="tenant-badge">
                        {previewArticle?.tenant === 'PUBLIC' ? 'Public' : previewArticle?.tenant === 'FAMILY' ? 'Family' : 'Staff'}
                      </div>
                      <h3 id="drawer-title">Preview</h3>
                      <div className="menu-badge">
                        {previewArticle?.menuCategory || '—'}
                      </div>
                    </div>
                    <button 
                      className="icon-btn" 
                      onClick={closeDrawer}
                      aria-label="Close"
                      data-testid="drawer-close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </header>

                  <div className="drawer-body" tabIndex={0}>
                    {/* Loading State */}
                    {drawerLoading && (
                      <div className="drawer-loading">
                        <div className="spinner" aria-hidden="true"></div>
                        <div>Loading preview…</div>
                      </div>
                    )}

                    {/* Error State */}
                    {drawerError && (
                      <div className="drawer-error">
                        <strong>Unable to load.</strong>
                        <div className="muted">{drawerError}</div>
                      </div>
                    )}

                    {/* Content */}
                    {previewArticle && !drawerLoading && !drawerError && (
                      <article className="drawer-article">
                        <h1 className="drawer-article-title">{previewArticle.title}</h1>
                        <div className="meta">
                          <span className="muted">
                            {previewArticle.authorName ? `By ${previewArticle.authorName}` : '—'}
                          </span>
                          <span>•</span>
                          <span className="muted">
                            {previewArticle.publishAt ? new Date(previewArticle.publishAt).toLocaleDateString() : 'Not published'}
                          </span>
                          <span 
                            className={`badge-status ${previewArticle.status === 'draft' ? 'draft' : previewArticle.status === 'scheduled' ? 'scheduled' : ''}`}
                          >
                            {previewArticle.status === 'published' ? 'Published' :
                             previewArticle.status === 'scheduled' ? 'Scheduled' :
                             previewArticle.status === 'draft' ? 'Draft' : 'Archived'}
                          </span>
                        </div>

                        {previewArticle.featureImage && (
                          <img 
                            className="feature-image" 
                            src={previewArticle.featureImage} 
                            alt=""
                          />
                        )}

                        <div 
                          className="content-html"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHTML(previewArticle.html || '')
                          }}
                        />
                      </article>
                    )}
                  </div>

                  <footer className="drawer-footer">
                    <div className="left">
                      <a 
                        className="btn ghost" 
                        href={`/articles/${previewArticle?.slug}`} 
                        target="_blank" 
                        rel="noopener"
                        data-testid="drawer-view-live"
                      >
                        Open Live
                      </a>
                      <a 
                        className="btn ghost" 
                        href={`/preview/${previewArticle?.id}?token=demo`} 
                        target="_blank" 
                        rel="noopener"
                        data-testid="drawer-view-preview"
                      >
                        Open Preview
                      </a>
                    </div>
                    <div className="right">
                      {previewArticle?.status === 'published' && (
                        <button 
                          className="btn ghost" 
                          onClick={handleDrawerUnpublish}
                          data-testid="drawer-unpublish"
                        >
                          Unpublish
                        </button>
                      )}
                      {(previewArticle?.status === 'draft' || previewArticle?.status === 'scheduled') && (
                        <button 
                          className="btn primary" 
                          onClick={handleDrawerPublish}
                          data-testid="drawer-publish"
                        >
                          Publish
                        </button>
                      )}
                      <button 
                        className="btn ghost"
                        onClick={() => {
                          setEditingArticle(previewArticle);
                          setNewArticleOpen(true);
                          closeDrawer();
                        }}
                        data-testid="drawer-edit"
                      >
                        Edit
                      </button>
                    </div>
                  </footer>
                </aside>
              </>
            )}

            {/* Enhanced Create Article Modal */}
            <Dialog open={newArticleOpen} onOpenChange={(open) => {
              setNewArticleOpen(open);
              if (!open) {
                setEditingArticle(null);
                setArticleTitle('');
                setArticleSlug('');
                setSlugTouched(false);
                setArticleStatus('draft');
                setMarkdownContent('');
                setShowPreview(false);
              }
            }}>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>
                    {editingArticle ? 'Edit Article' : 'Create New Article'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingArticle ? 'Update the article details below.' : 'Create content for your multi-tenant platform.'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto">
                  <form className="space-y-6 p-1">
                    {/* Meta Information Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input 
                          id="title"
                          name="title"
                          placeholder="Welcome to FamilyCircle Secure"
                          value={articleTitle}
                          onChange={(e) => {
                            const title = e.target.value;
                            setArticleTitle(title);
                            // Auto-generate slug if not manually edited
                            if (!slugTouched) {
                              const slug = title.trim().toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '');
                              setArticleSlug(slug);
                            }
                          }}
                          required
                          data-testid="input-article-title"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input 
                          id="slug"
                          name="slug"
                          placeholder="welcome-to-familycircle-secure"
                          value={articleSlug}
                          onChange={(e) => {
                            setArticleSlug(e.target.value);
                            setSlugTouched(true);
                          }}
                          data-testid="input-article-slug"
                        />
                        <p className="text-xs text-gray-500 mt-1">Autofilled from title; change if needed.</p>
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select name="category" defaultValue={editingArticle?.category || 'announcements'}>
                          <SelectTrigger data-testid="select-article-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="announcements">Announcements</SelectItem>
                            <SelectItem value="support">Support</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="blog">Blog</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Menu Category Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="menuCategory">Menu Category</Label>
                        <Select name="menuCategory" defaultValue={editingArticle?.menuCategory || 'no-category'}>
                          <SelectTrigger data-testid="select-article-menu-category">
                            <SelectValue placeholder="Select menu category (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-category">No Menu Category</SelectItem>
                            <SelectItem value="Child Information">Child Information</SelectItem>
                            <SelectItem value="Disaster Planning">Disaster Planning</SelectItem>
                            <SelectItem value="Elderly Parents">Elderly Parents</SelectItem>
                            <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                            <SelectItem value="Getting Married">Getting Married</SelectItem>
                            <SelectItem value="Home Buying">Home Buying</SelectItem>
                            <SelectItem value="International Travel">International Travel</SelectItem>
                            <SelectItem value="Starting a Family">Starting a Family</SelectItem>
                            <SelectItem value="Moving">Moving</SelectItem>
                            <SelectItem value="When Someone Dies">When Someone Dies</SelectItem>
                            <SelectItem value="Digital Security">Digital Security</SelectItem>
                            <SelectItem value="Neurodiversity">Neurodiversity</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Link this article to your website's mega menu navigation.
                        </p>
                      </div>
                      <div className="md:col-span-2"></div>
                    </div>

                    {/* Audience & Status Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="tenant">Audience / Tenant *</Label>
                        <Select name="tenant" defaultValue={editingArticle?.tenant || 'PUBLIC'}>
                          <SelectTrigger data-testid="select-article-tenant">
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PUBLIC">Public (clients)</SelectItem>
                            <SelectItem value="FAMILY">Family portal</SelectItem>
                            <SelectItem value="STAFF">Staff hub</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select 
                          name="status" 
                          value={articleStatus}
                          onValueChange={setArticleStatus}
                        >
                          <SelectTrigger data-testid="select-article-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Publish now</SelectItem>
                            <SelectItem value="scheduled">Schedule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {articleStatus === 'scheduled' && (
                        <div>
                          <Label htmlFor="publishAt">Publish at</Label>
                          <Input 
                            id="publishAt"
                            name="publishAt"
                            type="datetime-local"
                            defaultValue={editingArticle?.publishAt || ''}
                            data-testid="input-publish-at"
                          />
                          <p className="text-xs text-gray-500 mt-1">UTC or convert on server to your timezone.</p>
                        </div>
                      )}
                    </div>

                    {/* Meta Fields Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input 
                          id="tags"
                          name="tags"
                          placeholder="security, onboarding, billing"
                          defaultValue={editingArticle?.tags?.join(', ') || ''}
                          data-testid="input-article-tags"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="image">Feature image (URL)</Label>
                        <Input 
                          id="image"
                          name="image"
                          placeholder="https://..."
                          defaultValue={editingArticle?.image || ''}
                          data-testid="input-article-image"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="seo">SEO Description</Label>
                        <Input 
                          id="seo"
                          name="seo"
                          placeholder="Short summary used in previews and meta tags."
                          maxLength={160}
                          defaultValue={editingArticle?.seo || ''}
                          data-testid="input-article-seo"
                        />
                      </div>
                    </div>

                    {/* Author Field */}
                    <div>
                      <Label htmlFor="author">Author</Label>
                      <Input 
                        id="author"
                        name="author"
                        placeholder="Enter author name"
                        defaultValue={editingArticle?.author || 'Admin'}
                        data-testid="input-article-author"
                      />
                    </div>

                    {/* Content Editor with Preview */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="content">Content *</Label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id="preview-toggle"
                            checked={showPreview}
                            onChange={(e) => setShowPreview(e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor="preview-toggle" className="text-sm cursor-pointer">Live Preview</Label>
                        </div>
                      </div>
                      
                      <div className={`grid gap-4 ${showPreview ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                        <div>
                          <Textarea 
                            id="content"
                            name="content"
                            placeholder="Write in Markdown...\n\n# Getting Started\n- Enable 2FA\n- Invite family\n- Configure backups"
                            className="min-h-[300px] font-mono text-sm"
                            value={markdownContent}
                            onChange={(e) => setMarkdownContent(e.target.value)}
                            required
                            data-testid="textarea-article-content"
                          />
                        </div>
                        
                        {showPreview && (
                          <div>
                            <div className="border border-gray-200 rounded-lg p-4 min-h-[300px] bg-gray-50 overflow-auto">
                              <div 
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: markdownContent
                                    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
                                    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
                                    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
                                    .replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>')
                                    .replace(/(<li>.*<\/li>)(?!\n<li>)/g, '<ul>$1</ul>')
                                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.+?)\*/g, '<em>$1</em>')
                                    .replace(/`([^`]+)`/g, '<code>$1</code>')
                                    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
                                    .replace(/\n{2,}/g, '<br/><br/>') || '<span class="text-gray-400">Preview is empty.</span>'
                                }}
                                data-testid="markdown-preview"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              id="pin"
                              name="pin"
                              defaultChecked={editingArticle?.pin || false}
                              className="rounded"
                              data-testid="checkbox-pin-article"
                            />
                            <span className="text-sm">Pin to top</span>
                          </label>
                          
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              id="allowComments"
                              name="allowComments"
                              defaultChecked={editingArticle?.allowComments || false}
                              className="rounded"
                              data-testid="checkbox-allow-comments"
                            />
                            <span className="text-sm">Allow comments (PUBLIC only)</span>
                          </label>
                        </div>
                        
                        {/* Audience Preview Buttons */}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            data-testid="preview-public"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Public
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            data-testid="preview-family"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Family
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50"
                            data-testid="preview-staff"
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Staff
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setNewArticleOpen(false);
                          setEditingArticle(null);
                        }}
                        data-testid="button-cancel-article"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-600"
                        data-testid="button-save-article"
                      >
                        {editingArticle ? 'Update Article' : 'Save Article'}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      
      case 'feature-flags':
        return (
          <div className="space-y-6">
            <EnhancedFeatureFlags />
          </div>
        );
      
      case 'advanced-feature-flags':
        return (
          <div className="space-y-6">
            <AdvancedFeatureFlags />
          </div>
        );

      case 'webhooks':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Webhooks Management</h2>
            </div>
            <WebhooksManager />
          </div>
        );
      
      case 'advanced-webhooks':
        return (
          <div className="space-y-6">
            <AdvancedWebhooks />
          </div>
        );
      
      case 'tamper-audit':
        return (
          <div className="space-y-6">
            <TamperEvidentAudit />
          </div>
        );
      
      case 'advanced-coupons':
        return (
          <div className="space-y-6">
            <AdvancedCoupons />
          </div>
        );
      case 'marketing-promotions':
        return (
          <div className="space-y-6">
            <MarketingPromotions />
          </div>
        );
      
      case 'impersonation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Admin Impersonation</h2>
            </div>
            <ImpersonationManager />
          </div>
        );
      
      case 'compliance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">GDPR Compliance</h2>
            </div>
            <GdprCompliance />
          </div>
        );

      case 'gdpr':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">GDPR Compliance</h2>
            </div>
            <GdprCompliance />
          </div>
        );
      
      case 'security':
        return (
          <div id="security-root" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="section-header page-title text-2xl font-bold">Security & Audit</h2>
            </div>
            
            {/* Security Posture Summary */}
            <SecurityPostureSummary />
            
            {/* Tamper-Evident Chain Verification */}
            <TamperVerification />
            
            {/* Session Management */}
            <SessionManagement />
            
            {/* Recent Audit Logs */}
            <div className="card">
              <div className="card-header">
                <h3 style={{margin: 0}}>Recent Audit Logs</h3>
                <button 
                  id="audit-refresh" 
                  className="btn"
                  onClick={() => {
                    // Refetch audit logs
                    queryClient.invalidateQueries({ queryKey: ['/api/admin/audit'] });
                  }}
                >
                  Refresh
                </button>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Actor</th>
                    <th>Event</th>
                    <th>Resource</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs?.logs?.map((log: any, index: number) => (
                    <tr key={index}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.admin?.username || '-'}</td>
                      <td>{log.action}</td>
                      <td>{log.targetType || '-'}</td>
                      <td>ok</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={5} style={{textAlign: 'center', padding: '24px'}}>
                        No audit logs yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <p>Section not found</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <ToastHost>
      <StatusWatcher />
      <AdminLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {renderSectionContent()}
      </AdminLayout>
      
      {/* Plan Modal - Global */}
      {planModalOpen && (
        <div className="modal-backdrop" onClick={(e) => {
          if (e.target === e.currentTarget) setPlanModalOpen(false);
        }}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="planTitle">
            <header className="modal-header">
              <h3 id="planTitle">{editingPlan ? 'Edit Plan' : 'Create Subscription Plan'}</h3>
              <button 
                className="icon-btn" 
                onClick={() => setPlanModalOpen(false)}
                aria-label="Close"
                data-testid="button-close-plan-modal"
              >
                ✖
              </button>
            </header>

            <form 
              id="plan-form" 
              onSubmit={handlePlanSubmit}
              className="space-y-4"
            >
              {/* Tenant & Status Row */}
              <div className="grid-2">
                <div className="field">
                  <label htmlFor="tenant">Audience / Tenant</label>
                  <select 
                    name="tenant" 
                    id="tenant" 
                    defaultValue="PUBLIC"
                    onChange={updateBillingVisibility}
                    data-testid="select-tenant"
                    required
                  >
                    <option value="PUBLIC">Client (Public)</option>
                    <option value="FAMILY" data-nobilling="true">Family (no billing)</option>
                    <option value="STAFF" data-nobilling="true">Staff (no billing)</option>
                  </select>
                  <small className="hint">Billing is available only for Client/Public plans.</small>
                </div>

                <div className="field">
                  <label htmlFor="status">Status</label>
                  <select 
                    name="status" 
                    id="status"
                    defaultValue="active"
                    data-testid="select-status"
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Plan Name & Slug Row */}
              <div className="grid-2">
                <div className="field">
                  <label htmlFor="name">Plan Name</label>
                  <input 
                    name="name" 
                    id="name" 
                    placeholder="Gold" 
                    onChange={handleNameChange}
                    data-testid="input-plan-name"
                    required 
                  />
                </div>
                <div className="field">
                  <label htmlFor="slug">Slug (internal)</label>
                  <input 
                    name="slug" 
                    id="slug" 
                    placeholder="gold"
                    data-testid="input-plan-slug"
                  />
                  <small className="hint">No spaces; used in URLs & internal references.</small>
                </div>
              </div>

              {/* Description */}
              <div className="field">
                <label htmlFor="description">Short Description</label>
                <input 
                  name="description" 
                  id="description" 
                  placeholder="Total peace of mind for your family & business"
                  data-testid="input-plan-description"
                />
              </div>

              {/* Billing Block */}
              <fieldset id="billing-block">
                <legend>Billing</legend>

                <div className="grid-3">
                  <div className="field">
                    <label htmlFor="pricing_type">Pricing Type</label>
                    <select 
                      name="pricing_type" 
                      id="pricing_type"
                      defaultValue="fixed"
                      onChange={updateBillingVisibility}
                      data-testid="select-pricing-type"
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="custom">Custom / By Quote</option>
                      <option value="free">Free</option>
                    </select>
                  </div>

                  <div className="field billable-only">
                    <label htmlFor="amount">Price (USD)</label>
                    <input 
                      name="amount" 
                      id="amount" 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      placeholder="20.00"
                      data-testid="input-plan-amount"
                    />
                  </div>

                  <div className="field billable-only">
                    <label htmlFor="interval">Interval</label>
                    <select 
                      name="interval" 
                      id="interval"
                      defaultValue="month"
                      data-testid="select-interval"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3 billable-only">
                  <div className="field">
                    <label htmlFor="billing_scheme">Collect Annually?</label>
                    <select 
                      name="billing_scheme" 
                      id="billing_scheme"
                      defaultValue="pay_per_interval"
                      data-testid="select-billing-scheme"
                    >
                      <option value="pay_per_interval">Charge each interval</option>
                      <option value="annual_prepay">Annual prepay (per-month price shown)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="trial_days">Trial Days</label>
                    <input 
                      name="trial_days" 
                      id="trial_days" 
                      type="number" 
                      min="0" 
                      placeholder="0"
                      data-testid="input-trial-days"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="tax_behavior">Tax Behavior</label>
                    <select 
                      name="tax_behavior" 
                      id="tax_behavior"
                      defaultValue="unspecified"
                      data-testid="select-tax-behavior"
                    >
                      <option value="unspecified">Unspecified</option>
                      <option value="inclusive">Tax inclusive</option>
                      <option value="exclusive">Tax exclusive</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2 billable-only">
                  <div className="field">
                    <label htmlFor="stripe_product_id">Stripe Product ID</label>
                    <input 
                      name="stripe_product_id" 
                      id="stripe_product_id" 
                      placeholder="prod_..."
                      data-testid="input-stripe-product-id"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="stripe_price_id">Stripe Price ID</label>
                    <input 
                      name="stripe_price_id" 
                      id="stripe_price_id" 
                      placeholder="price_..."
                      data-testid="input-stripe-price-id"
                    />
                    <small className="hint">Leave blank to auto-create in Stripe on Save.</small>
                  </div>
                </div>
              </fieldset>

              {/* Features */}
              <fieldset>
                <legend>Features</legend>
                <div id="features" onClick={(e) => {
                  if ((e.target as HTMLElement).closest('.remove-feature')) {
                    const row = (e.target as HTMLElement).closest('.feature-row');
                    row?.remove();
                  }
                }}>
                  <div className="feature-row">
                    <input 
                      name="features[]" 
                      placeholder="Advanced security & privacy"
                      data-testid="input-feature-0"
                    />
                    <button 
                      type="button" 
                      className="icon-btn remove-feature" 
                      aria-label="Remove feature"
                      data-testid="button-remove-feature-0"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn ghost" 
                  onClick={addFeature}
                  data-testid="button-add-feature"
                >
                  + Add Feature
                </button>
              </fieldset>

              {/* Visibility & Display */}
              <div className="grid-3">
                <div className="field">
                  <label htmlFor="visibility">Visibility</label>
                  <select 
                    name="visibility" 
                    id="visibility"
                    defaultValue="public"
                    data-testid="select-visibility"
                  >
                    <option value="public">Public (marketing page + checkout)</option>
                    <option value="internal">Internal only (hidden)</option>
                    <option value="invite">Invite-only</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="sort">Sort Order</label>
                  <input 
                    name="sort" 
                    id="sort" 
                    type="number" 
                    min="0" 
                    defaultValue="2"
                    data-testid="input-sort-order"
                  />
                </div>
                <div className="field">
                  <label htmlFor="badge">Badge (optional)</label>
                  <input 
                    name="badge" 
                    id="badge" 
                    placeholder="Popular"
                    data-testid="input-badge"
                  />
                </div>
              </div>

              <footer className="modal-footer">
                <button 
                  type="button" 
                  className="btn ghost" 
                  onClick={() => setPlanModalOpen(false)}
                  data-testid="button-cancel-plan"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn primary"
                  data-testid="button-save-plan"
                >
                  Save Plan
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </ToastHost>
  );
}