import type { Metadata } from 'next';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_HOSPITAL_DEPARTMENTS } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Reports | Tatavera Health' };

const TREATMENTS_BY_VOLUME = [
  { treatment: 'Bypass Surgery', count: 42 },
  { treatment: 'Angioplasty', count: 35 },
  { treatment: 'Valve Replacement', count: 24 },
  { treatment: 'Pacemaker Implant', count: 18 },
  { treatment: 'Cardiac Screening', count: 61 },
  { treatment: 'Electrophysiology Study', count: 12 },
];

const REVENUE_BY_DEPARTMENT = MOCK_HOSPITAL_DEPARTMENTS.map((dept, idx) => ({
  name: dept.name,
  revenue: [420000, 310000, 185000][idx] ?? 100000,
}));

export default function HospitalReportsPage() {
  const maxTreatment = Math.max(...TREATMENTS_BY_VOLUME.map((t) => t.count));
  const maxRevenue = Math.max(...REVENUE_BY_DEPARTMENT.map((d) => d.revenue));

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Hospital performance analytics.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Treatments This Month', value: 192, emoji: '🩺' },
            { label: 'Revenue This Month', value: '$915,000', emoji: '💰' },
            { label: 'Avg. Patient Satisfaction', value: '4.8 / 5', emoji: '⭐' },
            { label: 'Bed Occupancy Rate', value: '78%', emoji: '🛏️' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Treatments by Volume */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Treatments by Volume</h2>
            <div className="space-y-3">
              {TREATMENTS_BY_VOLUME.map((t) => (
                <div key={t.treatment} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-36 flex-shrink-0 truncate">{t.treatment}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(t.count / maxTreatment) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 w-10 text-right">{t.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Department */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Revenue by Department</h2>
            <div className="space-y-3">
              {REVENUE_BY_DEPARTMENT.map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <p className="text-xs text-gray-500 w-36 flex-shrink-0 truncate">{d.name}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${(d.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 w-16 text-right">${(d.revenue / 1000).toFixed(0)}k</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HospitalLayout>
  );
}
