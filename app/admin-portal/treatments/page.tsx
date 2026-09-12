import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill, formatMoney } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminTreatments } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Treatments | Admin Portal' };
export const dynamic = 'force-dynamic';

type Treatment = Awaited<ReturnType<typeof getAdminTreatments>>[number];

const columns: Array<Column<Treatment>> = [
  {
    key: 'treatment',
    header: 'Treatment',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">/{t.slug}</p>
      </>
    ),
  },
  { key: 'specialty', header: 'Specialty', render: (t) => <span className="text-slate-600 dark:text-slate-300">{t.specialty}</span> },
  {
    key: 'cost',
    header: 'Cost range',
    render: (t) => (
      <span className="text-slate-600 dark:text-slate-300">
        {t.costFrom !== null && t.costTo !== null
          ? `${formatMoney(t.costFrom, t.currency)} – ${formatMoney(t.costTo, t.currency)}`
          : '—'}
      </span>
    ),
  },
  {
    key: 'duration',
    header: 'Duration',
    hideOnMobile: true,
    render: (t) => <span className="text-slate-500 dark:text-slate-400">{t.duration ?? '—'}</span>,
  },
  {
    key: 'linked',
    header: 'Hospitals / FAQs',
    align: 'right',
    hideOnMobile: true,
    render: (t) => (
      <span className="text-slate-600 dark:text-slate-300">
        {t.hospitals} / {t.faqs}
      </span>
    ),
  },
  {
    key: 'enquiries',
    header: 'Enquiries',
    align: 'right',
    render: (t) => <span className="font-medium text-slate-900 dark:text-white">{t.enquiries}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (t) => (
      <Pill className={t.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
        {t.published ? 'Live' : 'Hidden'}
      </Pill>
    ),
  },
];

export default async function AdminTreatmentsPage() {
  await getPortalSession(['ADMIN']);
  const treatments = await getAdminTreatments();

  const specialties = [...new Set(treatments.map((t) => t.specialty))].sort();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Treatments"
          description={`${treatments.length} in the catalogue across ${specialties.length} ${specialties.length === 1 ? 'specialty' : 'specialties'}`}
        />

        <DataTable
          rows={treatments}
          columns={columns}
          searchIn={(t) => `${t.name} ${t.specialty} ${t.slug}`}
          searchPlaceholder="Search by treatment or specialty…"
          filter={{
            label: 'All specialties',
            options: specialties.map((s) => ({ value: s, label: s })),
            matches: (t, value) => t.specialty === value,
          }}
          emptyTitle="No treatments in the catalogue"
          emptyDescription="Treatments drive the public procedure pages and the enquiry form's dropdown."
        />
      </PortalPage>
    </AdminLayout>
  );
}
