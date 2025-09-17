import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy, 
  MoreVertical, 
  Edit, 
  Share, 
  Trash2, 
  ArrowLeft,
  FileText,
  Users,
  DollarSign,
  FolderOpen,
  Shield,
  Calendar,
  CreditCard,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { LuxuryCard } from '@/components/luxury-cards';

// Types
type InsuranceId = "angel-life" | "kassandra-life" | "family-medical" | "family-auto" | "homeowners" | "umbrella";
type SectionKey = "policy" | "members" | "financials" | "documents";

type InsuranceItem = {
  id: string;
  title: string;
  insuranceId: InsuranceId;
  section: SectionKey;
  category: string;
  value?: string;
  isRevealed?: boolean;
  meta?: { label?: string; sensitive?: boolean };
};

// Section metadata
const SECTION_META: Record<SectionKey, { label: string; sub: string; icon: React.ReactNode }> = {
  policy: { label: "Policy Details", sub: "Policy number, provider, coverage details", icon: <FileText className="h-4 w-4" /> },
  members: { label: "Insured Members", sub: "Primary insured, beneficiaries, dependents", icon: <Users className="h-4 w-4" /> },
  financials: { label: "Financials", sub: "Premium payments, coverage amounts", icon: <DollarSign className="h-4 w-4" /> },
  documents: { label: "Documents", sub: "Policy docs, claims, ID copies", icon: <FolderOpen className="h-4 w-4" /> },
};

// Mock data - replace with real API
const ALL_INSURANCE_ITEMS: InsuranceItem[] = [
  // Angel's Life Insurance - Policy Details
  { id: "al-p1", title: "Policy Number", insuranceId: "angel-life", section: "policy", category: "Policy", value: "PRU-LIFE-2024-001234", meta: { sensitive: true } },
  { id: "al-p2", title: "Provider Name", insuranceId: "angel-life", section: "policy", category: "Policy", value: "Prudential Life Insurance" },
  { id: "al-p3", title: "Coverage Type", insuranceId: "angel-life", section: "policy", category: "Policy", value: "Term Life • $250,000" },
  { id: "al-p4", title: "Start Date", insuranceId: "angel-life", section: "policy", category: "Policy", value: "January 1, 2023" },
  { id: "al-p5", title: "Renewal Date", insuranceId: "angel-life", section: "policy", category: "Policy", value: "January 1, 2024" },
  
  // Angel's Life Insurance - Insured Members
  { id: "al-m1", title: "Primary Insured", insuranceId: "angel-life", section: "members", category: "Member", value: "Angel Johnson" },
  { id: "al-m2", title: "Spouse", insuranceId: "angel-life", section: "members", category: "Member", value: "Kassandra Johnson" },
  { id: "al-m3", title: "Beneficiary", insuranceId: "angel-life", section: "members", category: "Member", value: "Emma Johnson (Child)" },
  
  // Angel's Life Insurance - Financials
  { id: "al-f1", title: "Premium Amount", insuranceId: "angel-life", section: "financials", category: "Payment", value: "$150 / month" },
  { id: "al-f2", title: "Payment Method", insuranceId: "angel-life", section: "financials", category: "Payment", value: "Bank ACH (ending 1234)", meta: { sensitive: true } },
  { id: "al-f3", title: "Coverage Amount", insuranceId: "angel-life", section: "financials", category: "Payment", value: "$250,000" },
  
  // Angel's Life Insurance - Documents
  { id: "al-d1", title: "LifeInsurance2023.pdf", insuranceId: "angel-life", section: "documents", category: "Document", value: "Policy Document • 2.3 MB" },
  { id: "al-d2", title: "IDProof_Angel.png", insuranceId: "angel-life", section: "documents", category: "Document", value: "ID Proof • 1.1 MB" },
];

const INSURANCE_NAMES: Record<InsuranceId, string> = {
  "angel-life": "Angel's Life Insurance",
  "kassandra-life": "Kassandra's Life Insurance", 
  "family-medical": "Family Medical Insurance",
  "family-auto": "Family Auto Insurance",
  "homeowners": "Homeowners Insurance",
  "umbrella": "Umbrella Insurance Policy",
};

// Card Shell Component (same as password manager)
function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F]
                     shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all
                     hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] ${className}`}>
      {children}
    </div>
  );
}

// Section Header Component (same as password manager)
function SectionHeader({ icon, title, sub, onAdd }: {
  icon: React.ReactNode; 
  title: string; 
  sub: string; 
  onAdd: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg grid place-items-center bg-[#D4AF37] text-black">
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{title}</div>
          <div className="text-xs text-neutral-400">{sub}</div>
        </div>
      </div>
      <Button 
        size="sm" 
        onClick={onAdd}
        className="h-7 w-7 p-0 bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black rounded-lg"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Insurance Item Card Component
function InsuranceItemCard({ 
  id, 
  title, 
  value, 
  category, 
  isRevealed, 
  isSensitive,
  onReveal, 
  onEdit, 
  onView, 
  onShare 
}: {
  id: string;
  title: string;
  value?: string;
  category: string;
  isRevealed?: boolean;
  isSensitive?: boolean;
  onReveal: (id: string, title: string) => void;
  onEdit: (id: string, title: string) => void;
  onView: (id: string, title: string) => void;
  onShare: (id: string, title: string) => void;
}) {
  const displayValue = isSensitive && !isRevealed ? '••••••••••••' : value;
  
  return (
    <Shell className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg grid place-items-center bg-[#111214] border border-[#232530] text-neutral-300">
          {category === 'Document' ? <FolderOpen className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm text-white font-medium truncate">{title}</div>
          <div className="text-xs text-neutral-500 mt-0.5">
            <span className="text-neutral-400">{category}</span>
            {value && (
              <>
                <span className="text-neutral-600"> • </span>
                <span className="text-neutral-300">{displayValue}</span>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3 text-xs">
            {isSensitive && (
              <>
                <button 
                  className="text-[#D4AF37] hover:underline"
                  onClick={() => onReveal(id, title)}
                >
                  {isRevealed ? 'Hide' : 'Reveal'}
                </button>
                <span className="text-neutral-600">•</span>
              </>
            )}
            <button className="text-neutral-300 hover:text-white">Copy</button>
            {category === 'Document' && (
              <>
                <span className="text-neutral-600">•</span>
                <button className="text-neutral-300 hover:text-white">Preview</button>
                <span className="text-neutral-600">•</span>
                <button className="text-neutral-300 hover:text-white">Download</button>
              </>
            )}
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
            {category === 'Document' && (
              <DropdownMenuItem className="text-white hover:bg-[#232530]">
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Shell>
  );
}

export default function InsuranceDetail() {
  const { id: insuranceId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionKey>('policy');

  if (!insuranceId || !(insuranceId in INSURANCE_NAMES)) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Insurance policy not found</h2>
          <p className="text-neutral-400 mb-4">The insurance policy you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/family/insurance')} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80">
            Back to Insurance
          </Button>
        </div>
      </div>
    );
  }

  const typedInsuranceId = insuranceId as InsuranceId;
  const insuranceName = INSURANCE_NAMES[typedInsuranceId];

  // Get insurance items for this policy
  const insuranceItems = useMemo(() => {
    return ALL_INSURANCE_ITEMS.filter(item => item.insuranceId === typedInsuranceId);
  }, [typedInsuranceId]);

  // Apply search and type filters
  const filteredItems = useMemo(() => {
    return insuranceItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.value && item.value.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.category.toLowerCase() === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [insuranceItems, searchTerm, selectedType]);

  // Group items by section
  const groupedItems: Record<SectionKey, InsuranceItem[]> = useMemo(() => {
    const grouped: Record<SectionKey, InsuranceItem[]> = { 
      policy: [], 
      members: [], 
      financials: [], 
      documents: [] 
    };
    filteredItems.forEach(item => grouped[item.section]?.push(item));
    return grouped;
  }, [filteredItems]);

  const handleReveal = (id: string, title: string) => {
    setRevealedItems(prev => {
      const newRevealed = new Set(prev);
      if (newRevealed.has(id)) {
        newRevealed.delete(id);
      } else {
        newRevealed.add(id);
      }
      return newRevealed;
    });
  };

  const handleEdit = (id: string, title: string) => {
    toast({ title: `Edit ${title}` });
  };

  const handleView = (id: string, title: string) => {
    toast({ title: `View ${title}` });
  };

  const handleShare = (id: string, title: string) => {
    toast({ title: `Share ${title}` });
  };

  const openAddModal = (section: SectionKey) => {
    setSelectedSection(section);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-900)]">
      {/* Header */}
      <LuxuryCard className="border-b border-[var(--line-700)] px-8 py-6 rounded-none"
        style={{
          background: 'linear-gradient(135deg, #161616 0%, #0F0F0F 100%)',
          borderRadius: '0'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/family/insurance')}
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white shrink-0">{insuranceName}</h1>
              <p className="text-sm text-neutral-400 mt-1">Life Insurance • {insuranceItems.length} items</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80"
              onClick={() => openAddModal('policy')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search insurance details…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40 bg-[#161616] border-[#2A2A33] text-white">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-[#161616] border-[#2A2A33]">
              <SelectItem value="all" className="text-white">All Types</SelectItem>
              <SelectItem value="policy" className="text-white">Policy</SelectItem>
              <SelectItem value="member" className="text-white">Member</SelectItem>
              <SelectItem value="payment" className="text-white">Payment</SelectItem>
              <SelectItem value="document" className="text-white">Document</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-6">
          {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
            const meta = SECTION_META[key];
            const items = groupedItems[key];
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                      <InsuranceItemCard 
                        key={item.id} 
                        id={item.id}
                        title={item.title}
                        value={item.value}
                        category={item.category}
                        isRevealed={revealedItems.has(item.id)}
                        isSensitive={item.meta?.sensitive}
                        onReveal={handleReveal}
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
      </div>
    </div>
  );
}