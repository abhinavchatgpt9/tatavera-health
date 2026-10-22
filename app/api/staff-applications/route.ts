import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { ApplySchema } from '@/lib/staff-application';

// POST /api/staff-applications — public: doctor/hospital submits an application to join.
// Nothing is auto-created here; an admin reviews and approves from the admin portal.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ApplySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid input: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const existingPending = await prisma.staffApplication.findFirst({
      where: { email: parsed.data.email.toLowerCase(), status: 'PENDING' },
    });
    if (existingPending) {
      return NextResponse.json(
        { success: false, message: 'You already have a pending application with this email. We will be in touch soon.' },
        { status: 409 }
      );
    }

    const application = await prisma.staffApplication.create({
      data: { ...parsed.data, email: parsed.data.email.toLowerCase() },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error) {
    console.error('Staff application error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}

// GET /api/staff-applications — admin only: list applications (optionally filtered by status).
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const applications = await prisma.staffApplication.findMany({
    where: status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, applications });
}
