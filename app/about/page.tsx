import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TRUST_STATS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About Us | Tatvavera Health',
  description: 'Tatvavera Health is a trusted medical tourism facilitator connecting international patients with top-accredited hospitals and doctors worldwide.',
};

export default function AboutPage() {
  const team = [
    { name: 'Rahul Mehta', role: 'Founder & CEO', desc: '15 years in international healthcare management.' },
    { name: 'Priya Sharma', role: 'Head of Medical Operations', desc: 'Former clinical coordinator at Apollo Hospitals.' },
    { name: 'Ahmed Al-Rashid', role: 'Director, Middle East & Africa', desc: 'Building bridges between patients and world-class care since 2015.' },
    { name: 'Natasha Ivanova', role: 'CIS Region Manager', desc: 'Dedicated to serving Russian-speaking patients across the globe.' },
  ];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">We Guide Patients to the Right Care</h1>
            <p className="text-xl text-gray-600 leading-relaxed">Tatvavera Health is a trusted medical tourism facilitator dedicated to connecting international patients — primarily from Africa, the Middle East, and CIS countries — with top-accredited hospitals and expert doctors worldwide.</p>
          </div>
        </section>

        {/* Trust Stats */}
        {TRUST_STATS.length > 0 && (
        <div className="bg-blue-600 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:divide-x lg:divide-blue-500">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center text-white px-4">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-blue-100 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Mission */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Every patient deserves access to world-class medical care, regardless of where they live or their budget. We remove the barriers — language, geography, cost, complexity — that prevent patients from getting the treatment they need.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We work exclusively with JCI and NABH-accredited hospitals, and our services are completely free for patients. We are compensated by our partner hospitals, with zero markup on hospital fees.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                <ul className="space-y-3">
                  {['Patient First — always', 'Transparency in pricing', 'Trust through accreditation', 'Compassion in every interaction', 'Multilingual, multicultural team'].map((v) => (
                    <li key={v} className="flex items-center gap-2 text-gray-700">
                      <span className="text-blue-500 font-bold">→</span> {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Our Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div key={member.name} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition-all">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">👤</div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
