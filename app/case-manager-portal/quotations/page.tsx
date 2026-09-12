import type { Metadata } from 'next';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_HOSPITAL_QUOTATIONS } from '@/lib/portal-mock-data';

export const metadata: Metadata = { title: 'Quotation Comparison | Tatavera Health' };

const EXTRA_QUOTATIONS = [
  { id: 'q3', patient: 'Amara Okafor', hospital: 'Apollo Hospitals', status: 'SENT', totalAmount: 13500, currency: 'USD', validUntil: '2026-07-28' },
  { id: 'q4', patient: 'Amara Okafor', hospital: 'Max Super Speciality', status: 'SENT', totalAmount: 11200, currency: 'USD', validUntil: '2026-07-22' },
];

const HOSPITAL_NAMES: Record<string, string> = {
  q1: 'Fortis Escorts Heart Institute',
  q2: 'Fortis Escorts Heart Institute',
};

function breakdown(total: number) {
  const surgery = Math.round(total * 0.55);
  const stay = Math.round(total * 0.2);
  const anesthesia = Math.round(total * 0.1);
  const postOp = total - surgery - stay - anesthesia;
  return [
    { label: 'Surgery', amount: surgery },
    { label: 'Hospital Stay', amount: stay },
    { label: 'Anesthesia', amount: anesthesia },
    { label: 'Post-op Care', amount: postOp },
  ];
}

export default function QuotationComparisonPage() {
  const combined = [
    ...MOCK_HOSPITAL_QUOTATIONS.filter((q) => q.patient === 'Amara Okafor').map((q) => ({
      ...q,
      hospital: HOSPITAL_NAMES[q.id] ?? 'Partner Hospital',
    })),
    ...EXTRA_QUOTATIONS,
  ];

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Quotation Comparison</h1>
          <p className="text-gray-500 mt-1">Comparing hospital quotations for {combined[0]?.patient ?? 'patient'}.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {combined.map((q) => (
            <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col">
              <div className="mb-4">
                <p className="font-bold text-gray-900">{q.hospital}</p>
                <p className="text-xs text-gray-400 mt-1">Valid until {q.validUntil}</p>
              </div>

              <p className="text-3xl font-bold text-gray-900 mb-4">
                ${q.totalAmount.toLocaleString()} <span className="text-sm font-normal text-gray-400">{q.currency}</span>
              </p>

              <div className="space-y-2 mb-6 flex-1">
                {breakdown(q.totalAmount).map((item) => (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="text-gray-700 font-medium">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                  Accept
                </button>
                <button className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CaseManagerLayout>
  );
}
