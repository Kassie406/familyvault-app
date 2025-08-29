import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, Clock, Users, DollarSign, Percent, 
  Tag, AlertCircle, Plus, X, Zap, Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

const enhancedCouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code must be less than 20 characters'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.number().min(0, 'Discount must be positive'),
  minimumOrderValue: z.number().min(0).optional(),
  maximumDiscountAmount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  userUsageLimit: z.number().min(1).optional(),
  validFrom: z.string(),
  validUntil: z.string().optional(),
  isActive: z.boolean(),
  stackable: z.boolean(),
  applicableProducts: z.array(z.string()).optional(),
  excludedProducts: z.array(z.string()).optional(),
  customerSegments: z.array(z.string()).optional(),
  scheduleType: z.enum(['immediate', 'scheduled', 'recurring']),
  recurringPattern: z.enum(['daily', 'weekly', 'monthly']).optional(),
  autoDeactivate: z.boolean(),
});

type EnhancedCouponForm = z.infer<typeof enhancedCouponSchema>;

interface EnhancedCouponFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: any; // For editing existing coupons
}

export default function EnhancedCouponForm({ isOpen, onOpenChange, coupon }: EnhancedCouponFormProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid }
  } = useForm<EnhancedCouponForm>({
    resolver: zodResolver(enhancedCouponSchema),
    defaultValues: {
      discountType: 'percentage',
      isActive: true,
      stackable: false,
      scheduleType: 'immediate',
      autoDeactivate: false,
      validFrom: new Date().toISOString().split('T')[0],
    }
  });

  const discountType = watch('discountType');
  const scheduleType = watch('scheduleType');
  const isStackable = watch('stackable');

  const createCouponMutation = useMutation({
    mutationFn: async (data: EnhancedCouponForm) => {
      const response = await fetch('/api/admin/coupons/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create coupon');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Enhanced coupon created successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/coupons'] });
      onOpenChange(false);
      reset();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Failed to create coupon', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  const onSubmit = (data: EnhancedCouponForm) => {
    createCouponMutation.mutate({
      ...data,
      applicableProducts: selectedProducts,
      customerSegments: selectedSegments,
    });
  };

  const addProduct = (productId: string) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId));
  };

  const addSegment = (segment: string) => {
    if (!selectedSegments.includes(segment)) {
      setSelectedSegments([...selectedSegments, segment]);
    }
  };

  const removeSegment = (segment: string) => {
    setSelectedSegments(selectedSegments.filter(s => s !== segment));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Enhanced Coupon Manager
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="SAVE20"
                  className="uppercase"
                  data-testid="input-coupon-code"
                />
                {errors.code && <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="20% Off Everything"
                  data-testid="input-coupon-name"
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Save 20% on all products. Limited time offer!"
                  data-testid="input-coupon-description"
                />
              </div>
            </CardContent>
          </Card>

          {/* Discount Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Discount Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select onValueChange={(value) => setValue('discountType', value as any)}>
                  <SelectTrigger data-testid="select-discount-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountValue">
                  Discount Value {discountType === 'percentage' ? '(%)' : '($)'}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('discountValue', { valueAsNumber: true })}
                  placeholder={discountType === 'percentage' ? '20' : '50'}
                  data-testid="input-discount-value"
                />
                {errors.discountValue && <p className="text-sm text-red-500 mt-1">{errors.discountValue.message}</p>}
              </div>

              <div>
                <Label htmlFor="minimumOrderValue">Minimum Order Value ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('minimumOrderValue', { valueAsNumber: true })}
                  placeholder="100"
                  data-testid="input-minimum-order"
                />
              </div>

              {discountType === 'percentage' && (
                <div>
                  <Label htmlFor="maximumDiscountAmount">Maximum Discount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('maximumDiscountAmount', { valueAsNumber: true })}
                    placeholder="200"
                    data-testid="input-maximum-discount"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-4 w-4" />
                Usage Limits & Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageLimit">Total Usage Limit</Label>
                <Input
                  type="number"
                  {...register('usageLimit', { valueAsNumber: true })}
                  placeholder="1000"
                  data-testid="input-usage-limit"
                />
              </div>

              <div>
                <Label htmlFor="userUsageLimit">Per-User Usage Limit</Label>
                <Input
                  type="number"
                  {...register('userUsageLimit', { valueAsNumber: true })}
                  placeholder="1"
                  data-testid="input-user-usage-limit"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="stackable"
                    onCheckedChange={(checked) => setValue('stackable', checked)}
                    data-testid="switch-stackable"
                  />
                  <Label htmlFor="stackable" className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Allow stacking with other coupons
                  </Label>
                </div>
                {isStackable && (
                  <p className="text-sm text-yellow-600 mt-2">
                    ⚠️ This coupon can be combined with other stackable coupons
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="scheduleType">Schedule Type</Label>
                <Select onValueChange={(value) => setValue('scheduleType', value as any)}>
                  <SelectTrigger data-testid="select-schedule-type">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    type="date"
                    {...register('validFrom')}
                    data-testid="input-valid-from"
                  />
                </div>

                <div>
                  <Label htmlFor="validUntil">Valid Until (Optional)</Label>
                  <Input
                    type="date"
                    {...register('validUntil')}
                    data-testid="input-valid-until"
                  />
                </div>
              </div>

              {scheduleType === 'recurring' && (
                <div>
                  <Label htmlFor="recurringPattern">Recurring Pattern</Label>
                  <Select onValueChange={(value) => setValue('recurringPattern', value as any)}>
                    <SelectTrigger data-testid="select-recurring-pattern">
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoDeactivate"
                  onCheckedChange={(checked) => setValue('autoDeactivate', checked)}
                  data-testid="switch-auto-deactivate"
                />
                <Label htmlFor="autoDeactivate">Auto-deactivate when expired</Label>
              </div>
            </CardContent>
          </Card>

          {/* Customer Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customer Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Customer Segments</Label>
                <div className="flex gap-2 mt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addSegment('new-customers')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New Customers
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addSegment('vip-customers')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    VIP Customers
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addSegment('inactive-customers')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Inactive Customers
                  </Button>
                </div>
                {selectedSegments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedSegments.map((segment) => (
                      <Badge key={segment} variant="secondary" className="flex items-center gap-1">
                        {segment}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSegment(segment)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                onCheckedChange={(checked) => setValue('isActive', checked)}
                defaultChecked={true}
                data-testid="switch-is-active"
              />
              <Label htmlFor="isActive">Activate coupon immediately</Label>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid || createCouponMutation.isPending}
                data-testid="button-create-coupon"
              >
                {createCouponMutation.isPending ? 'Creating...' : 'Create Enhanced Coupon'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}