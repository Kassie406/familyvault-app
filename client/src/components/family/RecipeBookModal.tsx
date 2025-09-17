import { useState } from 'react';
import { 
  X, ChefHat, Plus, Clock, Users, Bookmark, Heart, 
  Search, Filter, BookOpen, Star 
} from 'lucide-react';

interface Recipe {
  id: string;
  title: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  notes?: string;
  isFavorite: boolean;
  tags: string[];
  createdBy: string;
  createdAt: string;
}

interface RecipeBookModalProps {
  open: boolean;
  onClose: () => void;
}

export function RecipeBookModal({ open, onClose }: RecipeBookModalProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'add' | 'favorites'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Mock data for now
  const [recipes] = useState<Recipe[]>([
    {
      id: '1',
      title: "Grandma's Apple Pie",
      category: 'Dessert',
      prepTime: 45,
      cookTime: 60,
      servings: 8,
      difficulty: 'Medium',
      ingredients: ['6 apples', '2 cups flour', '1 cup sugar', 'butter', 'cinnamon'],
      instructions: ['Preheat oven to 425°F', 'Prepare pie crust', 'Mix apples with sugar and cinnamon', 'Assemble pie', 'Bake for 45-60 minutes'],
      notes: 'Family recipe passed down for generations',
      isFavorite: true,
      tags: ['holiday', 'family-tradition'],
      createdBy: 'Grandma Rose',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Family Marinara Sauce',
      category: 'Sauce',
      prepTime: 15,
      cookTime: 45,
      servings: 6,
      difficulty: 'Easy',
      ingredients: ['2 lbs tomatoes', '4 cloves garlic', 'olive oil', 'basil', 'oregano'],
      instructions: ['Heat olive oil', 'Sauté garlic', 'Add tomatoes and herbs', 'Simmer for 45 minutes'],
      isFavorite: true,
      tags: ['pasta', 'italian'],
      createdBy: 'Mom',
      createdAt: '2024-02-01'
    },
    {
      id: '3',
      title: 'Sunday Roast Chicken',
      category: 'Main Course',
      prepTime: 20,
      cookTime: 120,
      servings: 4,
      difficulty: 'Medium',
      ingredients: ['1 whole chicken', 'rosemary', 'thyme', 'garlic', 'lemon'],
      instructions: ['Preheat oven to 375°F', 'Season chicken', 'Roast for 1.5-2 hours', 'Rest before carving'],
      isFavorite: false,
      tags: ['sunday-dinner', 'comfort-food'],
      createdBy: 'Dad',
      createdAt: '2024-02-10'
    }
  ]);

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Sauce', 'Breakfast', 'Snack'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <ChefHat className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Family Recipe Book</h2>
              <p className="text-sm text-gray-400">Preserving family traditions and simplifying meal planning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
            data-testid="button-close-recipe-book"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2A2A33]">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'browse' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-browse-recipes"
          >
            <BookOpen className="h-4 w-4 inline mr-2" />
            Browse Recipes ({recipes.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'favorites' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-favorite-recipes"
          >
            <Heart className="h-4 w-4 inline mr-2" />
            Favorites ({favoriteRecipes.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'add' 
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                : 'text-gray-400 hover:text-white'
            }`}
            data-testid="tab-add-recipe"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Recipe
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search recipes or ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] w-full"
                    data-testid="input-search-recipes"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-[#2A2A33] rounded-lg bg-[#161616] text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  data-testid="select-category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4 hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{recipe.title}</h3>
                        <p className="text-gray-400 text-sm">{recipe.category}</p>
                      </div>
                      <button className={`p-1 rounded ${recipe.isFavorite ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>
                        <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Serves {recipe.servings}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        recipe.difficulty === 'Easy' ? 'bg-green-900/30 text-green-300' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-red-900/30 text-red-300'
                      }`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">by {recipe.createdBy}</span>
                      <button className="px-3 py-1 bg-[#D4AF37] text-black text-sm rounded-lg hover:bg-[#D4AF37]/90 transition-colors">
                        View Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ChefHat size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No recipes found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-[#161616] border border-[#2A2A33] rounded-xl p-4 hover:border-[#D4AF37]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{recipe.title}</h3>
                        <p className="text-gray-400 text-sm">{recipe.category}</p>
                      </div>
                      <Heart className="h-4 w-4 text-red-400 fill-current" />
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime + recipe.cookTime} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Serves {recipe.servings}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">by {recipe.createdBy}</span>
                      <button className="px-3 py-1 bg-[#D4AF37] text-black text-sm rounded-lg hover:bg-[#D4AF37]/90 transition-colors">
                        View Recipe
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {favoriteRecipes.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Heart size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No favorite recipes yet. Start by marking recipes as favorites!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#161616] border border-[#2A2A33] rounded-xl p-6">
                <div className="text-center py-12 text-gray-400">
                  <Plus size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="mb-4">Recipe creation form will be available soon!</p>
                  <p className="text-sm">You'll be able to add new family recipes with ingredients, instructions, photos, and more.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}