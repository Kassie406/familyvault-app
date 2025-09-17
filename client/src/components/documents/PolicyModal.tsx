import React, { useState, useEffect } from 'react';
import { X, Shield, AlertTriangle, Settings, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { fetchPolicy, savePolicy } from '@/api/policies';

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
}

interface LinkPolicies {
  defaultScope: 'invited' | 'org' | 'anyone';
  requireExpiry: boolean;
  defaultExpiry: number;
  maxExpiry: number;
  allowNever: boolean;
  requirePasswordExternal: boolean;
  minPasswordLength: number;
  allowDownload: boolean;
  addWatermark: boolean;
  disableCopyText: boolean;
  domainRestrictionType: 'allowlist' | 'blocklist' | 'none';
  restrictedDomains: string[];
  applyToExisting: boolean;
}

export function PolicyModal({ open, onClose }: PolicyModalProps) {
  const { toast } = useToast();
  const [policies, setPolicies] = useState<LinkPolicies>({
    defaultScope: 'invited',
    requireExpiry: true,
    defaultExpiry: 30,
    maxExpiry: 365,
    allowNever: false,
    requirePasswordExternal: true,
    minPasswordLength: 8,
    allowDownload: true,
    addWatermark: false,
    disableCopyText: false,
    domainRestrictionType: 'none',
    restrictedDomains: [],
    applyToExisting: false,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load policies when modal opens
  useEffect(() => {
    const loadPolicies = async () => {
      if (!open) return;
      
      setIsLoading(true);
      try {
        const data = await fetchPolicy('workspace');
        setPolicies({
          defaultScope: data.defaultScope || 'invited',
          requireExpiry: data.requireExpiry ?? true,
          defaultExpiry: 30,
          maxExpiry: data.maxExpiryDays || 365,
          allowNever: data.allowNever ?? false,
          requirePasswordExternal: data.requirePassword ?? true,
          minPasswordLength: data.minPasswordLen || 8,
          allowDownload: data.allowDownload ?? true,
          addWatermark: data.watermark ?? false,
          disableCopyText: data.disableCopy ?? false,
          domainRestrictionType: 'none',
          restrictedDomains: [...(data.domainAllowlist || []), ...(data.domainBlocklist || [])],
          applyToExisting: false,
        });
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Failed to load policies:', error);
        toast({
          title: "Error",
          description: "Failed to load link policies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPolicies();
  }, [open, toast]);

  // Track changes for unsaved warning
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [policies]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
        setHasUnsavedChanges(false);
      }
    } else {
      onClose();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        scopeType: 'workspace',
        scopeId: null,
        defaultScope: policies.defaultScope,
        requireExpiry: policies.requireExpiry,
        maxExpiryDays: policies.maxExpiry,
        allowNever: policies.allowNever,
        requirePassword: policies.requirePasswordExternal,
        minPasswordLen: policies.minPasswordLength,
        allowDownload: policies.allowDownload,
        watermark: policies.addWatermark,
        disableCopy: policies.disableCopyText,
        domainAllowlist: policies.domainRestrictionType === 'allowlist' ? policies.restrictedDomains : [],
        domainBlocklist: policies.domainRestrictionType === 'blocklist' ? policies.restrictedDomains : [],
      };

      await savePolicy(payload);
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Link policies saved successfully",
      });
      onClose();
    } catch (error) {
      console.error('Failed to save policies:', error);
      toast({
        title: "Error",
        description: "Failed to save link policies",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addDomain = () => {
    if (newDomain && !policies.restrictedDomains.includes(newDomain)) {
      setPolicies(prev => ({
        ...prev,
        restrictedDomains: [...prev.restrictedDomains, newDomain]
      }));
      setNewDomain('');
    }
  };

  const removeDomain = (domain: string) => {
    setPolicies(prev => ({
      ...prev,
      restrictedDomains: prev.restrictedDomains.filter(d => d !== domain)
    }));
  };

  if (!open) return null;

  const affectedLinksCount = 42; // Mock data - replace with actual count

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-xl font-semibold text-white">Manage Link Policies</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-zinc-400" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-8">
              {/* Default Link Scope */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="font-medium text-white">Default Link Scope</h3>
                </div>
                <Select
                  value={policies.defaultScope}
                  onValueChange={(value: 'invited' | 'org' | 'anyone') => 
                    setPolicies(prev => ({ ...prev, defaultScope: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invited">Invited only</SelectItem>
                    <SelectItem value="org">Organization only</SelectItem>
                    <SelectItem value="anyone">Anyone with link</SelectItem>
                  </SelectContent>
                </Select>
                {policies.defaultScope === 'anyone' && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-amber-200">
                      Links may be forwarded. Use limited expiry and watermarking for PII.
                    </div>
                  </div>
                )}
              </div>

              {/* Expiration Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="font-medium text-white">Expiration</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-expiry" className="text-zinc-300">Require expiry for all links</Label>
                  <Switch
                    id="require-expiry"
                    checked={policies.requireExpiry}
                    onCheckedChange={(checked) => 
                      setPolicies(prev => ({ ...prev, requireExpiry: checked }))
                    }
                  />
                </div>

                {policies.requireExpiry && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="default-expiry" className="text-zinc-300">Default expiry (days)</Label>
                      <Input
                        id="default-expiry"
                        type="number"
                        value={policies.defaultExpiry}
                        onChange={(e) => setPolicies(prev => ({ ...prev, defaultExpiry: parseInt(e.target.value) || 30 }))}
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-expiry" className="text-zinc-300">Maximum allowed (days)</Label>
                      <Input
                        id="max-expiry"
                        type="number"
                        value={policies.maxExpiry}
                        onChange={(e) => setPolicies(prev => ({ ...prev, maxExpiry: parseInt(e.target.value) || 365 }))}
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-never" className="text-zinc-300">Allow "never expire" (admin only)</Label>
                  <Switch
                    id="allow-never"
                    checked={policies.allowNever}
                    onCheckedChange={(checked) => 
                      setPolicies(prev => ({ ...prev, allowNever: checked }))
                    }
                  />
                </div>
              </div>

              {/* Protection Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="font-medium text-white">Protection</h3>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="require-password" className="text-zinc-300">Require password for external links</Label>
                  <Switch
                    id="require-password"
                    checked={policies.requirePasswordExternal}
                    onCheckedChange={(checked) => 
                      setPolicies(prev => ({ ...prev, requirePasswordExternal: checked }))
                    }
                  />
                </div>

                {policies.requirePasswordExternal && (
                  <div>
                    <Label htmlFor="min-password" className="text-zinc-300">Minimum password length</Label>
                    <Input
                      id="min-password"
                      type="number"
                      value={policies.minPasswordLength}
                      onChange={(e) => setPolicies(prev => ({ ...prev, minPasswordLength: parseInt(e.target.value) || 8 }))}
                      className="bg-zinc-900 border-zinc-700 text-white"
                      min="6"
                      max="32"
                    />
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="font-medium text-white">Permissions</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-download" className="text-zinc-300">Allow download/print</Label>
                    <Switch
                      id="allow-download"
                      checked={policies.allowDownload}
                      onCheckedChange={(checked) => 
                        setPolicies(prev => ({ ...prev, allowDownload: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="add-watermark" className="text-zinc-300">Add watermark</Label>
                    <Switch
                      id="add-watermark"
                      checked={policies.addWatermark}
                      onCheckedChange={(checked) => 
                        setPolicies(prev => ({ ...prev, addWatermark: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="disable-copy" className="text-zinc-300">Disable copy text for PDFs</Label>
                    <Switch
                      id="disable-copy"
                      checked={policies.disableCopyText}
                      onCheckedChange={(checked) => 
                        setPolicies(prev => ({ ...prev, disableCopyText: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Domain Rules */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#D4AF37]" />
                  <h3 className="font-medium text-white">Domain Rules</h3>
                </div>
                
                <Select
                  value={policies.domainRestrictionType}
                  onValueChange={(value: 'allowlist' | 'blocklist' | 'none') => 
                    setPolicies(prev => ({ ...prev, domainRestrictionType: value }))
                  }
                >
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No restrictions</SelectItem>
                    <SelectItem value="allowlist">Allow only specific domains</SelectItem>
                    <SelectItem value="blocklist">Block specific domains</SelectItem>
                  </SelectContent>
                </Select>

                {policies.domainRestrictionType !== 'none' && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="example.com"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addDomain()}
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                      <Button onClick={addDomain} size="sm">Add</Button>
                    </div>
                    
                    {policies.restrictedDomains.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {policies.restrictedDomains.map((domain) => (
                          <div
                            key={domain}
                            className="flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-md text-sm text-zinc-300"
                          >
                            {domain}
                            <button
                              onClick={() => removeDomain(domain)}
                              className="text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Inheritance */}
              <div className="space-y-4">
                <h3 className="font-medium text-white">Inheritance</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="apply-existing" className="text-zinc-300">Apply to all subfolders and existing links</Label>
                    <p className="text-sm text-zinc-500">This will affect {affectedLinksCount} existing links</p>
                  </div>
                  <Switch
                    id="apply-existing"
                    checked={policies.applyToExisting}
                    onCheckedChange={(checked) => 
                      setPolicies(prev => ({ ...prev, applyToExisting: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={() => console.log('Opening audit page...')}
              className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
            >
              View Audit Log
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#D4AF37] text-black hover:bg-[#B8941F]"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}