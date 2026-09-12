'use client';

import { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR_PATIENTS } from '@/lib/portal-mock-data';

const REPORT_COUNTS = [3, 1, 2, 4];

const PATIENT_REPORTS = MOCK_DOCTOR_PATIENTS.map((p, i) => ({
  ...p,
  reportCount: REPORT_COUNTS[i] ?? 1,
}));

export default function DoctorReportsPage() {
  const [search, setSearch] = useState('');

  const filtered = PATIENT_REPORTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.treatment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Medical reports awaiting your review.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by patient name or treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">📄</p>
            <p>No reports match your search.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Treatment</th>
                    <th className="px-5 py-3 font-medium">Last Visit</th>
                    <th className="px-5 py-3 font-medium">Reports</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.country}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{p.treatment}</td>
                      <td className="px-5 py-3 text-gray-500">{p.lastVisit}</td>
                      <td className="px-5 py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          {p.reportCount} {p.reportCount === 1 ? 'report' : 'reports'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-blue-600 text-xs font-semibold hover:underline">View Reports</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
