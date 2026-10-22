import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';
import { PortalPage, PageHeader, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { getPortalSession } from '@/lib/portal-session';
import { getPatientAppointments } from '@/lib/portal-data';
import { APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Appointments | Tatvavera Health' };
export const dynamic = 'force-dynamic';

export default async function PatientAppointmentsPage() {
  const session = await getPortalSession(['PATIENT', 'ADMIN']);
  const appointments = await getPatientAppointments(session);

  const now = new Date();
  const upcoming = appointments.filter((a) => new Date(a.scheduledAt) >= now);
  const past = appointments.filter((a) => new Date(a.scheduledAt) < now);

  function Card({ a }: { a: (typeof appointments)[number] }) {
    return (
      <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white">{a.doctor}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{a.specialty}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {a.type === 'VIDEO' ? 'Video consultation' : 'In-person visit'} · {formatDateTime(a.scheduledAt)} ·{' '}
              {a.duration} min
            </p>
            {a.notes && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{a.notes}</p>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>
            {a.meetLink && new Date(a.scheduledAt) >= now && (
              <Button asChild size="sm">
                <a href={a.meetLink} target="_blank" rel="noopener noreferrer">
                  Join call
                </a>
              </Button>
            )}
          </div>
        </div>
      </li>
    );
  }

  return (
    <DashboardLayout>
      <PortalPage>
        <PageHeader
          title="Appointments"
          description={
            appointments.length === 0
              ? 'No appointments booked yet.'
              : `${upcoming.length} upcoming · ${past.length} past`
          }
        />

        {appointments.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
            title="No appointments yet"
            description="Your case manager books consultations on your behalf once your reports have been reviewed."
            action={
              <Button asChild>
                <Link href="/free-consultation">Request a consultation</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Upcoming
                </h2>
                <ul className="space-y-3">
                  {upcoming.map((a) => (
                    <Card key={a.id} a={a} />
                  ))}
                </ul>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Past
                </h2>
                <ul className="space-y-3">
                  {past.map((a) => (
                    <Card key={a.id} a={a} />
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </PortalPage>
    </DashboardLayout>
  );
}
