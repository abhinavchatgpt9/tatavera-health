import { TESTIMONIALS } from '@/lib/constants';
import AnimateIn from '@/components/AnimateIn';

const STAR_SVG = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const FLAG_EMOJIS: Record<string, string> = {
  Nigeria: '🇳🇬', Kuwait: '🇰🇼', Egypt: '🇪🇬', Russia: '🇷🇺',
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-40 dark:opacity-10"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn variant="fade-up" className="text-center mb-14">
          <span className="section-label">Patient Stories</span>
          <h2 className="section-title">Real Patients. Real Transformations.</h2>
          <p className="section-subtitle">
            Over 15,000 patients have trusted Tatavera Health for life-changing treatment — at a fraction of the cost.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <AnimateIn key={t.name} variant="fade-up" delay={i * 100}>
              <div className="flashcard group p-7 h-full flex flex-col">
                {/* Quote mark */}
                <div className="text-6xl font-serif text-blue-200 dark:text-blue-900 leading-none mb-2 select-none">&ldquo;</div>

                {/* Stars */}
                <div className="flex gap-0.5 text-amber-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>{STAR_SVG}</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6 flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{t.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {FLAG_EMOJIS[t.country] ?? '🌍'} {t.country}
                    </p>
                  </div>
                  <span className="ml-auto flex-shrink-0 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                    {t.treatment}
                  </span>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Overall rating bar */}
        <AnimateIn variant="scale-in" delay={100} className="mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <div className="flex justify-center gap-1 text-amber-400 mb-3">
                {Array.from({ length: 5 }).map((_, i) => <span key={i}>{STAR_SVG}</span>)}
              </div>
              <p className="text-5xl font-extrabold mb-1">4.9 <span className="text-2xl font-medium opacity-70">/ 5</span></p>
              <p className="text-blue-100 font-medium">Based on 1,200+ verified patient reviews</p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
