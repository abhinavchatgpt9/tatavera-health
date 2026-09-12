import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminPatients } from '@/lib/portal-data';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '@/lib/lead-stage';
import { AdminPatientsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Patients | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminPatientsPage() {
  await getPortalSession(['ADMIN']);
  const patients = await getAdminPatients();

  const withCases = patients.filter((p) => p.caseStatus).length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Patients"
          description={`${patients.length} registered · ${withCases} with an open case`}
        />

        <AdminPatientsTable rows={patients} />
      </PortalPage>
    </AdminLayout>
  );
}
