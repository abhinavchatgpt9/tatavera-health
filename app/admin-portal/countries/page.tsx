'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { DESTINATIONS } from '@/lib/constants';

export default function AdminCountriesPage() {
  const [search, setSearch] = useState('');
  const filtered = DESTINATIONS.filter((d) => d.country.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Countries</h1>
        <input
          type="text"
          placeholder="Search countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🌍</p>
            <p>No countries match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-5 py-3 font-medium">Top Treatment</th>
                    <th className="px-5 py-3 font-medium">Highlight</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.slug} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{d.flag} {d.country}</td>
                      <td className="px-5 py-3 text-gray-600">{d.topTreatment}</td>
                      <td className="px-5 py-3 text-gray-600">{d.highlight}</td>
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
