import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerReports } from '@/lib/portal-data';
import { CaseManagerReportsTable } from '@/components/portal/tables/case-manager';

export const metadata: Metadata = { title: 'Reports | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerReportsPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const reports = await getCaseManagerReports(session);

  const patientCount = new Set(reports.map((r) => r.patient)).size;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Reports"
          description={`${reports.length} ${reports.length === 1 ? 'file' : 'files'} from ${patientCount} ${patientCount === 1 ? 'patient' : 'patients'}`}
        />

        <CaseManagerReportsTable rows={reports} />
      </PortalPage>
    </CaseManagerLayout>
  );
}
