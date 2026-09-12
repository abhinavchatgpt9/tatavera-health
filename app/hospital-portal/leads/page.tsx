'use client';

import { useState } from 'react';
import HospitalLayout from '@/components/HospitalLayout';
import { MOCK_HOSPITAL_LEADS } from '@/lib/portal-mock-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

const STAGE_ORDER = Array.from(new Set(MOCK_HOSPITAL_LEADS.map((l) => l.stage)));

export default function HospitalLeadsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  const filtered = MOCK_HOSPITAL_LEADS.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase()) ||
      l.treatment.toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || l.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  return (
    <HospitalLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Patient Leads</h1>
          <p className="text-gray-500 mt-1">{filtered.length} of {MOCK_HOSPITAL_LEADS.length} leads</p>
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
              <option key={s} value={s}>{LEAD_STAGE_LABELS[s] ?? s}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🔍</p>
            <p>No leads match your filters.</p>
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
                    <th className="px-5 py-3 font-medium text-right">Value</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-400">{lead.country}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{lead.treatment}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${LEAD_STAGE_COLORS[lead.stage]}`}>
                          {LEAD_STAGE_LABELS[lead.stage]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">${lead.value.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <button className="text-blue-600 text-xs font-semibold hover:underline">View</button>
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
