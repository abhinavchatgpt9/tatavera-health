import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminAuditLogs } from '@/lib/portal-data';
import { AdminAuditLogsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Audit Logs | Admin Portal' };
export const dynamic = 'force-dynamic';

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

        <AdminAuditLogsTable rows={logs} entityTypes={entityTypes} />
      </PortalPage>
    </AdminLayout>
  );
}
