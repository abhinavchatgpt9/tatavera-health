import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Panel, PanelEmpty, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminCrmFunnel, getAdminLeads } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'CRM | Admin Portal' };
export const dynamic = 'force-dynamic';

type Lead = Awaited<ReturnType<typeof getAdminLeads>>[number];

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
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {l.country} · {l.email}
        </p>
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
    key: 'owner',
    header: 'Owner',
    hideOnMobile: true,
    render: (l) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{l.assignee}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{l.hospital}</p>
      </>
    ),
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

export default async function AdminCrmPage() {
  await getPortalSession(['ADMIN']);

  const [funnel, leads] = await Promise.all([getAdminCrmFunnel(), getAdminLeads()]);

  const top = funnel[0]?.count ?? 0;
  const pipelineValue = leads.reduce((sum, l) => sum + (l.value ?? 0), 0);

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="CRM"
          description={`${leads.length} leads · ${formatMoney(pipelineValue)} total pipeline value`}
        />

        <div className="mb-6">
          <Panel title="Conversion funnel">
            {top === 0 ? (
              <PanelEmpty>No leads yet — the funnel fills as enquiries convert.</PanelEmpty>
            ) : (
              <>
                <div className="space-y-2.5">
                  {funnel.map((row) => {
                    const width = Math.round((row.count / top) * 100);
                    return (
                      <div key={row.stage}>
                        <div className="mb-1 flex justify-between gap-4 text-sm">
                          <span className="text-slate-600 dark:text-slate-300">{row.stage}</span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {row.count}
                            <span className="ml-2 text-xs font-normal text-slate-400 dark:text-slate-500">{width}%</span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                  Counts are cumulative — a lead at a later stage counts toward every stage it has already passed.
                </p>
              </>
            )}
          </Panel>
        </div>

        <DataTable
          rows={leads}
          columns={columns}
          searchIn={(l) => `${l.name} ${l.email} ${l.country} ${l.treatment} ${l.assignee}`}
          searchPlaceholder="Search leads by patient, country, treatment or owner…"
          filter={{
            label: 'All stages',
            options: STAGE_ORDER.map((s) => ({ value: s, label: LEAD_STAGE_LABELS[s] ?? s })),
            matches: (l, value) => l.stage === value,
          }}
          emptyTitle="No leads yet"
          emptyDescription="Enquiries from the public site become leads once a case manager converts them."
        />
      </PortalPage>
    </AdminLayout>
  );
}
