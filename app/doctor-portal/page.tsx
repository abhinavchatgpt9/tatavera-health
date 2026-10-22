import type { Metadata } from 'next';
import Link from 'next/link';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader, StatGrid, Panel, PanelEmpty, Pill, formatDate, formatDateTime } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import {
  getDoctorProfile,
  getDoctorPatients,
  getDoctorAppointments,
  getDoctorDashboardStats,
} from '@/lib/portal-data';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS, APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Doctor Dashboard | Tatvavera Health' };
export const dynamic = 'force-dynamic';

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default async function DoctorDashboard() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);

  const [profile, patients, appointments, stats] = await Promise.all([
    getDoctorProfile(session),
    getDoctorPatients(session),
    getDoctorAppointments(session, { upcomingOnly: true }),
    getDoctorDashboardStats(session),
  ]);

  // An ADMIN can open this portal for oversight, and a DOCTOR account may not
  // have been linked to a Doctor profile yet — say so rather than rendering
  // zeroes that look like a broken page.
  if (!profile) {
    return (
      <DoctorLayout>
        <PortalPage>
          <PageHeader title="No doctor profile linked" />
          <Panel title="What this means">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This account has the {session.role === 'ADMIN' ? 'ADMIN' : 'DOCTOR'} role but is not linked to a doctor
              record, so there is no schedule or patient list to show. An administrator can link it from{' '}
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

  const todaysAppointments = appointments.filter((a) => isToday(a.scheduledAt));
  const firstName = profile.name.replace(/^Dr\.\s*/, '').split(' ')[0];

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title={`Welcome back, Dr. ${firstName}`}
          description="Your schedule and patient overview."
        />

        <StatGrid
          stats={[
            { label: "Today's Appointments", value: todaysAppointments.length, emoji: '📅' },
            { label: 'Total Patients', value: stats.totalPatients, emoji: '🧑‍🤝‍🧑' },
            { label: 'Opinions Given', value: stats.opinionsGiven, emoji: '🩺' },
            { label: 'Avg. Rating', value: profile.rating.toFixed(1), emoji: '⭐', hint: `${profile.reviewCount} reviews` },
          ]}
        />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Panel title="My Profile" actions={<Link href="/doctor-portal/profile" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">Edit</Link>}>
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl dark:bg-blue-900/40" aria-hidden="true">
                🩺
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">{profile.name}</p>
                <p className="truncate text-sm text-slate-500 dark:text-slate-400">{profile.designation}</p>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ['Specialty', profile.specialty],
                ['Hospital', profile.hospital],
                ['Experience', `${profile.experience} years`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-400 dark:text-slate-500">{label}</dt>
                  <dd className="text-right font-medium text-slate-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Today's Appointments" actions={<Link href="/doctor-portal/appointments" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">View all</Link>}>
            {todaysAppointments.length === 0 ? (
              <PanelEmpty>No appointments scheduled for today.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {todaysAppointments.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{a.patient}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {a.type === 'VIDEO' ? 'Video' : 'In-person'} · {formatDateTime(a.scheduledAt)}
                      </p>
                    </div>
                    <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="My Patients" actions={<Link href="/doctor-portal/patients" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">View all</Link>}>
          {patients.length === 0 ? (
            <PanelEmpty>No patients have been assigned to you yet.</PanelEmpty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-slate-400 dark:border-slate-800 dark:text-slate-500">
                    <th scope="col" className="pb-2 font-medium">Patient</th>
                    <th scope="col" className="pb-2 font-medium">Treatment</th>
                    <th scope="col" className="pb-2 font-medium">Stage</th>
                    <th scope="col" className="pb-2 text-right font-medium">Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.slice(0, 8).map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 dark:border-slate-800/50">
                      <td className="py-3">
                        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{p.country}</p>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{p.treatment}</td>
                      <td className="py-3">
                        <Pill className={CASE_STATUS_COLORS[p.stage] ?? 'bg-slate-100 text-slate-700'}>
                          {CASE_STATUS_LABELS[p.stage] ?? p.stage}
                        </Pill>
                      </td>
                      <td className="py-3 text-right text-slate-500 dark:text-slate-400">{formatDate(p.lastVisit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </PortalPage>
    </DoctorLayout>
  );
}
