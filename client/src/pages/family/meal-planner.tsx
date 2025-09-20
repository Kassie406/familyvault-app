import React, { useState } from 'react';
import { CalendarDays, Plus, Search, Filter, Clock, Users, ChefHat, ArrowLeft, Edit3, Trash2, Calendar, ShoppingCart, Star } from 'lucide-react';
import { useLocation } from 'wouter';

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  recipeId?: string;
  tags: string[];
  createdBy: string;
  isFavorite: boolean;
}

interface ShoppingListItem {
  id: string;
  ingredient: string;
  quantity: string;
  category: string;
  checked: boolean;
}

const MealPlanner: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<string>('current');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'planner' | 'shopping' | 'stats'>('planner');
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  // Mock data for meal plan
  const [mealPlan, setMealPlan] = useState<Meal[]>([
    {
      id: '1',
      name: 'Chicken Alfredo',
      type: 'dinner',
      date: '2024-01-29',
      prepTime: 30,
      servings: 4,
      difficulty: 'medium',
      ingredients: ['chicken breast', 'fettuccine pasta', 'heavy cream', 'parmesan cheese', 'garlic'],
      instructions: ['Cook pasta', 'Prepare chicken', 'Make alfredo sauce', 'Combine and serve'],
      tags: ['pasta', 'comfort-food', 'family-favorite'],
      createdBy: 'Mom',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Turkey Sandwiches',
      type: 'lunch',
      date: '2024-01-30',
      prepTime: 5,
      servings: 4,
      difficulty: 'easy',
      ingredients: ['turkey slices', 'bread', 'lettuce', 'tomato', 'mayo'],
      instructions: ['Assemble sandwich with ingredients'],
      tags: ['quick', 'lunch', 'simple'],
      createdBy: 'Dad',
      isFavorite: false
    },
    {
      id: '3',
      name: 'Pancakes',
      type: 'breakfast',
      date: '2024-01-31',
      prepTime: 20,
      servings: 4,
      difficulty: 'easy',
      ingredients: ['flour', 'eggs', 'milk', 'sugar', 'baking powder', 'butter'],
      instructions: ['Mix dry ingredients', 'Add wet ingredients', 'Cook on griddle'],
      tags: ['breakfast', 'weekend', 'kids-favorite'],
      createdBy: 'Mom',
      isFavorite: true
    },
    {
      id: '4',
      name: 'Taco Night',
      type: 'dinner',
      date: '2024-02-01',
      prepTime: 25,
      servings: 4,
      difficulty: 'easy',
      ingredients: ['ground beef', 'taco shells', 'lettuce', 'cheese', 'tomatoes', 'sour cream'],
      instructions: ['Cook ground beef', 'Warm taco shells', 'Prepare toppings', 'Assemble tacos'],
      tags: ['mexican', 'family-night', 'interactive'],
      createdBy: 'Dad',
      isFavorite: true
    },
    {
      id: '5',
      name: 'Sunday Roast',
      type: 'lunch',
      date: '2024-02-04',
      prepTime: 120,
      servings: 6,
      difficulty: 'hard',
      ingredients: ['beef roast', 'potatoes', 'carrots', 'onions', 'herbs', 'gravy'],
      instructions: ['Season roast', 'Prepare vegetables', 'Roast in oven', 'Make gravy'],
      tags: ['sunday-dinner', 'traditional', 'special-occasion'],
      createdBy: 'Mom',
      isFavorite: true
    }
  ]);

  // Mock shopping list data
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([
    { id: '1', ingredient: 'Chicken breast', quantity: '2 lbs', category: 'Meat', checked: false },
    { id: '2', ingredient: 'Fettuccine pasta', quantity: '1 box', category: 'Pantry', checked: false },
    { id: '3', ingredient: 'Heavy cream', quantity: '1 cup', category: 'Dairy', checked: true },
    { id: '4', ingredient: 'Parmesan cheese', quantity: '1 cup grated', category: 'Dairy', checked: false },
    { id: '5', ingredient: 'Ground beef', quantity: '1 lb', category: 'Meat', checked: false },
    { id: '6', ingredient: 'Taco shells', quantity: '1 box', category: 'Pantry', checked: false },
    { id: '7', ingredient: 'Lettuce', quantity: '1 head', category: 'Produce', checked: false },
    { id: '8', ingredient: 'Tomatoes', quantity: '3 large', category: 'Produce', checked: false }
  ]);

  const weeks = [
    { id: 'current', name: 'This Week (Jan 29 - Feb 4)' },
    { id: 'next', name: 'Next Week (Feb 5 - Feb 11)' },
    { id: 'following', name: 'Following Week (Feb 12 - Feb 18)' }
  ];

  const mealTypes = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

  const filteredMeals = mealPlan.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMealType = selectedMealType === 'all' || meal.type === selectedMealType;
    
    return matchesSearch && matchesMealType;
  });

  const toggleFavorite = (mealId: string) => {
    setMealPlan(prev => prev.map(meal => 
      meal.id === mealId 
        ? { ...meal, isFavorite: !meal.isFavorite }
        : meal
    ));
  };

  const deleteMeal = (mealId: string) => {
    if (confirm('Are you sure you want to remove this meal from the plan?')) {
      setMealPlan(prev => prev.filter(meal => meal.id !== mealId));
    }
  };

  const toggleShoppingItem = (itemId: string) => {
    setShoppingList(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, checked: !item.checked }
        : item
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'hard': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'breakfast': return 'text-yellow-400 bg-yellow-500/10';
      case 'lunch': return 'text-blue-400 bg-blue-500/10';
      case 'dinner': return 'text-purple-400 bg-purple-500/10';
      case 'snack': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getWeekDays = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dates = ['Jan 29', 'Jan 30', 'Jan 31', 'Feb 1', 'Feb 2', 'Feb 3', 'Feb 4'];
    return days.map((day, index) => ({ day, date: dates[index] }));
  };

  const getMealsForDay = (dayIndex: number) => {
    const targetDate = `2024-0${dayIndex < 3 ? '1' : '2'}-${dayIndex < 3 ? 29 + dayIndex : dayIndex - 2}`;
    return mealPlan.filter(meal => meal.date === targetDate);
  };

  const shoppingCategories = ['Meat', 'Dairy', 'Produce', 'Pantry'];

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
                <CalendarDays className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Family Meal Planner</h1>
                <p className="text-gray-400">Plan meals, create shopping lists, and organize family dining</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingMeal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Add Meal</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CalendarDays className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">This Week</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {mealPlan.length}
            </div>
            <div className="text-sm text-gray-400">Meals Planned</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ChefHat className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Recipes</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {new Set(mealPlan.map(m => m.name)).size}
            </div>
            <div className="text-sm text-gray-400">Unique Recipes</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-[#D4AF37]/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <span className="text-sm text-gray-400">Shopping</span>
            </div>
            <div className="text-2xl font-bold text-[#D4AF37] mb-1">
              {shoppingList.filter(item => !item.checked).length}
            </div>
            <div className="text-sm text-gray-400">Items to Buy</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Prep Time</span>
            </div>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {Math.round(mealPlan.reduce((sum, meal) => sum + meal.prepTime, 0) / 60)}h
            </div>
            <div className="text-sm text-gray-400">Total This Week</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'planner', name: 'Meal Planner', icon: CalendarDays },
            { id: 'shopping', name: 'Shopping List', icon: ShoppingCart },
            { id: 'stats', name: 'Statistics', icon: Clock }
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
              placeholder="Search meals, recipes, or ingredients..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Week:</span>
              {weeks.map((week) => (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeek(week.id)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedWeek === week.id
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {week.name}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 font-medium">Meal Type:</span>
              {mealTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedMealType(type)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedMealType === type
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type === 'all' ? 'All Meals' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            {/* Weekly Grid View */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Meal Plan</h3>
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                {getWeekDays().map((dayInfo, dayIndex) => (
                  <div key={dayIndex} className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    <div className="text-center mb-4">
                      <div className="font-semibold text-white">{dayInfo.day}</div>
                      <div className="text-sm text-gray-400">{dayInfo.date}</div>
                    </div>
                    
                    <div className="space-y-2">
                      {getMealsForDay(dayIndex).map((meal) => (
                        <div
                          key={meal.id}
                          className="bg-gray-800 rounded-lg p-3 border border-gray-600 hover:border-[#D4AF37]/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${getMealTypeColor(meal.type)}`}>
                              {meal.type}
                            </span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => toggleFavorite(meal.id)}
                                className={`p-1 rounded transition-colors ${
                                  meal.isFavorite 
                                    ? 'text-red-400 hover:text-red-300' 
                                    : 'text-gray-500 hover:text-red-400'
                                }`}
                              >
                                <Star className={`h-3 w-3 ${meal.isFavorite ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-sm font-medium text-white mb-2 leading-tight">
                            {meal.name}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{meal.prepTime} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{meal.servings}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getMealsForDay(dayIndex).length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No meals planned
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal List View */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">All Planned Meals</h3>
              {filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">{meal.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${getMealTypeColor(meal.type)}`}>
                          {meal.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(meal.difficulty)}`}>
                          {meal.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>{new Date(meal.date).toLocaleDateString()}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{meal.prepTime} min prep</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Serves {meal.servings}</span>
                        </div>
                        <span>By {meal.createdBy}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {meal.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-300">
                        <strong>Ingredients:</strong> {meal.ingredients.slice(0, 3).join(', ')}
                        {meal.ingredients.length > 3 && ` +${meal.ingredients.length - 3} more`}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleFavorite(meal.id)}
                        className={`p-2 rounded transition-colors ${
                          meal.isFavorite 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-gray-500 hover:text-red-400'
                        }`}
                      >
                        <Star className={`h-4 w-4 ${meal.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-blue-400">
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMeal(meal.id)}
                        className="p-2 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shopping' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Shopping List</h3>
              <button
                onClick={() => alert('Generate shopping list from meal plan')}
                className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                <Plus size={16} />
                <span>Generate from Meal Plan</span>
              </button>
            </div>

            {shoppingCategories.map((category) => {
              const categoryItems = shoppingList.filter(item => item.category === category);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-4">{category}</h4>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          item.checked 
                            ? 'bg-gray-700 border-green-500/30 text-gray-400' 
                            : 'bg-gray-900 border-gray-600 text-white hover:border-[#D4AF37]/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleShoppingItem(item.id)}
                          className="w-4 h-4 text-[#D4AF37] bg-gray-700 border-gray-600 rounded focus:ring-[#D4AF37] focus:ring-2"
                        />
                        <div className="flex-1">
                          <span className={`${item.checked ? 'line-through' : ''}`}>
                            {item.ingredient}
                          </span>
                          <span className="text-sm text-gray-400 ml-2">({item.quantity})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Meal Type Distribution</h4>
                <div className="space-y-3">
                  {mealTypes.slice(1).map((type) => {
                    const count = mealPlan.filter(meal => meal.type === type).length;
                    const percentage = mealPlan.length > 0 ? (count / mealPlan.length) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Difficulty Levels</h4>
                <div className="space-y-3">
                  {['easy', 'medium', 'hard'].map((difficulty) => {
                    const count = mealPlan.filter(meal => meal.difficulty === difficulty).length;
                    const percentage = mealPlan.length > 0 ? (count / mealPlan.length) * 100 : 0;
                    return (
                      <div key={difficulty} className="flex items-center justify-between">
                        <span className="text-gray-300 capitalize">{difficulty}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-4">Weekly Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {mealPlan.filter(m => m.isFavorite).length}
                  </div>
                  <div className="text-sm text-gray-400">Favorite Meals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {mealPlan.filter(m => m.difficulty === 'easy').length}
                  </div>
                  <div className="text-sm text-gray-400">Easy Meals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(mealPlan.reduce((sum, meal) => sum + meal.prepTime, 0) / mealPlan.length) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Avg Prep Time (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(mealPlan.reduce((sum, meal) => sum + meal.servings, 0) / mealPlan.length) || 0}
                  </div>
                  <div className="text-sm text-gray-400">Avg Servings</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Meal Modal */}
        {isAddingMeal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Meal</h3>
              <p className="text-gray-400 mb-4">Meal planning form would go here</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsAddingMeal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Meal creation form would open here');
                    setIsAddingMeal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#D4AF37]">
              {mealPlan.length}
            </div>
            <div className="text-sm text-gray-400">Total Meals</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {shoppingList.length}
            </div>
            <div className="text-sm text-gray-400">Shopping Items</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {mealPlan.filter(m => m.isFavorite).length}
            </div>
            <div className="text-sm text-gray-400">Favorites</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {mealPlan.filter(m => m.difficulty === 'easy').length}
            </div>
            <div className="text-sm text-gray-400">Easy Meals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
