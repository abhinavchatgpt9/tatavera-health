import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalLeads } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Leads | Hospital Portal' };
export const dynamic = 'force-dynamic';

type Lead = Awaited<ReturnType<typeof getHospitalLeads>>[number];

const STAGE_ORDER = [
  'LEAD_CREATED', 'LEAD_ASSIGNED', 'LEAD_CONTACTED', 'REPORTS_UPLOADED',
  'HOSPITAL_MATCHED', 'QUOTATION_RECEIVED', 'VIDEO_CONSULTATION',
  'TREATMENT_CONFIRMED', 'VISA_PROCESSING', 'TRAVEL_ARRANGED',
  'TREATMENT_COMPLETED', 'FOLLOW_UP',
];

const columns: Array<Column<Lead>> = [
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

export default async function HospitalLeadsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const leads = await getHospitalLeads(session);

  const pipelineValue = leads.reduce((sum, l) => sum + (l.value ?? 0), 0);

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Leads"
          description={`${leads.length} matched to your hospital · ${formatMoney(pipelineValue)} total pipeline`}
        />

        <DataTable
          rows={leads}
          columns={columns}
          searchIn={(l) => `${l.name} ${l.country} ${l.treatment} ${l.email}`}
          searchPlaceholder="Search by patient, country or treatment…"
          filter={{
            label: 'All stages',
            options: STAGE_ORDER.map((s) => ({ value: s, label: LEAD_STAGE_LABELS[s] ?? s })),
            matches: (l, value) => l.stage === value,
          }}
          emptyTitle="No leads matched yet"
          emptyDescription="Case managers match patient enquiries to your hospital — those leads appear here."
        />
      </PortalPage>
    </HospitalLayout>
  );
}
