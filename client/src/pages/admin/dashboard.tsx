import { useState } from 'react';
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
            PUBLIC: "bg-[#007BFF] text-white",
            FAMILY: "bg-purple-600 text-white", 
            STAFF: "bg-[#28A745] text-white"
          };
          const labels = {
            PUBLIC: "Public",
            FAMILY: "Family",
            STAFF: "Staff"
          };
          return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[tenant as keyof typeof styles] || styles.PUBLIC}`}>
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
            Active: { color: "text-[#28A745]", icon: "✅", bg: "bg-green-100" },
            Pending: { color: "text-[#FFC107]", icon: "⏳", bg: "bg-yellow-100" },
            Suspended: { color: "text-[#DC3545]", icon: "🚫", bg: "bg-red-100" }
          };
          const config = styles[status as keyof typeof styles] || styles.Active;
          return (
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
              {config.icon} {status}
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
                      style={{
                        background: '#1E232A',
                        color: '#E8EEF7',
                        borderColor: '#2B313A'
                      }}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="All Tenants" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0F141A] border-[#2B313A] shadow-lg">
                      <SelectItem value="all" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">All Tenants</SelectItem>
                      <SelectItem value="PUBLIC" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Public Clients</SelectItem>
                      <SelectItem value="FAMILY" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Family Portal</SelectItem>
                      <SelectItem value="STAFF" className="text-[#D5DDE7] hover:bg-[#1E2A3A] hover:text-white focus:bg-[#1E2A3A] focus:text-white">Staff Hub</SelectItem>
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
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MFA</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {sampleUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-[#f6f8fa] transition-colors duration-150 group">
                        {/* Name with Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            className="text-sm text-[#007BFF] hover:text-[#0056d6] hover:underline flex items-center gap-1 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(user.email);
                              toast({ title: 'Email copied to clipboard!' });
                            }}
                            data-testid={`button-copy-email-${user.id}`}
                          >
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </button>
                        </td>
                        
                        {/* Tenant Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div data-testid={`badge-tenant-${user.id}`}>
                            {getTenantBadge(user.tenant)}
                          </div>
                        </td>
                        
                        {/* Role Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div data-testid={`badge-role-${user.id}`}>
                            {getRoleBadge(user.role, user.tenant)}
                          </div>
                        </td>
                        
                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div data-testid={`status-${user.id}`}>
                            {getStatusIndicator(user.status)}
                          </div>
                        </td>
                        
                        {/* MFA Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div data-testid={`mfa-status-${user.id}`}>
                            {user.mfaEnabled ? (
                              <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                                ✓ Enabled
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
                                ⚠ Disabled
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-[#007BFF] hover:text-white transition-colors"
                              data-testid={`button-edit-${user.id}`}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            
                            {user.status === 'Suspended' ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-[#28A745] hover:text-white transition-colors"
                                data-testid={`button-reactivate-${user.id}`}
                              >
                                <Power className="w-3 h-3" />
                              </Button>
                            ) : user.status === 'Pending' ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-[#FFC107] hover:text-white transition-colors"
                                data-testid={`button-resend-${user.id}`}
                              >
                                <RotateCcw className="w-3 h-3" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 hover:bg-[#DC3545] hover:text-white transition-colors"
                                data-testid={`button-suspend-${user.id}`}
                              >
                                <Power className="w-3 h-3" />
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-[#DC3545] hover:text-white transition-colors"
                              data-testid={`button-remove-${user.id}`}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                      {user.email}
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
                Showing {sampleUsers.length} users
              </div>
            </CardContent>
          </Card>
        );
      
      case 'plans':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Manage pricing and subscription options</CardDescription>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <p>Loading plans...</p>
              ) : plans?.plans?.length > 0 ? (
                <div className="space-y-4">
                  {plans.plans.map((plan: any) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-muted-foreground">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${plan.price}</p>
                          <p className="text-muted-foreground text-sm">{plan.interval}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Plans Configured</h3>
                  <p className="text-muted-foreground">Set up Stripe integration to manage subscription plans</p>
                </div>
              )}
            </CardContent>
          </Card>
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
    </ToastHost>
  );
}