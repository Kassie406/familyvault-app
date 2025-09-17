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
  Scale,
  Paperclip,
  FolderOpen,
  Download,
  Upload,
  AlertCircle,
  Phone,
  Mail
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
type LegalDocId = "angel-will" | "kassandra-will" | "camacho-trust" | "angel-poa" | "kassandra-poa" | "angel-directives" | "kassandra-directives";
type SectionKey = "documents" | "executors" | "notes" | "attachments" | "other";

type LegalItem = {
  id: string;
  title: string;
  legalDocId: LegalDocId;
  section: SectionKey;
  category: string;
  value?: string;
  isRevealed?: boolean;
  meta?: { label?: string; sensitive?: boolean; contact?: string };
};

// Section metadata
const SECTION_META: Record<SectionKey, { label: string; sub: string; icon: React.ReactNode }> = {
  documents: { label: "Documents", sub: "Will PDFs, drafts, notarized copies", icon: <FileText className="h-4 w-4" /> },
  executors: { label: "Executors & Beneficiaries", sub: "Names, roles, contact information", icon: <Users className="h-4 w-4" /> },
  notes: { label: "Legal Notes", sub: "Lawyer comments, conditions, special clauses", icon: <Scale className="h-4 w-4" /> },
  attachments: { label: "Attachments", sub: "Scans, amendments, codicils", icon: <Paperclip className="h-4 w-4" /> },
  other: { label: "Other", sub: "Miscellaneous legal items", icon: <FolderOpen className="h-4 w-4" /> },
};

// Mock data - replace with real API
const ALL_LEGAL_ITEMS: LegalItem[] = [
  // Angel's Will - Documents
  { id: "aw-d1", title: "Last Will & Testament (Final)", legalDocId: "angel-will", section: "documents", category: "Will", value: "Notarized • March 2024" },
  { id: "aw-d2", title: "Will Draft v3", legalDocId: "angel-will", section: "documents", category: "Draft", value: "Working copy • Feb 2024" },
  { id: "aw-d3", title: "Notarized Copy", legalDocId: "angel-will", section: "documents", category: "Notarized", value: "Official • 3.2 MB" },
  { id: "aw-d4", title: "Witness Signatures", legalDocId: "angel-will", section: "documents", category: "Witness", value: "2 witnesses required" },
  
  // Angel's Will - Executors & Beneficiaries
  { id: "aw-e1", title: "Primary Executor", legalDocId: "angel-will", section: "executors", category: "Executor", value: "Kassandra Johnson", meta: { contact: "kassandra@family.com" } },
  { id: "aw-e2", title: "Alternate Executor", legalDocId: "angel-will", section: "executors", category: "Executor", value: "Michael Johnson (Brother)", meta: { contact: "(555) 123-4567" } },
  { id: "aw-e3", title: "Primary Beneficiary", legalDocId: "angel-will", section: "executors", category: "Beneficiary", value: "Kassandra Johnson (Spouse)" },
  { id: "aw-e4", title: "Secondary Beneficiary", legalDocId: "angel-will", section: "executors", category: "Beneficiary", value: "Emma Johnson (Child)" },
  { id: "aw-e5", title: "Contingent Beneficiary", legalDocId: "angel-will", section: "executors", category: "Beneficiary", value: "Johnson Family Trust" },
  
  // Angel's Will - Legal Notes
  { id: "aw-n1", title: "Estate Attorney Notes", legalDocId: "angel-will", section: "notes", category: "Attorney", value: "Review annually or after major life changes" },
  { id: "aw-n2", title: "Special Provisions", legalDocId: "angel-will", section: "notes", category: "Provision", value: "Business ownership transfer clause included" },
  { id: "aw-n3", title: "Tax Considerations", legalDocId: "angel-will", section: "notes", category: "Tax", value: "Consult CPA for estate tax implications" },
  
  // Angel's Will - Attachments
  { id: "aw-a1", title: "Property Deed Copy", legalDocId: "angel-will", section: "attachments", category: "Property", value: "Home deed • Referenced in will" },
  { id: "aw-a2", title: "Business Partnership Agreement", legalDocId: "angel-will", section: "attachments", category: "Business", value: "LLC documents • 1.8 MB" },
  { id: "aw-a3", title: "Life Insurance Beneficiary Forms", legalDocId: "angel-will", section: "attachments", category: "Insurance", value: "Updated March 2024" },
  
  // Angel's Will - Other
  { id: "aw-o1", title: "Attorney Contact Information", legalDocId: "angel-will", section: "other", category: "Contact", value: "Sarah Mitchell, Esq.", meta: { contact: "sarah@legalfirm.com", sensitive: true } },
  { id: "aw-o2", title: "Safe Deposit Box Info", legalDocId: "angel-will", section: "other", category: "Location", value: "First National Bank • Box #1247", meta: { sensitive: true } },
];

const LEGAL_DOC_NAMES: Record<LegalDocId, string> = {
  "angel-will": "Angel's Will",
  "kassandra-will": "Kassandra's Will", 
  "camacho-trust": "Camacho Family Trust",
  "angel-poa": "Angel's Power of Attorney",
  "kassandra-poa": "Kassandra's Power of Attorney",
  "angel-directives": "Angel's Medical Directives",
  "kassandra-directives": "Kassandra's Medical Directives",
};

// Card Shell Component (same as other modules)
function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F]
                     shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all
                     hover:border-[#D4AF37] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] ${className}`}>
      {children}
    </div>
  );
}

// Section Header Component (same as other modules)
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

// Legal Item Card Component
function LegalItemCard({ 
  id, 
  title, 
  value, 
  category, 
  contact,
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
  contact?: string;
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
          {category === 'Will' || category === 'Draft' || category === 'Notarized' ? <FileText className="h-4 w-4" /> :
           category === 'Executor' || category === 'Beneficiary' ? <Users className="h-4 w-4" /> :
           category === 'Attorney' || category === 'Provision' || category === 'Tax' ? <Scale className="h-4 w-4" /> :
           category === 'Property' || category === 'Business' || category === 'Insurance' ? <Paperclip className="h-4 w-4" /> :
           <FolderOpen className="h-4 w-4" />}
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
          {contact && (
            <div className="text-xs text-neutral-400 mt-1">
              {contact.includes('@') ? <Mail className="h-3 w-3 inline mr-1" /> : <Phone className="h-3 w-3 inline mr-1" />}
              {contact}
            </div>
          )}
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
            {(category === 'Will' || category === 'Draft' || category === 'Notarized' || category === 'Property' || category === 'Business') && (
              <>
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
            {(category === 'Will' || category === 'Draft' || category === 'Notarized' || category === 'Property' || category === 'Business') && (
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

export default function LegalDetail() {
  const { id: legalDocId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionKey>('documents');

  if (!legalDocId || !(legalDocId in LEGAL_DOC_NAMES)) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Legal document not found</h2>
          <p className="text-neutral-400 mb-4">The legal document you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/family/legal')} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80">
            Back to Legal
          </Button>
        </div>
      </div>
    );
  }

  const typedLegalDocId = legalDocId as LegalDocId;
  const legalDocName = LEGAL_DOC_NAMES[typedLegalDocId];

  // Get legal items for this document
  const legalItems = useMemo(() => {
    return ALL_LEGAL_ITEMS.filter(item => item.legalDocId === typedLegalDocId);
  }, [typedLegalDocId]);

  // Apply search and type filters
  const filteredItems = useMemo(() => {
    return legalItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.value && item.value.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.category.toLowerCase() === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [legalItems, searchTerm, selectedType]);

  // Group items by section
  const groupedItems: Record<SectionKey, LegalItem[]> = useMemo(() => {
    const grouped: Record<SectionKey, LegalItem[]> = { 
      documents: [], 
      executors: [], 
      notes: [], 
      attachments: [],
      other: [] 
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
              onClick={() => setLocation('/family/legal')}
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white shrink-0">{legalDocName}</h1>
              <p className="text-sm text-neutral-400 mt-1">Legal Document • {legalItems.length} items</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80"
              onClick={() => openAddModal('documents')}
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
              placeholder="Search legal documents…"
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
              <SelectItem value="will" className="text-white">Will</SelectItem>
              <SelectItem value="executor" className="text-white">Executor</SelectItem>
              <SelectItem value="beneficiary" className="text-white">Beneficiary</SelectItem>
              <SelectItem value="attorney" className="text-white">Attorney</SelectItem>
              <SelectItem value="contact" className="text-white">Contact</SelectItem>
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
                      <LegalItemCard 
                        key={item.id} 
                        id={item.id}
                        title={item.title}
                        value={item.value}
                        category={item.category}
                        contact={item.meta?.contact}
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