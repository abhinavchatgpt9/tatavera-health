import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TaskStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const UpdateTaskSchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  title: z.string().min(1).optional(),
  dueAt: z.string().datetime().optional(),
});

// PUT /api/tasks/{id} — update task status/title/due date
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = UpdateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const task = await prisma.leadTask.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined,
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('Task update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update task.' }, { status: 500 });
  }
}

// DELETE /api/tasks/{id}
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.leadTask.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Task delete error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete task.' }, { status: 500 });
  }
}
