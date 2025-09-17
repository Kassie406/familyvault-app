import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Key, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StepUpModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StepUpModal({ isOpen, onSuccess, onCancel }: StepUpModalProps) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  const handlePasskeyAuth = async () => {
    setError('');
    setLoading(true);

    try {
      // Use WebAuthn browser module
      const { startAuthentication } = await import('@simplewebauthn/browser');

      // Get authentication options
      const optionsResponse = await fetch('/api/stepup/webauthn/options', {
        credentials: 'include'
      });

      if (!optionsResponse.ok) {
        throw new Error('Failed to get authentication options');
      }

      const options = await optionsResponse.json();

      // Start authentication
      const assertion = await startAuthentication(options);

      // Verify authentication
      const verifyResponse = await fetch('/api/stepup/webauthn/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(assertion)
      });

      if (verifyResponse.ok) {
        toast({
          title: 'Authentication successful',
          description: 'Your identity has been verified.'
        });
        onSuccess();
      } else {
        const result = await verifyResponse.json().catch(() => ({}));
        setError(result.error || 'Passkey verification failed');
      }
    } catch (err: any) {
      console.error('Passkey authentication error:', err);
      setError('Passkey not available on this device/browser');
    } finally {
      setLoading(false);
    }
  };

  const handleTotpAuth = async () => {
    if (!otp || otp.length !== 6) {
      setError('Enter your 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/stepup/totp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ otp })
      });

      if (response.ok) {
        toast({
          title: 'Authentication successful',
          description: 'Your identity has been verified.'
        });
        onSuccess();
      } else {
        const result = await response.json().catch(() => ({}));
        setError(result.error || 'Invalid code');
      }
    } catch (err) {
      console.error('TOTP authentication error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleTotpAuth();
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md bg-[#141414] border-[#2A2B2E]">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#D4AF37]" />
              <h3 className="text-lg font-semibold text-[#E7E7EA]">Confirm it's you</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-[#A8A9AD] hover:text-[#E7E7EA]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-[#A8A9AD] mb-6">
            For this sensitive action, please verify with a passkey or your 6-digit code.
          </p>

          {/* Passkey Authentication */}
          <div className="mb-6">
            <Button
              onClick={handlePasskeyAuth}
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#B8941F] disabled:opacity-50"
              data-testid="stepup-passkey-button"
            >
              <Key className="h-4 w-4 mr-2" />
              {loading ? 'Authenticating...' : 'Use passkey'}
            </Button>
          </div>

          {/* TOTP Fallback */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-[#E7E7EA]">Or enter 6-digit code</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={handleKeyPress}
                  placeholder="••••••"
                  className="flex-1 bg-[#1A1B1C] border-[#2A2B2E] text-[#E7E7EA] text-center tracking-widest"
                  data-testid="stepup-otp-input"
                />
                <Button
                  onClick={handleTotpAuth}
                  disabled={loading || otp.length !== 6}
                  variant="outline"
                  className="border-[#2A2B2E] text-[#E7E7EA] hover:bg-[#2A2B2E]"
                  data-testid="stepup-otp-button"
                >
                  Verify
                </Button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400" data-testid="stepup-error">
                {error}
              </p>
            )}
          </div>

          {/* Cancel Button */}
          <Button
            onClick={onCancel}
            variant="ghost"
            className="w-full mt-6 text-[#A8A9AD] hover:text-[#E7E7EA] hover:bg-[#2A2B2E]"
            data-testid="stepup-cancel-button"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}