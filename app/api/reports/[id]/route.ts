import { NextRequest, NextResponse } from 'next/server';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
const BUCKET = process.env.AWS_S3_BUCKET || '';

// DELETE /api/reports/[id] — owner only: removes the S3 object and the DB row.
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const report = await prisma.report.findUnique({ where: { id: params.id } });
  if (!report || report.userId !== auth.userId) {
    return NextResponse.json({ success: false, message: 'Report not found.' }, { status: 404 });
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: report.fileKey }));
  } catch (error) {
    console.error('S3 delete error (continuing to remove DB row):', error);
  }

  await prisma.report.delete({ where: { id: report.id } });

  return NextResponse.json({ success: true });
}
