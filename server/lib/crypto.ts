import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32; // 256 bits

// Get encryption key from environment
function getEncryptionKey(): Buffer {
  const key = process.env.SECRETS_KEY;
  if (!key) {
    throw new Error("SECRETS_KEY environment variable must be set (64-char hex string)");
  }
  
  if (key.length !== 64) {
    throw new Error("SECRETS_KEY must be exactly 64 characters (32 bytes in hex)");
  }
  
  return Buffer.from(key, "hex");
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt a secret using AES-256-GCM
 */
export function encryptSecret(plaintext: string): EncryptedData {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  
  const cipher = crypto.createCipher(ALGORITHM, key);
  cipher.setAAD(Buffer.from("api-credential")); // Additional authenticated data
  
  let ciphertext = cipher.update(plaintext, "utf8", "hex");
  ciphertext += cipher.final("hex");
  
  const tag = cipher.getAuthTag();
  
  return {
    ciphertext,
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

/**
 * Decrypt a secret using AES-256-GCM
 */
export function decryptSecret(encrypted: EncryptedData): string {
  const key = getEncryptionKey();
  const iv = Buffer.from(encrypted.iv, "hex");
  const tag = Buffer.from(encrypted.tag, "hex");
  
  const decipher = crypto.createDecipher(ALGORITHM, key);
  decipher.setAuthTag(tag);
  decipher.setAAD(Buffer.from("api-credential"));
  
  let plaintext = decipher.update(encrypted.ciphertext, "hex", "utf8");
  plaintext += decipher.final("utf8");
  
  return plaintext;
}

/**
 * Create a masked version of a secret for display
 * Shows only the last 4 characters
 */
export function maskSecret(plaintext: string): string {
  if (plaintext.length <= 4) {
    return "••••";
  }
  const end = plaintext.slice(-4);
  return `••••${end}`;
}

/**
 * Generate a secure 32-byte encryption key in hex format
 * Use this to generate your SECRETS_KEY environment variable
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

/**
 * Validate that a hex string is properly formatted
 */
export function isValidHexKey(key: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(key);
}