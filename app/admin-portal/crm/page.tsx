'use client';

import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { MOCK_CM_LEADS, MOCK_CRM_FUNNEL, LEAD_STAGES } from '@/lib/portal-mock-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export default function AdminCrmPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_CM_LEADS.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-500 mt-1">Full lead lifecycle across the platform.</p>
        </div>

        {/* Full funnel chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">Lead Funnel — All Stages</h2>
          <div className="space-y-3">
            {MOCK_CRM_FUNNEL.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-3">
                <p className="text-xs text-gray-500 w-36 flex-shrink-0 truncate">{stage.stage}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: `${(stage.count / MOCK_CRM_FUNNEL[0].count) * 100}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-gray-700 w-12 text-right">{stage.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search leads by patient name or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Board view */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {LEAD_STAGES.map((stage) => {
            const stageLeads = filtered.filter((l) => l.stage === stage);
            return (
              <div key={stage} className="w-64 flex-shrink-0">
                <div className={`px-3 py-2 rounded-lg text-xs font-semibold mb-2 ${LEAD_STAGE_COLORS[stage]}`}>
                  {LEAD_STAGE_LABELS[stage]} ({stageLeads.length})
                </div>
                <div className="space-y-2">
                  {stageLeads.map((lead) => (
                    <div key={lead.id} className="bg-white border border-gray-100 rounded-xl p-3">
                      <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-400">{lead.country} · {lead.treatment}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-1">${lead.value.toLocaleString()}</p>
                    </div>
                  ))}
                  {stageLeads.length === 0 && <div className="text-xs text-gray-300 text-center py-4">Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
