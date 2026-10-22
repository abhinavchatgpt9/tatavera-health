import type { Metadata } from 'next';
import Link from 'next/link';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader, Panel, PanelEmpty } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorProfile } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Profile | Doctor Portal' };
export const dynamic = 'force-dynamic';

function List({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) return <PanelEmpty>{empty}</PanelEmpty>;
  return (
    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function DoctorProfilePage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const profile = await getDoctorProfile(session);

  if (!profile) {
    return (
      <DoctorLayout>
        <PortalPage>
          <PageHeader title="Profile" />
          <Panel title="No doctor profile linked">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This account is not linked to a doctor record yet, so there is no profile to show. An administrator can
              link it from{' '}
              <Link href="/admin-portal/doctors" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Admin → Doctors
              </Link>
              .
            </p>
          </Panel>
        </PortalPage>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title="Profile"
          description="What patients see on your public profile page."
        />

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-start gap-5">
            <div
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-3xl dark:bg-blue-900/40"
              aria-hidden="true"
            >
              🩺
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h2>
              <p className="text-slate-500 dark:text-slate-400">{profile.designation}</p>
              <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                {[
                  ['Specialty', profile.specialty],
                  ['Hospital', profile.hospital],
                  ['Experience', `${profile.experience} years`],
                  ['Rating', `${profile.rating.toFixed(1)} from ${profile.reviewCount} reviews`],
                  ['Languages', profile.languages.join(', ') || '—'],
                  ['Account email', session.email],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-slate-400 dark:text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <Panel title="About">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{profile.about}</p>
          </Panel>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Panel title="Qualifications">
            <List items={profile.qualifications} empty="No qualifications recorded." />
          </Panel>
          <Panel title="Achievements">
            <List items={profile.achievements} empty="No achievements recorded." />
          </Panel>
        </div>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          To change any of this, contact your administrator — doctor records are managed centrally so that public
          profiles stay consistent and verifiable.
        </p>
      </PortalPage>
    </DoctorLayout>
  );
}
