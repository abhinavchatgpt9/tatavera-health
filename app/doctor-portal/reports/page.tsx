import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorReports } from '@/lib/portal-data';
import { DoctorReportsTable } from '@/components/portal/tables/doctor';

export const metadata: Metadata = { title: 'Reports | Doctor Portal' };
export const dynamic = 'force-dynamic';

export default async function DoctorReportsPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const reports = await getDoctorReports(session);

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title="Reports"
          description={`${reports.length} medical ${reports.length === 1 ? 'file' : 'files'} uploaded by your patients`}
        />

        <DoctorReportsTable rows={reports} />
      </PortalPage>
    </DoctorLayout>
  );
}
