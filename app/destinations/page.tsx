import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { DESTINATIONS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Top Medical Tourism Destinations | Tatvavera Health',
  description: 'Explore the world\'s best medical tourism destinations — India, Turkey, Thailand, Singapore, Germany, UAE and more.',
};

const DEST_STATS: Record<string, { hospitals: string; savings: string; patients: string }> = {
  india:     { hospitals: '150+', savings: '80–90%', patients: '600K+/yr' },
  turkey:    { hospitals: '40+',  savings: '60–75%', patients: '400K+/yr' },
  thailand:  { hospitals: '30+',  savings: '65–80%', patients: '300K+/yr' },
  singapore: { hospitals: '20+',  savings: '40–60%', patients: '200K+/yr' },
  malaysia:  { hospitals: '25+',  savings: '60–75%', patients: '150K+/yr' },
  germany:   { hospitals: '15+',  savings: '30–50%', patients: '100K+/yr' },
  uae:       { hospitals: '20+',  savings: '40–60%', patients: '180K+/yr' },
  egypt:     { hospitals: '15+',  savings: '65–80%', patients: '120K+/yr' },
};

const CARD_GRADIENTS = [
  'from-orange-400 to-rose-500',
  'from-red-500 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-cyan-500',
  'from-teal-400 to-emerald-500',
  'from-gray-500 to-slate-600',
  'from-amber-400 to-orange-500',
  'from-yellow-400 to-amber-500',
];

export default function DestinationsPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-emerald-700 via-teal-600 to-blue-700 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 left-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                🌍 Destinations
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Medical Destinations
              </h1>
              <p className="text-emerald-100 text-lg max-w-xl">
                Explore the world&apos;s top countries for medical tourism. Compare hospitals, costs, and specialties — we coordinate everything end-to-end.
              </p>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><span className="text-emerald-500">🌍</span> 8 Premium Destinations</span>
            <span className="flex items-center gap-1.5"><span className="text-amber-500">💰</span> Save Up to 90% vs US Costs</span>
            <span className="flex items-center gap-1.5"><span className="text-violet-500">✈️</span> Full Travel Support Included</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {DESTINATIONS.map((dest, i) => {
              const stats = DEST_STATS[dest.slug] ?? { hospitals: '10+', savings: '50–70%', patients: '50K+/yr' };
              return (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="flashcard group p-6 text-center block overflow-hidden"
                >
                  {/* Gradient top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]}`} />

                  {/* Flag */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} text-4xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {dest.flag}
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                    {dest.country}
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3">Top: {dest.topTreatment}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{dest.highlight}</p>

                  {/* Mini stats */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{stats.hospitals}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Hospitals</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{stats.savings}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Savings</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{stats.patients}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Patients</p>
                    </div>
                  </div>

                  <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
                    Explore →
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Why go abroad CTA banner */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Not sure which destination is right for you?</h3>
                <p className="text-blue-100 max-w-lg">Our medical coordinators personally match you to the right country, hospital, and surgeon based on your condition and budget.</p>
              </div>
              <a href="#lead-form" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap">
                Get Matched Free →
              </a>
            </div>
          </div>
        </div>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
