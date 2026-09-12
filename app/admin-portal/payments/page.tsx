'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const PAYMENTS = [
  { id: 'pay1', name: 'Amara Okafor', amount: 12000, currency: 'USD', status: 'Paid', date: '2026-07-02' },
  { id: 'pay2', name: 'Ivan Petrov', amount: 6500, currency: 'USD', status: 'Pending', date: '2026-07-09' },
  { id: 'pay3', name: 'Fatima Al-Sayed', amount: 18000, currency: 'USD', status: 'Paid', date: '2026-06-18' },
  { id: 'pay4', name: 'John Mensah', amount: 9000, currency: 'USD', status: 'Refunded', date: '2026-06-05' },
  { id: 'pay5', name: 'Grace Mwangi', amount: 15000, currency: 'USD', status: 'Pending', date: '2026-07-10' },
];

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState('');
  const filtered = PAYMENTS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Payments</h1>
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">💳</p>
            <p>No payments match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium text-right">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">{p.currency} {p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : p.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
