import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Patient Stories | Tatvavera Health',
  description: 'Patient stories will be shared here with each patient\'s consent.',
};

export default function PatientStoriesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 py-16 md:py-20">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight max-w-3xl mx-auto">
              Patient Stories
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              We will publish patient experiences here, with each patient&apos;s consent.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No stories have been published yet.
            </p>
          </div>
        </section>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
