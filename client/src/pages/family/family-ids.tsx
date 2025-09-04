import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Users, 
  Heart,
  HelpCircle,
  User,
  PawPrint
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  itemCount: number;
}

interface Pet {
  id: string;
  name: string;
  itemCount: number;
  status: string;
}

export default function FamilyIds() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Owner',
      initials: 'SJ',
      avatarColor: 'var(--gold)',
      itemCount: 8
    },
    {
      id: '2', 
      name: 'Michael Johnson',
      role: 'Parent',
      initials: 'MJ',
      avatarColor: '#3498DB',
      itemCount: 7
    },
    {
      id: '3',
      name: 'Emma Johnson', 
      role: 'Child',
      initials: 'EJ',
      avatarColor: '#2ECC71',
      itemCount: 5
    },
    {
      id: '4',
      name: 'Linda Johnson',
      role: 'Grandparent',
      initials: 'LJ',
      avatarColor: '#E74C3C',
      itemCount: 6
    }
  ];

  const pets: Pet[] = [
    {
      id: '1',
      name: 'Johnson Family Pet',
      itemCount: 2,
      status: 'Pre-populated'
    }
  ];

  const recommendedItems = 12;

  const navigateToMember = (memberId: string) => {
    // Convert member id to a URL-friendly slug
    const memberSlug = familyMembers.find(m => m.id === memberId)?.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || memberId;
    setLocation(`/family/ids/${memberSlug}`);
  };

  const handleCreateMember = (type: string) => {
    console.log(`Creating new ${type}`);
    setAddMenuOpen(false);
    // TODO: Implement create member functionality
  };

  // Custom click outside hook for stable button behavior
  const addMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!addMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAddMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [addMenuOpen]);

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
            <h1 className="text-3xl font-bold text-white shrink-0">Family IDs</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ink-400)] h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
                data-testid="search-family-ids"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-[var(--ink-300)] hover:text-[var(--gold)]">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* People Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-xl font-semibold text-white">People</h2>
            </div>
            
            {/* ALWAYS-MOUNTED + BUTTON WITH STABLE CUSTOM DROPDOWN */}
            <div ref={addMenuRef} className="relative inline-flex items-center">
              {/* ALWAYS-MOUNTED TRIGGER BUTTON */}
              <button
                type="button"
                aria-label="Add to Family IDs"
                aria-expanded={addMenuOpen}
                aria-haspopup="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddMenuOpen((v) => !v);
                }}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-[#D4AF37] text-black shadow hover:bg-[#caa62f] active:bg-[#b59324] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] stable-add-button"
                data-testid="add-family-id-button"
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* CONTROLLED DROPDOWN - NEVER UNMOUNT THE BUTTON */}
              {addMenuOpen && (
                <div
                  role="menu"
                  aria-label="Add to Family IDs"
                  className="absolute left-0 top-10 z-50 w-64 rounded-xl border border-[#252733] bg-[#0F0F10] text-white shadow-xl p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1.5 text-sm font-medium text-[#D4AF37]">
                    Add to Family IDs
                  </div>
                  <ul className="mt-1">
                    {[
                      ["Person", "person"],
                      ["Pet", "pet"],
                      ["Household member", "household"],
                      ["Other", "other"],
                    ].map(([label, value]) => (
                      <li key={value}>
                        <button
                          role="menuitem"
                          className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors"
                          onClick={() => handleCreateMember(value)}
                        >
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <div className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <span className="text-black text-xs">⚡</span>
              </div>
              <span>{recommendedItems} recommended items</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map((member) => (
              <LuxuryCard 
                key={member.id}
                className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
                data-testid={`family-member-${member.id}`}
                onClick={() => navigateToMember(member.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.initials}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-[var(--line-700)] text-[var(--ink-300)] hover:bg-[var(--gold)] hover:text-black transition-colors"
                  >
                    {member.role}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {member.name}
                  </h3>
                </div>
                
                <div className="flex items-center text-sm text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                  <User className="h-4 w-4 mr-1" />
                  <span>{member.itemCount} items</span>
                </div>
              </LuxuryCard>
            ))}
            
            {/* Add New Family ID Card */}
            <LuxuryCard className="p-6 border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                    Recommended item
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-white mb-1">New Family ID</h3>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#D4AF37] hover:text-[#D4AF37]/80 p-0 h-auto font-normal"
                  data-testid="add-new-family-member"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add this item
                </Button>
              </div>
            </LuxuryCard>
          </div>
        </div>

        {/* Pets Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <PawPrint className="h-5 w-5 text-[#D4AF37]" />
            <h2 className="text-xl font-semibold text-white">Pets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <LuxuryCard 
                key={pet.id}
                className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
                data-testid={`pet-${pet.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-md">
                    <PawPrint className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-[var(--line-700)] text-[var(--ink-300)]">
                    {pet.status}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {pet.name}
                  </h3>
                </div>
                
                <div className="flex items-center text-sm text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                  <PawPrint className="h-4 w-4 mr-1" />
                  <span>{pet.itemCount} items</span>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}