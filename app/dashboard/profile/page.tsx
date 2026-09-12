import type { Metadata } from 'next';

import DashboardLayout from '@/components/DashboardLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { prisma } from '@/lib/prisma';
import { ProfileClient } from './ProfileClient';

export const metadata: Metadata = { title: 'My Profile | Tatavera Health' };
export const dynamic = 'force-dynamic';

export default async function PatientProfilePage() {
  const session = await getPortalSession(['PATIENT', 'ADMIN']);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true, country: true, emergencyContact: true },
  });

  return (
    <DashboardLayout>
      <PortalPage>
        <PageHeader
          title="My Profile"
          description="Keep these up to date — your case manager and hospital use them to reach you."
        />

        <ProfileClient
          profile={
            user ?? {
              name: session.name,
              email: session.email,
              phone: null,
              country: null,
              emergencyContact: null,
            }
          }
        />
      </PortalPage>
    </DashboardLayout>
  );
}
