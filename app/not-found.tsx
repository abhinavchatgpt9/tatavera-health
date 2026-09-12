import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Page Not Found | Tatavera Health',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
          <p className="text-gray-500 dark:text-slate-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Go home
            </Link>
            <Link
              href="/treatments"
              className="px-6 py-3 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-sm"
            >
              Browse treatments
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
