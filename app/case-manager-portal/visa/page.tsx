import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerVisaStatuses } from '@/lib/portal-data';
import { VISA_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Visa | Case Manager Portal' };
export const dynamic = 'force-dynamic';

type VisaRow = Awaited<ReturnType<typeof getCaseManagerVisaStatuses>>[number];

const VISA_STAGES = [
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'DOCUMENTS_PENDING', label: 'Documents pending' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview scheduled' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STAGE_LABELS = Object.fromEntries(VISA_STAGES.map((s) => [s.value, s.label]));

const columns: Array<Column<VisaRow>> = [
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
  {
    key: 'destination',
    header: 'Destination',
    render: (v) => <span className="text-slate-600 dark:text-slate-300">{v.country ?? '—'}</span>,
  },
  {
    key: 'stage',
    header: 'Stage',
    render: (v) => (
      <Pill className={VISA_STAGE_COLORS[v.stage] ?? 'bg-slate-100 text-slate-700'}>
        {STAGE_LABELS[v.stage] ?? v.stage}
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

export default async function CaseManagerVisaPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const rows = await getCaseManagerVisaStatuses(session);

  const approved = rows.filter((r) => r.stage === 'APPROVED').length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Visa"
          description={`${rows.length} visa ${rows.length === 1 ? 'case' : 'cases'} · ${approved} approved`}
        />

        <DataTable
          rows={rows}
          columns={columns}
          searchIn={(v) => `${v.lead} ${v.patientCountry} ${v.country ?? ''}`}
          searchPlaceholder="Search by patient or country…"
          filter={{
            label: 'All stages',
            options: VISA_STAGES,
            matches: (v, value) => v.stage === value,
          }}
          emptyTitle="No visa cases open"
          emptyDescription="A visa record is created once a lead reaches the visa processing stage."
        />
      </PortalPage>
    </CaseManagerLayout>
  );
}
