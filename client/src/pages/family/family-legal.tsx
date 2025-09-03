import { useState } from 'react';
import { Search, Plus, MoreVertical, FileText, Shield, UserCheck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Legal documents data based on the reference image
const legalData = {
  wills: [
    {
      id: '1',
      name: "Angel's Will",
      itemCount: 4,
      status: 'Pre-populated',
      icon: FileText,
    },
    {
      id: '2',
      name: "kassandra's Will",
      itemCount: 4,
      status: 'Pre-populated',
      icon: FileText,
    },
  ],
  trusts: [
    {
      id: '3',
      name: "camacho Family Trust",
      itemCount: 7,
      status: 'Pre-populated',
      icon: Shield,
    },
  ],
  powerOfAttorney: [
    {
      id: '4',
      name: "Angel's Power of Attorney",
      itemCount: 4,
      status: 'Pre-populated',
      icon: UserCheck,
    },
    {
      id: '5',
      name: "kassandra's Power of Attorney",
      itemCount: 4,
      status: 'Pre-populated',
      icon: UserCheck,
    },
  ],
  medicalDirectives: [
    {
      id: '6',
      name: "Angel's Medical Directives",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Heart,
    },
    {
      id: '7',
      name: "kassandra's Medical Directives",
      itemCount: 4,
      status: 'Pre-populated',
      icon: Heart,
    },
  ],
};

export default function FamilyLegal() {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total recommended items
  const totalItems = Object.values(legalData)
    .flat()
    .reduce((sum, item) => sum + item.itemCount, 0);

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
                      <h3 className="font-medium text-black mb-1" data-testid={`text-legal-${item.id}`}>
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
                        data-testid={`button-legal-options-${item.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-legal-${item.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-view-legal-${item.id}`}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-download-legal-${item.id}`}>
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-share-legal-${item.id}`}>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        data-testid={`button-delete-legal-${item.id}`}
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
  const filteredWills = filterItems(legalData.wills);
  const filteredTrusts = filterItems(legalData.trusts);
  const filteredPowerOfAttorney = filterItems(legalData.powerOfAttorney);
  const filteredMedicalDirectives = filterItems(legalData.medicalDirectives);

  const hasResults = filteredWills.length > 0 || filteredTrusts.length > 0 || 
                    filteredPowerOfAttorney.length > 0 || filteredMedicalDirectives.length > 0;

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--ink-100)]">Legal</h1>
          <div className="flex items-center gap-2 bg-[var(--gold)] bg-opacity-10 text-[var(--gold)] px-3 py-1 rounded-full">
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

      {/* Legal Document Sections */}
      {renderLegalSection("Wills", legalData.wills, filteredWills)}
      {renderLegalSection("Trusts", legalData.trusts, filteredTrusts)}
      {renderLegalSection("Power of Attorney", legalData.powerOfAttorney, filteredPowerOfAttorney)}
      {renderLegalSection("Medical Directives", legalData.medicalDirectives, filteredMedicalDirectives)}

      {/* Empty State */}
      {searchTerm && !hasResults && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No legal documents found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new legal document.</p>
        </div>
      )}
    </div>
  );
}