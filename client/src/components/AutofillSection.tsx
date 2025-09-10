import { useAutofill } from "@/hooks/useAutofill";
import AutofillBannerTrust from "@/components/AutofillBanner";
import type { AutoFillSuggestion } from "@/types/ai";
import { useEffect } from "react";

interface AutofillSectionProps {
  familyId: string;
  userId: string;
  onViewDetails?: (uploadId: string) => void;
  onReady?: (analyzeFunction: (file: File, s3Key: string) => Promise<void>) => void;
}

export function AutofillSection({ familyId, userId, onViewDetails, onReady }: AutofillSectionProps) {
  const {
    aiAvailable,
    loading,
    error,
    suggestion,
    analyze,
    acceptAll,
    dismiss,
    regenerate,
    feedback
  } = useAutofill();

  // Handler for viewing details - open inbox drawer
  const handleViewDetails = (suggestion: AutoFillSuggestion) => {
    if (onViewDetails) {
      onViewDetails(suggestion.uploadId);
    }
  };

  // Expose analyze function to parent via onReady callback
  useEffect(() => {
    if (onReady) {
      const analyzeFunction = async (file: File, s3Key: string) => {
        await analyze(file, s3Key, familyId, userId);
      };
      onReady(analyzeFunction);
    }
  }, [onReady, analyze, familyId, userId]);

  // Only render if there's a suggestion, loading, or error
  if (!suggestion && !loading && !error) {
    return null;
  }

  return (
    <div className="mb-6" data-testid="autofill-section">
      <AutofillBannerTrust
        icon="sparkles"
        aiAvailable={aiAvailable}
        loading={loading}
        error={error}
        suggestion={suggestion}
        onAcceptAll={acceptAll}
        onDismissAll={dismiss}
        onRegenerate={regenerate}
        onFeedback={feedback}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}

export default AutofillSection;