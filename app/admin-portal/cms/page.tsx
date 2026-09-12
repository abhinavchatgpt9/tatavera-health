import type { Metadata } from 'next';
import Link from 'next/link';

import AdminLayout from '@/components/AdminLayout';
import { PortalPage, PageHeader, Panel } from '@/components/portal/PortalPage';
import { getPortalSession } from '@/lib/portal-session';
import { getAdminContentCounts } from '@/lib/portal-data';

export const metadata: Metadata = { title: 'Content | Admin Portal' };
export const dynamic = 'force-dynamic';

export default async function AdminCmsPage() {
  await getPortalSession(['ADMIN']);
  const counts = await getAdminContentCounts();

  const sections = [
    {
      href: '/admin-portal/treatments',
      title: 'Treatments',
      count: counts.treatments,
      description: 'Procedure pages with costs, duration and FAQs. These drive the enquiry form.',
    },
    {
      href: '/admin-portal/hospitals',
      title: 'Hospitals',
      count: counts.hospitals,
      description: 'Partner hospital profiles, accreditations and per-procedure pricing.',
    },
    {
      href: '/admin-portal/doctors',
      title: 'Doctors',
      count: counts.doctors,
      description: 'Surgeon profiles, qualifications and the hospitals they practise at.',
    },
    {
      href: '/admin-portal/countries',
      title: 'Destinations',
      count: counts.destinations,
      description: 'Country pages covering visa, travel and accommodation.',
    },
    {
      href: '/admin-portal/blogs',
      title: 'Blog posts',
      count: counts.blogPosts,
      description: 'Long-form articles — your main organic search channel.',
    },
    {
      href: '/admin-portal/testimonials',
      title: 'Testimonials',
      count: counts.testimonials,
      description: 'Patient stories used across the site as social proof.',
    },
  ];

  return (
    <AdminLayout>
      <PortalPage>
        <PageHeader
          title="Content"
          description="Everything published on the public site, and where to manage it."
        />

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{section.count}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
            </Link>
          ))}
        </div>

        <Panel title="A note on editing">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Each section above lists what exists and lets you review it. Rich in-place editing of long-form content is
            not built yet — content currently comes from the database seed and direct edits. If you want a full editor
            (write and publish a blog post, rewrite a treatment page) that is the natural next build, and it is a
            self-contained piece of work rather than a rewrite of anything here.
          </p>
        </Panel>

        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          {counts.faqs} treatment FAQs are attached across {counts.treatments} treatment pages.
        </p>
      </PortalPage>
    </AdminLayout>
  );
}
