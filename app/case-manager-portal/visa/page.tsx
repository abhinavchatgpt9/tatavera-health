import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerVisaStatuses } from '@/lib/portal-data';
import { CaseManagerVisaTable } from '@/components/portal/tables/case-manager';

export const metadata: Metadata = { title: 'Visa | Case Manager Portal' };
export const dynamic = 'force-dynamic';

const VISA_STAGES = [
  { value: 'NOT_STARTED', label: 'Not started' },
  { value: 'DOCUMENTS_PENDING', label: 'Documents pending' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'INTERVIEW_SCHEDULED', label: 'Interview scheduled' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];


export default async function CaseManagerVisaPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const rows = await getCaseManagerVisaStatuses(session);

  const approved = rows.filter((r) => r.stage === 'APPROVED').length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Visa"
          description={`${rows.length} visa ${rows.length === 1 ? 'case' : 'cases'} · ${approved} approved`}
        />

        <CaseManagerVisaTable rows={rows} />
      </PortalPage>
    </CaseManagerLayout>
  );
}
