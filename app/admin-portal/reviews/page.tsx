import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminReviews } from '@/lib/portal-data';
import { AdminReviewsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Reviews | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  await getPortalSession(['ADMIN']);
  const reviews = await getAdminReviews();

  const verified = reviews.filter((r) => r.verified).length;
  const average =
    reviews.length === 0 ? 0 : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Reviews"
          description={
            reviews.length === 0
              ? 'No reviews submitted yet.'
              : `${reviews.length} reviews · ${verified} verified · ${average} average rating`
          }
        />

        <AdminReviewsTable rows={reviews} />
      </PortalPage>
    </AdminLayout>
  );
}
