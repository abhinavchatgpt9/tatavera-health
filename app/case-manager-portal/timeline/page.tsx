import type { Metadata } from 'next';
import CaseManagerLayout from '@/components/CaseManagerLayout';
import { MOCK_CM_LEADS, LEAD_STAGES } from '@/lib/portal-mock-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Case Timeline | Tatavera Health' };

export default function CaseTimelinePage() {
  const lead = MOCK_CM_LEADS[0];
  const currentIndex = LEAD_STAGES.indexOf(lead.stage as (typeof LEAD_STAGES)[number]);

  // Derive plausible increasing timestamps for completed stages, ending at lead.assignedAt or later.
  const baseDate = new Date(lead.assignedAt);
  const timestamps: string[] = LEAD_STAGES.map((_, i) => {
    const offsetDays = (i - currentIndex) * 2;
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  });

  return (
    <CaseManagerLayout>
      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Case Timeline</h1>
          <p className="text-gray-500 mt-1">Stage-by-stage progress for the selected case.</p>
        </div>

        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-bold text-gray-900 text-lg">{lead.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{lead.treatment} · {lead.country}</p>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${LEAD_STAGE_COLORS[lead.stage]}`}>
            {LEAD_STAGE_LABELS[lead.stage]}
          </span>
        </div>

        {/* Vertical timeline */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="space-y-0">
            {LEAD_STAGES.map((stage, i) => {
              const completed = i <= currentIndex;
              const isLast = i === LEAD_STAGES.length - 1;
              return (
                <div key={stage} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {completed ? '✓' : ''}
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 min-h-[2rem] ${completed ? 'bg-green-300' : 'bg-gray-100'}`} />}
                  </div>
                  <div className="pb-8">
                    <p className={`font-medium ${completed ? 'text-gray-900' : 'text-gray-400'}`}>
                      {LEAD_STAGE_LABELS[stage]}
                    </p>
                    <p className={`text-xs mt-0.5 ${completed ? 'text-gray-500' : 'text-gray-300'}`}>
                      {completed ? timestamps[i] : 'Upcoming'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CaseManagerLayout>
  );
}
