import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Search, 
  Plus, 
  Building2, 
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LuxuryCard } from '@/components/luxury-cards';
import { useQuery } from '@tanstack/react-query';

// Business managers data types
type BusinessManager = {
  id: string;
  name: string;
  initials: string;
  itemCount: number;
};

// Fallback data for when API is not available
const fallbackManagers: BusinessManager[] = [
  {
    id: 'angel',
    name: 'Angel Johnson',
    initials: 'AJ',
    itemCount: 42
  },
  {
    id: 'kassandra',
    name: 'Kassandra Johnson',
    initials: 'KJ',
    itemCount: 28
  },
  {
    id: 'family',
    name: 'Family Shared',
    initials: 'FS',
    itemCount: 15
  }
];

// Avatar colors for managers
const avatarColors: Record<string, string> = {
  'angel': '#D4AF37',
  'kassandra': '#9333EA', 
  'family': '#059669'
};


export default function FamilyBusiness() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Fetch business managers from API with quick fallback
  const { data: businessManagers = fallbackManagers, isLoading } = useQuery<BusinessManager[]>({
    queryKey: ['/api/business/managers'],
    queryFn: async (): Promise<BusinessManager[]> => {
      try {
        console.log('Attempting to fetch business managers...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const res = await fetch('/api/business/managers', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          console.warn('API response not ok, using fallback');
          return fallbackManagers;
        }
        
        const data = await res.json();
        console.log('API returned:', data);
        return data;
      } catch (error) {
        console.warn('API failed, using fallback business managers data:', error);
        return fallbackManagers;
      }
    },
    retry: false, // Don't retry failed requests
    staleTime: 30000 // Consider data fresh for 30 seconds
  });

  // Calculate total items across all managers
  const totalItems = businessManagers.reduce((sum: number, manager: BusinessManager) => sum + manager.itemCount, 0);

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
  const filteredManagers = businessManagers.filter((manager: BusinessManager) => {
    return manager.name.toLowerCase().includes(searchTerm.toLowerCase());
  });




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
            <h1 className="text-3xl font-bold text-white shrink-0">Business</h1>
            
            {/* Add Button */}
            <div className="relative">
              <Button 
                ref={addButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddMenuOpen(!addMenuOpen);
                }}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-9 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              
              {addMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-[#111214] border border-[#232530] rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      New Entity
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      New Contract
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      New License/Permit
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      New Insurance
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      New Partner
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Items */}
            <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium">
                🔔 {totalItems} total items
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
            >
              <HelpCircle className="h-5 w-5" />
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
              placeholder="Search managers or business items…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-full bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
            />
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <p className="text-sm text-neutral-400 mb-6">
          Select a manager to view their business vault.
        </p>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-neutral-400">Loading business managers...</div>
          </div>
        ) : (
          <>
            {/* Managers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredManagers.map((manager: BusinessManager) => (
            <LuxuryCard 
              key={manager.id} 
              className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
              onClick={() => setLocation(`/family/business/${manager.id}`)}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-black font-semibold"
                  style={{ backgroundColor: avatarColors[manager.id] || '#D4AF37' }}
                >
                  {manager.initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {manager.name}
                  </h3>
                  <div className="text-xs text-neutral-500">
                    {manager.itemCount} items pre-populated
                  </div>
                </div>
              </div>
            </LuxuryCard>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {searchTerm && filteredManagers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-neutral-400 mb-4">
              <Building2 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No managers found</h3>
            <p className="text-neutral-400">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}