export type Field = { 
  key: string; 
  value: string; 
  confidence: number; 
  pii?: boolean 
};

export type FamilyMemberForMatching = {
  id: string;
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
};

export type SuggestionResult = {
  memberId: string;
  memberName: string;
  confidence: number;
} | null;

/**
 * Mock OCR service - extracts fields from uploaded files
 * Later can be replaced with AWS Textract or other OCR service
 */
export async function runOcrMock(fileKey: string, filename: string): Promise<Field[]> {
  // Mock different document types based on filename/extension
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('ssn') || lowerFilename.includes('social')) {
    return [
      { key: "Person Name", value: "ANGEL D QUINTANA", confidence: 94 },
      { key: "Social Security Number", value: "141-85-2645", confidence: 91, pii: true },
      { key: "Date of Birth", value: "03/15/1985", confidence: 89 },
    ];
  }
  
  if (lowerFilename.includes('license') || lowerFilename.includes('driver')) {
    return [
      { key: "Person Name", value: "SARAH MICHELLE DAVIS", confidence: 96 },
      { key: "License Number", value: "D123456789", confidence: 93 },
      { key: "Address", value: "123 Main St, Anytown, ST 12345", confidence: 87 },
      { key: "Date of Birth", value: "07/22/1990", confidence: 92 },
    ];
  }
  
  if (lowerFilename.includes('birth') || lowerFilename.includes('certificate')) {
    return [
      { key: "Person Name", value: "MICHAEL ROBERT JOHNSON", confidence: 98 },
      { key: "Date of Birth", value: "12/08/1988", confidence: 97 },
      { key: "Place of Birth", value: "San Francisco, CA", confidence: 85 },
      { key: "Parents Names", value: "Robert Johnson, Mary Johnson", confidence: 90 },
    ];
  }
  
  if (lowerFilename.includes('passport')) {
    return [
      { key: "Person Name", value: "EMILY ROSE THOMPSON", confidence: 97 },
      { key: "Passport Number", value: "123456789", confidence: 95, pii: true },
      { key: "Date of Birth", value: "05/14/1992", confidence: 94 },
      { key: "Nationality", value: "United States of America", confidence: 99 },
    ];
  }
  
  // Default generic document extraction
  return [
    { key: "Person Name", value: "JOHN DOE", confidence: 85 },
    { key: "Document Type", value: "General Document", confidence: 75 },
    { key: "Date", value: "01/01/2024", confidence: 80 },
  ];
}

/**
 * Generate family member suggestion based on extracted fields
 */
export function makeSuggestion(
  familyMembers: FamilyMemberForMatching[], 
  fields: Field[]
): SuggestionResult {
  const extractedName = (fields.find(f => /person name|full name|name/i.test(f.key))?.value || "").toLowerCase();
  const extractedEmail = (fields.find(f => /email/i.test(f.key))?.value || "").toLowerCase();
  const extractedPhone = (fields.find(f => /phone|telephone/i.test(f.key))?.value || "").replace(/\D/g, "");
  const extractedDob = fields.find(f => /date of birth|dob|birth date/i.test(f.key))?.value || "";
  
  let bestMatch: SuggestionResult = null;
  
  for (const member of familyMembers) {
    let score = 0;
    
    // Name matching (most important factor)
    if (extractedName && member.name) {
      const memberNameLower = member.name.toLowerCase();
      const nameTokens = memberNameLower.split(/\s+/);
      const extractedTokens = extractedName.split(/\s+/);
      
      // Count matching name tokens
      const matchingTokens = nameTokens.filter(token => 
        extractedTokens.some(extracted => 
          extracted.includes(token) || token.includes(extracted)
        )
      ).length;
      
      if (matchingTokens > 0) {
        score += matchingTokens * 25; // 25 points per matching name token
      }
      
      // Bonus for exact full name match
      if (memberNameLower === extractedName) {
        score += 30;
      }
    }
    
    // Email matching
    if (extractedEmail && member.email && extractedEmail === member.email.toLowerCase()) {
      score += 40;
    }
    
    // Phone matching (normalize both numbers)
    if (extractedPhone && member.phoneNumber) {
      const memberPhone = member.phoneNumber.replace(/\D/g, "");
      if (memberPhone && extractedPhone.includes(memberPhone.slice(-10))) {
        score += 35;
      }
    }
    
    // Date of birth matching
    if (extractedDob && member.dateOfBirth) {
      const memberDob = member.dateOfBirth.toISOString().split('T')[0];
      const extractedDobFormatted = formatDateForComparison(extractedDob);
      if (extractedDobFormatted && memberDob === extractedDobFormatted) {
        score += 30;
      }
    }
    
    // Update best match if this score is higher
    if (score > 0 && (!bestMatch || score > bestMatch.confidence)) {
      bestMatch = {
        memberId: member.id,
        memberName: member.name,
        confidence: Math.min(100, score)
      };
    }
  }
  
  // Only return suggestions with confidence >= 60
  return bestMatch && bestMatch.confidence >= 60 ? bestMatch : null;
}

/**
 * Helper function to format dates for comparison
 */
function formatDateForComparison(dateStr: string): string | null {
  try {
    // Handle various date formats: MM/DD/YYYY, MM-DD-YYYY, YYYY-MM-DD, etc.
    const cleanDate = dateStr.replace(/[^\d\/\-]/g, '');
    const parts = cleanDate.split(/[\/\-]/);
    
    if (parts.length === 3) {
      let month, day, year;
      
      // Determine format based on which part is 4 digits (year)
      if (parts[0].length === 4) {
        // YYYY-MM-DD or YYYY/MM/DD
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      } else {
        // MM/DD/YYYY or MM-DD-YYYY
        month = parts[0].padStart(2, '0');
        day = parts[1].padStart(2, '0');
        year = parts[2];
      }
      
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.warn('Failed to parse date:', dateStr, error);
  }
  
  return null;
}