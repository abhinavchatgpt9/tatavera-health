import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalQuotations, getHospitalLeads } from '@/lib/portal-data';
import { QuotationsClient } from './QuotationsClient';

export const metadata: Metadata = { title: 'Quotations | Hospital Portal' };
export const dynamic = 'force-dynamic';

export default async function HospitalQuotationsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);

  const [quotations, leads] = await Promise.all([getHospitalQuotations(session), getHospitalLeads(session)]);

  const accepted = quotations.filter((q) => q.status === 'ACCEPTED');
  const acceptedValue = accepted.reduce((sum, q) => sum + q.totalAmount, 0);

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Quotations"
          description={`${quotations.length} issued · ${accepted.length} accepted · ${formatMoney(acceptedValue)} confirmed`}
        />

        <QuotationsClient
          quotations={quotations}
          leads={leads.map((l) => ({ id: l.id, name: l.name, treatment: l.treatment }))}
        />
      </PortalPage>
    </HospitalLayout>
  );
}
