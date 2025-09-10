// Unified AI suggestion types for complete field extraction
export type ExtractField = {
  key: string;             // e.g., 'number', 'expirationDate'
  label: string;           // UI label
  value: string;           // normalized value (ISO for dates)
  confidence: number;      // 0..100
  path: string;            // exact destination, e.g., 'ids.driverLicense.state'
  bbox?: [number, number, number, number]; // optional for highlight
};

export type AISuggestions = {
  docType: 'driverLicense' | 'passport' | 'insurance' | 'utilityBill' | 'idCard' | 'other';
  memberId?: string;        // best-guess family member
  fields: ExtractField[];
  reasoning?: string;       // short "how we got this"
  confidence: 'low'|'medium'|'high';
};

// Normalized address structure
export type NormalizedAddress = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;   // "NJ"
  postal?: string;  // "07036"
  country?: string; // "US"
};

// Legacy types for backward compatibility
export type ExtractedField = ExtractField;
export type Suggestion = {
  memberId: string;
  memberName: string;
  confidence: number;
  fields: ExtractedField[];
};

export type InboxItem = {
  id: string;
  fileUrl: string;
  filename: string;
  status: "analyzing" | "suggested" | "accepted" | "dismissed" | "none" | "unsupported" | "failed";
  suggestion?: Suggestion;
  uploadedAt: Date;
  fileSize?: number;
  mimeType?: string;
};

export type InboxAnalysisResult = {
  success: boolean;
  suggestion?: Suggestion;
  error?: string;
};