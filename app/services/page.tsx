import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CALLBACK_TIMEFRAME, FREE_SERVICE_SUMMARY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Our Services | Tatvavera Health',
  description: 'From enquiry review to follow-up coordination: what Tatvavera Health does for international patients, what is free and what the patient pays for.',
};

type Cost = 'free' | 'paid' | 'confirm';

const COST_BADGE: Record<Cost, { label: string; className: string }> = {
  free: { label: 'FREE', className: 'bg-green-100 text-green-700' },
  paid: { label: 'YOU PAY', className: 'bg-amber-100 text-amber-800' },
  confirm: { label: 'COST CONFIRMED FIRST', className: 'bg-blue-100 text-blue-700' },
};

const SERVICES = [
  {
    step: 1,
    title: 'Case Evaluation & Doctor/Hospital Matching',
    description: `Send an enquiry and our team calls you back ${CALLBACK_TIMEFRAME}. If medical reports are needed, we ask for them later and tell you how to send them securely. We then suggest suitable hospitals and doctors for your condition, budget and preferences.`,
    cost: 'free' as Cost,
    emoji: '🩺',
  },
  {
    step: 2,
    title: 'Second Medical Opinion',
    description: 'We can arrange for a specialist to review your reports and give a second opinion before you decide anything. Whether a fee applies depends on the doctor or hospital, and we tell you before you proceed.',
    cost: 'confirm' as Cost,
    emoji: '🔍',
  },
  {
    step: 3,
    title: 'Treatment Planning & Cost Estimate',
    description: 'We request a treatment plan and cost estimate from the hospital for your case, and explain what is included and what is not, so you know what to expect before you decide to travel. The treatment itself is paid to the hospital.',
    cost: 'free' as Cost,
    emoji: '📋',
  },
  {
    step: 4,
    title: 'Travel & Visa Assistance',
    description: 'We help you get the hospital invitation letter and guide you through the medical visa application. Visa fees and flights are paid by you.',
    cost: 'free' as Cost,
    emoji: '✈️',
  },
  {
    step: 5,
    title: 'Airport Transfer & Accommodation',
    description: 'We help arrange airport pickup and drop-off and a hotel or hospital guest house near the hospital. The cost of transfers and accommodation is paid by you.',
    cost: 'paid' as Cost,
    emoji: '🏨',
  },
  {
    step: 6,
    title: 'On-Ground Hospital Assistance & Interpreter',
    description: 'Your case manager helps you at the hospital, and interpreters can be arranged in Arabic, French, Russian and other languages. Any interpreter fee is confirmed before you proceed.',
    cost: 'confirm' as Cost,
    emoji: '🤝',
  },
  {
    step: 7,
    title: 'Post-Treatment Follow-Up & Recovery Support',
    description: 'After you return home, your case manager helps you coordinate follow-up with the hospital. The arrangements and any charges depend on your treatment and hospital, and we explain them before you travel.',
    cost: 'confirm' as Cost,
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
              Free enquiry review and coordination
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">End-to-End Support. Clear Costs.</h1>
            <p className="text-xl text-gray-600">We coordinate each step of your medical journey, and we tell you what is free and what you pay for.</p>
            <p className="mt-4 text-sm text-gray-600 max-w-2xl mx-auto">{FREE_SERVICE_SUMMARY}</p>
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
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${COST_BADGE[service.cost].className}`}>{COST_BADGE[service.cost].label}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/free-consultation" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-lg">
              Request a callback
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
