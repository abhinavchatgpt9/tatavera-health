import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminBlogPosts } from '@/lib/portal-data';
import { AdminBlogTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Blog | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  await getPortalSession(['ADMIN']);
  const posts = await getAdminBlogPosts();

  const live = posts.filter((p) => p.published).length;
  const categories = [...new Set(posts.map((p) => p.category))].sort();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Blog" description={`${posts.length} posts · ${live} live, ${posts.length - live} draft`} />

        <AdminBlogTable rows={posts} categories={categories} />
      </PortalPage>
    </AdminLayout>
  );
}
