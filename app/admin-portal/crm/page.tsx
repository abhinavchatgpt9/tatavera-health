import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Panel, PanelEmpty, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminCrmFunnel, getAdminLeads } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';
import { AdminLeadsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'CRM | Admin Portal' };
export const dynamic = 'force-dynamic';

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

        <AdminLeadsTable rows={leads} />
      </PortalPage>
    </AdminLayout>
  );
}
