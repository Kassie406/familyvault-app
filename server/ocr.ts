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
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted data that would come from document analysis
  const mockFields: ExtractedField[] = [
    { key: "Person Name", value: "ANGEL D QUINTANA", confidence: 94 },
    { key: "Social Security Number", value: "141-85-2645", confidence: 91, pii: true },
    { key: "Date of Birth", value: "03/15/1985", confidence: 89 },
    { key: "Address", value: "1234 MAIN ST, ANYTOWN, CA 90210", confidence: 87 },
    { key: "Driver License Number", value: "D1234567", confidence: 92, pii: true },
    { key: "Phone Number", value: "(555) 123-4567", confidence: 85, pii: true }
  ];
  
  return mockFields;
}

// Build suggestion based on extracted fields and family members
export async function buildSuggestion(
  fields: ExtractedField[], 
  members: FamilyMember[]
): Promise<MemberSuggestion | null> {
  if (!fields.length || !members.length) return null;
  
  // Extract person names from fields
  const nameFields = fields.filter(f => 
    f.key.toLowerCase().includes('name') || 
    f.key.toLowerCase().includes('person')
  );
  
  if (!nameFields.length) return null;
  
  // Find best matching family member using fuzzy string matching
  let bestMatch: { member: FamilyMember; score: number } | null = null;
  
  for (const nameField of nameFields) {
    const extractedName = nameField.value.toLowerCase();
    
    for (const member of members) {
      const memberName = member.name.toLowerCase();
      
      // Use fuzzball for fuzzy string matching
      const score = fuzzball.ratio(extractedName, memberName);
      
      if (score > 60 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = { member, score };
      }
    }
  }
  
  if (!bestMatch) return null;
  
  // Calculate confidence based on fuzzy match score and field confidence
  const avgFieldConfidence = nameFields.reduce((sum, f) => sum + f.confidence, 0) / nameFields.length;
  const confidence = Math.round((bestMatch.score + avgFieldConfidence) / 2);
  
  return {
    memberId: bestMatch.member.id,
    memberName: bestMatch.member.name,
    confidence,
    fields
  };
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