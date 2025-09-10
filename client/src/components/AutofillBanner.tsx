import { Sparkles, ThumbsUp, ThumbsDown, Info } from "lucide-react";

export default function AutofillBanner({
  open,
  fileName,
  fields,
  suggestion,
  onAccept,
  onDismiss
}: {
  open: boolean;
  fileName?: string;
  fields?: { key: string; value: string; confidence: number; pii?: boolean }[];
  suggestion?: { memberId: string; memberName: string; confidence: number } | null;
  onAccept: (memberId: string) => void;
  onDismiss: () => void;
}) {
  if (!open) return null;

  const count = fields?.length ?? 0;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mb-4" data-testid="autofill-banner">
      <div className="flex items-start gap-3">
        <div className="p-1 bg-blue-100 rounded-full"><Sparkles className="w-4 h-4 text-blue-600" /></div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium" data-testid="text-suggested-autofill">Suggested autofill</span>
            <span className="text-xs text-blue-700" data-testid="text-details-count">{count} details found</span>
          </div>
          <div className="mt-2 text-sm">
            {fields?.slice(0,2).map(f => (
              <div key={f.key} className="flex justify-between" data-testid={`field-${f.key.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="text-gray-600">{f.key}</span>
                <span className="font-medium">{f.pii ? mask(f.value) : f.value}</span>
              </div>
            ))}
          </div>

          {suggestion && (
            <div className="mt-3 text-sm" data-testid="suggested-destination">
              Suggested destination: <span className="font-medium">{suggestion.memberName}</span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button 
              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200" 
              onClick={onDismiss}
              data-testid="button-dismiss"
            >
              Dismiss
            </button>
            {suggestion && (
              <button 
                className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => onAccept(suggestion.memberId)}
                data-testid="button-accept-all"
              >
                Accept all
              </button>
            )}
            <div className="ml-auto flex items-center gap-1 text-gray-500">
              <ThumbsUp className="w-4 h-4 cursor-pointer hover:text-green-600" data-testid="button-thumbs-up" />
              <ThumbsDown className="w-4 h-4 cursor-pointer hover:text-red-600" data-testid="button-thumbs-down" />
              <Info className="w-4 h-4 cursor-pointer hover:text-blue-600" data-testid="button-info" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500" data-testid="text-filename">File: {fileName}</div>
    </div>
  );
}

function mask(v: string) {
  // ***-**-2645 style masking
  return v.replace(/\d(?=\d{4})/g, "•");
}