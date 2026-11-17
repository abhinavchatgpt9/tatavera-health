'use client';

import { useEffect, useRef } from 'react';
import EnquiryForm from '@/components/EnquiryForm';

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedDoctor?: string;
  preselectedHospital?: string;
}

/**
 * A pop-up version of the one enquiry form, used on doctor cards so a patient can ask about a specific doctor
 * without leaving the list. There is no time slot and no report upload: the team calls back, then asks for
 * anything else later.
 */
export default function AppointmentModal({ open, onClose, preselectedDoctor, preselectedHospital }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-title"
        className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 id="enquiry-modal-title" className="text-white font-bold text-lg">Request a callback</h2>
            <p className="text-blue-200 text-sm">
              {preselectedDoctor || preselectedHospital
                ? [preselectedDoctor, preselectedHospital].filter(Boolean).join(' · ')
                : 'Tell us what you need'}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <EnquiryForm idPrefix="modal" doctor={preselectedDoctor} hospital={preselectedHospital} />
        </div>
      </div>
    </div>
  );
}
