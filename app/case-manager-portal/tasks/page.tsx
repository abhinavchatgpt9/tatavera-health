import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerTasks } from '@/lib/portal-data';
import { PRIORITY_COLORS, TASK_STATUS_COLORS } from '@/lib/lead-stage';
import { CaseManagerTasksTable } from '@/components/portal/tables/case-manager';

export const metadata: Metadata = { title: 'Tasks | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerTasksPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const tasks = await getCaseManagerTasks(session);

  const open = tasks.filter((t) => t.status !== 'DONE').length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader title="Tasks" description={`${open} open of ${tasks.length} total`} />

        <CaseManagerTasksTable rows={tasks} />
      </PortalPage>
    </CaseManagerLayout>
  );
}
