import type { Metadata } from 'next';
import Link from 'next/link';

import HospitalLayout from '@/components/HospitalLayout';
import { PortalPage, PageHeader, StatGrid, Panel, PanelEmpty, Pill, formatMoney, formatDate } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import {
  getHospitalProfile,
  getHospitalDashboardStats,
  getHospitalLeads,
  getHospitalQuotations,
} from '@/lib/portal-data';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS, QUOTATION_STATUS_COLORS } from '@/lib/lead-stage';

export const metadata: Metadata = { title: 'Hospital Dashboard | Tatvavera Health' };
export const dynamic = 'force-dynamic';

export default async function HospitalDashboard() {
  const session = await getPortalSession(['HOSPITAL_ADMIN', 'ADMIN']);

  const [hospital, stats, leads, quotations] = await Promise.all([
    getHospitalProfile(session),
    getHospitalDashboardStats(session),
    getHospitalLeads(session),
    getHospitalQuotations(session),
  ]);

  if (!hospital) {
    return (
      <HospitalLayout>
        <PortalPage>
          <PageHeader title="No hospital linked" />
          <Panel title="What this means">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This account has the {session.role === 'ADMIN' ? 'ADMIN' : 'HOSPITAL_ADMIN'} role but is not linked to a
              hospital record, so there is nothing to show. An administrator can link it from{' '}
              <Link href="/admin-portal/users" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Admin → Users
              </Link>
              .
            </p>
          </Panel>
        </PortalPage>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>
      <PortalPage>
        <PageHeader
          title={hospital.name}
          description={`${hospital.city}, ${hospital.country}${hospital.accreditations.length ? ` · ${hospital.accreditations.join(', ')}` : ''}`}
        />

        <StatGrid
          stats={[
            { label: 'Active Leads', value: stats.activeLeads, emoji: '🎯' },
            { label: 'Pending Quotations', value: stats.pendingQuotations, emoji: '📋' },
            { label: 'Confirmed Value', value: formatMoney(stats.quotedValue), emoji: '💰', hint: 'Accepted quotations' },
            { label: 'Upcoming Appointments', value: stats.upcomingAppointments, emoji: '📅' },
          ]}
        />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Panel
            title="Recent Leads"
            actions={
              <Link href="/hospital-portal/leads" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            }
          >
            {leads.length === 0 ? (
              <PanelEmpty>No leads have been matched to your hospital yet.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {leads.slice(0, 5).map((lead) => (
                  <li key={lead.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{lead.name}</p>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                        {lead.country} · {lead.treatment}
                      </p>
                    </div>
                    <Pill className={LEAD_STAGE_COLORS[lead.stage] ?? 'bg-slate-100 text-slate-700'}>
                      {LEAD_STAGE_LABELS[lead.stage] ?? lead.stage}
                    </Pill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recent Quotations"
            actions={
              <Link href="/hospital-portal/quotations" className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                View all
              </Link>
            }
          >
            {quotations.length === 0 ? (
              <PanelEmpty>You have not issued any quotations yet.</PanelEmpty>
            ) : (
              <ul className="space-y-3">
                {quotations.slice(0, 5).map((q) => (
                  <li key={q.id} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{q.patient}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {formatMoney(q.totalAmount, q.currency)} · valid to {formatDate(q.validUntil)}
                      </p>
                    </div>
                    <Pill className={QUOTATION_STATUS_COLORS[q.status] ?? 'bg-slate-100 text-slate-700'}>{q.status}</Pill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Hospital at a glance">
          <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
            {[
              ['Doctors listed', String(stats.doctors)],
              ['Departments', String(stats.departments)],
              ['Beds', hospital.bedsCount ? String(hospital.bedsCount) : '—'],
              ['Founded', hospital.foundedYear ? String(hospital.foundedYear) : '—'],
              ['Rating', `${hospital.rating.toFixed(1)} (${hospital.reviewCount} reviews)`],
              ['Specialties', hospital.specialties.length ? `${hospital.specialties.length} listed` : '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-slate-400 dark:text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-900 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </PortalPage>
    </HospitalLayout>
  );
}
