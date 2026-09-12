import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { TaskPriority } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const TaskSchema = z.object({
  title: z.string().min(1),
  dueAt: z.string().datetime().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  assigneeId: z.string().optional(),
});

// GET /api/leads/{id}/tasks
// Auth: required. Roles: CASE_MANAGER, ADMIN, HOSPITAL_ADMIN
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.leadTask.findMany({
    where: { leadId: params.id },
    orderBy: { dueAt: 'asc' },
  });

  return NextResponse.json({ success: true, tasks });
}

// POST /api/leads/{id}/tasks
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = TaskSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const task = await prisma.leadTask.create({
      data: {
        leadId: params.id,
        title: parsed.data.title,
        dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : undefined,
        priority: parsed.data.priority,
        assigneeId: parsed.data.assigneeId || auth.userId,
      },
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    console.error('Lead task create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create task.' }, { status: 500 });
  }
}
