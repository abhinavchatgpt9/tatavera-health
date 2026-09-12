import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LeadStage } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

const StageSchema = z.object({
  stage: z.nativeEnum(LeadStage),
  note: z.string().optional(),
});

// PUT /api/leads/{id}/stage — advance/change a lead's CRM stage; records a LeadStageEvent
// Auth: required. Roles: CASE_MANAGER, ADMIN, HOSPITAL_ADMIN
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireRole(req, ['CASE_MANAGER', 'ADMIN', 'HOSPITAL_ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = StageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid data: ' + parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        stage: parsed.data.stage,
        stageHistory: { create: { stage: parsed.data.stage, note: parsed.data.note } },
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Lead stage update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update stage.' }, { status: 500 });
  }
}
