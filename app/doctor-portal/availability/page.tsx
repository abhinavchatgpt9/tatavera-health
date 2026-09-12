import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorAvailability } from '@/lib/portal-data';
import { AvailabilityClient } from './AvailabilityClient';

export const metadata: Metadata = { title: 'Availability | Doctor Portal' };
export const dynamic = 'force-dynamic';

export default async function DoctorAvailabilityPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const days = await getDoctorAvailability(session);

  const totalSlots = days.reduce((sum, day) => sum + day.slots.length, 0);

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title="Availability"
          description={
            totalSlots === 0
              ? 'Add consulting hours so patients can book with you.'
              : `${totalSlots} consulting ${totalSlots === 1 ? 'window' : 'windows'} across the week.`
          }
        />

        <AvailabilityClient days={days} />
      </PortalPage>
    </DoctorLayout>
  );
}
