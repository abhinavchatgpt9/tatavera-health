import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const SlotSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  slotMins: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

// GET /api/doctor/availability
// Auth: required. Roles: DOCTOR
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['DOCTOR']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { doctorProfileId: true } });
  if (!user?.doctorProfileId) return NextResponse.json({ success: true, availability: [] });

  const availability = await prisma.doctorAvailability.findMany({
    where: { doctorId: user.doctorProfileId },
    orderBy: { dayOfWeek: 'asc' },
  });

  return NextResponse.json({ success: true, availability });
}

// POST /api/doctor/availability — upsert a weekly availability slot
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
    const parsed = SlotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const slot = await prisma.doctorAvailability.create({
      data: { doctorId: user.doctorProfileId, ...parsed.data },
    });

    return NextResponse.json({ success: true, slot }, { status: 201 });
  } catch (error) {
    console.error('Availability create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save availability.' }, { status: 500 });
  }
}
