import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  type: 'banner' | 'popup';
  title: string;
  message?: string;
  description?: string;
  promoCode: string;
  discount?: string;
  ctaText: string;
  ctaUrl?: string;
  bgColor?: string;
  bgGradient?: string;
  textColor?: string;
  icon?: string;
  showAfterSeconds?: number;
  showOncePerSession?: boolean;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export default function MarketingPromotions() {
  const { toast } = useToast();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [newPromoType, setNewPromoType] = useState<'banner' | 'popup'>('banner');

  const [formData, setFormData] = useState({
    type: 'banner' as 'banner' | 'popup',
    title: '',
    message: '',
    description: '',
    promoCode: '',
    discount: '',
    ctaText: 'Learn More',
    ctaUrl: '',
    bgColor: '#1e40af',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    icon: 'gift',
    showAfterSeconds: 5,
    showOncePerSession: true,
    expiresAt: '',
    isActive: true
  });

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, promoCode: result }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      type: newPromoType,
      title: '',
      message: '',
      description: '',
      promoCode: '',
      discount: '',
      ctaText: 'Learn More',
      ctaUrl: '',
      bgColor: '#1e40af',
      bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff',
      icon: 'gift',
      showAfterSeconds: 5,
      showOncePerSession: true,
      expiresAt: '',
      isActive: true
    });
    setEditingPromo(null);
  };

  const handleSave = async () => {
    try {
      if (!formData.title || !formData.promoCode) {
        toast({
          title: 'Validation Error',
          description: 'Title and promo code are required',
          variant: 'destructive'
        });
        return;
      }

      const promotion: Promotion = {
        id: editingPromo?.id || crypto.randomUUID(),
        ...formData,
        createdAt: editingPromo?.createdAt || new Date().toISOString()
      };

      // Simulate API call - in production, this would save to database
      const existingIndex = promotions.findIndex(p => p.id === promotion.id);
      if (existingIndex >= 0) {
        const updated = [...promotions];
        updated[existingIndex] = promotion;
        setPromotions(updated);
      } else {
        setPromotions(prev => [promotion, ...prev]);
      }

      toast({
        title: 'Success',
        description: `Promotion ${editingPromo ? 'updated' : 'created'} successfully`
      });

      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save promotion',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (promo: Promotion) => {
    setFormData({
      type: promo.type,
      title: promo.title,
      message: promo.message || '',
      description: promo.description || '',
      promoCode: promo.promoCode,
      discount: promo.discount || '',
      ctaText: promo.ctaText,
      ctaUrl: promo.ctaUrl || '',
      bgColor: promo.bgColor || '#1e40af',
      bgGradient: promo.bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: promo.textColor || '#ffffff',
      icon: promo.icon || 'gift',
      showAfterSeconds: promo.showAfterSeconds || 5,
      showOncePerSession: promo.showOncePerSession !== false,
      expiresAt: promo.expiresAt || '',
      isActive: promo.isActive
    });
    setEditingPromo(promo);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully'
      });
    }
  };

  const handleToggleActive = async (id: string) => {
    setPromotions(prev => 
      prev.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      )
    );
  };

  const copyPromoCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Copied',
        description: 'Promo code copied to clipboard'
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  useEffect(() => {
    // Load sample promotions
    const samplePromotions: Promotion[] = [
      {
        id: 'winter-sale-2025',
        type: 'banner',
        title: '🎉 Winter Sale',
        message: 'Get 50% off FamilyCircle Secure Enterprise for 3 months',
        promoCode: 'WINTER50',
        ctaText: 'Claim Offer',
        ctaUrl: '/pricing',
        bgColor: '#1e40af',
        textColor: '#ffffff',
        icon: 'gift',
        expiresAt: '2025-03-01',
        isActive: true,
        createdAt: '2025-01-15T00:00:00Z'
      },
      {
        id: 'enterprise-upgrade-2025',
        type: 'popup',
        title: 'Limited Time Offer!',
        description: 'Unlock advanced security features, tamper-evident auditing, and enterprise-grade monitoring.',
        promoCode: 'ENTERPRISE40',
        discount: '40% OFF',
        ctaText: 'Upgrade Now',
        ctaUrl: '/pricing?plan=enterprise',
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        showAfterSeconds: 5,
        showOncePerSession: true,
        expiresAt: '2025-03-01',
        isActive: true,
        createdAt: '2025-01-10T00:00:00Z'
      }
    ];
    
    setPromotions(samplePromotions);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading promotions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Promotions</h2>
          <p className="text-muted-foreground">
            Manage promotional banners and popups to drive conversions
          </p>
        </div>
        <Button onClick={() => setNewPromoType('banner')} data-testid="new-promotion">
          <Plus className="w-4 h-4 mr-2" />
          New Promotion
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Active Promotions</TabsTrigger>
          <TabsTrigger value="create">
            {editingPromo ? 'Edit Promotion' : 'Create Promotion'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {promotions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No promotions created yet</p>
                <Button className="mt-4" onClick={() => setNewPromoType('banner')}>
                  Create Your First Promotion
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {promotions.map(promo => (
                <Card key={promo.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant={promo.type === 'banner' ? 'default' : 'secondary'}>
                          {promo.type}
                        </Badge>
                        <h3 className="font-semibold">{promo.title}</h3>
                        {promo.isActive ? (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            <Eye className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {promo.message || promo.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Code: {promo.promoCode}</span>
                        {promo.expiresAt && (
                          <span>Expires: {new Date(promo.expiresAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyPromoCode(promo.promoCode)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(promo.id)}
                      >
                        {promo.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(promo)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(promo.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPromo ? 'Edit Promotion' : 'Create New Promotion'}
              </CardTitle>
              <CardDescription>
                Configure your promotional campaign settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Promotion Type */}
              <div className="space-y-2">
                <Label>Promotion Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'banner' | 'popup') => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner (Top of Page)</SelectItem>
                    <SelectItem value="popup">Popup Modal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Winter Sale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctaText">CTA Text</Label>
                  <Input
                    id="ctaText"
                    value={formData.ctaText}
                    onChange={(e) => handleInputChange('ctaText', e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
              </div>

              {/* Message/Description */}
              {formData.type === 'banner' ? (
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Get 50% off for limited time"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description of the offer"
                  />
                </div>
              )}

              {/* Promo Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="promoCode">Promo Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="promoCode"
                      value={formData.promoCode}
                      onChange={(e) => handleInputChange('promoCode', e.target.value)}
                      placeholder="SAVE50"
                    />
                    <Button type="button" variant="outline" onClick={generatePromoCode}>
                      Generate
                    </Button>
                  </div>
                </div>
                {formData.type === 'popup' && (
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount Display</Label>
                    <Input
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      placeholder="50% OFF"
                    />
                  </div>
                )}
              </div>

              {/* URLs and Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaUrl">CTA URL</Label>
                  <Input
                    id="ctaUrl"
                    value={formData.ctaUrl}
                    onChange={(e) => handleInputChange('ctaUrl', e.target.value)}
                    placeholder="/pricing"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expires At</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                  />
                </div>
              </div>

              {/* Popup Specific Settings */}
              {formData.type === 'popup' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="showAfterSeconds">Show After (seconds)</Label>
                    <Input
                      id="showAfterSeconds"
                      type="number"
                      value={formData.showAfterSeconds}
                      onChange={(e) => handleInputChange('showAfterSeconds', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="showOncePerSession"
                      checked={formData.showOncePerSession}
                      onCheckedChange={(checked) => handleInputChange('showOncePerSession', checked)}
                    />
                    <Label htmlFor="showOncePerSession">Show once per session</Label>
                  </div>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave}>
                  {editingPromo ? 'Update Promotion' : 'Create Promotion'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}