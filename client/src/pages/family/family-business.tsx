import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  FileText, 
  CreditCard, 
  Users, 
  Settings, 
  HelpCircle,
  Grid3X3,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LuxuryCard } from '@/components/luxury-cards';

// Business data organized by categories
const businessData = {
  entities: [
    {
      id: '1',
      routeId: 'angel-llc',
      name: "Angel's LLC",
      category: 'Entity',
      owner: 'Angel',
      itemCount: 7,
      docs: 'EIN, Articles, Bank Account, Contracts',
      status: 'Active',
      icon: Building2,
    },
    {
      id: '2',
      routeId: 'camacho-assembly',
      name: "Camacho Assembly LLC",
      category: 'Entity',
      owner: 'Family',
      itemCount: 9,
      docs: 'Articles, Operating Agreement, Insurance',
      status: 'Active',
      icon: Building2,
    },
    {
      id: '3',
      routeId: 'prime-set-assembly',
      name: "Prime Set Assembly LLC",
      category: 'Entity',
      owner: 'Angel',
      itemCount: 7,
      docs: 'EIN, Articles, Bank Account, Contracts',
      status: 'Active',
      icon: Building2,
    },
  ],
  contracts: [
    {
      id: '4',
      routeId: 'vendor-agreements',
      name: "Vendor Agreements",
      category: 'Contract',
      owner: 'Angel',
      itemCount: 15,
      docs: 'Supplier contracts, Purchase agreements',
      status: 'Active',
      icon: FileText,
    },
    {
      id: '5',
      routeId: 'home-depot-contracts',
      name: "Home Depot Subcontractor Contracts",
      category: 'Contract',
      owner: 'Angel',
      itemCount: 8,
      docs: 'Service agreements, SOWs',
      status: 'Active',
      icon: FileText,
    },
    {
      id: '6',
      routeId: 'client-agreements',
      name: "Client Service Agreements",
      category: 'Contract',
      owner: 'Kassandra',
      itemCount: 12,
      docs: 'Service contracts, Terms of service',
      status: 'Active',
      icon: FileText,
    },
  ],
  licenses: [
    {
      id: '7',
      routeId: 'nj-contractor-license',
      name: "NJ General Contractor License",
      category: 'License',
      owner: 'Angel',
      itemCount: 4,
      docs: 'License certificate, Renewals',
      status: 'Active',
      icon: CreditCard,
    },
    {
      id: '8',
      routeId: 'transport-permit',
      name: "Transportation Permit",
      category: 'Permit',
      owner: 'Angel',
      itemCount: 3,
      docs: 'DOT permit, Vehicle registrations',
      status: 'Expiring Soon',
      icon: CreditCard,
    },
    {
      id: '9',
      routeId: 'wells-fargo-insurance',
      name: "Wells Fargo Business Insurance Policy",
      category: 'Insurance',
      owner: 'Family',
      itemCount: 5,
      docs: 'Policy documents, Claims history',
      status: 'Active',
      icon: CreditCard,
    },
  ],
  people: [
    {
      id: '10',
      routeId: 'employee-roster',
      name: "Employee Roster",
      category: 'Employee',
      owner: 'Kassandra',
      itemCount: 12,
      docs: 'Employee records, Contacts',
      status: 'Active',
      icon: Users,
    },
    {
      id: '11',
      routeId: 'trustees-board',
      name: "Trustee / Board Members",
      category: 'Board',
      owner: 'Family',
      itemCount: 4,
      docs: 'Board resolutions, Meeting minutes',
      status: 'Active',
      icon: Users,
    },
    {
      id: '12',
      routeId: 'subcontractors',
      name: "Subcontractors",
      category: 'Contractor',
      owner: 'Angel',
      itemCount: 8,
      docs: 'Contractor agreements, Certifications',
      status: 'Active',
      icon: Users,
    },
  ],
  assets: [
    {
      id: '13',
      routeId: 'vehicles',
      name: "Vehicles (VIN / Titles)",
      category: 'Vehicle',
      owner: 'Angel',
      itemCount: 6,
      docs: 'VIN numbers, Titles, Registration',
      status: 'Active',
      icon: Settings,
    },
    {
      id: '14',
      routeId: 'store-fixtures',
      name: "Store Fixtures / Racking Equipment",
      category: 'Equipment',
      owner: 'Family',
      itemCount: 18,
      docs: 'Purchase receipts, Warranties',
      status: 'Active',
      icon: Settings,
    },
    {
      id: '15',
      routeId: 'company-tech',
      name: "Company Laptops / Software Licenses",
      category: 'Technology',
      owner: 'Kassandra',
      itemCount: 11,
      docs: 'Software licenses, Hardware inventory',
      status: 'Active',
      icon: Settings,
    },
  ],
  financial: [
    {
      id: '16',
      routeId: 'payroll-docs',
      name: "Payroll Docs",
      category: 'Payroll',
      owner: 'Kassandra',
      itemCount: 24,
      docs: 'Pay stubs, Tax forms, Benefits',
      status: 'Active',
      icon: Building2,
    },
    {
      id: '17',
      routeId: 'business-taxes',
      name: "Tax Filings",
      category: 'Tax',
      owner: 'Family',
      itemCount: 9,
      docs: 'Business returns, Quarterly filings',
      status: 'Active',
      icon: FileText,
    },
    {
      id: '18',
      routeId: 'business-accounts',
      name: "Business Bank Accounts",
      category: 'Account',
      owner: 'Angel',
      itemCount: 5,
      docs: 'Account statements, Bank info',
      status: 'Active',
      icon: Building2,
    },
  ],
};

// Dashboard metrics data
const dashboardMetrics = [
  {
    title: "Active Licenses",
    value: "8 of 9",
    status: "good",
    icon: CheckCircle2,
    color: "text-green-400"
  },
  {
    title: "Contracts Expiring Soon",
    value: "3 items",
    status: "warning",
    icon: AlertTriangle,
    color: "text-yellow-400"
  },
  {
    title: "Payroll Pending",
    value: "$24,500",
    status: "attention",
    icon: Clock,
    color: "text-blue-400"
  },
  {
    title: "Assets Assigned",
    value: "42 items",
    status: "good",
    icon: Settings,
    color: "text-green-400"
  }
];

export default function FamilyBusiness() {
  const [searchTerm, setSearchTerm] = useState('');
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState<'vault' | 'dashboard'>('vault');
  const [, setLocation] = useLocation();
  const addButtonRef = useRef<HTMLButtonElement>(null);

  // Calculate total recommended items
  const totalItems = Object.values(businessData)
    .flat()
    .reduce((sum, item) => sum + item.itemCount, 0);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addButtonRef.current && !addButtonRef.current.contains(event.target as Node)) {
        setAddMenuOpen(false);
      }
    }

    if (addMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [addMenuOpen]);

  // Filter function for search
  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || item.owner.toLowerCase().includes(filterBy.toLowerCase());
      
      return matchesSearch && matchesFilter;
    });
  };

  const renderBusinessSection = (title: string, items: any[], sectionKey: string) => {
    const filteredItems = filterItems(items);
    if (searchTerm && filteredItems.length === 0) return null;
    
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <Button 
            size="sm"
            className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-8 px-3"
            onClick={() => {}}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <LuxuryCard 
              key={item.id} 
              className="p-6 cursor-pointer group hover:scale-[1.02] transition-all"
              onClick={() => setLocation(`/family/business/${item.routeId}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `#D4AF37` + '15' }}
                >
                  <item.icon className="h-6 w-6 text-[#D4AF37]" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#111214] border-[#232530]" align="end">
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-[#232530]">
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400 hover:bg-[#232530]">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                  {item.name}
                </h3>
                <div className="text-xs text-neutral-500 mb-1">
                  Owner: <span className="text-neutral-300">{item.owner}</span>
                  <span className="text-neutral-600"> • </span>
                  <span className="text-neutral-400">{item.category}</span>
                </div>
                <div className="text-xs text-neutral-400 mb-2">
                  Docs: {item.itemCount} Items ({item.docs})
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button className="text-[#D4AF37] hover:underline">View</button>
                  <span className="text-neutral-600">•</span>
                  <button className="text-neutral-300 hover:text-white">Share</button>
                  <span className="text-neutral-600">•</span>
                  <button className="text-neutral-300 hover:text-white">Copy</button>
                </div>
              </div>
            </LuxuryCard>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    return (
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-white mb-6">Business Dashboard</h2>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardMetrics.map((metric, index) => (
            <LuxuryCard key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `#D4AF37` + '15' }}
                >
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div>
                  <div className="text-xs text-neutral-400 mb-1">{metric.title}</div>
                  <div className="text-lg font-bold text-white">{metric.value}</div>
                </div>
              </div>
            </LuxuryCard>
          ))}
        </div>

        {/* Recent Activity */}
        <LuxuryCard className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Business Activity</h3>
          <div className="space-y-4">
            {[
              { action: "Transportation Permit expires in 30 days", time: "2 hours ago", type: "warning" },
              { action: "New vendor agreement signed with ABC Supply", time: "1 day ago", type: "success" },
              { action: "Payroll processed for 12 employees", time: "3 days ago", type: "info" },
              { action: "Business insurance policy renewed", time: "1 week ago", type: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[#0F0F0F]">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
                }`}></div>
                <div className="flex-1">
                  <div className="text-sm text-white">{activity.action}</div>
                  <div className="text-xs text-neutral-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </LuxuryCard>
      </div>
    );
  };

  const filteredEntities = filterItems(businessData.entities);
  const filteredContracts = filterItems(businessData.contracts);
  const filteredLicenses = filterItems(businessData.licenses);
  const filteredFinancial = filterItems(businessData.financial);
  const filteredPeople = filterItems(businessData.people);
  const filteredAssets = filterItems(businessData.assets);

  const hasResults = filteredEntities.length > 0 || filteredContracts.length > 0 || 
                    filteredLicenses.length > 0 || filteredFinancial.length > 0 ||
                    filteredPeople.length > 0 || filteredAssets.length > 0;

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
          <div className="flex items-center gap-6 min-w-0">
            <h1 className="text-3xl font-bold text-white shrink-0">Business</h1>
            
            {/* Add Button */}
            <div className="relative">
              <Button 
                ref={addButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setAddMenuOpen(!addMenuOpen);
                }}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/80 h-9 px-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              
              {addMenuOpen && (
                <div className="absolute top-full mt-2 left-0 w-56 bg-[#111214] border border-[#232530] rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      Entity
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      Contract
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      License
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      Employee
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-white hover:bg-[#232530] transition-colors">
                      Asset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Items */}
            <div className="flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium">
                🔔 {totalItems} recommended items
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-neutral-300 hover:text-[#D4AF37] p-2"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search business items…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
            />
          </div>
          
          {/* Filters */}
          <select 
            value={filterBy} 
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-3 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="all">All owners</option>
            <option value="angel">Angel</option>
            <option value="kassandra">Kassandra</option>
            <option value="family">Family</option>
          </select>
          
          <select className="px-3 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
            <option value="recent">Recently Updated</option>
            <option value="az">A–Z</option>
            <option value="za">Z–A</option>
            <option value="oldest">Oldest First</option>
          </select>
          
          {/* View Toggle */}
          <div className="flex items-center bg-[#161616] border border-[#2A2A33] rounded-lg p-1">
            <button
              onClick={() => setViewMode('vault')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'vault'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                viewMode === 'dashboard'
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Content based on view mode */}
        {viewMode === 'vault' ? (
          <>
            {/* Business Sections */}
            {renderBusinessSection("🏢 Company Entities", businessData.entities, 'entities')}
            {renderBusinessSection("📑 Contracts & Agreements", businessData.contracts, 'contracts')}
            {renderBusinessSection("🪪 Licenses & Permits", businessData.licenses, 'licenses')}
            {renderBusinessSection("👥 Employees & Partners", businessData.people, 'people')}
            {renderBusinessSection("⚙️ Assets & Equipment", businessData.assets, 'assets')}
            {renderBusinessSection("💵 Financial Records", businessData.financial, 'financial')}
          </>
        ) : (
          renderDashboardView()
        )}
      </div>

      {/* Empty State */}
      {searchTerm && !hasResults && viewMode === 'vault' && (
        <div className="text-center py-12">
          <div className="text-neutral-400 mb-4">
            <Building2 className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No business items found</h3>
          <p className="text-neutral-400">Try adjusting your search terms or add a new business item.</p>
        </div>
      )}
    </div>
  );
}