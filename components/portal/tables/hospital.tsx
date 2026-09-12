'use client';

import { DataTable, type Column } from '@/components/portal/DataTable';
import { Pill, formatDate, formatDateTime, formatMoney } from '@/components/portal/PortalPage';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS, APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';
import { APPOINTMENT_STATUS_OPTIONS, LEAD_STAGE_ORDER } from './shared';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  designation: string;
  experience: number;
  patients: number;
  rating: number;
  published: boolean;
};

const doctorColumns: Array<Column<Doctor>> = [
  {
    key: 'doctor',
    header: 'Doctor',
    render: (d) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{d.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{d.designation}</p>
      </>
    ),
  },
  { key: 'specialty', header: 'Specialty', render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.specialty}</span> },
  {
    key: 'experience',
    header: 'Experience',
    hideOnMobile: true,
    render: (d) => <span className="text-slate-500 dark:text-slate-400">{d.experience} yrs</span>,
  },
  {
    key: 'patients',
    header: 'Cases',
    align: 'right',
    render: (d) => <span className="font-medium text-slate-900 dark:text-white">{d.patients}</span>,
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    hideOnMobile: true,
    render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.rating > 0 ? d.rating.toFixed(1) : '—'}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (d) => (
      <Pill className={d.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
        {d.published ? 'Published' : 'Hidden'}
      </Pill>
    ),
  },
];

export function HospitalDoctorsTable({ rows, specialties }: { rows: Doctor[]; specialties: string[] }) {
  return (
    <DataTable
      rows={rows}
      columns={doctorColumns}
      searchIn={(d) => `${d.name} ${d.specialty} ${d.designation}`}
      searchPlaceholder="Search by name or specialty…"
      filter={{
        label: 'All specialties',
        options: specialties.map((s) => ({ value: s, label: s })),
        matches: (d, value) => d.specialty === value,
      }}
      emptyTitle="No doctors linked yet"
      emptyDescription="Doctors appear here once an administrator links them to your hospital."
    />
  );
}

type Lead = {
  id: string;
  name: string;
  country: string;
  email: string;
  treatment: string;
  stage: string;
  value: number | null;
  currency: string;
  assignee: string;
  createdAt: string;
};

const leadColumns: Array<Column<Lead>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (l) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{l.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{l.country}</p>
      </>
    ),
  },
  { key: 'treatment', header: 'Treatment', render: (l) => <span className="text-slate-600 dark:text-slate-300">{l.treatment}</span> },
  {
    key: 'stage',
    header: 'Stage',
    render: (l) => (
      <Pill className={LEAD_STAGE_COLORS[l.stage] ?? 'bg-slate-100 text-slate-700'}>
        {LEAD_STAGE_LABELS[l.stage] ?? l.stage}
      </Pill>
    ),
  },
  {
    key: 'assignee',
    header: 'Case manager',
    hideOnMobile: true,
    render: (l) => <span className="text-slate-500 dark:text-slate-400">{l.assignee}</span>,
  },
  {
    key: 'created',
    header: 'Created',
    hideOnMobile: true,
    render: (l) => <span className="text-slate-500 dark:text-slate-400">{formatDate(l.createdAt)}</span>,
  },
  {
    key: 'value',
    header: 'Value',
    align: 'right',
    render: (l) => <span className="font-medium text-slate-900 dark:text-white">{formatMoney(l.value, l.currency)}</span>,
  },
];

export function HospitalLeadsTable({ rows }: { rows: Lead[] }) {
  return (
    <DataTable
      rows={rows}
      columns={leadColumns}
      searchIn={(l) => `${l.name} ${l.country} ${l.treatment} ${l.email}`}
      searchPlaceholder="Search by patient, country or treatment…"
      filter={{
        label: 'All stages',
        options: LEAD_STAGE_ORDER.map((s) => ({ value: s, label: LEAD_STAGE_LABELS[s] ?? s })),
        matches: (l, value) => l.stage === value,
      }}
      emptyTitle="No leads matched yet"
      emptyDescription="Case managers match patient enquiries to your hospital — those leads appear here."
    />
  );
}

type Appointment = {
  id: string;
  patient: string;
  country: string;
  doctor: string;
  specialty: string;
  type: string;
  status: string;
  scheduledAt: string;
};

const appointmentColumns: Array<Column<Appointment>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (a) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{a.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{a.country}</p>
      </>
    ),
  },
  {
    key: 'doctor',
    header: 'Doctor',
    render: (a) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{a.doctor}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{a.specialty}</p>
      </>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    hideOnMobile: true,
    render: (a) => <span className="text-slate-600 dark:text-slate-300">{a.type === 'VIDEO' ? 'Video' : 'In-person'}</span>,
  },
  {
    key: 'scheduled',
    header: 'Scheduled',
    render: (a) => <span className="text-slate-500 dark:text-slate-400">{formatDateTime(a.scheduledAt)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (a) => (
      <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>
    ),
  },
];

export function HospitalAppointmentsTable({ rows }: { rows: Appointment[] }) {
  return (
    <DataTable
      rows={rows}
      columns={appointmentColumns}
      searchIn={(a) => `${a.patient} ${a.country} ${a.doctor} ${a.specialty}`}
      searchPlaceholder="Search by patient or doctor…"
      filter={{
        label: 'All statuses',
        options: APPOINTMENT_STATUS_OPTIONS,
        matches: (a, value) => a.status === value,
      }}
      emptyTitle="No appointments booked"
      emptyDescription="Consultations booked with your doctors appear here."
    />
  );
}
