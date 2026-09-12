import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminTreatments } from '@/lib/portal-data';
import { AdminTreatmentsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Treatments | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminTreatmentsPage() {
  await getPortalSession(['ADMIN']);
  const treatments = await getAdminTreatments();

  const specialties = [...new Set(treatments.map((t) => t.specialty))].sort();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Treatments"
          description={`${treatments.length} in the catalogue across ${specialties.length} ${specialties.length === 1 ? 'specialty' : 'specialties'}`}
        />

        <AdminTreatmentsTable rows={treatments} specialties={specialties} />
      </PortalPage>
    </AdminLayout>
  );
}
