import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminDoctors } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Doctors | Admin Portal' };
export const dynamic = 'force-dynamic';

type Doctor = Awaited<ReturnType<typeof getAdminDoctors>>[number];

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
    key: 'hospital',
    header: 'Hospital',
    hideOnMobile: true,
    render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.hospital}</span>,
  },
  {
    key: 'cases',
    header: 'Cases',
    align: 'right',
    hideOnMobile: true,
    render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.cases}</span>,
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-300">
        {d.rating > 0 ? `${d.rating.toFixed(1)} (${d.reviewCount})` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (d) => (
      <div className="flex justify-end gap-1.5">
        {d.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={d.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {d.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export default async function AdminDoctorsPage() {
  await getPortalSession(['ADMIN']);
  const doctors = await getAdminDoctors();

  const specialties = [...new Set(doctors.map((d) => d.specialty))].sort();
  const live = doctors.filter((d) => d.published).length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Doctors" description={`${doctors.length} in the catalogue · ${live} live on the site`} />

        <DataTable
          rows={doctors}
          columns={columns}
          searchIn={(d) => `${d.name} ${d.specialty} ${d.designation} ${d.hospital}`}
          searchPlaceholder="Search by name, specialty or hospital…"
          filter={{
            label: 'All specialties',
            options: specialties.map((s) => ({ value: s, label: s })),
            matches: (d, value) => d.specialty === value,
          }}
          emptyTitle="No doctors in the catalogue"
          emptyDescription="Run the database seed, or add doctors to populate the public directory."
        />
      </PortalPage>
    </AdminLayout>
  );
}
