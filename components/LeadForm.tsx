'use client';

import Image from 'next/image';
import AnimateIn from '@/components/AnimateIn';
import EnquiryForm from '@/components/EnquiryForm';
import { CALLBACK_TIMEFRAME } from '@/lib/constants';

interface Props {
  /** Pre-selected treatment option value (see lib/enquiry.ts resolveTreatmentParam). */
  defaultTreatment?: string;
  /** Pre-filled description, e.g. what the patient searched for. */
  defaultDetails?: string;
  doctor?: string;
  hospital?: string;
  /** Show the photo rail beside the form (used on the dedicated callback page). */
  showPhoto?: boolean;
}

/** The enquiry section placed on pages. All fields and behaviour live in EnquiryForm, so every page uses the same form. */
export default function LeadForm({ defaultTreatment, defaultDetails, doctor, hospital, showPhoto = false }: Props) {
  return (
    <section id="lead-form" className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(37 99 235) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className={`relative mx-auto px-4 sm:px-6 lg:px-8 ${showPhoto ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <AnimateIn variant="fade-up" className="text-center mb-10">
          <span className="section-label">Request a Callback</span>
          <h2 className="section-title">Tell us what you need</h2>
          <p className="section-subtitle text-center">
            Share a few details. Our team reviews your request and calls you back {CALLBACK_TIMEFRAME}. You do not need to book a time or upload reports.
          </p>
        </AnimateIn>

        <div className={showPhoto ? 'grid items-start gap-8 lg:grid-cols-[1fr_0.75fr] lg:gap-12' : ''}>
        <AnimateIn variant="scale-in" delay={100}>
            <div className="bg-white dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl dark:shadow-slate-900/50 p-8 md:p-10">
              <EnquiryForm
                idPrefix="lead"
                defaultTreatment={defaultTreatment}
                defaultDetails={defaultDetails}
                doctor={doctor}
                hospital={hospital}
              />
            </div>
          </AnimateIn>
          {showPhoto && (
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <div className="overflow-hidden rounded-3xl shadow-[0_24px_60px_-28px_rgba(15,23,42,0.5)]">
                <Image
              unoptimized
                  src="/images/consult-portrait.jpg"
                  alt="A patient and her companion talking with a doctor"
                  width={1000}
                  height={1250}
                  sizes="(min-width: 1024px) 420px, 0px"
                  className="h-auto w-full"
                />
              </div>
              <ul className="mt-6 space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex gap-3"><span aria-hidden="true" className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />No reports or booking needed to start.</li>
                <li className="flex gap-3"><span aria-hidden="true" className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />Our enquiry review is free and carries no obligation.</li>
                <li className="flex gap-3"><span aria-hidden="true" className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-teal-500" />Your details are shared only as our Privacy Policy explains.</li>
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}
