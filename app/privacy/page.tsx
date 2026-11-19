import type { Metadata } from 'next';
import LegalPage, { type LegalSection } from '@/components/LegalPage';
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tatvavera Health',
  description: 'What personal information Tatvavera Health collects when you send an enquiry, who receives it, when it may be shared for your care, and your choices.',
};

// OWNER: review this page (and /terms) before launch and confirm the points marked in the handover notes:
// who is the legal operator, how long enquiries are kept, and exactly when records are shared with hospitals.
const SECTIONS: LegalSection[] = [
  {
    title: 'Who we are',
    paragraphs: [
      `${SITE_NAME} helps patients from different countries find suitable hospitals and doctors in India and coordinates the steps around their care. We are not a hospital and we do not give medical advice.`,
      `You can reach us at ${CONTACT_EMAIL} or ${CONTACT_PHONE} (phone and WhatsApp) with any question about your information.`,
    ],
  },
  {
    title: 'What information we collect',
    bullets: [
      'Your enquiry: name, email address, phone number, country, the treatment you are asking about, how you prefer to be contacted, and anything you write in the description box.',
      'If you ask about a doctor or hospital: the name of that doctor or hospital.',
      'If you create an account: your name, email, phone number, password (stored in scrambled form, never as plain text) and the details you add to your profile.',
      'Technical details sent automatically when you submit an enquiry: your IP address, browser type and the page you came from. We use these to keep the site secure and to understand which pages bring enquiries.',
    ],
    after: 'The enquiry form does not accept medical reports or records, and we ask you not to type detailed medical history into it. If we need your reports, we will ask for them after we speak with you and tell you how to send them securely.',
  },
  {
    title: 'How we use it',
    bullets: [
      'To read your enquiry and call, message or email you back.',
      'To understand your treatment need and suggest suitable hospitals and doctors.',
      'To arrange the next steps you ask for, such as a hospital estimate, a specialist consultation, or help with a visa invitation, travel and accommodation.',
      'To run and improve our website, prevent misuse and meet legal duties.',
    ],
    after: 'We contact you by phone, WhatsApp or email about your request. We do not use your enquiry to send you unrelated advertising.',
  },
  {
    title: 'Who receives your details',
    bullets: [
      `The ${SITE_NAME} team: the staff and case managers who handle enquiries can see your enquiry details.`,
      'Hospitals and doctors: we share your details, and your medical records if we hold them, only when this is needed to arrange your care, for example to get a cost estimate or to book a consultation. We do this for your case, not in bulk.',
      'Service providers that help us run the website: hosting, the database that stores enquiries, email delivery and basic visit statistics. They handle data only to provide those services.',
      'Authorities, where the law requires it.',
    ],
    after: 'We do not sell your personal information.',
  },
  {
    title: 'Where your information is stored',
    paragraphs: [
      'Our website and database are hosted in India (Mumbai region). Because hospitals, doctors and our team work in India while patients write to us from many countries, your information will be handled in India and may be viewed from other countries by people who help with your case.',
    ],
  },
  {
    title: 'How long we keep it',
    paragraphs: [
      'We keep enquiry details for as long as we need them to follow up and help you, and for as long as the law requires. After that we delete or anonymise them. You can ask us to delete your enquiry earlier (see "Your choices").',
    ],
  },
  {
    title: 'Cookies and website statistics',
    bullets: [
      'If you log in, we set a session cookie so the site knows you are signed in. It is needed for login to work.',
      'We use Vercel Web Analytics to count visits to pages. It is used for simple traffic statistics.',
      'We also count, without your name or contact details, when an enquiry is completed and when the WhatsApp button is clicked. We do not send your treatment or medical information to analytics.',
    ],
  },
  {
    title: 'How we protect your information',
    paragraphs: [
      'The site uses an encrypted (HTTPS) connection, passwords are stored in scrambled form, and access to enquiries is limited to signed-in staff. No online system can be guaranteed completely secure, so please do not send sensitive documents by ordinary email or WhatsApp unless we have agreed that route with you.',
    ],
  },
  {
    title: 'Your choices',
    paragraphs: [
      `You can ask us to show you the information we hold about you, correct it, or delete it, and you can ask us to stop contacting you. Write to ${CONTACT_EMAIL} and quote your enquiry reference if you have one. We will reply as soon as we reasonably can.`,
    ],
  },
  {
    title: 'Children',
    paragraphs: [
      'The site is for adults. If you are asking about treatment for a child, please make the enquiry as the parent or legal guardian.',
    ],
  },
  {
    title: 'Changes to this policy',
    paragraphs: ['If we change how we use your information we will update this page and the date at the top.'],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect when you contact us, who sees it, and when it may be shared for your care."
      updated="18 November 2026"
      sections={SECTIONS}
    />
  );
}
