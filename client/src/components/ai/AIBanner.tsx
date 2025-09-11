import { Loader2, Sparkles, CheckCircle, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type AiState =
  | { kind: "idle" }
  | { kind: "analyzing"; step: string }
  | { kind: "success"; suggestions: any }
  | { kind: "error"; message: string }
  | { kind: "timeout"; message: string };

interface AIBannerProps {
  aiState: AiState;
  onDismiss: () => void;
  onRegenerate: () => Promise<void> | void;
  onReview?: () => void;
}

export default function AIBanner({ aiState, onDismiss, onRegenerate, onReview }: AIBannerProps) {
  const { toast } = useToast();

  if (aiState.kind === "idle") return null;

  const handleReview = () => {
    onReview?.();
  };

  const handleRegenerate = async () => {
    try {
      await onRegenerate();
    } catch (error) {
      console.error('Regenerate failed:', error);
      toast({
        variant: "destructive",
        description: "Failed to restart analysis. Please try again.",
      });
    }
  };

  const handleLearnMore = () => {
    window.alert("AI Document Analysis works best with:\n• PDF documents\n• Clear, flat photos taken straight-on\n• Good lighting and contrast\n• Text that isn't handwritten or heavily stylized");
  };

  return (
    <div className="mb-4 rounded-lg border bg-card/50 p-4" data-testid="ai-banner">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span className="font-medium text-[#D4AF37]">AI Suggestions</span>
        </div>
        {aiState.kind !== "analyzing" && (
          <button 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity" 
            onClick={onDismiss}
            data-testid="button-dismiss-banner"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Body by state */}
      {aiState.kind === "analyzing" && (
        <div className="mt-3 space-y-2" data-testid="status-analyzing">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>{aiState.step}</span>
          </div>
        </div>
      )}

      {aiState.kind === "success" && (
        <div className="mt-3 space-y-3" data-testid="status-success">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>AI analysis completed successfully!</span>
          </div>
          
          {aiState.suggestions && (
            <div className="rounded-md bg-muted/50 p-3 text-sm" data-testid="suggestion-card">
              <div className="font-medium">Analysis Results:</div>
              <pre className="text-xs mt-2 overflow-auto max-h-32">
                {JSON.stringify(aiState.suggestions, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleReview}
              data-testid="button-review"
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black"
            >
              Review Results
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRegenerate}
              data-testid="button-regenerate"
            >
              <RefreshCw className="mr-1 h-4 w-4" /> Regenerate
            </Button>
          </div>
        </div>
      )}

      {(aiState.kind === "error" || aiState.kind === "timeout") && (
        <div className="mt-3 flex items-start gap-3 text-sm" data-testid="status-error">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400 flex-shrink-0" />
          <div className="space-y-2">
            <div className="font-medium">
              {aiState.kind === "error" && "Analysis failed"}
              {aiState.kind === "timeout" && "Analysis timed out"}
            </div>
            <div className="opacity-80">
              {aiState.kind === "timeout" && (
                <div className="space-y-1">
                  <div>{aiState.message || "The analysis took too long and was stopped to prevent the UI from hanging."}</div>
                  <div className="text-xs opacity-60">
                    {aiState.message?.includes('heartbeat') 
                      ? 'No response from server (likely network/CORS issue)' 
                      : 'Processing exceeded maximum time limit'
                    }
                  </div>
                </div>
              )}
              {aiState.kind === "error" && (
                <div className="space-y-1">
                  <div>{aiState.message || "Something went wrong. Try again."}</div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRegenerate}
                data-testid="button-retry"
              >
                <RefreshCw className="mr-1 h-4 w-4" /> Try Again
              </Button>
              {aiState.kind === "timeout" && (
                <button
                  className="inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const info = `Timeout: ${aiState.message || 'Analysis took too long'}`;
                    window.alert(`Debug Info:\n${info}\n\nThis information can help technical support diagnose the issue.`);
                  }}
                  data-testid="button-view-logs"
                >
                  <Info className="h-3 w-3" />
                  View logs
                </button>
              )}
              <button
                className="inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                onClick={handleLearnMore}
                data-testid="button-learn-more"
              >
                <Info className="h-3 w-3" />
                How to get better results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}