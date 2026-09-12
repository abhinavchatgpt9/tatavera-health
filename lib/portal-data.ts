import 'server-only';

import { prisma } from '@/lib/prisma';
import type { PortalSession } from '@/lib/portal-session';

/**
 * Read-side data access for the five portals.
 *
 * Portal pages are Server Components, so they call these directly instead of
 * fetching their own API routes — one round trip instead of two, and the auth
 * context is already resolved. The API routes under app/api/* stay as the
 * write path and for anything a client component needs to refetch.
 *
 * Every function takes the session and scopes its query to it: a hospital admin
 * sees only their hospital's rows, a case manager only their own leads. Scoping
 * lives here rather than in each page so a new page can't accidentally omit it.
 */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ─── DOCTOR PORTAL ────────────────────────────────────────────────────────────

export async function getDoctorProfile(session: PortalSession) {
  if (!session.doctorId) return null;

  const doctor = await prisma.doctor.findUnique({
    where: { id: session.doctorId },
    include: {
      hospitals: { include: { hospital: { select: { name: true, city: true } } } },
    },
  });
  if (!doctor) return null;

  return {
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    designation: doctor.designation,
    about: doctor.about,
    experience: doctor.experience,
    qualifications: doctor.qualifications,
    achievements: doctor.achievements,
    languages: doctor.languages,
    hospital: doctor.hospitals[0]?.hospital.name ?? 'No hospital linked',
    photoUrl: doctor.photoUrl,
    rating: doctor.rating,
    reviewCount: doctor.reviewCount,
  };
}

export async function getDoctorPatients(session: PortalSession) {
  if (!session.doctorId) return [];

  const cases = await prisma.patientCase.findMany({
    where: { doctorId: session.doctorId },
    include: {
      user: { select: { name: true, country: true } },
      treatment: { select: { name: true } },
      appointments: { orderBy: { scheduledAt: 'desc' }, take: 1, select: { scheduledAt: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return cases.map((c) => ({
    id: c.id,
    name: c.user.name,
    country: c.user.country ?? '—',
    treatment: c.treatment?.name ?? 'Not yet assigned',
    stage: c.status,
    lastVisit: c.appointments[0]?.scheduledAt.toISOString() ?? null,
  }));
}

export async function getDoctorAppointments(session: PortalSession, opts?: { upcomingOnly?: boolean }) {
  if (!session.doctorId) return [];

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: session.doctorId,
      ...(opts?.upcomingOnly ? { scheduledAt: { gte: new Date() } } : {}),
    },
    include: { user: { select: { name: true, country: true } } },
    orderBy: { scheduledAt: 'asc' },
  });

  return appointments.map((a) => ({
    id: a.id,
    patient: a.user.name,
    country: a.user.country ?? '—',
    type: a.type,
    status: a.status,
    scheduledAt: a.scheduledAt.toISOString(),
    duration: a.duration,
    meetLink: a.meetLink,
    notes: a.notes,
  }));
}

export async function getDoctorOpinions(session: PortalSession) {
  if (!session.doctorId) return [];

  const opinions = await prisma.medicalOpinion.findMany({
    where: { doctorId: session.doctorId },
    include: { case: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return opinions.map((o) => ({
    id: o.id,
    patient: o.case.user.name,
    summary: o.summary,
    recommendation: o.recommendation,
    attachments: o.attachments,
    createdAt: o.createdAt.toISOString(),
  }));
}

/** One row per weekday, so the availability grid always renders all seven. */
export async function getDoctorAvailability(session: PortalSession) {
  if (!session.doctorId) return DAY_NAMES.map((day, i) => ({ dayOfWeek: i, day, slots: [], label: 'Unavailable' }));

  const slots = await prisma.doctorAvailability.findMany({
    where: { doctorId: session.doctorId, active: true },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });

  return DAY_NAMES.map((day, dayOfWeek) => {
    const daySlots = slots.filter((s) => s.dayOfWeek === dayOfWeek);
    return {
      dayOfWeek,
      day,
      slots: daySlots.map((s) => ({ id: s.id, startTime: s.startTime, endTime: s.endTime, slotMins: s.slotMins })),
      label: daySlots.length ? daySlots.map((s) => `${s.startTime} - ${s.endTime}`).join(', ') : 'Unavailable',
    };
  });
}

/** Medical reports belonging to patients whose case this doctor is on. */
export async function getDoctorReports(session: PortalSession) {
  if (!session.doctorId) return [];

  const cases = await prisma.patientCase.findMany({
    where: { doctorId: session.doctorId },
    select: { userId: true },
  });
  const userIds = cases.map((c) => c.userId);
  if (userIds.length === 0) return [];

  const reports = await prisma.report.findMany({
    where: { userId: { in: userIds } },
    include: { user: { select: { name: true, country: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return reports.map((r) => ({
    id: r.id,
    patient: r.user.name,
    country: r.user.country ?? '—',
    fileName: r.fileName,
    fileUrl: r.fileUrl,
    fileSize: r.fileSize,
    mimeType: r.mimeType,
    category: r.category,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getDoctorDashboardStats(session: PortalSession) {
  if (!session.doctorId) {
    return { totalPatients: 0, upcomingAppointments: 0, opinionsGiven: 0, activeCases: 0 };
  }

  const [totalPatients, upcomingAppointments, opinionsGiven, activeCases] = await Promise.all([
    prisma.patientCase.count({ where: { doctorId: session.doctorId } }),
    prisma.appointment.count({ where: { doctorId: session.doctorId, scheduledAt: { gte: new Date() } } }),
    prisma.medicalOpinion.count({ where: { doctorId: session.doctorId } }),
    prisma.patientCase.count({
      where: { doctorId: session.doctorId, status: { notIn: ['COMPLETED'] } },
    }),
  ]);

  return { totalPatients, upcomingAppointments, opinionsGiven, activeCases };
}

// ─── HOSPITAL PORTAL ──────────────────────────────────────────────────────────

export async function getHospitalProfile(session: PortalSession) {
  if (!session.hospitalId) return null;
  return prisma.hospital.findUnique({ where: { id: session.hospitalId } });
}

export async function getHospitalDoctors(session: PortalSession) {
  if (!session.hospitalId) return [];

  const links = await prisma.doctorHospital.findMany({
    where: { hospitalId: session.hospitalId },
    include: {
      doctor: {
        include: { _count: { select: { patientCases: true, appointments: true } } },
      },
    },
  });

  return links.map(({ doctor }) => ({
    id: doctor.id,
    name: doctor.name,
    specialty: doctor.specialty,
    designation: doctor.designation,
    experience: doctor.experience,
    photoUrl: doctor.photoUrl,
    patients: doctor._count.patientCases,
    appointments: doctor._count.appointments,
    rating: doctor.rating,
    published: doctor.published,
  }));
}

export async function getHospitalDepartments(session: PortalSession) {
  if (!session.hospitalId) return [];

  const departments = await prisma.department.findMany({
    where: { hospitalId: session.hospitalId },
    orderBy: { name: 'asc' },
  });

  // Doctors aren't tied to a department row, so count by matching specialty —
  // the closest honest signal available without a schema change.
  const doctors = await getHospitalDoctors(session);

  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    headDoctor: d.headDoctor,
    doctorCount: doctors.filter((doc) => doc.specialty.toLowerCase().includes(d.name.toLowerCase().split(' ')[0])).length,
  }));
}

export async function getHospitalLeads(session: PortalSession) {
  if (!session.hospitalId) return [];

  const leads = await prisma.lead.findMany({
    where: { hospitalId: session.hospitalId },
    include: { assignee: { select: { name: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return leads.map((l) => ({
    id: l.id,
    name: l.name,
    country: l.country,
    email: l.email,
    phone: l.phone,
    treatment: l.treatmentName ?? '—',
    stage: l.stage,
    value: l.value,
    currency: l.currency,
    assignee: l.assignee?.name ?? 'Unassigned',
    createdAt: l.createdAt.toISOString(),
  }));
}

export async function getHospitalQuotations(session: PortalSession) {
  if (!session.hospitalId) return [];

  const quotations = await prisma.quotation.findMany({
    where: { hospitalId: session.hospitalId },
    include: { lead: { select: { name: true, country: true, treatmentName: true } }, items: true },
    orderBy: { createdAt: 'desc' },
  });

  return quotations.map((q) => ({
    id: q.id,
    patient: q.lead.name,
    country: q.lead.country,
    treatment: q.lead.treatmentName ?? '—',
    status: q.status,
    totalAmount: q.totalAmount,
    currency: q.currency,
    validUntil: q.validUntil?.toISOString() ?? null,
    notes: q.notes,
    items: q.items.map((i) => ({ id: i.id, description: i.description, amount: i.amount })),
    createdAt: q.createdAt.toISOString(),
  }));
}

export async function getHospitalAppointments(session: PortalSession) {
  if (!session.hospitalId) return [];

  const doctorLinks = await prisma.doctorHospital.findMany({
    where: { hospitalId: session.hospitalId },
    select: { doctorId: true },
  });
  const doctorIds = doctorLinks.map((d) => d.doctorId);
  if (doctorIds.length === 0) return [];

  const appointments = await prisma.appointment.findMany({
    where: { doctorId: { in: doctorIds } },
    include: {
      user: { select: { name: true, country: true } },
      doctor: { select: { name: true, specialty: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  return appointments.map((a) => ({
    id: a.id,
    patient: a.user.name,
    country: a.user.country ?? '—',
    doctor: a.doctor?.name ?? 'Unassigned',
    specialty: a.doctor?.specialty ?? '—',
    type: a.type,
    status: a.status,
    scheduledAt: a.scheduledAt.toISOString(),
  }));
}

export async function getHospitalDashboardStats(session: PortalSession) {
  if (!session.hospitalId) {
    return { doctors: 0, departments: 0, activeLeads: 0, pendingQuotations: 0, quotedValue: 0, upcomingAppointments: 0 };
  }

  const doctorLinks = await prisma.doctorHospital.findMany({
    where: { hospitalId: session.hospitalId },
    select: { doctorId: true },
  });
  const doctorIds = doctorLinks.map((d) => d.doctorId);

  const [departments, activeLeads, pendingQuotations, quotedAgg, upcomingAppointments] = await Promise.all([
    prisma.department.count({ where: { hospitalId: session.hospitalId } }),
    prisma.lead.count({
      where: { hospitalId: session.hospitalId, stage: { notIn: ['TREATMENT_COMPLETED', 'FOLLOW_UP'] } },
    }),
    prisma.quotation.count({ where: { hospitalId: session.hospitalId, status: { in: ['DRAFT', 'SENT'] } } }),
    prisma.quotation.aggregate({
      where: { hospitalId: session.hospitalId, status: 'ACCEPTED' },
      _sum: { totalAmount: true },
    }),
    doctorIds.length
      ? prisma.appointment.count({ where: { doctorId: { in: doctorIds }, scheduledAt: { gte: new Date() } } })
      : Promise.resolve(0),
  ]);

  return {
    doctors: doctorIds.length,
    departments,
    activeLeads,
    pendingQuotations,
    quotedValue: quotedAgg._sum.totalAmount ?? 0,
    upcomingAppointments,
  };
}

// ─── CASE MANAGER PORTAL ──────────────────────────────────────────────────────

/**
 * Case managers see the leads assigned to them. Admins viewing the same pages
 * see everything, which is what makes the portal usable for oversight.
 */
function caseManagerLeadFilter(session: PortalSession) {
  if (session.role === 'ADMIN') return {};
  return session.caseManagerId
    ? { caseManagerId: session.caseManagerId }
    : { assigneeId: session.userId };
}

export async function getCaseManagerLeads(session: PortalSession) {
  const leads = await prisma.lead.findMany({
    where: caseManagerLeadFilter(session),
    include: {
      hospital: { select: { name: true } },
      _count: { select: { tasks: true, notes: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    country: l.country,
    treatment: l.treatmentName ?? '—',
    stage: l.stage,
    value: l.value,
    currency: l.currency,
    source: l.source,
    hospital: l.hospital?.name ?? null,
    taskCount: l._count.tasks,
    noteCount: l._count.notes,
    assignedAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));
}

export async function getCaseManagerTasks(session: PortalSession) {
  const tasks = await prisma.leadTask.findMany({
    where: { lead: caseManagerLeadFilter(session) },
    include: { lead: { select: { name: true } }, assignee: { select: { name: true } } },
    orderBy: [{ status: 'asc' }, { dueAt: 'asc' }],
  });

  return tasks.map((t) => ({
    id: t.id,
    lead: t.lead.name,
    leadId: t.leadId,
    title: t.title,
    dueAt: t.dueAt?.toISOString() ?? null,
    priority: t.priority,
    status: t.status,
    assignee: t.assignee?.name ?? 'Unassigned',
  }));
}

export async function getCaseManagerNotes(session: PortalSession) {
  const notes = await prisma.leadNote.findMany({
    where: { lead: caseManagerLeadFilter(session) },
    include: { lead: { select: { name: true } }, author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return notes.map((n) => ({
    id: n.id,
    lead: n.lead.name,
    leadId: n.leadId,
    author: n.author.name,
    body: n.body,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function getCaseManagerTimeline(session: PortalSession) {
  const events = await prisma.leadStageEvent.findMany({
    where: { lead: caseManagerLeadFilter(session) },
    include: { lead: { select: { name: true, country: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return events.map((e) => ({
    id: e.id,
    lead: e.lead.name,
    country: e.lead.country,
    leadId: e.leadId,
    stage: e.stage,
    note: e.note,
    createdAt: e.createdAt.toISOString(),
  }));
}

export async function getCaseManagerVisaStatuses(session: PortalSession) {
  const rows = await prisma.visaStatus.findMany({
    where: { lead: caseManagerLeadFilter(session) },
    include: { lead: { select: { name: true, country: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return rows.map((v) => ({
    id: v.id,
    lead: v.lead.name,
    patientCountry: v.lead.country,
    stage: v.stage,
    country: v.country,
    documents: v.documents,
    notes: v.notes,
    updatedAt: v.updatedAt.toISOString(),
  }));
}

export async function getCaseManagerTravelStatuses(session: PortalSession) {
  const rows = await prisma.travelStatus.findMany({
    where: { lead: caseManagerLeadFilter(session) },
    include: { lead: { select: { name: true, country: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return rows.map((t) => ({
    id: t.id,
    lead: t.lead.name,
    patientCountry: t.lead.country,
    arrivalDate: t.arrivalDate?.toISOString() ?? null,
    departureDate: t.departureDate?.toISOString() ?? null,
    flightDetails: t.flightDetails,
    accommodation: t.accommodation,
    pickupArranged: t.pickupArranged,
    notes: t.notes,
  }));
}

export async function getCaseManagerQuotations(session: PortalSession) {
  const quotations = await prisma.quotation.findMany({
    where: { lead: caseManagerLeadFilter(session) },
    include: {
      lead: { select: { name: true, country: true, treatmentName: true } },
      hospital: { select: { name: true, city: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return quotations.map((q) => ({
    id: q.id,
    patient: q.lead.name,
    country: q.lead.country,
    treatment: q.lead.treatmentName ?? '—',
    hospital: q.hospital.name,
    status: q.status,
    totalAmount: q.totalAmount,
    currency: q.currency,
    validUntil: q.validUntil?.toISOString() ?? null,
    itemCount: q.items.length,
    createdAt: q.createdAt.toISOString(),
  }));
}

/**
 * Tasks that are overdue or due in the next seven days — the "what needs me
 * today" view. Split so the page can show them under separate headings.
 */
export async function getCaseManagerFollowUps(session: PortalSession) {
  const now = new Date();
  const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const tasks = await prisma.leadTask.findMany({
    where: {
      lead: caseManagerLeadFilter(session),
      status: { not: 'DONE' },
      dueAt: { not: null, lte: inSevenDays },
    },
    include: { lead: { select: { name: true, country: true, stage: true } } },
    orderBy: { dueAt: 'asc' },
  });

  const mapped = tasks.map((t) => ({
    id: t.id,
    lead: t.lead.name,
    leadId: t.leadId,
    country: t.lead.country,
    stage: t.lead.stage,
    title: t.title,
    dueAt: t.dueAt!.toISOString(),
    priority: t.priority,
    status: t.status,
  }));

  return {
    overdue: mapped.filter((t) => new Date(t.dueAt) < now),
    dueSoon: mapped.filter((t) => new Date(t.dueAt) >= now),
  };
}

/** Patient-case conversations the case manager owns. */
export async function getCaseManagerConversations(session: PortalSession) {
  const where =
    session.role === 'ADMIN'
      ? {}
      : session.caseManagerId
        ? { caseManagerId: session.caseManagerId }
        : { id: '__none__' };

  const cases = await prisma.patientCase.findMany({
    where,
    include: {
      user: { select: { name: true, country: true, email: true, avatarUrl: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1, include: { sender: { select: { name: true } } } },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return cases.map((c) => ({
    id: c.id,
    patient: c.user.name,
    country: c.user.country ?? '—',
    email: c.user.email,
    avatarUrl: c.user.avatarUrl,
    status: c.status,
    messageCount: c._count.messages,
    lastMessage: c.messages[0]
      ? {
          body: c.messages[0].body,
          sender: c.messages[0].sender.name,
          createdAt: c.messages[0].createdAt.toISOString(),
          read: c.messages[0].read,
        }
      : null,
  }));
}

/** Medical reports uploaded by patients whose cases this manager owns. */
export async function getCaseManagerReports(session: PortalSession) {
  const caseWhere =
    session.role === 'ADMIN'
      ? {}
      : session.caseManagerId
        ? { caseManagerId: session.caseManagerId }
        : { id: '__none__' };

  const cases = await prisma.patientCase.findMany({ where: caseWhere, select: { userId: true } });
  const userIds = cases.map((c) => c.userId);
  if (userIds.length === 0) return [];

  const reports = await prisma.report.findMany({
    where: { userId: { in: userIds } },
    include: { user: { select: { name: true, country: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return reports.map((r) => ({
    id: r.id,
    patient: r.user.name,
    country: r.user.country ?? '—',
    fileName: r.fileName,
    fileUrl: r.fileUrl,
    fileSize: r.fileSize,
    mimeType: r.mimeType,
    category: r.category,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getCaseManagerDashboardStats(session: PortalSession) {
  const filter = caseManagerLeadFilter(session);
  const now = new Date();

  const [totalLeads, activeLeads, overdueTasks, pipelineValue, wonThisMonth] = await Promise.all([
    prisma.lead.count({ where: filter }),
    prisma.lead.count({ where: { ...filter, stage: { notIn: ['TREATMENT_COMPLETED', 'FOLLOW_UP'] } } }),
    prisma.leadTask.count({ where: { lead: filter, status: { not: 'DONE' }, dueAt: { lt: now } } }),
    prisma.lead.aggregate({
      where: { ...filter, stage: { notIn: ['TREATMENT_COMPLETED'] } },
      _sum: { value: true },
    }),
    prisma.lead.count({
      where: {
        ...filter,
        stage: 'TREATMENT_COMPLETED',
        updatedAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
      },
    }),
  ]);

  return {
    totalLeads,
    activeLeads,
    overdueTasks,
    pipelineValue: pipelineValue._sum.value ?? 0,
    wonThisMonth,
  };
}

// ─── ADMIN PORTAL ─────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalUsers,
    totalPatients,
    totalDoctors,
    totalHospitals,
    totalLeads,
    activeLeads,
    completedLeads,
    pendingQuotations,
    acceptedThisMonth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'PATIENT' } }),
    prisma.doctor.count(),
    prisma.hospital.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { stage: { notIn: ['TREATMENT_COMPLETED', 'FOLLOW_UP'] } } }),
    prisma.lead.count({ where: { stage: { in: ['TREATMENT_COMPLETED', 'FOLLOW_UP'] } } }),
    prisma.quotation.count({ where: { status: { in: ['DRAFT', 'SENT'] } } }),
    prisma.quotation.aggregate({
      where: { status: 'ACCEPTED', updatedAt: { gte: monthStart } },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totalUsers,
    totalPatients,
    totalDoctors,
    totalHospitals,
    totalLeads,
    activeLeads,
    // Share of leads that reached treatment, to one decimal place.
    conversionRate: totalLeads === 0 ? 0 : Math.round((completedLeads / totalLeads) * 1000) / 10,
    revenueThisMonth: acceptedThisMonth._sum.totalAmount ?? 0,
    pendingQuotations,
  };
}

export async function getAdminUsers(role?: string) {
  const users = await prisma.user.findMany({
    where: role && role !== 'ALL' ? { role: role as PortalSession['role'] } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      country: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    country: u.country,
    status: u.emailVerified ? 'ACTIVE' : 'PENDING',
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function getStaffApplications(status?: string) {
  const applications = await prisma.staffApplication.findMany({
    where: status && status !== 'ALL' ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return applications.map((a) => ({
    id: a.id,
    requestedRole: a.requestedRole,
    name: a.name,
    email: a.email,
    phone: a.phone,
    organizationName: a.organizationName,
    city: a.city,
    country: a.country,
    specialtyOrType: a.specialtyOrType,
    message: a.message,
    status: a.status,
    reviewNote: a.reviewNote,
    createdAt: a.createdAt.toISOString(),
    reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
  }));
}

export async function getAdminAuditLogs(limit = 100) {
  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return logs.map((l) => ({
    id: l.id,
    user: l.user?.name ?? 'System',
    action: l.action,
    entityType: l.entityType,
    entityId: l.entityId,
    ipAddress: l.ipAddress,
    createdAt: l.createdAt.toISOString(),
  }));
}

const FUNNEL_STAGES = [
  { stage: 'LEAD_CREATED', label: 'Lead Created' },
  { stage: 'LEAD_ASSIGNED', label: 'Lead Assigned' },
  { stage: 'LEAD_CONTACTED', label: 'Lead Contacted' },
  { stage: 'REPORTS_UPLOADED', label: 'Reports Uploaded' },
  { stage: 'HOSPITAL_MATCHED', label: 'Hospital Matched' },
  { stage: 'QUOTATION_RECEIVED', label: 'Quotation Received' },
  { stage: 'VIDEO_CONSULTATION', label: 'Video Consultation' },
  { stage: 'TREATMENT_CONFIRMED', label: 'Treatment Confirmed' },
  { stage: 'VISA_PROCESSING', label: 'Visa Processing' },
  { stage: 'TRAVEL_ARRANGED', label: 'Travel Arranged' },
  { stage: 'TREATMENT_COMPLETED', label: 'Treatment Completed' },
  { stage: 'FOLLOW_UP', label: 'Follow Up' },
] as const;

/**
 * Funnel counts are cumulative: a lead currently at "Visa Processing" has
 * already passed every earlier stage, so it counts toward all of them. Counting
 * only the current stage would show a jagged chart that reads as data loss.
 */
export async function getAdminCrmFunnel() {
  const grouped = await prisma.lead.groupBy({ by: ['stage'], _count: { _all: true } });
  const countByStage = new Map(grouped.map((g) => [g.stage as string, g._count._all]));

  let remaining = grouped.reduce((sum, g) => sum + g._count._all, 0);

  return FUNNEL_STAGES.map(({ stage, label }) => {
    const row = { stage: label, count: remaining };
    remaining -= countByStage.get(stage) ?? 0;
    return row;
  });
}

export async function getAdminLeads() {
  const leads = await prisma.lead.findMany({
    include: {
      assignee: { select: { name: true } },
      caseManager: { select: { name: true } },
      hospital: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  });

  return leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    country: l.country,
    treatment: l.treatmentName ?? '—',
    stage: l.stage,
    value: l.value,
    currency: l.currency,
    source: l.source,
    assignee: l.assignee?.name ?? l.caseManager?.name ?? 'Unassigned',
    hospital: l.hospital?.name ?? '—',
    createdAt: l.createdAt.toISOString(),
  }));
}

/** Catalogue rows the admin CMS pages list and edit. */
export async function getAdminDoctors() {
  const doctors = await prisma.doctor.findMany({
    include: {
      hospitals: { include: { hospital: { select: { name: true } } } },
      _count: { select: { patientCases: true, reviews: true } },
    },
    orderBy: { name: 'asc' },
  });

  return doctors.map((d) => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    specialty: d.specialty,
    designation: d.designation,
    experience: d.experience,
    hospital: d.hospitals[0]?.hospital.name ?? '—',
    rating: d.rating,
    reviewCount: d.reviewCount,
    cases: d._count.patientCases,
    published: d.published,
    featured: d.featured,
  }));
}

export async function getAdminHospitals() {
  const hospitals = await prisma.hospital.findMany({
    include: { _count: { select: { doctors: true, departments: true, leads: true } } },
    orderBy: { name: 'asc' },
  });

  return hospitals.map((h) => ({
    id: h.id,
    slug: h.slug,
    name: h.name,
    city: h.city,
    country: h.country,
    accreditations: h.accreditations,
    bedsCount: h.bedsCount,
    rating: h.rating,
    reviewCount: h.reviewCount,
    doctors: h._count.doctors,
    departments: h._count.departments,
    leads: h._count.leads,
    published: h.published,
    featured: h.featured,
  }));
}

export async function getAdminPatients() {
  const patients = await prisma.user.findMany({
    where: { role: 'PATIENT' },
    include: {
      patientCase: {
        include: {
          treatment: { select: { name: true } },
          hospital: { select: { name: true } },
          caseManager: { select: { name: true } },
        },
      },
      _count: { select: { reports: true, appointments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return patients.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    country: p.country,
    caseStatus: p.patientCase?.status ?? null,
    treatment: p.patientCase?.treatment?.name ?? '—',
    hospital: p.patientCase?.hospital?.name ?? '—',
    caseManager: p.patientCase?.caseManager?.name ?? 'Unassigned',
    reports: p._count.reports,
    appointments: p._count.appointments,
    createdAt: p.createdAt.toISOString(),
  }));
}

export async function getAdminTreatments() {
  const treatments = await prisma.treatment.findMany({
    include: { _count: { select: { hospitals: true, enquiries: true, faqs: true } } },
    orderBy: { name: 'asc' },
  });

  return treatments.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    specialty: t.specialty,
    costFrom: t.costFrom,
    costTo: t.costTo,
    currency: t.currency,
    duration: t.duration,
    hospitals: t._count.hospitals,
    enquiries: t._count.enquiries,
    faqs: t._count.faqs,
    published: t.published,
  }));
}

export async function getAdminDestinations() {
  const destinations = await prisma.destination.findMany({ orderBy: { country: 'asc' } });
  const leadsByCountry = await prisma.lead.groupBy({ by: ['country'], _count: { _all: true } });
  const countMap = new Map(leadsByCountry.map((r) => [r.country.toLowerCase(), r._count._all]));

  return destinations.map((d) => ({
    id: d.id,
    slug: d.slug,
    country: d.country,
    countryCode: d.countryCode,
    topSpecialties: d.topSpecialties,
    leads: countMap.get(d.country.toLowerCase()) ?? 0,
    published: d.published,
    featured: d.featured,
  }));
}

export async function getAdminBlogPosts() {
  const posts = await prisma.blogPost.findMany({ orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }] });

  return posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    authorName: p.authorName,
    readTime: p.readTime,
    published: p.published,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    updatedAt: p.updatedAt.toISOString(),
  }));
}

export async function getAdminTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    include: { treatment: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return testimonials.map((t) => ({
    id: t.id,
    patientName: t.patientName,
    patientCountry: t.patientCountry,
    treatment: t.treatment?.name ?? '—',
    quote: t.quote,
    rating: t.rating,
    videoUrl: t.videoUrl,
    featured: t.featured,
    published: t.published,
    createdAt: t.createdAt.toISOString(),
  }));
}

export async function getAdminReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, country: true } },
      hospital: { select: { name: true } },
      doctor: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews.map((r) => ({
    id: r.id,
    author: r.user.name,
    country: r.user.country ?? '—',
    subject: r.hospital?.name ?? r.doctor?.name ?? '—',
    subjectType: r.hospital ? 'Hospital' : r.doctor ? 'Doctor' : '—',
    rating: r.rating,
    title: r.title,
    body: r.body,
    treatment: r.treatment,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  }));
}

/**
 * Accepted quotations are the closest thing to a payment record — no payment
 * gateway is integrated, so this page reports billed value, not settled cash.
 */
export async function getAdminPayments() {
  const quotations = await prisma.quotation.findMany({
    where: { status: { in: ['ACCEPTED', 'SENT'] } },
    include: {
      lead: { select: { name: true, country: true } },
      hospital: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const rows = quotations.map((q) => ({
    id: q.id,
    patient: q.lead.name,
    country: q.lead.country,
    hospital: q.hospital.name,
    amount: q.totalAmount,
    currency: q.currency,
    status: q.status === 'ACCEPTED' ? 'CONFIRMED' : 'AWAITING_ACCEPTANCE',
    date: q.updatedAt.toISOString(),
  }));

  return {
    rows,
    totals: {
      confirmed: rows.filter((r) => r.status === 'CONFIRMED').reduce((s, r) => s + r.amount, 0),
      awaiting: rows.filter((r) => r.status === 'AWAITING_ACCEPTANCE').reduce((s, r) => s + r.amount, 0),
    },
  };
}

export async function getAdminEnquiries() {
  const enquiries = await prisma.enquiry.findMany({
    include: { treatment: { select: { name: true } }, lead: { select: { id: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return enquiries.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    country: e.country,
    treatment: e.treatment?.name ?? '—',
    message: e.message,
    status: e.status,
    source: e.source,
    converted: Boolean(e.lead),
    createdAt: e.createdAt.toISOString(),
  }));
}

/** Counts that let the CMS page show what exists without loading every row. */
export async function getAdminContentCounts() {
  const [treatments, hospitals, doctors, destinations, blogPosts, testimonials, faqs] = await Promise.all([
    prisma.treatment.count(),
    prisma.hospital.count(),
    prisma.doctor.count(),
    prisma.destination.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count(),
    prisma.treatmentFaq.count(),
  ]);

  return { treatments, hospitals, doctors, destinations, blogPosts, testimonials, faqs };
}

/**
 * Admin analytics: lead volume and won value by month for the last six months,
 * plus the strongest sources and destination countries.
 */
export async function getAdminAnalytics() {
  const since = new Date();
  since.setMonth(since.getMonth() - 5);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const leads = await prisma.lead.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, value: true, stage: true, source: true, country: true },
  });

  const months: Array<{ month: string; leads: number; value: number }> = [];
  for (let i = 0; i < 6; i += 1) {
    const date = new Date(since.getFullYear(), since.getMonth() + i, 1);
    const label = date.toLocaleString('en', { month: 'short', year: '2-digit' });
    const inMonth = leads.filter(
      (l) => l.createdAt.getFullYear() === date.getFullYear() && l.createdAt.getMonth() === date.getMonth()
    );
    months.push({
      month: label,
      leads: inMonth.length,
      value: inMonth.reduce((sum, l) => sum + (l.value ?? 0), 0),
    });
  }

  function topBy(key: 'source' | 'country') {
    const counts = new Map<string, number>();
    for (const lead of leads) {
      const raw = lead[key];
      const value = raw && raw.length > 0 ? raw : 'Unknown';
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  return { months, topSources: topBy('source'), topCountries: topBy('country') };
}

// ─── PATIENT DASHBOARD ────────────────────────────────────────────────────────

export async function getPatientOverview(session: PortalSession) {
  const [patientCase, appointments, reports, unreadMessages] = await Promise.all([
    prisma.patientCase.findUnique({
      where: { userId: session.userId },
      include: {
        treatment: { select: { name: true, slug: true } },
        hospital: { select: { name: true, city: true, slug: true } },
        doctor: { select: { name: true, specialty: true, slug: true, photoUrl: true } },
        caseManager: { select: { name: true, phone: true, whatsapp: true, photoUrl: true, languages: true } },
      },
    }),
    prisma.appointment.findMany({
      where: { userId: session.userId, scheduledAt: { gte: new Date() } },
      include: { doctor: { select: { name: true, specialty: true } } },
      orderBy: { scheduledAt: 'asc' },
      take: 5,
    }),
    prisma.report.count({ where: { userId: session.userId } }),
    prisma.message.count({
      where: { case: { userId: session.userId }, read: false, senderId: { not: session.userId } },
    }),
  ]);

  return {
    case: patientCase
      ? {
          id: patientCase.id,
          status: patientCase.status,
          notes: patientCase.notes,
          treatment: patientCase.treatment,
          hospital: patientCase.hospital,
          doctor: patientCase.doctor,
          caseManager: patientCase.caseManager,
        }
      : null,
    appointments: appointments.map((a) => ({
      id: a.id,
      doctor: a.doctor?.name ?? 'To be assigned',
      specialty: a.doctor?.specialty ?? '—',
      type: a.type,
      status: a.status,
      scheduledAt: a.scheduledAt.toISOString(),
      meetLink: a.meetLink,
    })),
    reportCount: reports,
    unreadMessages,
  };
}

export async function getPatientAppointments(session: PortalSession) {
  const appointments = await prisma.appointment.findMany({
    where: { userId: session.userId },
    include: { doctor: { select: { name: true, specialty: true, photoUrl: true } } },
    orderBy: { scheduledAt: 'desc' },
  });

  return appointments.map((a) => ({
    id: a.id,
    doctor: a.doctor?.name ?? 'To be assigned',
    specialty: a.doctor?.specialty ?? '—',
    photoUrl: a.doctor?.photoUrl ?? null,
    type: a.type,
    status: a.status,
    scheduledAt: a.scheduledAt.toISOString(),
    duration: a.duration,
    meetLink: a.meetLink,
    notes: a.notes,
  }));
}

export async function getPatientMessages(session: PortalSession) {
  const patientCase = await prisma.patientCase.findUnique({
    where: { userId: session.userId },
    select: { id: true, caseManager: { select: { name: true, photoUrl: true } } },
  });
  if (!patientCase) return { caseId: null, caseManager: null, messages: [] };

  const messages = await prisma.message.findMany({
    where: { caseId: patientCase.id },
    include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  });

  return {
    caseId: patientCase.id,
    caseManager: patientCase.caseManager,
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      senderName: m.sender.name,
      senderAvatar: m.sender.avatarUrl,
      isMine: m.sender.id === session.userId,
      read: m.read,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}
