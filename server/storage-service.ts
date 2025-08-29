import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

// Initialize S3 client (works with Cloudflare R2 and AWS S3)
const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for some S3-compatible services
});

const BUCKET_NAME = process.env.S3_BUCKET || 'familycircle-secure-files';
const URL_EXPIRY_SECONDS = 5 * 60; // 5 minutes

export class SecureStorageService {
  /**
   * Generate a secure, signed upload URL for file uploads
   * @param fileKey - Unique file identifier
   * @param contentType - MIME type of the file
   * @param orgId - Organization ID for tenant isolation
   * @param userId - User ID for audit purposes
   * @returns Signed upload URL with 5-minute expiry
   */
  static async createUploadUrl(
    fileKey: string,
    contentType: string,
    orgId: string,
    userId: string
  ): Promise<string> {
    // Prefix with org ID for tenant isolation
    const secureKey = `${orgId}/${fileKey}`;
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: secureKey,
      ContentType: contentType,
      Metadata: {
        orgId,
        userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    return await getSignedUrl(s3Client, command, { 
      expiresIn: URL_EXPIRY_SECONDS 
    });
  }

  /**
   * Generate a secure, signed download URL for file access
   * @param fileKey - File identifier
   * @param orgId - Organization ID for tenant isolation
   * @returns Signed download URL with 5-minute expiry
   */
  static async createDownloadUrl(
    fileKey: string,
    orgId: string
  ): Promise<string> {
    // Prefix with org ID for tenant isolation
    const secureKey = `${orgId}/${fileKey}`;
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: secureKey,
    });

    return await getSignedUrl(s3Client, command, { 
      expiresIn: URL_EXPIRY_SECONDS 
    });
  }

  /**
   * Generate a secure file key with cryptographic randomness
   * @param originalName - Original filename
   * @param userId - User ID for context
   * @returns Secure file key
   */
  static generateSecureFileKey(originalName: string, userId: string): string {
    const extension = originalName.split('.').pop() || '';
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const userHash = crypto.createHash('sha256').update(userId).digest('hex').substring(0, 8);
    
    return `${timestamp}-${userHash}-${randomBytes}${extension ? '.' + extension : ''}`;
  }

  /**
   * Validate that a file key belongs to the requesting organization
   * @param fileKey - File key to validate
   * @param orgId - Organization ID
   * @returns Whether the file belongs to the organization
   */
  static validateFileAccess(fileKey: string, orgId: string): boolean {
    // File keys are prefixed with org ID, so we can validate ownership
    return fileKey.startsWith(`${orgId}/`) || fileKey.includes(`${orgId}/`);
  }
}

export default SecureStorageService;