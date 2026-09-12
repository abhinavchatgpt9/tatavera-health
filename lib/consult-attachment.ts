import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Same AWS credentials/bucket as the patient-report uploads (lib/report-validation.ts
// + app/api/reports/route.ts) — this is a separate, smaller-capped upload path for
// an optional attachment on the public consultation form, so an anonymous visitor
// can't be tricked into filling the same bucket with huge files.
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || '';

export const ALLOWED_ATTACHMENT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

// Kept well under the report-upload cap (20 MB) — this form has no login and no
// per-user quota, and the Supabase project this app runs on is on the free tier
// (500 MB DB / 1 GB storage / 5 GB egress a month), so a few careless uploads
// should not be able to eat meaningfully into that.
export const MAX_ATTACHMENT_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export function isAllowedAttachmentMimeType(mimeType: string): boolean {
  return ALLOWED_ATTACHMENT_MIME_TYPES.includes(mimeType);
}

export function isAttachmentFileSizeValid(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= MAX_ATTACHMENT_FILE_SIZE;
}

export function buildAttachmentFileKey(originalFileName: string, now: number = Date.now()): string {
  const safeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `consult-attachments/${now}-${safeName}`;
}

/** Uploads the attachment and returns the S3 key to persist on the Enquiry row. */
export async function uploadConsultAttachment(file: File): Promise<{ key: string; name: string; size: number }> {
  const key = buildAttachmentFileKey(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ServerSideEncryption: 'AES256',
    Metadata: { originalName: file.name },
  }));

  return { key, name: file.name, size: file.size };
}

/** Regenerates a fresh 1h signed download URL for an admin viewing the enquiry — never stored. */
export async function getConsultAttachmentUrl(key: string): Promise<string | null> {
  try {
    return await getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 3600 });
  } catch (error) {
    console.error('Failed to sign consult attachment URL:', error);
    return null;
  }
}
