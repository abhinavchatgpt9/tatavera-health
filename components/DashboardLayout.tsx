'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', emoji: '🏠' },
  { label: 'My Reports', href: '/dashboard/reports', emoji: '📄' },
  { label: 'Appointments', href: '/dashboard/appointments', emoji: '📅' },
  { label: 'Messages', href: '/dashboard/messages', emoji: '💬' },
  { label: 'My Profile', href: '/dashboard/profile', emoji: '👤' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 fixed inset-y-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}
              >
                <span className="text-lg">{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <span>🌐</span> Back to Website
          </Link>
          <LogoutButton className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mt-1" />
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex gap-2 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 p-2 rounded-lg text-base ${pathname === item.href ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300' : 'text-gray-500 dark:text-slate-400'}`}
              >
                {item.emoji}
              </Link>
            ))}
          </div>
          <LogoutButton iconOnly className="flex-shrink-0 p-2 rounded-lg text-base text-red-500" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
