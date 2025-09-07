import { useState } from 'react';
import { 
  X, DollarSign, Plus, TrendingUp, TrendingDown, 
  PieChart, BarChart3, Calendar, Target, AlertCircle,
  CreditCard, Receipt, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

interface BudgetTrackerModalProps {
  open: boolean;
  onClose: () => void;
}

export function BudgetTrackerModal({ open, onClose }: BudgetTrackerModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'budget' | 'reports'>('overview');
  const [selectedMonth, setSelectedMonth] = useState('January 2024');
  
  // Mock data for demonstration
  const [monthlyBudget] = useState(3500);
  const [totalSpent] = useState(2450);
  const [totalIncome] = useState(4200);
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Grocery Shopping - Whole Foods',
      amount: -127.50,
      category: 'Food',
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: '2',
      description: 'Electricity Bill',
      amount: -89.00,
      category: 'Utilities',
      date: '2024-01-15',
      type: 'expense'
    },
    {
      id: '3',
      description: 'Family Dinner - Olive Garden',
      amount: -65.00,
      category: 'Entertainment',
      date: '2024-01-14',
      type: 'expense'
    },
    {
      id: '4',
      description: 'Salary Deposit',
      amount: 3200.00,
      category: 'Salary',
      date: '2024-01-01',
      type: 'income'
    },
    {
      id: '5',
      description: 'Gas Station',
      amount: -45.00,
      category: 'Transportation',
      date: '2024-01-12',
      type: 'expense'
    },
    {
      id: '6',
      description: 'Freelance Work',
      amount: 850.00,
      category: 'Side Income',
      date: '2024-01-10',
      type: 'income'
    }
  ]);

  const [budgetCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food & Groceries', budgeted: 800, spent: 425, color: 'bg-green-500' },
    { id: '2', name: 'Utilities', budgeted: 300, spent: 289, color: 'bg-blue-500' },
    { id: '3', name: 'Entertainment', budgeted: 400, spent: 165, color: 'bg-purple-500' },
    { id: '4', name: 'Transportation', budgeted: 250, spent: 145, color: 'bg-yellow-500' },
    { id: '5', name: 'Healthcare', budgeted: 200, spent: 75, color: 'bg-red-500' },
    { id: '6', name: 'Shopping', budgeted: 300, spent: 220, color: 'bg-pink-500' }
  ]);

  const budgetRemaining = monthlyBudget - totalSpent;
  const savingsRate = ((totalIncome - totalSpent) / totalIncome * 100).toFixed(1);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <DollarSign className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Family Budget Tracker</h2>
              <p className="text-sm text-gray-400">Track expenses, set goals, and manage family finances</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1 border border-[#2A2A33] rounded-lg bg-[#161616] text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
            >
              <option value="January 2024">January 2024</option>
              <option value="December 2023">December 2023</option>
              <option value="November 2023">November 2023</option>
            </select>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
              data-testid="button-close-budget-tracker"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2A2A33]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-budget-overview"
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'transactions' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-transactions"
          >
            <Receipt className="h-4 w-4 inline mr-2" />
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'budget' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-budget-categories"
          >
            <Target className="h-4 w-4 inline mr-2" />
            Budget Categories
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'reports' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-reports"
          >
            <PieChart className="h-4 w-4 inline mr-2" />
            Reports
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Total Income</span>
                    <ArrowUpRight className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-green-400">${totalIncome.toLocaleString()}</p>
                </div>
                
                <div className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Total Spent</span>
                    <ArrowDownRight className="h-4 w-4 text-red-400" />
                  </div>
                  <p className="text-2xl font-bold text-red-400">${totalSpent.toLocaleString()}</p>
                </div>
                
                <div className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Budget Remaining</span>
                    <Wallet className="h-4 w-4 text-[#D4AF37]" />
                  </div>
                  <p className="text-2xl font-bold text-[#D4AF37]">${budgetRemaining.toLocaleString()}</p>
                </div>
                
                <div className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Savings Rate</span>
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-400">{savingsRate}%</p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Recent Transactions</h3>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="text-[#D4AF37] text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                          {transaction.type === 'income' ? 
                            <TrendingUp className="h-4 w-4 text-green-400" /> : 
                            <TrendingDown className="h-4 w-4 text-red-400" />
                          }
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          <p className="text-gray-400 text-sm">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">All Transactions</h3>
                <button className="px-4 py-2 bg-[#D4AF37] text-black text-sm rounded-lg hover:bg-[#D4AF37]/90 transition-colors">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Transaction
                </button>
              </div>
              
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-[#161616] border border-[#2A2A33] rounded-xl hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${transaction.type === 'income' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                        {transaction.type === 'income' ? 
                          <TrendingUp className="h-4 w-4 text-green-400" /> : 
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-gray-400 text-sm">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <span className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Budget Categories</h3>
                <button className="px-4 py-2 bg-[#D4AF37] text-black text-sm rounded-lg hover:bg-[#D4AF37]/90 transition-colors">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgetCategories.map((category) => {
                  const percentage = (category.spent / category.budgeted) * 100;
                  const isOverBudget = category.spent > category.budgeted;
                  
                  return (
                    <div key={category.id} className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">{category.name}</h4>
                        {isOverBudget && <AlertCircle className="h-4 w-4 text-red-400" />}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Spent: ${category.spent}</span>
                          <span className="text-gray-400">Budget: ${category.budgeted}</span>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : category.color}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className={`${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                            {percentage.toFixed(1)}% used
                          </span>
                          <span className={`${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
                            ${isOverBudget ? 0 : (category.budgeted - category.spent).toFixed(2)} remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="text-center py-12 text-gray-400">
                <PieChart size={48} className="mx-auto mb-4 opacity-30" />
                <p className="mb-4">Advanced reporting features coming soon!</p>
                <p className="text-sm">You'll be able to view spending trends, create custom reports, and export financial data.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}