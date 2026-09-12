'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/constants';

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled page error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 bg-white dark:bg-slate-950">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
        <p className="text-gray-500 dark:text-slate-400 mb-8">
          We hit an unexpected error loading this page. You can try again, or reach out if the problem continues.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm"
          >
            Go home
          </Link>
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-8">
          Still stuck? WhatsApp us at{' '}
          <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} className="underline hover:text-gray-600 dark:hover:text-slate-300">
            {WHATSAPP_NUMBER}
          </a>{' '}
          or email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-gray-600 dark:hover:text-slate-300">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
