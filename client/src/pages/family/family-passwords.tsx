import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'wouter';
import { Search, Key, Eye, EyeOff, Copy, BadgeCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        <DropdownDots />
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
  onNavigate 
}: { 
  id: string;
  title: string; 
  owner?: string; 
  tag?: string;
  onNavigate: (id: string) => void;
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
          <DropdownDots />
        </div>
      </Shell>
    </div>
  );
}

// Dropdown Dots Component
function DropdownDots() {
  return (
    <button 
      onClick={(e) => e.stopPropagation()}
      className="h-8 w-8 inline-grid place-items-center rounded-lg border border-transparent text-neutral-400
                 hover:text-white hover:border-[#232530]"
    >
      ⋯
    </button>
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

  // Extract credential ID from URL
  const credentialId = params.id;
  const isDetailOpen = !!credentialId;

  const handleNavigateToDetail = (id: string) => {
    navigate(`/family/passwords/${id}`);
  };

  const handleCloseDetail = () => {
    navigate('/family/passwords');
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
    </div>
  );
}