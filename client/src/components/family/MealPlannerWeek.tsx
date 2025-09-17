import { useState, useEffect, useMemo } from "react";
import { CalendarDays, Plus, ShoppingCart } from "lucide-react";
import { QuickAddRecipeModal } from "./QuickAddRecipeModal";

type Recipe = { 
  id: string; 
  title: string; 
  ingredients: string;
  category?: string;
  difficulty?: string;
};

type MealPlanEntry = { 
  id: string; 
  date: string; 
  mealType: "breakfast" | "lunch" | "dinner" | "snack"; 
  title?: string; 
  recipe?: Recipe; 
  recipeId?: string;
};

type MealPlanWeekData = {
  start: string;
  end: string;
  entries: MealPlanEntry[];
};

function startOfWeek(d = new Date()) {
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function dayPlus(d: Date, i: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + i);
  return x;
}

const MEALS: MealPlanEntry["mealType"][] = ["breakfast", "lunch", "dinner", "snack"];

export function MealPlannerWeek() {
  const [weekStart] = useState<Date>(() => startOfWeek());
  const [mealPlanData, setMealPlanData] = useState<MealPlanWeekData>({ 
    start: "", 
    end: "", 
    entries: [] 
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openAddRecipe, setOpenAddRecipe] = useState(false);
  
  async function loadMealPlan() {
    setError(null);
    setLoading(true);
    try {
      const [mealPlanResponse, recipesResponse] = await Promise.all([
        fetch(`/api/mealplan/week?start=${weekStart.toISOString()}`),
        fetch("/api/recipes")
      ]);
      
      if (!mealPlanResponse.ok || !recipesResponse.ok) {
        throw new Error("Failed to load meal plan data");
      }
      
      const mealPlanData = await mealPlanResponse.json();
      const recipesData = await recipesResponse.json();
      
      setMealPlanData(mealPlanData);
      setRecipes(recipesData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMealPlan();
  }, []);

  async function setMeal(date: Date, mealType: MealPlanEntry["mealType"], recipeId?: string, title?: string) {
    try {
      const response = await fetch("/api/mealplan/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.toISOString(),
          mealType,
          recipeId: recipeId || undefined,
          title: recipeId ? undefined : (title || undefined),
        })
      });

      if (!response.ok) {
        throw new Error("Failed to set meal");
      }

      await loadMealPlan();
    } catch (e: any) {
      alert(e.message || "Could not set meal");
    }
  }

  const entriesByKey = useMemo(() => {
    const map = new Map<string, MealPlanEntry>();
    for (const entry of mealPlanData.entries) {
      const date = new Date(entry.date);
      const key = `${date.toDateString()}_${entry.mealType}`;
      map.set(key, entry);
    }
    return map;
  }, [mealPlanData.entries]);

  async function generateShoppingList() {
    try {
      const response = await fetch("/api/mealplan/generate-shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: weekStart.toISOString() })
      });

      if (!response.ok) {
        throw new Error("Failed to generate shopping list");
      }

      const result = await response.json();
      alert(`Generated shopping list with ${result.added} items from this week's meals!`);
    } catch (e: any) {
      alert(e.message || "Could not generate shopping list");
    }
  }

  async function kidChoice(date: Date) {
    const title = prompt("Kid's Choice dinner (e.g., Tacos)?");
    if (!title) return;
    await setMeal(date, "dinner", undefined, title);
  }

  async function reloadRecipesOnly() {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const recipesData = await response.json();
        setRecipes(recipesData);
      }
    } catch (e) {
      console.error("Failed to reload recipes:", e);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#D4AF37]/10">
            <CalendarDays className="h-6 w-6 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Meal Planner (Week)</h2>
            <p className="text-sm text-gray-400">Plan your family's meals for the week</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setOpenAddRecipe(true)}
            className="px-3 py-2 rounded-lg border border-white/15 text-white/90 hover:bg-white/10 transition-colors flex items-center gap-2"
            data-testid="button-add-recipe"
          >
            <Plus className="h-4 w-4" />
            Add Recipe
          </button>
          <button
            onClick={generateShoppingList}
            className="px-3 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90 transition-colors flex items-center gap-2"
            data-testid="button-generate-shopping-list"
          >
            <ShoppingCart className="h-4 w-4" />
            Generate Shopping List
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg p-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          <p className="mt-2">Loading meal plan...</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = dayPlus(weekStart, i);
            const dayName = date.toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" });
            
            return (
              <div key={i} className="rounded-xl border border-white/10 bg-black/40 p-4">
                <div className="text-white/80 text-sm mb-3 font-medium text-center">
                  {dayName}
                </div>
                <div className="space-y-3">
                  {MEALS.map(mealType => {
                    const entry = entriesByKey.get(`${date.toDateString()}_${mealType}`);
                    const mealText = entry?.recipe?.title || entry?.title || "Add...";
                    
                    return (
                      <div key={mealType} className="rounded-lg bg-white/5 border border-white/10 p-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-white/90 text-sm capitalize font-medium">{mealType}</span>
                          {mealType === "dinner" && (
                            <button
                              onClick={() => kidChoice(date)}
                              className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 underline"
                              data-testid={`button-kid-choice-${i}`}
                            >
                              Kid's Choice
                            </button>
                          )}
                        </div>
                        
                        <MealPicker
                          recipes={recipes}
                          currentMeal={mealText}
                          onPick={(selection) => {
                            if (selection === "__custom__") {
                              const title = prompt("Custom meal name?");
                              if (title) setMeal(date, mealType, undefined, title);
                            } else {
                              setMeal(date, mealType, selection);
                            }
                          }}
                        />
                        
                        <div className="text-white/70 mt-2 text-sm truncate">
                          {mealText}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Add Recipe Modal */}
      <QuickAddRecipeModal
        open={openAddRecipe}
        onClose={async (created) => {
          setOpenAddRecipe(false);
          if (created) await reloadRecipesOnly();
        }}
      />
    </div>
  );
}

function MealPicker({ 
  recipes, 
  currentMeal, 
  onPick 
}: {
  recipes: Recipe[];
  currentMeal: string;
  onPick: (recipeIdOrCustom: "__custom__" | string) => void;
}) {
  return (
    <select
      className="w-full bg-black/60 border border-white/10 text-white text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
      onChange={(e) => {
        const value = e.target.value;
        if (!value) return;
        onPick(value as any);
        e.currentTarget.selectedIndex = 0;
      }}
      data-testid="select-meal-picker"
    >
      <option value="">Choose...</option>
      <option value="__custom__">Custom...</option>
      <optgroup label="Recipes">
        {recipes.map(recipe => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.title}
          </option>
        ))}
      </optgroup>
    </select>
  );
}