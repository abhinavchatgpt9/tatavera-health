import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const HospitalSettingsSchema = z.object({
  name: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  description: z.string().optional(),
  accreditations: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
});

// GET /api/hospital/settings — the logged-in hospital admin's hospital profile
// Auth: required. Roles: HOSPITAL_ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId }, include: { hospital: true } });
  if (!staff) return NextResponse.json({ success: false, message: 'No hospital linked to this account.' }, { status: 404 });

  return NextResponse.json({ success: true, hospital: staff.hospital });
}

// PUT /api/hospital/settings
// Auth: required. Roles: HOSPITAL_ADMIN
export async function PUT(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
  if (!staff) return NextResponse.json({ success: false, message: 'No hospital linked to this account.' }, { status: 404 });

  try {
    const body = await req.json();
    const parsed = HospitalSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const hospital = await prisma.hospital.update({ where: { id: staff.hospitalId }, data: parsed.data });
    return NextResponse.json({ success: true, hospital });
  } catch (error) {
    console.error('Hospital settings update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update settings.' }, { status: 500 });
  }
}
