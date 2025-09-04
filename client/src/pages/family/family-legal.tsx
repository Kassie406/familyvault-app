import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Plus, MoreVertical, FileText, Shield, UserCheck, Heart, HelpCircle, Grid3X3, Calendar, Clock, MoreHorizontal, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LuxuryCard } from '@/components/luxury-cards';

// Legal documents data based on the reference image
const legalData = {
  wills: [
    {
      id: '1',
      routeId: 'angel-will',
      name: "Angel's Will",
      itemCount: 4,
      status: 'Pre-populated',
      icon: FileText,
    },
    {
      id: '2',
      routeId: 'kassandra-will',
      name: "kassandra's Will",
      itemCount: 4,
      status: 'Pre-populated',
      icon: FileText,
    },
  ],
  trusts: [
    {
      id: '3',
      routeId: 'camacho-trust',
      name: "camacho Family Trust",
      itemCount: 7,
      status: 'Pre-populated',
      icon: Shield,
    },
  ],
  powerOfAttorney: [
    {
      id: '4',
      routeId: 'angel-poa',
      name: "Angel's Power of Attorney",
      itemCount: 4,
      status: 'Pre-populated',
      icon: UserCheck,
    },
    {
      id: '5',
      routeId: 'kassandra-poa',
      name: "kassandra's Power of Attorney",
      itemCount: 4,
      status: 'Pre-populated',
      icon: UserCheck,
    },
  ],
  medicalDirectives: [
    {
      id: '6',
      routeId: 'angel-directives',
      name: "Angel's Medical Directives",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Heart,
    },
    {
      id: '7',
      routeId: 'kassandra-directives',
      name: "kassandra's Medical Directives",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Heart,
    },
  ],
};

// Timeline events data
const timelineEvents = [
  {
    id: 1,
    date: 'March 2025',
    title: "Angel's Will notarized",
    action: 'notarized',
    type: 'will',
    icon: FileText,
    files: ['AngelWill_Final.pdf']
  },
  {
    id: 2,
    date: 'February 2025',
    title: 'Camacho Trust amendment uploaded',
    action: 'updated',
    type: 'trust',
    icon: Shield,
    files: ['Trust_Amendment_2025.pdf']
  },
  {
    id: 3,
    date: 'January 2025',
    title: "Kassandra's Medical Directive created",
    action: 'created',
    type: 'directive',
    icon: Heart,
    files: ['KassandraMedicalDirective.pdf']
  },
  {
    id: 4,
    date: 'December 2024',
    title: "Angel's Power of Attorney updated",
    action: 'updated',
    type: 'poa',
    icon: UserCheck,
    files: ['AngelPOA_Updated.pdf', 'Witness_Signatures.pdf']
  },
  {
    id: 5,
    date: 'November 2024',
    title: 'Family Trust established',
    action: 'created',
    type: 'trust',
    icon: Shield,
    files: ['CamachoFamilyTrust.pdf']
  }
];

export default function FamilyLegal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Legal');
  const [tempTitle, setTempTitle] = useState('Legal');
  const [, setLocation] = useLocation();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Calculate total recommended items
  const totalItems = Object.values(legalData)
    .flat()
    .reduce((sum, item) => sum + item.itemCount, 0);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addButtonRef.current && !addButtonRef.current.contains(event.target as Node)) {
        setAddMenuOpen(false);
      }
    }

    if (addMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
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

  // Filter function for search
  const filterItems = (items: any[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderLegalSection = (title: string, items: any[], searchResults: any[], sectionKey: string) => {
    if (searchTerm && searchResults.length === 0) return null;
    
    const itemsToShow = searchTerm ? searchResults : items;
    
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <Button 
            size="sm"
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-8 px-3"
            onClick={() => {}}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itemsToShow.map((item) => (
            <LuxuryCard 
              key={item.id} 
              className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
              onClick={() => setLocation(`/family/legal/${item.routeId}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `#D4AF37` + '15' }}
                >
                  <item.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                      data-testid={`button-legal-options-${item.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111214] border-[#232530]" align="end">
                    <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-edit-legal-${item.id}`}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-view-legal-${item.id}`}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-download-legal-${item.id}`}>
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-share-legal-${item.id}`}>
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-[#232530]" 
                      data-testid={`button-delete-legal-${item.id}`}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors" data-testid={`text-legal-${item.id}`}>
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                  <span>{item.itemCount} items • {item.status}</span>
                </div>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    );
  };

  const renderTimelineView = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white mb-6">Legal Timeline</h2>
        <div className="space-y-4">
          {timelineEvents.map((event) => (
            <LuxuryCard key={event.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `#D4AF37` + '15' }}
                  >
                    <event.icon className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#D4AF37] font-medium text-sm">{event.date}</span>
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span className="text-neutral-400 text-sm capitalize">{event.action}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>{event.files.length} file(s) • {event.files.join(', ')}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111214] border-[#232530]" align="end">
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      Download Files
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      Share
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    );
  };

  // Filter all sections for search
  const filteredWills = filterItems(legalData.wills);
  const filteredTrusts = filterItems(legalData.trusts);
  const filteredPowerOfAttorney = filterItems(legalData.powerOfAttorney);
  const filteredMedicalDirectives = filterItems(legalData.medicalDirectives);

  const hasResults = filteredWills.length > 0 || filteredTrusts.length > 0 || 
                    filteredPowerOfAttorney.length > 0 || filteredMedicalDirectives.length > 0;

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
          <div className="flex items-center gap-6 min-w-0">
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
                    className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
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
                placeholder="Search legal documents…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
                data-testid="input-search"
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
        {/* Filter Controls */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-3 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="all">All owners</option>
              <option value="angel">Angel</option>
              <option value="kassandra">Kassandra</option>
              <option value="family">Family</option>
            </select>
            
            <select className="px-3 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              <option value="recent">Recently Updated</option>
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
              <option value="oldest">Oldest First</option>
            </select>
            
            {/* View Toggle */}
            <div className="flex items-center bg-[#161616] border border-[#2A2A33] rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-[#D4AF37] text-black'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Calendar className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Add Button */}
          <div className="relative">
            <Button 
              ref={addButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setAddMenuOpen(!addMenuOpen);
              }}
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-9 px-4 gap-2"
              data-testid="button-add-legal"
            >
              <Plus className="h-4 w-4" />
              Add Legal Document
            </Button>
            
            {addMenuOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-[#111214] border border-[#232530] rounded-lg shadow-xl z-50">
                <div className="py-1">
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuOpen(false);
                    }}
                  >
                    Add New Will
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuOpen(false);
                    }}
                  >
                    Add Trust
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuOpen(false);
                    }}
                  >
                    Add Power of Attorney
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuOpen(false);
                    }}
                  >
                    Add Medical Directive
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Items */}
          <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium">
              🔔 {totalItems} recommended items
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Content based on view mode */}
        {viewMode === 'grid' ? (
          <>
            {/* Legal Document Sections */}
            {renderLegalSection("📜 Wills", legalData.wills, filteredWills, 'wills')}
            {renderLegalSection("🏛️ Trusts", legalData.trusts, filteredTrusts, 'trusts')}
            {renderLegalSection("✍️ Power of Attorney", legalData.powerOfAttorney, filteredPowerOfAttorney, 'poa')}
            {renderLegalSection("❤️ Medical Directives", legalData.medicalDirectives, filteredMedicalDirectives, 'directives')}
          </>
        ) : (
          renderTimelineView()
        )}
      </div>

      {/* Empty State */}
      {searchTerm && !hasResults && (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No legal documents found</h3>
          <p className="text-neutral-400">Try adjusting your search terms or add a new legal document.</p>
        </div>
      )}
    </div>
  );
}