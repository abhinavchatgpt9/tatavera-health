import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Our Services — All Free for Patients | Tatvavera Health',
  description: 'From case evaluation to post-treatment follow-up — all services at Tatvavera Health are completely free for international patients.',
};

const SERVICES = [
  {
    step: 1,
    title: 'Case Evaluation & Doctor/Hospital Matching',
    description: 'Upload your medical reports and our medical team reviews your case within 24 hours. We match you with the best hospital and doctor based on your condition, budget, and preferences.',
    free: true,
    emoji: '🩺',
  },
  {
    step: 2,
    title: 'Second Medical Opinion',
    description: 'Get a second opinion from a specialist at a top international hospital before making any decision. Our doctors review your reports and provide a detailed recommendation.',
    free: true,
    emoji: '🔍',
  },
  {
    step: 3,
    title: 'Treatment Planning & Cost Estimate',
    description: 'Receive a detailed treatment plan with a transparent cost breakdown — no hidden fees. You know exactly what you are paying for before you travel.',
    free: true,
    emoji: '📋',
  },
  {
    step: 4,
    title: 'Travel & Visa Assistance',
    description: 'We provide hospital invitation letters, guide you through the medical visa application, and recommend the best travel routes and timing.',
    free: true,
    emoji: '✈️',
  },
  {
    step: 5,
    title: 'Airport Transfer & Accommodation',
    description: 'Airport pickup, drop-off, and preferred hotel or hospital guest house arranged at special rates. We coordinate everything so you arrive stress-free.',
    free: true,
    emoji: '🏨',
  },
  {
    step: 6,
    title: 'On-Ground Hospital Assistance & Interpreter',
    description: 'Your dedicated case manager meets you at the hospital. Multilingual interpreters available in Arabic, French, Russian, and other languages.',
    free: true,
    emoji: '🤝',
  },
  {
    step: 7,
    title: 'Post-Treatment Follow-Up & Recovery Support',
    description: 'After you return home, your surgeon and case manager remain available for follow-up consultations. Remote check-ins for 6 months post-treatment.',
    free: true,
    emoji: '💊',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-14 border-b border-gray-100 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-block px-5 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-6">
              🎁 All Services Are 100% FREE for Patients
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">End-to-End Care. Zero Cost to You.</h1>
            <p className="text-xl text-gray-600">We handle every step of your medical journey so you can focus on what matters — your health.</p>
          </div>
        </section>

        {/* Services list */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="space-y-8">
            {SERVICES.map((service) => (
              <div key={service.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {service.step}
                  </div>
                  {service.step < SERVICES.length && (
                    <div className="w-0.5 h-8 bg-blue-200 mx-auto mt-2" />
                  )}
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 flex-1 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{service.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h2 className="font-bold text-gray-900 text-lg">{service.title}</h2>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">FREE</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-lg">
              Start Your Free Consultation
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
