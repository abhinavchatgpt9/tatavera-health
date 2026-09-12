import type { Metadata } from 'next';
import Link from 'next/link';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, Panel } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalProfile } from '@/lib/portal-data';
import { SettingsClient } from './SettingsClient';

export const metadata: Metadata = { title: 'Settings | Hospital Portal' };
export const dynamic = 'force-dynamic';

export default async function HospitalSettingsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const hospital = await getHospitalProfile(session);

  if (!hospital) {
    return (
      <HospitalLayout>
        <PortalPage>
          <PageHeader title="Settings" />
          <Panel title="No hospital linked">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This account is not linked to a hospital record, so there is nothing to configure. An administrator can
              link it from{' '}
              <Link href="/admin-portal/users" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Admin → Users
              </Link>
              .
            </p>
          </Panel>
        </PortalPage>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Settings"
          description="These details appear on your public hospital page and in patient quotations."
        />

        <SettingsClient
          hospital={{
            name: hospital.name,
            city: hospital.city,
            country: hospital.country,
            description: hospital.description,
            accreditations: hospital.accreditations,
            specialties: hospital.specialties,
          }}
        />
      </PortalPage>
    </HospitalLayout>
  );
}
