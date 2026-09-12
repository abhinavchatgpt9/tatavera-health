import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorAppointments } from '@/lib/portal-data';
import { APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Appointments | Doctor Portal' };
export const dynamic = 'force-dynamic';

type Appointment = Awaited<ReturnType<typeof getDoctorAppointments>>[number];

const columns: Array<Column<Appointment>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (a) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{a.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{a.country}</p>
      </>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    render: (a) => <span className="text-slate-600 dark:text-slate-300">{a.type === 'VIDEO' ? 'Video' : 'In-person'}</span>,
  },
  {
    key: 'scheduled',
    header: 'Scheduled',
    render: (a) => (
      <>
        <span className="text-slate-600 dark:text-slate-300">{formatDateTime(a.scheduledAt)}</span>
        <p className="text-xs text-slate-400 dark:text-slate-500">{a.duration} min</p>
      </>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (a) => (
      <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>
    ),
  },
  {
    key: 'link',
    header: '',
    align: 'right',
    hideOnMobile: true,
    render: (a) =>
      a.meetLink ? (
        <a
          href={a.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
        >
          Join call
        </a>
      ) : (
        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
      ),
  },
];

export default async function DoctorAppointmentsPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const appointments = await getDoctorAppointments(session);

  const upcoming = appointments.filter((a) => new Date(a.scheduledAt) >= new Date()).length;

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader
          title="Appointments"
          description={`${appointments.length} total · ${upcoming} upcoming`}
        />

        <DataTable
          rows={appointments}
          columns={columns}
          searchIn={(a) => `${a.patient} ${a.country}`}
          searchPlaceholder="Search by patient name…"
          filter={{
            label: 'All statuses',
            options: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => ({
              value: s,
              label: s.charAt(0) + s.slice(1).toLowerCase(),
            })),
            matches: (a, value) => a.status === value,
          }}
          emptyTitle="No appointments booked"
          emptyDescription="Appointments appear here once patients book a consultation with you."
        />
      </PortalPage>
    </DoctorLayout>
  );
}
