import { Check, X, Sparkles } from "lucide-react";
import { AutoFillSuggestion } from "@/types/ai";

type Props = {
  suggestion: AutoFillSuggestion | null;  // null = hidden
  loading?: boolean;                      // show skeleton while "Analyzing…"
  onAcceptAll: (s: AutoFillSuggestion) => void;
  onDismissAll: (s: AutoFillSuggestion) => void;
  onViewDetails?: (s: AutoFillSuggestion) => void;
};

export default function AutofillBanner({
  suggestion,
  loading = false,
  onAcceptAll,
  onDismissAll,
  onViewDetails,
}: Props) {
  if (!loading && !suggestion) return null;

  const count = suggestion?.fields.length ?? 0;

  return (
    <div className="rounded-xl border border-indigo-200/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 shadow-sm mt-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Sparkles className="h-5 w-5 text-indigo-500" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
              {loading ? "Analyzing…" : "Suggested autofill"}
            </span>

            {!loading && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
                {count} {count === 1 ? "detail" : "details"} found
              </span>
            )}
          </div>

          {/* Headline preview */}
          {!loading && suggestion && (
            <div className="mt-3 rounded-lg border border-indigo-200/30 bg-white/60 dark:bg-black/10 px-4 py-3">
              <div className="text-sm font-medium mb-1">
                {suggestion.itemType}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {headline(suggestion.fields).map((f) => (
                  <div key={f.key} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{f.label}</span>
                    <span className="font-medium text-right break-all">
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className="mt-3 w-full text-center text-sm text-indigo-700 dark:text-indigo-300 hover:underline"
                onClick={() => onViewDetails?.(suggestion)}
              >
                View all details
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            className="inline-flex items-center gap-1 rounded-md border border-slate-300/60 px-3 py-1.5 text-sm hover:bg-white/70 dark:border-slate-700 dark:hover:bg-slate-800/50"
            onClick={() => suggestion && onDismissAll(suggestion)}
            disabled={loading}
          >
            <X className="h-4 w-4" />
            Dismiss all
          </button>

          <button
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-60"
            onClick={() => suggestion && onAcceptAll(suggestion)}
            disabled={loading}
          >
            <Check className="h-4 w-4" />
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}

// pick two "headline" fields for the preview
function headline(fields: AutoFillSuggestion["fields"]) {
  const lookup = (label: string) => fields.find((f) => f.label === label);
  const first = lookup("Number") || fields[0];
  const second =
    lookup("Expiration date") ||
    fields.find((f) => f.key !== first?.key) ||
    fields[1];
  return [first, second].filter(Boolean) as typeof fields;
}