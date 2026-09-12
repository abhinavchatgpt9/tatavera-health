import type { Metadata } from 'next';
import { History } from 'lucide-react';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerTimeline } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Timeline | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerTimelinePage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const events = await getCaseManagerTimeline(session);

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Timeline"
          description="Every stage change across your leads, newest first — the audit trail for each patient journey."
        />

        {events.length === 0 ? (
          <EmptyState
            icon={<History className="h-6 w-6" aria-hidden="true" />}
            title="No stage changes recorded"
            description="Each time a lead moves through the pipeline, the change is recorded here with its timestamp."
          />
        ) : (
          <ol className="relative space-y-1 border-l border-slate-200 pl-6 dark:border-slate-800">
            {events.map((event) => (
              <li key={event.id} className="relative pb-6 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 dark:border-slate-950"
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-medium text-slate-900 dark:text-white">{event.lead}</p>
                  <Pill className={LEAD_STAGE_COLORS[event.stage] ?? 'bg-slate-100 text-slate-700'}>
                    {LEAD_STAGE_LABELS[event.stage] ?? event.stage}
                  </Pill>
                  <time dateTime={event.createdAt} className="text-xs text-slate-400 dark:text-slate-500">
                    {formatDateTime(event.createdAt)}
                  </time>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {event.note ?? `Moved to ${LEAD_STAGE_LABELS[event.stage] ?? event.stage}.`}
                </p>
              </li>
            ))}
          </ol>
        )}
      </PortalPage>
    </CaseManagerLayout>
  );
}
