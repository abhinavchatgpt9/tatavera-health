import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerQuotations } from '@/lib/portal-data';
import { CaseManagerQuotationsTable } from '@/components/portal/tables/case-manager';

export const metadata: Metadata = { title: 'Quotations | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerQuotationsPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const quotations = await getCaseManagerQuotations(session);

  const awaiting = quotations.filter((q) => q.status === 'SENT').length;
  const acceptedValue = quotations
    .filter((q) => q.status === 'ACCEPTED')
    .reduce((sum, q) => sum + q.totalAmount, 0);

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Quotations"
          description={`${quotations.length} received · ${awaiting} awaiting patient decision · ${formatMoney(acceptedValue)} accepted`}
        />

        <CaseManagerQuotationsTable rows={quotations} />
      </PortalPage>
    </CaseManagerLayout>
  );
}
