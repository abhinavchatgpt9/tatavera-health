import type { Metadata } from 'next';

import DoctorLayout from '@/components/DoctorLayout';
import { PortalPage, PageHeader, Pill, formatDate } from '@/components/portal/PortalPage';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { getPortalSession } from '@/lib/portal-session';
import { getDoctorPatients } from '@/lib/portal-data';
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Patients | Doctor Portal' };
export const dynamic = 'force-dynamic';

type Patient = Awaited<ReturnType<typeof getDoctorPatients>>[number];

const CASE_STAGES = ['CONSULTATION_SCHEDULED', 'TREATMENT', 'RECOVERY', 'FOLLOW_UP', 'COMPLETED'];

const columns: Array<Column<Patient>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (p) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{p.country}</p>
      </>
    ),
  },
  { key: 'treatment', header: 'Treatment', render: (p) => <span className="text-slate-600 dark:text-slate-300">{p.treatment}</span> },
  {
    key: 'stage',
    header: 'Stage',
    render: (p) => (
      <Pill className={CASE_STATUS_COLORS[p.stage] ?? 'bg-slate-100 text-slate-700'}>
        {CASE_STATUS_LABELS[p.stage] ?? p.stage}
      </Pill>
    ),
  },
  {
    key: 'lastVisit',
    header: 'Last Visit',
    align: 'right',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{formatDate(p.lastVisit)}</span>,
  },
];

export default async function DoctorPatientsPage() {
  const session = await getPortalSession(['DOCTOR', 'ADMIN']);
  const patients = await getDoctorPatients(session);

  return (
    <DoctorLayout>
      <PortalPage>
        <PageHeader title="Patients" description={`${patients.length} ${patients.length === 1 ? 'patient' : 'patients'} under your care`} />

        <DataTable
          rows={patients}
          columns={columns}
          searchIn={(p) => `${p.name} ${p.country} ${p.treatment}`}
          searchPlaceholder="Search by name, country or treatment…"
          filter={{
            label: 'All stages',
            options: CASE_STAGES.map((s) => ({ value: s, label: CASE_STATUS_LABELS[s] ?? s })),
            matches: (p, value) => p.stage === value,
          }}
          emptyTitle="No patients assigned yet"
          emptyDescription="Patients appear here once a case manager assigns a case to you."
        />
      </PortalPage>
    </DoctorLayout>
  );
}
