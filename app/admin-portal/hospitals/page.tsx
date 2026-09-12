import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminHospitals } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Hospitals | Admin Portal' };
export const dynamic = 'force-dynamic';

type Hospital = Awaited<ReturnType<typeof getAdminHospitals>>[number];

const columns: Array<Column<Hospital>> = [
  {
    key: 'hospital',
    header: 'Hospital',
    render: (h) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{h.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {h.city}, {h.country}
        </p>
      </>
    ),
  },
  {
    key: 'accreditations',
    header: 'Accreditations',
    hideOnMobile: true,
    render: (h) => (
      <span className="text-slate-600 dark:text-slate-300">
        {h.accreditations.length > 0 ? h.accreditations.join(', ') : '—'}
      </span>
    ),
  },
  {
    key: 'counts',
    header: 'Doctors / Depts',
    align: 'right',
    hideOnMobile: true,
    render: (h) => (
      <span className="text-slate-600 dark:text-slate-300">
        {h.doctors} / {h.departments}
      </span>
    ),
  },
  {
    key: 'leads',
    header: 'Leads',
    align: 'right',
    render: (h) => <span className="font-medium text-slate-900 dark:text-white">{h.leads}</span>,
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (h) => (
      <span className="text-slate-600 dark:text-slate-300">
        {h.rating > 0 ? `${h.rating.toFixed(1)} (${h.reviewCount})` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (h) => (
      <div className="flex justify-end gap-1.5">
        {h.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={h.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {h.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export default async function AdminHospitalsPage() {
  await getPortalSession(['ADMIN']);
  const hospitals = await getAdminHospitals();

  const countries = [...new Set(hospitals.map((h) => h.country))].sort();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Hospitals"
          description={`${hospitals.length} partner ${hospitals.length === 1 ? 'hospital' : 'hospitals'} across ${countries.length} ${countries.length === 1 ? 'country' : 'countries'}`}
        />

        <DataTable
          rows={hospitals}
          columns={columns}
          searchIn={(h) => `${h.name} ${h.city} ${h.country} ${h.accreditations.join(' ')}`}
          searchPlaceholder="Search by name, city or accreditation…"
          filter={{
            label: 'All countries',
            options: countries.map((c) => ({ value: c, label: c })),
            matches: (h, value) => h.country === value,
          }}
          emptyTitle="No hospitals in the catalogue"
          emptyDescription="Run the database seed, or add hospitals to populate the public directory."
        />
      </PortalPage>
    </AdminLayout>
  );
}
