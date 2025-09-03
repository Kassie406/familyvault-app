import { useState } from 'react';
import { Search, Plus, MoreVertical, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Tax returns data based on the reference image
const taxReturns = [
  {
    id: '1',
    year: '2025',
    name: '2025 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '2',
    year: '2024',
    name: '2024 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '3',
    year: '2023',
    name: '2023 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '4',
    year: '2022',
    name: '2022 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
  {
    id: '5',
    year: '2021',
    name: '2021 Tax Return',
    itemCount: 2,
    status: 'Pre-populated',
    icon: FileText,
  },
];

export default function FamilyTaxes() {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate total recommended items
  const totalItems = taxReturns.reduce((sum, taxReturn) => sum + taxReturn.itemCount, 0);

  // Filter tax returns based on search
  const filteredTaxReturns = taxReturns.filter(taxReturn =>
    taxReturn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taxReturn.year.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Taxes</h1>
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

      {/* Tax Returns Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-black mb-4">Tax Returns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTaxReturns.map((taxReturn) => (
            <Card key={taxReturn.id} className="border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-[#D4AF37] bg-opacity-10 p-2 rounded-lg">
                    <taxReturn.icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        data-testid={`button-tax-options-${taxReturn.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-tax-${taxReturn.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-view-tax-${taxReturn.id}`}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-download-tax-${taxReturn.id}`}>
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-share-tax-${taxReturn.id}`}>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        data-testid={`button-delete-tax-${taxReturn.id}`}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  <h3 className="font-medium text-black mb-1" data-testid={`text-tax-${taxReturn.id}`}>
                    {taxReturn.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Plus className="h-3 w-3" />
                    <span>{taxReturn.itemCount} items {taxReturn.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredTaxReturns.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No tax returns found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new tax return.</p>
        </div>
      )}
    </div>
  );
}