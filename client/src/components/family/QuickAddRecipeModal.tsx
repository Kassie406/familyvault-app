import { useState } from "react";
import { X, ChefHat } from "lucide-react";

interface QuickAddRecipeModalProps {
  open: boolean;
  onClose: (created?: boolean) => void;
}

export function QuickAddRecipeModal({ open, onClose }: QuickAddRecipeModalProps) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    
    if (!title.trim() || !ingredients.trim()) {
      setError("Please enter a title and at least one ingredient");
      return;
    }
    
    setSaving(true);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          notes: notes.trim() || undefined,
          ingredients: ingredients.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save recipe");
      }

      // Reset form and close
      setTitle("");
      setIngredients("");
      setNotes("");
      setSaving(false);
      onClose(true); // Signal that a recipe was created
    } catch (e: any) {
      setError(e.message || "Could not save recipe");
      setSaving(false);
    }
  }

  function handleClose() {
    setTitle("");
    setIngredients("");
    setNotes("");
    setError(null);
    setSaving(false);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
    >
      <div className="bg-[#0A0A0A] border border-[#2A2A33] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A33]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10">
              <ChefHat className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Quick Add Recipe</h2>
              <p className="text-sm text-gray-400">Add a recipe to your family cookbook</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors text-gray-400 hover:text-white"
            data-testid="button-close-quick-add-recipe"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Recipe Title *
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Chicken Alfredo"
                className="w-full rounded-lg bg-[#161616] border border-[#2A2A33] px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="input-recipe-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Ingredients *
              </label>
              <textarea
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
                rows={6}
                placeholder={`Enter ingredients, one per line or comma-separated:

chicken breast x2
fettuccine 12 oz
heavy cream 1 cup
garlic 3 cloves
parmesan 1/2 cup`}
                className="w-full rounded-lg bg-[#161616] border border-[#2A2A33] px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="textarea-recipe-ingredients"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Cooking tips, serving suggestions, or family notes..."
                className="w-full rounded-lg bg-[#161616] border border-[#2A2A33] px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                data-testid="textarea-recipe-notes"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-900/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-[#2A2A33] text-white/90 hover:bg-[#1A1A1A] transition-colors"
                data-testid="button-cancel-recipe"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black font-semibold hover:bg-[#D4AF37]/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                data-testid="button-save-recipe"
              >
                {saving ? "Saving..." : "Save Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}