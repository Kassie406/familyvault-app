import React, { useState } from 'react';
import { DollarSign, Plus, Search, Filter, TrendingUp, TrendingDown, ArrowLeft, Edit3, Trash2, Calendar, BarChart3, PieChart, Target } from 'lucide-react';
import { useLocation } from 'wouter';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  recurring?: boolean;
  tags: string[];
  createdBy: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
  icon: string;
}

interface BudgetGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

const BudgetTracker: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('month');
  const [activeTab, setActiveTab] = useState<'transactions' | 'budget' | 'goals'>('transactions');
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  // Mock data for transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Grocery Shopping',
      amount: -127.50,
      category: 'Food',
      date: '2024-01-25',
      type: 'expense',
      tags: ['groceries', 'weekly'],
      createdBy: 'Mom'
    },
    {
      id: '2',
      description: 'Electricity Bill',
      amount: -89.00,
      category: 'Utilities',
      date: '2024-01-15',
      type: 'expense',
      recurring: true,
      tags: ['utilities', 'monthly'],
      createdBy: 'Dad'
    },
    {
      id: '3',
      description: 'Family Dinner Out',
      amount: -65.00,
      category: 'Entertainment',
      date: '2024-01-14',
      type: 'expense',
      tags: ['dining', 'family'],
      createdBy: 'Mom'
    },
    {
      id: '4',
      description: 'Salary Deposit',
      amount: 3200.00,
      category: 'Income',
      date: '2024-01-01',
      type: 'income',
      recurring: true,
      tags: ['salary', 'monthly'],
      createdBy: 'Dad'
    },
    {
      id: '5',
      description: 'Gas Station',
      amount: -45.00,
      category: 'Transportation',
      date: '2024-01-12',
      type: 'expense',
      tags: ['gas', 'car'],
      createdBy: 'Dad'
    }
  ]);

  // Mock data for budget categories
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([
    { id: '1', name: 'Food', budgeted: 600, spent: 427.50, color: 'bg-green-500', icon: '🍽️' },
    { id: '2', name: 'Utilities', budgeted: 300, spent: 189.00, color: 'bg-blue-500', icon: '⚡' },
    { id: '3', name: 'Entertainment', budgeted: 200, spent: 165.00, color: 'bg-purple-500', icon: '🎬' },
    { id: '4', name: 'Transportation', budgeted: 400, spent: 245.00, color: 'bg-yellow-500', icon: '🚗' },
    { id: '5', name: 'Healthcare', budgeted: 250, spent: 0, color: 'bg-red-500', icon: '🏥' },
    { id: '6', name: 'Shopping', budgeted: 300, spent: 89.00, color: 'bg-pink-500', icon: '🛍️' }
  ]);

  // Mock data for budget goals
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      targetDate: '2024-12-31',
      category: 'Savings',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Family Vacation',
      targetAmount: 5000,
      currentAmount: 2800,
      targetDate: '2024-07-15',
      category: 'Travel',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'New Car Down Payment',
      targetAmount: 8000,
      currentAmount: 1200,
      targetDate: '2024-10-01',
      category: 'Transportation',
      priority: 'medium'
    }
  ]);

  const categories = ['all', 'Food', 'Utilities', 'Entertainment', 'Transportation', 'Healthcare', 'Shopping', 'Income'];
  const timeframes = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || transaction.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const netIncome = totalIncome - totalExpenses;

  const deleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    }
  };

  const getCategoryProgress = (category: BudgetCategory) => {
    const percentage = (category.spent / category.budgeted) * 100;
    return Math.min(percentage, 100);
  };

  const getGoalProgress = (goal: BudgetGoal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setLocation('/family')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Family Budget Tracker</h1>
                <p className="text-gray-400">Track expenses, manage budgets, and achieve financial goals</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingTransaction(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">This Month</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              ${totalIncome.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Income</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
              <span className="text-sm text-gray-400">This Month</span>
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">
              ${totalExpenses.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Expenses</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <span className="text-sm text-gray-400">Net Income</span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${netIncome.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              {netIncome >= 0 ? 'Surplus' : 'Deficit'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'transactions', name: 'Transactions', icon: DollarSign },
            { id: 'budget', name: 'Budget Categories', icon: PieChart },
            { id: 'goals', name: 'Financial Goals', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-black'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="Search transactions, categories, or tags..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Timeframe:</span>
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.id}
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedTimeframe === timeframe.id
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {timeframe.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white">{transaction.description}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {transaction.category}
                      </span>
                      {transaction.recurring && (
                        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      <span>By {transaction.createdBy}</span>
                      <div className="flex space-x-1">
                        {transaction.tags.map((tag) => (
                          <span key={tag} className="text-xs px-1 py-0.5 bg-gray-700 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-500 hover:text-blue-400">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTransaction(transaction.id)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgetCategories.map((category) => {
              const progress = getCategoryProgress(category);
              const remaining = category.budgeted - category.spent;
              const isOverBudget = category.spent > category.budgeted;
              
              return (
                <div
                  key={category.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-lg`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="text-sm text-gray-400">
                          ${category.spent.toFixed(2)} of ${category.budgeted.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 text-gray-500 hover:text-blue-400">
                      <Edit3 size={16} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' : 'bg-[#D4AF37]'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className={`${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                        {progress.toFixed(1)}% used
                      </span>
                      <span className={`${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'remaining' : 'over budget'}
                      </span>
                    </div>
                  </div>

                  {isOverBudget && (
                    <div className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                      ⚠️ Over budget by ${(category.spent - category.budgeted).toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetGoals.map((goal) => {
              const progress = getGoalProgress(goal);
              const remaining = goal.targetAmount - goal.currentAmount;
              const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={goal.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-1">{goal.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{goal.category}</p>
                      <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(goal.priority)}`}>
                        {goal.priority} priority
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-500 hover:text-blue-400">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </span>
                      <span className="text-[#D4AF37]">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-[#D4AF37] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-400">
                      <div>${remaining.toLocaleString()} remaining</div>
                      <div className="text-xs">Target: {new Date(goal.targetDate).toLocaleDateString()}</div>
                    </div>
                    <div className={`text-right ${daysLeft > 30 ? 'text-green-400' : daysLeft > 7 ? 'text-yellow-400' : 'text-red-400'}`}>
                      <div className="font-medium">{daysLeft} days</div>
                      <div className="text-xs">remaining</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Transaction Modal */}
        {isAddingTransaction && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Transaction</h3>
              <p className="text-gray-400 mb-4">Transaction form would go here</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAddingTransaction(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Transaction creation form would open here');
                    setIsAddingTransaction(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#D4AF37]">
              {transactions.length}
            </div>
            <div className="text-sm text-gray-400">Total Transactions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {budgetCategories.length}
            </div>
            <div className="text-sm text-gray-400">Budget Categories</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {budgetGoals.length}
            </div>
            <div className="text-sm text-gray-400">Financial Goals</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {transactions.filter(t => t.recurring).length}
            </div>
            <div className="text-sm text-gray-400">Recurring Items</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
