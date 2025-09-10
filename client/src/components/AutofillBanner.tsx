import { Sparkles, Info, RefreshCw } from "lucide-react";

type Props = {
  fileName: string;
  detailsCount: number;
  fields: { key: string; value: string; pii?: boolean }[];
  suggestion?: { memberId: string; memberName: string; confidence: number } | null;
  onAccept: () => void;
  onDismiss: () => void;
  onViewDetails: () => void;
  onRegenerate?: () => void;
};

export default function AutofillBanner({
  fileName, detailsCount, fields, suggestion, onAccept, onDismiss, onViewDetails, onRegenerate
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm" data-testid="autofill-banner">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-100">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20">
            <Sparkles className="h-3 w-3 text-yellow-400" />
          </span>
          <span className="font-medium" data-testid="text-suggested-autofill">Suggested autofill</span>
          <span className="text-zinc-400" data-testid="text-details-count">• {detailsCount} details found</span>
        </div>
        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button 
              className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200 transition-colors flex items-center gap-1"
              onClick={onRegenerate}
              data-testid="button-regenerate"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </button>
          )}
          <button 
            className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
            onClick={onDismiss}
            data-testid="button-dismiss"
          >
            Dismiss
          </button>
          <button 
            className="px-3 py-1.5 text-sm rounded-md bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 transition-colors font-medium"
            onClick={onAccept}
            data-testid="button-accept-all"
          >
            Accept all
          </button>
        </div>
      </div>

      {suggestion && (
        <div className="mt-2 text-sm text-zinc-300" data-testid="suggested-destination">
          Suggested destination: <span className="font-medium text-[#D4AF37]">{suggestion.memberName}</span>
        </div>
      )}

      <button 
        className="mt-3 w-full rounded-md border border-zinc-800 py-2 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
        onClick={onViewDetails}
        data-testid="button-view-details"
      >
        View all details
      </button>
    </div>
  );
}