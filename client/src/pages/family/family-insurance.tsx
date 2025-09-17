import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Plus, MoreVertical, Heart, Shield, Car, Home, Umbrella, HelpCircle, MoreHorizontal, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
};

function MenuItem({
  onClick,
  icon,
  children,
}: {
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/5 transition"
    >
      <span className="text-white/70">{icon}</span>
      <span>{children}</span>
    </button>
  );
}

function InsurancePolicyCard({ policy }: { policy: any }) {
  const [, setLocation] = useLocation();
  
  return (
    <article 
      className="group rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 hover:border-white/12 transition shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)] cursor-pointer"
      onClick={() => setLocation(`/family/insurance/${policy.routeId}`)}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/15 ring-1 ring-[#D4AF37]/30">
          <span className="text-[#D4AF37]">
            <policy.icon className="h-4 w-4" />
          </span>
        </div>
        {policy.status && (
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs text-white/80">
            {policy.status}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-[15px] font-medium text-white group-hover:text-[#D4AF37] transition-colors">
          {policy.name}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
          <span className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <span className="text-black text-[10px]">{policy.itemCount}</span>
          </span>
          <span>{policy.itemCount} items</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white/50 hover:text-[#D4AF37]"
              onClick={(e) => e.stopPropagation()}
              data-testid={`button-insurance-options-${policy.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0F0F10] border-white/10">
            <DropdownMenuItem className="text-white hover:bg-white/5">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/5">
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/5">
              Share
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:bg-white/5">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}

export default function FamilyInsurance() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Insurance');
  const [tempTitle, setTempTitle] = useState('Insurance');
  const addRef = useRef<HTMLButtonElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Calculate total recommended items
  const totalItems = Object.values(insuranceData)
    .flat()
    .reduce((sum, item) => sum + item.itemCount, 0);

  const handleCreateInsuranceItem = (type: string) => {
    console.log(`Creating new ${type}`);
    setAddMenuOpen(false);
  };

  // Handle click outside to close menu
  const handleDocumentClick = (ev: MouseEvent) => {
    if (!addRef.current) return;
    const target = ev.target as Node;
    const clickedButton = addRef.current.contains(target);
    const clickedMenu = document.getElementById("insurance-add-menu")?.contains(target);
    if (!clickedButton && !clickedMenu) setAddMenuOpen(false);
  };

  useState(() => {
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  });

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

  const renderInsuranceSection = (title: string, items: any[]) => {
    const filteredItems = searchTerm ? filterItems(items) : items;
    if (searchTerm && filteredItems.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((policy) => (
            <InsurancePolicyCard key={policy.id} policy={policy} />
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

  const hasResults = filteredLife.length > 0 || filteredMedical.length > 0 || 
                    filteredAuto.length > 0 || filteredHomeowners.length > 0;

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
                placeholder="Search"
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
      <div className="mx-auto max-w-6xl px-6 py-8 text-white">
        {/* Section bar with + Add and recommended items */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-[#D4AF37]" />
            <span className="text-white font-medium">Insurance Policies</span>
          </div>
          
          {/* + Add button */}
          <div className="relative">
            <button
              ref={addRef}
              type="button"
              onClick={() => setAddMenuOpen(v => !v)}
              className="h-8 w-8 rounded-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 transition flex items-center justify-center"
              aria-expanded={addMenuOpen}
              aria-controls="insurance-add-menu"
              data-testid="button-add-insurance"
            >
              <Plus className="h-4 w-4" />
            </button>

            {addMenuOpen && (
              <div
                id="insurance-add-menu"
                className="absolute left-0 mt-2 w-64 rounded-xl border border-[#252733] bg-[#0F0F10] p-2 shadow-xl z-30"
                data-testid="menu-add-options"
              >
                <div className="px-2 py-1.5 text-sm font-medium text-[#D4AF37]">Add New Insurance</div>
                <ul className="mt-1">
                  <li>
                    <button
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                      onClick={() => handleCreateInsuranceItem('life')}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Life Insurance</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                      onClick={() => handleCreateInsuranceItem('medical')}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Medical Insurance</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                      onClick={() => handleCreateInsuranceItem('auto')}
                    >
                      <Car className="h-4 w-4" />
                      <span>Auto Insurance</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                      onClick={() => handleCreateInsuranceItem('homeowners')}
                    >
                      <Home className="h-4 w-4" />
                      <span>Homeowners Insurance</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                      onClick={() => handleCreateInsuranceItem('umbrella')}
                    >
                      <Umbrella className="h-4 w-4" />
                      <span>Umbrella Insurance</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Recommended items count */}
          <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium" data-testid="text-insurance-count">
              🔔 {totalItems} recommended items
            </span>
          </div>
        </div>
        {/* Insurance Sections */}
        {renderInsuranceSection("Life Insurance", insuranceData.lifeInsurance)}
        {renderInsuranceSection("Medical Insurance", insuranceData.medicalInsurance)}
        {renderInsuranceSection("Auto Insurance", insuranceData.autoInsurance)}
        {renderInsuranceSection("Homeowners Insurance", insuranceData.homeownersInsurance)}

        {/* Empty State */}
        {searchTerm && !hasResults && (
          <div className="mt-20 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center" data-testid="empty-state">
            <Shield className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <div className="text-lg font-medium text-white">No insurance policies found</div>
            <div className="mt-1 text-sm text-white/60">
              Try adjusting your search terms or add a new insurance policy.
            </div>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}