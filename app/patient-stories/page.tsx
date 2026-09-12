import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadForm from '@/components/LeadForm';
import { TESTIMONIALS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Patient Stories & Testimonials | Tatavera Health',
  description: 'Real patient stories from Africa, Middle East, and CIS countries. Read how Tatavera Health helped them access world-class medical care.',
};

const FLAG_EMOJIS: Record<string, string> = {
  Nigeria: '🇳🇬', Kuwait: '🇰🇼', Egypt: '🇪🇬', Russia: '🇷🇺',
};

const STAT_PILLS = [
  { value: '15,000+', label: 'Patients Helped', icon: '👥' },
  { value: '125+',    label: 'Countries Served', icon: '🌍' },
  { value: '4.9★',    label: 'Avg Rating',       icon: '⭐' },
  { value: '100%',    label: 'Free Service',      icon: '🎁' },
];

const MORE_STORIES = [
  { name: 'John Okafor', country: 'Ghana', treatment: 'Liver Transplant', flag: '🇬🇭', quote: 'I was given 3 months to live back home. Tatavera got me to Apollo in 2 weeks. I am now 2 years cancer-free.', rating: 5 },
  { name: 'Aisha Malik', country: 'Pakistan', treatment: 'IVF Treatment', flag: '🇵🇰', quote: 'After 4 failed IVF cycles, we came to India. Tatavera handled everything — visa, hotel, doctor. We had twins last year!', rating: 5 },
  { name: 'Yusuf Al-Anazi', country: 'Saudi Arabia', treatment: 'Spine Surgery', flag: '🇸🇦', quote: 'My spine surgery saved me from a wheelchair. The surgeon was world-class. Tatavera translated every document.', rating: 5 },
  { name: 'Nkechinyere Eze', country: 'Nigeria', treatment: 'Knee Replacement', flag: '🇳🇬', quote: 'I paid 1/8th of what UK quoted me. The hospital in Mumbai was better than anything I imagined.', rating: 5 },
];

const STAR_SVG = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ALL_STORIES = [...TESTIMONIALS, ...MORE_STORIES];

export default function PatientStoriesPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-rose-700 via-pink-600 to-blue-700 dark:from-slate-900 dark:via-rose-950 dark:to-slate-900 py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-widest">
              💬 Real Stories
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight max-w-3xl mx-auto">
              Life-Changing Journeys
            </h1>
            <p className="text-pink-100 text-lg max-w-2xl mx-auto mb-10">
              Real patients from 125+ countries who trusted Tatavera Health and got world-class treatment at a fraction of the cost.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap justify-center gap-4">
              {STAT_PILLS.map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3">
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <p className="text-white font-extrabold text-lg leading-none">{s.value}</p>
                    <p className="text-pink-200 text-xs">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video placeholders */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="section-label">Video Testimonials</span>
              <h2 className="section-title">Watch Patient Stories</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Cardiac Surgery — Lagos to Mumbai', country: 'Nigeria', duration: '4:32' },
                { title: 'IVF Success After 5 Failed Cycles', country: 'Egypt', duration: '5:18' },
                { title: 'Liver Transplant — Kuwait to India', country: 'Kuwait', duration: '6:04' },
              ].map((video, i) => (
                <div key={i} className="flashcard group overflow-hidden cursor-pointer">
                  <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center -mx-6 -mt-6 mb-5 rounded-t-2xl">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">{video.duration}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{video.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{FLAG_EMOJIS[video.country] ?? '🌍'} {video.country}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Written testimonials */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="section-label">Written Stories</span>
              <h2 className="section-title">What Our Patients Say</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {ALL_STORIES.map((t, i) => (
                <div key={i} className="flashcard p-7 flex flex-col">
                  <div className="text-5xl font-serif text-blue-200 dark:text-blue-900 leading-none mb-2 select-none">&ldquo;</div>
                  <div className="flex gap-0.5 text-amber-400 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => <span key={j}>{STAR_SVG}</span>)}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base italic mb-5 flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{t.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {String('flag' in t ? t.flag : (FLAG_EMOJIS[t.country] ?? '🌍'))} {t.country}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-full">
                      {t.treatment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LeadForm />
      </main>
      <Footer />
    </>
  );
}
