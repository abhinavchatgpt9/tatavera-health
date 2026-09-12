import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET = process.env.AWS_S3_BUCKET || '';
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const reports = await prisma.report.findMany({
    where: { userId: auth.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, reports });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'OTHER';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, message: 'File too large. Max 20 MB.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid file type. PDF, JPG, PNG only.' }, { status: 400 });
    }

    const fileKey = `reports/${auth.userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
      ServerSideEncryption: 'AES256',
      Metadata: { userId: auth.userId, originalName: file.name },
    }));

    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: fileKey }),
      { expiresIn: 3600 }
    );

    const CATEGORY_MAP: Record<string, 'BLOOD_REPORTS' | 'IMAGING' | 'PRESCRIPTIONS' | 'OTHER'> = {
      'Blood Reports': 'BLOOD_REPORTS',
      'Imaging': 'IMAGING',
      'Prescriptions': 'PRESCRIPTIONS',
      'Other': 'OTHER',
    };

    const report = await prisma.report.create({
      data: {
        userId: auth.userId,
        fileName: file.name,
        fileKey,
        fileUrl: signedUrl,
        fileSize: file.size,
        mimeType: file.type,
        category: CATEGORY_MAP[category] || 'OTHER',
      },
    });

    return NextResponse.json({ success: true, report }, { status: 201 });
  } catch (error) {
    console.error('Report upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
