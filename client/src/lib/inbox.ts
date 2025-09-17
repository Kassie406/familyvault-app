import type { InboxItem, Suggestion, ExtractedField } from '@shared/types/inbox';

export const maskPII = (key: string, value: string): string => {
  const s = String(value);
  
  // Social Security Numbers
  if (/(ssn|social)/i.test(key)) {
    return s.replace(/\d(?=\d{4})/g, "•");
  }
  
  // Driver's License, Passport, or other ID numbers
  if (/number/i.test(key) && s.replace(/\D/g, "").length >= 9) {
    return s.replace(/\d(?=\d{4})/g, "•");
  }
  
  return s;
};

export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return "text-green-400";
  if (confidence >= 70) return "text-yellow-400";
  return "text-gray-400";
};

export const getConfidenceDot = (confidence: number): string => {
  if (confidence >= 90) return "bg-green-400";
  if (confidence >= 70) return "bg-yellow-400";
  return "bg-gray-400";
};

// Mock OCR analysis - replace with real API later
export async function analyzeUpload(item: InboxItem): Promise<Suggestion | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const filename = item.filename.toLowerCase();
  
  // Mock detection based on filename patterns
  if (filename.includes('angel') || filename.includes('quintana')) {
    return {
      memberId: 'member-angel',
      memberName: 'Angel Quintana',
      confidence: 92,
      fields: [
        { key: "Person Name", label: "Person Name", value: "ANGEL D QUINTANA", confidence: 94, path: "ids.idCard.fullName" },
        { key: "Social Security Number", label: "SSN", value: "141-85-2645", confidence: 91, pii: true, path: "ids.idCard.ssn" },
        { key: "Date of Birth", label: "Date of Birth", value: "June 16, 1983", confidence: 89, path: "ids.idCard.dateOfBirth" },
      ],
    };
  }
  
  if (filename.includes('driver') || filename.includes('license')) {
    return {
      memberId: 'member-john',
      memberName: 'John Smith',
      confidence: 87,
      fields: [
        { key: "Person Name", label: "Person Name", value: "JOHN SMITH", confidence: 91, path: "ids.driverLicense.fullName" },
        { key: "License Number", label: "License Number", value: "D123456789", confidence: 93, pii: true, path: "ids.driverLicense.number" },
        { key: "Date of Birth", label: "Date of Birth", value: "March 15, 1980", confidence: 88, path: "ids.driverLicense.dateOfBirth" },
        { key: "State Issued", label: "State", value: "CA", confidence: 95, path: "ids.driverLicense.state" },
        { key: "Expiration Date", label: "Expiration Date", value: "03/15/2028", confidence: 90, path: "ids.driverLicense.expirationDate" },
      ],
    };
  }
  
  if (filename.includes('passport')) {
    return {
      memberId: 'member-sarah',
      memberName: 'Sarah Johnson',
      confidence: 85,
      fields: [
        { key: "Person Name", label: "Person Name", value: "SARAH ELIZABETH JOHNSON", confidence: 92, path: "ids.passport.fullName" },
        { key: "Passport Number", label: "Passport Number", value: "987654321", confidence: 89, pii: true, path: "ids.passport.number" },
        { key: "Date of Birth", label: "Date of Birth", value: "November 1, 1980", confidence: 91, path: "ids.passport.dateOfBirth" },
        { key: "Country Issued", label: "Country", value: "United States of America", confidence: 98, path: "ids.passport.country" },
      ],
    };
  }
  
  // Return undefined if no pattern matches (no suggestion)
  return undefined;
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};