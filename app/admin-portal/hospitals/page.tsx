import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminHospitals } from '@/lib/portal-data';
import { AdminHospitalsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Hospitals | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminHospitalsPage() {
  await getPortalSession(['ADMIN']);
  const hospitals = await getAdminHospitals();

  const countries = [...new Set(hospitals.map((h) => h.country))].sort();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Hospitals"
          description={`${hospitals.length} partner ${hospitals.length === 1 ? 'hospital' : 'hospitals'} across ${countries.length} ${countries.length === 1 ? 'country' : 'countries'}`}
        />

        <AdminHospitalsTable rows={hospitals} countries={countries} />
      </PortalPage>
    </AdminLayout>
  );
}
