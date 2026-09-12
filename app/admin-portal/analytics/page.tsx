import type { Metadata } from 'next';
import AdminLayout from '@/components/AdminLayout';
import { MOCK_CRM_FUNNEL } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Analytics | Tatavera Health' };

const REVENUE_BY_MONTH = [
  { month: 'Jan', amount: 312000 },
  { month: 'Feb', amount: 298000 },
  { month: 'Mar', amount: 341000 },
  { month: 'Apr', amount: 356000 },
  { month: 'May', amount: 329000 },
  { month: 'Jun', amount: 402000 },
  { month: 'Jul', amount: 482000 },
  { month: 'Aug', amount: 445000 },
  { month: 'Sep', amount: 468000 },
  { month: 'Oct', amount: 501000 },
  { month: 'Nov', amount: 489000 },
  { month: 'Dec', amount: 534000 },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...REVENUE_BY_MONTH.map((m) => m.amount));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Conversion trends and revenue performance.</p>
        </div>

        {/* Conversion by stage */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Conversion by Stage</h2>
          <div className="space-y-3">
            {MOCK_CRM_FUNNEL.map((stage, i) => {
              const pct = ((stage.count / MOCK_CRM_FUNNEL[0].count) * 100).toFixed(1);
              return (
                <div key={stage.stage} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-36 flex-shrink-0 truncate">{stage.stage}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 w-16 text-right">{pct}%</p>
                  {i === 0 && <span className="text-[10px] text-gray-300 w-14">baseline</span>}
                  {i !== 0 && <span className="w-14" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by month */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">Revenue by Month</h2>
          <div className="space-y-3">
            {REVENUE_BY_MONTH.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <p className="text-xs text-gray-500 w-10 flex-shrink-0">{m.month}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full"
                    style={{ width: `${(m.amount / maxRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-gray-700 w-20 text-right">${m.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
