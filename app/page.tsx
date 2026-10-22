import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import HomeExplore from '@/components/HomeExplore';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStats />
        <HomeExplore />
      </main>
      <Footer />
    </>
  );
}
