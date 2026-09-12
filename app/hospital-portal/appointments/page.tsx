import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalAppointments } from '@/lib/portal-data';
import { HospitalAppointmentsTable } from '@/components/portal/tables/hospital';

export const metadata: Metadata = { title: 'Appointments | Hospital Portal' };
export const dynamic = 'force-dynamic';

export default async function HospitalAppointmentsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const appointments = await getHospitalAppointments(session);

  const upcoming = appointments.filter((a) => new Date(a.scheduledAt) >= new Date()).length;

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader title="Appointments" description={`${appointments.length} total · ${upcoming} upcoming`} />

        <HospitalAppointmentsTable rows={appointments} />
      </PortalPage>
    </HospitalLayout>
  );
}
