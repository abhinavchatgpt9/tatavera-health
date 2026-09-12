import Link from 'next/link';
import Image from 'next/image';
import { TOP_HOSPITALS } from '@/lib/hospitals-data';
import AnimateIn from '@/components/AnimateIn';

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
      <span className="text-xs text-slate-400 dark:text-slate-500">({reviewCount.toLocaleString()})</span>
    </div>
  );
}

const featured = TOP_HOSPITALS.filter((h) => h.featured).slice(0, 6);

export default function FeaturedHospitals() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-slate-50 dark:bg-slate-900/50 rounded-full blur-3xl translate-x-1/4 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn variant="fade-up">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label">Verified Partners</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">World-Class Hospitals</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1.5">JCI &amp; NABH accredited — personally vetted by our medical team</p>
            </div>
            <Link href="/hospitals" className="hidden md:inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
              View All 500+ Hospitals →
            </Link>
          </div>
        </AnimateIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((hospital, i) => (
            <AnimateIn key={hospital.slug} variant="fade-up" delay={i * 80}>
              <Link
                href={`/hospitals/${hospital.slug}`}
                className="group flashcard overflow-hidden block h-full"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-blue-50 dark:bg-slate-800 -mx-6 -mt-6 mb-5 rounded-t-2xl">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Cost badge */}
                  <div className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Save {hospital.costAdvantage}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight text-base">
                    {hospital.name}
                  </h3>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-xs mb-2.5">
                  📍 {hospital.city}, {hospital.country} · Est. {hospital.established}
                </p>

                <StarRating rating={hospital.rating} reviewCount={hospital.reviewCount} />

                {/* Accreditation badges */}
                <div className="flex flex-wrap gap-1 mt-3 mb-2.5">
                  {hospital.accreditations.slice(0, 3).map((acc) => (
                    <span key={acc} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-800">
                      ✓ {acc}
                    </span>
                  ))}
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1">
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

                {/* Stat row */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>🏥 {hospital.beds.toLocaleString()} beds</span>
                  <span>🌍 {hospital.countriesServed} countries</span>
                  <span>✅ {hospital.successRate}% success</span>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/hospitals" className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
            View All Hospitals →
          </Link>
        </div>
      </div>
    </section>
  );
}
