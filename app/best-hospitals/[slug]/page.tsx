import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PROCEDURES } from '@/lib/constants';
import { RANKING_SOURCES } from '@/lib/hospital-rankings-data';
import { getProcedureRankings, pageWindow, parsePage, parseSort, DIRECTORY_PAGE_SIZE } from '@/lib/hospital-directory';

type Props = {
  params: { slug: string };
  searchParams: { page?: string; city?: string; sort?: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const procedure = PROCEDURES.find((p) => p.slug === params.slug);
  if (!procedure) return {};
  return {
    title: `Best Hospitals in India for ${procedure.name} | Ranked by Newsweek / Statista | Tatvavera Health`,
    description: `Best hospitals in India for ${procedure.name}, listed in the order published by Newsweek / Statista. Each row shows which ranking it comes from.`,
    alternates: { canonical: `/best-hospitals/${procedure.slug}` },
  };
}

function href(slug: string, q: { page?: number; city?: string; sort?: string }) {
  const sp = new URLSearchParams();
  if (q.city) sp.set('city', q.city);
  if (q.sort && q.sort !== 'rank') sp.set('sort', q.sort);
  if (q.page && q.page > 1) sp.set('page', String(q.page));
  const qs = sp.toString();
  return `/best-hospitals/${slug}${qs ? `?${qs}` : ''}`;
}

export default function BestHospitalsForProcedure({ params, searchParams }: Props) {
  const procedure = PROCEDURES.find((p) => p.slug === params.slug);
  if (!procedure) notFound();

  const sort = parseSort(searchParams.sort);
  const requestedPage = parsePage(searchParams.page);
  const data = getProcedureRankings(params.slug, { page: requestedPage, city: searchParams.city, sort });
  if (!data) notFound();

  const { pageInfo, entries, cities } = data;
  const city = searchParams.city && cities.includes(searchParams.city) ? searchParams.city : undefined;
  // An out-of-range page shows the nearest valid page (clamped in paginate) and an unknown city is ignored.

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex flex-wrap gap-2" aria-label="Breadcrumb">
          <Link href="/best-hospitals" className="hover:text-blue-600">Best hospitals</Link>
          <span>/</span>
          <span className="text-slate-800 dark:text-white font-medium">{procedure.name}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Best hospitals in India for {procedure.name}</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl mb-5">
          Hospitals in the order published by {RANKING_SOURCES.overall.publisher}. Every row says which ranking it comes from, so you can see exactly what the position means.
        </p>

        <section className="rounded-2xl border border-blue-100 dark:border-slate-700 bg-blue-50/60 dark:bg-slate-800/60 p-4 mb-6 text-sm text-slate-700 dark:text-slate-200 space-y-2" aria-label="How to read this list">
          <p><strong>India overall rank</strong> is the hospital&apos;s place in <a className="text-blue-700 dark:text-blue-300 underline" href={RANKING_SOURCES.overall.url} target="_blank" rel="noopener noreferrer">{RANKING_SOURCES.overall.title}</a> ({RANKING_SOURCES.overall.publisher}). It ranks the whole hospital, not this procedure.</p>
          <p>{data.specialtyNote}</p>
          <p>Whether a hospital performs {procedure.name} is confirmed with the hospital for your case. Being listed is not a recommendation or a promise of treatment.</p>
        </section>

        <form method="get" className="flex flex-wrap items-end gap-3 mb-6" aria-label="Filter hospitals">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            <span className="block mb-1">City</span>
            <select name="city" defaultValue={city ?? ''} className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="">All cities</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            <span className="block mb-1">Sort by</span>
            <select name="sort" defaultValue={sort} className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="rank">Published rank</option>
              <option value="name">Hospital name</option>
              <option value="city">City</option>
            </select>
          </label>
          <button type="submit" className="rounded-lg bg-blue-600 text-white text-sm font-semibold px-4 py-2 hover:bg-blue-700">Apply</button>
          {(city || sort !== 'rank') && (
            <Link href={`/best-hospitals/${procedure.slug}`} className="text-sm text-blue-600 hover:underline py-2">Clear</Link>
          )}
        </form>

        {pageInfo.total === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <p className="text-slate-700 dark:text-slate-200 font-medium mb-2">No ranked hospitals in {city}.</p>
            <Link href={`/best-hospitals/${procedure.slug}`} className="text-blue-600 hover:underline text-sm">Show all cities</Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3" aria-live="polite">
              Showing {pageInfo.from}-{pageInfo.to} of {pageInfo.total} hospital{pageInfo.total === 1 ? '' : 's'}
            </p>
            <ol start={pageInfo.from} className="space-y-3">
              {entries.map((h, i) => (
                <li key={h.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-sm font-semibold text-blue-700 dark:text-blue-300" aria-hidden="true">
                    {pageInfo.from + i}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-slate-900 dark:text-white text-base">{h.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{h.city}, India</p>
                    <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                      {h.overallRank !== null ? (
                        <li className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1">
                          India overall #{h.overallRank}{h.overallScore !== null ? ` · score ${h.overallScore.toFixed(2)}%` : ''} · {RANKING_SOURCES.overall.publisher} {RANKING_SOURCES.overall.edition}
                        </li>
                      ) : (
                        <li className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1">Not in the India overall list</li>
                      )}
                      {h.specialtyRanks.map((s) => (
                        <li key={s.label} className="rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-1">
                          {s.label}: world #{s.rank} · {RANKING_SOURCES.specialty.publisher} {RANKING_SOURCES.specialty.edition}
                        </li>
                      ))}
                      {h.specialistMention && (
                        <li className="rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 px-2.5 py-1">Recognised specialist hospital ({h.specialistMention}, unranked)</li>
                      )}
                    </ul>
                  </div>
                  <Link
                    href={`/free-consultation?treatment=${procedure.id}`}
                    className="shrink-0 rounded-lg border border-blue-600 text-blue-700 dark:text-blue-300 text-sm font-semibold px-3 py-2 text-center hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    Ask about this hospital
                  </Link>
                </li>
              ))}
            </ol>

            {pageInfo.totalPages > 1 && (
              <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                {pageInfo.page > 1 ? (
                  <Link href={href(params.slug, { page: pageInfo.page - 1, city, sort })} rel="prev" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:border-blue-400">Previous</Link>
                ) : <span className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-400">Previous</span>}
                {pageWindow(pageInfo.page, pageInfo.totalPages).map((p, i) =>
                  p === '…' ? (
                    <span key={`gap-${i}`} className="px-2 text-slate-400">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={href(params.slug, { page: p, city, sort })}
                      aria-current={p === pageInfo.page ? 'page' : undefined}
                      className={`min-w-[2.25rem] text-center px-3 py-2 rounded-lg border text-sm ${p === pageInfo.page ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'}`}
                    >
                      {p}
                    </Link>
                  ),
                )}
                {pageInfo.page < pageInfo.totalPages ? (
                  <Link href={href(params.slug, { page: pageInfo.page + 1, city, sort })} rel="next" className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm hover:border-blue-400">Next</Link>
                ) : <span className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-400">Next</span>}
              </nav>
            )}
          </>
        )}

        <section className="mt-10 text-xs text-slate-500 dark:text-slate-400 space-y-1" aria-label="Sources">
          <p><strong>Sources</strong> (checked {RANKING_SOURCES.overall.checked}): {RANKING_SOURCES.overall.publisher}, {RANKING_SOURCES.overall.title}; {RANKING_SOURCES.specialty.title}. {RANKING_SOURCES.overall.note}</p>
          <p>{DIRECTORY_PAGE_SIZE} hospitals per page. Tatvavera Health does not add its own scores or star ratings. Rankings are one input among many, and the publisher advises against using them as the only basis for a decision.</p>
          <p><a className="underline" href={RANKING_SOURCES.overall.url} target="_blank" rel="noopener noreferrer">India overall ranking</a> · <a className="underline" href={RANKING_SOURCES.specialty.url} target="_blank" rel="noopener noreferrer">Specialized hospitals ranking</a></p>
        </section>
      </main>
      <Footer />
    </>
  );
}
