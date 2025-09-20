import React, { useState } from 'react';
import { ChefHat, Plus, Search, Filter, Clock, Users, Star, ArrowLeft, Edit3, Trash2, BookOpen, Heart } from 'lucide-react';
import { useLocation } from 'wouter';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  createdBy: string;
  isFavorite: boolean;
}

const RecipeBook: React.FC = () => {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);

  // Mock data for recipes
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      title: "Grandma's Apple Pie",
      description: "A classic family recipe passed down through generations",
      category: 'Dessert',
      prepTime: 45,
      cookTime: 60,
      servings: 8,
      difficulty: 'Medium',
      rating: 5,
      ingredients: [
        '6 cups sliced apples',
        '1 cup sugar',
        '2 tbsp flour',
        '1 tsp cinnamon',
        '2 pie crusts'
      ],
      instructions: [
        'Preheat oven to 425°F',
        'Mix apples with sugar, flour, and cinnamon',
        'Place in pie crust and cover',
        'Bake for 45-60 minutes until golden'
      ],
      tags: ['family-favorite', 'holiday', 'traditional'],
      createdAt: '2024-01-15',
      createdBy: 'Grandma Rose',
      isFavorite: true
    },
    {
      id: '2',
      title: "Family Marinara Sauce",
      description: "Our go-to pasta sauce recipe",
      category: 'Sauce',
      prepTime: 15,
      cookTime: 30,
      servings: 6,
      difficulty: 'Easy',
      rating: 4,
      ingredients: [
        '2 cans crushed tomatoes',
        '4 cloves garlic',
        '1 onion, diced',
        '2 tbsp olive oil',
        'Fresh basil'
      ],
      instructions: [
        'Heat olive oil in large pan',
        'Sauté onion and garlic',
        'Add tomatoes and simmer',
        'Season with basil and herbs'
      ],
      tags: ['quick', 'pasta', 'vegetarian'],
      createdAt: '2024-01-10',
      createdBy: 'Mom',
      isFavorite: false
    },
    {
      id: '3',
      title: "Sunday Roast Chicken",
      description: "Perfect for family dinners",
      category: 'Main Course',
      prepTime: 20,
      cookTime: 120,
      servings: 4,
      difficulty: 'Medium',
      rating: 5,
      ingredients: [
        '1 whole chicken (4-5 lbs)',
        '2 tbsp olive oil',
        'Salt and pepper',
        'Fresh herbs',
        'Root vegetables'
      ],
      instructions: [
        'Preheat oven to 375°F',
        'Season chicken inside and out',
        'Roast for 1.5-2 hours',
        'Let rest before carving'
      ],
      tags: ['sunday-dinner', 'family-meal', 'comfort-food'],
      createdAt: '2024-01-08',
      createdBy: 'Dad',
      isFavorite: true
    }
  ]);

  const categories = ['all', 'Appetizer', 'Main Course', 'Dessert', 'Sauce', 'Side Dish', 'Beverage'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const toggleFavorite = (recipeId: string) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId 
        ? { ...recipe, isFavorite: !recipe.isFavorite }
        : recipe
    ));
  };

  const deleteRecipe = (recipeId: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'Hard': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
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
                <ChefHat className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Family Recipe Book</h1>
                <p className="text-gray-400">Collect and share your family's favorite recipes</p>
              </div>
            </div>
            <button
              onClick={() => setIsAddingRecipe(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Add Recipe</span>
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
              placeholder="Search recipes, ingredients, or descriptions..."
            />
          </div>

          {/* Filter Tabs */}
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
              <span className="text-sm text-gray-400 font-medium">Difficulty:</span>
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {difficulty === 'all' ? 'All Levels' : difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-[#D4AF37]/50 transition-all"
            >
              {/* Recipe Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <ChefHat className="h-16 w-16 text-gray-500" />
              </div>

              {/* Recipe Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">{recipe.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{recipe.description}</p>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`p-1 rounded transition-colors ${
                        recipe.isFavorite 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-gray-500 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-blue-400">
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => deleteRecipe(recipe.id)}
                      className="p-1 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Recipe Meta */}
                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{recipe.prepTime + recipe.cookTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{recipe.servings}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(recipe.rating)}
                  </div>
                </div>

                {/* Category and Difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                    {recipe.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {recipe.tags.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                      +{recipe.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {recipe.createdBy}</span>
                  <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add Recipe Card */}
          {isAddingRecipe ? (
            <div className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-[#D4AF37]">
              <div className="text-center">
                <ChefHat className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Add New Recipe</h3>
                <p className="text-sm text-gray-400 mb-4">Recipe form would go here</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsAddingRecipe(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('Recipe creation form would open here');
                      setIsAddingRecipe(false);
                    }}
                    className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsAddingRecipe(true)}
              className="bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-600 hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center h-full text-gray-400 hover:text-[#D4AF37]">
                <Plus className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium">Add New Recipe</h3>
                <p className="text-sm text-center">Share your family's favorite dish</p>
              </div>
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredRecipes.length === 0 && !isAddingRecipe && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No recipes found</h3>
            <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setIsAddingRecipe(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Plus size={16} />
              <span>Add Your First Recipe</span>
            </button>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#D4AF37]">
              {recipes.length}
            </div>
            <div className="text-sm text-gray-400">Total Recipes</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {recipes.filter(r => r.isFavorite).length}
            </div>
            <div className="text-sm text-gray-400">Favorites</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {recipes.filter(r => r.difficulty === 'Easy').length}
            </div>
            <div className="text-sm text-gray-400">Easy Recipes</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {new Set(recipes.map(r => r.category)).size}
            </div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeBook;
