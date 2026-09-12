import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getStaffApplications } from '@/lib/portal-data';
import { ApplicationsClient } from './ApplicationsClient';

export const metadata: Metadata = { title: 'Applications | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminApplicationsPage() {
  await getPortalSession(['ADMIN']);
  const applications = await getStaffApplications();
  const pending = applications.filter((a) => a.status === 'PENDING').length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Doctor & Hospital Applications"
          description={`${pending} pending review · ${applications.length} total`}
        />

        <ApplicationsClient applications={applications} />
      </PortalPage>
    </AdminLayout>
  );
}
