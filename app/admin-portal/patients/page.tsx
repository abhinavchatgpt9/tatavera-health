import type { Metadata } from 'next';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminPatients } from '@/lib/portal-data';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Patients | Admin Portal' };
export const dynamic = 'force-dynamic';

type Patient = Awaited<ReturnType<typeof getAdminPatients>>[number];

const columns: Array<Column<Patient>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (p) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {p.email}
          {p.country ? ` · ${p.country}` : ''}
        </p>
      </>
    ),
  },
  {
    key: 'case',
    header: 'Case',
    render: (p) =>
      p.caseStatus ? (
        <Pill className={CASE_STATUS_COLORS[p.caseStatus] ?? 'bg-slate-100 text-slate-700'}>
          {CASE_STATUS_LABELS[p.caseStatus] ?? p.caseStatus}
        </Pill>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-500">No case open</span>
      ),
  },
  {
    key: 'treatment',
    header: 'Treatment',
    hideOnMobile: true,
    render: (p) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{p.treatment}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{p.hospital}</p>
      </>
    ),
  },
  {
    key: 'manager',
    header: 'Case manager',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{p.caseManager}</span>,
  },
  {
    key: 'activity',
    header: 'Files / Appts',
    align: 'right',
    render: (p) => (
      <span className="text-slate-600 dark:text-slate-300">
        {p.reports} / {p.appointments}
      </span>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    align: 'right',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{formatDate(p.createdAt)}</span>,
  },
];

export default async function AdminPatientsPage() {
  await getPortalSession(['ADMIN']);
  const patients = await getAdminPatients();

  const withCases = patients.filter((p) => p.caseStatus).length;

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Patients"
          description={`${patients.length} registered · ${withCases} with an open case`}
        />

        <DataTable
          rows={patients}
          columns={columns}
          searchIn={(p) => `${p.name} ${p.email} ${p.country ?? ''} ${p.treatment} ${p.hospital}`}
          searchPlaceholder="Search by name, email, country or treatment…"
          filter={{
            label: 'All case statuses',
            options: Object.entries(CASE_STATUS_LABELS).map(([value, label]) => ({ value, label })),
            matches: (p, value) => p.caseStatus === value,
          }}
          emptyTitle="No patients registered yet"
          emptyDescription="Patients appear here when they sign up on the public site or are created by a case manager."
        />
      </PortalPage>
    </AdminLayout>
  );
}
