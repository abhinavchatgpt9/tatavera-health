import type { Metadata } from 'next';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_TRAVEL_STATUSES } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Travel Status | Tatavera Health' };

export default function TravelStatusPage() {
  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Travel Status</h1>
          <p className="text-gray-500 mt-1">Arrival, departure, and pickup arrangements for traveling patients.</p>
        </div>

        {MOCK_TRAVEL_STATUSES.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">✈️</p>
            <p>No travel records yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Arrival</th>
                    <th className="px-5 py-3 font-medium">Departure</th>
                    <th className="px-5 py-3 font-medium">Pickup</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TRAVEL_STATUSES.map((t) => (
                    <tr key={t.lead} className="border-t border-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">{t.lead}</td>
                      <td className="px-5 py-3 text-gray-600">{t.arrivalDate}</td>
                      <td className="px-5 py-3 text-gray-600">{t.departureDate}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            t.pickupArranged ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {t.pickupArranged ? 'Arranged' : 'Pending'}
                        </span>
                      </td>
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
