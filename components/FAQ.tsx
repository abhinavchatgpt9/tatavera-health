'use client';

import { useState } from 'react';
import { FAQ as FAQData } from '@/lib/constants';
import AnimateIn from '@/components/AnimateIn';

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn variant="fade-up" className="text-center mb-14">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Everything you need to know about medical tourism with Tatvavera Health.
          </p>
        </AnimateIn>

        <div className="space-y-3">
          {FAQData.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <AnimateIn key={faq.id} variant="fade-up" delay={i * 60}>
                <div className={`rounded-2xl border transition-all duration-300 overflow-hidden
                  ${isOpen
                    ? 'border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 shadow-md'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-100 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-start gap-4 px-6 py-5 text-left group"
                  >
                    <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5 transition-colors duration-300
                      ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}
                    >
                      {faq.id}
                    </span>
                    <span className={`font-semibold flex-1 transition-colors duration-200 ${isOpen ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      {faq.question}
                    </span>
                    <svg
                      className={`flex-shrink-0 w-5 h-5 mt-0.5 transition-all duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* CSS grid trick for smooth height transition */}
                  <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                    <div className="accordion-inner">
                      <p className="px-6 pb-5 pl-[4.25rem] text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>

        <AnimateIn variant="scale-in" delay={100} className="mt-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-8 md:p-10 text-center text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
              <p className="text-blue-100 mb-6 max-w-md mx-auto">Our medical coordinators are available 24/7 to guide you every step of the way.</p>
              <a href="/free-consultation" className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95">
                Get Free Consultation
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
