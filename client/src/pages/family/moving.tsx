import { useState } from 'react';
import { Search, Plus, Package, MapPin, Truck, CheckSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function Moving() {
  const [searchTerm, setSearchTerm] = useState('');

  const movingCategories = [
    {
      id: 1,
      title: 'Moving Checklist',
      description: 'Timeline, tasks, and moving day preparations',
      icon: CheckSquare,
      count: 0
    },
    {
      id: 2,
      title: 'Moving Companies',
      description: 'Quotes, contracts, and moving service provider information',
      icon: Truck,
      count: 0
    },
    {
      id: 3,
      title: 'Address Changes',
      description: 'Utilities, subscriptions, and address update documentation',
      icon: MapPin,
      count: 0
    },
    {
      id: 4,
      title: 'Important Documents',
      description: 'Lease agreements, closing documents, and legal paperwork',
      icon: FileText,
      count: 0
    }
  ];

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-[var(--ink-100)]">Moving</h1>
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ink-400)] h-4 w-4" />
        <Input
          placeholder="Search moving information"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[var(--bg-900)] border border-[var(--line-700)] text-[var(--ink-100)] focus:bg-[var(--bg-900)] focus:ring-2 focus:ring-[var(--gold)] focus:ring-opacity-50"
          data-testid="input-search"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {movingCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[var(--gold)]/10 rounded-lg">
                  <Icon className="h-6 w-6 text-[var(--gold)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--ink-100)] mb-2">{category.title}</h3>
                  <p className="text-[var(--ink-300)] text-sm mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ink-400)] text-sm">{category.count} items</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-white"
                      data-testid={`button-view-${category.id}`}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Getting Started Section */}
      <div className="mt-12 text-center">
        <Package className="h-16 w-16 text-[var(--ink-400)] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[var(--ink-100)] mb-2">Organize Your Move</h3>
        <p className="text-[var(--ink-300)] max-w-md mx-auto mb-6">
          Keep track of all moving tasks, documents, and important information for a smooth relocation.
        </p>
        <Button 
          className="bg-[var(--gold)] hover:bg-[var(--gold)]/80 text-white"
          data-testid="button-get-started"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start Moving Plan
        </Button>
      </div>
    </div>
  );
}