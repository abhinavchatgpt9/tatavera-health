import Link from 'next/link';
import { PhoneCall, Stethoscope, Route, BookOpen } from 'lucide-react';
import { CALLBACK_TIMEFRAME } from '@/lib/constants';

const GROUPS = [
  {
    title: 'Find care',
    icon: Stethoscope,
    tint: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
    bar: 'from-blue-500 to-sky-400',
    links: [
      { href: '/treatments', title: 'Treatments', desc: 'Browse procedures by specialty, with indicative costs.' },
      { href: '/popular-procedures', title: 'Popular procedures', desc: 'Typical prices in India compared with other countries.' },
      { href: '/hospitals', title: 'Hospitals', desc: 'Partner hospitals and what each is known for.' },
      { href: '/doctors', title: 'Doctors', desc: 'Specialists and surgeons by treatment area.' },
      { href: '/destinations', title: 'Destinations', desc: 'Where we send patients and what the trip involves.' },
    ],
  },
  {
    title: 'Plan your trip',
    icon: Route,
    tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300',
    bar: 'from-teal-500 to-emerald-400',
    links: [
      { href: '/how-it-works', title: 'How it works', desc: 'The steps from enquiry to recovery.' },
      { href: '/services', title: 'Services', desc: 'What we do, what is free and what you pay for.' },
      { href: '/why-choose-us', title: 'Why Tatvavera', desc: 'How we choose hospitals and keep costs clear.' },
      { href: '/spotlight', title: 'Spotlight', desc: 'Featured hospitals, doctors and patient voices.' },
    ],
  },
  {
    title: 'Learn more',
    icon: BookOpen,
    tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300',
    bar: 'from-indigo-500 to-violet-400',
    links: [
      { href: '/patient-stories', title: 'Patient stories', desc: 'Real outcomes from patients around the world.' },
      { href: '/blog', title: 'Blog and guides', desc: 'Visa tips, treatment explainers and travel advice.' },
      { href: '/faq', title: 'FAQ', desc: 'Costs, safety, visas and timelines.' },
      { href: '/about', title: 'About us', desc: 'Who we are and how we help.' },
      { href: '/contact', title: 'Contact', desc: 'Phone, WhatsApp and email.' },
    ],
  },
];

export default function HomeExplore() {
  return (
    <section className="border-t border-slate-100 bg-gradient-to-b from-sky-50/70 to-slate-50 py-16 dark:border-slate-800 dark:from-slate-950 dark:to-slate-950 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <h2 className="mb-3 text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Everything in one place, by what you need to do
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Start with treatments if you know what you need. Start with how it works if you are still deciding.
          </p>
        </div>

        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
          {GROUPS.map((group) => (
            <div key={group.title} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-900">
              <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${group.bar}`} />
              <div className="mb-3 flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${group.tint}`}>
                  <group.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{group.title}</h3>
              </div>
              <ul className="space-y-0.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group -mx-3 block rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800"
                    >
                      <span className="block font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                        {link.title}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-600 dark:text-slate-400">{link.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-600 to-teal-600 p-8 text-white shadow-[0_24px_50px_-24px_rgba(37,99,235,0.6)] sm:flex-row sm:items-center md:p-10">
          <div>
            <p className="text-xl font-semibold md:text-2xl">Not sure where to start?</p>
            <p className="mt-1 text-blue-100">Tell us what you need and we call you back {CALLBACK_TIMEFRAME}.</p>
          </div>
          <Link
            href="/free-consultation"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600"
          >
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
            Request a callback
          </Link>
        </div>
      </div>
    </section>
  );
}
