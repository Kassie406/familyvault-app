import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { Search, Key, Eye, EyeOff, Copy, BadgeCheck, X, MoreVertical, Edit, Share, Trash2, Link2, Users, UserRound, UsersRound, Send, Plus, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Luxury Card Shell Component
function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F]
                     shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all
                     hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] ${className}`}>
      {children}
    </div>
  );
}

// Manager Dropdown Dots Component
function ManagerDropdownDots() {
  const handleEdit = () => {
    console.log('Edit password manager');
  };

  const handleView = () => {
    console.log('View password manager details');
  };

  const handleShare = () => {
    console.log('Share password manager');
  };

  const handleDelete = () => {
    console.log('Delete password manager');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          onClick={(e) => e.stopPropagation()}
          className="h-8 w-8 inline-grid place-items-center rounded-lg border border-transparent text-neutral-400
                     hover:text-white hover:border-[#232530]"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-[#13141B] border-[#232530] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem 
          onClick={handleEdit}
          className="text-neutral-300 hover:text-white hover:bg-[rgba(212,175,55,0.18)] focus:bg-[rgba(212,175,55,0.18)] focus:text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Manager
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleView}
          className="text-neutral-300 hover:text-white hover:bg-[rgba(212,175,55,0.18)] focus:bg-[rgba(212,175,55,0.18)] focus:text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleShare}
          className="text-neutral-300 hover:text-white hover:bg-[rgba(212,175,55,0.18)] focus:bg-[rgba(212,175,55,0.18)] focus:text-white"
        >
          <Share className="h-4 w-4 mr-2" />
          Share Manager
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 hover:bg-[rgba(239,68,68,0.18)] focus:bg-[rgba(239,68,68,0.18)] focus:text-red-300"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Manager
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Credential Dropdown Dots Component
function DropdownDots({ 
  cardId, 
  cardTitle, 
  onEdit, 
  onView, 
  onShare 
}: { 
  cardId: string; 
  cardTitle: string;
  onEdit: (id: string, title: string) => void;
  onView: (id: string, title: string) => void;
  onShare: (id: string, title: string) => void;
}) {
  const handleEdit = () => {
    onEdit(cardId, cardTitle);
  };

  const handleView = () => {
    onView(cardId, cardTitle);
  };

  const handleShare = () => {
    onShare(cardId, cardTitle);
  };

  const handleDelete = () => {
    console.log('Delete credential:', cardTitle);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          onClick={(e) => e.stopPropagation()}
          className="h-8 w-8 inline-grid place-items-center rounded-lg border border-transparent text-neutral-400
                     hover:text-white hover:border-[#232530]"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-[#13141B] border-[#232530] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem 
          onClick={handleEdit}
          className="text-neutral-300 hover:text-white hover:bg-[rgba(212,175,55,0.18)] focus:bg-[rgba(212,175,55,0.18)] focus:text-white"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Credential
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleView}
          className="text-neutral-300 hover:text-white hover:bg-[rgba(212,175,55,0.18)] focus:bg-[rgba(212,175,55,0.18)] focus:text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleShare}
          className="text-neutral-300 hover:text-white hover:bg-[rgba(212,175,55,0.18)] focus:bg-[rgba(212,175,55,0.18)] focus:text-white"
        >
          <Share className="h-4 w-4 mr-2" />
          Share Credential
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 hover:bg-[rgba(239,68,68,0.18)] focus:bg-[rgba(239,68,68,0.18)] focus:text-red-300"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Credential
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Password Manager Card Component
function ManagerCard({ name, count }: { name: string; count: number }) {
  return (
    <Shell className="p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl grid place-items-center bg-[#D4AF37]/15 text-[#D4AF37] border border-[#232530]">
          <Key className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium truncate">{name}</div>
          <div className="text-xs text-neutral-400">+ {count} items pre-populated</div>
        </div>
        <ManagerDropdownDots />
      </div>
    </Shell>
  );
}

// Credential Card Component
function CredentialCard({ 
  id, 
  title, 
  owner, 
  tag, 
  onNavigate,
  onEdit,
  onView,
  onShare
}: { 
  id: string;
  title: string; 
  owner?: string; 
  tag?: string;
  onNavigate: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onView: (id: string, title: string) => void;
  onShare: (id: string, title: string) => void;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(true);
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // Set new timeout for auto-hide
    const newTimeoutId = setTimeout(() => {
      setIsRevealed(false);
      setTimeoutId(null);
    }, 15000);
    setTimeoutId(newTimeoutId);
  };

  const handleHide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(false);
    // Clear the auto-hide timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Only copy if password is revealed
      if (isRevealed) {
        await navigator.clipboard.writeText("MySecretPass123");
        // You could add a toast notification here for better UX
        console.log('Password copied to clipboard for:', title);
      } else {
        // Copy masked value if not revealed
        await navigator.clipboard.writeText("•••• •••• ••••");
        console.log('Masked password copied for:', title);
      }
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const handleCardClick = () => {
    onNavigate(id);
  };

  return (
    <div onClick={handleCardClick}>
      <Shell className="p-4 cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111214] border border-[#232530] text-neutral-300">
            <Key className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-white font-medium truncate">{title}</div>
            <div className="text-xs text-neutral-500 mt-0.5">
              {owner && <>Owner: <span className="text-neutral-300">{owner}</span></>}
              {tag && <> · <span className="rounded-full border border-[#232530] bg-[#111214] px-2 py-0.5 text-[11px]">{tag}</span></>}
            </div>

            {/* Masked secret row */}
            <div className="mt-2 flex items-center gap-2">
              <div className="text-[13px] tracking-widest text-neutral-500 select-none">
                {isRevealed ? "MySecretPass123" : "•••• •••• ••••"}
              </div>
              <button 
                onClick={isRevealed ? handleHide : handleReveal}
                className="text-xs text-[#D4AF37] hover:underline underline-offset-4"
              >
                {isRevealed ? "Hide" : "Reveal"}
              </button>
              <span className="text-neutral-600 text-xs">•</span>
              <button 
                onClick={handleCopy}
                className="text-xs text-neutral-300 hover:text-white"
              >
                Copy
              </button>
            </div>
          </div>
          <DropdownDots 
            cardId={id} 
            cardTitle={title}
            onEdit={onEdit}
            onView={onView}
            onShare={onShare}
          />
        </div>
      </Shell>
    </div>
  );
}



// Detail Slide-over Component
function CredentialDetail({ 
  credentialId, 
  isOpen, 
  onClose 
}: { 
  credentialId: string; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [revealUntil, setRevealUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [audit, setAudit] = useState<Array<{action: string; ts: number}>>([]);

  const shell = "rounded-xl border border-[#232530] bg-[#111111]";
  
  // Mock credential data
  const cred = {
    id: credentialId,
    title: "Angel's Phone Password",
    secret: "MySecretPass123",
    username: "angel@family.com",
    url: "https://icloud.com",
    updatedAt: Date.now() - 86400000,
    owner: "Angel",
    tag: "Device"
  };

  const maskSecret = (secret: string) => {
    return "•••• •••• ••••";
  };

  const isRevealed = revealUntil !== null && Date.now() < revealUntil;

  const startReveal = useCallback(() => {
    setConfirmOpen(true);
  }, []);

  const confirmReveal = useCallback(() => {
    const until = Date.now() + 15000;
    setRevealUntil(until);
    setConfirmOpen(false);
    
    // Add to audit log
    setAudit(prev => [{
      action: "Revealed password",
      ts: Date.now()
    }, ...prev]);
  }, []);

  const handleCopy = useCallback(() => {
    if (isRevealed) {
      navigator.clipboard?.writeText(cred.secret);
      setAudit(prev => [{
        action: "Copied password",
        ts: Date.now()
      }, ...prev]);
    }
  }, [isRevealed, cred.secret]);

  // Countdown effect
  useEffect(() => {
    if (!isRevealed) return;
    
    const interval = setInterval(() => {
      const left = Math.ceil((revealUntil! - Date.now()) / 1000);
      setSecondsLeft(Math.max(0, left));
      
      if (left <= 0) {
        setRevealUntil(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRevealed, revealUntil]);

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right" className="w-[480px] bg-[#0A0A0F] text-[#F4F4F6] border-l border-[#232530]">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg text-white">{cred.title}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Secret reveal section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-[#D4AF37]"/>
                  <div className="text-sm text-neutral-300">Secret</div>
                </div>
                {isRevealed ? (
                  <div className="text-[11px] text-neutral-400">Auto-hiding in <span className="text-white">{secondsLeft}s</span></div>
                ) : null}
              </div>
              <div className="mt-3 rounded-xl border border-[#232530] bg-[#111111] px-3 py-2 text-[15px] tracking-widest">
                {isRevealed ? cred.secret : maskSecret(cred.secret)}
              </div>
              <div className="mt-3 flex items-center gap-2">
                {!isRevealed ? (
                  <Button className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]" onClick={startReveal}>
                    <Eye className="h-4 w-4 mr-1"/> Reveal
                  </Button>
                ) : (
                  <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={()=>setRevealUntil(null)}>
                    <EyeOff className="h-4 w-4 mr-1"/> Hide now
                  </Button>
                )}
                <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-1"/> Copy
                </Button>
              </div>
            </div>

            {/* Meta information */}
            <div className="grid grid-cols-2 gap-3">
              {cred.username && (
                <div className={`${shell} p-3`}>
                  <div className="text-xs text-neutral-400">Username</div>
                  <div className="text-sm">{cred.username}</div>
                </div>
              )}
              {cred.url && (
                <div className={`${shell} p-3`}>
                  <div className="text-xs text-neutral-400">URL</div>
                  <a className="text-sm text-[#D4AF37] hover:underline" href={cred.url} target="_blank" rel="noreferrer">{cred.url}</a>
                </div>
              )}
              <div className={`${shell} p-3 col-span-2`}>
                <div className="text-xs text-neutral-400">Last updated</div>
                <div className="text-sm">{new Date(cred.updatedAt).toLocaleString()}</div>
              </div>
            </div>

            {/* Audit log */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Activity</div>
              <div className="space-y-2">
                {audit.length === 0 ? (
                  <div className="text-xs text-neutral-500">No recent actions.</div>
                ) : (
                  audit.map((a, i) => (
                    <div key={i} className="text-xs text-neutral-300 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#D4AF37] inline-block" />
                      {a.action} · {new Date(a.ts).toLocaleTimeString()}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Reveal confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#0F0F13] text-white border border-[#2A2A33]">
          <DialogHeader>
            <DialogTitle className="text-base">Verify to reveal</DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              For your security, confirm this action. You can integrate OTP / device biometric here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label className="text-xs text-neutral-300">One-time code</Label>
            <Input placeholder="Enter 6-digit code" className="bg-[#111111] border-[#2A2A33] text-white"/>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" className="text-neutral-300 hover:text-white" onClick={()=>setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]" onClick={confirmReveal}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Enhanced Share Content Component
function EnhancedShareContent({ 
  onClose, 
  credential 
}: { 
  onClose: () => void;
  credential: {id: string; title: string};
}) {
  const [linkEnabled, setLinkEnabled] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [expiry, setExpiry] = useState('7d');
  const [requireLogin, setRequireLogin] = useState(false);
  const [sendMode, setSendMode] = useState<'email' | 'sms'>('email');
  const [recipientInput, setRecipientInput] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [peekData, setPeekData] = useState<{title: string; credentialId: string} | null>(null);
  const [audit, setAudit] = useState([
    { event: 'Credential created', ts: Date.now() - 86400000 },
    { event: 'Sharing enabled', ts: Date.now() - 3600000 }
  ]);

  // Family directory
  const DIRECTORY = [
    { id: 'kassandra', name: 'Kassandra', email: 'kass@family.com', type: 'member' },
    { id: 'dad', name: 'Dad', email: 'dad@family.com', type: 'member' },
    { id: 'mom', name: 'Mom', email: 'mom@family.com', type: 'member' },
    { id: 'family-group', name: 'Family Group', type: 'group' }
  ];

  const [shares, setShares] = useState([
    { personId: 'kassandra', permission: 'view' },
    { personId: 'family-group', permission: 'none' }
  ]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setAudit(prev => [{ event: 'Link copied', ts: Date.now() }, ...prev]);
  };

  const handleRegenerateLink = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/credentials/${credential.id}/shares/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiresIn: expiry,
          requireLogin
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.url);
        setAudit(prev => [{ event: 'Link regenerated', ts: Date.now() }, ...prev]);
        
        // Verify the token resolves correctly
        await verifyToken(data.token);
      } else {
        console.error('Failed to generate share link');
        setAudit(prev => [{ event: 'Link generation failed', ts: Date.now() }, ...prev]);
      }
    } catch (error) {
      console.error('Error generating share link:', error);
      setAudit(prev => [{ event: 'Link generation error', ts: Date.now() }, ...prev]);
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`/api/share/${token}/peek`);
      if (response.ok) {
        const data = await response.json();
        setPeekData(data);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  // Generate initial share link on component mount
  React.useEffect(() => {
    if (!shareUrl) {
      handleRegenerateLink();
    }
  }, []);

  const handleLinkToggle = (enabled: boolean) => {
    setLinkEnabled(enabled);
    setAudit(prev => [{ event: `Sharing ${enabled ? 'enabled' : 'disabled'}`, ts: Date.now() }, ...prev]);
  };

  const updatePermission = (personId: string, permission: string) => {
    const person = DIRECTORY.find(m => m.id === personId);
    setShares(prev => prev.map(share => 
      share.personId === personId ? { ...share, permission } : share
    ));
    setAudit(prev => [{ event: `${person?.name} permission changed to ${permission}`, ts: Date.now() }, ...prev]);
  };

  const addShare = (personId: string) => {
    if (!shares.find(s => s.personId === personId)) {
      const person = DIRECTORY.find(m => m.id === personId);
      setShares(prev => [...prev, { personId, permission: 'view' }]);
      setAudit(prev => [{ event: `${person?.name} added with view permission`, ts: Date.now() }, ...prev]);
    }
  };

  const removeShare = (personId: string) => {
    const person = DIRECTORY.find(m => m.id === personId);
    setShares(prev => prev.filter(s => s.personId !== personId));
    setAudit(prev => [{ event: `${person?.name} removed from sharing`, ts: Date.now() }, ...prev]);
  };

  const addRecipient = () => {
    if (recipientInput.trim() && !recipients.includes(recipientInput.trim())) {
      setRecipients(prev => [...prev, recipientInput.trim()]);
      setAudit(prev => [{ event: `Recipient ${recipientInput.trim()} added`, ts: Date.now() }, ...prev]);
      setRecipientInput('');
    }
  };

  const removeRecipient = (index: number) => {
    const recipient = recipients[index];
    setRecipients(prev => prev.filter((_, i) => i !== index));
    setAudit(prev => [{ event: `Recipient ${recipient} removed`, ts: Date.now() }, ...prev]);
  };

  const handleSend = () => {
    if (!linkEnabled) {
      console.log('Cannot send - link is disabled');
      return;
    }
    console.log(`Sending via ${sendMode} to:`, recipients);
    setAudit(prev => [{ event: `Link sent via ${sendMode} to ${recipients.length} recipient(s)`, ts: Date.now() }, ...prev]);
  };

  const handleSave = () => {
    console.log('Saving sharing settings');
    setAudit(prev => [{ event: 'Sharing settings updated', ts: Date.now() }, ...prev]);
  };

  const availableMembers = DIRECTORY.filter(member => !shares.find(s => s.personId === member.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-neutral-400">Control who can view or manage this credential.</p>
      </div>

      {/* Section 1: Shareable Link */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Switch 
            checked={linkEnabled}
            onCheckedChange={handleLinkToggle}
            className="fcs-switch"
          />
          <Label className="text-sm text-white">Enable shareable link</Label>
        </div>
        
        {linkEnabled && (
          <div className="p-4 rounded-xl border border-[#232530] bg-[#111111] space-y-3">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[#D4AF37]" />
              <span className="text-xs text-neutral-400">Anyone with this link can view this credential</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input 
                  value={shareUrl || (isGenerating ? 'Generating secure link...' : 'Click Regenerate to create link')}
                  readOnly
                  className="bg-[#0A0A0F] border-[#232530] text-neutral-300 text-xs"
                />
                <Button 
                  size="sm" 
                  onClick={handleCopyLink} 
                  className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]"
                  disabled={!shareUrl || isGenerating}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRegenerateLink} 
                  className="border-[#232530] text-neutral-300 hover:text-white"
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </Button>
              </div>
              
              {/* Peek verification */}
              {peekData && (
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                  ✓ Link resolves to {peekData.title}
                </div>
              )}
              
              {peekData && peekData.credentialId !== credential.id && (
                <div className="text-xs text-amber-400 flex items-center gap-1">
                  <div className="w-1 h-1 bg-amber-400 rounded-full"></div>
                  ⚠️ This link resolves to {peekData.title}, not {credential.title}
                </div>
              )}
            </div>

            {/* Security Options */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#232530]">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-neutral-400">Expires:</Label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger className="w-20 bg-black text-white border-[#232530] text-xs h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border-[#232530]">
                    <SelectItem value="24h" className="hover:bg-white/10 text-xs">24h</SelectItem>
                    <SelectItem value="7d" className="hover:bg-white/10 text-xs">7d</SelectItem>
                    <SelectItem value="30d" className="hover:bg-white/10 text-xs">30d</SelectItem>
                    <SelectItem value="never" className="hover:bg-white/10 text-xs">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={requireLogin}
                  onCheckedChange={setRequireLogin}
                  className="fcs-switch"
                />
                <Label className="text-xs text-neutral-400">Require login</Label>
                <Info className="h-3 w-3 text-neutral-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-[#232530]" />

      {/* Section 2: Share with Family Members */}
      <div className="space-y-3">
        <Label className="text-sm text-white">Share with Family Members</Label>
        
        <div className="space-y-2">
          {shares.map((share) => {
            const person = DIRECTORY.find(m => m.id === share.personId);
            if (!person) return null;
            
            return (
              <div key={share.personId} className="flex items-center justify-between rounded-2xl bg-[#111111] p-3 border border-[#232530]">
                <div className="min-w-0">
                  <div className="text-sm truncate">{person.name}</div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {person.email || (person.type === 'group' ? 'Group' : 'Member')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={share.permission} onValueChange={(v) => updatePermission(share.personId, v)}>
                    <SelectTrigger className="w-[120px] bg-black text-white border-[#232530]">
                      <SelectValue placeholder="Permission" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border-[#232530]">
                      <SelectItem value="none" className="hover:bg-white/10 focus:bg-white/10">None</SelectItem>
                      <SelectItem value="view" className="hover:bg-white/10 focus:bg-white/10">View</SelectItem>
                      <SelectItem value="edit" className="hover:bg-white/10 focus:bg-white/10">Edit</SelectItem>
                      <SelectItem value="owner" className="hover:bg-white/10 focus:bg-white/10">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-neutral-400 hover:text-white" 
                    onClick={() => removeShare(share.personId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add another member */}
        <div className="mt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:text-white hover:bg-[#D4AF37]/10">
                + Add another member
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white border border-[#232530] min-w-[260px]">
              {availableMembers.map((person) => (
                <DropdownMenuItem 
                  key={person.id} 
                  className="hover:bg-white/10" 
                  onClick={() => addShare(person.id)}
                >
                  <div>
                    <div className="text-sm">{person.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      {person.email || (person.type === 'group' ? 'Group' : 'Member')}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator className="bg-[#232530]" />

      {/* Section 3: Send Link Directly */}
      <div className="space-y-3">
        <Label className="text-sm text-white">Send Link Directly</Label>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={sendMode} onValueChange={(v: 'email' | 'sms') => setSendMode(v)}>
            <SelectTrigger className="w-[120px] bg-black text-white border-[#232530]">
              <SelectValue placeholder="Email" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white border-[#232530]">
              <SelectItem value="email" className="hover:bg-white/10">Email</SelectItem>
              <SelectItem value="sms" className="hover:bg-white/10">SMS</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder={sendMode === 'email' ? 'name@example.com' : '+1 (555) 555-5555'}
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            className="bg-black text-white border-[#232530]"
            onKeyDown={(e) => e.key === 'Enter' && addRecipient()}
          />
          <Button className="bg-[#D4AF37] text-black" onClick={addRecipient}>
            Add
          </Button>
        </div>

        {/* Recipients List */}
        {recipients.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {recipients.map((recipient, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[#111111] border border-[#232530] px-2 py-1 text-xs">
                {recipient}
                <button onClick={() => removeRecipient(i)} className="text-neutral-400 hover:text-white">
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mt-2">
          <Button 
            variant="outline" 
            className="border-[#232530] text-white hover:bg-white/10 disabled:opacity-50" 
            onClick={handleSend}
            disabled={recipients.length === 0 || !linkEnabled}
          >
            Send {sendMode.toUpperCase()}
          </Button>
          {!linkEnabled && recipients.length > 0 && (
            <div className="text-xs text-amber-400 mt-1">Enable the shareable link to send notifications</div>
          )}
        </div>
      </div>

      <Separator className="bg-[#232530]" />

      {/* Audit Log */}
      <div className="space-y-3">
        <Label className="text-sm text-white">Recent Activity</Label>
        {audit.length === 0 ? (
          <div className="text-xs text-neutral-500">No recent actions</div>
        ) : (
          <div className="max-h-32 overflow-y-auto space-y-1">
            {audit.slice(0, 5).map((entry, i) => (
              <div key={i} className="text-xs text-neutral-300 flex justify-between">
                <span>• {entry.event}</span>
                <span className="text-neutral-500">{new Date(entry.ts).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Actions */}
      <div className="flex justify-end gap-3">
        <Button onClick={handleSave} className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]">
          Update Sharing
        </Button>
        <Button variant="ghost" onClick={onClose} className="text-neutral-300 hover:text-white">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Side Panel Component for Edit/View/Share
function CredentialSidePanel({ 
  isOpen, 
  mode, 
  credential, 
  onClose 
}: { 
  isOpen: boolean; 
  mode: 'edit' | 'view' | 'share'; 
  credential: {id: string; title: string} | null; 
  onClose: () => void;
}) {
  if (!credential) return null;

  const getTitleByMode = () => {
    switch (mode) {
      case 'edit': return `Edit ${credential.title}`;
      case 'view': return `View ${credential.title}`;
      case 'share': return `Share ${credential.title}`;
      default: return credential.title;
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'edit':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-neutral-300">Credential Name</Label>
                <Input 
                  defaultValue={credential.title}
                  className="mt-1 bg-[#111111] border-[#232530] text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-neutral-300">Username</Label>
                <Input 
                  defaultValue="angel@family.com"
                  className="mt-1 bg-[#111111] border-[#232530] text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-neutral-300">Password</Label>
                <Input 
                  type="password"
                  defaultValue="MySecretPass123"
                  className="mt-1 bg-[#111111] border-[#232530] text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-neutral-300">URL</Label>
                <Input 
                  defaultValue="https://icloud.com"
                  className="mt-1 bg-[#111111] border-[#232530] text-white"
                />
              </div>
              <div>
                <Label className="text-sm text-neutral-300">Notes</Label>
                <Input 
                  defaultValue="Personal iCloud account"
                  className="mt-1 bg-[#111111] border-[#232530] text-white"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]">
                Save Changes
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-neutral-300 hover:text-white">
                Cancel
              </Button>
            </div>
          </div>
        );
      
      case 'share':
        return <EnhancedShareContent onClose={onClose} credential={credential} />;

      case 'view':
      default:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-xl border border-[#232530] bg-[#111111] p-4">
                <div className="text-xs text-neutral-400 mb-1">Username</div>
                <div className="text-sm text-white">angel@family.com</div>
              </div>
              <div className="rounded-xl border border-[#232530] bg-[#111111] p-4">
                <div className="text-xs text-neutral-400 mb-1">URL</div>
                <a href="https://icloud.com" className="text-sm text-[#D4AF37] hover:underline" target="_blank" rel="noreferrer">
                  https://icloud.com
                </a>
              </div>
              <div className="rounded-xl border border-[#232530] bg-[#111111] p-4">
                <div className="text-xs text-neutral-400 mb-1">Last Updated</div>
                <div className="text-sm text-white">{new Date().toLocaleDateString()}</div>
              </div>
              <div className="rounded-xl border border-[#232530] bg-[#111111] p-4">
                <div className="text-xs text-neutral-400 mb-1">Notes</div>
                <div className="text-sm text-white">Personal iCloud account</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose} className="text-neutral-300 hover:text-white">
                Close
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[480px] bg-[#0A0A0F] text-[#F4F4F6] border-l border-[#232530]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg text-white">{getTitleByMode()}</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="mt-6">
          {renderContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Mock data
const passwordManagers = [
  {
    id: '1',
    name: "Angel's Password Manager",
    count: 2,
  },
  {
    id: '2',
    name: "Kassandra's Password Manager", 
    count: 2,
  },
];

const passwords = [
  {
    id: '1',
    title: "Angel's Phone Password",
    owner: "Angel",
    tag: "Device",
  },
  {
    id: '2',
    title: "Home Wi-Fi",
    owner: "House",
    tag: "Network",
  },
  {
    id: '3',
    title: "Garage Door Code",
    owner: "Home",
    tag: "Access",
  },
  {
    id: '4',
    title: "Angel's Laptop Password",
    owner: "Angel", 
    tag: "Device",
  },
  {
    id: '5',
    title: "Code To Safe",
    owner: "Home",
    tag: "Access",
  },
  {
    id: '6',
    title: "Kassandra's Phone Password",
    owner: "Kassandra",
    tag: "Device",
  },
];

export default function FamilyPasswords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [location, navigate] = useLocation();
  const params = useParams();

  // Side panel state
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [sidePanelMode, setSidePanelMode] = useState<'edit' | 'view' | 'share'>('view');
  const [selectedCredential, setSelectedCredential] = useState<{id: string; title: string} | null>(null);

  // Extract credential ID from URL
  const credentialId = params.id;
  const isDetailOpen = !!credentialId;

  const handleNavigateToDetail = (id: string) => {
    navigate(`/family/passwords/${id}`);
  };

  const handleCloseDetail = () => {
    navigate('/family/passwords');
  };

  // Side panel handlers
  const handleEdit = (id: string, title: string) => {
    setSelectedCredential({ id, title });
    setSidePanelMode('edit');
    setSidePanelOpen(true);
  };

  const handleView = (id: string, title: string) => {
    setSelectedCredential({ id, title });
    setSidePanelMode('view');
    setSidePanelOpen(true);
  };

  const handleShare = (id: string, title: string) => {
    setSelectedCredential({ id, title });
    setSidePanelMode('share');
    setSidePanelOpen(true);
  };

  const handleCloseSidePanel = () => {
    setSidePanelOpen(false);
    setSelectedCredential(null);
  };

  const filteredPasswordManagers = passwordManagers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOwner = !ownerFilter || ownerFilter === 'all-owners' || password.owner === ownerFilter;
    const matchesType = !typeFilter || typeFilter === 'all-types' || password.tag === typeFilter;
    return matchesSearch && matchesOwner && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F4F4F6]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Passwords</h1>
            <p className="text-sm text-neutral-400">Securely store and share credentials across the family.</p>
          </div>
          <Button className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] rounded-full px-5">
            Add credential
          </Button>
        </div>

        {/* Search + filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 rounded-xl border border-[#232530] bg-[#13141B] px-3 py-2">
              <Search className="h-4 w-4 text-neutral-400" />
              <input 
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-neutral-500"
                placeholder="Search by name, site, or owner" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="rounded-xl border-[#232530] bg-[#13141B] text-white">
                <SelectValue placeholder="All Owners" />
              </SelectTrigger>
              <SelectContent className="bg-[#13141B] border-[#232530]">
                <SelectItem value="all-owners">All Owners</SelectItem>
                <SelectItem value="Angel">Angel</SelectItem>
                <SelectItem value="Kassandra">Kassandra</SelectItem>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="House">House</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="rounded-xl border-[#232530] bg-[#13141B] text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#13141B] border-[#232530]">
                <SelectItem value="all-types">All Types</SelectItem>
                <SelectItem value="Device">Device</SelectItem>
                <SelectItem value="Network">Network</SelectItem>
                <SelectItem value="Access">Access</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Password Managers Section */}
        <h2 className="text-sm font-semibold tracking-wide text-neutral-300 mb-3">Password Managers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {filteredPasswordManagers.map((manager) => (
            <ManagerCard 
              key={manager.id} 
              name={manager.name} 
              count={manager.count} 
            />
          ))}
        </div>

        {/* Passwords Section */}
        <h2 className="text-sm font-semibold tracking-wide text-neutral-300 mb-3">Passwords</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredPasswords.map((password) => (
            <CredentialCard 
              key={password.id}
              id={password.id}
              title={password.title} 
              owner={password.owner}
              tag={password.tag}
              onNavigate={handleNavigateToDetail}
              onEdit={handleEdit}
              onView={handleView}
              onShare={handleShare}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPasswordManagers.length === 0 && filteredPasswords.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Key className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No passwords found</h3>
            <p className="text-neutral-400">Try adjusting your search terms or add a new credential.</p>
          </div>
        )}
      </div>

      {/* Detail Slide-over */}
      {credentialId && (
        <CredentialDetail
          credentialId={credentialId}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
        />
      )}

      {/* Side Panel for Edit/View/Share */}
      <CredentialSidePanel
        isOpen={sidePanelOpen}
        mode={sidePanelMode}
        credential={selectedCredential}
        onClose={handleCloseSidePanel}
      />
    </div>
  );
}