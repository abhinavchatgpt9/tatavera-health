import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminDestinations } from '@/lib/portal-data';
import { AdminDestinationsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Countries | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminCountriesPage() {
  await getPortalSession(['ADMIN']);
  const destinations = await getAdminDestinations();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Countries"
          description={`${destinations.length} destination ${destinations.length === 1 ? 'page' : 'pages'}. Lead counts show where patients are travelling from.`}
        />

        <AdminDestinationsTable rows={destinations} />
      </PortalPage>
    </AdminLayout>
  );
}
