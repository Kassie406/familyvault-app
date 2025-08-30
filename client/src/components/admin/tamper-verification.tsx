import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, RefreshCw
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

  const getChainState = () => {
    if (isLoading || isVerifying) return 'warn';
    if (verification?.valid) return 'ok';
    return 'bad';
  };

  const getStatusText = () => {
    if (isLoading || isVerifying) return 'Verification required';
    if (verification?.valid) return 'Verified';
    return 'Integrity compromised';
  };

  const getTotalEntries = () => {
    return verification?.totalEntries || 0;
  };

  const getLastVerified = () => {
    if (!verification?.lastVerified) return 'Never verified';
    return new Date(verification.lastVerified).toLocaleString();
  };

  return (
    <div className={className}>
      <div className="card" id="card-chain">
        <div className="card-header">
          <div className="kpi">
            <h3 style={{margin: 0}}>Tamper-Evident Audit Chain</h3>
            <span className={`pill pill-${getChainState()}`} id="chain-state">
              {getStatusText()}
            </span>
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button 
              id="btn-chain-verify" 
              className="btn primary"
              onClick={handleVerify}
              disabled={isVerifying || verifyChainMutation.isPending}
              data-testid="button-verify-chain"
            >
              {isVerifying ? 'Verifying...' : 'Verify Chain Now'}
            </button>
            <button 
              id="btn-chain-refresh" 
              className="btn"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/audit/verify-chain'] })}
              data-testid="button-refresh-status"
            >
              Refresh Status
            </button>
          </div>
        </div>
        
        <div style={{padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
          <div>Total Entries: <strong id="chain-count">{getTotalEntries()}</strong></div>
          <div>Last Verified: <strong id="chain-last">{getLastVerified()}</strong></div>
        </div>
        
        {verification?.errors?.length > 0 && (
          <div 
            id="chain-alert" 
            style={{
              padding: '0 16px 14px 16px', 
              color: '#B42318',
              display: 'block'
            }}
          >
            Suspicious divergence detected. Run verification and investigate last blocks.
          </div>
        )}
        
        {verification?.errors?.length > 0 && (
          <div style={{padding: '0 16px 16px 16px'}}>
            <h4 style={{margin: '0 0 8px 0', color: '#B42318', fontSize: '14px', fontWeight: 600}}>
              Integrity Violations:
            </h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
              {verification.errors.slice(0, 3).map((error: string, index: number) => (
                <div key={index} style={{
                  fontSize: '12px', 
                  color: '#B42318', 
                  background: '#FEECEC', 
                  padding: '6px 8px', 
                  borderRadius: '6px'
                }}>
                  {error}
                </div>
              ))}
              {verification.errors.length > 3 && (
                <div style={{fontSize: '12px', color: '#B42318'}}>
                  ... and {verification.errors.length - 3} more errors
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}