import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { DESTINATIONS, FEATURED_HOSPITALS, FEATURED_DOCTORS, TESTIMONIALS } from '@/lib/constants';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dest = DESTINATIONS.find((d) => d.slug === params.slug);
  if (!dest) return {};
  return {
    title: `Medical Treatment in ${dest.country} | Hospitals & Cost | Tatavera Health`,
    description: `Why choose ${dest.country} for medical treatment? Top hospitals, cost advantages, visa info, and patient stories. ${dest.highlight}.`,
  };
}

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export default function DestinationDetailPage({ params }: Props) {
  const dest = DESTINATIONS.find((d) => d.slug === params.slug);
  if (!dest) notFound();

  const costComparisons = [
    { procedure: 'Heart Bypass', home: '$80,000–$120,000', here: '$6,000–$9,000', saving: '90%' },
    { procedure: 'Knee Replacement', home: '$40,000–$70,000', here: '$3,500–$5,500', saving: '88%' },
    { procedure: 'Liver Transplant', home: '$200,000+', here: '$25,000–$45,000', saving: '80%' },
    { procedure: 'IVF (cycle)', home: '$15,000–$25,000', here: '$2,500–$4,500', saving: '82%' },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-14 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/destinations" className="hover:text-blue-600">Destinations</Link>
              <span>/</span>
              <span className="text-gray-800">{dest.country}</span>
            </div>
            <div className="flex items-center gap-5">
              <div className="text-7xl">{dest.flag}</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Medical Treatment in {dest.country}</h1>
                <p className="text-gray-600 mt-2 text-lg">{dest.highlight}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">Top: {dest.topTreatment}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">

              {/* Why this country */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why {dest.country} for Medical Treatment?</h2>
                <p className="text-gray-600 leading-relaxed">
                  {dest.country} has established itself as a premier destination for international medical tourism, combining world-class healthcare infrastructure with significant cost advantages. Patients benefit from internationally accredited hospitals, English-speaking medical staff, and a welcoming environment for international visitors.
                </p>
              </section>

              {/* Cost comparison */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Cost Advantages</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Procedure</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Home Country</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">{dest.country}</th>
                        <th className="text-right py-3 px-4 font-semibold text-green-600">You Save</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {costComparisons.map((row) => (
                        <tr key={row.procedure} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800 font-medium">{row.procedure}</td>
                          <td className="py-3 px-4 text-right text-gray-500 line-through">{row.home}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">{row.here}</td>
                          <td className="py-3 px-4 text-right font-bold text-green-600">{row.saving}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Top Hospitals */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Top Hospitals in {dest.country}</h2>
                <div className="space-y-3">
                  {FEATURED_HOSPITALS.slice(0, 3).map((h) => (
                    <Link key={h.slug} href={`/hospitals/${h.slug}`} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="text-2xl">🏥</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600">{h.name}</p>
                        <p className="text-sm text-gray-500">{h.city} · {h.accreditations.join(', ')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Visa & Travel */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Visa & Travel Information</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3">
                  <div className="flex gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <p className="font-semibold text-gray-900">Medical Visa</p>
                      <p className="text-gray-600 text-sm">Most countries issue medical visas on priority. Our team provides hospital invitation letters and assists with the application.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">✈️</span>
                    <div>
                      <p className="font-semibold text-gray-900">Flights & Transfers</p>
                      <p className="text-gray-600 text-sm">Direct flights available from most major African, Middle Eastern, and CIS cities. Airport transfer to hospital arranged by our team.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xl">🏨</span>
                    <div>
                      <p className="font-semibold text-gray-900">Accommodation</p>
                      <p className="text-gray-600 text-sm">Hospital guest houses, serviced apartments, and hotels near the hospital arranged at preferential rates.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Patient Stories */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Stories from {dest.country}</h2>
                <div className="space-y-4">
                  {TESTIMONIALS.slice(0, 2).map((t, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <p className="text-gray-700 italic text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                      <p className="text-sm font-semibold text-gray-800">{t.name} <span className="font-normal text-gray-500">· {t.country} · {t.treatment}</span></p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-3">Plan Your Trip to {dest.country}</h3>
                <a href="#lead-form" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-3">
                  Get Free Consultation
                </a>
                <p className="text-xs text-gray-400 text-center mb-4">Free · No obligation · 24hr response</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✅ Visa assistance included</p>
                  <p>✅ Airport transfer arranged</p>
                  <p>✅ Interpreter available</p>
                  <p>✅ Follow-up care post-return</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="lead-form">
          <LeadForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
