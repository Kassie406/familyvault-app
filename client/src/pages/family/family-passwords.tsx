import { useState } from 'react';
import { Search, Plus, MoreVertical, Key, Smartphone, Laptop, Home, Shield, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data based on the reference image
const passwordManagers = [
  {
    id: '1',
    name: "Angel's Password Manager",
    itemCount: 2,
    status: 'Pre-populated',
    icon: Key,
  },
  {
    id: '2',
    name: "kassandra's Password Manager", 
    itemCount: 2,
    status: 'Pre-populated',
    icon: Key,
  },
];

const passwords = [
  {
    id: '1',
    name: "Angel's Phone Password",
    itemCount: 1,
    status: 'Pre-populated',
    icon: Smartphone,
  },
  {
    id: '2',
    name: "Angel's Laptop Password",
    itemCount: 1,
    status: 'Pre-populated', 
    icon: Laptop,
  },
  {
    id: '3',
    name: "Garage Door Code",
    itemCount: 1,
    status: 'Pre-populated',
    icon: Home,
  },
  {
    id: '4',
    name: "Home Wifi Password",
    itemCount: 1,
    status: 'Pre-populated',
    icon: Wifi,
  },
  {
    id: '5',
    name: "Code To Safe",
    itemCount: 1,
    status: 'Pre-populated',
    icon: Shield,
  },
  {
    id: '6',
    name: "kassandra's Phone Password",
    itemCount: 1,
    status: 'Pre-populated',
    icon: Smartphone,
  },
  {
    id: '7',
    name: "kassandra's Laptop Password",
    itemCount: 1,
    status: 'Pre-populated',
    icon: Laptop,
  },
];

export default function FamilyPasswords() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPasswordManagers = passwordManagers.filter(manager =>
    manager.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPasswords = passwords.filter(password =>
    password.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Passwords</h1>
          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">
              {passwordManagers.reduce((sum, pm) => sum + pm.itemCount, 0)} recommended items
            </span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:text-gray-900"
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
          className="pl-10 bg-gray-50 border-0 focus:bg-white"
          data-testid="input-search"
        />
      </div>

      {/* Password Managers Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Password Managers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPasswordManagers.map((manager) => (
            <Card key={manager.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <manager.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1" data-testid={`text-manager-${manager.id}`}>
                        {manager.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Plus className="h-3 w-3" />
                        <span>{manager.itemCount} items {manager.status}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        data-testid={`button-manager-options-${manager.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-manager-${manager.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-view-manager-${manager.id}`}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-share-manager-${manager.id}`}>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        data-testid={`button-delete-manager-${manager.id}`}
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

      {/* Individual Passwords Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Passwords</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPasswords.map((password) => (
            <Card key={password.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <password.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1" data-testid={`text-password-${password.id}`}>
                        {password.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Plus className="h-3 w-3" />
                        <span>{password.itemCount} item {password.status}</span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        data-testid={`button-password-options-${password.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-password-${password.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-view-password-${password.id}`}>
                        View Password
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-copy-password-${password.id}`}>
                        Copy Password
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-share-password-${password.id}`}>
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        data-testid={`button-delete-password-${password.id}`}
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

      {/* Empty State */}
      {filteredPasswordManagers.length === 0 && filteredPasswords.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Key className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No passwords found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new password.</p>
        </div>
      )}
    </div>
  );
}