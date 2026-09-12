// Mock data for Doctor / Hospital / Case Manager / Admin portals.
// Replace with live Prisma queries as each API route is wired up — see API_MAP.md.

export const MOCK_DOCTOR = {
  id: 'doc_mock_1',
  name: 'Dr. Rajesh Nair',
  specialty: 'Cardiology',
  designation: 'Senior Consultant Cardiologist',
  hospital: 'Fortis Escorts Heart Institute',
  photoUrl: null,
  rating: 4.8,
  reviewCount: 214,
};

export const MOCK_DOCTOR_PATIENTS = [
  { id: 'p1', name: 'Amara Okafor', country: 'Nigeria', treatment: 'Bypass Surgery', stage: 'CONSULTATION_SCHEDULED', lastVisit: '2026-07-08' },
  { id: 'p2', name: 'Ivan Petrov', country: 'Kazakhstan', treatment: 'Angioplasty', stage: 'TREATMENT', lastVisit: '2026-07-10' },
  { id: 'p3', name: 'Fatima Al-Sayed', country: 'UAE', treatment: 'Valve Replacement', stage: 'RECOVERY', lastVisit: '2026-07-05' },
  { id: 'p4', name: 'John Mensah', country: 'Ghana', treatment: 'Pacemaker Implant', stage: 'FOLLOW_UP', lastVisit: '2026-06-28' },
];

export const MOCK_DOCTOR_APPOINTMENTS = [
  { id: 'a1', patient: 'Amara Okafor', type: 'VIDEO', status: 'CONFIRMED', scheduledAt: '2026-07-13T10:00:00Z' },
  { id: 'a2', patient: 'Ivan Petrov', type: 'IN_PERSON', status: 'SCHEDULED', scheduledAt: '2026-07-13T14:30:00Z' },
  { id: 'a3', patient: 'New Enquiry — Grace Mwangi', type: 'VIDEO', status: 'SCHEDULED', scheduledAt: '2026-07-14T09:00:00Z' },
];

export const MOCK_DOCTOR_OPINIONS = [
  { id: 'o1', patient: 'Fatima Al-Sayed', summary: 'Moderate aortic stenosis, valve replacement recommended.', createdAt: '2026-07-01' },
  { id: 'o2', patient: 'John Mensah', summary: 'Post-op recovery on track, continue beta blockers.', createdAt: '2026-06-20' },
];

export const MOCK_DOCTOR_AVAILABILITY = [
  { day: 'Monday', slots: '09:00 - 13:00, 15:00 - 18:00' },
  { day: 'Tuesday', slots: '09:00 - 13:00' },
  { day: 'Wednesday', slots: '09:00 - 13:00, 15:00 - 18:00' },
  { day: 'Thursday', slots: 'Unavailable' },
  { day: 'Friday', slots: '09:00 - 13:00' },
  { day: 'Saturday', slots: '10:00 - 14:00' },
  { day: 'Sunday', slots: 'Unavailable' },
];

// ── Hospital Portal ──────────────────────────────────────────────

export const MOCK_HOSPITAL = {
  id: 'hosp_mock_1',
  name: 'Fortis Escorts Heart Institute',
  city: 'New Delhi',
  country: 'India',
  rating: 4.7,
  bedsCount: 310,
  accreditations: ['JCI', 'NABH'],
};

export const MOCK_HOSPITAL_DOCTORS = [
  { id: 'd1', name: 'Dr. Rajesh Nair', specialty: 'Cardiology', patients: 42, rating: 4.8 },
  { id: 'd2', name: 'Dr. Meera Iyer', specialty: 'Cardiac Surgery', patients: 31, rating: 4.9 },
  { id: 'd3', name: 'Dr. Arjun Kapoor', specialty: 'Electrophysiology', patients: 18, rating: 4.6 },
];

export const MOCK_HOSPITAL_DEPARTMENTS = [
  { id: 'dep1', name: 'Cardiology', headDoctor: 'Dr. Rajesh Nair', doctorCount: 8 },
  { id: 'dep2', name: 'Cardiac Surgery', headDoctor: 'Dr. Meera Iyer', doctorCount: 5 },
  { id: 'dep3', name: 'Critical Care', headDoctor: 'Dr. Sunil Batra', doctorCount: 6 },
];

export const MOCK_HOSPITAL_LEADS = [
  { id: 'l1', name: 'Amara Okafor', country: 'Nigeria', treatment: 'Bypass Surgery', stage: 'HOSPITAL_MATCHED', value: 12000 },
  { id: 'l2', name: 'Ivan Petrov', country: 'Kazakhstan', treatment: 'Angioplasty', stage: 'QUOTATION_RECEIVED', value: 6500 },
  { id: 'l3', name: 'Grace Mwangi', country: 'Kenya', treatment: 'Valve Replacement', stage: 'LEAD_CONTACTED', value: 15000 },
];

export const MOCK_HOSPITAL_QUOTATIONS = [
  { id: 'q1', patient: 'Amara Okafor', status: 'SENT', totalAmount: 12000, currency: 'USD', validUntil: '2026-07-25' },
  { id: 'q2', patient: 'Ivan Petrov', status: 'DRAFT', totalAmount: 6500, currency: 'USD', validUntil: '2026-07-20' },
];

// ── Case Manager Portal ──────────────────────────────────────────

export const LEAD_STAGES = [
  'LEAD_CREATED', 'LEAD_ASSIGNED', 'LEAD_CONTACTED', 'REPORTS_UPLOADED',
  'HOSPITAL_MATCHED', 'QUOTATION_RECEIVED', 'VIDEO_CONSULTATION',
  'TREATMENT_CONFIRMED', 'VISA_PROCESSING', 'TRAVEL_ARRANGED',
  'TREATMENT_COMPLETED', 'FOLLOW_UP',
] as const;

export const MOCK_CM_LEADS = [
  { id: 'l1', name: 'Amara Okafor', country: 'Nigeria', treatment: 'Bypass Surgery', stage: 'HOSPITAL_MATCHED', assignedAt: '2026-07-01', value: 12000 },
  { id: 'l2', name: 'Ivan Petrov', country: 'Kazakhstan', treatment: 'Angioplasty', stage: 'QUOTATION_RECEIVED', assignedAt: '2026-07-03', value: 6500 },
  { id: 'l3', name: 'Grace Mwangi', country: 'Kenya', treatment: 'Valve Replacement', stage: 'LEAD_CONTACTED', assignedAt: '2026-07-09', value: 15000 },
  { id: 'l4', name: 'Fatima Al-Sayed', country: 'UAE', treatment: 'Valve Replacement', stage: 'TRAVEL_ARRANGED', assignedAt: '2026-06-15', value: 18000 },
  { id: 'l5', name: 'John Mensah', country: 'Ghana', treatment: 'Pacemaker Implant', stage: 'FOLLOW_UP', assignedAt: '2026-06-01', value: 9000 },
];

export const MOCK_CM_TASKS = [
  { id: 't1', lead: 'Amara Okafor', title: 'Follow up on hospital quotation', dueAt: '2026-07-13', priority: 'HIGH', status: 'PENDING' },
  { id: 't2', lead: 'Grace Mwangi', title: 'Send WhatsApp welcome message', dueAt: '2026-07-12', priority: 'URGENT', status: 'PENDING' },
  { id: 't3', lead: 'Ivan Petrov', title: 'Schedule video consultation', dueAt: '2026-07-14', priority: 'MEDIUM', status: 'IN_PROGRESS' },
  { id: 't4', lead: 'Fatima Al-Sayed', title: 'Confirm airport pickup', dueAt: '2026-07-16', priority: 'HIGH', status: 'PENDING' },
];

export const MOCK_CM_NOTES = [
  { id: 'n1', lead: 'Amara Okafor', author: 'Priya Sharma', body: 'Patient prefers morning consultations due to timezone.', createdAt: '2026-07-10' },
  { id: 'n2', lead: 'Ivan Petrov', author: 'Priya Sharma', body: 'Reports uploaded, cardiologist review pending.', createdAt: '2026-07-09' },
];

export const MOCK_VISA_STATUSES = [
  { lead: 'Fatima Al-Sayed', stage: 'APPROVED', country: 'India', updatedAt: '2026-07-05' },
  { lead: 'Amara Okafor', stage: 'DOCUMENTS_PENDING', country: 'India', updatedAt: '2026-07-11' },
  { lead: 'Ivan Petrov', stage: 'NOT_STARTED', country: 'India', updatedAt: '2026-07-09' },
];

export const MOCK_TRAVEL_STATUSES = [
  { lead: 'Fatima Al-Sayed', arrivalDate: '2026-07-20', departureDate: '2026-08-05', pickupArranged: true },
  { lead: 'John Mensah', arrivalDate: '2026-06-10', departureDate: '2026-06-25', pickupArranged: true },
];

// ── Admin Portal ──────────────────────────────────────────────────

export const MOCK_ADMIN_STATS = {
  totalUsers: 4821,
  totalPatients: 4102,
  totalDoctors: 312,
  totalHospitals: 58,
  totalLeads: 1204,
  activeLeads: 386,
  conversionRate: 18.4,
  revenueThisMonth: 482000,
  pendingQuotations: 24,
};

export const MOCK_ADMIN_USERS = [
  { id: 'u1', name: 'Priya Sharma', email: 'priya@tataverahealth.com', role: 'CASE_MANAGER', status: 'ACTIVE', createdAt: '2025-11-02' },
  { id: 'u2', name: 'Dr. Rajesh Nair', email: 'rajesh.nair@fortisheart.com', role: 'DOCTOR', status: 'ACTIVE', createdAt: '2025-09-15' },
  { id: 'u3', name: 'Fortis Escorts Admin', email: 'admin@fortisheart.com', role: 'HOSPITAL_ADMIN', status: 'ACTIVE', createdAt: '2025-08-20' },
  { id: 'u4', name: 'Amara Okafor', email: 'amara.okafor@gmail.com', role: 'PATIENT', status: 'ACTIVE', createdAt: '2026-07-01' },
];

export const MOCK_AUDIT_LOGS = [
  { id: 'al1', user: 'Priya Sharma', action: 'Updated lead stage: Amara Okafor → HOSPITAL_MATCHED', createdAt: '2026-07-11T14:22:00Z' },
  { id: 'al2', user: 'System', action: 'New enquiry submitted by Grace Mwangi', createdAt: '2026-07-09T08:03:00Z' },
  { id: 'al3', user: 'Fortis Escorts Admin', action: 'Sent quotation Q-1042 to Ivan Petrov', createdAt: '2026-07-08T11:47:00Z' },
];

export const MOCK_CRM_FUNNEL = [
  { stage: 'Lead Created', count: 1204 },
  { stage: 'Lead Assigned', count: 1180 },
  { stage: 'Lead Contacted', count: 980 },
  { stage: 'Reports Uploaded', count: 640 },
  { stage: 'Hospital Matched', count: 520 },
  { stage: 'Quotation Received', count: 410 },
  { stage: 'Video Consultation', count: 340 },
  { stage: 'Treatment Confirmed', count: 260 },
  { stage: 'Visa Processing', count: 230 },
  { stage: 'Travel Arranged', count: 210 },
  { stage: 'Treatment Completed', count: 198 },
  { stage: 'Follow Up', count: 186 },
];
