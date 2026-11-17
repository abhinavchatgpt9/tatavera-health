import { Receipt, PhoneCall, ShieldCheck, HandHeart } from 'lucide-react';
import { CALLBACK_TIMEFRAME } from '@/lib/constants';

const POINTS = [
  {
    icon: Receipt,
    title: 'Costs explained first',
    body: 'We tell you what is free and what you pay for before you decide anything.',
    tint: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
  },
  {
    icon: PhoneCall,
    title: 'A real person calls you',
    body: `A case manager phones you ${CALLBACK_TIMEFRAME}.`,
    tint: 'bg-teal-50 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300',
  },
  {
    icon: ShieldCheck,
    title: 'Your details stay private',
    body: 'Records are shared with a hospital only when your care needs it.',
    tint: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300',
  },
  {
    icon: HandHeart,
    title: 'No pressure',
    body: 'Nothing is booked and nothing is charged until you say so.',
    tint: 'bg-amber-50 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
  },
];

/** Four plain commitments that are true of the service today. No statistics, no badges. */
export default function TrustBand() {
  return (
    <section aria-label="How we work" className="relative -mt-10 pb-6 md:-mt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] dark:border-slate-700 dark:bg-slate-700 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <li key={point.title} className="flex gap-4 bg-white p-6 dark:bg-slate-900">
              <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${point.tint}`}>
                <point.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{point.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{point.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
