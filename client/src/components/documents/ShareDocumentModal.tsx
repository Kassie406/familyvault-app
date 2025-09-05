import { useState } from 'react';
import { X, Share, FileText, Users, User, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ShareDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Document {
  id: string;
  title: string;
  fileName?: string;
}

interface LinkPolicy {
  id: string;
  name: string;
  requiresAuth: boolean;
  maxUses?: number;
}

export function ShareDocumentModal({ open, onOpenChange }: ShareDocumentModalProps) {
  const [selectedDocumentId, setSelectedDocumentId] = useState('');
  const [scope, setScope] = useState<'family' | 'user' | 'link'>('family');
  const [sharedWithUserId, setSharedWithUserId] = useState('');
  const [policyId, setPolicyId] = useState('');
  const [canDownload, setCanDownload] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recent documents for selection
  const { data: documentsData } = useQuery({
    queryKey: ['/api/documents/recent'],
    queryFn: async () => {
      const response = await fetch('/api/documents/recent?limit=20');
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    enabled: open,
  });

  // Fetch link policies
  const { data: policiesData } = useQuery({
    queryKey: ['/api/documents/link-policies'],
    queryFn: async () => {
      const response = await fetch('/api/documents/link-policies');
      if (!response.ok) throw new Error('Failed to fetch policies');
      return response.json();
    },
    enabled: open && scope === 'link',
  });

  // Share document mutation
  const shareDocumentMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest(`/api/documents/${selectedDocumentId}/share`, {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      toast({
        title: "Document shared successfully",
        description: "The document has been shared with the selected scope.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents/recent'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to share document",
        description: error.message || "An error occurred while sharing the document.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedDocumentId('');
    setScope('family');
    setSharedWithUserId('');
    setPolicyId('');
    setCanDownload(true);
    setExpiresAt('');
  };

  const handleShare = () => {
    if (!selectedDocumentId) {
      toast({
        title: "Document required",
        description: "Please select a document to share.",
        variant: "destructive",
      });
      return;
    }

    if (scope === 'user' && !sharedWithUserId) {
      toast({
        title: "User required",
        description: "Please specify the user to share with.",
        variant: "destructive",
      });
      return;
    }

    const shareData: any = {
      scope,
      canDownload,
    };

    if (scope === 'user') {
      shareData.sharedWithUserId = sharedWithUserId;
    }

    if (scope === 'link' && policyId) {
      shareData.policyId = policyId;
    }

    if (expiresAt) {
      shareData.expiresAt = new Date(expiresAt).toISOString();
    }

    shareDocumentMutation.mutate(shareData);
  };

  const documents = documentsData?.items || [];
  const policies = policiesData?.items || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Share className="h-5 w-5 text-[#D4AF37]" />
            Share Document
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Share a family document with specific users or create a shareable link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Document Selection */}
          <div className="space-y-2">
            <Label htmlFor="document" className="text-zinc-300">
              Select Document
            </Label>
            <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Choose a document to share" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {documents.map((doc: Document) => (
                  <SelectItem key={doc.id} value={doc.id} className="text-white hover:bg-zinc-700">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#D4AF37]" />
                      {doc.title || doc.fileName || 'Untitled'}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sharing Scope */}
          <div className="space-y-2">
            <Label className="text-zinc-300">Share With</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setScope('family')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  scope === 'family'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                }`}
                data-testid="button-scope-family"
              >
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Family</span>
              </button>
              
              <button
                type="button"
                onClick={() => setScope('user')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  scope === 'user'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                }`}
                data-testid="button-scope-user"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Specific User</span>
              </button>
              
              <button
                type="button"
                onClick={() => setScope('link')}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  scope === 'link'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                }`}
                data-testid="button-scope-link"
              >
                <LinkIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Share Link</span>
              </button>
            </div>
          </div>

          {/* User Selection (if scope is 'user') */}
          {scope === 'user' && (
            <div className="space-y-2">
              <Label htmlFor="user" className="text-zinc-300">
                User Email or ID
              </Label>
              <Input
                id="user"
                value={sharedWithUserId}
                onChange={(e) => setSharedWithUserId(e.target.value)}
                placeholder="Enter user email or ID"
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-shared-with-user"
              />
            </div>
          )}

          {/* Link Policy Selection (if scope is 'link') */}
          {scope === 'link' && (
            <div className="space-y-2">
              <Label htmlFor="policy" className="text-zinc-300">
                Link Policy (Optional)
              </Label>
              <Select value={policyId} onValueChange={setPolicyId}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Choose a link policy or leave default" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="" className="text-white hover:bg-zinc-700">
                    Default Policy
                  </SelectItem>
                  {policies.map((policy: LinkPolicy) => (
                    <SelectItem key={policy.id} value={policy.id} className="text-white hover:bg-zinc-700">
                      {policy.name}
                      {policy.requiresAuth && <span className="text-xs text-zinc-400"> (Auth Required)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="download"
                checked={canDownload}
                onCheckedChange={(checked) => setCanDownload(!!checked)}
                className="border-zinc-600"
              />
              <Label htmlFor="download" className="text-zinc-300 text-sm">
                Allow download
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires" className="text-zinc-300">
                Expiration Date (Optional)
              </Label>
              <Input
                id="expires"
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
                data-testid="input-expires-at"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleShare}
            disabled={shareDocumentMutation.isPending}
            className="bg-[#D4AF37] text-black hover:bg-[#B8941F]"
            data-testid="button-share-document"
          >
            {shareDocumentMutation.isPending ? 'Sharing...' : 'Share Document'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}