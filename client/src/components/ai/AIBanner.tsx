import { useAI } from "@/state/ai";
import { Loader2, Sparkles, CheckCircle, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function AIBanner() {
  const { scan, reset } = useAI();
  const { toast } = useToast();

  if (scan.state === "idle") return null;

  const handleReview = () => {
    // Dispatch custom event to open inbox details
    window.dispatchEvent(new CustomEvent("open-inbox-details", { 
      detail: { id: (scan as any).id } 
    }));
  };

  const handleRegenerate = async () => {
    try {
      await fetch(`/api/inbox/${(scan as any).id}/analyze`, { method: "POST" });
      toast({
        description: "Regenerating analysis...",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to regenerate analysis",
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
        {scan.state !== "analyzing" && (
          <button 
            className="text-sm opacity-70 hover:opacity-100 transition-opacity" 
            onClick={reset}
            data-testid="button-dismiss-banner"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Body by state */}
      {scan.state === "analyzing" && (
        <div className="mt-3 space-y-2" data-testid="status-analyzing">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            <span>{scan.step}</span>
          </div>
          {scan.progress !== undefined && (
            <div className="w-full bg-muted/30 rounded-full h-1.5">
              <div 
                className="bg-[#D4AF37] h-1.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, scan.progress))}%` }}
              />
            </div>
          )}
        </div>
      )}

      {(scan.state === "ready" || scan.state === "partial") && (
        <div className="mt-3 space-y-3" data-testid="status-ready-partial">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <span>
              {scan.state === "ready"
                ? `We've suggested a destination. Review and accept.`
                : "No confident match. Pick where this belongs and accept."}
            </span>
          </div>
          
          {scan.suggestion && (
            <div className="rounded-md bg-muted/50 p-3 text-sm" data-testid="suggestion-card">
              <div className="font-medium">Suggested destination:</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold">{scan.suggestion.memberName}</span>
                <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-full">
                  {Math.round(scan.suggestion.confidence * 100)}% match
                </span>
              </div>
            </div>
          )}
          
          {scan.fields && scan.fields.length > 0 && (
            <div className="text-sm opacity-80">
              Found {scan.count} detail{scan.count === 1 ? "" : "s"} to review
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleReview}
              data-testid="button-review"
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/80 text-black"
            >
              Review
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

      {(scan.state === "none" || scan.state === "failed" || scan.state === "unsupported" || scan.state === "timeout") && (
        <div className="mt-3 flex items-start gap-3 text-sm" data-testid="status-error">
          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-400 flex-shrink-0" />
          <div className="space-y-2">
            <div className="font-medium">
              {scan.state === "none" && "No details detected"}
              {scan.state === "failed" && "Analysis failed"}
              {scan.state === "unsupported" && "File type not supported"}
              {scan.state === "timeout" && "Analysis timed out"}
            </div>
            <div className="opacity-80">
              {scan.state === "none" && "This file doesn't contain enough readable text. Use PDFs or clear, flat photos."}
              {scan.state === "timeout" && (
                <div className="space-y-1">
                  <div>{scan.message || "The analysis took too long and was stopped to prevent the UI from hanging."}</div>
                  <div className="text-xs opacity-60">
                    {scan.message?.includes('heartbeat') 
                      ? 'No response from server (likely network/CORS issue)' 
                      : 'Processing exceeded maximum time limit'
                    }
                  </div>
                </div>
              )}
              {scan.state === "failed" && (
                <div className="space-y-1">
                  <div>{scan.error || scan.message || "Something went wrong. Try again."}</div>
                  {scan.stage && (
                    <div className="text-xs opacity-60">Failed at: {scan.stage}</div>
                  )}
                  {scan.code && (
                    <div className="text-xs opacity-60">Error code: {scan.code}</div>
                  )}
                </div>
              )}
              {scan.state === "unsupported" && "Please upload PDF, PNG, or JPEG."}
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
              {(scan.state === "timeout" || scan.state === "failed") && (
                <button
                  className="inline-flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                  onClick={() => {
                    // Show debugging information
                    const info = scan.state === 'timeout' 
                      ? `Timeout after 2 minutes. Stage: ${scan.stage || 'unknown'}. Message: ${scan.message || 'none'}`
                      : `Failed with code ${scan.code || 'unknown'}. Stage: ${scan.stage || 'unknown'}. Error: ${scan.error || scan.message || 'none'}`;
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