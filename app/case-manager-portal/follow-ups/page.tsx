'use client';

import { useState } from 'react';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_LEADS, MOCK_CM_TASKS } from '@/lib/portal-mock-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export default function FollowUpsPage() {
  const [search, setSearch] = useState('');

  const followUpLeads = MOCK_CM_LEADS.filter((l) => {
    const hasTask = MOCK_CM_TASKS.some((t) => t.lead === l.name);
    return l.stage === 'FOLLOW_UP' || hasTask;
  }).map((l) => {
    const task = MOCK_CM_TASKS.find((t) => t.lead === l.name);
    return { ...l, dueAt: task?.dueAt ?? null };
  });

  const filtered = followUpLeads.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Follow Ups</h1>
          <p className="text-gray-500 mt-1">Leads that need a follow-up touchpoint.</p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-2xl">
            <p className="text-4xl mb-3">🔁</p>
            <p>No follow-ups match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => {
              const fakePhone = '15551234567';
              return (
                <div key={lead.id} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${LEAD_STAGE_COLORS[lead.stage]}`}>
                        {LEAD_STAGE_LABELS[lead.stage]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {lead.country} · {lead.treatment}
                      {lead.dueAt && <> · Due {lead.dueAt}</>}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <a
                      href={`tel:+${fakePhone}`}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      📞 Call
                    </a>
                    <a
                      href={`https://wa.me/${fakePhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      💬 WhatsApp
                    </a>
                    <a
                      href={`mailto:${lead.name.toLowerCase().replace(/\s+/g, '.')}@example.com`}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      ✉️ Email
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CaseManagerLayout>
  );
}
