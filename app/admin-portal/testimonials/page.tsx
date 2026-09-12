import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminTestimonials } from '@/lib/portal-data';
import { AdminTestimonialsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Testimonials | Admin Portal' };
export const dynamic = 'force-dynamic';

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

        <AdminTestimonialsTable rows={testimonials} />
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Only publish testimonials from real patients who have given written consent to be quoted. Fabricated or
          unconsented stories expose the business to real legal risk.
        </p>
      </PortalPage>
    </AdminLayout>
  );
}
