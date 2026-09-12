import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, StatGrid, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminPayments } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Payments | Admin Portal' };
export const dynamic = 'force-dynamic';

type Row = Awaited<ReturnType<typeof getAdminPayments>>['rows'][number];

const columns: Array<Column<Row>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (r) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{r.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.country}</p>
      </>
    ),
  },
  { key: 'hospital', header: 'Hospital', render: (r) => <span className="text-slate-600 dark:text-slate-300">{r.hospital}</span> },
  {
    key: 'date',
    header: 'Last updated',
    hideOnMobile: true,
    render: (r) => <span className="text-slate-500 dark:text-slate-400">{formatDate(r.date)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <Pill className={r.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {r.status === 'CONFIRMED' ? 'Accepted' : 'Awaiting acceptance'}
      </Pill>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (r) => <span className="font-medium text-slate-900 dark:text-white">{formatMoney(r.amount, r.currency)}</span>,
  },
];

export default async function AdminPaymentsPage() {
  await getPortalSession(['ADMIN']);
  const { rows, totals } = await getAdminPayments();

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Payments" description="Billed value from quotations, by patient and hospital." />

        <StatGrid
          stats={[
            { label: 'Accepted Value', value: formatMoney(totals.confirmed), emoji: '✅' },
            { label: 'Awaiting Acceptance', value: formatMoney(totals.awaiting), emoji: '⏳' },
            { label: 'Quotations', value: rows.length, emoji: '📋' },
            {
              label: 'Average Case Value',
              value: rows.length === 0 ? formatMoney(0) : formatMoney(Math.round((totals.confirmed + totals.awaiting) / rows.length)),
              emoji: '📊',
            },
          ]}
        />

        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            <strong>These are billed amounts, not settled payments.</strong> No payment gateway is connected, so this
            page reports the value of quotations patients have accepted — it cannot tell you what has actually been
            paid. Integrating Razorpay or Stripe would close that gap.
          </p>
        </div>

        <DataTable
          rows={rows}
          columns={columns}
          searchIn={(r) => `${r.patient} ${r.country} ${r.hospital}`}
          searchPlaceholder="Search by patient or hospital…"
          filter={{
            label: 'All statuses',
            options: [
              { value: 'CONFIRMED', label: 'Accepted' },
              { value: 'AWAITING_ACCEPTANCE', label: 'Awaiting acceptance' },
            ],
            matches: (r, value) => r.status === value,
          }}
          emptyTitle="No billable quotations yet"
          emptyDescription="Once hospitals send quotations and patients accept them, the value appears here."
        />
      </PortalPage>
    </AdminLayout>
  );
}
