import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const OpinionSchema = z.object({
  caseId: z.string().min(1),
  summary: z.string().min(1),
  recommendation: z.string().min(1),
  attachments: z.array(z.string()).optional(),
});

// GET /api/doctor/opinions — medical opinions written by the logged-in doctor
// Auth: required. Roles: DOCTOR
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['DOCTOR']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { doctorProfileId: true } });
  if (!user?.doctorProfileId) return NextResponse.json({ success: true, opinions: [] });

  const opinions = await prisma.medicalOpinion.findMany({
    where: { doctorId: user.doctorProfileId },
    include: { case: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, opinions });
}

// POST /api/doctor/opinions — write a second-opinion / case review
// Auth: required. Roles: DOCTOR
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['DOCTOR']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { doctorProfileId: true } });
  if (!user?.doctorProfileId) {
    return NextResponse.json({ success: false, message: 'No doctor profile linked to this account.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = OpinionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const opinion = await prisma.medicalOpinion.create({
      data: { doctorId: user.doctorProfileId, ...parsed.data },
    });

    return NextResponse.json({ success: true, opinion }, { status: 201 });
  } catch (error) {
    console.error('Opinion create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save opinion.' }, { status: 500 });
  }
}
