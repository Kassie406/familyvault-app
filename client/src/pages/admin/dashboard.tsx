import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, CreditCard, Ticket, FileText, Shield, Activity, Plus, Eye, Edit, Trash2, 
  TrendingUp, BarChart3, PieChart, Server, ShieldCheck, Search, UserPlus, 
  MoreHorizontal, Mail, Power, RotateCcw, X, Filter
} from 'lucide-react';
import AdminLayout from '@/components/admin/admin-layout';
import SecurityCenterCard from '@/components/admin/security-center-card';
import SessionManagement from '@/components/admin/session-management';
import TamperVerification from '@/components/admin/tamper-verification';
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const [newCouponOpen, setNewCouponOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [planScope, setPlanScope] = useState('PUBLIC');
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

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
    queryFn: () => fetch('/api/admin/articles').then(res => res.json()),
  });

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
        
        billableElements.forEach((element: HTMLElement) => {
          const inputs = element.querySelectorAll('input, select');
          if (isBillable) {
            element.style.opacity = '1';
            inputs.forEach((input: HTMLInputElement | HTMLSelectElement) => {
              input.disabled = false;
            });
          } else {
            element.style.opacity = '0.5';
            inputs.forEach((input: HTMLInputElement | HTMLSelectElement) => {
              input.disabled = true;
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

  const EnhancedStatsCards = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-[#007BFF] text-white">
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
      
      <Card className="bg-[#28A745] text-white">
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
      
      <Card className="bg-[#6C757D] text-white">
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
      
      <Card className="bg-[#FFC107] text-black">
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
            
            <SecurityCenterCard />
            
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
                    onClick={() => setActiveSection('coupons')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Coupon
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors"
                    onClick={() => setActiveSection('users')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-[#1F6FEB] hover:text-white hover:border-[#1F6FEB] transition-colors"
                    onClick={() => setActiveSection('security')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security Audit
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
                  <Select defaultValue="all">
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
                        All Tenants <span className="text-gray-400 ml-1">(6)</span>
                      </SelectItem>
                      <SelectItem value="PUBLIC" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio">
                        Public Clients <span className="text-gray-400 ml-1">(2)</span>
                      </SelectItem>
                      <SelectItem value="FAMILY" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio">
                        Family Portal <span className="text-gray-400 ml-1">(2)</span>
                      </SelectItem>
                      <SelectItem value="STAFF" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white" role="menuitemradio">
                        Staff Hub <span className="text-gray-400 ml-1">(2)</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#007BFF] focus:border-transparent outline-none w-full sm:w-64"
                      data-testid="input-user-search"
                    />
                  </div>
                  
                  {/* Invite User Button */}
                  <Button 
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
                    {sampleUsers.map((user: any) => (
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
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        data-testid={`mobile-button-edit-${user.id}`}
                      >
                        <Edit className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      <Button 
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
        );
      
      case 'plans':
        return (
          <div className="plans-section">
            {/* Plans Header */}
            <div className="plans-header">
              <h2 className="text-2xl font-bold">Subscription Plans</h2>
              
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
                    <td>128</td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td className="mono">price_free</td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button aria-label="Edit plan" data-tip="Edit" data-testid="button-edit-free">✏️</button>
                        <button aria-label="Duplicate plan" data-tip="Duplicate" data-testid="button-duplicate-free">🧬</button>
                        <button aria-label="Archive plan" data-tip="Archive" data-testid="button-archive-free">📦</button>
                        <button aria-label="Open in Stripe" data-tip="Open in Stripe" data-testid="button-stripe-free">🔗</button>
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
                    <td>43</td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td className="mono">price_silver_10</td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button aria-label="Edit plan" data-tip="Edit" data-testid="button-edit-silver">✏️</button>
                        <button aria-label="Duplicate plan" data-tip="Duplicate" data-testid="button-duplicate-silver">🧬</button>
                        <button aria-label="Archive plan" data-tip="Archive" data-testid="button-archive-silver">📦</button>
                        <button aria-label="Open in Stripe" data-tip="Open in Stripe" data-testid="button-stripe-silver">🔗</button>
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
                    <td>25</td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td className="mono">price_gold_20</td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button aria-label="Edit plan" data-tip="Edit" data-testid="button-edit-gold">✏️</button>
                        <button aria-label="Duplicate plan" data-tip="Duplicate" data-testid="button-duplicate-gold">🧬</button>
                        <button aria-label="Archive plan" data-tip="Archive" data-testid="button-archive-gold">📦</button>
                        <button aria-label="Open in Stripe" data-tip="Open in Stripe" data-testid="button-stripe-gold">🔗</button>
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
                    <td>8</td>
                    <td><span className="badge badge-status-active">Active</span></td>
                    <td className="mono">price_custom_quote</td>
                    <td className="col-actions">
                      <div className="row-actions" role="group" aria-label="Plan actions">
                        <button aria-label="Edit plan" data-tip="Edit" data-testid="button-edit-custom">✏️</button>
                        <button aria-label="Duplicate plan" data-tip="Duplicate" data-testid="button-duplicate-custom">🧬</button>
                        <button aria-label="Archive plan" data-tip="Archive" data-testid="button-archive-custom">📦</button>
                        <button aria-label="Open in Stripe" data-tip="Open in Stripe" data-testid="button-stripe-custom">🔗</button>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Coupon Management</CardTitle>
                <CardDescription>Create and manage promotional codes</CardDescription>
              </div>
              <Dialog open={newCouponOpen} onOpenChange={setNewCouponOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-coupon">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Coupon
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateCoupon} className="space-y-4">
                    <div>
                      <Label htmlFor="code">Coupon Code</Label>
                      <Input id="code" name="code" placeholder="SAVE20" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="percentOff">Percent Off</Label>
                        <Input id="percentOff" name="percentOff" type="number" placeholder="20" />
                      </div>
                      <div>
                        <Label htmlFor="amountOff">Amount Off ($)</Label>
                        <Input id="amountOff" name="amountOff" type="number" placeholder="10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="validFrom">Valid From</Label>
                        <Input id="validFrom" name="validFrom" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="validTo">Valid To</Label>
                        <Input id="validTo" name="validTo" type="date" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="maxRedemptions">Max Redemptions</Label>
                      <Input id="maxRedemptions" name="maxRedemptions" type="number" placeholder="100" />
                    </div>
                    <Button type="submit" className="w-full">Create Coupon</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {couponsLoading ? (
                <p>Loading coupons...</p>
              ) : coupons?.coupons?.length > 0 ? (
                <div className="space-y-4">
                  {coupons.coupons.map((coupon: any) => (
                    <div key={coupon.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{coupon.code}</h3>
                          <p className="text-muted-foreground">
                            {coupon.percentOff ? `${coupon.percentOff}% off` : `$${coupon.amountOff} off`}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Coupons Yet</h3>
                  <p className="text-muted-foreground">Create your first promotional coupon</p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      
      case 'content':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage articles and CMS content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Content Management</h3>
                <p className="text-muted-foreground">Manage your website content and articles</p>
              </div>
            </CardContent>
          </Card>
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
              <h2 className="text-2xl font-bold">Admin Impersonation</h2>
            </div>
            <ImpersonationManager />
          </div>
        );
      
      case 'compliance':
        return (
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance</CardTitle>
              <CardDescription>Privacy settings and data management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">GDPR Compliance</h3>
                <p className="text-muted-foreground">Manage privacy consents and data requests</p>
              </div>
            </CardContent>
          </Card>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Security & Audit</h2>
            </div>
            
            {/* Tamper-Evident Chain Verification */}
            <TamperVerification />
            
            {/* Session Management */}
            <SessionManagement />
            
            {/* Legacy Audit Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Logs</CardTitle>
                <CardDescription>Monitor system security and admin actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs?.logs?.map((log: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{log.action}</p>
                          <p className="text-muted-foreground text-sm">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {log.action === 'login' ? 'Authentication' : 'System'}
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-12">
                      <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No Audit Logs</h3>
                      <p className="text-muted-foreground">Security events will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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