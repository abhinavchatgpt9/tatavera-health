import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminDoctors } from '@/lib/portal-data';
import { AdminDoctorsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Doctors | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminDoctorsPage() {
  await getPortalSession(['ADMIN']);
  const doctors = await getAdminDoctors();

  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
  const live = doctors.filter((d) => d.published).length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Doctors" description={`${doctors.length} in the catalogue · ${live} live on the site`} />

        <AdminDoctorsTable rows={doctors} specialties={specialties} />
      </PortalPage>
    </AdminLayout>
  );
}
