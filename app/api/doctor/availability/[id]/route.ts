import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// DELETE /api/doctor/availability/{id} — remove one weekly availability slot
// Auth: required. Roles: DOCTOR
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['DOCTOR']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { doctorProfileId: true },
  });
  if (!user?.doctorProfileId) {
    return NextResponse.json({ success: false, message: 'No doctor profile linked to this account.' }, { status: 403 });
  }

  // Scope the delete to the caller's own doctor profile so one doctor cannot
  // remove another's slots by guessing an id.
  const deleted = await prisma.doctorAvailability.deleteMany({
    where: { id: params.id, doctorId: user.doctorProfileId },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ success: false, message: 'Slot not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
