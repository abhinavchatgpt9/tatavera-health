import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import InlineLinks from '@/components/InlineLinks';
import { PROCEDURES, PROCEDURE_SEO, PROCEDURE_FAQS, FEATURED_HOSPITALS, FEATURED_DOCTORS, TESTIMONIALS, FAQ, CALLBACK_TIMEFRAME } from '@/lib/constants';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const procedure = PROCEDURES.find((p) => p.slug === params.slug);
  if (!procedure) return {};
  const seoName = PROCEDURE_SEO[procedure.slug]?.title ?? procedure.name;
  const title = `${seoName} in India: Costs & Planning | Tatvavera Health`;
  const description = `${procedure.name} in India: indicative cost from $${procedure.costFrom.toLocaleString()}, usual stay and recovery plan, and how to request a callback and a hospital estimate for your case.`;
  return {
    title,
    description,
    alternates: { canonical: `/treatments/${procedure.slug}` },
    openGraph: { type: 'website', url: `/treatments/${procedure.slug}`, title, description, images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Tatvavera Health' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  };
}

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ slug: p.slug }));
}

export default function TreatmentDetailPage({ params }: Props) {
  const procedure = PROCEDURES.find((p) => p.slug === params.slug);
  if (!procedure) notFound();

  // General questions that make no unsupported claims (what is free, visas, companions, follow-up).
  const generalFaqs = FAQ.filter((f) => [3, 4, 6].includes(f.id)).map((f) => ({ question: f.question, answer: f.answer }));
  const faqItems = [...(PROCEDURE_FAQS[procedure.slug] ?? []), ...generalFaqs];

  const steps = [
    { label: 'Consultation', desc: 'Initial video consultation with specialist.' },
    { label: 'Pre-operative Tests', desc: 'Blood work, imaging, and health assessment.' },
    { label: 'Surgery / Procedure', desc: 'Performed at accredited hospital.' },
    { label: 'Post-op Recovery', desc: `In-hospital recovery: ${procedure.hospitalStay}.` },
    { label: 'Discharge & Follow-up', desc: 'Remote follow-up care after returning home.' },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-14 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/treatments" className="hover:text-blue-600">Treatments</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{procedure.name}</span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="max-w-2xl">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">{procedure.category}</span>
                <h1 className="text-4xl font-bold text-gray-900 mt-3 mb-3">{PROCEDURE_SEO[procedure.slug]?.h1 ?? procedure.name}</h1>
                <p className="text-gray-600 text-lg">{procedure.description}</p>
                <div className="flex flex-wrap gap-4 mt-5">
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400">Estimated Cost</p>
                    <p className="font-bold text-gray-900">${procedure.costFrom.toLocaleString()} – ${procedure.costTo.toLocaleString()}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="font-bold text-gray-900">{procedure.timeline}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-400">Hospital Stay</p>
                    <p className="font-bold text-gray-900">{procedure.hospitalStay}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 max-w-xl">
                  The estimated cost is an indicative range for the procedure and the usual hospital stay. Flights, accommodation, visa, medicines after discharge and follow-up are normally extra. The hospital estimate for your case confirms what is included.
                </p>
              </div>
              <div className="lg:min-w-60">
                <div className="bg-blue-600 text-white rounded-2xl p-6 text-center shadow-lg">
                  <p className="text-blue-100 text-sm mb-1">Hospital estimate for your case</p>
                  <p className="text-2xl font-bold mb-3">Free Enquiry Review</p>
                  <a href="#lead-form" className="inline-block w-full py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                    Request a callback
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">

              {/* Procedure Overview */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Procedure Overview</h2>
                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{step.label}</p>
                        <p className="text-gray-500 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <Link href={`/best-hospitals/${procedure.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-blue-700 font-semibold hover:bg-blue-100">
                  See the best hospitals in India for {procedure.name}
                </Link>
              </section>

              {/* Recommended Hospitals */}
              {FEATURED_HOSPITALS.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Recommended Hospitals</h2>
                <div className="space-y-3">
                  {FEATURED_HOSPITALS.slice(0, 3).map((h) => (
                    <Link key={h.slug} href={`/hospitals/${h.slug}`} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏥</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">{h.name}</p>
                        <p className="text-sm text-gray-500">{h.city}, {h.country}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {h.accreditations.map((a) => (
                          <span key={a} className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">{a}</span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              )}

              {/* Recommended Doctors */}
              {FEATURED_DOCTORS.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Top Specialists</h2>
                <div className="space-y-3">
                  {FEATURED_DOCTORS.slice(0, 3).map((d) => (
                    <Link key={d.slug} href={`/doctors/${d.slug}`} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">👨‍⚕️</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">{d.name}</p>
                        <p className="text-sm text-blue-600">{d.specialty}</p>
                        <p className="text-xs text-gray-500">{d.experience} yrs experience</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
              )}

              {/* Patient Testimonials */}
              {TESTIMONIALS.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Patient Stories</h2>
                <div className="space-y-4">
                  {TESTIMONIALS.slice(0, 2).map((t, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <span key={j} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-gray-700 italic leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm">👤</div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.country} · {t.treatment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              )}

              {/* FAQ: questions about this procedure first, then the general ones about fees, visas and follow-up */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqItems.map((item) => (
                    <details key={item.question} className="group bg-white border border-gray-100 rounded-xl">
                      <summary className="cursor-pointer font-semibold text-gray-800 px-5 py-4 flex items-center justify-between list-none">
                        {item.question}
                        <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                      </summary>
                      <p className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">
                        <InlineLinks text={item.answer} />
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4">Request a Cost Estimate</h3>
                <p className="text-gray-500 text-sm mb-4">Our team calls you back {CALLBACK_TIMEFRAME} to understand your case. A hospital estimate for your treatment follows once the hospital has reviewed it. Timing depends on your case.</p>
                <a href="#lead-form" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                  Request a callback
                </a>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                  <p className="flex items-start gap-2">✅ <span>Free: our enquiry review and coordination</span></p>
                  <p className="flex items-start gap-2">💳 <span>You pay: treatment, hospital stay, travel and follow-up</span></p>
                  <p className="flex items-start gap-2">✅ <span>No obligation</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Form */}
        <div>
          <LeadForm defaultTreatment={`procedure:${procedure.id}`} />
        </div>
      </main>
      <Footer />
    </>
  );
}
