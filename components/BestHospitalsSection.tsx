import Link from 'next/link';
import { PROCEDURES } from '@/lib/constants';
import { RANKING_SOURCES } from '@/lib/hospital-rankings-data';

export default function BestHospitalsSection() {
  return (
    <section className="py-14 bg-white dark:bg-slate-950" aria-labelledby="best-hospitals-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <h2 id="best-hospitals-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Best hospitals in India, for every procedure</h2>
          <p className="text-slate-600 dark:text-slate-300">
            See hospitals in the order published by {RANKING_SOURCES.overall.publisher}. Every row shows which ranking the position comes from.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROCEDURES.map((p) => (
            <li key={p.slug}>
              <Link href={`/best-hospitals/${p.slug}`} className="block h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5 hover:border-blue-300 hover:shadow-sm transition">
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{p.category}</span>
                <span className="block font-semibold text-slate-900 dark:text-white mt-1">Best hospitals for {p.name}</span>
                <span className="block text-sm text-blue-700 dark:text-blue-300 mt-2">View the list</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">Source: {RANKING_SOURCES.overall.publisher}, {RANKING_SOURCES.overall.title}. A ranking is not a promise of treatment.</p>
      </div>
    </section>
  );
}
