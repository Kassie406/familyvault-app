import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Eye, EyeOff, Link2 } from 'lucide-react';

interface ShareData {
  title: string;
  owner: string;
  tag: string;
  allowReveal: boolean;
  requireLogin: boolean;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
}

type ShareState = 
  | { status: 'loading' }
  | { status: 'expired' }
  | { status: 'invalid' }
  | { status: 'ok'; data: ShareData }
  | { status: 'login_required' };

export default function Share() {
  const params = useParams<{ token: string }>();
  const [state, setState] = useState<ShareState>({ status: 'loading' });
  const [revealed, setRevealed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!params.token) {
      setState({ status: 'invalid' });
      return;
    }

    fetch(`/api/share/${params.token}`)
      .then(r => r.json().then(j => ({ ok: r.ok, status: r.status, data: j })))
      .then(({ ok, status, data }) => {
        if (!ok) {
          if (status === 410) setState({ status: 'expired' });
          else if (status === 401) setState({ status: 'login_required' });
          else setState({ status: 'invalid' });
        } else {
          setState({ status: 'ok', data });
        }
      })
      .catch(() => setState({ status: 'invalid' }));
  }, [params.token]);

  const handleReveal = async () => {
    if (!params.token) return;
    
    try {
      const response = await fetch(`/api/share/${params.token}/reveal`, { 
        method: 'POST' 
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setState({ status: 'login_required' });
          return;
        }
        throw new Error('Failed to reveal');
      }
      
      const secret = await response.json();
      setState(prev => prev.status === 'ok' ? {
        ...prev,
        data: { ...prev.data, ...secret }
      } : prev);
      setRevealed(true);
      
      // Auto-hide after 30 seconds
      setTimeout(() => setRevealed(false), 30000);
    } catch (error) {
      console.error('Failed to reveal secret:', error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  const handleLogin = () => {
    window.location.href = `/login?next=/share/${params.token}`;
  };

  if (state.status === 'loading') {
    return (
      <Shell>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          <span className="ml-3 text-neutral-400">Loading...</span>
        </div>
      </Shell>
    );
  }

  if (state.status === 'expired') {
    return (
      <ErrorShell 
        title="Link Expired" 
        subtitle="This share link has expired. Ask the owner to regenerate a new link." 
      />
    );
  }

  if (state.status === 'invalid') {
    return (
      <ErrorShell 
        title="Invalid Link" 
        subtitle="This share link is no longer valid or has been revoked." 
      />
    );
  }

  if (state.status === 'login_required') {
    return (
      <Shell>
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Link2 className="h-8 w-8 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Login Required</h1>
            <p className="text-sm text-neutral-400 mt-1">
              You need to log in to view this shared credential.
            </p>
          </div>
          <Button 
            className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]" 
            onClick={handleLogin}
          >
            Log in to view
          </Button>
        </div>
      </Shell>
    );
  }

  const { data } = state;

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-white">{data.title}</h1>
          <p className="text-sm text-neutral-400">
            Shared by {data.owner} {data.tag ? `• ${data.tag}` : ''}
          </p>
        </div>

        {/* Credential Information */}
        <div className="space-y-4">
          {/* Username */}
          {data.username && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Username</label>
              <div className="flex items-center gap-2">
                <Input
                  value={revealed ? data.username : '••••••••'}
                  readOnly
                  className="bg-[#0A0A0F] border-[#232530] text-white"
                />
                {revealed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#232530] text-neutral-300 hover:text-white"
                    onClick={() => handleCopy(data.username!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Password */}
          {data.password && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Password</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type={revealed && showPassword ? 'text' : 'password'}
                    value={revealed ? data.password : '••••••••••••'}
                    readOnly
                    className="bg-[#0A0A0F] border-[#232530] text-white pr-10"
                  />
                  {revealed && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-neutral-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                  )}
                </div>
                {revealed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#232530] text-neutral-300 hover:text-white"
                    onClick={() => handleCopy(data.password!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* URL */}
          {data.url && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">URL</label>
              <div className="flex items-center gap-2">
                <Input
                  value={revealed ? data.url : '••••••••••••••••••••'}
                  readOnly
                  className="bg-[#0A0A0F] border-[#232530] text-white"
                />
                {revealed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#232530] text-neutral-300 hover:text-white"
                    onClick={() => handleCopy(data.url!)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {data.notes && (
            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Notes</label>
              <div className="p-3 rounded-xl border border-[#232530] bg-[#0A0A0F] text-white text-sm">
                {revealed ? data.notes : '••••••••••••••••••••••••••••••••'}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          {!revealed ? (
            <Button 
              className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]" 
              onClick={handleReveal}
            >
              <Eye className="h-4 w-4 mr-2" />
              Reveal Credential
            </Button>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-xs text-amber-400">
                Information visible for 30 seconds
              </p>
              <Button 
                variant="outline" 
                className="border-[#232530] text-neutral-300 hover:text-white"
                onClick={() => setRevealed(false)}
              >
                Hide Information
              </Button>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-neutral-500">
            This credential is securely shared via FamilyVault
          </p>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );
}

function ErrorShell({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Shell>
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <Link2 className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
        </div>
        <Button 
          variant="outline" 
          className="border-[#232530] text-neutral-300 hover:text-white"
          onClick={() => window.location.href = '/'}
        >
          Go to Homepage
        </Button>
      </div>
    </Shell>
  );
}