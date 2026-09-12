import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, StatGrid, Panel, PanelEmpty, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminAnalytics, getAdminStats } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Analytics | Admin Portal' };
export const dynamic = 'force-dynamic';

function Bar({ label, value, max, display }: { label: string; value: number; max: number; display?: string }) {
  const width = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between gap-4 text-sm">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-medium text-slate-900 dark:text-white">{display ?? value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  await getPortalSession(['ADMIN']);

  const [analytics, stats] = await Promise.all([getAdminAnalytics(), getAdminStats()]);

  const maxLeads = Math.max(1, ...analytics.months.map((m) => m.leads));
  const maxValue = Math.max(1, ...analytics.months.map((m) => m.value));
  const maxSource = Math.max(1, ...analytics.topSources.map((s) => s.count));
  const maxCountry = Math.max(1, ...analytics.topCountries.map((c) => c.count));

  const sixMonthLeads = analytics.months.reduce((sum, m) => sum + m.leads, 0);
  const sixMonthValue = analytics.months.reduce((sum, m) => sum + m.value, 0);

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Analytics" description="Lead volume and value over the last six months." />

        <StatGrid
          stats={[
            { label: 'Leads (6 months)', value: sixMonthLeads, emoji: '🎯' },
            { label: 'Pipeline (6 months)', value: formatMoney(sixMonthValue), emoji: '💰' },
            { label: 'Conversion Rate', value: `${stats.conversionRate}%`, emoji: '📈' },
            { label: 'Active Leads', value: stats.activeLeads, emoji: '🔥' },
          ]}
        />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Panel title="Leads per month">
            {sixMonthLeads === 0 ? (
              <PanelEmpty>No leads created in the last six months.</PanelEmpty>
            ) : (
              <div className="space-y-3">
                {analytics.months.map((m) => (
                  <Bar key={m.month} label={m.month} value={m.leads} max={maxLeads} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Pipeline value per month">
            {sixMonthValue === 0 ? (
              <PanelEmpty>No lead values recorded in the last six months.</PanelEmpty>
            ) : (
              <div className="space-y-3">
                {analytics.months.map((m) => (
                  <Bar key={m.month} label={m.month} value={m.value} max={maxValue} display={formatMoney(m.value)} />
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Top lead sources">
            {analytics.topSources.length === 0 ? (
              <PanelEmpty>No source data recorded.</PanelEmpty>
            ) : (
              <div className="space-y-3">
                {analytics.topSources.map((s) => (
                  <Bar key={s.label} label={s.label} value={s.count} max={maxSource} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Top patient countries">
            {analytics.topCountries.length === 0 ? (
              <PanelEmpty>No country data recorded.</PanelEmpty>
            ) : (
              <div className="space-y-3">
                {analytics.topCountries.map((c) => (
                  <Bar key={c.label} label={c.label} value={c.count} max={maxCountry} />
                ))}
              </div>
            )}
          </Panel>
        </div>
      </PortalPage>
    </AdminLayout>
  );
}
