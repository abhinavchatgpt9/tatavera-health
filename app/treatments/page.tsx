import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, ClipboardList, ShieldCheck, Wallet, Zap, HeartPulse, Bone, Sparkles, Baby, Dna, HeartHandshake, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SPECIALTIES, PROCEDURES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Find Your Treatment | Tatvavera Health',
  description: 'Browse all treatments available abroad — cardiac surgery, orthopedics, oncology, IVF, transplants and more. Get a free cost estimate.',
};

const TIMELINE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Cardiac: HeartPulse, Orthopedic: Bone, Transplants: HeartHandshake,
  'IVF & Fertility': Baby, Cosmetic: Sparkles, Spine: Dna,
};

export default function TreatmentsPage({
  searchParams,
}: {
  searchParams: { q?: string; specialty?: string };
}) {
  const query = searchParams.q?.toLowerCase() || '';
  const specialty = searchParams.specialty || '';

  const filtered = PROCEDURES.filter((p) => {
    const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    const matchesSpecialty = !specialty || p.category.toLowerCase() === specialty.toLowerCase();
    return matchesQuery && matchesSpecialty;
  });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" /> All Treatments
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Find Your Treatment
              </h1>
              <p className="text-blue-100 text-lg max-w-xl mb-6">
                Browse world-class treatments at JCI-accredited hospitals. Save 60–85% vs US or UK costs — with a dedicated case manager at every step.
              </p>
              {/* Inline search */}
              <form action="/treatments" method="get">
                <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden max-w-lg">
                  <Search className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" aria-hidden="true" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Search treatment, e.g. heart bypass…"
                    aria-label="Search treatments"
                    className="flex-1 px-4 py-3.5 text-slate-800 dark:text-slate-100 bg-transparent outline-none text-sm placeholder-slate-400"
                  />
                  <Button type="submit" size="sm" className="m-1.5">
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <div className="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><ClipboardList className="h-4 w-4 text-blue-500" aria-hidden="true" /> {PROCEDURES.length}+ Procedures Listed</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" /> All at JCI-Accredited Hospitals</span>
            <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4 text-amber-500" aria-hidden="true" /> Save 60–85% vs Western Costs</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-violet-500" aria-hidden="true" /> Free Quote in 2 Hours</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Specialty filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/treatments"
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!specialty ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'}`}
            >
              All Treatments
            </Link>
            {SPECIALTIES.map((s) => (
              <Link
                key={s.slug}
                href={`/treatments?specialty=${encodeURIComponent(s.name)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${specialty === s.name ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'}`}
              >
                <span aria-hidden="true">{s.emoji}</span> {s.name}
              </Link>
            ))}
          </div>

          {/* Results count */}
          {(query || specialty) && (
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              {query && <> for <strong className="text-slate-800 dark:text-white">&quot;{query}&quot;</strong></>}
              {specialty && <> in <strong className="text-slate-800 dark:text-white">{specialty}</strong></>}
            </p>
          )}

          {/* Treatment grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((procedure) => {
              const CategoryIcon = TIMELINE_ICON[procedure.category] ?? ClipboardList;
              return (
                <Link
                  key={procedure.id}
                  href={`/treatments/${procedure.slug}`}
                  className="flashcard group p-6 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="primary">
                      <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" /> {procedure.category}
                    </Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{procedure.timeline}</span>
                  </div>

                  <h2 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug text-base">
                    {procedure.name}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">{procedure.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Estimated cost</p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        ${procedure.costFrom.toLocaleString()}–${procedure.costTo.toLocaleString()} <span className="font-normal text-slate-400">{procedure.currency}</span>
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Details <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <EmptyState
              className="mt-4"
              icon={<Search className="h-6 w-6" aria-hidden="true" />}
              title={`No treatments found for "${query}"`}
              description="Our team covers 200+ procedures — let us match you manually."
              action={
                <Button asChild>
                  <Link href="/contact">Contact Us — We&apos;ll Find It</Link>
                </Button>
              }
            />
          )}
        </div>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
