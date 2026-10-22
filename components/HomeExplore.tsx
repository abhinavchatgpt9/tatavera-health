import Link from 'next/link';

const LINKS = [
  {
    href: '/treatments',
    title: 'Treatments',
    desc: 'Browse procedures, specialties, and cost guides.',
    emoji: '🩺',
  },
  {
    href: '/popular-procedures',
    title: 'Popular procedures',
    desc: 'Compare typical US vs abroad pricing at a glance.',
    emoji: '📊',
  },
  {
    href: '/hospitals',
    title: 'Hospitals',
    desc: 'JCI-accredited partner hospitals worldwide.',
    emoji: '🏥',
  },
  {
    href: '/doctors',
    title: 'Doctors',
    desc: 'Specialists and surgeons by treatment area.',
    emoji: '👨‍⚕️',
  },
  {
    href: '/destinations',
    title: 'Destinations',
    desc: 'India, Turkey, Thailand, Singapore, and more.',
    emoji: '🌍',
  },
  {
    href: '/how-it-works',
    title: 'How it works',
    desc: 'Four simple steps from enquiry to recovery.',
    emoji: '⚡',
  },
  {
    href: '/why-choose-us',
    title: 'Why Tatvavera',
    desc: 'Accreditation, transparency, and free patient support.',
    emoji: '✨',
  },
  {
    href: '/spotlight',
    title: 'Spotlight',
    desc: 'Featured hospitals, doctors, and patient voices.',
    emoji: '⭐',
  },
  {
    href: '/patient-stories',
    title: 'Patient stories',
    desc: 'Real outcomes from patients around the world.',
    emoji: '💬',
  },
  {
    href: '/blog',
    title: 'Blog & guides',
    desc: 'Visa tips, treatment explainers, and travel advice.',
    emoji: '📰',
  },
  {
    href: '/faq',
    title: 'FAQ',
    desc: 'Answers about cost, safety, visas, and timelines.',
    emoji: '❓',
  },
  {
    href: '/free-consultation',
    title: 'Free consultation',
    desc: 'Tell us your case — we respond within 24 hours.',
    emoji: '📋',
  },
  {
    href: '/about',
    title: 'About us',
    desc: 'Who we are and how we help patients.',
    emoji: '🏢',
  },
  {
    href: '/contact',
    title: 'Contact',
    desc: 'Phone, email, and office details.',
    emoji: '✉️',
  },
];

export default function HomeExplore() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">Explore</span>
          <h2 className="section-title mt-2">Every topic has its own page</h2>
          <p className="section-subtitle text-center mt-2">
            Jump to full guides and listings — no endless single-page scrolling.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-2xl mb-2" aria-hidden>
                {item.emoji}
              </span>
              <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                {item.desc}
              </span>
              <span className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                Continue →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
