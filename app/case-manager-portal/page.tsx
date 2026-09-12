import type { Metadata } from 'next';
import Link from 'next/link';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, StatGrid, Panel, PanelEmpty, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import {
  getCaseManagerDashboardStats,
  getCaseManagerLeads,
  getCaseManagerFollowUps,
} from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS, PRIORITY_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Case Manager Dashboard | Tatavera Health' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerDashboard() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);

  const [stats, leads, followUps] = await Promise.all([
    getCaseManagerDashboardStats(session),
    getCaseManagerLeads(session),
    getCaseManagerFollowUps(session),
  ]);

  const firstName = session.name.split(' ')[0];

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Your pipeline and what needs attention today."
        />

        <StatGrid
          stats={[
            { label: 'Active Leads', value: stats.activeLeads, emoji: '🎯', hint: `${stats.totalLeads} total` },
            { label: 'Pipeline Value', value: formatMoney(stats.pipelineValue), emoji: '💰' },
            { label: 'Overdue Tasks', value: stats.overdueTasks, emoji: '⏰' },
            { label: 'Completed This Month', value: stats.wonThisMonth, emoji: '✅' },
          ]}
        />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Panel
            title="Needs attention"
            actions={
              <Link href="/case-manager-portal/follow-ups" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            }
          >
            {followUps.overdue.length === 0 && followUps.dueSoon.length === 0 ? (
              <PanelEmpty>Nothing overdue or due this week. You are on top of it.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {[...followUps.overdue, ...followUps.dueSoon].slice(0, 6).map((task) => {
                  const overdue = new Date(task.dueAt) < new Date();
                  return (
                    <li key={task.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {task.lead} ·{' '}
                          <span className={overdue ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
                            {overdue ? 'Overdue' : 'Due'} {formatDate(task.dueAt)}
                          </span>
                        </p>
                      </div>
                      <Pill className={PRIORITY_COLORS[task.priority] ?? 'bg-slate-100 text-slate-700'}>
                        {task.priority}
                      </Pill>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recently updated leads"
            actions={
              <Link href="/case-manager-portal/leads" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            }
          >
            {leads.length === 0 ? (
              <PanelEmpty>No leads assigned to you yet.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {leads.slice(0, 6).map((lead) => (
                  <li key={lead.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{lead.name}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {lead.country} · {lead.treatment}
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
        </div>
      </PortalPage>
    </CaseManagerLayout>
  );
}
