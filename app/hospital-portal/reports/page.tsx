import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, StatGrid, Panel, PanelEmpty, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalDashboardStats, getHospitalLeads, getHospitalQuotations } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Reports | Hospital Portal' };
export const dynamic = 'force-dynamic';

/** Horizontal bar, sized as a share of the largest row. */
function Bar({ label, value, max, suffix }: { label: string; value: number; max: number; suffix?: string }) {
  const width = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between gap-4 text-sm">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-medium text-slate-900 dark:text-white">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default async function HospitalReportsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);

  const [stats, leads, quotations] = await Promise.all([
    getHospitalDashboardStats(session),
    getHospitalLeads(session),
    getHospitalQuotations(session),
  ]);

  // Lead volume by stage.
  const byStage = new Map<string, number>();
  for (const lead of leads) byStage.set(lead.stage, (byStage.get(lead.stage) ?? 0) + 1);
  const stageRows = [...byStage.entries()]
    .map(([stage, count]) => ({ label: LEAD_STAGE_LABELS[stage] ?? stage, count }))
    .sort((a, b) => b.count - a.count);
  const maxStage = Math.max(1, ...stageRows.map((r) => r.count));

  // Lead volume by source country.
  const byCountry = new Map<string, number>();
  for (const lead of leads) byCountry.set(lead.country, (byCountry.get(lead.country) ?? 0) + 1);
  const countryRows = [...byCountry.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const maxCountry = Math.max(1, ...countryRows.map((r) => r.count));

  const accepted = quotations.filter((q) => q.status === 'ACCEPTED');
  const declined = quotations.filter((q) => q.status === 'DECLINED');
  const winRate =
    accepted.length + declined.length === 0
      ? 0
      : Math.round((accepted.length / (accepted.length + declined.length)) * 100);

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader title="Reports" description="How your hospital is performing on the platform." />

        <StatGrid
          stats={[
            { label: 'Total Leads', value: leads.length, emoji: '🎯' },
            { label: 'Quotations Issued', value: quotations.length, emoji: '📋' },
            { label: 'Quotation Win Rate', value: `${winRate}%`, emoji: '✅', hint: `${accepted.length} accepted, ${declined.length} declined` },
            { label: 'Confirmed Value', value: formatMoney(stats.quotedValue), emoji: '💰' },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Leads by stage">
            {stageRows.length === 0 ? (
              <PanelEmpty>No leads matched to your hospital yet.</PanelEmpty>
            ) : (
              <div className="space-y-3">
                {stageRows.map((row) => (
                  <Bar key={row.label} label={row.label} value={row.count} max={maxStage} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Top source countries">
            {countryRows.length === 0 ? (
              <PanelEmpty>No leads matched to your hospital yet.</PanelEmpty>
            ) : (
              <div className="space-y-3">
                {countryRows.map((row) => (
                  <Bar key={row.label} label={row.label} value={row.count} max={maxCountry} />
                ))}
              </div>
            )}
          </Panel>
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Confirmed value counts accepted quotations only. It is billed value, not settled payment — no payment gateway
          is connected yet.
        </p>
      </PortalPage>
    </HospitalLayout>
  );
}
