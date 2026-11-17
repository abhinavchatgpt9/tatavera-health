import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from './ContactForm';
import { CALLBACK_TIMEFRAME, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL, WHATSAPP_NUMBER } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us | Tatvavera Health',
  description: `Get in touch with Tatvavera Health by phone, WhatsApp or email, or send a callback request. Our team replies ${CALLBACK_TIMEFRAME}.`,
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Contact Us</h1>
            <p className="text-gray-600">Call, message or email us, or send a callback request below. Our team replies {CALLBACK_TIMEFRAME}.</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-2 gap-14">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">💬</div>
                  <div>
                    <p className="font-bold text-gray-900">WhatsApp</p>
                    <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">{CONTACT_PHONE}</a>
                    <p className="text-gray-500 text-sm mt-0.5">Message us and we reply {CALLBACK_TIMEFRAME}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📞</div>
                  <div>
                    <p className="font-bold text-gray-900">Phone</p>
                    <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-blue-600 font-medium hover:underline">{CONTACT_PHONE}</a>
                    <p className="text-gray-500 text-sm mt-0.5">Same number as WhatsApp. If we miss your call, we call back {CALLBACK_TIMEFRAME}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">✉️</div>
                  <div>
                    <p className="font-bold text-gray-900">Email</p>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-purple-600 font-medium hover:underline">{CONTACT_EMAIL}</a>
                    <p className="text-gray-500 text-sm mt-0.5">We reply {CALLBACK_TIMEFRAME}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-2">For Partners</h3>
                <p className="text-gray-600 text-sm">If you are a doctor or hospital administrator, visit our <a href="/partner-with-us" className="text-blue-600 hover:underline font-medium">partner application page</a> to apply for portal access.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request a Callback</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us what you need and we will call you back {CALLBACK_TIMEFRAME}. Questions that are not about a treatment: choose &quot;Other / Not sure&quot;.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
