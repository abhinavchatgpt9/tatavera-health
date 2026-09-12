import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const NoteSchema = z.object({ body: z.string().min(1) });

// GET /api/leads/{id}/notes
// Auth: required. Roles: CASE_MANAGER, ADMIN, HOSPITAL_ADMIN
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const notes = await prisma.leadNote.findMany({
    where: { leadId: params.id },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, notes });
}

// POST /api/leads/{id}/notes
// Auth: required. Roles: CASE_MANAGER, ADMIN, HOSPITAL_ADMIN
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = NoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Note body is required.' }, { status: 400 });
    }

    const note = await prisma.leadNote.create({
      data: { leadId: params.id, authorId: auth.userId, body: parsed.data.body },
    });

    return NextResponse.json({ success: true, note }, { status: 201 });
  } catch (error) {
    console.error('Lead note create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to add note.' }, { status: 500 });
  }
}
