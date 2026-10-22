import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FAQ from '@/components/FAQ';

export const metadata: Metadata = {
  title: 'FAQ | Tatvavera Health',
  description: 'Frequently asked questions about medical tourism, costs, visas, hospital quality, and how our free service works.',
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Frequently asked questions</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Straight answers about safety, savings, timelines, and what happens after you enquire.
            </p>
          </div>
        </section>
        <FAQ />
        <section className="py-10 text-center bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">Still unsure?</p>
          <Link href="/free-consultation" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Ask our team — free consultation →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
