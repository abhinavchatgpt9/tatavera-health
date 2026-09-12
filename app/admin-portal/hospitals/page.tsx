'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const HOSPITALS = [
  { id: 'h1', name: 'Fortis Escorts Heart Institute', city: 'New Delhi', country: 'India', doctors: 8, status: 'ACTIVE' },
  { id: 'h2', name: 'Apollo Hospitals', city: 'Chennai', country: 'India', doctors: 21, status: 'ACTIVE' },
  { id: 'h3', name: 'Memorial Hospital', city: 'Istanbul', country: 'Turkey', doctors: 14, status: 'ACTIVE' },
  { id: 'h4', name: 'Bumrungrad International', city: 'Bangkok', country: 'Thailand', doctors: 26, status: 'ACTIVE' },
  { id: 'h5', name: 'Mount Elizabeth', city: 'Singapore', country: 'Singapore', doctors: 17, status: 'PENDING' },
];

export default function AdminHospitalsPage() {
  const [search, setSearch] = useState('');
  const filtered = HOSPITALS.filter(
    (h) => h.name.toLowerCase().includes(search.toLowerCase()) || h.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Hospitals</h1>
        <input
          type="text"
          placeholder="Search by name or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🏥</p>
            <p>No hospitals match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">City</th>
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-5 py-3 font-medium">Doctors</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((h) => (
                    <tr key={h.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{h.name}</td>
                      <td className="px-5 py-3 text-gray-600">{h.city}</td>
                      <td className="px-5 py-3 text-gray-600">{h.country}</td>
                      <td className="px-5 py-3 text-gray-600">{h.doctors}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${h.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {h.status}
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
