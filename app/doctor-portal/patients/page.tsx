'use client';

import { useState } from 'react';
import DoctorLayout from '@/components/DoctorLayout';
import { MOCK_DOCTOR_PATIENTS } from '@/lib/portal-mock-data';

const PATIENT_STAGE_LABELS: Record<string, string> = {
  CONSULTATION_SCHEDULED: 'Consultation Scheduled',
  TREATMENT: 'In Treatment',
  RECOVERY: 'Recovery',
  FOLLOW_UP: 'Follow Up',
};

const PATIENT_STAGE_COLORS: Record<string, string> = {
  CONSULTATION_SCHEDULED: 'bg-indigo-100 text-indigo-700',
  TREATMENT: 'bg-blue-100 text-blue-700',
  RECOVERY: 'bg-amber-100 text-amber-700',
  FOLLOW_UP: 'bg-emerald-100 text-emerald-700',
};

const STAGE_ORDER = ['CONSULTATION_SCHEDULED', 'TREATMENT', 'RECOVERY', 'FOLLOW_UP'];

export default function DoctorPatientsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const filtered = MOCK_DOCTOR_PATIENTS.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.treatment.toLowerCase().includes(q);
    const matchesStage = stageFilter === 'ALL' || p.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <DoctorLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-500 mt-1">{filtered.length} of {MOCK_DOCTOR_PATIENTS.length} patients</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by patient name, country, or treatment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="ALL">All Stages</option>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>{PATIENT_STAGE_LABELS[s]}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🔍</p>
            <p>No patients match your filters.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Treatment</th>
                    <th className="px-5 py-3 font-medium">Stage</th>
                    <th className="px-5 py-3 font-medium">Last Visit</th>
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
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PATIENT_STAGE_COLORS[p.stage]}`}>
                          {PATIENT_STAGE_LABELS[p.stage]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{p.lastVisit}</td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-blue-600 text-xs font-semibold hover:underline">View Chart</button>
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
