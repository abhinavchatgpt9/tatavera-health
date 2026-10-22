import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeaturedHospitals from '@/components/FeaturedHospitals';
import FeaturedDoctors from '@/components/FeaturedDoctors';
import Testimonials from '@/components/Testimonials';

export const metadata: Metadata = {
  title: 'Spotlight — Hospitals, Doctors & Reviews | Tatvavera Health',
  description: 'Featured partner hospitals, expert doctors, and what patients say about care abroad with Tatvavera.',
};

export default function SpotlightPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 py-12 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Spotlight</h1>
            <p className="text-slate-600 dark:text-slate-400">
              A curated look at partner hospitals, specialists, and recent patient feedback.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
              <Link href="/hospitals" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                All hospitals
              </Link>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <Link href="/doctors" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                All doctors
              </Link>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <Link href="/patient-stories" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                More stories
              </Link>
            </div>
          </div>
        </section>
        <FeaturedHospitals />
        <FeaturedDoctors />
        <Testimonials />
        <section className="py-12 text-center bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/free-consultation"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors"
          >
            Match me with a hospital
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
