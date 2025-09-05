import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Copy, Shield, Database, Key, Settings, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ApiService {
  id: string;
  name: string;
  category: string;
  description?: string;
  baseUrl?: string;
  status: 'active' | 'inactive' | 'deprecated';
  variables: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiCredential {
  id: string;
  serviceId: string;
  label: string;
  type: 'api_key' | 'secret' | 'token' | 'username' | 'password';
  masked: string;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ApiManagement() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [showCredentialDialog, setShowCredentialDialog] = useState(false);
  const [editingService, setEditingService] = useState<ApiService | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: '',
    description: '',
    baseUrl: '',
    status: 'active' as const,
    variables: '',
    notes: '',
  });
  const [credentialForm, setCredentialForm] = useState({
    label: '',
    type: 'api_key' as const,
    secret: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch services
  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: ['/api/api-services'],
  });

  // Fetch credentials for selected service
  const { data: credentialsData, isLoading: credentialsLoading } = useQuery({
    queryKey: ['/api/api-credentials', selectedService],
    enabled: !!selectedService,
  });

  // Mutations
  const createServiceMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/api-services', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-services'] });
      setShowServiceDialog(false);
      resetServiceForm();
      toast({ title: 'Service created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create service', variant: 'destructive' });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest(`/api/api-services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-services'] });
      setShowServiceDialog(false);
      resetServiceForm();
      toast({ title: 'Service updated successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to update service', variant: 'destructive' });
    },
  });

  const createCredentialMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('/api/api-credentials', {
        method: 'POST',
        body: JSON.stringify({ ...data, serviceId: selectedService }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-credentials', selectedService] });
      setShowCredentialDialog(false);
      resetCredentialForm();
      toast({ title: 'Credential created successfully' });
    },
    onError: () => {
      toast({ title: 'Failed to create credential', variant: 'destructive' });
    },
  });

  const revealCredentialMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/api-credentials/${id}/reveal`, {
        method: 'POST',
      });
    },
    onSuccess: (data: { plaintext: string }) => {
      navigator.clipboard.writeText(data.plaintext);
      toast({ title: 'Credential copied to clipboard' });
    },
    onError: () => {
      toast({ title: 'Failed to reveal credential', variant: 'destructive' });
    },
  });

  const services = servicesData?.items || [];
  const credentials = credentialsData?.items || [];

  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      category: '',
      description: '',
      baseUrl: '',
      status: 'active',
      variables: '',
      notes: '',
    });
    setEditingService(null);
  };

  const resetCredentialForm = () => {
    setCredentialForm({
      label: '',
      type: 'api_key',
      secret: '',
    });
  };

  const handleEditService = (service: ApiService) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      category: service.category,
      description: service.description || '',
      baseUrl: service.baseUrl || '',
      status: service.status,
      variables: service.variables.join(', '),
      notes: service.notes || '',
    });
    setShowServiceDialog(true);
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...serviceForm,
      variables: serviceForm.variables.split(',').map(v => v.trim()).filter(Boolean),
    };

    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const handleSubmitCredential = (e: React.FormEvent) => {
    e.preventDefault();
    createCredentialMutation.mutate(credentialForm);
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'messaging': return '📱';
      case 'storage': return '☁️';
      case 'database': return '🗄️';
      case 'payment': return '💳';
      case 'ai': return '🤖';
      case 'email': return '📧';
      case 'analytics': return '📊';
      default: return '🔧';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'deprecated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-900)' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/family/settings">
            <Button variant="ghost" size="sm" className="text-[var(--ink-300)] hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Family Settings
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Management</h1>
            <p className="text-[var(--ink-300)]">
              Manage external API services and securely store access credentials
            </p>
          </div>
          
          <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
                onClick={resetServiceForm}
                data-testid="button-add-service"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[var(--bg-850)] border-[var(--line-700)]">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </DialogTitle>
                <DialogDescription className="text-[var(--ink-300)]">
                  Configure an external API service for your application
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmitService} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Service Name</Label>
                    <Input
                      id="name"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Twilio, Stripe, AWS S3..."
                      className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-white">Category</Label>
                    <Select 
                      value={serviceForm.category} 
                      onValueChange={(value) => setServiceForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger className="bg-[var(--bg-800)] border-[var(--line-600)] text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--bg-800)] border-[var(--line-600)]">
                        <SelectItem value="messaging">Messaging</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="payment">Payment</SelectItem>
                        <SelectItem value="ai">AI/ML</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <Textarea
                    id="description"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what this service does..."
                    className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseUrl" className="text-white">Base URL</Label>
                    <Input
                      id="baseUrl"
                      value={serviceForm.baseUrl}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder="https://api.example.com"
                      className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <Select 
                      value={serviceForm.status} 
                      onValueChange={(value: any) => setServiceForm(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="bg-[var(--bg-800)] border-[var(--line-600)] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[var(--bg-800)] border-[var(--line-600)]">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="deprecated">Deprecated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="variables" className="text-white">Environment Variables</Label>
                  <Input
                    id="variables"
                    value={serviceForm.variables}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, variables: e.target.value }))}
                    placeholder="API_KEY, SECRET_KEY, ENDPOINT_URL (comma-separated)"
                    className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="notes" className="text-white">Notes</Label>
                  <Textarea
                    id="notes"
                    value={serviceForm.notes}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional configuration notes..."
                    className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
                    disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                    data-testid="button-save-service"
                  >
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowServiceDialog(false)}
                    className="border-[var(--line-600)] text-[var(--ink-300)]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Services Grid */}
        {servicesLoading ? (
          <div className="text-center py-12">
            <div className="text-[var(--ink-300)]">Loading services...</div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-[var(--ink-400)] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No API services configured</h3>
            <p className="text-[var(--ink-300)] mb-6">
              Add your first API service to start managing credentials securely
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {services.map((service: ApiService) => (
              <Card 
                key={service.id}
                className={`border-[var(--line-700)] bg-[var(--bg-850)] hover:border-[var(--gold)]/30 transition-colors cursor-pointer ${
                  selectedService === service.id ? 'border-[var(--gold)]' : ''
                }`}
                onClick={() => setSelectedService(service.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getCategoryIcon(service.category)}</span>
                      <div>
                        <CardTitle className="text-white text-lg">{service.name}</CardTitle>
                        <CardDescription className="text-[var(--ink-300)]">
                          {service.category}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditService(service);
                        }}
                        className="h-8 w-8 p-0 text-[var(--ink-300)] hover:text-white"
                        data-testid={`button-edit-service-${service.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                      {service.baseUrl && (
                        <a 
                          href={service.baseUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[var(--ink-300)] hover:text-[var(--gold)]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    {service.description && (
                      <p className="text-sm text-[var(--ink-300)]">{service.description}</p>
                    )}
                    
                    {service.variables.length > 0 && (
                      <div>
                        <p className="text-xs text-[var(--ink-400)] mb-1">Environment Variables:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.variables.slice(0, 3).map((variable) => (
                            <Badge 
                              key={variable} 
                              variant="outline" 
                              className="text-xs border-[var(--line-600)] text-[var(--ink-300)]"
                            >
                              {variable}
                            </Badge>
                          ))}
                          {service.variables.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs border-[var(--line-600)] text-[var(--ink-300)]"
                            >
                              +{service.variables.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Credentials Section */}
        {selectedService && (
          <Card className="border-[var(--line-700)] bg-[var(--bg-850)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="h-5 w-5 text-[var(--gold)]" />
                    Credentials
                    <span className="text-[var(--ink-300)] font-normal">
                      for {services.find((s: ApiService) => s.id === selectedService)?.name}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-[var(--ink-300)]">
                    Manage API keys, tokens, and other sensitive credentials
                  </CardDescription>
                </div>
                
                <Dialog open={showCredentialDialog} onOpenChange={setShowCredentialDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm"
                      className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
                      onClick={resetCredentialForm}
                      data-testid="button-add-credential"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Credential
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--bg-850)] border-[var(--line-700)]">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Credential</DialogTitle>
                      <DialogDescription className="text-[var(--ink-300)]">
                        Store a new API credential securely with encryption
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmitCredential} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cred-label" className="text-white">Label</Label>
                          <Input
                            id="cred-label"
                            value={credentialForm.label}
                            onChange={(e) => setCredentialForm(prev => ({ ...prev, label: e.target.value }))}
                            placeholder="API Key, Secret Key, Token..."
                            className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cred-type" className="text-white">Type</Label>
                          <Select 
                            value={credentialForm.type} 
                            onValueChange={(value: any) => setCredentialForm(prev => ({ ...prev, type: value }))}
                          >
                            <SelectTrigger className="bg-[var(--bg-800)] border-[var(--line-600)] text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--bg-800)] border-[var(--line-600)]">
                              <SelectItem value="api_key">API Key</SelectItem>
                              <SelectItem value="secret">Secret</SelectItem>
                              <SelectItem value="token">Token</SelectItem>
                              <SelectItem value="username">Username</SelectItem>
                              <SelectItem value="password">Password</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cred-secret" className="text-white">Secret Value</Label>
                        <Input
                          id="cred-secret"
                          type="password"
                          value={credentialForm.secret}
                          onChange={(e) => setCredentialForm(prev => ({ ...prev, secret: e.target.value }))}
                          placeholder="Enter the secret value..."
                          className="bg-[var(--bg-800)] border-[var(--line-600)] text-white"
                          required
                        />
                        <p className="text-xs text-[var(--ink-400)] mt-1">
                          This will be encrypted and stored securely
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="bg-[var(--gold)] text-black hover:bg-[var(--gold)]/90"
                          disabled={createCredentialMutation.isPending}
                          data-testid="button-save-credential"
                        >
                          Create Credential
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCredentialDialog(false)}
                          className="border-[var(--line-600)] text-[var(--ink-300)]"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {credentialsLoading ? (
                <div className="text-center py-8">
                  <div className="text-[var(--ink-300)]">Loading credentials...</div>
                </div>
              ) : credentials.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-8 w-8 text-[var(--ink-400)] mx-auto mb-3" />
                  <p className="text-[var(--ink-300)]">No credentials stored for this service</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[var(--line-600)]">
                      <TableHead className="text-[var(--ink-300)]">Label</TableHead>
                      <TableHead className="text-[var(--ink-300)]">Type</TableHead>
                      <TableHead className="text-[var(--ink-300)]">Value</TableHead>
                      <TableHead className="text-[var(--ink-300)]">Last Used</TableHead>
                      <TableHead className="text-[var(--ink-300)]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {credentials.map((credential: ApiCredential) => (
                      <TableRow key={credential.id} className="border-[var(--line-600)]">
                        <TableCell className="text-white">{credential.label}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-[var(--line-600)] text-[var(--ink-300)]">
                            {credential.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-[var(--ink-300)]">
                          {credential.masked}
                        </TableCell>
                        <TableCell className="text-[var(--ink-300)]">
                          {credential.lastUsedAt 
                            ? new Date(credential.lastUsedAt).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => revealCredentialMutation.mutate(credential.id)}
                              className="h-8 w-8 p-0 text-[var(--ink-300)] hover:text-[var(--gold)]"
                              disabled={revealCredentialMutation.isPending}
                              data-testid={`button-reveal-credential-${credential.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* TODO: implement edit */}}
                              className="h-8 w-8 p-0 text-[var(--ink-300)] hover:text-white"
                              data-testid={`button-edit-credential-${credential.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}