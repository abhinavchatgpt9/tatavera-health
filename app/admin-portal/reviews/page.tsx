'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const REVIEWS = [
  { id: 'r1', target: 'Fortis Escorts Heart Institute', patient: 'Amara Okafor', rating: 5, comment: 'Excellent care from the entire cardiac team...', status: 'Approved' },
  { id: 'r2', target: 'Dr. Rajesh Nair', patient: 'Ivan Petrov', rating: 4, comment: 'Very professional, clear communication throughout...', status: 'Approved' },
  { id: 'r3', target: 'Apollo Hospitals', patient: 'Grace Mwangi', rating: 5, comment: 'The facility exceeded my expectations...', status: 'Pending' },
  { id: 'r4', target: 'Dr. Meera Iyer', patient: 'Fatima Al-Sayed', rating: 3, comment: 'Good outcome but long wait times before surgery...', status: 'Pending' },
];

export default function AdminReviewsPage() {
  const [search, setSearch] = useState('');
  const filtered = REVIEWS.filter(
    (r) => r.target.toLowerCase().includes(search.toLowerCase()) || r.patient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h1>
        <input
          type="text"
          placeholder="Search by hospital, doctor, or patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">📝</p>
            <p>No reviews match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Target</th>
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Rating</th>
                    <th className="px-5 py-3 font-medium">Comment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{r.target}</td>
                      <td className="px-5 py-3 text-gray-600">{r.patient}</td>
                      <td className="px-5 py-3 text-amber-500">{'★'.repeat(r.rating)}</td>
                      <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{r.comment}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${r.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {r.status}
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
    </AdminLayout>
  );
}
