import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// GET /api/doctor/patients — patients (PatientCases) assigned to the logged-in doctor
// Auth: required. Roles: DOCTOR
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['DOCTOR']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const doctorLink = await prisma.user.findUnique({ where: { id: auth.userId }, select: { doctorProfileId: true } });

  if (!doctorLink?.doctorProfileId) {
    return NextResponse.json({ success: true, patients: [] });
  }

  const cases = await prisma.patientCase.findMany({
    where: { doctorId: doctorLink.doctorProfileId },
    include: { user: { select: { name: true, country: true } }, treatment: { select: { name: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ success: true, patients: cases });
}
