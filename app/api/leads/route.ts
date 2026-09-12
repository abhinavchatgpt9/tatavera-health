import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const LEAD_STAFF_ROLES = ['CASE_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN'];

const CreateLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string().min(1),
  treatmentName: z.string().optional(),
  hospitalId: z.string().optional(),
  source: z.string().optional(),
  value: z.number().int().optional(),
  currency: z.string().optional(),
});

// GET /api/leads — list leads (Case Manager: own assigned leads; Admin: all; Hospital Admin: leads matched to their hospital)
// Auth: required. Roles: CASE_MANAGER, ADMIN, HOSPITAL_ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, LEAD_STAFF_ROLES);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get('stage');

  const where: Record<string, unknown> = {};
  if (stage) where.stage = stage;

  if (auth.role === 'CASE_MANAGER') {
    const cm = await prisma.caseManager.findFirst({ where: { user: { id: auth.userId } } });
    if (cm) where.caseManagerId = cm.id;
  } else if (auth.role === 'HOSPITAL_ADMIN') {
    const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
    if (staff) where.hospitalId = staff.hospitalId;
  }

  const leads = await prisma.lead.findMany({
    where,
    include: { assignee: { select: { name: true } }, hospital: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, leads });
}

// POST /api/leads — create a lead (typically from an enquiry conversion)
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = CreateLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        ...parsed.data,
        stage: 'LEAD_CREATED',
        stageHistory: { create: { stage: 'LEAD_CREATED' } },
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Lead create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create lead.' }, { status: 500 });
  }
}
