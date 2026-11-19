import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import TrustBand from '@/components/TrustBand';
import EnquirySteps from '@/components/EnquirySteps';
import BestHospitalsSection from '@/components/BestHospitalsSection';
import HomeExplore from '@/components/HomeExplore';
import Footer from '@/components/Footer';
import { HOME_TITLE, HOME_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';

// Search-focused wording for the homepage only. Other pages keep their own titles. The tagline stays visible in the hero.
export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBand />
        <BestHospitalsSection />
        <EnquirySteps />
        <TrustStats />
        <HomeExplore />
      </main>
      <Footer />
    </>
  );
}
