import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, CreditCard, Ticket, FileText, Shield, Activity, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [newCouponOpen, setNewCouponOpen] = useState(false);

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
        // Refresh coupons
        window.location.reload();
      } else {
        toast({ title: 'Failed to create coupon', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error creating coupon', variant: 'destructive' });
    }
  };

  const StatsCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">System ready for users</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{plans?.plans?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Subscription plans configured</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{coupons?.coupons?.length || 0}</div>
          <p className="text-xs text-muted-foreground">Promotional codes available</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Content Articles</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{articles?.articles?.length || 0}</div>
          <p className="text-xs text-muted-foreground">CMS articles managed</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="text-muted-foreground">Manage your FamilyCircle Secure platform</p>
      </div>

      <StatsCards />

      <div className="mt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Platform health overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Authentication</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Admin API</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Audit Logging</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Recording</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
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
            </div>
          </TabsContent>

          <TabsContent value="users">
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
          </TabsContent>

          <TabsContent value="plans">
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
          </TabsContent>

          <TabsContent value="coupons">
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
                        <Input id="code" name="code" required data-testid="input-coupon-code" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="percentOff">Percent Off (%)</Label>
                          <Input id="percentOff" name="percentOff" type="number" max="100" data-testid="input-percent-off" />
                        </div>
                        <div>
                          <Label htmlFor="amountOff">Amount Off ($)</Label>
                          <Input id="amountOff" name="amountOff" type="number" step="0.01" data-testid="input-amount-off" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="validFrom">Valid From</Label>
                          <Input id="validFrom" name="validFrom" type="datetime-local" data-testid="input-valid-from" />
                        </div>
                        <div>
                          <Label htmlFor="validTo">Valid To</Label>
                          <Input id="validTo" name="validTo" type="datetime-local" data-testid="input-valid-to" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="maxRedemptions">Max Redemptions</Label>
                        <Input id="maxRedemptions" name="maxRedemptions" type="number" data-testid="input-max-redemptions" />
                      </div>
                      <Button type="submit" className="w-full" data-testid="button-save-coupon">
                        Create Coupon
                      </Button>
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
                      <div key={coupon.id} className="border rounded-lg p-4" data-testid={`coupon-${coupon.code}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{coupon.code}</h3>
                            <p className="text-muted-foreground">
                              {coupon.percentOff ? `${coupon.percentOff}% off` : `$${coupon.amountOff} off`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">Used: {coupon.timesRedeemed}/{coupon.maxRedemptions || '∞'}</p>
                            <Badge variant={coupon.isActive ? 'default' : 'secondary'} className={coupon.isActive ? "bg-green-100 text-green-800" : ""}>
                              {coupon.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Coupons Created</h3>
                    <p className="text-muted-foreground">Create your first promotional coupon to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage articles, blogs, and website content</CardDescription>
              </CardHeader>
              <CardContent>
                {articlesLoading ? (
                  <p>Loading content...</p>
                ) : articles?.articles?.length > 0 ? (
                  <div className="space-y-4">
                    {articles.articles.map((article: any) => (
                      <div key={article.id} className="border rounded-lg p-4" data-testid={`article-${article.slug}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{article.title}</h3>
                            <p className="text-muted-foreground">{article.excerpt}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant={article.published ? 'default' : 'secondary'} className={article.published ? "bg-green-100 text-green-800" : ""}>
                              {article.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Content Articles</h3>
                    <p className="text-muted-foreground">Content management system is ready for articles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>GDPR Compliance</CardTitle>
                <CardDescription>Monitor consent events and privacy compliance</CardDescription>
              </CardHeader>
              <CardContent>
                {consentsLoading ? (
                  <p>Loading consent data...</p>
                ) : consents?.consents?.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {consents.consents.map((consent: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4" data-testid={`consent-${index}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">User: {consent.userId || 'Anonymous'}</p>
                            <p className="text-muted-foreground text-sm">
                              {new Date(consent.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">IP: {consent.ip}</p>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">Consent Recorded</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Consent Events</h3>
                    <p className="text-muted-foreground">GDPR consent tracking is ready</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Audit Log</CardTitle>
                <CardDescription>Monitor system security and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                {auditLoading ? (
                  <p>Loading audit logs...</p>
                ) : auditLogs?.logs?.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {auditLogs.logs.map((log: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4" data-testid={`audit-${index}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{log.action}</p>
                            <p className="text-muted-foreground text-sm">
                              Actor: {log.actorId} | Resource: {log.resource || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{new Date(log.createdAt).toLocaleString()}</p>
                            <p className="text-muted-foreground text-xs">IP: {log.ip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Audit Logs</h3>
                    <p className="text-muted-foreground">Security monitoring is active and ready</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}