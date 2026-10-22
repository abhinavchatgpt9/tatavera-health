import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';

export const metadata: Metadata = {
  title: 'How It Works | Tatvavera Health',
  description: 'From sharing your reports to recovery — see how Tatvavera guides you in four simple steps.',
};

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">How it works</h1>
            <p className="text-slate-600 dark:text-slate-400">
              A clear path from your first message to treatment abroad — with a dedicated case manager throughout.
            </p>
          </div>
        </section>
        <HowItWorks />
        <section className="py-12 bg-blue-600 text-center">
          <div className="max-w-xl mx-auto px-4">
            <p className="text-white font-medium mb-4">Ready for the next step?</p>
            <Link
              href="/free-consultation"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors"
            >
              Get a free consultation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
