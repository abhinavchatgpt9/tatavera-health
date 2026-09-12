'use client';

import { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR_APPOINTMENTS } from '@/lib/portal-mock-data';

const APPT_STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  SCHEDULED: 'bg-amber-100 text-amber-700',
};

const APPT_TYPE_LABELS: Record<string, string> = {
  VIDEO: '💻 Video',
  IN_PERSON: '🏥 In-Person',
};

export default function DoctorAppointmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = MOCK_DOCTOR_APPOINTMENTS.filter((a) => {
    const matchesSearch = a.patient.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-500 mt-1">{filtered.length} of {MOCK_DOCTOR_APPOINTMENTS.length} appointments</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">📅</p>
            <p>No appointments match your filters.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Scheduled</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const d = new Date(a.scheduledAt);
                    return (
                      <tr key={a.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium text-gray-900">{a.patient}</td>
                        <td className="px-5 py-3 text-gray-600">{APPT_TYPE_LABELS[a.type] ?? a.type}</td>
                        <td className="px-5 py-3 text-gray-500">
                          {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${APPT_STATUS_COLORS[a.status] ?? 'bg-gray-100 text-gray-700'}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button className="text-blue-600 text-xs font-semibold hover:underline">Details</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
