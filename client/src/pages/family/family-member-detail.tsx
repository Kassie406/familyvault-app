import React, { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  User, 
  FileText, 
  Heart, 
  CreditCard, 
  GraduationCap, 
  Smartphone, 
  StickyNote,
  Activity,
  Users,
  Edit,
  Download,
  Eye,
  EyeOff,
  Copy,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Calendar,
  MapPin,
  Phone
} from 'lucide-react';

// Data types
interface FamilyMemberData {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  lastUpdated: string;
  relationships: string[];
}

interface VaultSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: VaultItem[];
  isCollapsed: boolean;
}

interface VaultItem {
  id: string;
  title: string;
  type: string;
  lastUpdated: string;
  isSecure?: boolean;
  preview?: string;
  details?: Record<string, string>;
}

interface AddItemOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Mock data for Sarah Johnson
const familyMemberData: FamilyMemberData = {
  id: 'sarah-johnson',
  name: 'Sarah Johnson',
  role: 'Owner',
  initials: 'SJ',
  avatarColor: '#D4AF37',
  lastUpdated: '1/4/2025',
  relationships: ['Parent of Emma Johnson', 'Spouse of Michael Johnson']
};

const mockVaultData: VaultSection[] = [
  {
    id: 'documents',
    title: 'Documents (Legal & Identity)',
    icon: <FileText className="h-5 w-5" />,
    isCollapsed: false,
    items: [
      {
        id: 'passport',
        title: 'US Passport',
        type: 'Document',
        lastUpdated: '12/15/2024',
        isSecure: true,
        preview: 'Expires: 08/2032',
        details: { country: 'United States', number: '***-**-4829', expiry: '08/15/2032' }
      },
      {
        id: 'drivers-license',
        title: 'Driver\'s License',
        type: 'Document',
        lastUpdated: '11/22/2024',
        isSecure: true,
        preview: 'CA - Expires: 03/2028',
        details: { state: 'California', number: '***456789', expiry: '03/12/2028' }
      },
      {
        id: 'ssn-card',
        title: 'Social Security Card',
        type: 'Document',
        lastUpdated: '10/30/2024',
        isSecure: true,
        preview: 'SSN: ***-**-4829',
        details: { ssn: '***-**-4829', issued: '1985' }
      }
    ]
  },
  {
    id: 'medical',
    title: 'Medical & Insurance',
    icon: <Heart className="h-5 w-5" />,
    isCollapsed: false,
    items: [
      {
        id: 'health-insurance',
        title: 'Health Insurance ID',
        type: 'Insurance',
        lastUpdated: '01/01/2025',
        preview: 'Blue Cross Blue Shield',
        details: { provider: 'Blue Cross Blue Shield', memberID: 'BC123456789', groupNo: 'GRP001' }
      },
      {
        id: 'allergies',
        title: 'Allergy Information',
        type: 'Medical Note',
        lastUpdated: '12/10/2024',
        preview: 'Penicillin allergy',
        details: { allergies: 'Penicillin, Shellfish', severity: 'Severe', notes: 'Carry EpiPen' }
      },
      {
        id: 'emergency-contact',
        title: 'Emergency Contact',
        type: 'Contact',
        lastUpdated: '11/15/2024',
        preview: 'Dr. Sarah Martinez',
        details: { name: 'Dr. Sarah Martinez', phone: '(555) 123-4567', relationship: 'Primary Physician' }
      }
    ]
  },
  {
    id: 'financial',
    title: 'Financial IDs',
    icon: <CreditCard className="h-5 w-5" />,
    isCollapsed: false,
    items: [
      {
        id: 'bank-account',
        title: 'Primary Bank Account',
        type: 'Banking',
        lastUpdated: '12/28/2024',
        isSecure: true,
        preview: 'Chase Bank - ****1234',
        details: { bank: 'Chase Bank', accountType: 'Checking', routing: '*****1234', account: '****5678' }
      },
      {
        id: 'credit-card',
        title: 'Primary Credit Card',
        type: 'Credit',
        lastUpdated: '12/20/2024',
        isSecure: true,
        preview: 'Visa - ****4829',
        details: { provider: 'Chase Visa', last4: '4829', expiry: '12/2027', type: 'Credit' }
      }
    ]
  },
  {
    id: 'education',
    title: 'Education & Work',
    icon: <GraduationCap className="h-5 w-5" />,
    isCollapsed: false,
    items: [
      {
        id: 'university-id',
        title: 'Stanford University Alumni ID',
        type: 'Education',
        lastUpdated: '09/15/2024',
        preview: 'Class of 1998',
        details: { institution: 'Stanford University', degree: 'MBA', year: '1998', id: 'ALU123456' }
      },
      {
        id: 'work-id',
        title: 'TechCorp Employee ID',
        type: 'Employment',
        lastUpdated: '01/02/2025',
        preview: 'Senior Director',
        details: { employer: 'TechCorp Inc.', department: 'Product Management', position: 'Senior Director', empID: 'TC567890' }
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Accounts',
    icon: <Smartphone className="h-5 w-5" />,
    isCollapsed: false,
    items: [
      {
        id: 'apple-id',
        title: 'Apple ID',
        type: 'Account',
        lastUpdated: '12/30/2024',
        preview: 'sarah.johnson@email.com',
        details: { email: 'sarah.johnson@email.com', devices: '3 devices', storage: '200GB plan' }
      },
      {
        id: 'google-account',
        title: 'Google Account',
        type: 'Account',
        lastUpdated: '12/25/2024',
        preview: 'sarah.j.personal@gmail.com',
        details: { email: 'sarah.j.personal@gmail.com', storage: '15GB', backup: 'Enabled' }
      }
    ]
  },
  {
    id: 'notes',
    title: 'Personal Notes',
    icon: <StickyNote className="h-5 w-5" />,
    isCollapsed: false,
    items: [
      {
        id: 'travel-notes',
        title: 'International Travel Reminders',
        type: 'Note',
        lastUpdated: '12/20/2024',
        preview: 'Passport renewal due 2032...',
        details: { content: 'Passport renewal due 2032. Check visa requirements for upcoming trips.' }
      },
      {
        id: 'legal-notes',
        title: 'Legal Documents Location',
        type: 'Note',
        lastUpdated: '11/30/2024',
        preview: 'Will and estate documents stored...',
        details: { content: 'Will and estate documents stored in safety deposit box #456 at First National Bank.' }
      }
    ]
  }
];

// Add item options for each section
const sectionAddOptions: Record<string, AddItemOption[]> = {
  documents: [
    { id: 'passport', label: 'Passport', icon: <FileText className="h-4 w-4" /> },
    { id: 'drivers-license', label: 'Driver\'s License', icon: <FileText className="h-4 w-4" /> },
    { id: 'birth-certificate', label: 'Birth Certificate', icon: <FileText className="h-4 w-4" /> },
    { id: 'ssn-card', label: 'Social Security Card', icon: <FileText className="h-4 w-4" /> },
    { id: 'marriage-certificate', label: 'Marriage Certificate', icon: <FileText className="h-4 w-4" /> },
    { id: 'other-document', label: 'Other Document', icon: <FileText className="h-4 w-4" /> }
  ],
  medical: [
    { id: 'health-insurance', label: 'Health Insurance Card', icon: <Heart className="h-4 w-4" /> },
    { id: 'prescription', label: 'Prescription', icon: <Heart className="h-4 w-4" /> },
    { id: 'allergy-info', label: 'Allergy Information', icon: <Heart className="h-4 w-4" /> },
    { id: 'medical-condition', label: 'Medical Condition', icon: <Heart className="h-4 w-4" /> },
    { id: 'emergency-contact', label: 'Emergency Contact', icon: <Phone className="h-4 w-4" /> },
    { id: 'other-medical', label: 'Other Medical', icon: <Heart className="h-4 w-4" /> }
  ],
  financial: [
    { id: 'bank-account', label: 'Bank Account', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'credit-card', label: 'Credit Card', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'investment-account', label: 'Investment Account', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'loan', label: 'Loan', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'cryptocurrency', label: 'Cryptocurrency', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'other-financial', label: 'Other Financial', icon: <CreditCard className="h-4 w-4" /> }
  ],
  education: [
    { id: 'diploma', label: 'Diploma', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'certificate', label: 'Certificate', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'student-id', label: 'Student ID', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'transcript', label: 'Transcript', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'professional-license', label: 'Professional License', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'other-education', label: 'Other Education', icon: <GraduationCap className="h-4 w-4" /> }
  ],
  digital: [
    { id: 'email-account', label: 'Email Account', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'cloud-storage', label: 'Cloud Storage', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'social-media', label: 'Social Media Account', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'streaming-service', label: 'Streaming Service', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'app-account', label: 'App Account', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'other-digital', label: 'Other Digital', icon: <Smartphone className="h-4 w-4" /> }
  ],
  notes: [
    { id: 'personal-note', label: 'Personal Note', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'travel-note', label: 'Travel Note', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'legal-note', label: 'Legal Note', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'family-note', label: 'Family Note', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'reminder', label: 'Reminder', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'other-note', label: 'Other Note', icon: <StickyNote className="h-4 w-4" /> }
  ]
};

export default function FamilyMemberDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/family/ids/:memberId');
  const [searchQuery, setSearchQuery] = useState('');
  const [sections, setSections] = useState(mockVaultData);
  const [revealedItems, setRevealedItems] = useState<Set<string>>(new Set());

  const memberId = match ? params?.memberId : null;

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isCollapsed: !section.isCollapsed }
        : section
    ));
  };

  const toggleReveal = (itemId: string) => {
    const newRevealed = new Set(revealedItems);
    if (newRevealed.has(itemId)) {
      newRevealed.delete(itemId);
    } else {
      newRevealed.add(itemId);
    }
    setRevealedItems(newRevealed);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const handleAddItem = (sectionId: string, itemType: string) => {
    console.log(`Adding ${itemType} to ${sectionId} section`);
    // TODO: Implement add item functionality
    // This would typically open a form modal or navigate to an add form
  };

  const goBack = () => {
    setLocation('/family/ids');
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {/* Header */}
      <div className="border-b border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F] px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goBack}
              className="text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Family IDs
            </Button>
            <span className="text-neutral-500">/</span>
            <span className="text-neutral-400">Sarah Johnson</span>
          </div>

          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-lg"
                style={{ backgroundColor: familyMemberData.avatarColor }}
              >
                {familyMemberData.initials}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{familyMemberData.name}</h1>
                <div className="flex items-center gap-4">
                  <Badge className="bg-[#D4AF37] text-black">{familyMemberData.role}</Badge>
                  <span className="text-neutral-400 text-sm">Last updated: {familyMemberData.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-[#232530] text-neutral-300 hover:bg-[#171822]">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button className="bg-[#D4AF37] text-black hover:bg-[#c6a02e]">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline" className="border-[#232530] text-neutral-300 hover:bg-[#171822]">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 rounded-xl border border-[#232530] bg-[#13141B] px-3 py-2 max-w-md">
            <Search className="h-4 w-4 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vault items..."
              className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 text-white placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Vault Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F] overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#171822] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-[#D4AF37]">{section.icon}</div>
                  <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                  <Badge variant="secondary" className="bg-[#232530] text-neutral-300">
                    {section.items.length}
                  </Badge>
                </div>
                {section.isCollapsed ? 
                  <ChevronDown className="h-5 w-5 text-neutral-400" /> : 
                  <ChevronUp className="h-5 w-5 text-neutral-400" />
                }
              </button>

              {/* Section Content */}
              {!section.isCollapsed && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item) => (
                      <VaultItemCard 
                        key={item.id} 
                        item={item} 
                        isRevealed={revealedItems.has(item.id)}
                        onToggleReveal={() => toggleReveal(item.id)}
                        onCopy={copyToClipboard}
                      />
                    ))}
                    
                    {/* Add New Item Card with Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-4 hover:border-[#D4AF37] transition-colors cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                              <Plus className="h-5 w-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="text-white font-medium">Add New Item</p>
                              <p className="text-neutral-400 text-sm">Add to {section.title}</p>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-56 bg-[#0F0F0F] border-[#232530] shadow-xl"
                        align="start"
                      >
                        {sectionAddOptions[section.id]?.map((option) => (
                          <DropdownMenuItem
                            key={option.id}
                            onClick={() => handleAddItem(section.id, option.id)}
                            className="text-neutral-300 hover:bg-[#171822] hover:text-white focus:bg-[#171822] focus:text-white cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-[#D4AF37]">{option.icon}</div>
                              {option.label}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Log */}
          <div className="rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                <span className="text-neutral-300">Last viewed by Kassandra at 2:13 PM</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-neutral-300">Health Insurance updated yesterday</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-neutral-300">Work ID added 3 days ago</span>
              </div>
            </div>
          </div>

          {/* Relationships */}
          <div className="rounded-2xl border border-[#232530] bg-gradient-to-b from-[#161616] to-[#0F0F0F] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-[#D4AF37]" />
              <h3 className="text-lg font-semibold text-white">Family Relationships</h3>
            </div>
            <div className="space-y-2">
              {familyMemberData.relationships.map((relationship, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                  <span>{relationship}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Vault Item Card Component
function VaultItemCard({ 
  item, 
  isRevealed, 
  onToggleReveal, 
  onCopy 
}: { 
  item: VaultItem; 
  isRevealed: boolean; 
  onToggleReveal: () => void; 
  onCopy: (text: string) => void; 
}) {
  return (
    <div className="rounded-xl border border-[#232530] bg-[#121319] p-4 hover:border-[#D4AF37]/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-white mb-1">{item.title}</h4>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-[#232530] text-neutral-300 text-xs">
              {item.type}
            </Badge>
            {item.isSecure && (
              <Badge variant="secondary" className="bg-red-900/20 text-red-400 text-xs">
                Secure
              </Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-white">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-3">
        <p className="text-neutral-300 text-sm">{item.preview}</p>
        <p className="text-neutral-500 text-xs mt-1">Updated {item.lastUpdated}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white text-xs">
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        {item.isSecure && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleReveal}
            className="text-neutral-400 hover:text-white text-xs"
          >
            {isRevealed ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {isRevealed ? 'Hide' : 'Reveal'}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onCopy(item.preview || '')}
          className="text-neutral-400 hover:text-white text-xs"
        >
          <Copy className="h-3 w-3 mr-1" />
          Copy
        </Button>
        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white text-xs">
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}