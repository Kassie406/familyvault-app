import { useState, useRef, useEffect } from 'react';
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
  ChartLine,
  MoreHorizontal,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { LuxuryCard } from '@/components/luxury-cards';

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
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState('Finance');
  const [tempTitle, setTempTitle] = useState('Finance');

  const recommendedItems = 38;

  // Custom click outside hook for stable button behavior
  const addMenuRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!addMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setAddMenuOpen(false);
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAddMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [addMenuOpen]);

  // Handle escape key for title editing
  useEffect(() => {
    if (!isEditingTitle) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditingTitle(false);
        setTempTitle(pageTitle);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isEditingTitle, pageTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleEditTitle = () => {
    setTempTitle(pageTitle);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (tempTitle.trim()) {
      setPageTitle(tempTitle.trim());
    } else {
      setTempTitle(pageTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelEdit = () => {
    setTempTitle(pageTitle);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleCreateFinanceItem = (type: string) => {
    console.log(`Creating new ${type}`);
    setAddMenuOpen(false);
    // TODO: Implement create finance item functionality
  };

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
      <LuxuryCard className="p-6 cursor-pointer group hover:scale-[1.02] transition-all">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${account.iconColor}15` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: account.iconColor }} />
          </div>
          {account.status && (
            <Badge variant="secondary" className="bg-[#2A2A33] text-neutral-300 text-xs">
              {account.status}
            </Badge>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
            {account.name}
          </h3>
        </div>
        
        <div className="flex items-center text-sm text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors">
          <Receipt className="h-4 w-4 mr-1" />
          <span>{account.itemCount} items</span>
        </div>
      </LuxuryCard>
    );
  };

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
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="text-3xl font-bold text-white bg-transparent border-b-2 border-[#D4AF37] outline-none focus:border-[#D4AF37] min-w-0"
                    style={{ background: 'transparent' }}
                    data-testid="title-input"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 text-green-400 hover:text-green-300 transition-colors"
                    data-testid="save-title-button"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    data-testid="cancel-title-button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-white shrink-0" data-testid="page-title">{pageTitle}</h1>
                  <button
                    onClick={handleEditTitle}
                    className="p-1 text-white/60 hover:text-white rounded transition-colors"
                    data-testid="edit-title-button"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ink-400)] h-4 w-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none w-64"
                data-testid="search-finance"
              />
            </div>
            <Button variant="ghost" size="sm" className="text-[var(--ink-300)] hover:text-[var(--gold)]">
              <HelpCircle className="h-4 w-4 mr-2" />
              Help
            </Button>
            <div className="w-8 h-8 rounded-full bg-[var(--gold)] flex items-center justify-center">
              <span className="text-black text-sm font-medium">KC</span>
            </div>
          </div>
        </div>
      </LuxuryCard>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        {/* Filter Controls */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-300">Show archived</span>
            <Switch 
              checked={showArchived}
              onCheckedChange={setShowArchived}
              className="data-[state=checked]:bg-[#D4AF37]"
              data-testid="show-archived-toggle"
            />
          </div>
        </div>

        {/* Advisor Collaboration Banner */}
        <LuxuryCard className="p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5"></div>
          <div className="relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-20 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">
                Collaborate with trusted advisors to manage your system
              </h3>
              <p className="text-neutral-300 mb-4">
                Give your advisors limited access to view and update the assets they help you manage. Assign tasks and control what they can see and do.
              </p>
              <div className="flex gap-3">
                <Button 
                  className="bg-[#3498DB] text-white hover:bg-[#2980B9]"
                  data-testid="invite-advisor-button"
                >
                  Invite an advisor
                </Button>
                <Button variant="ghost" className="text-neutral-300 hover:text-[#D4AF37]">
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
          </div>
        </LuxuryCard>

        {/* Bank Accounts Section */}
        <div>
          <div className="flex items-center gap-4 mb-6 relative z-20">
            <h2 className="text-xl font-semibold text-white">Bank Accounts</h2>
            
            {/* STABLE + BUTTON WITH FINANCIAL MENU - MOVED TO BANK ACCOUNTS */}
            <div 
              ref={addMenuRef} 
              className="relative inline-flex items-center isolate"
              style={{ isolation: 'isolate', zIndex: 1000 }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Add to Finance"
                aria-expanded={addMenuOpen}
                aria-haspopup="menu"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setAddMenuOpen((v) => !v);
                }}
                className="h-8 w-8 rounded-full flex items-center justify-center bg-[#D4AF37] text-black shadow hover:bg-[#caa62f] active:bg-[#b59324] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] stable-add-button"
                data-testid="add-finance-item-button"
                style={{ position: 'relative', zIndex: 1001 }}
              >
                <Plus className="h-4 w-4" />
              </button>

              {/* FINANCIAL MENU DROPDOWN */}
              {addMenuOpen && (
                <div
                  role="menu"
                  aria-label="Add to Finance"
                  className="absolute left-0 top-10 w-64 rounded-xl border border-[#252733] bg-[#0F0F10] text-white shadow-xl p-2"
                  style={{ zIndex: 1002 }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1.5 text-sm font-medium text-[#D4AF37]">
                    Add to Finance
                  </div>
                  <ul className="mt-1">
                    {[
                      ["Import with Plaid", "import-plaid", "🏦"],
                      ["Add Manually", "add-manually", null],
                      ["Bank Account", "bank-account", null],
                      ["Investment Account", "investment-account", null],
                      ["Loan", "loan", null],
                      ["Credit Card", "credit-card", null],
                      ["Cryptocurrency", "cryptocurrency", null],
                      ["Other", "other", null],
                    ].map(([label, value, icon]) => (
                      <li key={value}>
                        <button
                          role="menuitem"
                          className="w-full text-left px-2 py-2 rounded-md hover:bg-white/5 transition-colors flex items-center gap-2"
                          onClick={() => handleCreateFinanceItem(value as string)}
                        >
                          {icon && <span>{icon}</span>}
                          <span>{label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <div className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <span className="text-black text-xs">⚡</span>
              </div>
              <span>{recommendedItems} recommended items</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Credit Cards Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Credit Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditCards.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Investment Accounts Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Investment Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentAccounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Loans Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Loans</h2>
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