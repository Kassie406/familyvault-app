import { useState } from 'react';
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
  Building
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

  const recommendedItems = 41;

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
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">Property</h1>
            <Button 
              size="sm" 
              className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 rounded-full h-8 w-8 p-0"
              data-testid="add-property-button"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <div className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <span className="text-black text-xs">⚡</span>
              </div>
              <span>{recommendedItems} recommended items</span>
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
        <PropertySection 
          title="Real Estate" 
          items={realEstate}
          gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />

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