// Family Member Matching Service for AI Document Analysis
import { db } from "../db";
import { familyMembers } from "@shared/schema";
import { eq } from "drizzle-orm";

export type FamilyMember = {
  id: string;
  name: string;
  role: string;
  // Add additional fields as needed for matching
};

export type ExtractedData = {
  name?: string;
  dob?: string;       // "1983-06-16" or "Jun 16, 1983"
  ssn?: string;       // "141-85-2645" or just "2645"
};

export type Suggestion = {
  memberId: string;
  memberName: string;
  confidence: number;
};

// Get family members for matching
export async function getFamilyMembersForUser(familyId: string): Promise<FamilyMember[]> {
  console.log("🔍 Fetching family members for familyId:", familyId);
  
  const members = await db.select({
    id: familyMembers.id,
    name: familyMembers.name,
    role: familyMembers.role,
  }).from(familyMembers).where(eq(familyMembers.familyId, familyId));

  console.log("👥 Found family members:", members.map(m => ({ id: m.id, name: m.name, role: m.role })));
  return members;
}

// Smart matching algorithm
export function suggestMember(fields: ExtractedData, members: FamilyMember[]): Suggestion | null {
  console.log("🎯 Starting member suggestion with fields:", fields);
  console.log("🎯 Available members:", members.map(m => m.name));

  const name = (fields.name ?? "").toLowerCase().trim();
  const last4 = (fields.ssn ?? "").replace(/\D/g, "").slice(-4);
  const dob = normalizeDate(fields.dob);

  let bestMatch: Suggestion | null = null;

  for (const member of members) {
    let score = 0;
    const memberName = member.name.toLowerCase();
    
    console.log(`🔍 Scoring member: ${member.name}`);

    // Name matching (weighted heavily)
    if (name && nameMatches(name, memberName)) {
      score += 0.6;
      console.log(`  ✅ Name match: +0.6 (${name} ↔ ${memberName})`);
    } else if (name && partialNameMatch(name, memberName)) {
      score += 0.3;
      console.log(`  ⚡ Partial name match: +0.3 (${name} ↔ ${memberName})`);
    }

    // SSN Last 4 matching (very strong indicator)
    if (last4 && last4.length === 4) {
      // For demo purposes, use member-specific mock SSN last 4
      const memberLast4 = getMockSsnLast4(member.name);
      if (memberLast4 && last4 === memberLast4) {
        score += 0.35;
        console.log(`  ✅ SSN last-4 match: +0.35 (${last4})`);
      }
    }

    // Date of Birth matching
    if (dob) {
      const memberDob = getMockDob(member.name);
      if (memberDob && dob === memberDob) {
        score += 0.25;
        console.log(`  ✅ DOB match: +0.25 (${dob})`);
      }
    }

    console.log(`  📊 Total score for ${member.name}: ${score}`);

    if (!bestMatch || score > bestMatch.confidence) {
      bestMatch = { 
        memberId: member.id, 
        memberName: member.name, 
        confidence: Math.round(score * 100) / 100 
      };
    }
  }

  // Only return suggestions with reasonable confidence
  const threshold = 0.5;
  if (bestMatch && bestMatch.confidence >= threshold) {
    console.log(`🎉 Best match: ${bestMatch.memberName} (confidence: ${bestMatch.confidence})`);
    return bestMatch;
  }

  console.log(`❌ No confident match found (best was ${bestMatch?.confidence || 0}, threshold: ${threshold})`);
  return null;
}

// Helper functions
function nameMatches(extracted: string, memberName: string): boolean {
  // Direct substring match or exact match
  return memberName.includes(extracted) || extracted.includes(memberName) || 
         levenshteinDistance(extracted, memberName) <= 2;
}

function partialNameMatch(extracted: string, memberName: string): boolean {
  // Split names and check for partial matches
  const extractedParts = extracted.split(/\s+/);
  const memberParts = memberName.split(/\s+/);
  
  return extractedParts.some(ep => 
    memberParts.some(mp => 
      ep.length > 2 && mp.length > 2 && (ep.includes(mp) || mp.includes(ep))
    )
  );
}

function normalizeDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Mock data for demo purposes - replace with real data lookup
function getMockSsnLast4(memberName: string): string | null {
  const mockData: Record<string, string> = {
    "Angel Quintana": "2645",
    "Kassandra Santana": "4829", 
    "Emma Johnson": "7890",
    "Linda Johnson": "1234"
  };
  return mockData[memberName] || null;
}

function getMockDob(memberName: string): string | null {
  const mockData: Record<string, string> = {
    "Angel Quintana": "1983-06-16",
    "Kassandra Santana": "1985-03-22",
    "Emma Johnson": "2010-08-15", 
    "Linda Johnson": "1952-11-03"
  };
  return mockData[memberName] || null;
}

// Simple Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}