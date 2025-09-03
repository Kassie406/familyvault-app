import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  HelpCircle,
  Landmark,
  CreditCard,
  TrendingUp,
  Car,
  Home,
  GraduationCap,
  PiggyBank,
  Receipt,
  ChartLine
} from 'lucide-react';

interface FinancialAccount {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  itemCount: number;
  status?: string;
  iconColor: string;
}

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const recommendedItems = 38;

  const bankAccounts: FinancialAccount[] = [
    {
      id: '1',
      name: "Sarah's Savings Account",
      type: 'Savings',
      icon: PiggyBank,
      itemCount: 2,
      iconColor: '#E74C3C'
    },
    {
      id: '2',
      name: "Michael's Checking Account", 
      type: 'Checking',
      icon: Landmark,
      itemCount: 3,
      iconColor: '#3498DB'
    },
    {
      id: '3',
      name: "Sarah's Checking Account",
      type: 'Checking', 
      icon: Landmark,
      itemCount: 3,
      iconColor: '#3498DB'
    }
  ];

  const creditCards: FinancialAccount[] = [
    {
      id: '1',
      name: "Michael's Credit Card",
      type: 'Credit Card',
      icon: CreditCard,
      itemCount: 6,
      iconColor: '#2ECC71'
    },
    {
      id: '2',
      name: "Sarah's Credit Card",
      type: 'Credit Card',
      icon: CreditCard,
      itemCount: 6,
      iconColor: '#2ECC71'
    }
  ];

  const investmentAccounts: FinancialAccount[] = [
    {
      id: '1',
      name: "Michael's 401k Account",
      type: '401k',
      icon: ChartLine,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: '#9B59B6'
    },
    {
      id: '2',
      name: "Sarah's 401k Account",
      type: '401k',
      icon: ChartLine,
      itemCount: 2,
      status: 'Pre-populated',
      iconColor: '#9B59B6'
    }
  ];

  const loans: FinancialAccount[] = [
    {
      id: '1',
      name: "Michael's Auto Loan",
      type: 'Auto Loan',
      icon: Car,
      itemCount: 3,
      status: 'Pre-populated',
      iconColor: '#FF6B35'
    },
    {
      id: '2', 
      name: "Sarah's Auto Loan",
      type: 'Auto Loan',
      icon: Car,
      itemCount: 3,
      status: 'Pre-populated',
      iconColor: '#FF6B35'
    },
    {
      id: '3',
      name: "Home Mortgage",
      type: 'Mortgage',
      icon: Home,
      itemCount: 3,
      status: 'Pre-populated',
      iconColor: '#F39C12'
    },
    {
      id: '4',
      name: "Student Loan",
      type: 'Student Loan',
      icon: GraduationCap,
      itemCount: 3,
      status: 'Pre-populated',
      iconColor: '#8E44AD'
    }
  ];

  const AccountCard = ({ account }: { account: FinancialAccount }) => {
    const IconComponent = account.icon;
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D4AF37]/30 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${account.iconColor}15` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: account.iconColor }} />
          </div>
          {account.status && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
              {account.status}
            </Badge>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-[#0A0A1A] mb-1 group-hover:text-[#D4AF37] transition-colors">
            {account.name}
          </h3>
        </div>
        
        <div className="flex items-center text-sm text-[#3498DB] group-hover:text-[#D4AF37] transition-colors">
          <Receipt className="h-4 w-4 mr-1" />
          <span>{account.itemCount} items</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[#0A0A1A]">Finance</h1>
            <Button 
              size="sm" 
              className="bg-[#D4AF37] text-black hover:bg-[#c6a02e] rounded-full h-8 w-8 p-0"
              data-testid="add-finance-item-button"
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
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Show archived</span>
              <Switch 
                checked={showArchived}
                onCheckedChange={setShowArchived}
                className="data-[state=checked]:bg-[#D4AF37]"
                data-testid="show-archived-toggle"
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

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
              data-testid="search-finance"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        {/* Advisor Collaboration Banner */}
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl p-8 border border-[#D4AF37]/20">
          <div className="flex items-center gap-6">
            <div className="w-24 h-20 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-[#0A0A1A] mb-2">
                Collaborate with trusted advisors to manage your system
              </h3>
              <p className="text-gray-600 mb-4">
                Give your advisors limited access to view and update the assets they help you manage. Assign tasks and control what they can see and do.
              </p>
              <div className="flex gap-3">
                <Button 
                  className="bg-[#3498DB] text-white hover:bg-[#2980B9]"
                  data-testid="invite-advisor-button"
                >
                  Invite an advisor
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-[#D4AF37]">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#0A0A1A] mb-6">Bank Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Credit Cards Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#0A0A1A] mb-6">Credit Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Investment Accounts Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#0A0A1A] mb-6">Investment Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Loans Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#0A0A1A] mb-6">Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loans.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}