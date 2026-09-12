import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const ConvertSchema = z.object({
  caseManagerId: z.string().optional(),
  treatmentName: z.string().optional(),
  value: z.number().int().optional(),
});

// POST /api/enquiries/{id}/convert — convert a raw public-site enquiry into a CRM Lead (LEAD_CREATED)
// Auth: required. Roles: CASE_MANAGER, ADMIN
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const enquiry = await prisma.enquiry.findUnique({ where: { id: params.id }, include: { lead: true } });
    if (!enquiry) return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    if (enquiry.lead) return NextResponse.json({ success: false, message: 'Enquiry already converted.' }, { status: 409 });

    const body = await req.json().catch(() => ({}));
    const parsed = ConvertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid data.' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        enquiryId: enquiry.id,
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        country: enquiry.country,
        treatmentName: parsed.data.treatmentName,
        caseManagerId: parsed.data.caseManagerId,
        value: parsed.data.value,
        source: enquiry.source || undefined,
        stage: 'LEAD_CREATED',
        stageHistory: { create: { stage: 'LEAD_CREATED' } },
      },
    });

    await prisma.enquiry.update({ where: { id: enquiry.id }, data: { status: 'CONVERTED' } });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Enquiry conversion error:', error);
    return NextResponse.json({ success: false, message: 'Failed to convert enquiry.' }, { status: 500 });
  }
}
