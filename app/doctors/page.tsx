import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DoctorsClient from '@/components/DoctorsClient';

export const metadata: Metadata = {
  title: 'Expert Doctors Worldwide | Tatvavera Health',
  description: 'Find internationally trained specialist doctors in cardiology, oncology, orthopedics, neurology, IVF and more at top accredited hospitals.',
};

export default function DoctorsPage({
  searchParams,
}: {
  searchParams: { specialty?: string };
}) {
  const specialtyFilter = searchParams.specialty || '';

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-violet-700 via-blue-700 to-blue-600 dark:from-slate-900 dark:via-violet-950 dark:to-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
                👨‍⚕️ Expert Surgeons
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Top-Rated Specialists
              </h1>
              <p className="text-blue-100 text-lg max-w-xl">
                Specialists matched personally to your condition.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <DoctorsClient specialtyFilter={specialtyFilter} />
        </div>
      </main>
      <Footer />
    </>
  );
}
