import Image from 'next/image';
import Link from 'next/link';
import { HeartPulse, PhoneCall } from 'lucide-react';
import { CALLBACK_TIMEFRAME } from '@/lib/constants';

const STEPS = [
  { title: 'Send your enquiry', body: 'Your name, phone number and the treatment you need. It takes about two minutes.' },
  { title: 'We call you back', body: `A case manager phones you ${CALLBACK_TIMEFRAME} to understand what you need.` },
  { title: 'Hospital estimate', body: 'A separate step. The hospital reviews your case and sends a cost estimate.' },
  { title: 'You decide', body: 'Travel and treatment only when you are ready. Nothing is booked until you say so.' },
];

/** The real enquiry sequence, so it is numbered. Photo on one side, steps on the other. */
export default function EnquirySteps() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-[0_24px_60px_-28px_rgba(15,23,42,0.5)]">
            <Image
              unoptimized
              src="/images/consult-landscape.jpg"
              alt="A case manager talking through options with two patients"
              width={1400}
              height={933}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <span aria-hidden="true" className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-3xl bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-500/10 dark:to-teal-400/10" />
        </div>

        <div>
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mb-2 text-balance text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            After you send an enquiry
          </h2>
          <p className="mb-8 max-w-lg text-lg text-slate-600 dark:text-slate-400">
            No reports needed to start. Enquiry review and coordination are free; you pay for treatment and travel.
          </p>
          <ol>
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-slate-200 dark:bg-slate-700" />
                )}
                <span className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-semibold text-white shadow-sm">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{step.title}</p>
                  <p className="mt-0.5 leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/free-consultation"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
            Request a callback
          </Link>
        </div>
      </div>
    </section>
  );
}
