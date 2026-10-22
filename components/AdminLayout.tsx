'use client';

import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';

const NAV = [
  { label: 'Dashboard', href: '/admin-portal', emoji: '🏠' },
  { label: 'Users', href: '/admin-portal/users', emoji: '👥' },
  { label: 'Applications', href: '/admin-portal/applications', emoji: '📥' },
  { label: 'Doctors', href: '/admin-portal/doctors', emoji: '🩺' },
  { label: 'Hospitals', href: '/admin-portal/hospitals', emoji: '🏥' },
  { label: 'Patients', href: '/admin-portal/patients', emoji: '🧍' },
  { label: 'Treatments', href: '/admin-portal/treatments', emoji: '💉' },
  { label: 'Countries', href: '/admin-portal/countries', emoji: '🌍' },
  { label: 'Blogs', href: '/admin-portal/blogs', emoji: '📰' },
  { label: 'Testimonials', href: '/admin-portal/testimonials', emoji: '⭐' },
  { label: 'Reviews', href: '/admin-portal/reviews', emoji: '📝' },
  { label: 'Payments', href: '/admin-portal/payments', emoji: '💳' },
  { label: 'Analytics', href: '/admin-portal/analytics', emoji: '📈' },
  { label: 'CRM', href: '/admin-portal/crm', emoji: '📊' },
  { label: 'Notifications', href: '/admin-portal/notifications', emoji: '🔔' },
  { label: 'Settings', href: '/admin-portal/settings', emoji: '⚙️' },
  { label: 'Audit Logs', href: '/admin-portal/audit-logs', emoji: '🧾' },
  { label: 'CMS', href: '/admin-portal/cms', emoji: '🗂️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 overflow-y-auto">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo theme="light" />
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <span className="text-base">{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <span>🌐</span> Back to Website
          </Link>
          <LogoutButton className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1" />
        </div>
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo theme="light" />
        </Link>
        <div className="flex items-center gap-1 min-w-0">
          <div className="flex gap-1.5 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-shrink-0 p-2 rounded-lg text-base ${pathname === item.href ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
              >
                {item.emoji}
              </Link>
            ))}
          </div>
          <LogoutButton iconOnly className="flex-shrink-0 p-2 rounded-lg text-base text-red-500" />
        </div>
      </div>

      <main className="flex-1 md:ml-64 pt-14 md:pt-0 min-h-screen">{children}</main>
    </div>
  );
}
