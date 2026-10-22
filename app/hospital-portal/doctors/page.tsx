import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalDoctors } from '@/lib/portal-data';
import { HospitalDoctorsTable } from '@/components/portal/tables/hospital';

export const metadata: Metadata = { title: 'Doctors | Hospital Portal' };
export const dynamic = 'force-dynamic';

export default async function HospitalDoctorsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const doctors = await getHospitalDoctors(session);

  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Doctors"
          description={`${doctors.length} ${doctors.length === 1 ? 'doctor' : 'doctors'} practising at your hospital`}
        />

        <HospitalDoctorsTable rows={doctors} specialties={specialties} />
      </PortalPage>
    </HospitalLayout>
  );
}
