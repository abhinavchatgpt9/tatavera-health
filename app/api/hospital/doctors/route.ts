import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const LinkDoctorSchema = z.object({ doctorId: z.string().min(1) });

// GET /api/hospital/doctors — doctors affiliated with the logged-in hospital admin's hospital
// Auth: required. Roles: HOSPITAL_ADMIN, ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
  if (!staff) return NextResponse.json({ success: true, doctors: [] });

  const links = await prisma.doctorHospital.findMany({
    where: { hospitalId: staff.hospitalId },
    include: { doctor: true },
  });

  return NextResponse.json({ success: true, doctors: links.map((l) => l.doctor) });
}

// POST /api/hospital/doctors — affiliate an existing doctor with this hospital
// Auth: required. Roles: HOSPITAL_ADMIN, ADMIN
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
  if (!staff) return NextResponse.json({ success: false, message: 'No hospital linked to this account.' }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = LinkDoctorSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'doctorId is required.' }, { status: 400 });
    }

    const link = await prisma.doctorHospital.create({
      data: { hospitalId: staff.hospitalId, doctorId: parsed.data.doctorId },
    });

    return NextResponse.json({ success: true, link }, { status: 201 });
  } catch (error) {
    console.error('Doctor affiliation error:', error);
    return NextResponse.json({ success: false, message: 'Failed to affiliate doctor.' }, { status: 500 });
  }
}
