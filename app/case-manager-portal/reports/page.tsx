import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerReports } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Reports | Case Manager Portal' };
export const dynamic = 'force-dynamic';

type Report = Awaited<ReturnType<typeof getCaseManagerReports>>[number];

const CATEGORY_LABELS: Record<string, string> = {
  BLOOD_REPORTS: 'Blood reports',
  IMAGING: 'Imaging',
  PRESCRIPTIONS: 'Prescriptions',
  OTHER: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  BLOOD_REPORTS: 'bg-rose-100 text-rose-700',
  IMAGING: 'bg-purple-100 text-purple-700',
  PRESCRIPTIONS: 'bg-blue-100 text-blue-700',
  OTHER: 'bg-slate-100 text-slate-700',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const columns: Array<Column<Report>> = [
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
      <Pill className={CATEGORY_COLORS[r.category] ?? 'bg-slate-100 text-slate-700'}>
        {CATEGORY_LABELS[r.category] ?? r.category}
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

export default async function CaseManagerReportsPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const reports = await getCaseManagerReports(session);

  const patientCount = new Set(reports.map((r) => r.patient)).size;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Reports"
          description={`${reports.length} ${reports.length === 1 ? 'file' : 'files'} from ${patientCount} ${patientCount === 1 ? 'patient' : 'patients'}`}
        />

        <DataTable
          rows={reports}
          columns={columns}
          searchIn={(r) => `${r.patient} ${r.country} ${r.fileName}`}
          searchPlaceholder="Search by patient or file name…"
          filter={{
            label: 'All categories',
            options: Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
            matches: (r, value) => r.category === value,
          }}
          emptyTitle="No reports uploaded yet"
          emptyDescription="Medical files uploaded by patients on your cases appear here, ready to forward to a hospital."
        />
      </PortalPage>
    </CaseManagerLayout>
  );
}
