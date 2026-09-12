import type { Metadata } from 'next';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminEnquiries } from '@/lib/portal-data';
import { AdminEnquiriesTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Notifications | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  await getPortalSession(['ADMIN']);
  const enquiries = await getAdminEnquiries();

  const unhandled = enquiries.filter((e) => e.status === 'NEW').length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Notifications"
          description={
            unhandled === 0
              ? 'No new enquiries waiting. Everything has been picked up.'
              : `${unhandled} new ${unhandled === 1 ? 'enquiry' : 'enquiries'} waiting to be actioned.`
          }
        />

        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            This page lists incoming enquiries from the public site, newest first — the things that actually need a
            response. There is no push or email notification delivery yet; a case manager converts an enquiry into a
            lead from the{' '}
            <Link href="/admin-portal/crm" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              CRM
            </Link>
            .
          </p>
        </div>

        <AdminEnquiriesTable rows={enquiries} />
      </PortalPage>
    </AdminLayout>
  );
}
