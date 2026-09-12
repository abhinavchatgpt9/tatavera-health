import type { Metadata } from 'next';
import { CheckCircle2 } from 'lucide-react';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerFollowUps } from '@/lib/portal-data';
import { PRIORITY_COLORS, LEAD_STAGE_LABELS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Follow-ups | Case Manager Portal' };
export const dynamic = 'force-dynamic';

type Task = Awaited<ReturnType<typeof getCaseManagerFollowUps>>['overdue'][number];

function TaskList({ tasks, tone }: { tasks: Task[]; tone: 'overdue' | 'soon' }) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
            tone === 'overdue'
              ? 'border-red-200 bg-red-50/60 dark:border-red-900/50 dark:bg-red-950/20'
              : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="min-w-0">
            <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {task.lead} · {task.country} · {LEAD_STAGE_LABELS[task.stage] ?? task.stage}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm ${tone === 'overdue' ? 'font-semibold text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {formatDate(task.dueAt)}
            </span>
            <Pill className={PRIORITY_COLORS[task.priority] ?? 'bg-slate-100 text-slate-700'}>{task.priority}</Pill>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseManagerFollowUpsPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const { overdue, dueSoon } = await getCaseManagerFollowUps(session);

  const total = overdue.length + dueSoon.length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Follow-ups"
          description={
            total === 0
              ? 'Nothing is overdue or due in the next seven days.'
              : `${overdue.length} overdue · ${dueSoon.length} due in the next seven days`
          }
        />

        {total === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="h-6 w-6" aria-hidden="true" />}
            title="You are all caught up"
            description="Tasks with a due date inside the next seven days appear here, with overdue ones first."
          />
        ) : (
          <div className="space-y-8">
            {overdue.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                  Overdue ({overdue.length})
                </h2>
                <TaskList tasks={overdue} tone="overdue" />
              </section>
            )}

            {dueSoon.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Due this week ({dueSoon.length})
                </h2>
                <TaskList tasks={dueSoon} tone="soon" />
              </section>
            )}
          </div>
        )}
      </PortalPage>
    </CaseManagerLayout>
  );
}
