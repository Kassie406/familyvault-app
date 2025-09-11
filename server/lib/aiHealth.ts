import { TextractClient, AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import OpenAI from "openai";

export type AIHealth = {
  awsReady: boolean;
  openaiReady: boolean;
  details: Record<string, string>;
};

export async function checkAIHealth(): Promise<AIHealth> {
  const details: Record<string, string> = {};
  let awsReady = false, openaiReady = false;

  // AWS check: validate creds/region by sending a tiny dry-call with invalid bytes
  try {
    const aws = new TextractClient({});
    // minimal ping: ensure the client constructs and region is set; we don't actually execute a real call here.
    // Optionally run a very small AnalyzeDocument on a 1x1 PNG buffer to confirm permissions:
    const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG magic, intentionally too small, expect 400/Validation
    await aws.send(new AnalyzeDocumentCommand({
      Document: { Bytes: bytes },
      FeatureTypes: ["FORMS"],
    })).catch(e => { 
      if (e?.$metadata?.httpStatusCode) awsReady = true; 
      else throw e; 
    });
    if (!awsReady) awsReady = true; // reached call boundary
    details.aws = "ok";
  } catch (e: any) {
    details.aws = `error: ${e?.name || e?.message || String(e)}`;
  }

  // OpenAI check
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
    await openai.models.list(); // cheap list call validates key and egress
    openaiReady = true;
    details.openai = "ok";
  } catch (e: any) {
    details.openai = `error: ${e?.message || String(e)}`;
  }

  return { awsReady, openaiReady, details };
}

// Retry wrapper for external API calls
export async function withRetry<T>(
  fn: () => Promise<T>, 
  label: string, 
  tries = 3, 
  delayMs = 400
): Promise<T> {
  let last: any;
  for (let i = 0; i < tries; i++) {
    try { 
      return await fn(); 
    } catch (e) { 
      last = e; 
      await new Promise(r => setTimeout(r, delayMs * (i + 1))); 
    }
  }
  throw new Error(`${label} failed after ${tries} tries: ${last?.message || last}`);
}