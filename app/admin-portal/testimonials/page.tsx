import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminTestimonials } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Testimonials | Admin Portal' };
export const dynamic = 'force-dynamic';

type Testimonial = Awaited<ReturnType<typeof getAdminTestimonials>>[number];

const columns: Array<Column<Testimonial>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.patientName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{t.patientCountry}</p>
      </>
    ),
  },
  {
    key: 'quote',
    header: 'Quote',
    render: (t) => <p className="line-clamp-2 max-w-md text-slate-600 dark:text-slate-300">{t.quote}</p>,
  },
  {
    key: 'treatment',
    header: 'Treatment',
    hideOnMobile: true,
    render: (t) => <span className="text-slate-600 dark:text-slate-300">{t.treatment}</span>,
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (t) => <span className="text-slate-600 dark:text-slate-300">{t.rating} / 5</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (t) => (
      <div className="flex justify-end gap-1.5">
        {t.videoUrl && <Pill className="bg-purple-100 text-purple-700">Video</Pill>}
        {t.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={t.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {t.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export default async function AdminTestimonialsPage() {
  await getPortalSession(['ADMIN']);
  const testimonials = await getAdminTestimonials();

  const live = testimonials.filter((t) => t.published).length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Testimonials"
          description={`${testimonials.length} on file · ${live} live on the site`}
        />

        <DataTable
          rows={testimonials}
          columns={columns}
          searchIn={(t) => `${t.patientName} ${t.patientCountry} ${t.treatment} ${t.quote}`}
          searchPlaceholder="Search by patient, country or treatment…"
          filter={{
            label: 'All statuses',
            options: [
              { value: 'LIVE', label: 'Live' },
              { value: 'HIDDEN', label: 'Hidden' },
              { value: 'FEATURED', label: 'Featured' },
              { value: 'VIDEO', label: 'Has video' },
            ],
            matches: (t, value) =>
              value === 'LIVE'
                ? t.published
                : value === 'HIDDEN'
                  ? !t.published
                  : value === 'FEATURED'
                    ? t.featured
                    : Boolean(t.videoUrl),
          }}
          emptyTitle="No testimonials yet"
          emptyDescription="Patient stories are the single strongest trust signal on a medical tourism site."
        />

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Only publish testimonials from real patients who have given written consent to be quoted. Fabricated or
          unconsented stories expose the business to real legal risk.
        </p>
      </PortalPage>
    </AdminLayout>
  );
}
