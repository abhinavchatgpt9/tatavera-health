import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { FEATURED_DOCTORS, TESTIMONIALS } from '@/lib/constants';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doctor = FEATURED_DOCTORS.find((d) => d.slug === params.slug);
  if (!doctor) return {};
  return {
    title: `${doctor.name} — ${doctor.specialty} | Tatvavera Health`,
    description: `${doctor.name}, ${doctor.specialty} specialist with ${doctor.experience} years of experience at ${doctor.hospital}. Book a consultation through Tatvavera Health.`,
  };
}

export function generateStaticParams() {
  return FEATURED_DOCTORS.map((d) => ({ slug: d.slug }));
}

export default function DoctorProfilePage({ params }: Props) {
  const doctor = FEATURED_DOCTORS.find((d) => d.slug === params.slug);
  if (!doctor) notFound();

  const qualifications = ['MBBS', 'MS (General Surgery)', 'MCh (Specialty)', 'Fellowship — International Hospital'];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span>/</span>
              <Link href="/doctors" className="hover:text-blue-600">Doctors</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">{doctor.name}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full flex items-center justify-center text-5xl flex-shrink-0">
                👨‍⚕️
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.specialty}</p>
                <p className="text-gray-500 mt-1">{doctor.hospital}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-lg ${i < Math.round(doctor.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-gray-700 font-semibold ml-1">{doctor.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({doctor.reviewCount} reviews)</span>
                  <span className="text-gray-500 text-sm">{doctor.experience} yrs experience</span>
                </div>
              </div>
              <a href="#lead-form" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex-shrink-0">
                Book Consultation
              </a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">

              {/* About */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dr. {doctor.name.split(' ').pop()}</h2>
                <p className="text-gray-600 leading-relaxed">
                  {doctor.name} is a highly experienced {doctor.specialty} specialist with over {doctor.experience} years of clinical expertise. Based at {doctor.hospital}, the doctor has treated thousands of domestic and international patients with outstanding outcomes. A pioneer in minimally invasive techniques, with sub-specialisations across the field.
                </p>
              </section>

              {/* Qualifications */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Qualifications & Certifications</h2>
                <ul className="space-y-2">
                  {qualifications.map((q) => (
                    <li key={q} className="flex items-center gap-2 text-gray-700">
                      <span className="text-blue-500">🎓</span> {q}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Testimonials */}
              {TESTIMONIALS.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Testimonials</h2>
                <div className="space-y-4">
                  {TESTIMONIALS.slice(0, 2).map((t, i) => (
                    <div key={i} className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                      <div className="flex gap-1 mb-3">
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
                <h3 className="font-bold text-gray-900 mb-3">Get a Second Opinion or Book Consultation</h3>
                <a href="#lead-form" className="block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mb-3">
                  Book Consultation
                </a>
                <p className="text-xs text-gray-400 text-center">Free · Secure · No obligation</p>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm text-gray-500">
                  <p>🏥 {doctor.hospital}</p>
                  <p>⏱ {doctor.experience} years experience</p>
                  <p>⭐ Rated {doctor.rating}/5 by {doctor.reviewCount} patients</p>
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
