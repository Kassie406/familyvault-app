import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Search, Key, Eye, EyeOff, Copy, BadgeCheck, X, MoreVertical, Edit, Share, Trash2, Link2, Users, UserRound, UsersRound, Send, Plus, Info, Home, Smartphone, Tv, LockKeyhole, ArrowLeft } from 'lucide-react';
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

// Types
type ManagerId = "angel" | "kassandra";
type SectionKey = "home" | "devices" | "entertainment" | "personal" | "other";

type Credential = {
  id: string;
  title: string;
  owner: ManagerId;
  section: SectionKey;
  tag: string;
  meta?: { ownerLabel?: string; typeLabel?: string };
};

// Section metadata
const SECTION_META: Record<SectionKey, { label: string; sub: string; icon: React.ReactNode }> = {
  home: { label: "Home", sub: "WiFi, codes, home access", icon: <Home className="h-4 w-4" /> },
  devices: { label: "Devices & Electronics", sub: "Phones, laptops, smart devices", icon: <Smartphone className="h-4 w-4" /> },
  entertainment: { label: "Entertainment & Subscriptions", sub: "Streaming, music, media", icon: <Tv className="h-4 w-4" /> },
  personal: { label: "Personal Accounts", sub: "Banking, email, personal services", icon: <LockKeyhole className="h-4 w-4" /> },
  other: { label: "Other", sub: "Uncategorized credentials", icon: <span className="text-neutral-300">📁</span> },
};

// Mock data - replace with real API
const ALL_CREDENTIALS: Credential[] = [
  { id: "c1", title: "Home Wi-Fi", owner: "angel", section: "home", tag: "Network", meta: { ownerLabel: "Angel", typeLabel: "Network"} },
  { id: "c2", title: "Garage Door Code", owner: "angel", section: "home", tag: "Access", meta: { ownerLabel: "Home", typeLabel: "Access"} },
  { id: "c3", title: "Angel's Phone Password", owner: "angel", section: "devices", tag: "Device", meta: { ownerLabel: "Angel", typeLabel: "Device"} },
  { id: "c4", title: "Angel's Laptop Password", owner: "angel", section: "devices", tag: "Device", meta: { ownerLabel: "Angel", typeLabel: "Device"} },
  { id: "c5", title: "Angel's Bank Account", owner: "angel", section: "personal", tag: "Finance", meta: { ownerLabel: "Angel", typeLabel: "Finance"} },
  { id: "k1", title: "Safe Code", owner: "kassandra", section: "home", tag: "Access", meta: { ownerLabel: "Kassandra", typeLabel: "Access"} },
  { id: "k2", title: "Kassandra's Phone Password", owner: "kassandra", section: "devices", tag: "Device", meta: { ownerLabel: "Kassandra", typeLabel: "Device"} },
  { id: "k3", title: "Netflix", owner: "kassandra", section: "entertainment", tag: "Entertainment", meta: { ownerLabel: "Home", typeLabel: "Entertainment"} },
  { id: "k4", title: "Spotify Family", owner: "kassandra", section: "entertainment", tag: "Entertainment", meta: { ownerLabel: "Kassandra", typeLabel: "Entertainment"} },
];

const MANAGER_NAMES: Record<ManagerId, string> = {
  angel: "Angel's Password Manager",
  kassandra: "Kassandra's Password Manager",
};

// Card Shell Component
function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F]
                     shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all
                     hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] ${className}`}>
      {children}
    </div>
  );
}

// Section Header Component
function SectionHeader({ icon, title, sub, onAdd }: {
  icon: React.ReactNode; 
  title: string; 
  sub: string; 
  onAdd: () => void;
}) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 grid place-items-center rounded-lg bg-[#111214] border border-[#232530] text-neutral-300">
          {icon}
        </div>
        <div>
          <div className="text-[15px] text-white font-medium">{title}</div>
          <div className="text-xs text-neutral-500">{sub}</div>
        </div>
      </div>
      <button onClick={onAdd} className="flex items-center gap-2 text-sm text-[#D4AF37] hover:underline">
        <Plus className="h-4 w-4" /> Add
      </button>
    </div>
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
  owner: string;
  tag: string;
  onNavigate: (id: string) => void;
  onEdit: (id: string, title: string) => void;
  onView: (id: string, title: string) => void;
  onShare: (id: string, title: string) => void;
}) {
  return (
    <Shell className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111214] border border-[#232530] text-neutral-300">
          🔑
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-white font-medium truncate">{title}</div>
          <div className="text-xs text-neutral-500 mt-0.5">
            Owner: <span className="text-neutral-300">{owner}</span>
            <span className="text-neutral-600"> • </span>
            <span className="text-neutral-400">{tag}</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            <button 
              className="text-[#D4AF37] hover:underline"
              onClick={() => onView(id, title)}
            >
              Reveal
            </button>
            <span className="text-neutral-600">•</span>
            <button className="text-neutral-300 hover:text-white">Copy</button>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 grid place-items-center rounded-lg text-neutral-400 hover:text-white">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#111214] border-[#232530]">
            <DropdownMenuItem onClick={() => onEdit(id, title)} className="text-white hover:bg-[#232530]">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(id, title)} className="text-white hover:bg-[#232530]">
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(id, title)} className="text-white hover:bg-[#232530]">
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Shell>
  );
}

// Enhanced Share Content Component (simplified for this example)
function EnhancedShareContent({ 
  onClose, 
  passwordTitle,
  shareSettings,
  setShareSettings,
  generatedLink,
  isGenerating,
  onGenerateLink,
  onCopyLink
}: any) {
  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="require-login" className="text-sm text-white">Require login to view</Label>
          <Switch
            id="require-login"
            checked={shareSettings.requireLogin}
            onCheckedChange={(checked) => setShareSettings({...shareSettings, requireLogin: checked})}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-expire" className="text-sm text-white">Auto-expire link</Label>
          <Switch
            id="auto-expire"
            checked={shareSettings.autoExpire}
            onCheckedChange={(checked) => setShareSettings({...shareSettings, autoExpire: checked})}
          />
        </div>

        {shareSettings.autoExpire && (
          <div className="space-y-2">
            <Label className="text-sm text-white">Expires after</Label>
            <Select 
              value={shareSettings.expiryDays.toString()} 
              onValueChange={(value) => setShareSettings({...shareSettings, expiryDays: parseInt(value)})}
            >
              <SelectTrigger className="bg-[#111214] border-[#232530] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111214] border-[#232530]">
                <SelectItem value="1" className="text-white">1 day</SelectItem>
                <SelectItem value="7" className="text-white">7 days</SelectItem>
                <SelectItem value="30" className="text-white">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!generatedLink ? (
          <Button 
            onClick={onGenerateLink}
            disabled={isGenerating}
            className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
          >
            {isGenerating ? 'Generating...' : 'Generate share link'}
          </Button>
        ) : (
          <>
            <div className="p-3 bg-[#111214] border border-[#232530] rounded-lg">
              <p className="text-xs text-neutral-400 mb-2">Share link generated:</p>
              <p className="text-sm text-white font-mono break-all">{generatedLink}</p>
            </div>
            <Button 
              onClick={onCopyLink}
              className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
            >
              Copy link
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ManagerDetailPage() {
  const { managerId } = useParams<{ managerId: ManagerId }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [sharePasswordId, setSharePasswordId] = useState<string | null>(null);
  const [sharePasswordTitle, setSharePasswordTitle] = useState<string>('');
  const [shareSettings, setShareSettings] = useState({
    requireLogin: false,
    autoExpire: true,
    accessCount: 1,
    expiryDays: 7,
  });
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const managerName = MANAGER_NAMES[(managerId ?? "angel") as ManagerId];

  // Filter credentials for this manager
  const managerCredentials = useMemo(() => {
    return ALL_CREDENTIALS.filter(c => c.owner === managerId);
  }, [managerId]);

  // Apply search and type filters
  const filteredCredentials = useMemo(() => {
    return managerCredentials.filter(credential => {
      const matchesSearch = credential.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           credential.tag.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || credential.tag.toLowerCase() === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [managerCredentials, searchTerm, selectedType]);

  // Group credentials by section
  const groupedCredentials: Record<SectionKey, Credential[]> = useMemo(() => {
    const grouped: Record<SectionKey, Credential[]> = { 
      home: [], 
      devices: [], 
      entertainment: [], 
      personal: [], 
      other: [] 
    };
    filteredCredentials.forEach(c => grouped[c.section]?.push(c));
    return grouped;
  }, [filteredCredentials]);

  // Handlers
  const navigateBack = () => {
    setLocation('/family/passwords');
  };

  const handleNavigateToDetail = (id: string) => {
    window.location.href = `/family/passwords/credential/${id}`;
  };

  const handleEdit = (id: string, title: string) => {
    console.log('Edit password:', id, title);
  };

  const handleView = (id: string, title: string) => {
    console.log('View password:', id, title);
  };

  const handleShare = (id: string, title: string) => {
    setSharePasswordId(id);
    setSharePasswordTitle(title);
    setIsShareSheetOpen(true);
  };

  const openAddModal = (section: SectionKey) => {
    console.log("Add", section, "for", managerId);
  };

  const generateShareLink = async () => {
    if (!sharePasswordId || isGenerating) return;

    setIsGenerating(true);
    setGeneratedLink(null);
    
    try {
      const response = await fetch('/api/share/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credentialId: sharePasswordId,
          settings: shareSettings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate share link');
      }

      const data = await response.json();
      const shareUrl = `${window.location.origin}/share/${data.shareId}`;
      setGeneratedLink(shareUrl);
      
      toast({
        title: "Share link generated!",
        description: "Your secure share link is ready to use.",
      });
    } catch (error: any) {
      console.error('Error generating share link:', error);
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Share link copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button 
          onClick={navigateBack}
          className="text-neutral-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Passwords
        </button>
        <span className="text-neutral-600">/</span>
        <span className="text-white">{managerName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{managerName}</h1>
          <p className="text-sm text-neutral-400">Manage credentials for this vault.</p>
        </div>
        <Button 
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
          onClick={() => openAddModal('other')}
        >
          Add credential
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#111214] border-[#232530] text-white placeholder-neutral-400"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[180px] bg-[#111214] border-[#232530] text-white">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-[#111214] border-[#232530]">
            <SelectItem value="all" className="text-white">All Types</SelectItem>
            <SelectItem value="device" className="text-white">Device</SelectItem>
            <SelectItem value="network" className="text-white">Network</SelectItem>
            <SelectItem value="access" className="text-white">Access</SelectItem>
            <SelectItem value="entertainment" className="text-white">Entertainment</SelectItem>
            <SelectItem value="finance" className="text-white">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const items = groupedCredentials[key];
          return (
            <Shell key={key} className="p-5">
              <SectionHeader 
                icon={meta.icon} 
                title={meta.label} 
                sub={`${meta.sub} • ${items.length} items`} 
                onAdd={() => openAddModal(key)} 
              />
              {items.length === 0 ? (
                <div className="text-xs text-neutral-500 pl-1">No items yet.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {items.map(credential => (
                    <CredentialCard 
                      key={credential.id} 
                      id={credential.id}
                      title={credential.title}
                      owner={credential.meta?.ownerLabel || credential.owner}
                      tag={credential.tag}
                      onNavigate={handleNavigateToDetail}
                      onEdit={handleEdit}
                      onView={handleView}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )}
            </Shell>
          );
        })}
      </div>

      {/* Share Sheet */}
      <Sheet open={isShareSheetOpen} onOpenChange={setIsShareSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#0F0F0F] border-l border-[#232530]">
          <SheetHeader>
            <SheetTitle className="text-white">Share Credential</SheetTitle>
          </SheetHeader>
          <EnhancedShareContent 
            onClose={() => setIsShareSheetOpen(false)}
            passwordTitle={sharePasswordTitle}
            shareSettings={shareSettings}
            setShareSettings={setShareSettings}
            generatedLink={generatedLink}
            isGenerating={isGenerating}
            onGenerateLink={generateShareLink}
            onCopyLink={() => generatedLink && copyToClipboard(generatedLink)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}