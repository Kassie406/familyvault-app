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
  TrendingUp, BarChart3, PieChart, Server, ShieldCheck 
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
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
          <Users className="h-5 w-5 text-blue-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">1,247</div>
          <div className="flex items-center text-xs text-blue-100 mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            +12% from last month
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-100">Active Plans</CardTitle>
          <CreditCard className="h-5 w-5 text-green-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{plans?.plans?.length || 3}</div>
          <div className="flex items-center text-xs text-green-100 mt-1">
            <BarChart3 className="w-3 h-3 mr-1" />
            All plans operational
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-100">Active Coupons</CardTitle>
          <Ticket className="h-5 w-5 text-purple-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{coupons?.coupons?.length || 8}</div>
          <div className="flex items-center text-xs text-purple-100 mt-1">
            <PieChart className="w-3 h-3 mr-1" />
            85% redemption rate
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-100">Content Articles</CardTitle>
          <FileText className="h-5 w-5 text-orange-200" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{articles?.articles?.length || 24}</div>
          <div className="flex items-center text-xs text-orange-100 mt-1">
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
                    className="w-full justify-start"
                    onClick={() => setActiveSection('coupons')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Coupon
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveSection('users')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
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
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Users Yet</h3>
                <p className="text-muted-foreground">Users will appear here once they register</p>
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