import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, SITE_URL, BRAND_ALTERNATE_NAMES } from '@/lib/constants';
import AnalyticsClient from '@/components/AnalyticsClient';
import ThemeProvider from '@/components/ThemeProvider';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import StickyMobileCTA from '@/components/StickyMobileCTA';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  alternates: { canonical: './' },
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  keywords: [
    'Tatvavera Health', 'Tatvavera', 'tatvaverahealth',
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
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': ['Organization', 'MedicalBusiness'],
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: BRAND_ALTERNATE_NAMES,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
      image: `${SITE_URL}/og-image.png`,
      sameAs: ['https://www.instagram.com/tatvaverahealth/'],
      areaServed: 'Worldwide',
      medicalSpecialty: ['Cardiology', 'Orthopedic Surgery', 'Oncology', 'Neurology', 'IVF'],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+91-98772-63279',
        email: 'tatvaverahealth@gmail.com',
        availableLanguage: ['English'],
      },
    },
  ],
};

/* Inline script runs before React hydrates — prevents flash of wrong theme */
const ANTI_FLASH_SCRIPT = `
(function(){
  try{
    var s=localStorage.getItem('theme');
    if(s==='dark'){document.documentElement.classList.add('dark');}
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
          <AnalyticsClient />
          <StickyMobileCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
