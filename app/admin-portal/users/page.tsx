import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminUsers } from '@/lib/portal-data';
import { UsersClient } from './UsersClient';

export const metadata: Metadata = { title: 'Users | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  await getPortalSession(['ADMIN']);
  const users = await getAdminUsers();

  const staff = users.filter((u) => u.role !== 'PATIENT').length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Users"
          description={`${users.length} accounts · ${staff} staff, ${users.length - staff} patients`}
        />

        <UsersClient users={users} />
      </PortalPage>
    </AdminLayout>
  );
}
