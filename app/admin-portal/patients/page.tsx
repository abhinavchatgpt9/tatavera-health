'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const PATIENTS = [
  { id: 'p1', name: 'Amara Okafor', country: 'Nigeria', treatment: 'Bypass Surgery', status: 'IN TREATMENT' },
  { id: 'p2', name: 'Ivan Petrov', country: 'Kazakhstan', treatment: 'Angioplasty', status: 'MATCHED' },
  { id: 'p3', name: 'Fatima Al-Sayed', country: 'UAE', treatment: 'Valve Replacement', status: 'RECOVERY' },
  { id: 'p4', name: 'John Mensah', country: 'Ghana', treatment: 'Pacemaker Implant', status: 'FOLLOW UP' },
  { id: 'p5', name: 'Grace Mwangi', country: 'Kenya', treatment: 'Valve Replacement', status: 'CONTACTED' },
];

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('');
  const filtered = PATIENTS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patients</h1>
        <input
          type="text"
          placeholder="Search by name or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🧍</p>
            <p>No patients match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Country</th>
                    <th className="px-5 py-3 font-medium">Treatment</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{p.name}</td>
                      <td className="px-5 py-3 text-gray-600">{p.country}</td>
                      <td className="px-5 py-3 text-gray-600">{p.treatment}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{p.status}</span>
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
