import type { Metadata } from 'next';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, StatGrid, Panel, PanelEmpty, Pill, formatMoney, formatDateTime } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminStats, getAdminLeads, getAdminAuditLogs } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Admin Dashboard | Tatvavera Health' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await getPortalSession(['ADMIN']);

  const [stats, leads, auditLogs] = await Promise.all([
    getAdminStats(),
    getAdminLeads(),
    getAdminAuditLogs(8),
  ]);

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Platform Overview" description="Everything happening across Tatvavera Health." />

        <StatGrid
          stats={[
            { label: 'Total Users', value: stats.totalUsers, emoji: '👥', hint: `${stats.totalPatients} patients` },
            { label: 'Active Leads', value: stats.activeLeads, emoji: '🎯', hint: `${stats.totalLeads} all time` },
            { label: 'Conversion Rate', value: `${stats.conversionRate}%`, emoji: '📈', hint: 'Leads reaching treatment' },
            { label: 'Revenue This Month', value: formatMoney(stats.revenueThisMonth), emoji: '💰', hint: 'Accepted quotations' },
          ]}
        />

        <StatGrid
          stats={[
            { label: 'Hospitals', value: stats.totalHospitals, emoji: '🏥' },
            { label: 'Doctors', value: stats.totalDoctors, emoji: '🩺' },
            { label: 'Pending Quotations', value: stats.pendingQuotations, emoji: '📋' },
            { label: 'Patients', value: stats.totalPatients, emoji: '🧑‍🤝‍🧑' },
          ]}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Panel
            title="Recent leads"
            actions={
              <Link href="/admin-portal/crm" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Open CRM
              </Link>
            }
          >
            {leads.length === 0 ? (
              <PanelEmpty>No leads in the system yet.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {leads.slice(0, 6).map((lead) => (
                  <li key={lead.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{lead.name}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {lead.country} · {lead.assignee}
                      </p>
                    </div>
                    <Pill className={LEAD_STAGE_COLORS[lead.stage] ?? 'bg-slate-100 text-slate-700'}>
                      {LEAD_STAGE_LABELS[lead.stage] ?? lead.stage}
                    </Pill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recent activity"
            actions={
              <Link href="/admin-portal/audit-logs" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View log
              </Link>
            }
          >
            {auditLogs.length === 0 ? (
              <PanelEmpty>
                No activity recorded yet. Entries appear here as staff create and change records.
              </PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {auditLogs.map((log) => (
                  <li key={log.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800">
                    <p className="text-sm text-slate-700 dark:text-slate-200">{log.action}</p>
                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                      {log.user} · {formatDateTime(log.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </PortalPage>
    </AdminLayout>
  );
}
