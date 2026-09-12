import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminDestinations } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Countries | Admin Portal' };
export const dynamic = 'force-dynamic';

type Destination = Awaited<ReturnType<typeof getAdminDestinations>>[number];

const columns: Array<Column<Destination>> = [
  {
    key: 'country',
    header: 'Country',
    render: (d) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{d.country}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {d.countryCode} · /{d.slug}
        </p>
      </>
    ),
  },
  {
    key: 'specialties',
    header: 'Top specialties',
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-300">
        {d.topSpecialties.length > 0 ? d.topSpecialties.join(', ') : '—'}
      </span>
    ),
  },
  {
    key: 'leads',
    header: 'Patients from here',
    align: 'right',
    render: (d) => <span className="font-medium text-slate-900 dark:text-white">{d.leads}</span>,
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

export default async function AdminCountriesPage() {
  await getPortalSession(['ADMIN']);
  const destinations = await getAdminDestinations();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Countries"
          description={`${destinations.length} destination ${destinations.length === 1 ? 'page' : 'pages'}. Lead counts show where patients are travelling from.`}
        />

        <DataTable
          rows={destinations}
          columns={columns}
          searchIn={(d) => `${d.country} ${d.countryCode} ${d.topSpecialties.join(' ')}`}
          searchPlaceholder="Search by country or specialty…"
          filter={{
            label: 'All statuses',
            options: [
              { value: 'LIVE', label: 'Live' },
              { value: 'HIDDEN', label: 'Hidden' },
              { value: 'FEATURED', label: 'Featured' },
            ],
            matches: (d, value) =>
              value === 'LIVE' ? d.published : value === 'HIDDEN' ? !d.published : d.featured,
          }}
          emptyTitle="No destination pages"
          emptyDescription="Destination pages explain what treatment in a country involves — visa, travel and accommodation."
        />
      </PortalPage>
    </AdminLayout>
  );
}
