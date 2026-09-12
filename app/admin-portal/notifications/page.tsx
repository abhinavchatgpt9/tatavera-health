import type { Metadata } from 'next';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill, formatDateTime } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminEnquiries } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Notifications | Admin Portal' };
export const dynamic = 'force-dynamic';

type Enquiry = Awaited<ReturnType<typeof getAdminEnquiries>>[number];

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-indigo-100 text-indigo-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  CONVERTED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-700',
};

const columns: Array<Column<Enquiry>> = [
  {
    key: 'enquiry',
    header: 'Enquiry',
    render: (e) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{e.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {e.country} · {e.email} · {e.phone}
        </p>
      </>
    ),
  },
  {
    key: 'treatment',
    header: 'Interested in',
    render: (e) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{e.treatment}</p>
        {e.message && <p className="line-clamp-1 max-w-xs text-xs text-slate-400 dark:text-slate-500">{e.message}</p>}
      </>
    ),
  },
  {
    key: 'source',
    header: 'Source',
    hideOnMobile: true,
    render: (e) => <span className="text-slate-500 dark:text-slate-400">{e.source ?? 'Website'}</span>,
  },
  {
    key: 'received',
    header: 'Received',
    hideOnMobile: true,
    render: (e) => <span className="text-slate-500 dark:text-slate-400">{formatDateTime(e.createdAt)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (e) => (
      <div className="flex justify-end gap-1.5">
        {e.converted && <Pill className="bg-emerald-100 text-emerald-700">Lead created</Pill>}
        <Pill className={STATUS_COLORS[e.status] ?? 'bg-slate-100 text-slate-700'}>
          {e.status.replace(/_/g, ' ')}
        </Pill>
      </div>
    ),
  },
];

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

        <DataTable
          rows={enquiries}
          columns={columns}
          searchIn={(e) => `${e.name} ${e.email} ${e.phone} ${e.country} ${e.treatment} ${e.message ?? ''}`}
          searchPlaceholder="Search by name, email, country or treatment…"
          filter={{
            label: 'All statuses',
            options: Object.keys(STATUS_COLORS).map((value) => ({
              value,
              label: value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' '),
            })),
            matches: (e, value) => e.status === value,
          }}
          emptyTitle="No enquiries yet"
          emptyDescription="Enquiries submitted through the public site's forms land here first."
        />
      </PortalPage>
    </AdminLayout>
  );
}
