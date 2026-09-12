import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
  phone: z.string().optional(),
});

// GET /api/admin/users — list all platform users
// Auth: required. Roles: ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  const users = await prisma.user.findMany({
    where: role ? { role: role as Role } : undefined,
    select: { id: true, name: true, email: true, role: true, createdAt: true, phone: true, emailVerified: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, users });
}

// POST /api/admin/users — create a staff account (doctor/hospital admin/case manager/admin)
// Auth: required. Roles: ADMIN
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        role: parsed.data.role,
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    await prisma.auditLog.create({
      data: { userId: auth.userId, action: `Created user ${user.email} with role ${user.role}`, entityType: 'User', entityId: user.id },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'Email already in use.' }, { status: 409 });
    }
    console.error('Admin user create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create user.' }, { status: 500 });
  }
}
