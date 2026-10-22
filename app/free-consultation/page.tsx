import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Free Medical Consultation | Tatvavera Health',
  description: 'Submit your case for a free, no-obligation review. Our medical team responds within 24 hours.',
};

export default function FreeConsultationPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-14 text-center text-white">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Free medical consultation</h1>
            <p className="text-blue-100 text-lg">
              Share your reports and goals. We match you with accredited hospitals and transparent cost estimates — at no charge.
            </p>
          </div>
        </section>
        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
