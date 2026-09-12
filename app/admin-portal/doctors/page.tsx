'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';

const DOCTORS = [
  { id: 'd1', name: 'Dr. Rajesh Nair', specialty: 'Cardiology', hospital: 'Fortis Escorts Heart Institute', status: 'ACTIVE' },
  { id: 'd2', name: 'Dr. Meera Iyer', specialty: 'Cardiac Surgery', hospital: 'Fortis Escorts Heart Institute', status: 'ACTIVE' },
  { id: 'd3', name: 'Dr. Arjun Kapoor', specialty: 'Electrophysiology', hospital: 'Fortis Escorts Heart Institute', status: 'ACTIVE' },
  { id: 'd4', name: 'Dr. Devi Prasad Shetty', specialty: 'Cardiac Surgery', hospital: 'Narayana Health, Bangalore', status: 'ACTIVE' },
  { id: 'd5', name: 'Dr. Arun Saroha', specialty: 'Neurosurgery', hospital: 'Max Healthcare, Delhi', status: 'PENDING' },
];

export default function AdminDoctorsPage() {
  const [search, setSearch] = useState('');
  const filtered = DOCTORS.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Doctors</h1>
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 mb-6"
        />
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🩺</p>
            <p>No doctors match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Specialty</th>
                    <th className="px-5 py-3 font-medium">Hospital</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{d.name}</td>
                      <td className="px-5 py-3 text-gray-600">{d.specialty}</td>
                      <td className="px-5 py-3 text-gray-600">{d.hospital}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${d.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {d.status}
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
