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
  Receipt,
  DollarSign,
  StickyNote,
  FolderOpen,
  Calendar,
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
type TaxYearId = "2025" | "2024" | "2023" | "2022" | "2021";
type SectionKey = "documents" | "forms" | "payments" | "notes" | "other";

type TaxItem = {
  id: string;
  title: string;
  taxYear: TaxYearId;
  section: SectionKey;
  category: string;
  value?: string;
  isRevealed?: boolean;
  meta?: { label?: string; sensitive?: boolean };
};

// Section metadata
const SECTION_META: Record<SectionKey, { label: string; sub: string; icon: React.ReactNode }> = {
  documents: { label: "Documents", sub: "W2s, 1099s, receipts, supporting docs", icon: <FileText className="h-4 w-4" /> },
  forms: { label: "Forms", sub: "State, federal, amendments, tax forms", icon: <Receipt className="h-4 w-4" /> },
  payments: { label: "Payments & Refunds", sub: "IRS payments, refund confirmations", icon: <DollarSign className="h-4 w-4" /> },
  notes: { label: "Notes", sub: "Accountant notes, family reminders", icon: <StickyNote className="h-4 w-4" /> },
  other: { label: "Other", sub: "Uncategorized tax items", icon: <FolderOpen className="h-4 w-4" /> },
};

// Mock data - replace with real API
const ALL_TAX_ITEMS: TaxItem[] = [
  // 2024 Tax Year - Documents
  { id: "2024-d1", title: "W2 - Johnson Company", taxYear: "2024", section: "documents", category: "W2", value: "Salary: $75,000" },
  { id: "2024-d2", title: "1099-INT - Chase Bank", taxYear: "2024", section: "documents", category: "1099", value: "Interest: $245", meta: { sensitive: true } },
  { id: "2024-d3", title: "Medical Receipts", taxYear: "2024", section: "documents", category: "Receipt", value: "Total: $3,200" },
  { id: "2024-d4", title: "Mortgage Interest Statement", taxYear: "2024", section: "documents", category: "1098", value: "Interest: $8,500" },
  
  // 2024 Tax Year - Forms
  { id: "2024-f1", title: "Form 1040 (Federal)", taxYear: "2024", section: "forms", category: "Federal", value: "Filed: March 15, 2025" },
  { id: "2024-f2", title: "State Tax Return", taxYear: "2024", section: "forms", category: "State", value: "Status: Pending" },
  { id: "2024-f3", title: "Schedule A (Itemized)", taxYear: "2024", section: "forms", category: "Schedule", value: "Deductions: $18,500" },
  
  // 2024 Tax Year - Payments & Refunds
  { id: "2024-p1", title: "Federal Refund", taxYear: "2024", section: "payments", category: "Refund", value: "$2,300", meta: { sensitive: true } },
  { id: "2024-p2", title: "State Tax Payment", taxYear: "2024", section: "payments", category: "Payment", value: "$450", meta: { sensitive: true } },
  { id: "2024-p3", title: "Estimated Tax Q4", taxYear: "2024", section: "payments", category: "Estimated", value: "$1,200" },
  
  // 2024 Tax Year - Notes
  { id: "2024-n1", title: "Accountant Consultation", taxYear: "2024", section: "notes", category: "Note", value: "Discussed retirement planning options" },
  { id: "2024-n2", title: "Audit Documentation", taxYear: "2024", section: "notes", category: "Note", value: "Keep receipts for 7 years" },
  
  // 2024 Tax Year - Other
  { id: "2024-o1", title: "Tax Software License", taxYear: "2024", section: "other", category: "Software", value: "TurboTax Premium • $89" },
];

const TAX_YEAR_NAMES: Record<TaxYearId, string> = {
  "2025": "2025 Tax Return",
  "2024": "2024 Tax Return", 
  "2023": "2023 Tax Return",
  "2022": "2022 Tax Return",
  "2021": "2021 Tax Return",
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

// Tax Item Card Component
function TaxItemCard({ 
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
          {category === 'W2' || category === '1099' || category === '1098' ? <FileText className="h-4 w-4" /> :
           category === 'Federal' || category === 'State' || category === 'Schedule' ? <Receipt className="h-4 w-4" /> :
           category === 'Refund' || category === 'Payment' || category === 'Estimated' ? <DollarSign className="h-4 w-4" /> :
           category === 'Note' ? <StickyNote className="h-4 w-4" /> :
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
            {(category === 'W2' || category === '1099' || category === '1098' || category === 'Federal' || category === 'State') && (
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
            {(category === 'W2' || category === '1099' || category === '1098' || category === 'Federal' || category === 'State') && (
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

export default function TaxYearDetail() {
  const { year: taxYear } = useParams<{ year: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionKey>('documents');

  if (!taxYear || !(taxYear in TAX_YEAR_NAMES)) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Tax year not found</h2>
          <p className="text-neutral-400 mb-4">The tax year you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/family/taxes')} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80">
            Back to Taxes
          </Button>
        </div>
      </div>
    );
  }

  const typedTaxYear = taxYear as TaxYearId;
  const taxYearName = TAX_YEAR_NAMES[typedTaxYear];

  // Get tax items for this year
  const taxItems = useMemo(() => {
    return ALL_TAX_ITEMS.filter(item => item.taxYear === typedTaxYear);
  }, [typedTaxYear]);

  // Apply search and type filters
  const filteredItems = useMemo(() => {
    return taxItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.value && item.value.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.category.toLowerCase() === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [taxItems, searchTerm, selectedType]);

  // Group items by section
  const groupedItems: Record<SectionKey, TaxItem[]> = useMemo(() => {
    const grouped: Record<SectionKey, TaxItem[]> = { 
      documents: [], 
      forms: [], 
      payments: [], 
      notes: [],
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
              onClick={() => setLocation('/family/taxes')}
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white shrink-0">{taxYearName}</h1>
              <p className="text-sm text-neutral-400 mt-1">Tax Year {taxYear} • {taxItems.length} items</p>
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
              placeholder="Search tax documents…"
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
              <SelectItem value="w2" className="text-white">W2</SelectItem>
              <SelectItem value="1099" className="text-white">1099</SelectItem>
              <SelectItem value="federal" className="text-white">Federal</SelectItem>
              <SelectItem value="state" className="text-white">State</SelectItem>
              <SelectItem value="refund" className="text-white">Refund</SelectItem>
              <SelectItem value="note" className="text-white">Note</SelectItem>
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
                      <TaxItemCard 
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