import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';
import { CALLBACK_TIMEFRAME, CONTACT_EMAIL, CONTACT_PHONE, FREE_SERVICE_SUMMARY, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Use | Tatvavera Health',
  description: 'The terms for using the Tatvavera Health website and enquiry service: what we do, what is free, what you pay for, and what we cannot promise.',
};

// OWNER: review this page (and /privacy) before launch. Add the legal name of the operating company and the
// governing law / courts once confirmed with your adviser.
const SECTIONS: LegalSection[] = [
  {
    title: 'What we do',
    paragraphs: [
      `${SITE_NAME} is a medical travel coordination service. We help you find suitable hospitals and doctors in India and help coordinate the steps around your care. We are not a hospital, clinic or doctor, and we do not provide medical advice, diagnosis or treatment.`,
      'Information on this website is general and is not a substitute for advice from your own doctor.',
    ],
  },
  {
    title: 'Sending an enquiry',
    paragraphs: [
      `When you send an enquiry, our team reviews it and calls you back ${CALLBACK_TIMEFRAME}. Sending an enquiry does not book any treatment and does not commit you or us to anything.`,
      'A callback is our first reply. A cost estimate from a hospital is a separate step, and it follows once the hospital has reviewed your case. Timing depends on your case.',
      'Please give accurate contact details so we can reach you.',
    ],
  },
  {
    title: 'What is free and what you pay for',
    paragraphs: [FREE_SERVICE_SUMMARY],
    bullets: [
      'Free for you: our review of your enquiry, hospital matching and coordination support.',
      'Paid by you to the hospital or provider: treatment, hospital stay, tests, medicines and follow-up care.',
      'Paid by you: flights, visa fees, accommodation, transfers and other travel costs.',
    ],
    after: 'Costs shown on this website are estimates and indicative ranges, not offers. The hospital estimate for your case confirms what is included. The final cost can change if your medical condition or treatment plan changes. If a service has a fee, we tell you before you proceed.',
  },
  {
    title: 'Medical decisions and outcomes',
    paragraphs: [
      'All medical decisions are made between you and your doctors. Every treatment carries risks, and results differ between patients, so we cannot promise any outcome.',
      'This website and our enquiry service are not for emergencies. If you need urgent medical help, contact your local emergency services.',
    ],
  },
  {
    title: 'Hospitals and doctors',
    paragraphs: [
      'Hospitals, doctors and other providers are independent. They are responsible for the care and services they provide, and their own terms and consent forms apply to your treatment.',
    ],
  },
  {
    title: 'Your account',
    paragraphs: [
      'An account is optional and is not needed to send an enquiry. If you create one, keep your password private and tell us if you think someone else has used your account. We may suspend accounts that are used to misuse the site.',
    ],
  },
  {
    title: 'Using the website',
    bullets: [
      'Do not submit false or misleading information, or enquiries on behalf of someone else without their knowledge.',
      'Do not try to interfere with the site, test its security or collect information about other people.',
    ],
  },
  {
    title: 'Our responsibility',
    paragraphs: [
      'We take care to keep the information on this site accurate, but we cannot promise it is always complete or up to date. To the extent the law allows, we are not responsible for losses that result from relying on general information on the website, or for the care given by hospitals and doctors.',
    ],
  },
  {
    title: 'Your information',
    paragraphs: ['How we handle your personal information is explained in our Privacy Policy.'],
  },
  {
    title: 'Changes and contact',
    paragraphs: [
      'We may update these terms and will change the date at the top when we do.',
      `Questions? Contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="The rules for using our website and enquiry service, including what is free and what you pay for."
      updated="18 November 2026"
      sections={SECTIONS}
    />
  );
}
