'use client';

import { useEffect } from 'react';

// Catches errors thrown by the root layout itself. Must render its own
// <html>/<body> since it replaces the entire root layout when triggered.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <div className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-md text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-8">
              The page failed to load. Please try again.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
