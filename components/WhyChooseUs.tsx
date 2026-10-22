import { WHY_CHOOSE_US } from '@/lib/constants';
import AnimateIn from '@/components/AnimateIn';

const CARD_STYLES = [
  { gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-800/50' },
  { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-800/50' },
  { gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 dark:bg-violet-900/10', border: 'border-violet-100 dark:border-violet-800/50' },
  { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-100 dark:border-amber-800/50' },
  { gradient: 'from-rose-500 to-pink-600', bg: 'bg-rose-50 dark:bg-rose-900/10', border: 'border-rose-100 dark:border-rose-800/50' },
  { gradient: 'from-cyan-500 to-blue-600', bg: 'bg-cyan-50 dark:bg-cyan-900/10', border: 'border-cyan-100 dark:border-cyan-800/50' },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn variant="fade-up" className="text-center mb-14">
          <span className="section-label">Why Us</span>
          <h2 className="section-title">Why Choose Tatvavera Health?</h2>
          <p className="section-subtitle">
            We are a trusted friend, not a sales agent — guiding you to the right care every step of the way.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CHOOSE_US.map((item, i) => {
            const style = CARD_STYLES[i % CARD_STYLES.length];
            return (
              <AnimateIn key={item.title} variant="fade-up" delay={i * 80}>
                <div className={`flashcard group p-6 ${style.bg} border ${style.border} h-full`}>
                  {/* Icon circle with gradient */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${style.gradient} text-white text-xl mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {item.emoji}
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-base">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>

                  {/* Hover accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${style.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`} />
                </div>
              </AnimateIn>
            );
          })}
        </div>

        <AnimateIn variant="fade-up" delay={200} className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 text-base font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 px-6 py-3 rounded-full">
            <span>🎁</span>
            <span>All our services are 100% FREE for patients</span>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
