import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Ticket, 
  Plus, 
  Settings, 
  TrendingUp, 
  Calendar,
  Target,
  Percent,
  DollarSign,
  Clock,
  Users,
  Shield,
  Archive,
  TestTube
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  type: z.enum(['percent', 'amount', 'free_trial_days']),
  value: z.number().min(0, 'Value must be positive'),
  currency: z.string().optional(),
  max_redemptions: z.number().optional(),
  per_user_limit: z.number().min(1).default(1),
  allow_stacking: z.boolean().default(false),
  min_subtotal_cents: z.number().optional(),
  allowed_plan_ids: z.array(z.string()).optional(),
  denied_plan_ids: z.array(z.string()).optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  is_recurring: z.boolean().default(false),
  reason: z.string().optional(),
});

const evaluationSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
  planId: z.string().optional(),
  subtotalCents: z.number().min(0).optional(),
  userId: z.string().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;
type EvaluationFormData = z.infer<typeof evaluationSchema>;

interface CouponV2 {
  id: string;
  code: string;
  campaign_id?: string;
  type: 'percent' | 'amount' | 'free_trial_days';
  value: number;
  currency?: string;
  max_redemptions?: number;
  per_user_limit: number;
  allow_stacking: boolean;
  min_subtotal_cents?: number;
  allowed_plan_ids?: string[];
  denied_plan_ids?: string[];
  starts_at?: string;
  ends_at?: string;
  is_recurring: boolean;
  metadata?: any;
  archived: boolean;
  redemption_count?: number;
  created_at: string;
}

function CouponCard({ coupon, onEdit, onArchive }: { 
  coupon: CouponV2; 
  onEdit: (coupon: CouponV2) => void; 
  onArchive: (id: string) => void; 
}) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percent': return <Percent className="h-4 w-4" />;
      case 'amount': return <DollarSign className="h-4 w-4" />;
      case 'free_trial_days': return <Calendar className="h-4 w-4" />;
      default: return <Ticket className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'amount': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'free_trial_days': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatValue = (coupon: CouponV2) => {
    switch (coupon.type) {
      case 'percent': return `${coupon.value}%`;
      case 'amount': return `$${coupon.value}`;
      case 'free_trial_days': return `${coupon.value} days`;
      default: return coupon.value;
    }
  };

  return (
    <Card className="relative" data-testid={`coupon-card-${coupon.id}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getTypeColor(coupon.type)} data-testid="badge-coupon-type">
              {getTypeIcon(coupon.type)}
              <span className="ml-1">{coupon.type}</span>
            </Badge>
            <Badge variant="outline" data-testid="text-coupon-value">
              {formatValue(coupon)}
            </Badge>
          </div>
          {coupon.allow_stacking && (
            <Badge variant="secondary" data-testid="badge-stacking">
              <Shield className="h-3 w-3 mr-1" />
              Stackable
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg font-mono" data-testid="text-coupon-code">
          {coupon.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Redemptions:</span>
            <div className="font-semibold" data-testid="text-redemption-count">
              {coupon.redemption_count || 0}
              {coupon.max_redemptions && ` / ${coupon.max_redemptions}`}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Per User:</span>
            <div className="font-semibold" data-testid="text-per-user-limit">
              {coupon.per_user_limit}
            </div>
          </div>
          {coupon.min_subtotal_cents && (
            <div>
              <span className="text-muted-foreground">Min Order:</span>
              <div className="font-semibold" data-testid="text-min-order">
                ${(coupon.min_subtotal_cents / 100).toFixed(2)}
              </div>
            </div>
          )}
          {(coupon.starts_at || coupon.ends_at) && (
            <div>
              <span className="text-muted-foreground">Active:</span>
              <div className="font-semibold text-xs" data-testid="text-active-period">
                {coupon.starts_at && new Date(coupon.starts_at).toLocaleDateString()} -
                {coupon.ends_at ? new Date(coupon.ends_at).toLocaleDateString() : 'Forever'}
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(coupon)}
            data-testid="button-edit-coupon"
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onArchive(coupon.id)}
            className="text-red-600 hover:text-red-700"
            data-testid="button-archive-coupon"
          >
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CouponEditor({ coupon, onClose, onSave }: { 
  coupon?: CouponV2; 
  onClose: () => void; 
  onSave: (data: CouponFormData) => void; 
}) {
  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || '',
      type: coupon?.type || 'percent',
      value: coupon?.value || 0,
      currency: coupon?.currency || 'USD',
      max_redemptions: coupon?.max_redemptions || undefined,
      per_user_limit: coupon?.per_user_limit || 1,
      allow_stacking: coupon?.allow_stacking || false,
      min_subtotal_cents: coupon?.min_subtotal_cents || undefined,
      starts_at: coupon?.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : '',
      ends_at: coupon?.ends_at ? new Date(coupon.ends_at).toISOString().slice(0, 16) : '',
      is_recurring: coupon?.is_recurring || false,
    }
  });

  const handleSubmit = (data: CouponFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle data-testid="title-coupon-editor">
          {coupon ? 'Edit Coupon' : 'Create New Coupon'}
        </DialogTitle>
        <DialogDescription>
          Configure advanced coupon settings with stacking rules and targeting
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="restrictions">Restrictions</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SAVE20" data-testid="input-coupon-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-coupon-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percent">Percentage</SelectItem>
                          <SelectItem value="amount">Fixed Amount</SelectItem>
                          <SelectItem value="free_trial_days">Free Trial Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))}
                          data-testid="input-coupon-value"
                        />
                      </FormControl>
                      <FormDescription>
                        {form.watch('type') === 'percent' && 'Percentage (0-100)'}
                        {form.watch('type') === 'amount' && 'Amount in dollars'}
                        {form.watch('type') === 'free_trial_days' && 'Number of days'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('type') === 'amount' && (
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="USD" data-testid="input-currency" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allow_stacking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Stacking</FormLabel>
                        <FormDescription>
                          Can be combined with other coupons
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-allow-stacking"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_recurring"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Recurring</FormLabel>
                        <FormDescription>
                          Apply to every billing cycle
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-is-recurring"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="restrictions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="max_redemptions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Global Redemptions</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Unlimited"
                          data-testid="input-max-redemptions"
                        />
                      </FormControl>
                      <FormDescription>Total number of times this coupon can be used</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="per_user_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per User Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))}
                          data-testid="input-per-user-limit"
                        />
                      </FormControl>
                      <FormDescription>Max uses per individual user</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="min_subtotal_cents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? Math.round(Number(e.target.value) * 100) : undefined)}
                        value={field.value ? (field.value / 100).toFixed(2) : ''}
                        placeholder="No minimum"
                        data-testid="input-min-order"
                      />
                    </FormControl>
                    <FormDescription>Minimum order value to apply this coupon</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="scheduling" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="starts_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                          data-testid="input-start-date"
                        />
                      </FormControl>
                      <FormDescription>When this coupon becomes active</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ends_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field}
                          data-testid="input-end-date"
                        />
                      </FormControl>
                      <FormDescription>When this coupon expires</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Changes</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Optional: Explain why this coupon is being created/modified"
                        data-testid="textarea-reason"
                      />
                    </FormControl>
                    <FormDescription>
                      This will be logged in the audit trail for compliance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" data-testid="button-save-coupon">
              {coupon ? 'Update Coupon' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}

function CouponEvaluator() {
  const [result, setResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const form = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      code: '',
      subtotalCents: 0,
    }
  });

  const evaluateCoupon = async (data: EvaluationFormData) => {
    setIsEvaluating(true);
    try {
      const result = await apiRequest('/api/admin/coupons-v2/evaluate', {
        method: 'POST',
        body: data
      });
      setResult(result);
    } catch (error) {
      console.error('Evaluation failed:', error);
      setResult({ valid: false, error: 'Evaluation failed' });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center" data-testid="title-evaluator">
          <TestTube className="h-5 w-5 mr-2" />
          Coupon Evaluator
        </CardTitle>
        <CardDescription>Test coupon validity and discount calculations</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(evaluateCoupon)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SAVE20" data-testid="input-test-code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtotalCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Amount ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(e.target.value ? Math.round(Number(e.target.value) * 100) : 0)}
                        value={field.value ? (field.value / 100).toFixed(2) : ''}
                        data-testid="input-test-amount"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isEvaluating} 
              className="w-full"
              data-testid="button-evaluate"
            >
              {isEvaluating ? 'Evaluating...' : 'Test Coupon'}
            </Button>
          </form>
        </Form>
        
        {result && (
          <div className="mt-4 p-4 rounded-lg border" data-testid="evaluation-result">
            {result.valid ? (
              <div className="space-y-2">
                <div className="text-green-600 font-semibold">✓ Coupon is valid!</div>
                {result.discount_amount && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Discount:</span>
                      <div className="font-semibold">${(result.discount_amount / 100).toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Final Amount:</span>
                      <div className="font-semibold">${(result.final_amount / 100).toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-red-600 font-semibold">✗ {result.error}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdvancedCoupons() {
  const [editingCoupon, setEditingCoupon] = useState<CouponV2 | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['/api/admin/coupons-v2'],
    queryFn: () => apiRequest('/api/admin/coupons-v2')
  });

  const createMutation = useMutation({
    mutationFn: (data: CouponFormData) => 
      apiRequest('/api/admin/coupons-v2', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/coupons-v2'] });
      toast({ title: 'Coupon created successfully' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponFormData }) =>
      apiRequest(`/api/admin/coupons-v2/${id}`, { method: 'PUT', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/coupons-v2'] });
      toast({ title: 'Coupon updated successfully' });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/coupons-v2/${id}/archive`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/coupons-v2'] });
      toast({ title: 'Coupon archived successfully' });
    }
  });

  const handleSave = (data: CouponFormData) => {
    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (coupon: CouponV2) => {
    setEditingCoupon(coupon);
    setIsEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingCoupon(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6" data-testid="advanced-coupons">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center" data-testid="title-coupons">
            <Ticket className="h-6 w-6 mr-2" />
            Advanced Coupons v2
          </h2>
          <p className="text-muted-foreground mt-1" data-testid="description-coupons">
            Sophisticated coupon management with stacking rules, scheduling, and enterprise features
          </p>
        </div>
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} data-testid="button-create-coupon">
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <CouponEditor 
            coupon={editingCoupon || undefined}
            onClose={() => setIsEditorOpen(false)}
            onSave={handleSave}
          />
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle data-testid="title-active-coupons">Active Coupons</CardTitle>
              <CardDescription data-testid="description-active">
                Currently available coupon codes with advanced targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : coupons?.length > 0 ? (
                <div className="grid gap-4" data-testid="grid-coupons">
                  {coupons.map((coupon: CouponV2) => (
                    <CouponCard 
                      key={coupon.id} 
                      coupon={coupon} 
                      onEdit={handleEdit}
                      onArchive={(id) => archiveMutation.mutate(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground" data-testid="text-no-coupons">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active coupons found</p>
                  <Button variant="outline" className="mt-4" onClick={handleCreate}>
                    Create your first coupon
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <CouponEvaluator />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center" data-testid="title-analytics">
                <TrendingUp className="h-5 w-5 mr-2" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" data-testid="text-total-coupons">
                    {coupons?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Coupons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600" data-testid="text-total-redemptions">
                    {coupons?.reduce((sum: number, c: CouponV2) => sum + (c.redemption_count || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Redemptions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}