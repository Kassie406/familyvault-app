import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Plus, MoreVertical, Heart, Shield, Car, Home, Umbrella, User, HelpCircle } from 'lucide-react';
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

// Insurance data based on the reference image
const insuranceData = {
  lifeInsurance: [
    {
      id: '1',
      routeId: 'angel-life',
      name: "Angel's Life Insurance",
      itemCount: 1,
      status: 'Pre-populated',
      icon: Heart,
    },
    {
      id: '2',
      routeId: 'kassandra-life',
      name: "kassandra's Life Insurance",
      itemCount: 1,
      status: 'Pre-populated',
      icon: Heart,
    },
  ],
  medicalInsurance: [
    {
      id: '3',
      routeId: 'family-medical',
      name: "cassandra Family Medical",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Shield,
    },
  ],
  autoInsurance: [
    {
      id: '4',
      routeId: 'family-auto',
      name: "cassandra Family Car Insurance",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Car,
    },
  ],
  homeownersInsurance: [
    {
      id: '5',
      routeId: 'homeowners',
      name: "Homeowner's Insurance",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Home,
    },
  ],
  umbrellaInsurance: [
    {
      id: '6',
      routeId: 'umbrella',
      name: "Umbrella Insurance Policy",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Umbrella,
    },
  ],
};

export default function FamilyInsurance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  // Calculate total recommended items
  const totalItems = Object.values(insuranceData)
    .flat()
    .reduce((sum, item) => sum + item.itemCount, 0);

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

  const handleCreateInsuranceItem = (type: string) => {
    console.log(`Creating new ${type}`);
    setAddMenuOpen(false);
    // TODO: Implement create insurance item functionality
  };

  // Filter function for search
  const filterItems = (items: any[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderInsuranceSection = (title: string, items: any[], searchResults: any[]) => {
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
              onClick={() => setLocation(`/family/insurance/${item.routeId}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `#D4AF37` + '15' }}
                >
                  <item.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                {item.status && (
                  <span className="bg-[#2A2A33] text-neutral-300 text-xs px-2 py-1 rounded-md">
                    {item.status}
                  </span>
                )}
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors" data-testid={`text-insurance-${item.id}`}>
                  {item.name}
                </h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>{item.itemCount} items</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-[#D4AF37]"
                      data-testid={`button-insurance-options-${item.id}`}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0F0F10] border-[#252733]">
                    <DropdownMenuItem data-testid={`button-edit-insurance-${item.id}`} className="text-white hover:bg-white/5">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid={`button-view-insurance-${item.id}`} className="text-white hover:bg-white/5">
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid={`button-share-insurance-${item.id}`} className="text-white hover:bg-white/5">
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-400 hover:bg-white/5" 
                      data-testid={`button-delete-insurance-${item.id}`}
                    >
                      Delete
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
  const filteredLife = filterItems(insuranceData.lifeInsurance);
  const filteredMedical = filterItems(insuranceData.medicalInsurance);
  const filteredAuto = filterItems(insuranceData.autoInsurance);
  const filteredHomeowners = filterItems(insuranceData.homeownersInsurance);
  const filteredUmbrella = filterItems(insuranceData.umbrellaInsurance);

  const hasResults = filteredLife.length > 0 || filteredMedical.length > 0 || 
                    filteredAuto.length > 0 || filteredHomeowners.length > 0 || 
                    filteredUmbrella.length > 0;

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
            <h1 className="text-3xl font-bold text-white shrink-0">Insurance</h1>
            
            {/* STABLE + BUTTON WITH INSURANCE MENU - MOVED TO LIFE INSURANCE */}
            <div 
              ref={addMenuRef} 
              className="relative inline-flex items-center isolate"
              style={{ isolation: 'isolate', zIndex: 1000 }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Add to Insurance"
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
                data-testid="add-insurance-button"
                style={{ position: 'relative', zIndex: 1001 }}
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* INSURANCE MENU DROPDOWN */}
              {addMenuOpen && (
                <div
                  role="menu"
                  aria-label="Add to Insurance"
                  className="absolute left-0 top-10 w-64 rounded-xl border border-[#252733] bg-[#0F0F10] text-white shadow-xl p-2"
                  style={{ zIndex: 1002 }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="mt-1">
                    {[
                      ["Life Insurance", "life"],
                      ["Medical Insurance", "medical"],
                      ["Auto Insurance", "auto"],
                      ["Homeowners Insurance", "homeowners"],
                      ["Umbrella Insurance", "umbrella"],
                    ].map(([label, value]) => (
                      <li key={value}>
                        <button
                          role="menuitem"
                          className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                          onClick={() => handleCreateInsuranceItem(value as string)}
                        >
                          <span>{label}</span>
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
              <span>{totalItems} recommended items</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-neutral-300 hover:text-[#D4AF37]">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
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

      {/* Insurance Sections */}
      {renderInsuranceSection("Life Insurance", insuranceData.lifeInsurance, filteredLife)}
      {renderInsuranceSection("Medical Insurance", insuranceData.medicalInsurance, filteredMedical)}
      {renderInsuranceSection("Auto Insurance", insuranceData.autoInsurance, filteredAuto)}
      {renderInsuranceSection("Homeowners Insurance", insuranceData.homeownersInsurance, filteredHomeowners)}
      {renderInsuranceSection("Umbrella Insurance", insuranceData.umbrellaInsurance, filteredUmbrella)}

        {/* Empty State */}
        {searchTerm && !hasResults && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Shield className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No insurance policies found</h3>
            <p className="text-neutral-400">Try adjusting your search terms or add a new insurance policy.</p>
          </div>
        )}
      </div>
    </div>
  );
}