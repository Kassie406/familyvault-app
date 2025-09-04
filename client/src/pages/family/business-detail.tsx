import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
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
type MemberId = "angel" | "kassandra" | "family";
type SectionKey = "documents" | "finances" | "legal" | "people" | "other";

type BusinessItem = {
  id: string;
  title: string;
  ownerId: MemberId;
  type: "entity" | "contract" | "license" | "insurance" | "partner" | "other";
  subtitle?: string;
  docCount?: number;
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
  // Legacy support for existing mock data structure
  section?: SectionKey;
  category?: string;
  value?: string;
  isRevealed?: boolean;
  meta?: { label?: string; sensitive?: boolean; contact?: string };
};

// Section metadata - mapping business types to sections
const SECTION_META: Record<SectionKey, { label: string; sub: string; icon: React.ReactNode }> = {
  documents: { label: "Company Entities", sub: "LLCs, corporations, partnerships", icon: <FileText className="h-4 w-4" /> },
  finances: { label: "Contracts & Agreements", sub: "Service contracts, vendor agreements", icon: <DollarSign className="h-4 w-4" /> },
  legal: { label: "Licenses & Permits", sub: "Business licenses, permits, insurance", icon: <Scale className="h-4 w-4" /> },
  people: { label: "Employees & Partners", sub: "Staff roster, subcontractors, board members", icon: <Users className="h-4 w-4" /> },
  other: { label: "Other", sub: "Uncategorized business items", icon: <FolderOpen className="h-4 w-4" /> },
};

// Type mapping for organizing items into sections
const TYPE_TO_SECTION: Record<BusinessItem["type"], SectionKey> = {
  entity: "documents",
  contract: "finances", 
  license: "legal",
  insurance: "legal",
  partner: "people",
  other: "other"
};

// Mock data - replace with real API
const ALL_BUSINESS_ITEMS: BusinessItem[] = [
  // Angel's Business Items
  { id: "a-e1", title: "Angel's LLC", ownerId: "angel", type: "entity", section: "documents", category: "LLC", value: "Managing Member" },
  { id: "a-e2", title: "Prime Set Assembly LLC", ownerId: "angel", type: "entity", section: "documents", category: "LLC", value: "EIN: 12-3456789", meta: { sensitive: true } },
  { id: "a-c1", title: "Home Depot Subcontractor Contract", ownerId: "angel", type: "contract", section: "finances", category: "Service Contract", value: "Expires: Dec 2025" },
  { id: "a-c2", title: "Vendor Agreement - ABC Supply", ownerId: "angel", type: "contract", section: "finances", category: "Vendor Contract", value: "Active" },
  { id: "a-l1", title: "NJ Contractor License", ownerId: "angel", type: "license", section: "legal", category: "License", value: "License #: GC-12345" },
  { id: "a-l2", title: "Transportation Permit", ownerId: "angel", type: "license", section: "legal", category: "Permit", value: "DOT permit", meta: { sensitive: true } },
  { id: "a-p1", title: "Subcontractor List", ownerId: "angel", type: "partner", section: "people", category: "Contractor", value: "8 active contractors" },
  { id: "a-p2", title: "Site Foreman - Mike Chen", ownerId: "angel", type: "partner", section: "people", category: "Employee", value: "Full-time", meta: { contact: "mike@angelllc.com" } },
  
  // Kassandra's Business Items
  { id: "k-c1", title: "Client Service Agreement - Johnson Corp", ownerId: "kassandra", type: "contract", section: "finances", category: "Service Contract", value: "Annual contract" },
  { id: "k-c2", title: "Software License Agreement", ownerId: "kassandra", type: "contract", section: "finances", category: "Software Contract", value: "QuickBooks Pro" },
  { id: "k-p1", title: "Employee Roster", ownerId: "kassandra", type: "partner", section: "people", category: "Employee", value: "12 employees" },
  { id: "k-p2", title: "HR Specialist - Sarah Martinez", ownerId: "kassandra", type: "partner", section: "people", category: "Employee", value: "Part-time", meta: { contact: "sarah@hr-solutions.com" } },
  { id: "k-o1", title: "Laptops / Software Licenses", ownerId: "kassandra", type: "other", section: "other", category: "Technology", value: "11 items" },
  { id: "k-o2", title: "Payroll Documents", ownerId: "kassandra", type: "other", section: "other", category: "Payroll", value: "24 files" },
  
  // Family Shared Business Items
  { id: "f-e1", title: "Camacho Assembly LLC", ownerId: "family", type: "entity", section: "documents", category: "LLC", value: "Joint ownership" },
  { id: "f-i1", title: "Wells Fargo Business Insurance", ownerId: "family", type: "insurance", section: "legal", category: "Insurance", value: "Coverage: $2M" },
  { id: "f-p1", title: "Board of Trustees", ownerId: "family", type: "partner", section: "people", category: "Board", value: "4 members" },
  { id: "f-o1", title: "Store Fixtures / Racking Tools", ownerId: "family", type: "other", section: "other", category: "Equipment", value: "18 items" },
  { id: "f-o2", title: "Vehicles (VINs, titles)", ownerId: "family", type: "other", section: "other", category: "Vehicle", value: "6 vehicles" },
];

const MEMBER_NAMES: Record<MemberId, string> = {
  "angel": "Angel Johnson",
  "kassandra": "Kassandra Johnson",
  "family": "Family Shared"
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
  const { id: memberId } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionKey>('documents');

  if (!memberId || !(memberId in MEMBER_NAMES)) {
    return (
      <div className="min-h-screen bg-[var(--bg-900)] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Manager not found</h2>
          <p className="text-neutral-400 mb-4">The business manager you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/family/business')} className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80">
            Back to Business
          </Button>
        </div>
      </div>
    );
  }

  const typedMemberId = memberId as MemberId;
  const memberName = MEMBER_NAMES[typedMemberId];

  // Use mock data as fallback immediately
  const fallbackItems = useMemo(() => {
    return ALL_BUSINESS_ITEMS.filter((item: BusinessItem) => item.ownerId === typedMemberId);
  }, [typedMemberId]);

  // Fetch business items from API with robust timeout handling
  const { data: businessItems = [], isLoading } = useQuery<BusinessItem[]>({
    queryKey: ['/api/business/items', typedMemberId],
    queryFn: async (): Promise<BusinessItem[]> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      try {
        console.log(`Fetching business items for ${typedMemberId}...`);
        const res = await fetch(`/api/business/items?ownerId=${typedMemberId}`, {
          signal: controller.signal,
          credentials: 'include'
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log(`Fetched ${data.length} items for ${typedMemberId}`);
        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);
        
        // Handle AbortError specifically to avoid unhandled rejections
        if (error.name === 'AbortError') {
          console.log('Request timed out, using fallback data');
        } else {
          console.warn('API failed, using fallback data:', error.message);
        }
        
        // Always return fallback data instead of throwing
        return fallbackItems;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    enabled: !!typedMemberId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on failure, just use fallback
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  });

  const itemsToUse = businessItems.length > 0 ? businessItems : fallbackItems;

  // Apply search and type filters
  const filteredItems = useMemo(() => {
    return itemsToUse.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (item.value && item.value.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || 
                         (item.category && item.category.toLowerCase().includes(selectedType.toLowerCase())) ||
                         item.type.toLowerCase().includes(selectedType.toLowerCase());
      
      return matchesSearch && matchesType;
    });
  }, [itemsToUse, searchTerm, selectedType]);

  // Group items by section based on type
  const groupedItems: Record<SectionKey, BusinessItem[]> = useMemo(() => {
    const grouped: Record<SectionKey, BusinessItem[]> = { 
      documents: [], 
      finances: [], 
      legal: [], 
      people: [],
      other: [] 
    };
    filteredItems.forEach((item: BusinessItem) => {
      const section = TYPE_TO_SECTION[item.type as keyof typeof TYPE_TO_SECTION] || 'other';
      grouped[section]?.push(item);
    });
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
              <h1 className="text-3xl font-bold text-white shrink-0">{memberName}'s Business</h1>
              <p className="text-sm text-neutral-400 mt-1">Business Manager • {itemsToUse.length} items</p>
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
              placeholder="Search this vault…"
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-neutral-400">Loading business items...</div>
          </div>
        ) : (
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
                          value={item.value || item.subtitle}
                          category={item.category || item.type}
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
        )}
      </div>
    </div>
  );
}