import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApplicationForm from './ApplicationForm';

export const metadata: Metadata = {
  title: 'Partner With Us — For Doctors & Hospitals | Tatavera Health',
  description: 'Apply for portal access as a doctor or hospital administrator. Receive matched patients, manage your profile, and track cases — free to join.',
};

export default function PartnerWithUsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-50 to-white py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Partner With Tatavera Health</h1>
            <p className="text-gray-600 max-w-2xl">
              Are you a doctor or a hospital administrator? Apply for portal access to receive matched patients,
              manage your profile, and track cases — free to join, no commission on the first referral.
            </p>
          </div>
        </section>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <ApplicationForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
