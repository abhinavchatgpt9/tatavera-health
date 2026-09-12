import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const DepartmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  headDoctor: z.string().optional(),
});

// GET /api/hospital/departments
// Auth: required. Roles: HOSPITAL_ADMIN, ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
  if (!staff) return NextResponse.json({ success: true, departments: [] });

  const departments = await prisma.department.findMany({
    where: { hospitalId: staff.hospitalId },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ success: true, departments });
}

// POST /api/hospital/departments
// Auth: required. Roles: HOSPITAL_ADMIN, ADMIN
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
  if (!staff) return NextResponse.json({ success: false, message: 'No hospital linked to this account.' }, { status: 403 });

  try {
    const body = await req.json();
    const parsed = DepartmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: { hospitalId: staff.hospitalId, ...parsed.data },
    });

    return NextResponse.json({ success: true, department }, { status: 201 });
  } catch (error) {
    console.error('Department create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create department.' }, { status: 500 });
  }
}
