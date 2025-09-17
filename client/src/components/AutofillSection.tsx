import useAutofill from "@/hooks/useAutofill";
import AutofillBanner from "@/components/AutofillBanner";
import { useEffect } from "react";

interface AutofillSectionProps {
  familyId: string;
  userId: string;
  onViewDetails?: (uploadId: string) => void;
  onReady?: (analyzeFunction: (file: File, s3Key: string) => Promise<void>) => void;
}

export function AutofillSection({ familyId, userId, onViewDetails, onReady }: AutofillSectionProps) {
  const { banner, registerAndAnalyze, accept, dismiss } = useAutofill();

  // Handler for viewing details - open inbox drawer
  const handleViewDetails = () => {
    if (onViewDetails && banner.uploadId) {
      onViewDetails(banner.uploadId);
    }
  };

  // Expose analyze function to parent via onReady callback
  useEffect(() => {
    if (onReady) {
      const analyzeFunction = async (file: File, s3Key: string) => {
        await registerAndAnalyze({
          userId,
          fileKey: s3Key,
          fileName: file.name,
          mime: file.type,
          size: file.size
        });
      };
      onReady(analyzeFunction);
    }
  }, [onReady, registerAndAnalyze, userId]);

  // Only render if banner is open
  if (!banner.open) {
    return null;
  }

  return (
    <div className="mb-6" data-testid="autofill-section">
      <AutofillBanner
        open={banner.open}
        fileName={banner.fileName}
        fields={banner.fields}
        suggestion={banner.suggestion}
        onAccept={accept}
        onDismiss={dismiss}
      />
    </div>
  );
}

export default AutofillSection;