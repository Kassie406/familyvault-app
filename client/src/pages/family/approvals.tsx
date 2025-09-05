import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PendingApproval {
  id: string;
  resourceId: string;
  requestedBy: string;
  status: string;
  reason: string | null;
  createdAt: string;
  documentTitle: string;
  requesterName: string;
}

interface ApprovalResponse {
  items: PendingApproval[];
}

export default function ApprovalsPage() {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending approvals
  const { data, isLoading, error } = useQuery<ApprovalResponse>({
    queryKey: ["/api/approvals/pending"],
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });

  // Mutation for approval decisions
  const decisionMutation = useMutation({
    mutationFn: async ({ approvalId, decision, reason }: { approvalId: string; decision: 'approve' | 'reject'; reason?: string }) => {
      return apiRequest(`/api/approvals/${approvalId}/decision`, "POST", { decision, reason });
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Success",
        description: `Document access ${variables.decision === 'approve' ? 'approved' : 'rejected'} successfully`,
        variant: "default",
      });
      
      // Refetch the pending approvals
      queryClient.invalidateQueries({ queryKey: ["/api/approvals/pending"] });
      
      // Close dialog and reset state
      setRejectDialogOpen(false);
      setSelectedApproval(null);
      setRejectReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process approval decision",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (approval: PendingApproval) => {
    decisionMutation.mutate({ 
      approvalId: approval.id, 
      decision: 'approve' 
    });
  };

  const handleReject = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedApproval || !rejectReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    decisionMutation.mutate({
      approvalId: selectedApproval.id,
      decision: 'reject',
      reason: rejectReason.trim(),
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Clock className="w-5 h-5 animate-spin" />
              <span>Loading pending approvals...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Approvals</h2>
              <p className="text-gray-400">Please try refreshing the page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pendingApprovals = data?.items || [];

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-yellow-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Pending Approvals</h1>
          </div>
          <p className="text-gray-400">
            Review and approve document access requests from family members
          </p>
        </div>

        {/* Approvals List */}
        {pendingApprovals.length === 0 ? (
          <Card className="bg-zinc-800 border-zinc-700">
            <CardContent className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">All Caught Up!</h3>
              <p className="text-gray-400">No pending approvals at this time</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <Card key={approval.id} className="bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white mb-2 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-yellow-400" />
                        <span>{approval.documentTitle}</span>
                      </CardTitle>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Requested by: <span className="text-white">{approval.requesterName}</span></span>
                          <span>•</span>
                          <span>Submitted: <span className="text-white">{formatDate(approval.createdAt)}</span></span>
                        </div>
                        {approval.reason && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-400">Reason:</p>
                            <p className="text-sm text-white bg-zinc-900 rounded p-2 mt-1">
                              {approval.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => handleApprove(approval)}
                      disabled={decisionMutation.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white border-0"
                      data-testid={`button-approve-${approval.id}`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(approval)}
                      disabled={decisionMutation.isPending}
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      data-testid={`button-reject-${approval.id}`}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reject Reason Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="bg-zinc-800 border-zinc-700 text-white">
            <DialogHeader>
              <DialogTitle>Reject Document Access</DialogTitle>
              <DialogDescription className="text-gray-400">
                Please provide a reason for rejecting access to "{selectedApproval?.documentTitle}"
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-zinc-900 border-zinc-600 text-white placeholder-gray-500 min-h-[100px]"
                data-testid="input-reject-reason"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setRejectReason("");
                  setSelectedApproval(null);
                }}
                className="border-zinc-600 text-gray-300 hover:bg-zinc-700"
                data-testid="button-cancel-reject"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectConfirm}
                disabled={decisionMutation.isPending || !rejectReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="button-confirm-reject"
              >
                {decisionMutation.isPending ? (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </div>
                ) : (
                  "Reject Access"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}