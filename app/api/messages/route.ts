import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

const SendMessageSchema = z.object({
  caseId: z.string().min(1),
  body: z.string().min(1).max(5000),
});

/**
 * Returns the case id if this user is allowed to read and post in it:
 * the patient the case belongs to, the case manager who owns it, or an admin.
 */
async function authoriseCase(caseId: string, userId: string, role: string): Promise<boolean> {
  const patientCase = await prisma.patientCase.findUnique({
    where: { id: caseId },
    select: { userId: true, caseManager: { select: { user: { select: { id: true } } } } },
  });
  if (!patientCase) return false;

  if (role === 'ADMIN') return true;
  if (patientCase.userId === userId) return true;
  if (patientCase.caseManager?.user?.id === userId) return true;
  return false;
}

// GET /api/messages?caseId=... — messages in one patient case, oldest first
// Auth: required. The case's patient, its case manager, or an admin.
export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const caseId = new URL(req.url).searchParams.get('caseId');
  if (!caseId) return NextResponse.json({ success: false, message: 'caseId is required.' }, { status: 400 });

  if (!(await authoriseCase(caseId, auth.userId, auth.role))) {
    return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { caseId },
    include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  });

  // Opening the thread marks everyone else's messages as read.
  await prisma.message.updateMany({
    where: { caseId, read: false, senderId: { not: auth.userId } },
    data: { read: true },
  });

  return NextResponse.json({ success: true, messages });
}

// POST /api/messages — post a message into a patient case
// Auth: required. The case's patient, its case manager, or an admin.
export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const parsed = SendMessageSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    if (!(await authoriseCase(parsed.data.caseId, auth.userId, auth.role))) {
      return NextResponse.json({ success: false, message: 'Not found.' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: { caseId: parsed.data.caseId, senderId: auth.userId, body: parsed.data.body },
      include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    });

    // Touch the case so it sorts to the top of the case manager's inbox.
    await prisma.patientCase.update({
      where: { id: parsed.data.caseId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error) {
    console.error('Message create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to send message.' }, { status: 500 });
  }
}
