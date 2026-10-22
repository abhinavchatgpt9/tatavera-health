import type { Metadata } from 'next';
import Link from 'next/link';

import DashboardLayout from '@/components/DashboardLayout';
import { PortalPage, PageHeader, Panel, PanelEmpty, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getPatientOverview } from '@/lib/portal-data';
import { APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'My Dashboard | Tatvavera Health' };
export const dynamic = 'force-dynamic';

const JOURNEY_STAGES = [
  { key: 'ENQUIRY_SUBMITTED', label: 'Enquiry Submitted' },
  { key: 'CASE_ASSIGNED', label: 'Case Assigned' },
  { key: 'CONSULTATION_SCHEDULED', label: 'Consultation' },
  { key: 'TRAVEL_PLANNED', label: 'Travel Planned' },
  { key: 'TREATMENT', label: 'Treatment' },
  { key: 'RECOVERY', label: 'Recovery' },
  { key: 'FOLLOW_UP', label: 'Follow-Up' },
  { key: 'COMPLETED', label: 'Completed' },
];

export default async function DashboardPage() {
  const session = await getPortalSession(['PATIENT', 'ADMIN']);
  const overview = await getPatientOverview(session);

  const currentIndex = overview.case
    ? JOURNEY_STAGES.findIndex((s) => s.key === overview.case?.status)
    : -1;
  const firstName = session.name.split(' ')[0];

  return (
    <DashboardLayout>
      <PortalPage>
        <PageHeader
          title={`Welcome back, ${firstName}`}
          description="Where your treatment journey stands right now."
        />

        {overview.case ? (
          <div className="mb-6 rounded-2xl bg-blue-600 p-6 text-white">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Your case status</h2>
              <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                {JOURNEY_STAGES[currentIndex]?.label ?? overview.case.status}
              </span>
            </div>

            <ol className="flex items-start justify-between gap-1">
              {JOURNEY_STAGES.map((stage, i) => {
                const done = currentIndex >= 0 && i <= currentIndex;
                return (
                  <li key={stage.key} className="flex flex-1 flex-col items-center text-center">
                    <span
                      aria-hidden="true"
                      className={`mb-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        done ? 'bg-white text-blue-600' : 'bg-white/25 text-white/70'
                      }`}
                    >
                      {done ? '✓' : i + 1}
                    </span>
                    <span className={`text-[0.65rem] leading-tight ${done ? 'text-white' : 'text-white/60'}`}>
                      {stage.label}
                    </span>
                  </li>
                );
              })}
            </ol>

            {overview.case.notes && (
              <p className="mt-5 rounded-xl bg-white/10 p-3 text-sm text-white/90">{overview.case.notes}</p>
            )}
          </div>
        ) : (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold text-slate-900 dark:text-white">No case open yet</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Once you submit an enquiry and a case manager picks it up, your treatment journey will show here step by
              step.{' '}
              <Link href="/free-consultation" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Request a free consultation
              </Link>{' '}
              to get started.
            </p>
          </div>
        )}

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Panel
            title="Upcoming appointments"
            actions={
              <Link href="/dashboard/appointments" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            }
          >
            {overview.appointments.length === 0 ? (
              <PanelEmpty>No appointments booked yet.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {overview.appointments.map((a) => (
                  <li key={a.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{a.doctor}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {a.specialty} · {formatDateTime(a.scheduledAt)}
                      </p>
                    </div>
                    <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>
                      {a.status}
                    </Pill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Your care team">
            {overview.case?.caseManager ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Case manager</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{overview.case.caseManager.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {overview.case.caseManager.phone}
                    {overview.case.caseManager.languages.length > 0 &&
                      ` · speaks ${overview.case.caseManager.languages.join(', ')}`}
                  </p>
                </div>
                {overview.case.doctor && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Doctor</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{overview.case.doctor.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{overview.case.doctor.specialty}</p>
                  </div>
                )}
                {overview.case.hospital && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Hospital</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{overview.case.hospital.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{overview.case.hospital.city}</p>
                  </div>
                )}
              </div>
            ) : (
              <PanelEmpty>Your care team appears here once a case manager is assigned.</PanelEmpty>
            )}
          </Panel>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/dashboard/reports"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview.reportCount}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Medical {overview.reportCount === 1 ? 'report' : 'reports'} uploaded
            </p>
          </Link>
          <Link
            href="/dashboard/messages"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview.unreadMessages}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Unread {overview.unreadMessages === 1 ? 'message' : 'messages'}
            </p>
          </Link>
        </div>
      </PortalPage>
    </DashboardLayout>
  );
}
