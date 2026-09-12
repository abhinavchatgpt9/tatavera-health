export const SITE_NAME = 'Tatavera Health';
export const SITE_TAGLINE = 'World-Class Treatment. Trusted Guidance. Every Step.';
export const SITE_DESCRIPTION =
  'Tatavera Health connects international patients with top-accredited hospitals and doctors worldwide. Free consultation, dedicated case manager, end-to-end support.';
export const SITE_URL = 'https://tataverahealth.com';
export const WHATSAPP_NUMBER = '+919877263279';
export const CONTACT_EMAIL = 'care@tataverahealth.com';
export const CONTACT_PHONE = '+91 99999 99999';

export const TRUST_STATS = [
  { label: 'Patients Assisted', value: '100,000+', icon: 'users' },
  { label: 'Partner Hospitals', value: '500+', icon: 'building-2' },
  { label: 'Expert Doctors', value: '8,000+', icon: 'stethoscope' },
  { label: 'Countries Served', value: '125+', icon: 'globe' },
];

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
  { title: 'All Services Free for Patients', description: 'Our consultation, matching, and support services are completely free.', emoji: '🎁' },
  { title: 'Transparent Pricing', description: 'No hidden costs. Detailed cost estimates before you decide anything.', emoji: '💰' },
  { title: 'End-to-End Travel Support', description: 'Visa, flights, hotel, airport transfers — we coordinate everything.', emoji: '✈️' },
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
    title: 'Share Your Medical Reports',
    description: 'Upload your reports securely. Our medical team reviews your case within 24 hours.',
    emoji: '📋',
  },
  {
    step: 2,
    title: 'Get Matched',
    description: 'We match you with the best hospital and doctor for your condition and budget.',
    emoji: '🏥',
  },
  {
    step: 3,
    title: 'Travel with Full Support',
    description: 'Visa, flights, accommodation, airport transfer — everything is arranged for you.',
    emoji: '✈️',
  },
  {
    step: 4,
    title: 'Recover with Follow-up Care',
    description: 'Post-treatment follow-up care and remote consultations included.',
    emoji: '💊',
  },
];

export const FEATURED_HOSPITALS = [
  { name: 'Apollo Hospitals', city: 'Chennai', country: 'India', slug: 'apollo-hospitals-chennai', accreditations: ['JCI', 'NABH'], specialties: ['Cardiology', 'Oncology', 'Orthopedics'], rating: 4.9, reviewCount: 1420 },
  { name: 'Fortis Healthcare', city: 'Delhi', country: 'India', slug: 'fortis-delhi', accreditations: ['JCI', 'NABH'], specialties: ['Neurology', 'Cardiology', 'Transplants'], rating: 4.8, reviewCount: 980 },
  { name: 'Memorial Hospital', city: 'Istanbul', country: 'Turkey', slug: 'memorial-istanbul', accreditations: ['JCI'], specialties: ['Oncology', 'Hair Transplant', 'Cosmetics'], rating: 4.8, reviewCount: 720 },
  { name: 'Bumrungrad International', city: 'Bangkok', country: 'Thailand', slug: 'bumrungrad-bangkok', accreditations: ['JCI'], specialties: ['Cardiology', 'Orthopedics', 'IVF'], rating: 4.9, reviewCount: 1150 },
  { name: 'Mount Elizabeth', city: 'Singapore', country: 'Singapore', slug: 'mount-elizabeth-singapore', accreditations: ['JCI'], specialties: ['Cancer', 'Neurology', 'Spine'], rating: 4.9, reviewCount: 890 },
  { name: 'Max Healthcare', city: 'Delhi', country: 'India', slug: 'max-healthcare-delhi', accreditations: ['JCI', 'NABH', 'NABL'], specialties: ['Liver Transplant', 'Bariatrics', 'IVF'], rating: 4.7, reviewCount: 1100 },
];

export const FEATURED_DOCTORS = [
  { name: 'Dr. Devi Prasad Shetty', specialty: 'Cardiac Surgery', hospital: 'Narayana Health, Bangalore', experience: 35, slug: 'dr-devi-prasad-shetty', rating: 4.9, reviewCount: 820 },
  { name: 'Dr. Arun Saroha', specialty: 'Neurosurgery', hospital: 'Max Healthcare, Delhi', experience: 22, slug: 'dr-arun-saroha', rating: 4.8, reviewCount: 450 },
  { name: 'Dr. Sunil Shroff', specialty: 'Urology & Transplant', hospital: 'MIOT Hospital, Chennai', experience: 28, slug: 'dr-sunil-shroff', rating: 4.9, reviewCount: 360 },
  { name: 'Dr. Harshad Joshi', specialty: 'Orthopedic Surgery', hospital: 'Kokilaben Hospital, Mumbai', experience: 20, slug: 'dr-harshad-joshi', rating: 4.7, reviewCount: 290 },
  { name: 'Dr. Firat Aydin', specialty: 'Oncology', hospital: 'Memorial Hospital, Istanbul', experience: 18, slug: 'dr-firat-aydin', rating: 4.8, reviewCount: 310 },
  { name: 'Dr. Nantana Thaworn', specialty: 'Cosmetic Surgery', hospital: 'Bumrungrad, Bangkok', experience: 15, slug: 'dr-nantana-thaworn', rating: 4.9, reviewCount: 520 },
];

export const TESTIMONIALS = [
  { name: 'Amara Diallo', country: 'Nigeria', treatment: 'Cardiac Bypass', quote: 'Tatavera guided me from Lagos to India for my heart surgery. The care was incredible and I saved 85% compared to treatment at home.', rating: 5 },
  { name: 'Mohammed Al-Rashidi', country: 'Kuwait', treatment: 'Knee Replacement', quote: 'My case manager was available 24/7, even on weekends. The hospital in India felt like a five-star hotel. Highly recommend Tatavera.', rating: 5 },
  { name: 'Fatima Hassan', country: 'Egypt', treatment: 'IVF', quote: 'After years of failed treatments locally, we came to India through Tatavera. I am now 6 months pregnant. Forever grateful.', rating: 5 },
  { name: 'Sergei Petrov', country: 'Russia', treatment: 'Liver Transplant', quote: 'The doctors at Apollo were world-class. Tatavera translated everything and was with me every step. A true lifesaver.', rating: 5 },
];

export const BLOG_POSTS = [
  { title: 'Why India is the Top Destination for Medical Tourism in 2025', slug: 'india-top-medical-tourism-2025', category: 'Destination Guides', date: '2025-01-15', readTime: 6, excerpt: 'Explore why over 600,000 international patients choose India annually for world-class treatment at a fraction of the cost.' },
  { title: 'Complete Guide to Medical Visa for India: Step-by-Step', slug: 'india-medical-visa-guide', category: 'Visa & Travel', date: '2025-01-10', readTime: 8, excerpt: 'Everything you need to know about obtaining a Medical Visa for India, including documents, costs, and timelines.' },
  { title: 'Heart Bypass Surgery Abroad: What to Expect', slug: 'heart-bypass-surgery-abroad', category: 'Treatment Guides', date: '2025-01-05', readTime: 10, excerpt: 'A complete guide for patients considering coronary artery bypass graft surgery outside their home country.' },
];

export const PROCEDURES = [
  { id: 'heart-bypass', name: 'Coronary Artery Bypass (CABG)', category: 'Cardiac', description: 'Advanced heart bypass surgery by JCI-certified cardiac surgeons', costFrom: 6000, costTo: 9000, currency: 'USD', timeline: '14-21 days', hospitalStay: '7-10 days', slug: 'coronary-artery-bypass' },
  { id: 'knee-replacement', name: 'Total Knee Replacement', category: 'Orthopedic', description: 'Complete knee joint replacement using robotic-assisted techniques', costFrom: 3500, costTo: 5500, currency: 'USD', timeline: '10-14 days', hospitalStay: '4-5 days', slug: 'total-knee-replacement' },
  { id: 'liver-transplant', name: 'Liver Transplant', category: 'Transplants', description: 'Living donor or cadaveric liver transplant at top-accredited hospitals', costFrom: 25000, costTo: 45000, currency: 'USD', timeline: '4-8 weeks', hospitalStay: '3-4 weeks', slug: 'liver-transplant' },
  { id: 'ivf', name: 'IVF Treatment', category: 'IVF & Fertility', description: 'In vitro fertilisation with high success rates and personalized care', costFrom: 2500, costTo: 4500, currency: 'USD', timeline: '3-4 weeks', hospitalStay: 'Outpatient', slug: 'ivf-treatment' },
  { id: 'hair-transplant', name: 'Hair Transplant (FUE)', category: 'Cosmetic', description: 'Follicular Unit Extraction hair transplant with natural results', costFrom: 1200, costTo: 3500, currency: 'USD', timeline: '3-5 days', hospitalStay: 'Outpatient', slug: 'hair-transplant' },
  { id: 'spine-surgery', name: 'Spine Surgery (TLIF/PLIF)', category: 'Spine', description: 'Minimally invasive spinal fusion with advanced navigation', costFrom: 5500, costTo: 10000, currency: 'USD', timeline: '14-21 days', hospitalStay: '5-7 days', slug: 'spine-surgery' },
];

export const FAQ = [
  { id: 1, question: 'Are international hospitals really safe?', answer: 'All our partner hospitals hold JCI (Joint Commission International) or NABH accreditation, meeting the same rigorous international standards as top Western hospitals. Our surgeons are internationally trained with 95-99% success rates.' },
  { id: 2, question: 'How much can I save on treatment abroad?', answer: 'Patients typically save 60-85% compared to costs in the USA, UK, or Australia. For example, heart bypass surgery that costs $120,000 in the USA is available for $6,000-$9,000 in India at a JCI-accredited hospital.' },
  { id: 3, question: 'Is your service really free for patients?', answer: 'Yes, 100% free. We are compensated by our partner hospitals. There is no markup on hospital fees — you pay the same price as any direct patient.' },
  { id: 4, question: 'How do I get a visa for medical treatment?', answer: 'Most countries issue Medical Visas on priority for treatment abroad. We guide you through the entire visa process, provide hospital invitation letters, and liaise with the embassy on your behalf.' },
  { id: 5, question: 'Can I bring a family member?', answer: 'Absolutely. We arrange accommodation and support for your companion, and many hospitals offer discounted companion accommodation.' },
  { id: 6, question: 'What follow-up care do I get after returning home?', answer: 'Your surgeon provides telemedicine follow-up consultations for 6 months post-treatment. Your dedicated case manager remains reachable throughout your recovery.' },
];
