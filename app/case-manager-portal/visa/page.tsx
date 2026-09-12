import type { Metadata } from 'next';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_VISA_STATUSES } from '@/lib/portal-mock-data';
import { VISA_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Visa Status | Tatavera Health' };

function visaLabel(stage: string) {
  return stage
    .split('_')
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(' ');
}

export default function VisaStatusPage() {
  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Visa Status</h1>
          <p className="text-gray-500 mt-1">Track visa processing progress for your patients.</p>
        </div>

        {MOCK_VISA_STATUSES.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🛂</p>
            <p>No visa records yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Destination</th>
                    <th className="px-5 py-3 font-medium">Stage</th>
                    <th className="px-5 py-3 font-medium">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_VISA_STATUSES.map((v) => (
                    <tr key={v.lead} className="border-t border-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{v.lead}</td>
                      <td className="px-5 py-3 text-gray-600">{v.country}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${VISA_STAGE_COLORS[v.stage]}`}>
                          {visaLabel(v.stage)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{v.updatedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CaseManagerLayout>
  );
}
