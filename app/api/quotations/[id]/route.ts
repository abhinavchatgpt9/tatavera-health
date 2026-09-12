import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { QuotationStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const UpdateQuotationSchema = z.object({ status: z.nativeEnum(QuotationStatus) });

// GET /api/quotations/{id}
// Auth: required. Roles: HOSPITAL_ADMIN, CASE_MANAGER, ADMIN
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['HOSPITAL_ADMIN', 'CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const quotation = await prisma.quotation.findUnique({
    where: { id: params.id },
    include: { items: true, hospital: true, lead: true },
  });

  if (!quotation) return NextResponse.json({ success: false, message: 'Quotation not found.' }, { status: 404 });

  return NextResponse.json({ success: true, quotation });
}

// PUT /api/quotations/{id} — accept/decline a quotation (patient-facing decision recorded by case manager)
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = UpdateQuotationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'A valid status is required.' }, { status: 400 });
    }

    const quotation = await prisma.quotation.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });

    if (parsed.data.status === 'ACCEPTED') {
      await prisma.lead.update({
        where: { id: quotation.leadId },
        data: { stage: 'TREATMENT_CONFIRMED', stageHistory: { create: { stage: 'TREATMENT_CONFIRMED' } } },
      });
    }

    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    console.error('Quotation update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update quotation.' }, { status: 500 });
  }
}
