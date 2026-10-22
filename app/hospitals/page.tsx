import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { TOP_HOSPITALS } from '@/lib/hospitals-data';
import { DESTINATIONS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Top Accredited Hospitals Worldwide | Tatvavera Health',
  description: 'Hospitals we coordinate care with. Listings will be published once confirmed.',
};

export default function HospitalsPage({
  searchParams,
}: {
  searchParams: { country?: string; specialty?: string };
}) {
  const countryFilter = searchParams.country || '';
  const specialtyFilter = searchParams.specialty || '';

  const filtered = TOP_HOSPITALS.filter((h) => {
    const matchesCountry = !countryFilter || h.country.toLowerCase() === countryFilter.toLowerCase();
    const matchesSpecialty = !specialtyFilter || h.specialties.some((s) => s.toLowerCase().includes(specialtyFilter.toLowerCase()));
    return matchesCountry && matchesSpecialty;
  });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                🏥 Verified Partners
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                World-Class Hospitals
              </h1>
              <p className="text-blue-100 text-lg max-w-xl">
                Hospital listings will appear here once partnerships are confirmed.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Country filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/hospitals"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!countryFilter ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
            >
              All Countries
            </Link>
            {DESTINATIONS.map((d) => (
              <Link
                key={d.slug}
                href={`/hospitals?country=${encodeURIComponent(d.country)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${countryFilter === d.country ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
              >
                {d.flag} {d.country}
              </Link>
            ))}
          </div>

          {countryFilter && (
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Showing <strong className="text-slate-800 dark:text-white">{filtered.length} hospital{filtered.length !== 1 ? 's' : ''}</strong> in {countryFilter}
            </p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((hospital) => (
              <Link
                key={hospital.slug}
                href={`/hospitals/${hospital.slug}`}
                className="flashcard group overflow-hidden block"
              >
                {/* Cover image */}
                <div className="relative h-48 -mx-6 -mt-6 mb-5 overflow-hidden bg-blue-50 dark:bg-slate-800 rounded-t-2xl">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    Save {hospital.costAdvantage}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                    {hospital.name}
                  </h2>
                  <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{hospital.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-xs mb-3">
                  📍 {hospital.city}, {hospital.country} · Est. {hospital.established}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {hospital.accreditations.slice(0, 3).map((acc) => (
                    <span key={acc} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
                      ✓ {acc}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {hospital.specialties.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                      {s}
                    </span>
                  ))}
                  {hospital.specialties.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                      +{hospital.specialties.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>🏥 {hospital.beds.toLocaleString()} beds</span>
                  <span>🌍 {hospital.countriesServed} countries</span>
                  <span>✅ {hospital.successRate}% success</span>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏥</div>
              <p className="text-slate-400 text-lg mb-4">{TOP_HOSPITALS.length === 0 ? 'Hospital listings are coming soon.' : 'No hospitals found for the selected filters.'}</p>
              <Link href="/hospitals" className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                Clear Filters
              </Link>
            </div>
          )}
        </div>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
