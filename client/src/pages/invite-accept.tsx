import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function InviteAccept() {
  const { token } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState('');

  // Fetch invitation details
  const { data: invite, isLoading, error } = useQuery<{
    ok: boolean;
    invite?: {
      id: string;
      familyId: string;
      familyName: string;
      role: string;
      message?: string;
      expiresAt: string;
      status: string;
    };
    error?: string;
  }>({
    queryKey: ['/api/invitations', token],
    queryFn: async () => {
      const response = await fetch(`/api/invitations/${token}`);
      return response.json();
    },
    retry: false,
  });

  // Accept invitation mutation
  const acceptMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/invitations/${token}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName || undefined,
          acceptingUserId: null, // For now, accepting without user auth
        }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.ok) {
        toast({
          title: "Welcome to the family!",
          description: "You have successfully joined the family.",
        });
        // Redirect to family dashboard after a short delay
        setTimeout(() => {
          setLocation('/family');
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to accept invitation",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invite?.ok) {
    const errorMessage = invite?.error || 'Invalid invitation';
    const errorTitle = {
      'invalid_token': 'Invalid Invitation',
      'expired': 'Invitation Expired',
      'already_accepted': 'Already Accepted',
      'revoked': 'Invitation Revoked'
    }[errorMessage] || 'Invitation Error';

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-red-500/20">
          <CardHeader className="text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-red-400">{errorTitle}</CardTitle>
            <CardDescription className="text-gray-400">
              {errorMessage === 'expired' && 'This invitation has expired. Please ask for a new one.'}
              {errorMessage === 'already_accepted' && 'This invitation has already been used.'}
              {errorMessage === 'revoked' && 'This invitation has been cancelled.'}
              {errorMessage === 'invalid_token' && 'This invitation link is not valid.'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (acceptMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-green-500/20">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-green-400">Welcome!</CardTitle>
            <CardDescription className="text-gray-400">
              You've successfully joined {invite.invite?.familyName}. Redirecting to dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-yellow-500/20">
        <CardHeader className="text-center">
          <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <CardTitle className="text-white">Family Invitation</CardTitle>
          <CardDescription className="text-gray-400">
            You've been invited to join <span className="text-yellow-400 font-medium">{invite.invite?.familyName}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Role:</span>
              <span className="text-sm text-yellow-400 capitalize">{invite.invite?.role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Expires:</span>
              <span className="text-sm text-gray-300">
                {new Date(invite.invite?.expiresAt || '').toLocaleDateString()}
              </span>
            </div>
          </div>

          {invite.invite?.message && (
            <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-200">"{invite.invite.message}"</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-gray-300">
              Display Name (optional)
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should others see your name?"
              className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setLocation('/')}
              variant="outline" 
              className="flex-1 border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
            >
              Decline
            </Button>
            <Button
              onClick={() => acceptMutation.mutate()}
              disabled={acceptMutation.isPending}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
            >
              {acceptMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Joining...
                </>
              ) : (
                'Accept & Join'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}