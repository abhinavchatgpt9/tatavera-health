import type { Metadata } from 'next';
import { Building2 } from 'lucide-react';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader } from '@/components/portal/PortalPage';
import { EmptyState } from '@/components/ui/EmptyState';
import { getPortalSession } from '@/lib/portal-session';
import { getHospitalDepartments } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Departments | Hospital Portal' };
export const dynamic = 'force-dynamic';

export default async function HospitalDepartmentsPage() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);
  const departments = await getHospitalDepartments(session);

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title="Departments"
          description={`${departments.length} ${departments.length === 1 ? 'department' : 'departments'} at your hospital`}
        />

        {departments.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-6 w-6" aria-hidden="true" />}
            title="No departments yet"
            description="Departments organise your specialties for patients browsing the public site."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <article
                key={d.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="font-semibold text-slate-900 dark:text-white">{d.name}</h2>
                {d.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-400">{d.description}</p>
                )}
                <dl className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400 dark:text-slate-500">Head</dt>
                    <dd className="text-right font-medium text-slate-900 dark:text-white">{d.headDoctor ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-slate-400 dark:text-slate-500">Doctors</dt>
                    <dd className="text-right font-medium text-slate-900 dark:text-white">{d.doctorCount}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </PortalPage>
    </HospitalLayout>
  );
}
