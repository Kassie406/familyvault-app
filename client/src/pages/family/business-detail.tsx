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
  DollarSign,
  Scale,
  Users,
  FolderOpen,
  Building2,
  Download,
  Upload,
  AlertCircle,
  Phone,
  Mail,
  Briefcase
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
type BusinessId = "angel-llc" | "kassandra-trust" | "camacho-assembly" | "vendor-agreements" | "subcontractor-contracts" | "client-agreements" | "contractor-license" | "transport-permit" | "business-insurance" | "business-accounts" | "payroll-docs" | "business-taxes" | "employee-roster" | "board-members" | "subcontractors" | "vehicle-registrations" | "store-equipment" | "software-licenses";
type SectionKey = "documents" | "finances" | "legal" | "people" | "other";

type BusinessItem = {
  id: string;
  title: string;
  businessId: BusinessId;
  section: SectionKey;
  category: string;
  value?: string;
  isRevealed?: boolean;
  meta?: { label?: string; sensitive?: boolean; contact?: string };
};

// Section metadata
const SECTION_META: Record<SectionKey, { label: string; sub: string; icon: React.ReactNode }> = {
  documents: { label: "Documents", sub: "Articles of incorporation, EIN letter, contracts", icon: <FileText className="h-4 w-4" /> },
  finances: { label: "Finances", sub: "Bank accounts, QuickBooks, payroll", icon: <DollarSign className="h-4 w-4" /> },
  legal: { label: "Legal", sub: "Licenses, permits, insurance policies", icon: <Scale className="h-4 w-4" /> },
  people: { label: "People", sub: "Employees, subcontractors, trustees", icon: <Users className="h-4 w-4" /> },
  other: { label: "Other", sub: "Uncategorized business files", icon: <FolderOpen className="h-4 w-4" /> },
};

// Mock data - replace with real API
const ALL_BUSINESS_ITEMS: BusinessItem[] = [
  // Angel's LLC - Documents
  { id: "al-d1", title: "Articles of Incorporation", businessId: "angel-llc", section: "documents", category: "Legal Doc", value: "Filed: March 2020" },
  { id: "al-d2", title: "EIN Letter", businessId: "angel-llc", section: "documents", category: "Tax Doc", value: "EIN: 12-3456789", meta: { sensitive: true } },
  { id: "al-d3", title: "Operating Agreement", businessId: "angel-llc", section: "documents", category: "Legal Doc", value: "Updated: Jan 2024" },
  { id: "al-d4", title: "Business License", businessId: "angel-llc", section: "documents", category: "License", value: "Expires: Dec 2025" },
  
  // Angel's LLC - Finances
  { id: "al-f1", title: "Chase Business Account", businessId: "angel-llc", section: "finances", category: "Account", value: "Account #: ****4567", meta: { sensitive: true } },
  { id: "al-f2", title: "QuickBooks Online", businessId: "angel-llc", section: "finances", category: "Software", value: "Monthly subscription active" },
  { id: "al-f3", title: "2024 P&L Statement", businessId: "angel-llc", section: "finances", category: "Report", value: "Revenue: $125,000", meta: { sensitive: true } },
  { id: "al-f4", title: "Business Credit Card", businessId: "angel-llc", section: "finances", category: "Account", value: "Chase Ink Business", meta: { sensitive: true } },
  
  // Angel's LLC - Legal
  { id: "al-l1", title: "General Liability Insurance", businessId: "angel-llc", section: "legal", category: "Insurance", value: "Coverage: $1M" },
  { id: "al-l2", title: "Workers Comp Insurance", businessId: "angel-llc", section: "legal", category: "Insurance", value: "Active policy" },
  { id: "al-l3", title: "Contractor License", businessId: "angel-llc", section: "legal", category: "License", value: "License #: GC-12345" },
  { id: "al-l4", title: "State Registration", businessId: "angel-llc", section: "legal", category: "Registration", value: "Active - Good Standing" },
  
  // Angel's LLC - People
  { id: "al-p1", title: "Angel Johnson", businessId: "angel-llc", section: "people", category: "Owner", value: "Managing Member", meta: { contact: "angel@angelllc.com" } },
  { id: "al-p2", title: "Sarah Martinez", businessId: "angel-llc", section: "people", category: "Employee", value: "Project Manager", meta: { contact: "(555) 123-4567" } },
  { id: "al-p3", title: "Mike Chen", businessId: "angel-llc", section: "people", category: "Contractor", value: "Electrical Contractor", meta: { contact: "mike@electrical.com" } },
  { id: "al-p4", title: "Legal Counsel", businessId: "angel-llc", section: "people", category: "Professional", value: "Johnson & Associates", meta: { contact: "legal@johnson-law.com", sensitive: true } },
  
  // Angel's LLC - Other
  { id: "al-o1", title: "Office Lease Agreement", businessId: "angel-llc", section: "other", category: "Contract", value: "Expires: Dec 2025" },
  { id: "al-o2", title: "Vehicle Fleet Registration", businessId: "angel-llc", section: "other", category: "Asset", value: "3 work trucks" },
  { id: "al-o3", title: "Equipment Inventory", businessId: "angel-llc", section: "other", category: "Asset", value: "Last updated: Jan 2025" },
];

const BUSINESS_NAMES: Record<BusinessId, string> = {
  "angel-llc": "Angel's LLC",
  "kassandra-trust": "Kassandra's Trust Enterprise", 
  "camacho-assembly": "Camacho Assembly LLC",
  "vendor-agreements": "Vendor Agreements",
  "subcontractor-contracts": "Subcontractor Contracts",
  "client-agreements": "Client Service Agreements",
  "contractor-license": "General Contractor License",
  "transport-permit": "Transportation Permit",
  "business-insurance": "Business Insurance Policies",
  "business-accounts": "Business Bank Accounts",
  "payroll-docs": "Payroll Documents",
  "business-taxes": "Business Tax Filings",
  "employee-roster": "Employee Roster",
  "board-members": "Board Members / Trustees",
  "subcontractors": "Subcontractors",
  "vehicle-registrations": "Vehicle Registrations",
  "store-equipment": "Store Equipment",
  "software-licenses": "Tech/Software Licenses",
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

// Business Item Card Component
function BusinessItemCard({ 
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
          {category === 'Legal Doc' || category === 'Tax Doc' || category === 'License' ? <FileText className="h-4 w-4" /> :
           category === 'Account' || category === 'Software' || category === 'Report' ? <DollarSign className="h-4 w-4" /> :
           category === 'Insurance' || category === 'Registration' ? <Scale className="h-4 w-4" /> :
           category === 'Owner' || category === 'Employee' || category === 'Contractor' || category === 'Professional' ? <Users className="h-4 w-4" /> :
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
            {(category === 'Legal Doc' || category === 'Tax Doc' || category === 'Report' || category === 'Contract') && (
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
            {(category === 'Legal Doc' || category === 'Tax Doc' || category === 'Report' || category === 'Contract') && (
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

export default function BusinessDetail() {
  const { id: businessId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionKey>('documents');

  if (!businessId || !(businessId in BUSINESS_NAMES)) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Business item not found</h2>
          <p className="text-neutral-400 mb-4">The business item you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/family/business')} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80">
            Back to Business
          </Button>
        </div>
      </div>
    );
  }

  const typedBusinessId = businessId as BusinessId;
  const businessName = BUSINESS_NAMES[typedBusinessId];

  // Get business items for this entity
  const businessItems = useMemo(() => {
    return ALL_BUSINESS_ITEMS.filter(item => item.businessId === typedBusinessId);
  }, [typedBusinessId]);

  // Apply search and type filters
  const filteredItems = useMemo(() => {
    return businessItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.value && item.value.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.category.toLowerCase().includes(selectedType.toLowerCase());
      
      return matchesSearch && matchesType;
    });
  }, [businessItems, searchTerm, selectedType]);

  // Group items by section
  const groupedItems: Record<SectionKey, BusinessItem[]> = useMemo(() => {
    const grouped: Record<SectionKey, BusinessItem[]> = { 
      documents: [], 
      finances: [], 
      legal: [], 
      people: [],
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
              onClick={() => setLocation('/family/business')}
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white shrink-0">{businessName}</h1>
              <p className="text-sm text-neutral-400 mt-1">Business Entity • {businessItems.length} items</p>
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
              placeholder="Search business documents…"
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
              <SelectItem value="legal" className="text-white">Legal Doc</SelectItem>
              <SelectItem value="account" className="text-white">Account</SelectItem>
              <SelectItem value="employee" className="text-white">Employee</SelectItem>
              <SelectItem value="insurance" className="text-white">Insurance</SelectItem>
              <SelectItem value="contract" className="text-white">Contract</SelectItem>
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
                      <BusinessItemCard 
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