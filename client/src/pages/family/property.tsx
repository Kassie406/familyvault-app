import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  HelpCircle,
  Home,
  Car,
  Monitor,
  Smartphone,
  Watch,
  Diamond,
  Palette,
  Crown,
  Building,
  MoreHorizontal,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

interface PropertyItem {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  itemCount: number;
  status?: string;
  iconColor: string;
}

export default function Property() {
  const [searchQuery, setSearchQuery] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Property');
  const [tempTitle, setTempTitle] = useState('Property');

  const recommendedItems = 41;

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

  const handleCreatePropertyItem = (type: string) => {
    console.log(`Creating new ${type}`);
    setAddMenuOpen(false);
    // TODO: Implement create property item functionality
  };

  const realEstate: PropertyItem[] = [
    {
      id: '1',
      name: 'Johnson Family Home',
      category: 'Real Estate',
      icon: Home,
      itemCount: 9,
      status: 'Pre-populated',
      iconColor: '#2ECC71'
    }
  ];

  const vehicles: PropertyItem[] = [
    {
      id: '1',
      name: "Michael's Car",
      category: 'Vehicle',
      icon: Car,
      itemCount: 10,
      status: 'Pre-populated',
      iconColor: '#3498DB'
    },
    {
      id: '2',
      name: "Sarah's Car",
      category: 'Vehicle',
      icon: Car,
      itemCount: 10,
      status: 'Pre-populated',
      iconColor: '#E74C3C'
    }
  ];

  const electronics: PropertyItem[] = [
    {
      id: '1',
      name: "Michael's Computer",
      category: 'Electronics',
      icon: Monitor,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: '#9B59B6'
    },
    {
      id: '2',
      name: "Michael's Phone",
      category: 'Electronics',
      icon: Smartphone,
      itemCount: 4,
      status: 'Pre-populated',
      iconColor: '#34495E'
    },
    {
      id: '3',
      name: "Sarah's Computer",
      category: 'Electronics',
      icon: Monitor,
      itemCount: 3,
      status: 'Pre-populated',
      iconColor: '#9B59B6'
    },
    {
      id: '4',
      name: "Sarah's Phone",
      category: 'Electronics',
      icon: Smartphone,
      itemCount: 4,
      status: 'Pre-populated',
      iconColor: '#34495E'
    }
  ];

  const jewelry: PropertyItem[] = [
    {
      id: '1',
      name: 'Favorite Watch',
      category: 'Jewelry',
      icon: Watch,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: '#F39C12'
    },
    {
      id: '2',
      name: 'Favorite Piece of Jewelry',
      category: 'Jewelry',
      icon: Diamond,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: 'var(--gold)'
    }
  ];

  const artwork: PropertyItem[] = [
    {
      id: '1',
      name: 'Favorite Piece of Artwork',
      category: 'Artwork',
      icon: Palette,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: '#E67E22'
    }
  ];

  const heirlooms: PropertyItem[] = [
    {
      id: '1',
      name: 'Family Heirloom',
      category: 'Heirloom',
      icon: Crown,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: '#8E44AD'
    }
  ];

  const PropertyCard = ({ item }: { item: PropertyItem }) => {
    const IconComponent = item.icon;
    
    return (
      <LuxuryCard className="p-6 cursor-pointer group hover:scale-[1.02] transition-all">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${item.iconColor}15` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: item.iconColor }} />
          </div>
          {item.status && (
            <Badge variant="secondary" className="bg-[#2A2A33] text-neutral-300 text-xs">
              {item.status}
            </Badge>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
            {item.name}
          </h3>
        </div>
        
        <div className="flex items-center text-sm text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
          <Building className="h-4 w-4 mr-1" />
          <span>{item.itemCount} items</span>
        </div>
      </LuxuryCard>
    );
  };

  const PropertySection = ({ 
    title, 
    items, 
    gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
  }: { 
    title: string; 
    items: PropertyItem[];
    gridCols?: string;
  }) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-6">{title}</h2>
      <div className={`grid ${gridCols} gap-6`}>
        {items.map((item) => (
          <PropertyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
              data-testid="search-property"
            />
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Real Estate Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6 relative z-20">
            <h2 className="text-xl font-semibold text-white">Real Estate</h2>
            
            {/* STABLE + BUTTON WITH PROPERTY MENU - MOVED TO REAL ESTATE */}
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
                aria-label="Add to Property"
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
                data-testid="add-property-button"
                style={{ position: 'relative', zIndex: 1001 }}
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* PROPERTY MENU DROPDOWN */}
              {addMenuOpen && (
                <div
                  role="menu"
                  aria-label="Add to Property"
                  className="absolute left-0 top-10 w-64 rounded-xl border border-[#252733] bg-[#0F0F10] text-white shadow-xl p-2"
                  style={{ zIndex: 1002 }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1.5 text-sm font-medium text-[#D4AF37]">
                    Add to Property
                  </div>
                  <ul className="mt-1">
                    {[
                      ["Real Estate", "real-estate", "🏠"],
                      ["Vehicle", "vehicle", "🚗"],
                      ["Electronics", "electronics", "💻"],
                      ["Jewelry", "jewelry", "💎"],
                      ["Artwork", "artwork", "🎨"],
                      ["Heirloom", "heirloom", "👑"],
                      ["Other", "other", null],
                    ].map(([label, value, icon]) => (
                      <li key={value}>
                        <button
                          role="menuitem"
                          className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                          onClick={() => handleCreatePropertyItem(value as string)}
                        >
                          {icon && <span>{icon}</span>}
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
              <span>{recommendedItems} recommended items</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realEstate.map((item) => (
              <PropertyCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Vehicles Section */}
        <PropertySection 
          title="Vehicles" 
          items={vehicles}
          gridCols="grid-cols-1 md:grid-cols-2"
        />

        {/* Electronics Section */}
        <PropertySection 
          title="Electronics" 
          items={electronics}
          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        />

        {/* Jewelry Section */}
        <PropertySection 
          title="Jewelry" 
          items={jewelry}
          gridCols="grid-cols-1 md:grid-cols-2"
        />

        {/* Artwork Section */}
        <PropertySection 
          title="Artwork" 
          items={artwork}
          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />

        {/* Heirlooms Section */}
        <PropertySection 
          title="Heirlooms" 
          items={heirlooms}
          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </div>
  );
}