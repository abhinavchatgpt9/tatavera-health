import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalAppointments } from '@/lib/portal-data';
import { APPOINTMENT_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Appointments | Hospital Portal' };
export const dynamic = 'force-dynamic';

type Appointment = Awaited<ReturnType<typeof getHospitalAppointments>>[number];

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
    key: 'doctor',
    header: 'Doctor',
    render: (a) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{a.doctor}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{a.specialty}</p>
      </>
    ),
  },
  {
    key: 'type',
    header: 'Type',
    hideOnMobile: true,
    render: (a) => <span className="text-slate-600 dark:text-slate-300">{a.type === 'VIDEO' ? 'Video' : 'In-person'}</span>,
  },
  {
    key: 'scheduled',
    header: 'Scheduled',
    render: (a) => <span className="text-slate-500 dark:text-slate-400">{formatDateTime(a.scheduledAt)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (a) => (
      <Pill className={APPOINTMENT_STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-700'}>{a.status}</Pill>
    ),
  },
];

export default async function HospitalAppointmentsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const appointments = await getHospitalAppointments(session);

  const upcoming = appointments.filter((a) => new Date(a.scheduledAt) >= new Date()).length;

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader title="Appointments" description={`${appointments.length} total · ${upcoming} upcoming`} />

        <DataTable
          rows={appointments}
          columns={columns}
          searchIn={(a) => `${a.patient} ${a.country} ${a.doctor} ${a.specialty}`}
          searchPlaceholder="Search by patient or doctor…"
          filter={{
            label: 'All statuses',
            options: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => ({
              value: s,
              label: s.charAt(0) + s.slice(1).toLowerCase(),
            })),
            matches: (a, value) => a.status === value,
          }}
          emptyTitle="No appointments booked"
          emptyDescription="Consultations booked with your doctors appear here."
        />
      </PortalPage>
    </HospitalLayout>
  );
}
