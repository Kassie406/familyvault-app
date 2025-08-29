import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, ShieldCheck, ShieldAlert, RefreshCw, 
  CheckCircle, AlertTriangle, Clock, Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

interface TamperVerificationProps {
  className?: string;
}

export default function TamperVerification({ className }: TamperVerificationProps) {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);

  const { data: verification, isLoading } = useQuery({
    queryKey: ['/api/admin/audit/verify-chain'],
    queryFn: async () => {
      const response = await fetch('/api/admin/audit/verify-chain');
      if (!response.ok) throw new Error('Failed to get verification status');
      return response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  const verifyChainMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/audit/verify-chain', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to verify audit chain');
      return response.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        toast({ title: 'Audit chain verified successfully', description: 'No tampering detected' });
      } else {
        toast({ 
          title: 'Audit chain verification failed', 
          description: `${data.errors.length} issues detected`,
          variant: 'destructive' 
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/admin/audit/verify-chain'] });
    },
    onError: () => {
      toast({ title: 'Failed to verify audit chain', variant: 'destructive' });
    },
  });

  const handleVerify = async () => {
    setIsVerifying(true);
    await verifyChainMutation.mutateAsync();
    setIsVerifying(false);
  };

  const getStatusIcon = () => {
    if (isLoading || isVerifying) {
      return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />;
    }
    
    if (verification?.valid) {
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    }
    
    return <ShieldAlert className="h-5 w-5 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (isLoading || isVerifying) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Verifying...</Badge>;
    }
    
    if (verification?.valid) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
    }
    
    return <Badge className="bg-red-100 text-red-800 border-red-200">Compromised</Badge>;
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              Tamper-Evident Audit Chain
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Chain Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Total Entries</div>
                    <div className="text-lg font-bold">{verification?.totalEntries || 0}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Last Verified</div>
                    <div className="text-sm text-gray-600">
                      {verification?.lastVerified 
                        ? new Date(verification.lastVerified).toLocaleString()
                        : 'Never'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              {verification?.valid ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Chain Integrity Verified</strong><br />
                    All audit entries are properly signed and tamper-evident. No unauthorized modifications detected.
                  </AlertDescription>
                </Alert>
              ) : verification?.errors?.length > 0 ? (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Chain Integrity Compromised</strong><br />
                    {verification.errors.length} integrity violation(s) detected. 
                    This may indicate unauthorized tampering with audit records.
                  </AlertDescription>
                </Alert>
              ) : null}

              {/* Error Details */}
              {verification?.errors?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-800">Integrity Violations:</h4>
                  <div className="space-y-1">
                    {verification.errors.slice(0, 5).map((error: string, index: number) => (
                      <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                    {verification.errors.length > 5 && (
                      <div className="text-sm text-red-600">
                        ... and {verification.errors.length - 5} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={handleVerify}
                  disabled={isVerifying || verifyChainMutation.isPending}
                  data-testid="button-verify-chain"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isVerifying ? 'Verifying...' : 'Verify Chain Now'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/audit/verify-chain'] })}
                  data-testid="button-refresh-status"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>

              {/* Security Notice */}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <strong>About Tamper-Evident Auditing:</strong> This system uses cryptographic hash chaining 
                to ensure audit log integrity. Each entry is linked to the previous one, making unauthorized 
                modifications detectable. Regular verification helps maintain compliance and security standards.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}