import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerQuotations } from '@/lib/portal-data';
import { QUOTATION_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Quotations | Case Manager Portal' };
export const dynamic = 'force-dynamic';

type Quotation = Awaited<ReturnType<typeof getCaseManagerQuotations>>[number];

const columns: Array<Column<Quotation>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (q) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{q.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {q.country} · {q.treatment}
        </p>
      </>
    ),
  },
  { key: 'hospital', header: 'Hospital', render: (q) => <span className="text-slate-600 dark:text-slate-300">{q.hospital}</span> },
  {
    key: 'status',
    header: 'Status',
    render: (q) => <Pill className={QUOTATION_STATUS_COLORS[q.status] ?? 'bg-slate-100 text-slate-700'}>{q.status}</Pill>,
  },
  {
    key: 'valid',
    header: 'Valid until',
    hideOnMobile: true,
    render: (q) => <span className="text-slate-500 dark:text-slate-400">{formatDate(q.validUntil)}</span>,
  },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    render: (q) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{formatMoney(q.totalAmount, q.currency)}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {q.itemCount} {q.itemCount === 1 ? 'line' : 'lines'}
        </p>
      </>
    ),
  },
];

export default async function CaseManagerQuotationsPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const quotations = await getCaseManagerQuotations(session);

  const awaiting = quotations.filter((q) => q.status === 'SENT').length;
  const acceptedValue = quotations
    .filter((q) => q.status === 'ACCEPTED')
    .reduce((sum, q) => sum + q.totalAmount, 0);

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Quotations"
          description={`${quotations.length} received · ${awaiting} awaiting patient decision · ${formatMoney(acceptedValue)} accepted`}
        />

        <DataTable
          rows={quotations}
          columns={columns}
          searchIn={(q) => `${q.patient} ${q.country} ${q.hospital} ${q.treatment}`}
          searchPlaceholder="Search by patient or hospital…"
          filter={{
            label: 'All statuses',
            options: ['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED'].map((s) => ({
              value: s,
              label: s.charAt(0) + s.slice(1).toLowerCase(),
            })),
            matches: (q, value) => q.status === value,
          }}
          emptyTitle="No quotations yet"
          emptyDescription="Hospitals issue quotations against your leads — they appear here as soon as they do."
        />
      </PortalPage>
    </CaseManagerLayout>
  );
}
