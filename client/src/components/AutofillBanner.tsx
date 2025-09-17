import { Sparkles, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";
import { useState } from "react";
import HelpDialog from "./HelpDialog";

export type BannerState = 'idle' | 'analyzing' | 'ready' | 'partial' | 'none' | 'unsupported' | 'failed';

type Props = {
  state: BannerState;
  fileName?: string;
  count?: number;
  confidence?: number;
  suggestion?: { memberId: string; memberName: string; confidence: number } | null;
  fields?: { key: string; value: string; pii?: boolean }[];
  onOpen?: () => void;
  onRetry?: () => void;
  onHelp?: () => void;
  onAccept?: () => void;
  onDismiss?: () => void;
  step?: 1 | 2 | 3; // For progress during analyzing
};

function maskPII(value: string) {
  if (value.length <= 4) return '****';
  return '****' + value.slice(-4);
}

function getProgressText(step: number) {
  switch (step) {
    case 1: return "Upload received";
    case 2: return "Reading text & detecting fields";
    case 3: return "Finding the right place";
    default: return "Processing...";
  }
}

export default function AutofillBanner({
  state, fileName, count = 0, confidence, suggestion, fields, onOpen, onRetry, onHelp, onAccept, onDismiss, step = 1
}: Props) {
  const [helpOpen, setHelpOpen] = useState(false);
  
  const titleMap = {
    idle: 'AI Suggestions',
    analyzing: 'Analyzing your document…',
    ready: `${count} detail${count === 1 ? '' : 's'} found`,
    partial: `${count} detail${count === 1 ? '' : 's'} found`,
    none: 'No details found',
    failed: 'We couldn\'t analyze this file',
    unsupported: 'File type not supported',
  } as const;

  const subMap = {
    idle: 'Upload a file to get suggested details and destinations.',
    analyzing: 'Looking for key fields (name, number, dates) and a likely destination.',
    ready: 'We\'ve suggested a destination. Review and accept.',
    partial: 'No confident match. Pick where this belongs and accept.',
    none: 'This file doesn\'t contain enough readable text. For best results, use PDFs or clear, flat photos.',
    failed: 'Something went wrong. Try again.',
    unsupported: 'Please upload PDF, PNG, or JPEG.',
  } as const;
  
  if (state === 'idle') {
    return null; // Don't show banner when idle
  }
  
  return (
    <>
      <div className={`rounded-lg px-4 py-3 border ${
        state === 'failed' || state === 'unsupported' ? 
          'border-red-600/30 bg-red-950/20' :
        state === 'ready' || state === 'partial' ? 
          'border-emerald-600/30 bg-emerald-950/20' : 
          'border-zinc-700 bg-zinc-900/40'
      }`} data-testid="autofill-banner">
        <div className="flex items-center gap-2">
          <span className={state === 'failed' || state === 'unsupported' ? "⚠️" : "✨"}></span>
          <strong className="text-zinc-100">{titleMap[state]}</strong>
          
          {state === 'analyzing' && (
            <div className="ml-2 flex items-center gap-2">
              <span className="animate-pulse text-zinc-400">{getProgressText(step)}</span>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  step >= 1 ? 'bg-[#D4AF37]' : 'bg-zinc-600'
                }`}></div>
                <div className={`w-2 h-2 rounded-full ${
                  step >= 2 ? 'bg-[#D4AF37]' : 'bg-zinc-600'
                }`}></div>
                <div className={`w-2 h-2 rounded-full ${
                  step >= 3 ? 'bg-[#D4AF37]' : 'bg-zinc-600'
                }`}></div>
              </div>
            </div>
          )}
          
          <div className="ml-auto flex gap-2">
            {(state === 'ready' || state === 'partial') && (
              <button 
                onClick={onOpen} 
                className="px-3 py-1.5 text-sm rounded-md bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 transition-colors font-medium"
                data-testid="button-review"
              >
                Review
              </button>
            )}
            {state === 'failed' && (
              <button 
                onClick={onRetry} 
                className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
                data-testid="button-retry"
              >
                Retry
              </button>
            )}
            {(state === 'none' || state === 'unsupported') && (
              <button 
                onClick={() => setHelpOpen(true)} 
                className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-200 transition-colors flex items-center gap-1"
                data-testid="button-help"
              >
                <HelpCircle className="h-4 w-4" />
                How to get better results
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-1 text-sm text-zinc-300">{subMap[state]}</div>
        
        {/* Show confidence for suggestions */}
        {suggestion && (state === 'ready' || state === 'partial') && (
          <div className="mt-2 text-sm text-zinc-300" data-testid="suggested-destination">
            Suggested destination: <span className="font-medium text-[#D4AF37]">{suggestion.memberName}</span>
            {suggestion.confidence && (
              <span className="ml-2 px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-400">
                confidence: {suggestion.confidence.toFixed(2)}
              </span>
            )}
          </div>
        )}
        
        {/* Show sample fields for ready/partial states */}
        {(state === 'ready' || state === 'partial') && fields && fields.length > 0 && (
          <div className="mt-3 space-y-1">
            {fields.slice(0, 2).map((f, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm py-1">
                <div className="text-white/70">{f.key}</div>
                <div className="font-mono text-zinc-300">{f.pii ? maskPII(f.value) : f.value}</div>
              </div>
            ))}
            {fields.length > 2 && (
              <div className="text-xs text-zinc-400 mt-1">+ {fields.length - 2} more details</div>
            )}
          </div>
        )}
      </div>
      
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </>
  );
}