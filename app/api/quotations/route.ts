import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const QuotationItemSchema = z.object({ description: z.string().min(1), amount: z.number().int().nonnegative() });

const CreateQuotationSchema = z.object({
  leadId: z.string().min(1),
  currency: z.string().default('USD'),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(QuotationItemSchema).min(1),
});

// GET /api/quotations?leadId=... — list quotations, optionally filtered by lead
// Auth: required. Roles: HOSPITAL_ADMIN, CASE_MANAGER, ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId');

  const where: Record<string, unknown> = {};
  if (leadId) where.leadId = leadId;

  if (auth.role === 'HOSPITAL_ADMIN') {
    const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
    if (staff) where.hospitalId = staff.hospitalId;
  }

  const quotations = await prisma.quotation.findMany({
    where,
    include: { items: true, hospital: { select: { name: true } }, lead: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, quotations });
}

// POST /api/quotations — hospital creates a quotation for a lead
// Auth: required. Roles: HOSPITAL_ADMIN, ADMIN
export async function POST(req: NextRequest) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = CreateQuotationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const staff = await prisma.hospitalStaff.findUnique({ where: { userId: auth.userId } });
    if (!staff && auth.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'No hospital linked to this account.' }, { status: 403 });
    }

    const hospitalId = staff?.hospitalId;
    if (!hospitalId) {
      return NextResponse.json({ success: false, message: 'hospitalId is required.' }, { status: 400 });
    }

    const totalAmount = parsed.data.items.reduce((sum, i) => sum + i.amount, 0);

    const quotation = await prisma.quotation.create({
      data: {
        leadId: parsed.data.leadId,
        hospitalId,
        currency: parsed.data.currency,
        totalAmount,
        validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : undefined,
        notes: parsed.data.notes,
        status: 'SENT',
        items: { create: parsed.data.items },
      },
      include: { items: true },
    });

    await prisma.lead.update({
      where: { id: parsed.data.leadId },
      data: { stage: 'QUOTATION_RECEIVED', stageHistory: { create: { stage: 'QUOTATION_RECEIVED' } } },
    });

    return NextResponse.json({ success: true, quotation }, { status: 201 });
  } catch (error) {
    console.error('Quotation create error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create quotation.' }, { status: 500 });
  }
}
