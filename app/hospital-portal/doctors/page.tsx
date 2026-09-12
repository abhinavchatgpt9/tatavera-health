import type { Metadata } from 'next';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, Pill } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalDoctors } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Doctors | Hospital Portal' };
export const dynamic = 'force-dynamic';

type Doctor = Awaited<ReturnType<typeof getHospitalDoctors>>[number];

const columns: Array<Column<Doctor>> = [
  {
    key: 'doctor',
    header: 'Doctor',
    render: (d) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{d.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{d.designation}</p>
      </>
    ),
  },
  { key: 'specialty', header: 'Specialty', render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.specialty}</span> },
  {
    key: 'experience',
    header: 'Experience',
    hideOnMobile: true,
    render: (d) => <span className="text-slate-500 dark:text-slate-400">{d.experience} yrs</span>,
  },
  {
    key: 'patients',
    header: 'Cases',
    align: 'right',
    render: (d) => <span className="font-medium text-slate-900 dark:text-white">{d.patients}</span>,
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    hideOnMobile: true,
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-300">
        {d.rating > 0 ? d.rating.toFixed(1) : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (d) => (
      <Pill className={d.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
        {d.published ? 'Published' : 'Hidden'}
      </Pill>
    ),
  },
];

export default async function HospitalDoctorsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const doctors = await getHospitalDoctors(session);

  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Doctors"
          description={`${doctors.length} ${doctors.length === 1 ? 'doctor' : 'doctors'} practising at your hospital`}
        />

        <DataTable
          rows={doctors}
          columns={columns}
          searchIn={(d) => `${d.name} ${d.specialty} ${d.designation}`}
          searchPlaceholder="Search by name or specialty…"
          filter={{
            label: 'All specialties',
            options: specialties.map((s) => ({ value: s, label: s })),
            matches: (d, value) => d.specialty === value,
          }}
          emptyTitle="No doctors linked yet"
          emptyDescription="Doctors appear here once an administrator links them to your hospital."
        />
      </PortalPage>
    </HospitalLayout>
  );
}
