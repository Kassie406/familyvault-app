import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Plus, MoreVertical, FileText, Shield, UserCheck, Heart, HelpCircle } from 'lucide-react';
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

export default function FamilyLegal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const addButtonRef = useRef<HTMLButtonElement>(null);

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

  // Filter function for search
  const filterItems = (items: any[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderLegalSection = (title: string, items: any[], searchResults: any[]) => {
    if (searchTerm && searchResults.length === 0) return null;
    
    const itemsToShow = searchTerm ? searchResults : items;
    
    return (
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>
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
            <h1 className="text-3xl font-bold text-white shrink-0">Legal</h1>
            
            {/* Add Button */}
            <div className="relative">
              <Button 
                ref={addButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddMenuOpen(!addMenuOpen);
                }}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-9 px-4"
                data-testid="button-add-legal"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
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
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
              data-testid="button-help"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search legal documents…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
              data-testid="input-search"
            />
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Legal Document Sections */}
        {renderLegalSection("📜 Wills", legalData.wills, filteredWills)}
        {renderLegalSection("🏛️ Trusts", legalData.trusts, filteredTrusts)}
        {renderLegalSection("✍️ Power of Attorney", legalData.powerOfAttorney, filteredPowerOfAttorney)}
        {renderLegalSection("❤️ Medical Directives", legalData.medicalDirectives, filteredMedicalDirectives)}
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