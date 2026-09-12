import type { Metadata } from 'next';
import { CalendarDays } from 'lucide-react';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader, Pill } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorAppointments } from '@/lib/portal-data';
import { APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Calendar | Doctor Portal' };
export const dynamic = 'force-dynamic';

export default async function DoctorCalendarPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const appointments = await getDoctorAppointments(session, { upcomingOnly: true });

  // Group by calendar day in the server's timezone; keys sort lexicographically
  // because they are ISO date strings.
  const grouped = new Map<string, typeof appointments>();
  for (const appointment of appointments) {
    const key = appointment.scheduledAt.slice(0, 10);
    grouped.set(key, [...(grouped.get(key) ?? []), appointment]);
  }
  const days = [...grouped.keys()].sort();

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader title="Calendar" description="Your upcoming appointments, grouped by day." />

        {days.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
            title="No upcoming appointments"
            description="Once patients book consultations with you, they will appear here in date order."
          />
        ) : (
          <div className="space-y-6">
            {days.map((dayKey) => {
              const date = new Date(`${dayKey}T00:00:00`);
              const dayAppointments = [...(grouped.get(dayKey) ?? [])].sort((a, b) =>
                a.scheduledAt.localeCompare(b.scheduledAt)
              );

              return (
                <section
                  key={dayKey}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900"
                >
                  <h2 className="mb-4 font-bold text-slate-900 dark:text-white">
                    {date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </h2>
                  <ul className="space-y-3">
                    {dayAppointments.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <time
                            dateTime={a.scheduledAt}
                            className="w-16 flex-shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-200"
                          >
                            {new Date(a.scheduledAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </time>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{a.patient}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              {a.type === 'VIDEO' ? 'Video consultation' : 'In-person'} · {a.duration} min
                            </p>
                          </div>
                        </div>
                        <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>
                          {a.status}
                        </Pill>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </PortalPage>
    </DoctorLayout>
  );
}
