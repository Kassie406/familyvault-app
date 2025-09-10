import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { AutoFillSuggestion } from "@/types/ai";

export interface UseAutofillReturn {
  // State
  aiAvailable: boolean;
  loading: boolean;
  error: string | null;
  suggestion: AutoFillSuggestion | null;
  
  // Actions
  analyze: (file: File, s3Key: string, familyId: string, userId: string) => Promise<void>;
  acceptAll: (suggestion: AutoFillSuggestion) => Promise<void>;
  dismiss: () => void;
  regenerate: (suggestion: AutoFillSuggestion) => Promise<AutoFillSuggestion | null>;
  feedback: (suggestion: AutoFillSuggestion, type: "positive" | "negative" | "info") => void;
}

export function useAutofill(): UseAutofillReturn {
  const [aiAvailable, setAiAvailable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<AutoFillSuggestion | null>(null);
  const { toast } = useToast();

  // Check AI availability on mount
  useEffect(() => {
    checkAiAvailability();
  }, []);

  async function checkAiAvailability() {
    try {
      const response = await fetch("/api/ai-status");
      if (response.ok) {
        const data = await response.json();
        setAiAvailable(data.available);
      } else {
        setAiAvailable(false);
      }
    } catch (error) {
      console.warn("AI availability check failed:", error);
      setAiAvailable(false);
    }
  }

  // Enhanced AI Analysis
  async function analyze(file: File, s3Key: string, familyId: string, userId: string): Promise<void> {
    try {
      setError(null);
      setLoading(true);
      
      // 1) Register with AI Inbox
      const regRes = await fetch("/api/inbox/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          fileName: file.name, 
          fileKey: s3Key,
          familyId: familyId,
          userId: userId
        }),
      });
      
      if (!regRes.ok) {
        throw new Error("Failed to register file for analysis");
      }
      
      const { uploadId } = await regRes.json();
      
      // 2) Analyze document
      const analyzeRes = await fetch(`/api/inbox/${uploadId}/analyze`, {
        method: "POST",
      });
      
      if (!analyzeRes.ok) {
        setSuggestion(null);
        setError("Unable to analyze upload. Please try Regenerate.");
        return;
      }
      
      const analysisData = await analyzeRes.json();
      
      // 3) Build AutoFill suggestion if we have fields
      if (Array.isArray(analysisData?.fields) && analysisData.fields.length > 0) {
        const newSuggestion: AutoFillSuggestion = {
          uploadId: uploadId,
          itemType: analysisData.itemType ?? inferDocumentType(analysisData.fields),
          fields: analysisData.fields, // Use original fields array instead of flattened
          target: analysisData.suggestion ? {
            memberId: analysisData.suggestion.memberId,
            memberName: analysisData.suggestion.memberName
          } : null,
        };
        
        setSuggestion(newSuggestion);
        setError(null);
      } else {
        setSuggestion(null);
        setError("No confident details were found.");
      }
      
    } catch (error) {
      console.error("AI Analysis failed:", error);
      setSuggestion(null);
      setError("Unable to analyze upload. Please try Regenerate.");
    } finally {
      setLoading(false);
    }
  }

  // Handle accept all autofill
  async function acceptAll(suggestion: AutoFillSuggestion): Promise<void> {
    try {
      const acceptRes = await fetch(`/api/inbox/${suggestion.uploadId}/accept-autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType: suggestion.itemType,
          fields: suggestion.fields,
          target: suggestion.target,
        }),
      });

      if (!acceptRes.ok) {
        throw new Error("Failed to save autofill data");
      }

      const { createdId, createdType } = await acceptRes.json();

      toast({
        title: "Autofill accepted",
        description: `${suggestion.itemType} saved successfully with ${Object.keys(suggestion.fields).length} fields`,
      });

      // Clear the suggestion after successful accept
      setSuggestion(null);
      setError(null);
    } catch (error) {
      console.error("Accept autofill failed:", error);
      toast({
        title: "Failed to save autofill",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    }
  }

  // Handle dismiss all
  function dismiss(): void {
    setSuggestion(null);
    setError(null);
    toast({
      title: "Suggestions dismissed",
      description: "Document suggestions have been dismissed",
    });
  }

  // Handle regenerate autofill
  async function regenerate(suggestion: AutoFillSuggestion): Promise<AutoFillSuggestion | null> {
    try {
      setError(null);
      
      const analyzeRes = await fetch(`/api/inbox/${suggestion.uploadId}/analyze`, {
        method: "POST",
      });
      
      if (!analyzeRes.ok) {
        setError("Regeneration failed. Please try again.");
        return null;
      }
      
      const analysisData = await analyzeRes.json();
      
      if (Array.isArray(analysisData?.fields) && analysisData.fields.length > 0) {
        const newSuggestion: AutoFillSuggestion = {
          uploadId: suggestion.uploadId,
          itemType: analysisData.itemType ?? inferDocumentType(analysisData.fields),
          fields: analysisData.fields, // Use original fields array instead of flattened
          target: analysisData.suggestion ? {
            memberId: analysisData.suggestion.memberId,
            memberName: analysisData.suggestion.memberName
          } : null,
        };
        
        setSuggestion(newSuggestion);
        setError(null);
        return newSuggestion;
      } else {
        setSuggestion(null);
        setError("No details found on regeneration.");
        return null;
      }
      
    } catch (error) {
      console.error("Regeneration failed:", error);
      setError("Regeneration failed. Please try again.");
      return null;
    }
  }

  // Handle feedback collection
  function feedback(suggestion: AutoFillSuggestion, type: "positive" | "negative" | "info"): void {
    // Log feedback for analytics
    console.log("User feedback:", { uploadId: suggestion.uploadId, type, itemType: suggestion.itemType });
    
    if (type === "info") {
      toast({
        title: "About AI Suggestions",
        description: "We extract fields from your document using on-device and server models for intelligent suggestions.",
      });
    } else {
      toast({
        title: "Feedback received",
        description: `Thank you for ${type === "positive" ? "positive" : "helpful"} feedback!`,
      });
    }
    
    // TODO: Send feedback to analytics endpoint
    // fetch("/api/feedback", { method: "POST", body: JSON.stringify({ uploadId: suggestion.uploadId, type }) });
  }

  return {
    aiAvailable,
    loading,
    error,
    suggestion,
    analyze,
    acceptAll,
    dismiss,
    regenerate,
    feedback,
  };
}

// Utility functions for processing AI analysis results
function inferDocumentType(fields: any[]): string {
  if (!fields || fields.length === 0) return "Document";
  
  const fieldKeys = fields.map(f => f.field || f.label || "").join(" ").toLowerCase();
  
  if (fieldKeys.includes("license") || fieldKeys.includes("driver")) return "Driver's License";
  if (fieldKeys.includes("passport")) return "Passport";
  if (fieldKeys.includes("card") && fieldKeys.includes("social")) return "Social Security Card";
  if (fieldKeys.includes("birth") || fieldKeys.includes("certificate")) return "Birth Certificate";
  if (fieldKeys.includes("insurance")) return "Insurance Document";
  if (fieldKeys.includes("medical")) return "Medical Record";
  if (fieldKeys.includes("tax") || fieldKeys.includes("w2") || fieldKeys.includes("1099")) return "Tax Document";
  
  return "Document";
}

function flattenFields(fields: any[]): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  fields.forEach((field) => {
    if (field.field && field.value) {
      flattened[field.field] = field.value;
    } else if (field.label && field.data) {
      flattened[field.label] = field.data;
    }
  });
  
  return flattened;
}