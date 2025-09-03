import { useState } from 'react';
import { Search, Plus, MoreVertical, Heart, Shield, Car, Home, Umbrella, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Insurance data based on the reference image
const insuranceData = {
  lifeInsurance: [
    {
      id: '1',
      name: "Angel's Life Insurance",
      itemCount: 1,
      status: 'Pre-populated',
      icon: Heart,
    },
    {
      id: '2',
      name: "kassandra's Life Insurance",
      itemCount: 1,
      status: 'Pre-populated',
      icon: Heart,
    },
  ],
  medicalInsurance: [
    {
      id: '3',
      name: "cassandra Family Medical",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Shield,
    },
  ],
  autoInsurance: [
    {
      id: '4',
      name: "cassandra Family Car Insurance",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Car,
    },
  ],
  homeownersInsurance: [
    {
      id: '5',
      name: "Homeowner's Insurance",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Home,
    },
  ],
  umbrellaInsurance: [
    {
      id: '6',
      name: "Umbrella Insurance Policy",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Umbrella,
    },
  ],
};

export default function FamilyInsurance() {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total recommended items
  const totalItems = Object.values(insuranceData)
    .flat()
    .reduce((sum, item) => sum + item.itemCount, 0);

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
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {itemsToShow.map((item) => (
            <Card key={item.id} className="border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#D4AF37] bg-opacity-10 p-2 rounded-lg">
                      <item.icon className="h-5 w-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-black mb-1" data-testid={`text-insurance-${item.id}`}>
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Plus className="h-3 w-3" />
                        <span>{item.itemCount} items {item.status}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        data-testid={`button-insurance-options-${item.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-insurance-${item.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-view-insurance-${item.id}`}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-share-insurance-${item.id}`}>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        data-testid={`button-delete-insurance-${item.id}`}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
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
    <div className="bg-white rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Insurance</h1>
          <div className="flex items-center gap-2 bg-[#D4AF37] bg-opacity-10 text-[#D4AF37] px-3 py-1 rounded-full">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">
              {totalItems} recommended items
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-[#D4AF37]"
          data-testid="button-help"
        >
          Help
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-50"
          data-testid="input-search"
        />
      </div>

      {/* Insurance Sections */}
      {renderInsuranceSection("Life Insurance", insuranceData.lifeInsurance, filteredLife)}
      {renderInsuranceSection("Medical Insurance", insuranceData.medicalInsurance, filteredMedical)}
      {renderInsuranceSection("Auto Insurance", insuranceData.autoInsurance, filteredAuto)}
      {renderInsuranceSection("Homeowners Insurance", insuranceData.homeownersInsurance, filteredHomeowners)}
      {renderInsuranceSection("Umbrella Insurance", insuranceData.umbrellaInsurance, filteredUmbrella)}

      {/* Empty State */}
      {searchTerm && !hasResults && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Shield className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No insurance policies found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new insurance policy.</p>
        </div>
      )}
    </div>
  );
}