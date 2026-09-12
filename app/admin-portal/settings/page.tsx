import type { Metadata } from 'next';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Panel } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminContentCounts, getAdminStats } from '@/lib/portal-data';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata: Metadata = { title: 'Settings | Admin Portal' };
export const dynamic = 'force-dynamic';

/** Environment variables the app reads, and whether they are actually set. */
function integrationStatus() {
  return [
    { name: 'Database (Postgres)', env: 'DATABASE_URL', set: Boolean(process.env.DATABASE_URL), purpose: 'Every page and API route' },
    { name: 'Auth signing key', env: 'JWT_SECRET', set: Boolean(process.env.JWT_SECRET), purpose: 'Login sessions and 2FA' },
    { name: 'Email (Resend)', env: 'RESEND_API_KEY', set: Boolean(process.env.RESEND_API_KEY), purpose: 'Signup verification, login OTP' },
    { name: 'SMS (Twilio)', env: 'TWILIO_ACCOUNT_SID', set: Boolean(process.env.TWILIO_ACCOUNT_SID), purpose: 'Phone login OTP' },
    { name: 'File storage (AWS S3)', env: 'AWS_S3_BUCKET', set: Boolean(process.env.AWS_S3_BUCKET), purpose: 'Patient report uploads' },
    { name: 'AI chatbot', env: 'GEMINI_API_KEY', set: Boolean(process.env.GEMINI_API_KEY), purpose: 'The Aria assistant on the public site' },
    { name: 'Analytics', env: 'NEXT_PUBLIC_GA_MEASUREMENT_ID', set: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID), purpose: 'Traffic and conversion tracking' },
  ];
}

export default async function AdminSettingsPage() {
  const session = await getPortalSession(['ADMIN']);
  const [stats, counts] = await Promise.all([getAdminStats(), getAdminContentCounts()]);

  const integrations = integrationStatus();
  const missing = integrations.filter((i) => !i.set);

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader title="Settings" description="Platform configuration and integration status." />

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Panel title="Site">
            <dl className="space-y-2 text-sm">
              {[
                ['Name', SITE_NAME],
                ['URL', SITE_URL],
                ['Contact email', CONTACT_EMAIL],
                ['WhatsApp', WHATSAPP_NUMBER],
                ['Signed in as', `${session.name} (${session.email})`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-400 dark:text-slate-500">{label}</dt>
                  <dd className="text-right font-medium text-slate-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              These come from <code className="font-mono">lib/constants.ts</code> — change them there and redeploy.
            </p>
          </Panel>

          <Panel title="Data">
            <dl className="space-y-2 text-sm">
              {[
                ['Users', stats.totalUsers],
                ['Hospitals', counts.hospitals],
                ['Doctors', counts.doctors],
                ['Treatments', counts.treatments],
                ['Blog posts', counts.blogPosts],
                ['Leads', stats.totalLeads],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between gap-4">
                  <dt className="text-slate-400 dark:text-slate-500">{label}</dt>
                  <dd className="text-right font-medium text-slate-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <Panel title="Integrations">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {integrations.map((integration) => (
              <li key={integration.env} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{integration.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    <code className="font-mono">{integration.env}</code> · {integration.purpose}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                    integration.set ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {integration.set ? 'Configured' : 'Not set'}
                </span>
              </li>
            ))}
          </ul>

          {missing.length > 0 && (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {missing.length} {missing.length === 1 ? 'integration is' : 'integrations are'} unconfigured. Features
              that depend on them fail quietly rather than breaking the site — set the environment variables in your
              hosting provider and redeploy.
            </p>
          )}
        </Panel>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Staff accounts are managed in{' '}
          <Link href="/admin-portal/users" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Users
          </Link>
          . Every change made by staff is recorded in{' '}
          <Link href="/admin-portal/audit-logs" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Audit Logs
          </Link>
          .
        </p>
      </PortalPage>
    </AdminLayout>
  );
}
