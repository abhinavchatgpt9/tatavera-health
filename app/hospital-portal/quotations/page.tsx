'use client';

import { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_HOSPITAL_QUOTATIONS, MOCK_HOSPITAL_LEADS } from '@/lib/portal-mock-data';

// Defined locally to avoid concurrent edits to the shared lib/lead-stage.ts file.
const QUOTATION_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  SENT: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-green-100 text-green-700',
  DECLINED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-orange-100 text-orange-700',
};

type LineItem = { description: string; amount: string };

export default function HospitalQuotationsPage() {
  const [showForm, setShowForm] = useState(false);
  const [patient, setPatient] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: '', amount: '' }]);

  const patientOptions = Array.from(
    new Set([
      ...MOCK_HOSPITAL_LEADS.map((l) => l.name),
      ...MOCK_HOSPITAL_QUOTATIONS.map((q) => q.patient),
    ])
  );

  const total = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const updateLineItem = (idx: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const addLineItem = () => setLineItems((prev) => [...prev, { description: '', amount: '' }]);

  const removeLineItem = (idx: number) => setLineItems((prev) => prev.filter((_, i) => i !== idx));

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
            <p className="text-gray-500 mt-1">{MOCK_HOSPITAL_QUOTATIONS.length} quotations</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {showForm ? 'Close' : '+ Create Quotation'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">New Quotation</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient</label>
              <select
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="">Select patient...</option>
                {patientOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Line Items</label>
              <div className="space-y-2">
                {lineItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={item.amount}
                      onChange={(e) => updateLineItem(idx, 'amount', e.target.value)}
                      className="w-32 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={() => removeLineItem(idx)}
                      disabled={lineItems.length === 1}
                      className="px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addLineItem}
                className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
              >
                + Add Line Item
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="font-bold text-gray-900">Total: ${total.toLocaleString()}</p>
              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                Save Quotation
              </button>
            </div>
          </div>
        )}

        {MOCK_HOSPITAL_QUOTATIONS.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">💰</p>
            <p>No quotations yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                    <th className="px-5 py-3 font-medium">Valid Until</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HOSPITAL_QUOTATIONS.map((q) => (
                    <tr key={q.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{q.patient}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${QUOTATION_STATUS_COLORS[q.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">
                        {q.currency} {q.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{q.validUntil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </HospitalLayout>
  );
}
