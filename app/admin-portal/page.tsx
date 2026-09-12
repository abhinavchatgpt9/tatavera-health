import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import { MOCK_ADMIN_STATS, MOCK_AUDIT_LOGS, MOCK_CRM_FUNNEL } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Admin Dashboard | Tatavera Health' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default function AdminDashboard() {
  const stats = MOCK_ADMIN_STATS;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform-wide overview and recent activity.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers.toLocaleString(), emoji: '👥' },
            { label: 'Patients', value: stats.totalPatients.toLocaleString(), emoji: '🧍' },
            { label: 'Doctors', value: stats.totalDoctors.toLocaleString(), emoji: '🩺' },
            { label: 'Hospitals', value: stats.totalHospitals.toLocaleString(), emoji: '🏥' },
            { label: 'Active Leads', value: stats.activeLeads.toLocaleString(), emoji: '📋' },
            { label: 'Conversion Rate', value: `${stats.conversionRate}%`, emoji: '📈' },
            { label: 'Revenue This Month', value: `$${stats.revenueThisMonth.toLocaleString()}`, emoji: '💰' },
            { label: 'Pending Quotations', value: stats.pendingQuotations.toLocaleString(), emoji: '🧾' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent activity */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg flex-shrink-0">🧾</span>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.user} · {formatDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CRM funnel mini chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Lead Funnel</h2>
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
    </AdminLayout>
  );
}
