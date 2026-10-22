import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorPatients } from '@/lib/portal-data';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '@/lib/lead-stage';
import { DoctorPatientsTable } from '@/components/portal/tables/doctor';

export const metadata: Metadata = { title: 'Patients | Doctor Portal' };
export const dynamic = 'force-dynamic';


export default async function DoctorPatientsPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const patients = await getDoctorPatients(session);

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader title="Patients" description={`${patients.length} ${patients.length === 1 ? 'patient' : 'patients'} under your care`} />

        <DoctorPatientsTable rows={patients} />
      </PortalPage>
    </DoctorLayout>
  );
}
