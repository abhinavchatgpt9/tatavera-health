import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, StatGrid, formatMoney } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminPayments } from '@/lib/portal-data';
import { AdminPaymentsTable } from '@/components/portal/tables/admin';

export const metadata: Metadata = { title: 'Payments | Admin Portal' };
export const dynamic = 'force-dynamic';

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

        <AdminPaymentsTable rows={rows} />
      </PortalPage>
    </AdminLayout>
  );
}
