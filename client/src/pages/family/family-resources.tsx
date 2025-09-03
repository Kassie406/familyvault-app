import { useState } from 'react';
import { Search, Plus, FileText, Layout, Shield, Heart, AlertTriangle, Zap, Edit, Siren, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';

export default function FamilyResources() {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample created resources - replace with actual data from backend
  const createdResources = [
    {
      id: 1,
      type: 'Important Document',
      name: 'Birth Certificate - John Doe',
      dateCreated: '2024-01-15',
      icon: FileText
    },
    {
      id: 2,
      type: 'Emergency Equipment',
      name: 'Emergency Kit Inventory',
      dateCreated: '2024-01-10',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'Letter to Loved One',
      name: 'Letter to Sarah',
      dateCreated: '2024-01-05',
      icon: Heart
    }
  ];

  // Total recommended items as shown in reference
  const totalItems = 4;

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-black">Family Resources</h1>
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
          {createdResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <FileText className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-black mb-2">No created resources yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start creating your family resources to organize important information and documents.
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                    data-testid="button-create-resource"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Resource
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56 bg-white border-2 border-gray-200 shadow-lg rounded-lg p-2">
                  <DropdownMenuItem className="px-4 py-3 rounded-md cursor-pointer text-gray-800 font-medium hover:bg-[#D4AF37]/20 hover:!text-gray-800 focus:!text-gray-800" data-testid="button-important-document">
                    Important Document
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-3 rounded-md cursor-pointer text-gray-800 font-medium hover:bg-[#D4AF37]/20 hover:!text-gray-800 focus:!text-gray-800" data-testid="button-emergency-equipment">
                    Emergency Equipment
                  </DropdownMenuItem>
                  <DropdownMenuItem className="px-4 py-3 rounded-md cursor-pointer text-gray-800 font-medium hover:bg-[#D4AF37]/20 hover:!text-gray-800 focus:!text-gray-800" data-testid="button-letter-loved-one">
                    Letter to Loved One
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="space-y-4">
              {createdResources.filter(resource => 
                resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.type.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#D4AF37]/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-black">{resource.name}</h3>
                        <p className="text-sm text-gray-600">{resource.type}</p>
                        <p className="text-xs text-gray-500">Created: {resource.dateCreated}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-400 hover:text-[#D4AF37]"
                        data-testid={`button-edit-${resource.id}`}
                      >
                        Edit
                      </Button>
                    </div>
                  </Card>
                );
              })}
              
              {/* Create New Resource Button at bottom when resources exist */}
              <div className="pt-4 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                      data-testid="button-create-resource"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Resource
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 bg-white border-2 border-gray-200 shadow-lg rounded-lg p-2">
                    <DropdownMenuItem className="px-4 py-3 rounded-md cursor-pointer text-gray-800 font-medium hover:bg-[#D4AF37]/20 hover:!text-gray-800 focus:!text-gray-800" data-testid="button-important-document">
                      Important Document
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-3 rounded-md cursor-pointer text-gray-800 font-medium hover:bg-[#D4AF37]/20 hover:!text-gray-800 focus:!text-gray-800" data-testid="button-emergency-equipment">
                      Emergency Equipment
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-3 rounded-md cursor-pointer text-gray-800 font-medium hover:bg-[#D4AF37]/20 hover:!text-gray-800 focus:!text-gray-800" data-testid="button-letter-loved-one">
                      Letter to Loved One
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Templates Tab Content */}
        <TabsContent value="templates" className="mt-8">
          <div className="space-y-8">
            
            {/* Important Documents Section */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Important Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-black">Evacuation Plan</h4>
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-500">
                    <Zap className="h-3 w-3" />
                    <span>1 item</span>
                    <span className="text-gray-400">Pre-populated</span>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-black">New Eulogy</h4>
                      <p className="text-sm text-gray-500">Assisted eulogy writing</p>
                    </div>
                    <Edit className="h-5 w-5 text-gray-400" />
                  </div>
                </Card>
              </div>
            </div>

            {/* Emergency Equipment Section */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Emergency Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-black">Fire Extinguisher</h4>
                    <Siren className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-500">
                    <Zap className="h-3 w-3" />
                    <span>1 item</span>
                    <span className="text-gray-400">Pre-populated</span>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-black">Go Bag</h4>
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-500">
                    <Zap className="h-3 w-3" />
                    <span>1 item</span>
                    <span className="text-gray-400">Pre-populated</span>
                  </div>
                </Card>
              </div>
            </div>

            {/* Letters to Loved Ones Section */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Letters to Loved Ones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-black">Letter for Angel</h4>
                    <Edit className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-500">
                    <Zap className="h-3 w-3" />
                    <span>2 items</span>
                    <span className="text-gray-400">Pre-populated</span>
                  </div>
                </Card>
              </div>
            </div>

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