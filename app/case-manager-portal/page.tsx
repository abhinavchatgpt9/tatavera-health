import type { Metadata } from 'next';
import Link from 'next/link';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_LEADS, MOCK_CM_TASKS, MOCK_CRM_FUNNEL } from '@/lib/portal-mock-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS, PRIORITY_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Case Manager Dashboard | Tatavera Health' };

export default function CaseManagerDashboard() {
  const activeLeads = MOCK_CM_LEADS.length;
  const pendingTasks = MOCK_CM_TASKS.filter((t) => t.status !== 'DONE').length;
  const totalValue = MOCK_CM_LEADS.reduce((sum, l) => sum + l.value, 0);

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Priya 👋</h1>
          <p className="text-gray-500 mt-1">Here&apos;s what needs your attention today.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Leads', value: activeLeads, emoji: '📋' },
            { label: 'Pending Tasks', value: pendingTasks, emoji: '✅' },
            { label: 'Pipeline Value', value: `$${totalValue.toLocaleString()}`, emoji: '💰' },
            { label: 'Avg. Response Time', value: '2.4 hrs', emoji: '⏱️' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Assigned Leads */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">My Assigned Leads</h2>
            <Link href="/case-manager-portal/leads" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Patient</th>
                  <th className="pb-2 font-medium">Treatment</th>
                  <th className="pb-2 font-medium">Stage</th>
                  <th className="pb-2 font-medium text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CM_LEADS.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.country}</p>
                    </td>
                    <td className="py-3 text-gray-600">{lead.treatment}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${LEAD_STAGE_COLORS[lead.stage]}`}>
                        {LEAD_STAGE_LABELS[lead.stage]}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">${lead.value.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tasks */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Upcoming Tasks</h2>
              <Link href="/case-manager-portal/tasks" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {MOCK_CM_TASKS.slice(0, 4).map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.lead} · Due {task.dueAt}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CRM Funnel mini */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Lead Funnel (This Month)</h2>
            <div className="space-y-2">
              {MOCK_CRM_FUNNEL.slice(0, 6).map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-32 flex-shrink-0 truncate">{stage.stage}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stage.count / MOCK_CRM_FUNNEL[0].count) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 w-10 text-right">{stage.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CaseManagerLayout>
  );
}
