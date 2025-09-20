import React, { useState } from 'react';
import { ListTodo, Plus, Search, Filter, Check, X, Edit3, Trash2, User, Calendar, ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  completedAt?: string;
}

interface TodoList {
  id: string;
  name: string;
  description?: string;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
  color: string;
}

const SharedLists: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newItemText, setNewItemText] = useState('');

  // Mock data for shared lists
  const [todoLists, setTodoLists] = useState<TodoList[]>([
    {
      id: '1',
      name: 'Grocery Shopping',
      description: 'Weekly grocery list for the family',
      color: 'bg-green-500',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      items: [
        {
          id: '1',
          text: 'Buy milk and eggs',
          completed: false,
          assignee: 'Mom',
          dueDate: '2024-01-25',
          priority: 'high',
          category: 'Dairy',
          createdAt: '2024-01-20'
        },
        {
          id: '2',
          text: 'Get fresh vegetables',
          completed: true,
          assignee: 'Dad',
          priority: 'medium',
          category: 'Produce',
          createdAt: '2024-01-19',
          completedAt: '2024-01-20'
        },
        {
          id: '3',
          text: 'Pick up bread from bakery',
          completed: false,
          priority: 'low',
          category: 'Bakery',
          createdAt: '2024-01-18'
        }
      ]
    },
    {
      id: '2',
      name: 'House Chores',
      description: 'Weekly household tasks',
      color: 'bg-blue-500',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-22',
      items: [
        {
          id: '4',
          text: 'Vacuum living room',
          completed: false,
          assignee: 'Alex',
          dueDate: '2024-01-26',
          priority: 'medium',
          category: 'Cleaning',
          createdAt: '2024-01-22'
        },
        {
          id: '5',
          text: 'Clean bathroom',
          completed: true,
          assignee: 'Sarah',
          priority: 'high',
          category: 'Cleaning',
          createdAt: '2024-01-21',
          completedAt: '2024-01-22'
        }
      ]
    },
    {
      id: '3',
      name: 'School Preparation',
      description: 'Back to school checklist',
      color: 'bg-purple-500',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-23',
      items: [
        {
          id: '6',
          text: 'Pack school bags',
          completed: false,
          assignee: 'Kids',
          dueDate: '2024-01-24',
          priority: 'high',
          category: 'School',
          createdAt: '2024-01-23'
        },
        {
          id: '7',
          text: 'Prepare lunch boxes',
          completed: false,
          priority: 'medium',
          category: 'School',
          createdAt: '2024-01-23'
        }
      ]
    }
  ]);

  const filters = [
    { id: 'all', name: 'All Lists', count: todoLists.length },
    { id: 'active', name: 'Active', count: todoLists.filter(list => list.items.some(item => !item.completed)).length },
    { id: 'completed', name: 'Completed', count: todoLists.filter(list => list.items.every(item => item.completed)).length },
    { id: 'overdue', name: 'Overdue', count: todoLists.filter(list => 
      list.items.some(item => !item.completed && item.dueDate && new Date(item.dueDate) < new Date())
    ).length }
  ];

  const filteredLists = todoLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.items.some(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    switch (selectedFilter) {
      case 'active':
        return list.items.some(item => !item.completed);
      case 'completed':
        return list.items.every(item => item.completed);
      case 'overdue':
        return list.items.some(item => !item.completed && item.dueDate && new Date(item.dueDate) < new Date());
      default:
        return true;
    }
  });

  const toggleItemComplete = (listId: string, itemId: string) => {
    setTodoLists(prev => prev.map(list => 
      list.id === listId 
        ? {
            ...list,
            items: list.items.map(item => 
              item.id === itemId 
                ? { 
                    ...item, 
                    completed: !item.completed,
                    completedAt: !item.completed ? new Date().toISOString() : undefined
                  }
                : item
            )
          }
        : list
    ));
  };

  const deleteItem = (listId: string, itemId: string) => {
    setTodoLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const deleteList = (listId: string) => {
    setTodoLists(prev => prev.filter(list => list.id !== listId));
    if (selectedList === listId) {
      setSelectedList(null);
    }
  };

  const addNewList = () => {
    if (newListName.trim()) {
      const newList: TodoList = {
        id: Date.now().toString(),
        name: newListName.trim(),
        color: 'bg-gray-500',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTodoLists(prev => [...prev, newList]);
      setNewListName('');
      setIsAddingList(false);
    }
  };

  const addNewItem = (listId: string) => {
    if (newItemText.trim()) {
      const newItem: TodoItem = {
        id: Date.now().toString(),
        text: newItemText.trim(),
        completed: false,
        priority: 'medium',
        category: 'General',
        createdAt: new Date().toISOString()
      };
      setTodoLists(prev => prev.map(list => 
        list.id === listId 
          ? { ...list, items: [...list.items, newItem] }
          : list
      ));
      setNewItemText('');
      setIsAddingItem(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'low': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getListStats = (list: TodoList) => {
    const total = list.items.length;
    const completed = list.items.filter(item => item.completed).length;
    const overdue = list.items.filter(item => 
      !item.completed && item.dueDate && new Date(item.dueDate) < new Date()
    ).length;
    return { total, completed, overdue };
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
                <ListTodo className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">To Do/Shared Lists</h1>
                <p className="text-gray-400">Manage family tasks and shared lists</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingList(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>New List</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              placeholder="Search lists and tasks..."
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-[#D4AF37]/50'
                }`}
              >
                <span className="text-sm font-medium">{filter.name}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-black/20">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLists.map((list) => {
            const stats = getListStats(list);
            return (
              <div
                key={list.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
              >
                {/* List Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${list.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-white">{list.name}</h3>
                      {list.description && (
                        <p className="text-sm text-gray-400">{list.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-500 hover:text-blue-400">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteList(list.id)}
                      className="p-1 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">{stats.completed}/{stats.total}</span>
                  </div>
                  {stats.overdue > 0 && (
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">{stats.overdue} overdue</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>

                {/* Recent Items */}
                <div className="space-y-2 mb-4">
                  {list.items.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-3 p-2 rounded-lg ${
                        item.completed ? 'bg-gray-700/50' : 'bg-gray-700'
                      }`}
                    >
                      <button
                        onClick={() => toggleItemComplete(list.id, item.id)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          item.completed 
                            ? 'bg-[#D4AF37] border-[#D4AF37]' 
                            : 'border-gray-500 hover:border-[#D4AF37]'
                        }`}
                      >
                        {item.completed && <Check size={12} className="text-black" />}
                      </button>
                      <span className={`flex-1 text-sm ${
                        item.completed ? 'line-through text-gray-500' : 'text-gray-300'
                      }`}>
                        {item.text}
                      </span>
                      {item.assignee && (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          {item.assignee}
                        </span>
                      )}
                      <button
                        onClick={() => deleteItem(list.id, item.id)}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {list.items.length > 3 && (
                    <div className="text-center">
                      <button
                        onClick={() => setSelectedList(list.id)}
                        className="text-sm text-[#D4AF37] hover:text-[#B8941F]"
                      >
                        +{list.items.length - 3} more items
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Item */}
                {isAddingItem && selectedList === list.id ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addNewItem(list.id);
                        if (e.key === 'Escape') setIsAddingItem(false);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Add new task..."
                      autoFocus
                    />
                    <button
                      onClick={() => addNewItem(list.id)}
                      className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F]"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setIsAddingItem(false)}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedList(list.id);
                      setIsAddingItem(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            );
          })}

          {/* Add New List Card */}
          {isAddingList ? (
            <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-[#D4AF37]">
              <div className="space-y-4">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addNewList();
                    if (e.key === 'Escape') setIsAddingList(false);
                  }}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Enter list name..."
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addNewList}
                    className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                  >
                    Create List
                  </button>
                  <button
                    onClick={() => setIsAddingList(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsAddingList(true)}
              className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600 hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center h-full text-gray-400 hover:text-[#D4AF37]">
                <Plus className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium">Create New List</h3>
                <p className="text-sm text-center">Add a new shared list for your family</p>
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredLists.length === 0 && !isAddingList && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ListTodo className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No lists found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setIsAddingList(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Create Your First List</span>
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#D4AF37]">
              {todoLists.length}
            </div>
            <div className="text-sm text-gray-400">Total Lists</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {todoLists.reduce((acc, list) => acc + list.items.length, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {todoLists.reduce((acc, list) => acc + list.items.filter(item => item.completed).length, 0)}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {todoLists.reduce((acc, list) => 
                acc + list.items.filter(item => 
                  !item.completed && item.dueDate && new Date(item.dueDate) < new Date()
                ).length, 0
              )}
            </div>
            <div className="text-sm text-gray-400">Overdue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedLists;
