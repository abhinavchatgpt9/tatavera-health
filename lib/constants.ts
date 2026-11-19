export const SITE_NAME = 'Tatvavera Health';
export const SITE_TAGLINE = 'Across Country. Alongside You';
export const SITE_DESCRIPTION =
  'Tatvavera Health connects international patients with accredited hospitals and doctors in India. Free enquiry review, a dedicated case manager and end-to-end coordination support.';
/** Search-focused homepage fields. The tagline stays visible on the page, but search engines see what the service is. */
export const HOME_TITLE = 'Medical Treatment in India | Tatvavera Health';
export const HOME_H1 = 'Plan your medical treatment in India';
export const HOME_DESCRIPTION =
  'Explore medical treatment in India with Tatvavera Health. Hospital coordination, travel planning and follow-up support for international patients.';
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

export type BlogSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type BlogPost = {
  title: string;
  slug: string;
  category: string;
  /** Date first published, YYYY-MM-DD. */
  date: string;
  /** Date the text was last changed, YYYY-MM-DD. Update it whenever the guide is edited. */
  updated: string;
  author: string;
  readTime: number;
  excerpt: string;
  /** Paragraphs and bullets may contain [link text](/internal-path) links. */
  sections: BlogSection[];
};

// Guides are written by the Tatvavera Health team and carry no named clinician. Do not add a reviewer name
// unless a real person has reviewed the text and agreed to be named.
export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Planning treatment in India: costs beyond the hospital bill',
    slug: 'planning-treatment-in-india-costs-beyond-the-hospital-bill',
    category: 'Medical Tourism Tips',
    date: '2026-11-20',
    updated: '2026-11-20',
    author: 'Tatvavera Health team',
    readTime: 6,
    excerpt:
      'A hospital estimate is only one part of what treatment in India costs. This guide lists the other costs international patients should ask about and plan for before they travel.',
    sections: [
      {
        heading: 'Start with what the hospital estimate covers',
        paragraphs: [
          'A hospital estimate is the hospital\'s expected charge for a procedure and the usual stay, based on the reports it has reviewed. It is not a final bill. Ask for it in writing and ask for it itemised, so you can see what each line covers.',
          'Check these items in the estimate:',
        ],
        bullets: [
          'Surgeon, anaesthesia and other doctor fees',
          'Room category and the number of days the estimate assumes',
          'Operating theatre and intensive care charges',
          'Implants, devices and consumables, and which type or grade is included',
          'Medicines, tests and scans during the stay',
          'Physiotherapy or rehabilitation during the stay',
        ],
      },
      {
        heading: 'What an estimate often leaves out',
        paragraphs: [
          'Estimates are built on the plan the hospital can see today. Ask directly what is not included. Common gaps are:',
        ],
        bullets: [
          'Medicines you need after discharge',
          'Extra hospital days if recovery takes longer than planned',
          'Additional tests or procedures your doctor decides you need',
          'A room upgrade or a bed for a companion',
          'Outpatient visits in India before you fly home',
          'Copies or translations of your medical records',
        ],
      },
      {
        heading: 'Ask what happens if the plan changes',
        paragraphs: [
          'Treatment plans can change once the doctors examine you in person. Before you travel, ask who decides about extra tests or procedures, how you will be told, and whether you will be told about extra charges before they are added. Ask how payment works too: who you pay, in which currency, by which method, and what happens to your payment if you cancel.',
        ],
      },
      {
        heading: 'Travel and living costs',
        paragraphs: ['These are paid separately from the hospital, so add them to your own budget:'],
        bullets: [
          'Flights for you and a companion, ideally with dates you can change',
          'Medical visa fees and any visa service charges',
          'Accommodation before admission and after discharge, for you and your companion',
          'Local transport between the airport, hospital and your accommodation',
          'Food, a local SIM or mobile data, and laundry',
          'Travel insurance. Check what it covers, because some policies exclude planned treatment abroad',
        ],
      },
      {
        heading: 'Money matters: exchange rates and reserves',
        paragraphs: [
          'Card fees, transfer fees and exchange-rate differences can add up, so ask the hospital which payment methods it accepts and keep every receipt. It also helps to keep a reserve for the unexpected. How much is sensible depends on your procedure, so ask your doctor and the hospital what they would advise for your case.',
        ],
      },
      {
        heading: 'Costs after you return home',
        paragraphs: [
          'Follow-up does not end at the airport. You may need check-ups, tests, physiotherapy or repeat prescriptions at home. Our guide on [planning follow-up after returning home from treatment in India](/blog/planning-follow-up-after-returning-home-from-treatment-in-india) explains what to arrange before you leave.',
        ],
      },
      {
        heading: 'Questions to ask before you decide',
        bullets: [
          'Can I have the estimate in writing, itemised, with the assumptions behind it?',
          'What is not included, and roughly what could it cost?',
          'How many days should I plan to stay in India, and why?',
          'What happens to the price if my stay is longer or my plan changes?',
          'How and in which currency do I pay, and what is the refund or cancellation policy?',
          'What follow-up is included, and what will I arrange and pay for at home?',
        ],
      },
      {
        heading: 'Where Tatvavera Health fits in',
        paragraphs: [
          'Our enquiry review, hospital matching and coordination support are free for patients. Treatment, hospital stay, medicines, travel, accommodation and follow-up are paid to the hospital or provider concerned. We help you ask these questions and coordinate the answers. See [how it works](/how-it-works) and our [services](/services), read about [treatment in India](/destinations/india), or [request a callback](/free-consultation) and tell us about your case.',
        ],
      },
    ],
  },
  {
    title: 'Planning follow-up after returning home from treatment in India',
    slug: 'planning-follow-up-after-returning-home-from-treatment-in-india',
    category: 'Medical Tourism Tips',
    date: '2026-11-20',
    updated: '2026-11-20',
    author: 'Tatvavera Health team',
    readTime: 6,
    excerpt:
      'Good follow-up starts before you leave India. This guide covers the documents to bring home, how to involve your own doctor, and how to stay in touch with the treating team.',
    sections: [
      {
        heading: 'Plan follow-up before you travel',
        paragraphs: [
          'Ask the treating team what follow-up you will need, when, and which parts can be done at home or by video. Ask who your contact person is after you return, how to reach them, and what hours and languages they cover. Write the answers down.',
        ],
      },
      {
        heading: 'Documents to leave India with',
        paragraphs: ['Ask the hospital for these before discharge, and keep them in your hand luggage:'],
        bullets: [
          'Discharge summary',
          'Procedure or operation notes, where they apply',
          'Scans and test reports, with the images on a disc or a secure download',
          'A list of your medicines with generic names, doses and how long to continue',
          'Details of any implant or device, including any card or identification the hospital provides',
          'A written follow-up schedule and the warning signs your doctor wants you to watch for',
          'Contact details for the treating team',
          'Bills and receipts, which you may need for insurance',
        ],
      },
      {
        heading: 'Travelling home',
        paragraphs: [
          'Ask your doctor when it is safe to fly and what precautions to take on the journey. Arrange help at the airport if you need it, and keep your medicines and records with you rather than in checked luggage.',
        ],
      },
      {
        heading: 'Involve your doctor at home',
        paragraphs: [
          'Share your discharge documents with your own doctor or specialist before you return, or soon after. Ask whether they can handle check-ups, tests, wound checks or physiotherapy. Local doctors decide for themselves what care they can take on, and many prefer to see your records first. Keeping both teams informed avoids repeated tests and conflicting advice.',
        ],
      },
      {
        heading: 'Staying in touch with the treating team',
        paragraphs: [
          'Many hospitals can review progress by phone or video, and look at new reports you send. Agree the method before you leave: where to send reports, how quickly to expect a reply, and how to allow for the time difference. Keep a list of questions between reviews so none are missed.',
        ],
      },
      {
        heading: 'Know when to get urgent help',
        paragraphs: [
          'Your treating team should tell you which symptoms need urgent attention for your specific procedure. Ask for them in writing. If you feel seriously unwell after you return, contact your local emergency services first, then let your Indian team know.',
        ],
      },
      {
        heading: 'Budget for follow-up',
        paragraphs: [
          'Check-ups, tests, physiotherapy and medicines at home are normally paid by you. Our guide on [costs beyond the hospital bill](/blog/planning-treatment-in-india-costs-beyond-the-hospital-bill) lists the other costs to plan for.',
        ],
      },
      {
        heading: 'Where Tatvavera Health fits in',
        paragraphs: [
          'What follow-up is available depends on your treatment and the hospital. Your case manager explains the arrangements for your case before you travel and stays reachable to help you coordinate them after you return home. See [how it works](/how-it-works) and our [services](/services), read about [treatment in India](/destinations/india), or [request a callback](/free-consultation).',
        ],
      },
    ],
  },
];

/** Page title and main heading used on each treatment page. Keep the title near 60 characters or less where possible. */
export const PROCEDURE_SEO: Record<string, { title: string; h1: string }> = {
  'coronary-artery-bypass': { title: 'Heart Bypass Surgery (CABG)', h1: 'Heart bypass surgery (CABG) in India' },
  'total-knee-replacement': { title: 'Knee Replacement', h1: 'Knee replacement in India' },
  'liver-transplant': { title: 'Liver Transplant', h1: 'Liver transplant in India' },
  'ivf-treatment': { title: 'IVF Treatment', h1: 'IVF treatment in India' },
  'hair-transplant': { title: 'Hair Transplant', h1: 'Hair transplant in India' },
  'spine-surgery': { title: 'Spine Surgery', h1: 'Spine surgery in India' },
};

/**
 * Questions specific to one procedure, shown above the general questions on its treatment page.
 * Answers avoid clinical figures: anything about your own treatment is decided by your surgeon.
 */
export const PROCEDURE_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  'total-knee-replacement': [
    {
      question: 'What should I send to get a knee replacement estimate?',
      answer:
        'Send your recent knee X-rays or MRI reports if you have them, a short history of the problem, your current medicines, and any other operations or long-term conditions you have. Hospitals can only give an estimate for your case after a doctor has reviewed these.',
    },
    {
      question: 'How long should I plan to stay in India?',
      answer:
        'The treatment page shows an indicative hospital stay and an overall timeline. Your own plan depends on your surgeon\'s assessment and how your recovery goes, so ask the hospital for the stay it expects for you and allow some extra days.',
    },
    {
      question: 'Can both knees be done in one trip?',
      answer:
        'Whether one or both knees are replaced, and whether at the same time or separately, is a decision for your surgeon after reviewing your reports and general health. Ask for the options and the estimate for each.',
    },
    {
      question: 'What does the knee replacement estimate not include?',
      answer:
        'Flights, accommodation, visa, medicines after discharge and follow-up are normally extra, and the hospital estimate confirms exactly what is included for your case. Read our guide on [costs beyond the hospital bill](/blog/planning-treatment-in-india-costs-beyond-the-hospital-bill).',
    },
    {
      question: 'What happens with physiotherapy and follow-up after I return home?',
      answer:
        'Ask the hospital which physiotherapy and check-ups you will need and which can be done near your home. Share your discharge papers with your own doctor. Our guide on [follow-up after returning home](/blog/planning-follow-up-after-returning-home-from-treatment-in-india) explains what to arrange.',
    },
  ],
};

export const PROCEDURES = [
  { id: 'heart-bypass', specialty: 'cardiology', name: 'Coronary Artery Bypass (CABG)', category: 'Cardiac', description: 'Advanced heart bypass surgery by JCI-certified cardiac surgeons', costFrom: 6000, costTo: 9000, currency: 'USD', timeline: '14-21 days', hospitalStay: '7-10 days', slug: 'coronary-artery-bypass' },
  { id: 'knee-replacement', specialty: 'orthopedics', name: 'Total Knee Replacement', category: 'Orthopedic', description: 'Total knee joint replacement. Your surgeon recommends the technique and implant after reviewing your reports', costFrom: 3500, costTo: 5500, currency: 'USD', timeline: '10-14 days', hospitalStay: '4-5 days', slug: 'total-knee-replacement' },
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
