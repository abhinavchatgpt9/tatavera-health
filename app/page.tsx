import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import TrustBand from '@/components/TrustBand';
import EnquirySteps from '@/components/EnquirySteps';
import HomeExplore from '@/components/HomeExplore';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBand />
        <EnquirySteps />
        <TrustStats />
        <HomeExplore />
      </main>
      <Footer />
    </>
  );
}
