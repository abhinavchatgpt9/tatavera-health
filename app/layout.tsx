import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, SITE_URL } from '@/lib/constants';
import { Analytics } from '@vercel/analytics/next';
import ThemeProvider from '@/components/ThemeProvider';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  keywords: [
    'medical tourism', 'hospital abroad', 'treatment abroad', 'medical travel',
    'heart surgery india', 'knee replacement abroad', 'cancer treatment',
    'liver transplant', 'IVF abroad', 'hair transplant turkey',
    'JCI hospital', 'NABH hospital', 'affordable surgery',
    'Africa medical tourism', 'Middle East medical travel',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
};

const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/Tatvavera-Header-Transparent.svg`,
  sameAs: ['https://www.instagram.com/tatvaverahealth/'],
  areaServed: 'Worldwide',
  medicalSpecialty: ['Cardiology', 'Orthopedic Surgery', 'Oncology', 'Neurology', 'IVF'],
};

/* Inline script runs before React hydrates — prevents flash of wrong theme */
const ANTI_FLASH_SCRIPT = `
(function(){
  try{
    var s=localStorage.getItem('theme');
    var p=window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(s==='dark'||(s===null&&p)){document.documentElement.classList.add('dark');}
  }catch(e){}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#032981" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Anti-flash: must be first script in head */}
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_ORG) }} />
      </head>
      <body className="antialiased bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          {children}
          <WhatsAppWidget />
          <Analytics />
          <StickyMobileCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
