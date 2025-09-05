import React, { useState, useEffect } from 'react';
import { X, Check, XCircle, MessageSquare, AlertTriangle, Clock, Users, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface ApprovalsDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface ApprovalRequest {
  id: string;
  document: {
    name: string;
    type: 'pdf' | 'doc' | 'image' | 'other';
  };
  requester: {
    name: string;
    email: string;
    avatar?: string;
  };
  requestedAccess: 'view' | 'edit' | 'share';
  reason: string;
  riskFlags: string[];
  suggestedExpiry: number;
  requestedAt: string;
  isExternal: boolean;
}

const mockRequests: ApprovalRequest[] = [
  {
    id: '1',
    document: { name: 'Family Insurance Policy.pdf', type: 'pdf' },
    requester: { name: 'John Smith', email: 'john@external.com' },
    requestedAccess: 'view',
    reason: 'Need to review policy details for claim submission',
    riskFlags: ['external-domain', 'sensitive-document'],
    suggestedExpiry: 7,
    requestedAt: '2024-01-29T10:30:00Z',
    isExternal: true,
  },
  {
    id: '2',
    document: { name: 'Medical Records - Sarah.doc', type: 'doc' },
    requester: { name: 'Dr. Amanda Wilson', email: 'amanda@healthcenter.org' },
    requestedAccess: 'edit',
    reason: 'Update patient records with latest test results',
    riskFlags: ['external-domain'],
    suggestedExpiry: 3,
    requestedAt: '2024-01-29T09:15:00Z',
    isExternal: true,
  },
  {
    id: '3',
    document: { name: 'Family Photos 2024', type: 'image' },
    requester: { name: 'Mike Johnson', email: 'mike.johnson@company.com' },
    requestedAccess: 'share',
    reason: 'Create family newsletter for extended family',
    riskFlags: [],
    suggestedExpiry: 30,
    requestedAt: '2024-01-29T08:45:00Z',
    isExternal: false,
  },
];

export function ApprovalsDrawer({ open, onClose }: ApprovalsDrawerProps) {
  const [requests, setRequests] = useState<ApprovalRequest[]>(mockRequests);
  const [filter, setFilter] = useState<'all' | 'view' | 'edit' | 'share'>('all');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [denyReason, setDenyReason] = useState('');
  const [showDenyDialog, setShowDenyDialog] = useState<string | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const filteredRequests = requests.filter(req => 
    filter === 'all' || req.requestedAccess === filter
  );

  const handleApprove = (requestId: string, customExpiry?: number) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      console.log('Approving request:', {
        requestId,
        expiry: customExpiry || request.suggestedExpiry,
        access: request.requestedAccess
      });
      // TODO: Replace with actual API call
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleDeny = (requestId: string) => {
    if (!denyReason.trim()) {
      alert('Please provide a reason for denial');
      return;
    }
    
    console.log('Denying request:', { requestId, reason: denyReason });
    // TODO: Replace with actual API call
    setRequests(prev => prev.filter(r => r.id !== requestId));
    setShowDenyDialog(null);
    setDenyReason('');
  };

  const handleAskChanges = (requestId: string) => {
    console.log('Asking for changes:', requestId);
    // TODO: Replace with actual API call - typically opens a message dialog
  };

  const handleBulkAction = (action: 'approve' | 'deny') => {
    if (selectedRequests.length === 0) return;
    
    console.log(`Bulk ${action}:`, selectedRequests);
    // TODO: Replace with actual API call
    setRequests(prev => prev.filter(r => !selectedRequests.includes(r.id)));
    setSelectedRequests([]);
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'view': return 'bg-green-500/20 text-green-300';
      case 'edit': return 'bg-yellow-500/20 text-yellow-300';
      case 'share': return 'bg-red-500/20 text-red-300';
      default: return 'bg-zinc-500/20 text-zinc-300';
    }
  };

  const getRiskColor = (flag: string) => {
    switch (flag) {
      case 'external-domain': return 'bg-amber-500/20 text-amber-300';
      case 'sensitive-document': return 'bg-red-500/20 text-red-300';
      default: return 'bg-zinc-500/20 text-zinc-300';
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-96 bg-zinc-950 border-l border-zinc-800 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#D4AF37]" />
            <div>
              <h2 className="font-semibold text-white">Pending Approvals</h2>
              <p className="text-sm text-zinc-400">{filteredRequests.length} requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-zinc-800">
          <Select value={filter} onValueChange={(value: 'all' | 'view' | 'edit' | 'share') => setFilter(value)}>
            <SelectTrigger className="w-full bg-zinc-900 border-zinc-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All requests</SelectItem>
              <SelectItem value="view">View access</SelectItem>
              <SelectItem value="edit">Edit access</SelectItem>
              <SelectItem value="share">Share access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedRequests.length > 0 && (
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300">{selectedRequests.length} selected</span>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => handleBulkAction('approve')} className="bg-green-600 hover:bg-green-700">
                  Approve All
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('deny')} className="border-red-600 text-red-400">
                  Deny All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        <div className="flex-1 overflow-y-auto">
          {filteredRequests.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-zinc-500">
              No pending requests
            </div>
          ) : (
            <div className="space-y-1">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors"
                >
                  {/* Request Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedRequests.includes(request.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRequests(prev => [...prev, request.id]);
                        } else {
                          setSelectedRequests(prev => prev.filter(id => id !== request.id));
                        }
                      }}
                      className="mt-1 rounded border-zinc-600"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
                          <span className="font-medium text-white text-sm truncate">{request.document.name}</span>
                        </div>
                        {request.isExternal && <ExternalLink className="h-4 w-4 text-amber-400 shrink-0" />}
                      </div>
                      
                      <div className="text-sm text-zinc-300 mb-2">
                        <span className="font-medium">{request.requester.name}</span>
                        <span className="text-zinc-500"> • {request.requester.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getAccessColor(request.requestedAccess)}>
                          {request.requestedAccess.toUpperCase()}
                        </Badge>
                        {request.riskFlags.map((flag) => (
                          <Badge key={flag} className={getRiskColor(flag)}>
                            {flag}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-zinc-400 mb-3">{request.reason}</p>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve ({request.suggestedExpiry}d)
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowDenyDialog(request.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Deny
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAskChanges(request.id)}
                          className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Ask Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="outline"
            onClick={() => console.log('Opening full approvals page...')}
            className="w-full text-zinc-300 border-zinc-700 hover:bg-zinc-800"
          >
            <Users className="h-4 w-4 mr-2" />
            Open Full Approvals
          </Button>
        </div>
      </div>

      {/* Deny Reason Dialog */}
      {showDenyDialog && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 rounded-xl border border-zinc-800 w-full max-w-md">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="font-semibold text-white">Deny Request</h3>
              <p className="text-sm text-zinc-400 mt-1">Please provide a reason for denial</p>
            </div>
            
            <div className="p-4">
              <Textarea
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="Reason for denial..."
                className="bg-zinc-900 border-zinc-700 text-white"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-end gap-3 p-4 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDenyDialog(null);
                  setDenyReason('');
                }}
                className="text-zinc-300 border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeny(showDenyDialog)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Deny Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}