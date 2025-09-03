import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Users, 
  Heart,
  HelpCircle,
  User,
  PawPrint
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  itemCount: number;
}

interface Pet {
  id: string;
  name: string;
  itemCount: number;
  status: string;
}

export default function FamilyIds() {
  const [searchQuery, setSearchQuery] = useState('');

  const familyMembers: FamilyMember[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Owner',
      initials: 'SJ',
      avatarColor: '#D4AF37',
      itemCount: 8
    },
    {
      id: '2', 
      name: 'Michael Johnson',
      role: 'Parent',
      initials: 'MJ',
      avatarColor: '#3498DB',
      itemCount: 7
    },
    {
      id: '3',
      name: 'Emma Johnson', 
      role: 'Child',
      initials: 'EJ',
      avatarColor: '#2ECC71',
      itemCount: 5
    },
    {
      id: '4',
      name: 'Linda Johnson',
      role: 'Grandparent',
      initials: 'LJ',
      avatarColor: '#E74C3C',
      itemCount: 6
    }
  ];

  const pets: Pet[] = [
    {
      id: '1',
      name: 'Johnson Family Pet',
      itemCount: 2,
      status: 'Pre-populated'
    }
  ];

  const recommendedItems = 12;

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#0A0A1A]">Family IDs</h1>
            <Button 
              size="sm" 
              className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] rounded-full h-8 w-8 p-0"
              data-testid="add-family-id-button"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-4 h-4 rounded-full bg-[#3498DB] flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span>{recommendedItems} recommended items</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-64"
                data-testid="search-family-ids"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-[#D4AF37]">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* People Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-[#0A0A1A]" />
            <h2 className="text-xl font-semibold text-[#0A0A1A]">People</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyMembers.map((member) => (
              <div 
                key={member.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D4AF37]/30 transition-all cursor-pointer group"
                data-testid={`family-member-${member.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.initials}
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-100 text-gray-600 hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    {member.role}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-[#0A0A1A] mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {member.name}
                  </h3>
                </div>
                
                <div className="flex items-center text-sm text-[#3498DB] group-hover:text-[#D4AF37] transition-colors">
                  <User className="h-4 w-4 mr-1" />
                  <span>{member.itemCount} items</span>
                </div>
              </div>
            ))}
            
            {/* Add New Family ID Card */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl p-6 border-2 border-dashed border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <User className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <Badge variant="outline" className="border-[#D4AF37] text-[#D4AF37]">
                  Recommended item
                </Badge>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-[#0A0A1A] mb-1">New Family ID</h3>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#D4AF37] hover:text-[#c6a02e] p-0 h-auto font-normal"
                data-testid="add-new-family-member"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add this item
              </Button>
            </div>
          </div>
        </div>

        {/* Pets Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <PawPrint className="h-5 w-5 text-[#0A0A1A]" />
            <h2 className="text-xl font-semibold text-[#0A0A1A]">Pets</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div 
                key={pet.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D4AF37]/30 transition-all cursor-pointer group"
                data-testid={`pet-${pet.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#2ECC71] flex items-center justify-center shadow-md">
                    <PawPrint className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                    {pet.status}
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold text-[#0A0A1A] mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {pet.name}
                  </h3>
                </div>
                
                <div className="flex items-center text-sm text-[#2ECC71] group-hover:text-[#D4AF37] transition-colors">
                  <PawPrint className="h-4 w-4 mr-1" />
                  <span>{pet.itemCount} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}