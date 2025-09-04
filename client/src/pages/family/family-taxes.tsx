import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search, Plus, MoreVertical, FileText, HelpCircle, MoreHorizontal, Edit2, Check, X } from 'lucide-react';
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

// Tax returns data based on the reference image
const taxReturns = [
  {
    id: '1',
    routeId: '2025',
    year: '2025',
    name: '2025 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '2',
    routeId: '2024',
    year: '2024',
    name: '2024 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '3',
    routeId: '2023',
    year: '2023',
    name: '2023 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '4',
    routeId: '2022',
    year: '2022',
    name: '2022 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '5',
    routeId: '2021',
    year: '2021',
    name: '2021 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
];

export default function FamilyTaxes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Taxes');
  const [tempTitle, setTempTitle] = useState('Taxes');
  const [, setLocation] = useLocation();
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Calculate total recommended items
  const totalItems = taxReturns.reduce((sum, taxReturn) => sum + taxReturn.itemCount, 0);

  // Filter tax returns based on search
  const filteredTaxReturns = taxReturns.filter(taxReturn =>
    taxReturn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taxReturn.year.includes(searchTerm)
  );

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
                placeholder="Search tax returns…"
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

      {/* Add Button and Recommended Items Section */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center gap-4">
          {/* Add Button */}
          <div className="relative">
            <Button 
              ref={addButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                setAddMenuOpen(!addMenuOpen);
              }}
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-9 px-4 gap-2"
              data-testid="button-add-tax"
            >
              <Plus className="h-4 w-4" />
              Add Tax Return
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
                    Add New Tax Year
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuOpen(false);
                    }}
                  >
                    Upload Document
                  </button>
                  <button 
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddMenuOpen(false);
                    }}
                  >
                    Other
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
        {/* Tax Returns Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6">Tax Returns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTaxReturns.map((taxReturn) => (
              <LuxuryCard 
                key={taxReturn.id} 
                className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
                onClick={() => setLocation(`/family/taxes/${taxReturn.routeId}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `#D4AF37` + '15' }}
                  >
                    <taxReturn.icon className="h-6 w-6 text-[#D4AF37]" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                        onClick={(e) => e.stopPropagation()}
                        data-testid={`button-tax-options-${taxReturn.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#111214] border-[#232530]" align="end">
                      <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-edit-tax-${taxReturn.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-view-tax-${taxReturn.id}`}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-download-tax-${taxReturn.id}`}>
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-[#232530]" data-testid={`button-share-tax-${taxReturn.id}`}>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 hover:bg-[#232530]" 
                        data-testid={`button-delete-tax-${taxReturn.id}`}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors" data-testid={`text-tax-${taxReturn.id}`}>
                    {taxReturn.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                    <span>{taxReturn.itemCount} items • {taxReturn.status}</span>
                  </div>
                </div>
              </LuxuryCard>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredTaxReturns.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No tax returns found</h3>
            <p className="text-neutral-400">Try adjusting your search terms or add a new tax return.</p>
          </div>
        )}
      </div>
    </div>
  );
}