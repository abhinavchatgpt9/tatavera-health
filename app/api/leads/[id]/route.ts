import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const STAFF_ROLES = ['CASE_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN'];

const UpdateLeadSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).optional(),
  treatmentName: z.string().optional(),
  hospitalId: z.string().optional(),
  caseManagerId: z.string().optional(),
  value: z.number().int().optional(),
});

// GET /api/leads/{id} — lead detail with notes, tasks, quotations, visa/travel status
// Auth: required. Roles: CASE_MANAGER, ADMIN, HOSPITAL_ADMIN
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, STAFF_ROLES);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      notes: { include: { author: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
      tasks: { orderBy: { dueAt: 'asc' } },
      quotations: { include: { items: true, hospital: { select: { name: true } } } },
      visaStatus: true,
      travelStatus: true,
      stageHistory: { orderBy: { createdAt: 'asc' } },
      hospital: { select: { name: true, city: true, country: true } },
    },
  });

  if (!lead) return NextResponse.json({ success: false, message: 'Lead not found.' }, { status: 404 });

  return NextResponse.json({ success: true, lead });
}

// PUT /api/leads/{id} — update lead fields
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = UpdateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Lead update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update lead.' }, { status: 500 });
  }
}

// DELETE /api/leads/{id}
// Auth: required. Roles: ADMIN
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead delete error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete lead.' }, { status: 500 });
  }
}
