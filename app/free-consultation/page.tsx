import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { CALLBACK_TIMEFRAME } from '@/lib/constants';
import { resolveTreatmentParam } from '@/lib/enquiry';

export const metadata: Metadata = {
  title: 'Request a Callback | Tatvavera Health',
  description: `Tell us what treatment you need. Our team reviews your request and calls you back ${CALLBACK_TIMEFRAME}. Our enquiry review is free.`,
};

type SearchParams = { [key: string]: string | string[] | undefined };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default function FreeConsultationPage({ searchParams }: { searchParams: SearchParams }) {
  // Links such as /free-consultation?treatment=cardiology carry the patient's choice into the form.
  const treatment = resolveTreatmentParam(searchParams.treatment);
  const need = first(searchParams.need)?.slice(0, 300);
  const doctor = first(searchParams.doctor)?.slice(0, 150);
  const hospital = first(searchParams.hospital)?.slice(0, 150);

  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-14 text-center text-white">
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Request a callback</h1>
            <p className="text-blue-100 text-lg">
              Tell us what you need. Our team reviews your request and calls you back {CALLBACK_TIMEFRAME}. You do not need to book a time or upload reports.
            </p>
          </div>
        </section>
        <LeadForm
          defaultTreatment={treatment || (need ? 'other' : undefined)}
          defaultDetails={need}
          doctor={doctor}
          hospital={hospital}
          showPhoto
        />
      </main>
      <Footer />
    </>
  );
}
