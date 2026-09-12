import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorOpinions, getDoctorPatients } from '@/lib/portal-data';
import { OpinionsClient } from './OpinionsClient';

export const metadata: Metadata = { title: 'Medical Opinions | Doctor Portal' };
export const dynamic = 'force-dynamic';

export default async function DoctorOpinionsPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);

  const [opinions, patients] = await Promise.all([getDoctorOpinions(session), getDoctorPatients(session)]);

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title="Medical Opinions"
          description="Second opinions and clinical summaries for your patients."
        />

        <OpinionsClient
          opinions={opinions}
          cases={patients.map((p) => ({ id: p.id, name: p.name, treatment: p.treatment }))}
        />
      </PortalPage>
    </DoctorLayout>
  );
}
