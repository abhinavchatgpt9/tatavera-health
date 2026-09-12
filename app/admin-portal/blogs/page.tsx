import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminBlogPosts } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Blog | Admin Portal' };
export const dynamic = 'force-dynamic';

type Post = Awaited<ReturnType<typeof getAdminBlogPosts>>[number];

const columns: Array<Column<Post>> = [
  {
    key: 'post',
    header: 'Post',
    render: (p) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{p.title}</p>
        <p className="line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{p.excerpt}</p>
      </>
    ),
  },
  { key: 'category', header: 'Category', render: (p) => <span className="text-slate-600 dark:text-slate-300">{p.category}</span> },
  {
    key: 'author',
    header: 'Author',
    hideOnMobile: true,
    render: (p) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{p.authorName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{p.readTime} min read</p>
      </>
    ),
  },
  {
    key: 'published',
    header: 'Published',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{formatDate(p.publishedAt)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (p) => (
      <Pill className={p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {p.published ? 'Live' : 'Draft'}
      </Pill>
    ),
  },
];

export default async function AdminBlogsPage() {
  await getPortalSession(['ADMIN']);
  const posts = await getAdminBlogPosts();

  const live = posts.filter((p) => p.published).length;
  const categories = [...new Set(posts.map((p) => p.category))].sort();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Blog" description={`${posts.length} posts · ${live} live, ${posts.length - live} draft`} />

        <DataTable
          rows={posts}
          columns={columns}
          searchIn={(p) => `${p.title} ${p.excerpt} ${p.category} ${p.authorName}`}
          searchPlaceholder="Search by title, category or author…"
          filter={{
            label: 'All categories',
            options: categories.map((c) => ({ value: c, label: c })),
            matches: (p, value) => p.category === value,
          }}
          emptyTitle="No blog posts yet"
          emptyDescription="Blog posts are the main organic-search channel for a medical tourism business — worth investing in."
        />
      </PortalPage>
    </AdminLayout>
  );
}
