import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import TrustBand from '@/components/TrustBand';
import EnquirySteps from '@/components/EnquirySteps';
import BestHospitalsSection from '@/components/BestHospitalsSection';
import HomeExplore from '@/components/HomeExplore';
import Footer from '@/components/Footer';

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
