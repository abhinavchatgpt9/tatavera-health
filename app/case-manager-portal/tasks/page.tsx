import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerTasks } from '@/lib/portal-data';
import { PRIORITY_COLORS, TASK_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Tasks | Case Manager Portal' };
export const dynamic = 'force-dynamic';

type Task = Awaited<ReturnType<typeof getCaseManagerTasks>>[number];

const columns: Array<Column<Task>> = [
  {
    key: 'task',
    header: 'Task',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.title}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{t.lead}</p>
      </>
    ),
  },
  {
    key: 'due',
    header: 'Due',
    render: (t) => {
      const overdue = t.dueAt !== null && t.status !== 'DONE' && new Date(t.dueAt) < new Date();
      return (
        <span className={overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}>
          {formatDate(t.dueAt)}
          {overdue && ' · overdue'}
        </span>
      );
    },
  },
  {
    key: 'priority',
    header: 'Priority',
    render: (t) => <Pill className={PRIORITY_COLORS[t.priority] ?? 'bg-slate-100 text-slate-700'}>{t.priority}</Pill>,
  },
  {
    key: 'assignee',
    header: 'Assignee',
    hideOnMobile: true,
    render: (t) => <span className="text-slate-500 dark:text-slate-400">{t.assignee}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (t) => (
      <Pill className={TASK_STATUS_COLORS[t.status] ?? 'bg-slate-100 text-slate-700'}>
        {t.status.replace(/_/g, ' ')}
      </Pill>
    ),
  },
];

export default async function CaseManagerTasksPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const tasks = await getCaseManagerTasks(session);

  const open = tasks.filter((t) => t.status !== 'DONE').length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader title="Tasks" description={`${open} open of ${tasks.length} total`} />

        <DataTable
          rows={tasks}
          columns={columns}
          searchIn={(t) => `${t.title} ${t.lead} ${t.assignee}`}
          searchPlaceholder="Search by task or patient…"
          filter={{
            label: 'All statuses',
            options: [
              { value: 'PENDING', label: 'Pending' },
              { value: 'IN_PROGRESS', label: 'In progress' },
              { value: 'DONE', label: 'Done' },
            ],
            matches: (t, value) => t.status === value,
          }}
          emptyTitle="No tasks yet"
          emptyDescription="Tasks you create against a lead show up here so nothing slips."
        />
      </PortalPage>
    </CaseManagerLayout>
  );
}
