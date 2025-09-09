import * as fuzzball from 'fuzzball';
import type { FamilyMember } from '@shared/schema';

export interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  pii?: boolean;
}

export interface MemberSuggestion {
  memberId: string;
  memberName: string;
  confidence: number;
  fields: ExtractedField[];
}

// Mock OCR analysis - replace with AWS Textract later
export async function runOcr(fileRef: { bucket?: string; key?: string; url?: string }): Promise<ExtractedField[]> {
  // Simulate OCR processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract filename from fileRef to determine document type
  const filename = fileRef.key || fileRef.url || '';
  const lowerFilename = filename.toLowerCase();
  
  // Mock different document types based on filename/extension
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

// Build suggestion based on extracted fields and family members
export async function buildSuggestion(
  fields: ExtractedField[], 
  members: FamilyMember[]
): Promise<MemberSuggestion | null> {
  if (!fields.length || !members.length) return null;
  
  // Extract key information from fields
  const extractedName = (fields.find(f => /person name|full name|name/i.test(f.key))?.value || "").toLowerCase();
  const extractedEmail = (fields.find(f => /email/i.test(f.key))?.value || "").toLowerCase();
  const extractedPhone = (fields.find(f => /phone|telephone/i.test(f.key))?.value || "").replace(/\D/g, "");
  const extractedDob = fields.find(f => /date of birth|dob|birth date/i.test(f.key))?.value || "";
  
  let bestMatch: { member: FamilyMember; score: number } | null = null;
  
  for (const member of members) {
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
      
      // Use fuzzy matching as fallback
      const fuzzyScore = fuzzball.ratio(extractedName, memberNameLower);
      if (fuzzyScore > 70) {
        score += Math.round(fuzzyScore * 0.3); // Add 30% of fuzzy score
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
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { member, score };
    }
  }
  
  // Only return suggestions with confidence >= 60
  if (!bestMatch || bestMatch.score < 60) return null;
  
  return {
    memberId: bestMatch.member.id,
    memberName: bestMatch.member.name,
    confidence: Math.min(100, bestMatch.score),
    fields
  };
}

// Helper function to format dates for comparison
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

// AWS Textract implementation (for future use)
export async function runTextractOcr(bucket: string, key: string): Promise<ExtractedField[]> {
  // This will be implemented when AWS integration is ready
  // const { TextractClient, AnalyzeIDCommand } = await import('@aws-sdk/client-textract');
  
  // const client = new TextractClient({ region: process.env.AWS_REGION });
  // const command = new AnalyzeIDCommand({
  //   Document: { S3Object: { Bucket: bucket, Name: key } }
  // });
  
  // const response = await client.send(command);
  // return parseTextractResponse(response);
  
  // For now, fall back to mock
  return runOcr({ bucket, key });
}