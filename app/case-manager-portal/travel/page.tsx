import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerTravelStatuses } from '@/lib/portal-data';
import { CaseManagerTravelTable } from '@/components/portal/tables/case-manager';

export const metadata: Metadata = { title: 'Travel | Case Manager Portal' };
export const dynamic = 'force-dynamic';

export default async function CaseManagerTravelPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const rows = await getCaseManagerTravelStatuses(session);

  const pendingPickups = rows.filter((r) => !r.pickupArranged).length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Travel"
          description={
            rows.length === 0
              ? 'No travel arrangements yet.'
              : `${rows.length} ${rows.length === 1 ? 'itinerary' : 'itineraries'} · ${pendingPickups} pickup${pendingPickups === 1 ? '' : 's'} still to arrange`
          }
        />

        <CaseManagerTravelTable rows={rows} />
      </PortalPage>
    </CaseManagerLayout>
  );
}
