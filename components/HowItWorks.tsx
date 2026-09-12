import { HOW_IT_WORKS_STEPS } from '@/lib/constants';
import AnimateIn from '@/components/AnimateIn';

const TIMELINE_STEPS = [
  { n: 1, title: 'Days 1–3: Initial Consultation', desc: 'Submit your medical details. Our team reviews your case and sends an initial quote within 24 hours.' },
  { n: 2, title: 'Days 4–7: Surgeon Consultation', desc: 'Video call with your assigned surgeon. Discuss medical history, expectations, and finalize the treatment plan.' },
  { n: 3, title: 'Days 8–30: Travel Preparation', desc: 'We arrange visas, book flights, coordinate airport pickups, and secure hospital accommodation.' },
  { n: 4, title: 'Arrival Day: Pre-Op Tests', desc: 'Arrive at the hospital and complete final pre-operative tests. Meet your surgical team in person.' },
  { n: 5, title: 'Days 2–7: Surgery & Recovery', desc: 'Procedure performed by your surgeon. Round-the-clock nursing care and pain management.' },
  { n: 6, title: 'Day 8+: Discharge & Return', desc: 'Cleared after final check-up. Provided with full discharge summary and recovery instructions.' },
  { n: 7, title: '6 Months: Ongoing Follow-Up', desc: 'Regular telemedicine consultations with your surgeon to ensure a complete, confident recovery.' },
];

const STEP_COLORS = [
  'from-blue-500 to-blue-700',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-purple-700',
  'from-amber-500 to-orange-600',
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn variant="fade-up" className="text-center mb-16">
          <span className="section-label">Simple Process</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            From first inquiry to full recovery — a simple, transparent, patient-centered process.
          </p>
        </AnimateIn>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {HOW_IT_WORKS_STEPS.map((item, i) => (
            <AnimateIn key={item.step} variant="fade-up" delay={i * 100}>
              <div className="flashcard group p-6 text-center h-full relative overflow-hidden">
                {/* top gradient strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${STEP_COLORS[i % STEP_COLORS.length]}`} />

                {/* Step number badge */}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${STEP_COLORS[i % STEP_COLORS.length]} text-white font-extrabold text-sm mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.step}
                </div>

                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {item.emoji}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>

                {/* connector arrow — visible on md+ except last */}
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Full timeline */}
        <AnimateIn variant="fade-up">
          <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 p-8 md:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 text-center">Complete Timeline</h3>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-violet-500 opacity-30 rounded-full" />

              <div className="space-y-6">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={step.n} className="flex gap-5 group">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${STEP_COLORS[i % STEP_COLORS.length]} text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:scale-110 transition-transform duration-200 relative z-10`}>
                      {step.n}
                    </div>
                    <div className="pb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-0.5">{step.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
