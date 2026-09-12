import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';

// GET /api/admin/stats — platform-wide KPI summary for the admin dashboard
// Auth: required. Roles: ADMIN
export async function GET(req: NextRequest) {
  const auth = requireRole(req, ['ADMIN']);
  if (!auth) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const [totalUsers, totalPatients, totalDoctors, totalHospitals, totalLeads, activeLeads] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'PATIENT' } }),
    prisma.doctor.count(),
    prisma.hospital.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { stage: { notIn: ['TREATMENT_COMPLETED'] } } }),
  ]);

  return NextResponse.json({
    success: true,
    stats: { totalUsers, totalPatients, totalDoctors, totalHospitals, totalLeads, activeLeads },
  });
}
