import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhyChooseUs from '@/components/WhyChooseUs';
import TrustStats from '@/components/TrustStats';

export const metadata: Metadata = {
  title: 'Why Choose Tatavera Health',
  description: 'Accredited hospitals, transparent pricing, multilingual support, and 100% free services for patients.',
};

export default function WhyChooseUsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Why choose Tatavera</h1>
            <p className="text-slate-600 dark:text-slate-400">
              We vet every hospital, stay transparent on pricing, and never charge patients for coordination.
            </p>
          </div>
        </section>
        <TrustStats />
        <WhyChooseUs />
        <section className="py-12 bg-slate-50 dark:bg-slate-900 text-center border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/free-consultation"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
          >
            Start with a free assessment
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
