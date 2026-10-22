import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole, hashPassword } from '@/lib/auth';
import { generateTempPassword } from '@/lib/staff-application';

const ReviewSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reviewNote: z.string().max(1000).optional(),
  // Only used on APPROVE, and only for HOSPITAL_ADMIN applications — which hospital to attach.
  hospitalId: z.string().optional(),
});

// PATCH /api/staff-applications/[id] — admin only: approve or reject an application.
// On approval this creates the actual login (User row) and returns a one-time temp
// password to hand to the applicant, since email delivery isn't guaranteed configured.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: 'Invalid input: ' + parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const application = await prisma.staffApplication.findUnique({ where: { id: params.id } });
  if (!application) {
    return NextResponse.json({ success: false, message: 'Application not found.' }, { status: 404 });
  }
  if (application.status !== 'PENDING') {
    return NextResponse.json({ success: false, message: 'This application was already reviewed.' }, { status: 409 });
  }

  if (parsed.data.action === 'REJECT') {
    await prisma.staffApplication.update({
      where: { id: application.id },
      data: { status: 'REJECTED', reviewedById: auth.userId, reviewNote: parsed.data.reviewNote, reviewedAt: new Date() },
    });
    await prisma.auditLog.create({
      data: { userId: auth.userId, action: `Rejected staff application from ${application.email}`, entityType: 'StaffApplication', entityId: application.id },
    });
    return NextResponse.json({ success: true, status: 'REJECTED' });
  }

  // APPROVE: create the real login account.
  const existingUser = await prisma.user.findFirst({ where: { email: { equals: application.email, mode: 'insensitive' } } });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: 'A user account with this email already exists. Reject this application or resolve the conflict manually.' },
      { status: 409 }
    );
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: application.name,
        email: application.email,
        phone: application.phone,
        role: application.requestedRole,
        passwordHash,
        emailVerified: new Date(),
      },
      select: { id: true, name: true, email: true, role: true },
    });

    if (application.requestedRole === 'HOSPITAL_ADMIN' && parsed.data.hospitalId) {
      await tx.hospitalStaff.create({
        data: { userId: user.id, hospitalId: parsed.data.hospitalId, title: 'International Patient Coordinator' },
      });
    }

    await tx.staffApplication.update({
      where: { id: application.id },
      data: { status: 'APPROVED', reviewedById: auth.userId, reviewNote: parsed.data.reviewNote, reviewedAt: new Date() },
    });

    await tx.auditLog.create({
      data: { userId: auth.userId, action: `Approved staff application — created ${user.role} account ${user.email}`, entityType: 'User', entityId: user.id },
    });

    return user;
  });

  return NextResponse.json({ success: true, status: 'APPROVED', user: result, tempPassword });
}
