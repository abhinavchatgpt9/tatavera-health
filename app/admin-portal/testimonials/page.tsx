'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const TESTIMONIALS = [
  { id: 't1', name: 'Amara Diallo', country: 'Nigeria', quote: 'Tatavera guided me from Lagos to India for my heart surgery...', rating: 5 },
  { id: 't2', name: 'Mohammed Al-Rashidi', country: 'Kuwait', quote: 'My case manager was available 24/7, even on weekends...', rating: 5 },
  { id: 't3', name: 'Fatima Hassan', country: 'Egypt', quote: 'After years of failed treatments locally, we came to India...', rating: 5 },
  { id: 't4', name: 'Sergei Petrov', country: 'Russia', quote: 'The doctors at Apollo were world-class...', rating: 5 },
];

export default function AdminTestimonialsPage() {
  const [search, setSearch] = useState('');
  const filtered = TESTIMONIALS.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Testimonials</h1>
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">⭐</p>
            <p>No testimonials match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-5 py-3 font-medium">Quote</th>
                    <th className="px-5 py-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{t.name}</td>
                      <td className="px-5 py-3 text-gray-600">{t.country}</td>
                      <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{t.quote}</td>
                      <td className="px-5 py-3 text-amber-500">{'★'.repeat(t.rating)}</td>
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
