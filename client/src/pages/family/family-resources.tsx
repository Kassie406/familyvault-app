import { useState } from 'react';
import { Search, Plus, FileText, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function FamilyResources() {
  const [searchTerm, setSearchTerm] = useState('');

  // Total recommended items as shown in reference
  const totalItems = 4;

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-black">Family Resources</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors" data-testid="button-add-resource">
                <Plus className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-white border-2 border-gray-200 shadow-lg rounded-lg p-2">
              <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium" data-testid="button-important-document">
                Important Document
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium" data-testid="button-emergency-equipment">
                Emergency Equipment
              </DropdownMenuItem>
              <DropdownMenuItem className="px-4 py-3 hover:bg-gray-50 rounded-md cursor-pointer text-gray-700 font-medium" data-testid="button-letter-loved-one">
                Letter to Loved One
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-sm text-blue-500 font-medium">
            {totalItems} recommended items
          </span>
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

      {/* Tabs Section */}
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger 
            value="created" 
            className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white"
            data-testid="tab-created"
          >
            Created
          </TabsTrigger>
          <TabsTrigger 
            value="templates" 
            className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-white"
            data-testid="tab-templates"
          >
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Created Tab Content */}
        <TabsContent value="created" className="mt-8">
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-black mb-2">No created resources yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start creating your family resources to organize important information and documents.
            </p>
            <Button 
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              data-testid="button-create-resource"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Resource
            </Button>
          </div>
        </TabsContent>

        {/* Templates Tab Content */}
        <TabsContent value="templates" className="mt-8">
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Layout className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-black mb-2">Resource Templates</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Choose from pre-built templates to quickly organize your family information.
            </p>
            <Button 
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              data-testid="button-browse-templates"
            >
              <Layout className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Search Results - shown when there's a search term */}
      {searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search terms or create a new resource.</p>
        </div>
      )}
    </div>
  );
}