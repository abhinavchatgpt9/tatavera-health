'use client';

import { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_DOCTOR_APPOINTMENTS, MOCK_HOSPITAL_DOCTORS } from '@/lib/portal-mock-data';

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-700',
};

// Synthetic doctor assignment — cycles through hospital doctors without mutating shared mock data.
const APPOINTMENTS_WITH_DOCTOR = MOCK_DOCTOR_APPOINTMENTS.map((appt, idx) => ({
  ...appt,
  doctor: MOCK_HOSPITAL_DOCTORS[idx % MOCK_HOSPITAL_DOCTORS.length].name,
}));

const DOCTOR_NAMES = Array.from(new Set(APPOINTMENTS_WITH_DOCTOR.map((a) => a.doctor)));
const STATUSES = Array.from(new Set(APPOINTMENTS_WITH_DOCTOR.map((a) => a.status)));

export default function HospitalAppointmentsPage() {
  const [search, setSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = APPOINTMENTS_WITH_DOCTOR.filter((a) => {
    const matchesSearch = a.patient.toLowerCase().includes(search.toLowerCase());
    const matchesDoctor = doctorFilter === 'ALL' || a.doctor === doctorFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesDoctor && matchesStatus;
  });

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500 mt-1">{filtered.length} of {APPOINTMENTS_WITH_DOCTOR.length} appointments across all doctors</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="ALL">All Doctors</option>
            {DOCTOR_NAMES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="ALL">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
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
                    <th className="px-5 py-3 font-medium">Doctor</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Scheduled</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((appt) => (
                    <tr key={appt.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{appt.patient}</td>
                      <td className="px-5 py-3 text-gray-600">{appt.doctor}</td>
                      <td className="px-5 py-3 text-gray-600">{appt.type === 'VIDEO' ? '📹 Video' : '🏥 In-Person'}</td>
                      <td className="px-5 py-3 text-gray-500">{new Date(appt.scheduledAt).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[appt.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {appt.status}
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
    </HospitalLayout>
  );
}
