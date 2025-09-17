// AI and Auto-fill types for intelligent document processing

export type ExtractField = {
  key: string;              // e.g., "Driver's License.Number"
  label: string;            // "Number"
  value: string;            // "C0336 42600 56932"
  confidence?: number;      // 0..1
  pii?: boolean;
};

export type AutoFillSuggestion = {
  uploadId: string;
  itemType: string;         // e.g., "Driver's License"
  fields: ExtractField[];   // flattened with dotted keys
  target?: { memberId: string; memberName: string } | null;
};