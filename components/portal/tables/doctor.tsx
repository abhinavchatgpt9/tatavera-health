'use client';

import { DataTable, type Column } from '@/components/portal/DataTable';
import { Pill, formatDate, formatDateTime } from '@/components/portal/PortalPage';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS, APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';
import {
  REPORT_CATEGORY_LABELS,
  REPORT_CATEGORY_COLORS,
  formatFileSize,
  APPOINTMENT_STATUS_OPTIONS,
} from './shared';

/**
 * Table definitions live in client modules because column `render`, `searchIn`
 * and `filter.matches` are functions — React cannot serialise a function across
 * the Server Component boundary. Server pages fetch rows and pass only data.
 */

type Patient = {
  id: string;
  name: string;
  country: string;
  treatment: string;
  stage: string;
  lastVisit: string | null;
};

const CASE_STAGES = ['CONSULTATION_SCHEDULED', 'TREATMENT', 'RECOVERY', 'FOLLOW_UP', 'COMPLETED'];

const patientColumns: Array<Column<Patient>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (p) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{p.country}</p>
      </>
    ),
  },
  { key: 'treatment', header: 'Treatment', render: (p) => <span className="text-slate-600 dark:text-slate-300">{p.treatment}</span> },
  {
    key: 'stage',
    header: 'Stage',
    render: (p) => (
      <Pill className={CASE_STATUS_COLORS[p.stage] ?? 'bg-slate-100 text-slate-700'}>
        {CASE_STATUS_LABELS[p.stage] ?? p.stage}
      </Pill>
    ),
  },
  {
    key: 'lastVisit',
    header: 'Last Visit',
    align: 'right',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{formatDate(p.lastVisit)}</span>,
  },
];

export function DoctorPatientsTable({ rows }: { rows: Patient[] }) {
  return (
    <DataTable
      rows={rows}
      columns={patientColumns}
      searchIn={(p) => `${p.name} ${p.country} ${p.treatment}`}
      searchPlaceholder="Search by name, country or treatment…"
      filter={{
        label: 'All stages',
        options: CASE_STAGES.map((s) => ({ value: s, label: CASE_STATUS_LABELS[s] ?? s })),
        matches: (p, value) => p.stage === value,
      }}
      emptyTitle="No patients assigned yet"
      emptyDescription="Patients appear here once a case manager assigns a case to you."
    />
  );
}

type Appointment = {
  id: string;
  patient: string;
  country: string;
  type: string;
  status: string;
  scheduledAt: string;
  duration: number;
  meetLink: string | null;
  notes: string | null;
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
    key: 'type',
    header: 'Type',
    render: (a) => <span className="text-slate-600 dark:text-slate-300">{a.type === 'VIDEO' ? 'Video' : 'In-person'}</span>,
  },
  {
    key: 'scheduled',
    header: 'Scheduled',
    render: (a) => (
      <>
        <span className="text-slate-600 dark:text-slate-300">{formatDateTime(a.scheduledAt)}</span>
        <p className="text-xs text-slate-400 dark:text-slate-500">{a.duration} min</p>
      </>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (a) => (
      <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>
    ),
  },
  {
    key: 'link',
    header: '',
    align: 'right',
    hideOnMobile: true,
    render: (a) =>
      a.meetLink ? (
        <a
          href={a.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          Join call
        </a>
      ) : (
        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
      ),
  },
];

export function DoctorAppointmentsTable({ rows }: { rows: Appointment[] }) {
  return (
    <DataTable
      rows={rows}
      columns={appointmentColumns}
      searchIn={(a) => `${a.patient} ${a.country}`}
      searchPlaceholder="Search by patient name…"
      filter={{
        label: 'All statuses',
        options: APPOINTMENT_STATUS_OPTIONS,
        matches: (a, value) => a.status === value,
      }}
      emptyTitle="No appointments booked"
      emptyDescription="Appointments appear here once patients book a consultation with you."
    />
  );
}

type Report = {
  id: string;
  patient: string;
  country: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  category: string;
  createdAt: string;
};

const reportColumns: Array<Column<Report>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (r) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{r.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.country}</p>
      </>
    ),
  },
  {
    key: 'file',
    header: 'File',
    render: (r) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{r.fileName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{formatFileSize(r.fileSize)}</p>
      </>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    render: (r) => (
      <Pill className={REPORT_CATEGORY_COLORS[r.category] ?? 'bg-slate-100 text-slate-700'}>
        {REPORT_CATEGORY_LABELS[r.category] ?? r.category}
      </Pill>
    ),
  },
  {
    key: 'uploaded',
    header: 'Uploaded',
    hideOnMobile: true,
    render: (r) => <span className="text-slate-500 dark:text-slate-400">{formatDate(r.createdAt)}</span>,
  },
  {
    key: 'open',
    header: '',
    align: 'right',
    render: (r) => (
      <a
        href={r.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
      >
        Open
      </a>
    ),
  },
];

export function DoctorReportsTable({ rows }: { rows: Report[] }) {
  return (
    <DataTable
      rows={rows}
      columns={reportColumns}
      searchIn={(r) => `${r.patient} ${r.country} ${r.fileName}`}
      searchPlaceholder="Search by patient or file name…"
      filter={{
        label: 'All categories',
        options: Object.entries(REPORT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
        matches: (r, value) => r.category === value,
      }}
      emptyTitle="No reports uploaded yet"
      emptyDescription="When your patients upload scans, blood work or prescriptions, they appear here for review."
    />
  );
}
