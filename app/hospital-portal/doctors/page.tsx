'use client';

import { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_HOSPITAL_DOCTORS } from '@/lib/portal-mock-data';

const SPECIALTIES = Array.from(new Set(MOCK_HOSPITAL_DOCTORS.map((d) => d.specialty)));

export default function HospitalDoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');

  const filtered = MOCK_HOSPITAL_DOCTORS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'ALL' || d.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
            <p className="text-gray-500 mt-1">{filtered.length} of {MOCK_HOSPITAL_DOCTORS.length} doctors</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="ALL">All Specialties</option>
            {SPECIALTIES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🔍</p>
            <p>No doctors match your filters.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Specialty</th>
                    <th className="px-5 py-3 font-medium text-right">Patients</th>
                    <th className="px-5 py-3 font-medium text-right">Rating</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doctor) => (
                    <tr key={doctor.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-gray-900">{doctor.name}</td>
                      <td className="px-5 py-3 text-gray-600">{doctor.specialty}</td>
                      <td className="px-5 py-3 text-right text-gray-600">{doctor.patients}</td>
                      <td className="px-5 py-3 text-right text-gray-600">⭐ {doctor.rating}</td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-blue-600 text-xs font-semibold hover:underline">View Profile</button>
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
