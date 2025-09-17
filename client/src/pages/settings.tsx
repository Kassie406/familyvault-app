import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Shield, Key, Monitor, Smartphone, Globe } from 'lucide-react';
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

interface SessionData {
  sid: string;
  ip: string;
  userAgent: string;
  rawUserAgent: string | null;
  createdAt: string;
  lastSeenAt: string;
  current: boolean;
}

interface SessionsResponse {
  sessions: SessionData[];
  totalCount: number;
  currentSessionId: string;
}

export default function Settings() {
  const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [config, setConfig] = useState<WebAuthnConfig | null>(null);
  const { toast } = useToast();

  // Fetch WebAuthn configuration and sessions
  useEffect(() => {
    fetchConfig();
    loadPasskeys();
    loadSessions();
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

  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      const response = await fetch('/api/security/sessions', {
        credentials: 'include'
      });
      if (response.ok) {
        const data: SessionsResponse = await response.json();
        setSessions(data.sessions);
      } else {
        console.error('Failed to load sessions');
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      const response = await fetch('/api/security/sessions/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sid: sessionId })
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.sid !== sessionId));
        toast({
          title: 'Session revoked',
          description: 'The session has been successfully terminated.'
        });
      } else {
        throw new Error('Failed to revoke session');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke session. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const revokeOtherSessions = async () => {
    try {
      const response = await fetch('/api/security/sessions/revoke-others', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        // Keep only the current session
        const currentSession = sessions.find(s => s.current);
        setSessions(currentSession ? [currentSession] : []);
        toast({
          title: 'Sessions revoked',
          description: `Successfully revoked ${data.revokedCount} other sessions.`
        });
      } else {
        throw new Error('Failed to revoke other sessions');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke other sessions. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.toLowerCase().includes('mobile')) return <Smartphone className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
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

        {/* Active Sessions Section */}
        <Card className="bg-[#141414] border-[#2A2B2E]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E7E7EA]">
              <Monitor className="h-5 w-5" />
              Active Sessions
            </CardTitle>
            <CardDescription className="text-[#A8A9AD]">
              Manage your active login sessions and devices. You can revoke sessions to sign out from other devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionsLoading ? (
                <div className="text-center py-4 text-[#A8A9AD]">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-4 text-[#A8A9AD]">
                  No active sessions found
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.sid}
                        className="flex items-center justify-between p-4 bg-[#1A1B1C] border border-[#2A2B2E] rounded-lg"
                        data-testid={`session-${session.sid}`}
                      >
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(session.userAgent)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-[#E7E7EA]">{session.userAgent}</span>
                              {session.current && (
                                <Badge variant="secondary" className="text-xs bg-[#D4AF37] text-black">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-[#A8A9AD] flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {session.ip} • {formatLastSeen(session.lastSeenAt)}
                            </div>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeSession(session.sid)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            data-testid={`revoke-session-${session.sid}`}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {sessions.some(s => !s.current) && (
                    <div className="pt-4 border-t border-[#2A2B2E]">
                      <Button
                        variant="ghost"
                        onClick={revokeOtherSessions}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        data-testid="revoke-all-other-sessions"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke All Other Sessions
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}