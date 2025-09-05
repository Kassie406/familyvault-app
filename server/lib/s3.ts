import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const provider = process.env.S3_PROVIDER || "aws";
const bucket = process.env.S3_BUCKET!;
const publicBase = process.env.S3_PUBLIC_BASE_URL; // e.g., CloudFront or public bucket domain

let client: S3Client;

if (provider === "r2") {
  client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflare.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
  });
} else {
  client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export async function uploadBufferToS3(
  key: string,
  buffer: Buffer,
  contentType: string
) {
  // Do NOT set ACL here; manage public access via bucket policy / CDN.
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      // ContentDisposition: contentType.startsWith("image/") ? "inline" : "attachment"
    })
  );

  if (publicBase) {
    // Public bucket or CDN in front
    return `${publicBase.replace(/\/+$/, "")}/${encodeURI(key)}`;
  }
  // Private bucket: return presigned GET valid for 1 hour
  return await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
}