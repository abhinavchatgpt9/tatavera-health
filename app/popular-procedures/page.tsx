import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProcedureCards from '@/components/ProcedureCards';

export const metadata: Metadata = {
  title: 'Popular Procedures & Cost Comparison | Tatvavera Health',
  description: 'See typical savings on cardiac surgery, orthopedics, IVF, transplants, and more when travelling for treatment.',
};

export default function PopularProceduresPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Popular procedures</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Illustrative comparisons — final quotes depend on your reports and hospital choice.
            </p>
            <Link
              href="/treatments"
              className="inline-flex text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse full treatment directory →
            </Link>
          </div>
        </section>
        <ProcedureCards />
        <section className="py-12 text-center bg-slate-50 dark:bg-slate-900">
          <Link
            href="/free-consultation"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
          >
            Get a personalised estimate
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
