import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const CreateAppointmentSchema = z.object({
  doctorId: z.string().optional(),
  type: z.enum(['VIDEO', 'IN_PERSON']),
  scheduledAt: z.string().datetime(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    where: { userId: auth.userId },
    include: { doctor: { select: { name: true, specialty: true, photoUrl: true } } },
    orderBy: { scheduledAt: 'asc' },
  });

  return NextResponse.json({ success: true, appointments });
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = CreateAppointmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const patientCase = await prisma.patientCase.findUnique({ where: { userId: auth.userId } });

    const appointment = await prisma.appointment.create({
      data: {
        userId: auth.userId,
        doctorId: parsed.data.doctorId,
        caseId: patientCase?.id,
        type: parsed.data.type,
        scheduledAt: new Date(parsed.data.scheduledAt),
        notes: parsed.data.notes,
      },
    });

    return NextResponse.json({ success: true, appointment }, { status: 201 });
  } catch (error) {
    console.error('Appointment error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create appointment.' }, { status: 500 });
  }
}
