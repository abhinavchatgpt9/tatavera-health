import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { FEATURED_HOSPITALS, FEATURED_DOCTORS, TESTIMONIALS } from '@/lib/constants';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hospital = FEATURED_HOSPITALS.find((h) => h.slug === params.slug);
  if (!hospital) return {};
  return {
    title: `${hospital.name}, ${hospital.city} | Tatvavera Health`,
    description: `${hospital.name} in ${hospital.city}, ${hospital.country}. ${hospital.accreditations.join(', ')} accredited. Top specialties: ${hospital.specialties.join(', ')}.`,
  };
}

export function generateStaticParams() {
  return FEATURED_HOSPITALS.map((h) => ({ slug: h.slug }));
}

export default function HospitalProfilePage({ params }: Props) {
  const hospital = FEATURED_HOSPITALS.find((h) => h.slug === params.slug);
  if (!hospital) notFound();

  const COST_TABLE = [
    { procedure: 'Heart Bypass (CABG)', from: 6000, to: 9000 },
    { procedure: 'Knee Replacement', from: 3500, to: 5500 },
    { procedure: 'Hip Replacement', from: 4000, to: 6000 },
    { procedure: 'Liver Transplant', from: 25000, to: 40000 },
    { procedure: 'IVF (Single Cycle)', from: 2500, to: 4000 },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/hospitals" className="hover:text-blue-600">Hospitals</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{hospital.name}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                🏥
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {hospital.accreditations.map((acc) => (
                    <span key={acc} className="px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-300">{acc}</span>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{hospital.name}</h1>
                <p className="text-gray-600 mt-1">📍 {hospital.city}, {hospital.country}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(hospital.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-gray-700 font-semibold ml-1">{hospital.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({hospital.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
              <a href="#lead-form" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex-shrink-0">
                Get a Quote
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">

              {/* About */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {hospital.name}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {hospital.name} is a leading multi-specialty hospital in {hospital.city}, {hospital.country}, with internationally accredited standards and state-of-the-art technology. The hospital has served over {hospital.reviewCount.toLocaleString()} international patients with an outstanding satisfaction record.
                </p>
              </section>

              {/* Specialties */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Specialties Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((s) => (
                    <Link key={s} href={`/treatments?specialty=${encodeURIComponent(s)}`} className="px-4 py-2 bg-blue-50 text-blue-600 font-medium text-sm rounded-full hover:bg-blue-100 transition-colors border border-blue-200">
                      {s}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Doctors */}
              {FEATURED_DOCTORS.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctors at This Hospital</h2>
                <div className="space-y-3">
                  {FEATURED_DOCTORS.slice(0, 3).map((d) => (
                    <Link key={d.slug} href={`/doctors/${d.slug}`} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">👨‍⚕️</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">{d.name}</p>
                        <p className="text-sm text-blue-600">{d.specialty}</p>
                      </div>
                      <span className="text-xs text-gray-400">{d.experience} yrs</span>
                    </Link>
                  ))}
                </div>
              </section>
              )}

              {/* Cost Table */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Treatment Costs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Procedure</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Cost Range (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {COST_TABLE.map((row) => (
                        <tr key={row.procedure} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-800">{row.procedure}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900">
                            ${row.from.toLocaleString()} – ${row.to.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">* Costs are indicative. Exact quotes provided after case review.</p>
              </section>

              {/* Reviews */}
              {TESTIMONIALS.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Reviews</h2>
                <div className="space-y-4">
                  {TESTIMONIALS.slice(0, 2).map((t, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: t.rating }).map((_, j) => <span key={j} className="text-yellow-400">★</span>)}
                      </div>
                      <p className="text-gray-700 italic text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                      <p className="text-sm font-semibold text-gray-800">{t.name} <span className="font-normal text-gray-500">· {t.country}</span></p>
                    </div>
                  ))}
                </div>
              </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-3">Enquire About This Hospital</h3>
                <a href="#lead-form" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-3">
                  Get Free Quote
                </a>
                <p className="text-xs text-gray-400 text-center">Free · No obligation · 24hr response</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-2">Accreditations</h3>
                {hospital.accreditations.map((acc) => (
                  <div key={acc} className="flex items-center gap-2 text-green-700 text-sm py-1">
                    <span>✅</span> {acc} Accredited
                  </div>
                ))}
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
