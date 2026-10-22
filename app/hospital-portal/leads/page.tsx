import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalLeads } from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS } from '@/lib/lead-stage';
import { HospitalLeadsTable } from '@/components/portal/tables/hospital';

export const metadata: Metadata = { title: 'Leads | Hospital Portal' };
export const dynamic = 'force-dynamic';

export default async function HospitalLeadsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const leads = await getHospitalLeads(session);

  const pipelineValue = leads.reduce((sum, l) => sum + (l.value ?? 0), 0);

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Leads"
          description={`${leads.length} matched to your hospital · ${formatMoney(pipelineValue)} total pipeline`}
        />

        <HospitalLeadsTable rows={leads} />
      </PortalPage>
    </HospitalLayout>
  );
}
