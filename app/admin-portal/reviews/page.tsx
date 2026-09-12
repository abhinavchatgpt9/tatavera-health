import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminReviews } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Reviews | Admin Portal' };
export const dynamic = 'force-dynamic';

type Review = Awaited<ReturnType<typeof getAdminReviews>>[number];

const columns: Array<Column<Review>> = [
  {
    key: 'author',
    header: 'Author',
    render: (r) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{r.author}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.country}</p>
      </>
    ),
  },
  {
    key: 'subject',
    header: 'About',
    render: (r) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{r.subject}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.subjectType}</p>
      </>
    ),
  },
  {
    key: 'review',
    header: 'Review',
    hideOnMobile: true,
    render: (r) => (
      <>
        {r.title && <p className="font-medium text-slate-700 dark:text-slate-200">{r.title}</p>}
        <p className="line-clamp-2 max-w-sm text-slate-600 dark:text-slate-300">{r.body}</p>
      </>
    ),
  },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (r) => <span className="font-medium text-slate-900 dark:text-white">{r.rating} / 5</span>,
  },
  {
    key: 'date',
    header: 'Date',
    align: 'right',
    hideOnMobile: true,
    render: (r) => <span className="text-slate-500 dark:text-slate-400">{formatDate(r.createdAt)}</span>,
  },
  {
    key: 'verified',
    header: 'Verified',
    align: 'right',
    render: (r) => (
      <Pill className={r.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {r.verified ? 'Verified' : 'Unverified'}
      </Pill>
    ),
  },
];

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

        <DataTable
          rows={reviews}
          columns={columns}
          searchIn={(r) => `${r.author} ${r.country} ${r.subject} ${r.title ?? ''} ${r.body}`}
          searchPlaceholder="Search by author, hospital, doctor or text…"
          filter={{
            label: 'All reviews',
            options: [
              { value: 'VERIFIED', label: 'Verified' },
              { value: 'UNVERIFIED', label: 'Unverified' },
              { value: 'LOW', label: 'Rated 3 or below' },
            ],
            matches: (r, value) =>
              value === 'VERIFIED' ? r.verified : value === 'UNVERIFIED' ? !r.verified : r.rating <= 3,
          }}
          emptyTitle="No reviews yet"
          emptyDescription="Reviews left by patients against a hospital or doctor appear here for moderation."
        />
      </PortalPage>
    </AdminLayout>
  );
}
