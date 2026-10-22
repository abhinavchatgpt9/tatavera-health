import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { SITE_NAME, SITE_TAGLINE, CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_NUMBER } from '@/lib/constants';

const FOOTER_LINKS = {
  Treatments: [
    { label: 'Cardiac Surgery', href: '/treatments/coronary-artery-bypass' },
    { label: 'Knee Replacement', href: '/treatments/total-knee-replacement' },
    { label: 'Liver Transplant', href: '/treatments/liver-transplant' },
    { label: 'IVF Treatment', href: '/treatments/ivf-treatment' },
    { label: 'Spine Surgery', href: '/treatments/spine-surgery' },
    { label: 'All Treatments', href: '/treatments' },
  ],
  Destinations: [
    { label: 'India', href: '/destinations/india' },
    { label: 'Turkey', href: '/destinations/turkey' },
    { label: 'Thailand', href: '/destinations/thailand' },
    { label: 'Singapore', href: '/destinations/singapore' },
    { label: 'Germany', href: '/destinations/germany' },
    { label: 'All Destinations', href: '/destinations' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Services', href: '/services' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Why Tatvavera', href: '/why-choose-us' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Patient Stories', href: '/patient-stories' },
    { label: 'Blog & Resources', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'For Doctors & Hospitals', href: '/partner-with-us' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 dark:bg-slate-950 text-slate-400 border-t border-slate-800">
      {/* CTA band */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-bold text-xl mb-1">Ready to get started?</h3>
            <p className="text-blue-100 text-sm">Talk to a medical coordinator today. 100% free, no obligation.</p>
          </div>
          <a
            href="/free-consultation"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3 rounded-2xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-sm"
          >
            📋 Get Free Consultation
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <BrandLogo theme="dark" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              {SITE_TAGLINE}
            </p>

            <div className="space-y-2 text-sm">
              <a href="https://www.instagram.com/tatvaverahealth/" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white transition-colors">Instagram</a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <span>✉️</span> {CONTACT_EMAIL}
              </a>
              <a href={`tel:${CONTACT_PHONE}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <span>📞</span> {CONTACT_PHONE}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>💬</span> WhatsApp Us
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-widest">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications bar */}
        <div className="py-5 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-xs text-slate-600 font-medium uppercase tracking-wide">Certified:</span>
              {['ISO 9001', 'ISO 27001', 'JCI Partnered', 'NABH', 'GDPR Compliant'].map((cert) => (
                <span key={cert} className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-400 text-xs rounded-full font-medium">
                  {cert}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {['EN', 'AR', 'FR', 'RU'].map((lang) => (
                <button key={lang} className="text-xs text-slate-500 hover:text-white transition-colors font-medium">
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {currentYear} {SITE_NAME}. All rights reserved.</p>
          <p>Medical tourism facilitation services. We do not provide medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
