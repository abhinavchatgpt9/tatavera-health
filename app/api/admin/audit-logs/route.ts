import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// GET /api/admin/audit-logs — recent platform activity feed
// Auth: required. Roles: ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);

  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return NextResponse.json({ success: true, logs });
}
