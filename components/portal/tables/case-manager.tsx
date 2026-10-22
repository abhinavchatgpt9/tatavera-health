'use client';

import { DataTable, type Column } from '@/components/portal/DataTable';
import { Pill, formatDate, formatMoney } from '@/components/portal/PortalPage';
import { PRIORITY_COLORS, TASK_STATUS_COLORS, VISA_STAGE_COLORS, QUOTATION_STATUS_COLORS } from '@/lib/lead-stage';
import {
  REPORT_CATEGORY_LABELS,
  REPORT_CATEGORY_COLORS,
  formatFileSize,
  QUOTATION_STATUS_OPTIONS,
} from './shared';

// ─── TASKS ────────────────────────────────────────────────────────────────────

type Task = {
  id: string;
  lead: string;
  title: string;
  dueAt: string | null;
  priority: string;
  status: string;
  assignee: string;
};

const taskColumns: Array<Column<Task>> = [
  {
    key: 'task',
    header: 'Task',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{t.lead}</p>
      </>
    ),
  },
  {
    key: 'due',
    header: 'Due',
    render: (t) => {
      const overdue = t.dueAt !== null && t.status !== 'DONE' && new Date(t.dueAt) < new Date();
      return (
        <span className={overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}>
          {formatDate(t.dueAt)}
          {overdue && ' · overdue'}
        </span>
      );
    },
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (t) => <Pill className={PRIORITY_COLORS[t.priority] ?? 'bg-slate-100 text-slate-700'}>{t.priority}</Pill>,
  },
  {
    key: 'assignee',
    header: 'Assignee',
    hideOnMobile: true,
    render: (t) => <span className="text-slate-500 dark:text-slate-400">{t.assignee}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (t) => (
      <Pill className={TASK_STATUS_COLORS[t.status] ?? 'bg-slate-100 text-slate-700'}>
        {t.status.replace(/_/g, ' ')}
      </Pill>
    ),
  },
];

export function CaseManagerTasksTable({ rows }: { rows: Task[] }) {
  return (
    <DataTable
      rows={rows}
      columns={taskColumns}
      searchIn={(t) => `${t.title} ${t.lead} ${t.assignee}`}
      searchPlaceholder="Search by task or patient…"
      filter={{
        label: 'All statuses',
        options: [
          { value: 'PENDING', label: 'Pending' },
          { value: 'IN_PROGRESS', label: 'In progress' },
          { value: 'DONE', label: 'Done' },
        ],
        matches: (t, value) => t.status === value,
      }}
      emptyTitle="No tasks yet"
      emptyDescription="Tasks you create against a lead show up here so nothing slips."
    />
  );
}

// ─── VISA ─────────────────────────────────────────────────────────────────────

type VisaRow = {
  id: string;
  lead: string;
  patientCountry: string;
  stage: string;
  country: string | null;
  documents: string[];
  updatedAt: string;
};

const VISA_STAGES = [
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'DOCUMENTS_PENDING', label: 'Documents pending' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview scheduled' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const VISA_LABELS = Object.fromEntries(VISA_STAGES.map((s) => [s.value, s.label]));

const visaColumns: Array<Column<VisaRow>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (v) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{v.lead}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">from {v.patientCountry}</p>
      </>
    ),
  },
  { key: 'destination', header: 'Destination', render: (v) => <span className="text-slate-600 dark:text-slate-300">{v.country ?? '—'}</span> },
  {
    key: 'stage',
    header: 'Stage',
    render: (v) => (
      <Pill className={VISA_STAGE_COLORS[v.stage] ?? 'bg-slate-100 text-slate-700'}>
        {VISA_LABELS[v.stage] ?? v.stage}
      </Pill>
    ),
  },
  {
    key: 'documents',
    header: 'Documents',
    hideOnMobile: true,
    render: (v) =>
      v.documents.length === 0 ? (
        <span className="text-slate-400 dark:text-slate-500">None uploaded</span>
      ) : (
        <span className="text-slate-600 dark:text-slate-300">
          {v.documents.length} on file
          <span className="block text-xs text-slate-400 dark:text-slate-500">{v.documents.join(', ')}</span>
        </span>
      ),
  },
  {
    key: 'updated',
    header: 'Updated',
    align: 'right',
    render: (v) => <span className="text-slate-500 dark:text-slate-400">{formatDate(v.updatedAt)}</span>,
  },
];

export function CaseManagerVisaTable({ rows }: { rows: VisaRow[] }) {
  return (
    <DataTable
      rows={rows}
      columns={visaColumns}
      searchIn={(v) => `${v.lead} ${v.patientCountry} ${v.country ?? ''}`}
      searchPlaceholder="Search by patient or country…"
      filter={{ label: 'All stages', options: VISA_STAGES, matches: (v, value) => v.stage === value }}
      emptyTitle="No visa cases open"
      emptyDescription="A visa record is created once a lead reaches the visa processing stage."
    />
  );
}

// ─── TRAVEL ───────────────────────────────────────────────────────────────────

type TravelRow = {
  id: string;
  lead: string;
  patientCountry: string;
  arrivalDate: string | null;
  departureDate: string | null;
  accommodation: string | null;
  pickupArranged: boolean;
};

const travelColumns: Array<Column<TravelRow>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.lead}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">from {t.patientCountry}</p>
      </>
    ),
  },
  { key: 'arrival', header: 'Arrival', render: (t) => <span className="text-slate-600 dark:text-slate-300">{formatDate(t.arrivalDate)}</span> },
  { key: 'departure', header: 'Departure', render: (t) => <span className="text-slate-600 dark:text-slate-300">{formatDate(t.departureDate)}</span> },
  {
    key: 'accommodation',
    header: 'Accommodation',
    hideOnMobile: true,
    render: (t) => <span className="text-slate-500 dark:text-slate-400">{t.accommodation ?? 'Not booked'}</span>,
  },
  {
    key: 'pickup',
    header: 'Airport pickup',
    align: 'right',
    render: (t) => (
      <Pill className={t.pickupArranged ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {t.pickupArranged ? 'Arranged' : 'Pending'}
      </Pill>
    ),
  },
];

export function CaseManagerTravelTable({ rows }: { rows: TravelRow[] }) {
  return (
    <DataTable
      rows={rows}
      columns={travelColumns}
      searchIn={(t) => `${t.lead} ${t.patientCountry} ${t.accommodation ?? ''}`}
      searchPlaceholder="Search by patient or accommodation…"
      filter={{
        label: 'All pickups',
        options: [
          { value: 'ARRANGED', label: 'Pickup arranged' },
          { value: 'PENDING', label: 'Pickup pending' },
        ],
        matches: (t, value) => (value === 'ARRANGED' ? t.pickupArranged : !t.pickupArranged),
      }}
      emptyTitle="No travel arrangements yet"
      emptyDescription="A travel record is created once a lead reaches the travel arranged stage."
    />
  );
}

// ─── QUOTATIONS ───────────────────────────────────────────────────────────────

type Quotation = {
  id: string;
  patient: string;
  country: string;
  treatment: string;
  hospital: string;
  status: string;
  totalAmount: number;
  currency: string;
  validUntil: string | null;
  itemCount: number;
};

const quotationColumns: Array<Column<Quotation>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (q) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{q.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {q.country} · {q.treatment}
        </p>
      </>
    ),
  },
  { key: 'hospital', header: 'Hospital', render: (q) => <span className="text-slate-600 dark:text-slate-300">{q.hospital}</span> },
  {
    key: 'status',
    header: 'Status',
    render: (q) => <Pill className={QUOTATION_STATUS_COLORS[q.status] ?? 'bg-slate-100 text-slate-700'}>{q.status}</Pill>,
  },
  {
    key: 'valid',
    header: 'Valid until',
    hideOnMobile: true,
    render: (q) => <span className="text-slate-500 dark:text-slate-400">{formatDate(q.validUntil)}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (q) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{formatMoney(q.totalAmount, q.currency)}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {q.itemCount} {q.itemCount === 1 ? 'line' : 'lines'}
        </p>
      </>
    ),
  },
];

export function CaseManagerQuotationsTable({ rows }: { rows: Quotation[] }) {
  return (
    <DataTable
      rows={rows}
      columns={quotationColumns}
      searchIn={(q) => `${q.patient} ${q.country} ${q.hospital} ${q.treatment}`}
      searchPlaceholder="Search by patient or hospital…"
      filter={{
        label: 'All statuses',
        options: QUOTATION_STATUS_OPTIONS,
        matches: (q, value) => q.status === value,
      }}
      emptyTitle="No quotations yet"
      emptyDescription="Hospitals issue quotations against your leads — they appear here as soon as they do."
    />
  );
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────

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

export function CaseManagerReportsTable({ rows }: { rows: Report[] }) {
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
      emptyDescription="Medical files uploaded by patients on your cases appear here, ready to forward to a hospital."
    />
  );
}
