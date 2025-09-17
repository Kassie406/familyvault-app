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
  PawPrint,
  MoreHorizontal,
  Edit2,
  Check,
  X,
  Mail,
  Settings
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';
import { InviteFamilyMemberDialog } from '@/components/InviteFamilyMemberDialog';

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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Family IDs');
  const [tempTitle, setTempTitle] = useState('Family IDs');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Kassandra Santana',
      role: 'Owner',
      initials: 'KS',
      avatarColor: 'var(--gold)',
      itemCount: 8
    },
    {
      id: '2', 
      name: 'Angel Quintana',
      role: 'Parent',
      initials: 'AQ',
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
    
    if (type === 'invite') {
      // Open the invitation modal instead of navigating
      setInviteDialogOpen(true);
    } else {
      // TODO: Implement create member functionality for person/pet
      setLocation(`/family/ids/new?type=${type}`);
    }
  };

  // Custom click outside hook for stable button behavior
  const addMenuRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
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

  // Handle escape key for title editing
  useEffect(() => {
    if (!isEditingTitle) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditingTitle(false);
        setTempTitle(pageTitle);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditingTitle, pageTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleEditTitle = () => {
    setTempTitle(pageTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setPageTitle(tempTitle.trim());
    } else {
      setTempTitle(pageTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(pageTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
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
            <div className="flex items-center gap-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-[#D4AF37] outline-none focus:border-[#D4AF37] min-w-0"
                    style={{ background: 'transparent' }}
                    data-testid="title-input"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                    data-testid="save-title-button"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    data-testid="cancel-title-button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white shrink-0" data-testid="page-title">{pageTitle}</h1>
                  <button
                    onClick={handleEditTitle}
                    className="p-1 text-white/60 hover:text-white rounded transition-colors"
                    data-testid="edit-title-button"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
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
          <div className="flex items-center gap-4 mb-6 relative z-20">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-xl font-semibold text-white">People</h2>
            </div>
            
            {/* ALWAYS-MOUNTED + BUTTON WITH STABLE CUSTOM DROPDOWN - ISOLATED */}
            <div 
              ref={addMenuRef} 
              className="relative inline-flex items-center isolate"
              style={{ isolation: 'isolate', zIndex: 1000 }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ALWAYS-MOUNTED TRIGGER BUTTON */}
              <button
                type="button"
                aria-label="Add to Family IDs"
                aria-expanded={addMenuOpen}
                aria-haspopup="menu"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setAddMenuOpen((v) => !v);
                }}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-[#D4AF37] text-black shadow hover:bg-[#caa62f] active:bg-[#b59324] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] stable-add-button"
                data-testid="add-family-id-button"
                style={{ position: 'relative', zIndex: 1001 }}
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* CONTROLLED DROPDOWN - NEVER UNMOUNT THE BUTTON */}
              {addMenuOpen && (
                <div
                  role="menu"
                  aria-label="Add to Family IDs"
                  className="absolute left-0 top-10 w-64 rounded-xl border border-[#252733] bg-[#0F0F10] text-white shadow-xl p-2"
                  style={{ zIndex: 1002 }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="mt-1">
                    <li>
                      <button
                        role="menuitem"
                        className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                        onClick={() => handleCreateMember("person")}
                      >
                        <span className="text-[#D4AF37]"><User className="h-4 w-4" /></span>
                        <span>Person</span>
                      </button>
                    </li>
                    <li>
                      <button
                        role="menuitem"
                        className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                        onClick={() => handleCreateMember("pet")}
                      >
                        <span className="text-[#D4AF37]"><PawPrint className="h-4 w-4" /></span>
                        <span>Pet</span>
                      </button>
                    </li>
                    <li>
                      <button
                        role="menuitem"
                        className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                        onClick={() => handleCreateMember("invite")}
                      >
                        <span className="text-[#D4AF37]"><Mail className="h-4 w-4" /></span>
                        <span>Invite Family Member</span>
                      </button>
                    </li>
                    <li>
                      <hr className="border-[#2A2A33] my-1" />
                    </li>
                    <li>
                      <button
                        role="menuitem"
                        className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                        onClick={() => {
                          setAddMenuOpen(false);
                          setLocation('/family/settings');
                        }}
                      >
                        <span className="text-[#D4AF37]"><Settings className="h-4 w-4" /></span>
                        <span>Manage Roles & Access</span>
                      </button>
                    </li>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {familyMembers.map((member) => (
              <LuxuryCard 
                key={member.id}
                className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
                data-testid={`family-member-${member.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToMember(member.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
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

      {/* Invite Family Member Dialog */}
      <InviteFamilyMemberDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </div>
  );
}