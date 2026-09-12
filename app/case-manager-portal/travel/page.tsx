import type { Metadata } from 'next';

import CaseManagerLayout from '@/components/CaseManagerLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getCaseManagerTravelStatuses } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Travel | Case Manager Portal' };
export const dynamic = 'force-dynamic';

type TravelRow = Awaited<ReturnType<typeof getCaseManagerTravelStatuses>>[number];

const columns: Array<Column<TravelRow>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.lead}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">from {t.patientCountry}</p>
      </>
    ),
  },
  {
    key: 'arrival',
    header: 'Arrival',
    render: (t) => <span className="text-slate-600 dark:text-slate-300">{formatDate(t.arrivalDate)}</span>,
  },
  {
    key: 'departure',
    header: 'Departure',
    render: (t) => <span className="text-slate-600 dark:text-slate-300">{formatDate(t.departureDate)}</span>,
  },
  {
    key: 'accommodation',
    header: 'Accommodation',
    hideOnMobile: true,
    render: (t) => <span className="text-slate-500 dark:text-slate-400">{t.accommodation ?? 'Not booked'}</span>,
  },
  {
    key: 'pickup',
    header: 'Airport pickup',
    align: 'right',
    render: (t) => (
      <Pill className={t.pickupArranged ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {t.pickupArranged ? 'Arranged' : 'Pending'}
      </Pill>
    ),
  },
];

export default async function CaseManagerTravelPage() {
  const session = await getPortalSession(['CASE_MANAGER', 'ADMIN']);
  const rows = await getCaseManagerTravelStatuses(session);

  const pendingPickups = rows.filter((r) => !r.pickupArranged).length;

  return (
    <CaseManagerLayout>
      <PortalPage>
        <PageHeader
          title="Travel"
          description={
            rows.length === 0
              ? 'No travel arrangements yet.'
              : `${rows.length} ${rows.length === 1 ? 'itinerary' : 'itineraries'} · ${pendingPickups} pickup${pendingPickups === 1 ? '' : 's'} still to arrange`
          }
        />

        <DataTable
          rows={rows}
          columns={columns}
          searchIn={(t) => `${t.lead} ${t.patientCountry} ${t.accommodation ?? ''}`}
          searchPlaceholder="Search by patient or accommodation…"
          filter={{
            label: 'All pickups',
            options: [
              { value: 'ARRANGED', label: 'Pickup arranged' },
              { value: 'PENDING', label: 'Pickup pending' },
            ],
            matches: (t, value) => (value === 'ARRANGED' ? t.pickupArranged : !t.pickupArranged),
          }}
          emptyTitle="No travel arrangements yet"
          emptyDescription="A travel record is created once a lead reaches the travel arranged stage."
        />
      </PortalPage>
    </CaseManagerLayout>
  );
}
