import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, formatDateTime } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminAuditLogs } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Audit Logs | Admin Portal' };
export const dynamic = 'force-dynamic';

type Log = Awaited<ReturnType<typeof getAdminAuditLogs>>[number];

const columns: Array<Column<Log>> = [
  {
    key: 'action',
    header: 'Action',
    render: (l) => (
      <>
        <p className="text-slate-700 dark:text-slate-200">{l.action}</p>
        {l.entityType && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {l.entityType}
            {l.entityId ? ` · ${l.entityId}` : ''}
          </p>
        )}
      </>
    ),
  },
  { key: 'user', header: 'By', render: (l) => <span className="text-slate-600 dark:text-slate-300">{l.user}</span> },
  {
    key: 'ip',
    header: 'IP',
    hideOnMobile: true,
    render: (l) => <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{l.ipAddress ?? '—'}</span>,
  },
  {
    key: 'when',
    header: 'When',
    align: 'right',
    render: (l) => <span className="text-slate-500 dark:text-slate-400">{formatDateTime(l.createdAt)}</span>,
  },
];

export default async function AdminAuditLogsPage() {
  await getPortalSession(['ADMIN']);
  const logs = await getAdminAuditLogs(200);

  const entityTypes = [...new Set(logs.map((l) => l.entityType).filter(Boolean))] as string[];

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Audit Logs"
          description={`${logs.length} most recent ${logs.length === 1 ? 'entry' : 'entries'}, newest first`}
        />

        <DataTable
          rows={logs}
          columns={columns}
          searchIn={(l) => `${l.action} ${l.user} ${l.entityType ?? ''} ${l.entityId ?? ''}`}
          searchPlaceholder="Search by action, user or record…"
          filter={
            entityTypes.length > 0
              ? {
                  label: 'All record types',
                  options: entityTypes.map((t) => ({ value: t, label: t })),
                  matches: (l, value) => l.entityType === value,
                }
              : undefined
          }
          emptyTitle="No audit entries yet"
          emptyDescription="Staff actions that change records — creating users, updating lead stages, accepting quotations — are logged here."
        />
      </PortalPage>
    </AdminLayout>
  );
}
