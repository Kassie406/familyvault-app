import { useState } from 'react';
import { Search, Plus, MoreVertical, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Contact data based on the reference image
const contacts = [
  {
    id: '1',
    name: 'Rafael Frias',
    phone: '',
    email: 'rfrias972@gmail.com',
    role: 'Family Member',
    initials: 'RF',
  },
];

export default function FamilyContacts() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contactCount = filteredContacts.length;

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--ink-100)]">Contacts</h1>
          <div className="bg-[var(--gold)] text-white w-8 h-8 rounded-full flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="text-[var(--ink-300)] hover:text-[var(--gold)]"
          data-testid="button-help"
        >
          Help
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={`Search ${contactCount} contact${contactCount !== 1 ? 's' : ''}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-50"
          data-testid="input-search"
        />
      </div>

      {/* Contacts Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-medium text-gray-700">Name</TableHead>
              <TableHead className="font-medium text-gray-700">Phone</TableHead>
              <TableHead className="font-medium text-gray-700">Email</TableHead>
              <TableHead className="font-medium text-gray-700">Role</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow 
                key={contact.id} 
                className="hover:bg-gray-50 transition-colors"
                data-testid={`row-contact-${contact.id}`}
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#D4AF37] bg-opacity-20 text-[#D4AF37] text-sm font-medium">
                        {contact.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-black" data-testid={`text-name-${contact.id}`}>
                      {contact.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-gray-600" data-testid={`text-phone-${contact.id}`}>
                  {contact.phone || '-'}
                </TableCell>
                <TableCell className="py-4 text-gray-600" data-testid={`text-email-${contact.id}`}>
                  {contact.email}
                </TableCell>
                <TableCell className="py-4 text-gray-600" data-testid={`text-role-${contact.id}`}>
                  {contact.role}
                </TableCell>
                <TableCell className="py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        data-testid={`button-contact-options-${contact.id}`}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid={`button-edit-contact-${contact.id}`}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-view-contact-${contact.id}`}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem data-testid={`button-duplicate-contact-${contact.id}`}>
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        data-testid={`button-delete-contact-${contact.id}`}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <User className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-black mb-2">No contacts found</h3>
          <p className="text-gray-600">Try adjusting your search terms or add a new contact.</p>
        </div>
      )}

      {/* Add Contact Button */}
      <div className="mt-6 flex justify-start">
        <Button 
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
          data-testid="button-add-contact"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>
    </div>
  );
}