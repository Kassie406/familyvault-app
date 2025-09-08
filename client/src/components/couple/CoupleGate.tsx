import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, Fingerprint, Heart, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoupleGateProps {
  onAuthenticated: () => void;
  onCancel?: () => void;
}

export function CoupleGate({ onAuthenticated, onCancel }: CoupleGateProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(false);

  // Check biometric support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.navigator?.credentials) {
      setBiometricSupported(true);
    }
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call to verify PIN
      // Mock authentication for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (pin === '1234') { // Mock PIN for demo
        sessionStorage.setItem('coupleAuthenticated', 'true');
        onAuthenticated();
      } else {
        setError('Incorrect PIN. Please try again.');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    if (!biometricSupported) {
      setError('Biometric authentication not supported on this device');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mock biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      sessionStorage.setItem('coupleAuthenticated', 'true');
      onAuthenticated();
    } catch (err) {
      setError('Biometric authentication failed. Please try PIN instead.');
      setIsLoading(false);
    }
  };

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setPin(value);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-700 shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Heart className="h-8 w-8 text-[#D4AF37]" />
                <Shield className="h-4 w-4 text-white absolute -bottom-1 -right-1 bg-neutral-900 rounded-full" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Private Couple Area
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              This space is private to the two of you. Add a quick PIN to enter.
            </p>
          </div>

          {/* Authentication Methods */}
          <div className="space-y-6">
            {/* PIN Input */}
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Enter PIN
                </label>
                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={handlePinInput}
                    placeholder="••••"
                    className="bg-neutral-800 border-neutral-600 text-white text-center text-lg tracking-wider"
                    maxLength={6}
                    data-testid="input-couple-pin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    data-testid="button-toggle-pin-visibility"
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
                data-testid="button-enter-pin"
              >
                {isLoading ? 'Verifying...' : 'Enter'}
              </Button>
            </form>

            {/* Biometric Option */}
            {biometricSupported && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-neutral-900 px-4 text-neutral-400">or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBiometricAuth}
                  disabled={isLoading}
                  className="w-full border-neutral-600 text-white hover:bg-neutral-800"
                  data-testid="button-biometric-auth"
                >
                  <Fingerprint className="h-5 w-5 mr-2" />
                  {isLoading ? 'Authenticating...' : 'Use Biometric'}
                </Button>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Privacy Footer */}
          <div className="mt-8 pt-6 border-t border-neutral-700">
            <p className="text-xs text-neutral-500 text-center">
              🔒 Only the two of you can see this
            </p>
          </div>

          {/* Cancel Button */}
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="w-full mt-4 text-neutral-400 hover:text-white"
              data-testid="button-cancel-gate"
            >
              Cancel
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}