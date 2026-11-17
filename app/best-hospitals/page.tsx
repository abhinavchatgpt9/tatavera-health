import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PROCEDURES } from '@/lib/constants';
import { RANKING_SOURCES } from '@/lib/hospital-rankings-data';
import { buildProcedureEntries } from '@/lib/hospital-directory';

export const metadata: Metadata = {
  title: 'Best Hospitals in India by Procedure | Tatvavera Health',
  description: 'Browse India\'s best hospitals for each procedure, listed in the order published by Newsweek / Statista, with the source shown on every row.',
  alternates: { canonical: '/best-hospitals' },
};

export default function BestHospitalsIndex() {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Best hospitals in India, by procedure</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl mb-8">
          Pick a procedure to see hospitals in the order published by {RANKING_SOURCES.overall.publisher}. Each row names the ranking it comes from, ten hospitals per page.
        </p>
        <ul className="grid sm:grid-cols-2 gap-4">
          {PROCEDURES.map((p) => {
            const count = buildProcedureEntries(p.slug)?.entries.length ?? 0;
            return (
              <li key={p.slug}>
                <Link href={`/best-hospitals/${p.slug}`} className="block rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-blue-300 hover:shadow-sm transition h-full">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">{p.category}</span>
                  <span className="block text-lg font-semibold text-slate-900 dark:text-white mt-1">{p.name}</span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400 mt-1">{count} hospitals listed · 10 per page</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 text-xs text-slate-500 dark:text-slate-400 max-w-3xl">
          Sources, checked {RANKING_SOURCES.overall.checked}: {RANKING_SOURCES.overall.publisher}, {RANKING_SOURCES.overall.title}, and {RANKING_SOURCES.specialty.title}. A ranking shows how a hospital is regarded overall. It does not confirm that the hospital offers a given procedure or how a treatment will go for you.
        </p>
      </main>
      <Footer />
    </>
  );
}
