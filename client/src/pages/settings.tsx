import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Shield, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasskeyCredential {
  id: string;
  name: string;
  device_type: 'singleDevice' | 'multiDevice';
  backup_state: boolean;
  created_at: string;
  last_used?: string;
}

interface WebAuthnConfig {
  rpID: string;
  origins: string[];
  enabled: boolean;
}

export default function Settings() {
  const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<WebAuthnConfig | null>(null);
  const { toast } = useToast();

  // Fetch WebAuthn configuration
  useEffect(() => {
    fetchConfig();
    loadPasskeys();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/auth/webauthn/config', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Failed to fetch WebAuthn config:', error);
    }
  };

  const loadPasskeys = async () => {
    try {
      const response = await fetch('/api/auth/webauthn/credentials', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPasskeys(data.credentials || []);
      }
    } catch (error) {
      console.error('Failed to load passkeys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load passkeys',
        variant: 'destructive'
      });
    }
  };

  const addPasskey = async () => {
    if (!config?.enabled) {
      toast({
        title: 'Error',
        description: 'Passkeys are not enabled',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // Dynamic import for WebAuthn browser module
      const { startRegistration } = await import('https://cdn.skypack.dev/@simplewebauthn/browser');

      // 1. Get registration options
      const optionsResponse = await fetch('/api/auth/webauthn/register/begin', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!optionsResponse.ok) {
        throw new Error('Failed to get registration options');
      }
      
      const options = await optionsResponse.json();

      // 2. Start registration with browser API
      const credential = await startRegistration(options);

      // 3. Verify registration
      const verifyResponse = await fetch('/api/auth/webauthn/register/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential,
          expectedChallenge: options.challenge
        }),
        credentials: 'include'
      });

      const result = await verifyResponse.json();
      
      if (result.verified) {
        await loadPasskeys();
        toast({
          title: 'Success',
          description: 'Passkey added successfully!',
        });
      } else {
        throw new Error('Failed to verify passkey');
      }
    } catch (error: any) {
      console.error('Failed to add passkey:', error);
      toast({
        title: 'Error',
        description: error.message || 'Could not add passkey. Your browser or device may not support it.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const removePasskey = async (id: string) => {
    if (!confirm('Remove this passkey? You may lose sign-in access from that device.')) {
      return;
    }

    try {
      const response = await fetch(`/api/auth/webauthn/credentials/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await loadPasskeys();
        toast({
          title: 'Success',
          description: 'Passkey removed successfully',
        });
      } else {
        throw new Error('Failed to remove passkey');
      }
    } catch (error) {
      console.error('Failed to remove passkey:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove passkey',
        variant: 'destructive'
      });
    }
  };

  const formatDeviceType = (type: string) => {
    return type === 'singleDevice' ? 'This device passkey' : 'Multi-device passkey';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E7E7EA] p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
          <p className="text-[#A8A9AD]">Manage your account security and authentication methods</p>
        </div>

        {/* Passkeys Section */}
        <Card className="bg-[#141414] border-[#2A2B2E]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center text-[#E7E7EA]">
                <Key className="w-5 h-5 mr-2 text-[#D4AF37]" />
                Passkeys
              </CardTitle>
              <CardDescription className="text-[#A8A9AD]">
                Use device passkeys for stronger, phishing-resistant sign-in.
              </CardDescription>
            </div>
            <Button
              onClick={addPasskey}
              disabled={loading || !config?.enabled}
              className="bg-[#D4AF37] hover:bg-[#FFD700] text-[#0A0A0A] font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add passkey
            </Button>
          </CardHeader>
          <CardContent>
            {passkeys.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 mx-auto text-[#A8A9AD] mb-4" />
                <p className="text-[#A8A9AD]">You don't have any passkeys yet.</p>
                <p className="text-sm text-[#A8A9AD] mt-2">
                  Add a passkey to sign in securely with Face ID, Touch ID, or a security key.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {passkeys.map((passkey) => (
                  <div 
                    key={passkey.id}
                    className="flex items-center justify-between p-4 bg-[#1A1B1C] border border-[#2A2B2E] rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#E7E7EA] font-medium">
                          {formatDeviceType(passkey.device_type)}
                        </span>
                        {passkey.backup_state && (
                          <span className="text-xs text-[#A8A9AD] bg-[#2A2B2E] px-2 py-1 rounded">
                            Backed up
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#A8A9AD]">
                        Added {new Date(passkey.created_at).toLocaleDateString()}
                        {passkey.last_used && (
                          <span> • Last used {new Date(passkey.last_used).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePasskey(passkey.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card className="bg-[#141414] border-[#2A2B2E]">
          <CardHeader>
            <CardTitle className="text-[#E7E7EA]">About Passkeys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[#A8A9AD]">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[#E7E7EA]">Phishing Resistant</h4>
                <p className="text-sm">Passkeys can't be phished or stolen in data breaches because they never leave your device.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Key className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[#E7E7EA]">Device Biometrics</h4>
                <p className="text-sm">Use Face ID, Touch ID, Windows Hello, or other device authentication methods.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Plus className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-[#E7E7EA]">Backup & Sync</h4>
                <p className="text-sm">Passkeys can sync across your devices or stay device-specific for maximum security.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}