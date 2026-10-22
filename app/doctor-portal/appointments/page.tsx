import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorAppointments } from '@/lib/portal-data';
import { DoctorAppointmentsTable } from '@/components/portal/tables/doctor';

export const metadata: Metadata = { title: 'Appointments | Doctor Portal' };
export const dynamic = 'force-dynamic';

export default async function DoctorAppointmentsPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const appointments = await getDoctorAppointments(session);

  const upcoming = appointments.filter((a) => new Date(a.scheduledAt) >= new Date()).length;

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title="Appointments"
          description={`${appointments.length} total · ${upcoming} upcoming`}
        />

        <DoctorAppointmentsTable rows={appointments} />
      </PortalPage>
    </DoctorLayout>
  );
}
