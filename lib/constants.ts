export const SITE_NAME = 'Tatvavera Health';
export const SITE_TAGLINE = 'Across Country. Alongside You';
export const SITE_DESCRIPTION =
  'Tatvavera Health connects international patients with accredited hospitals and doctors in India. Free enquiry review, a dedicated case manager and end-to-end coordination support.';
// The live site is served on www (the bare domain redirects here), so every canonical, sitemap and social URL uses it.
export const SITE_URL = 'https://www.tatvaverahealth.com';
/** Other ways people write the brand. Used in structured data so Google links them to this site. */
export const BRAND_ALTERNATE_NAMES = ['Tatvavera', 'TatvaveraHealth', 'Tatvavera Health India'];
export const WHATSAPP_NUMBER = '+919877263279';
export const CONTACT_EMAIL = 'tatvaverahealth@gmail.com';
// Approved patient line (same number as WhatsApp). Display text and the dialable form are kept separate
// so the on-screen number is readable while tel: links stay in plain international format.
export const CONTACT_PHONE = '+91 98772 63279';
export const CONTACT_PHONE_TEL = '+919877263279';

// OWNER TO CONFIRM before publishing: this one phrase is used everywhere the site promises a first reply
// (enquiry form, success message, treatment pages, How It Works, FAQ, contact page). Change it here only.
export const CALLBACK_TIMEFRAME = 'within 24 hours';

/** Plain-language explanation of what is and is not free. Shown on the enquiry page, FAQ and treatment pages. */
export const FREE_SERVICE_SUMMARY =
  'Our enquiry review, hospital matching and coordination support are free for patients. Treatment, hospital stay, medicines, travel, accommodation and follow-up care are paid by the patient to the hospital or provider concerned.';

// Intentionally empty: no verified content yet. Load from the database when available.
export const TRUST_STATS: Array<{ label: string; value: string; icon: string }> = [];

export const SPECIALTIES = [
  { name: 'Cardiology', slug: 'cardiology', emoji: '❤️', description: 'Heart surgeries, angioplasty, bypass' },
  { name: 'Oncology', slug: 'oncology', emoji: '🔬', description: 'Cancer diagnosis and treatment' },
  { name: 'Orthopedics', slug: 'orthopedics', emoji: '🦴', description: 'Joint replacement, spine surgery' },
  { name: 'Neurology', slug: 'neurology', emoji: '🧠', description: 'Brain, spine and nerve conditions' },
  { name: 'IVF & Fertility', slug: 'ivf-fertility', emoji: '👶', description: 'IVF, IUI and fertility treatments' },
  { name: 'Transplants', slug: 'transplants', emoji: '🫀', description: 'Kidney, liver, heart transplants' },
  { name: 'Cosmetic Surgery', slug: 'cosmetic-surgery', emoji: '✨', description: 'Reconstructive and aesthetic surgery' },
  { name: 'Bariatrics', slug: 'bariatrics', emoji: '⚕️', description: 'Weight loss and metabolic surgery' },
  { name: 'Spine Surgery', slug: 'spine-surgery', emoji: '🦷', description: 'Disc, deformity and trauma' },
  { name: 'Urology', slug: 'urology', emoji: '🩺', description: 'Kidney, prostate and urinary tract' },
];

export const DESTINATIONS = [
  { country: 'India', slug: 'india', code: 'IN', topTreatment: 'Cardiac Surgery', flag: '🇮🇳', highlight: 'Most affordable, world-class expertise' },
  { country: 'Turkey', slug: 'turkey', code: 'TR', topTreatment: 'Hair Transplant', flag: '🇹🇷', highlight: 'Premium care, European standards' },
  { country: 'Thailand', slug: 'thailand', code: 'TH', topTreatment: 'Cosmetic Surgery', flag: '🇹🇭', highlight: 'JCI hospitals, recovery paradise' },
  { country: 'Singapore', slug: 'singapore', code: 'SG', topTreatment: 'Cancer Treatment', flag: '🇸🇬', highlight: 'Top-ranked Asian healthcare hub' },
  { country: 'Malaysia', slug: 'malaysia', code: 'MY', topTreatment: 'Orthopedics', flag: '🇲🇾', highlight: 'English-speaking, affordable' },
  { country: 'Germany', slug: 'germany', code: 'DE', topTreatment: 'Neurosurgery', flag: '🇩🇪', highlight: 'Cutting-edge technology' },
  { country: 'UAE', slug: 'uae', code: 'AE', topTreatment: 'Stem Cell Therapy', flag: '🇦🇪', highlight: 'World-class facilities' },
  { country: 'Egypt', slug: 'egypt', code: 'EG', topTreatment: 'IVF', flag: '🇪🇬', highlight: 'Arabic-speaking, regional hub' },
];

export const WHY_CHOOSE_US = [
  { title: 'Vetted & Accredited Hospitals', description: 'Every hospital is JCI or NABH accredited and personally verified by our team.', emoji: '🛡️' },
  { title: 'Dedicated Case Manager', description: 'A personal case manager guides you from enquiry to full recovery.', emoji: '👤' },
  { title: 'Free Coordination Support', description: 'Our enquiry review, hospital matching and coordination support are free. Treatment and travel costs are paid by the patient.', emoji: '🎁' },
  { title: 'Clear Cost Estimates', description: 'You receive a hospital estimate for your case, with what is and is not included, before you decide anything.', emoji: '💰' },
  { title: 'Travel Support', description: 'We help coordinate your visa invitation, flights, hotel and airport transfers.', emoji: '✈️' },
  { title: 'Multilingual Team', description: 'Support in English, Arabic, French, Russian and more.', emoji: '🌐' },
];

export const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export const BLOG_CATEGORIES = [
  'Medical Tourism Tips',
  'Treatment Guides',
  'Destination Guides',
  'Patient Stories',
  'Visa & Travel',
];

export const QUICK_LINKS = [
  'Knee Replacement',
  'Cancer Treatment',
  'IVF',
  'Heart Surgery',
  'Liver Transplant',
  'Hair Transplant',
  'Spine Surgery',
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Send Your Enquiry',
    description: `Tell us what you need and how to reach you. Our team reviews it and calls back ${CALLBACK_TIMEFRAME}. Reports are requested later, only when needed, through a secure route we agree with you.`,
    emoji: '📋',
  },
  {
    step: 2,
    title: 'Get Matched and Get an Estimate',
    description: 'After reviewing your case we suggest suitable hospitals and doctors, and the hospital provides a cost estimate for your treatment.',
    emoji: '🏥',
  },
  {
    step: 3,
    title: 'Travel with Support',
    description: 'We help coordinate your visa invitation, travel, accommodation and airport transfer. Travel costs are paid by you.',
    emoji: '✈️',
  },
  {
    step: 4,
    title: 'Recover with Follow-up Care',
    description: 'Follow-up arrangements depend on your treatment and hospital. Your case manager explains what is available for your case before you travel.',
    emoji: '💊',
  },
];

// Intentionally empty: no verified content yet. Load from the database when available.
export const FEATURED_HOSPITALS: Array<{ name: string; city: string; country: string; slug: string; accreditations: string[]; specialties: string[]; rating: number; reviewCount: number }> = [];

// Intentionally empty: no verified content yet. Load from the database when available.
export const FEATURED_DOCTORS: Array<{ name: string; specialty: string; hospital: string; experience: number; slug: string; rating: number; reviewCount: number }> = [];

// Intentionally empty: no verified content yet. Load from the database when available.
export const TESTIMONIALS: Array<{ name: string; country: string; treatment: string; quote: string; rating: number }> = [];

// Intentionally empty: no verified content yet. Load from the database when available.
export const BLOG_POSTS: Array<{ title: string; slug: string; category: string; date: string; readTime: number; excerpt: string }> = [];

export const PROCEDURES = [
  { id: 'heart-bypass', specialty: 'cardiology', name: 'Coronary Artery Bypass (CABG)', category: 'Cardiac', description: 'Advanced heart bypass surgery by JCI-certified cardiac surgeons', costFrom: 6000, costTo: 9000, currency: 'USD', timeline: '14-21 days', hospitalStay: '7-10 days', slug: 'coronary-artery-bypass' },
  { id: 'knee-replacement', specialty: 'orthopedics', name: 'Total Knee Replacement', category: 'Orthopedic', description: 'Complete knee joint replacement using robotic-assisted techniques', costFrom: 3500, costTo: 5500, currency: 'USD', timeline: '10-14 days', hospitalStay: '4-5 days', slug: 'total-knee-replacement' },
  { id: 'liver-transplant', specialty: 'transplants', name: 'Liver Transplant', category: 'Transplants', description: 'Living donor or cadaveric liver transplant at top-accredited hospitals', costFrom: 25000, costTo: 45000, currency: 'USD', timeline: '4-8 weeks', hospitalStay: '3-4 weeks', slug: 'liver-transplant' },
  { id: 'ivf', specialty: 'ivf-fertility', name: 'IVF Treatment', category: 'IVF & Fertility', description: 'In vitro fertilisation with high success rates and personalized care', costFrom: 2500, costTo: 4500, currency: 'USD', timeline: '3-4 weeks', hospitalStay: 'Outpatient', slug: 'ivf-treatment' },
  { id: 'hair-transplant', specialty: 'cosmetic-surgery', name: 'Hair Transplant (FUE)', category: 'Cosmetic', description: 'Follicular Unit Extraction hair transplant with natural results', costFrom: 1200, costTo: 3500, currency: 'USD', timeline: '3-5 days', hospitalStay: 'Outpatient', slug: 'hair-transplant' },
  { id: 'spine-surgery', specialty: 'spine-surgery', name: 'Spine Surgery (TLIF/PLIF)', category: 'Spine', description: 'Minimally invasive spinal fusion with advanced navigation', costFrom: 5500, costTo: 10000, currency: 'USD', timeline: '14-21 days', hospitalStay: '5-7 days', slug: 'spine-surgery' },
];

/**
 * Broad treatment areas offered in the enquiry form, so a patient can ask for help even when the exact
 * procedure is not listed on the site. The first ten mirror SPECIALTIES (same slugs).
 */
export const TREATMENT_AREAS: Array<{ slug: string; label: string }> = [
  { slug: 'cardiology', label: 'Heart & Cardiac Care' },
  { slug: 'oncology', label: 'Cancer / Oncology' },
  { slug: 'orthopedics', label: 'Bones & Joints (Orthopaedics)' },
  { slug: 'spine-surgery', label: 'Spine' },
  { slug: 'neurology', label: 'Brain & Nerves (Neurology)' },
  { slug: 'urology', label: 'Kidney & Urology' },
  { slug: 'gastroenterology', label: 'Liver, Stomach & Digestive Care' },
  { slug: 'transplants', label: 'Organ & Bone Marrow Transplants' },
  { slug: 'ivf-fertility', label: 'IVF & Fertility' },
  { slug: 'womens-health', label: "Women's Health (Gynaecology)" },
  { slug: 'paediatrics', label: "Children's Health (Paediatrics)" },
  { slug: 'ophthalmology', label: 'Eye Care' },
  { slug: 'ent', label: 'Ear, Nose & Throat (ENT)' },
  { slug: 'dental', label: 'Dental Care' },
  { slug: 'dermatology', label: 'Skin & Hair' },
  { slug: 'cosmetic-surgery', label: 'Cosmetic & Reconstructive Surgery' },
  { slug: 'bariatrics', label: 'Weight-loss Surgery (Bariatrics)' },
  { slug: 'rehabilitation', label: 'Rehabilitation & Physiotherapy' },
  { slug: 'second-opinion', label: 'Second Opinion / Health Check-up' },
];

/** Value used in the enquiry form when the treatment is not listed or the patient is unsure. */
export const OTHER_TREATMENT_VALUE = 'other';

export const FAQ = [
  { id: 1, question: 'Are international hospitals really safe?', answer: 'All our partner hospitals hold JCI (Joint Commission International) or NABH accreditation, meeting the same rigorous international standards as top Western hospitals. Our surgeons are internationally trained with 95-99% success rates.' },
  { id: 2, question: 'How much can I save on treatment abroad?', answer: 'Patients typically save 60-85% compared to costs in the USA, UK, or Australia. For example, heart bypass surgery that costs $120,000 in the USA is available for $6,000-$9,000 in India at a JCI-accredited hospital.' },
  { id: 3, question: 'What is free, and what do I pay for?', answer: 'Our own service is free for you: reviewing your enquiry, matching you with a hospital and coordinating the next steps cost you nothing. You still pay for the care itself — treatment, hospital stay, medicines, travel, accommodation and follow-up are paid to the hospital or provider concerned. Our team explains these costs for your case before you decide anything. We are compensated by our partner hospitals, and there is no markup on hospital fees.' },
  { id: 4, question: 'How do I get a visa for medical treatment?', answer: 'Most countries issue Medical Visas on priority for treatment abroad. We guide you through the entire visa process, provide hospital invitation letters, and liaise with the embassy on your behalf.' },
  { id: 5, question: 'Can I bring a family member?', answer: 'Absolutely. We arrange accommodation and support for your companion, and many hospitals offer discounted companion accommodation.' },
  { id: 6, question: 'What follow-up care do I get after returning home?', answer: 'It depends on your treatment and hospital. Your case manager explains the follow-up arrangements for your case before you travel, and stays reachable to help you coordinate them after you return home.' },
];
