/**
 * Database seed — Tatavera Health
 *
 * Populates a fresh Postgres with the same content the public site already
 * ships in lib/*, plus demo accounts for every role and a sample CRM pipeline
 * so the portals render against real rows instead of mock data.
 *
 * Run:  npm run db:seed
 * Safe to re-run — every write is an idempotent upsert keyed on a natural key.
 */

import { PrismaClient, Role, LeadStage } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { TOP_HOSPITALS, TOP_DOCTORS, PATIENT_TESTIMONIALS } from '../lib/hospitals-data';
import { PROCEDURES, DESTINATIONS, BLOG_POSTS, FAQ } from '../lib/constants';

const prisma = new PrismaClient();

/** "6,000–9,000" | "28,000-40,000" | "1,200" -> [6000, 9000] */
function parseCostRange(raw: string): [number, number] {
  const numbers = raw
    .replace(/[^0-9,\-–—]/g, '')
    .split(/[-–—]/)
    .map((part) => Number(part.replace(/,/g, '')))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (numbers.length === 0) return [0, 0];
  if (numbers.length === 1) return [numbers[0], numbers[0]];
  return [numbers[0], numbers[1]];
}

/**
 * Free-text procedure names differ between sources — a hospital lists
 * "Coronary Bypass (CABG)" while the catalogue calls it "Coronary Artery
 * Bypass (CABG)". Match on distinctive keywords rather than string similarity,
 * which is both more accurate and easier to extend.
 */
const TREATMENT_KEYWORDS: Array<{ slug: string; keywords: string[] }> = [
  { slug: 'coronary-artery-bypass', keywords: ['cabg', 'bypass', 'coronary', 'cardiac surgery', 'open heart', 'heart surgery', 'angioplasty', 'valve'] },
  { slug: 'total-knee-replacement', keywords: ['knee', 'joint replacement', 'hip replacement', 'orthopedic', 'orthopaedic', 'arthroplasty'] },
  { slug: 'liver-transplant', keywords: ['liver', 'transplant', 'kidney', 'hepat', 'bone marrow'] },
  { slug: 'ivf-treatment', keywords: ['ivf', 'fertility', 'iui', 'reproductive'] },
  { slug: 'hair-transplant', keywords: ['hair', 'cosmetic', 'aesthetic', 'plastic surgery', 'rhinoplasty'] },
  { slug: 'spine-surgery', keywords: ['spine', 'spinal', 'disc', 'tlif', 'plif', 'laminectomy'] },
];

/** Returns the catalogue treatment slugs a free-text procedure name maps to. */
function matchTreatmentSlugs(text: string): string[] {
  const haystack = text.toLowerCase();
  return TREATMENT_KEYWORDS.filter((entry) =>
    entry.keywords.some((keyword) => haystack.includes(keyword))
  ).map((entry) => entry.slug);
}

// ─── TREATMENTS ───────────────────────────────────────────────────────────────

async function seedTreatments() {
  const specialtyByCategory: Record<string, string> = {
    Cardiac: 'Cardiology',
    Orthopedic: 'Orthopedics',
    Transplants: 'Transplants',
    'IVF & Fertility': 'IVF & Fertility',
    Cosmetic: 'Cosmetic Surgery',
    Spine: 'Spine Surgery',
  };

  for (const procedure of PROCEDURES) {
    const specialty = specialtyByCategory[procedure.category] ?? procedure.category;

    const treatment = await prisma.treatment.upsert({
      where: { slug: procedure.slug },
      update: {
        name: procedure.name,
        specialty,
        description: procedure.description,
        costFrom: procedure.costFrom,
        costTo: procedure.costTo,
        currency: procedure.currency,
        duration: procedure.timeline,
        hospitalStay: procedure.hospitalStay,
      },
      create: {
        slug: procedure.slug,
        name: procedure.name,
        specialty,
        description: procedure.description,
        content: [
          `## About ${procedure.name}`,
          '',
          procedure.description,
          '',
          `Typical cost abroad ranges from $${procedure.costFrom.toLocaleString()} to $${procedure.costTo.toLocaleString()} — a fraction of what the same procedure costs in the USA, UK or Australia, performed by internationally trained surgeons at JCI- and NABH-accredited hospitals.`,
          '',
          '### What the journey looks like',
          '',
          `Expect to be abroad for roughly ${procedure.timeline}, including ${procedure.hospitalStay} of hospital stay. Your case manager arranges the medical visa, hospital admission, airport pickup, accommodation for your companion and all follow-up scheduling before you fly home.`,
        ].join('\n'),
        costFrom: procedure.costFrom,
        costTo: procedure.costTo,
        currency: procedure.currency,
        duration: procedure.timeline,
        hospitalStay: procedure.hospitalStay,
        recoveryTime: procedure.timeline,
        metaTitle: `${procedure.name} Abroad — Cost, Hospitals & Recovery | Tatavera Health`,
        metaDescription: `${procedure.description}. Costs from $${procedure.costFrom.toLocaleString()}. Free consultation with a dedicated case manager.`,
        published: true,
      },
    });

    // Attach the shared FAQ set to each treatment once.
    const existingFaqs = await prisma.treatmentFaq.count({ where: { treatmentId: treatment.id } });
    if (existingFaqs === 0) {
      await prisma.treatmentFaq.createMany({
        data: FAQ.map((faq, index) => ({
          treatmentId: treatment.id,
          question: faq.question,
          answer: faq.answer,
          order: index,
        })),
      });
    }
  }

  console.log(`  treatments: ${PROCEDURES.length}`);
}

// ─── DESTINATIONS ─────────────────────────────────────────────────────────────

async function seedDestinations() {
  for (const destination of DESTINATIONS) {
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: { description: destination.highlight, topSpecialties: [destination.topTreatment] },
      create: {
        slug: destination.slug,
        country: destination.country,
        countryCode: destination.code,
        description: destination.highlight,
        content: [
          `## Medical treatment in ${destination.country}`,
          '',
          `${destination.highlight}. ${destination.country} is best known internationally for ${destination.topTreatment.toLowerCase()}, with accredited hospitals treating patients from across Africa, the Middle East, Central Asia and Europe.`,
          '',
          '### Why patients choose it',
          '',
          'Internationally accredited facilities, surgeons trained in the UK and USA, English-speaking clinical staff, and total costs that are a fraction of what the same care costs at home — including flights and accommodation.',
        ].join('\n'),
        topSpecialties: [destination.topTreatment],
        visaInfo: `Most nationalities can obtain a medical visa for ${destination.country}. Tatavera Health provides the hospital invitation letter and guides you through the embassy process end to end.`,
        travelTips: `Fly into the city nearest your chosen hospital. Your case manager arranges airport pickup, a local SIM, and accommodation for your companion before you land.`,
        accommodation: `Options range from hospital guest houses to serviced apartments within walking distance of the hospital. We book on your behalf at partner rates.`,
        metaTitle: `Medical Tourism in ${destination.country} — Hospitals, Costs & Visa | Tatavera Health`,
        metaDescription: `${destination.highlight}. Compare accredited hospitals in ${destination.country} and get a free cost estimate.`,
        featured: ['india', 'turkey', 'thailand'].includes(destination.slug),
        published: true,
      },
    });
  }

  console.log(`  destinations: ${DESTINATIONS.length}`);
}

// ─── HOSPITALS ────────────────────────────────────────────────────────────────

async function seedHospitals() {
  for (const source of TOP_HOSPITALS) {
    const hospital = await prisma.hospital.upsert({
      where: { slug: source.slug },
      update: {
        name: source.name,
        rating: source.rating,
        reviewCount: source.reviewCount,
        featured: Boolean(source.featured),
      },
      create: {
        slug: source.slug,
        name: source.name,
        city: source.city,
        country: source.country,
        phone: source.phone ?? null,
        website: source.website ?? null,
        description: source.about,
        coverImageUrl: source.heroImage ?? source.image ?? null,
        logoUrl: source.image ?? null,
        galleryUrls: [source.image, source.heroImage].filter(Boolean) as string[],
        accreditations: source.accreditations ?? [],
        specialties: source.specialties ?? [],
        bedsCount: source.beds ?? null,
        foundedYear: source.established ?? null,
        rating: source.rating ?? 0,
        reviewCount: source.reviewCount ?? 0,
        featured: Boolean(source.featured),
        published: true,
        metaTitle: `${source.name}, ${source.city} — Treatments, Costs & Doctors | Tatavera Health`,
        metaDescription: source.tagline ?? source.about.slice(0, 155),
      },
    });

    // Per-hospital procedure pricing.
    const existingCosts = await prisma.hospitalCostItem.count({ where: { hospitalId: hospital.id } });
    if (existingCosts === 0 && Array.isArray(source.treatments)) {
      await prisma.hospitalCostItem.createMany({
        data: source.treatments.map((item) => {
          const [costFrom, costTo] = parseCostRange(item.costUSD);
          return { hospitalId: hospital.id, procedure: item.name, costFrom, costTo, currency: 'USD' };
        }),
      });
    }

    // Link the hospital to catalogue treatments, matching both its listed
    // procedures and its declared specialties.
    const searchText = [...(source.treatments ?? []).map((t) => t.name), ...(source.specialties ?? [])].join(' | ');
    const matchedSlugs = new Set(matchTreatmentSlugs(searchText));

    for (const slug of matchedSlugs) {
      const procedure = PROCEDURES.find((p) => p.slug === slug);
      const treatment = await prisma.treatment.findUnique({ where: { slug } });
      if (!treatment || !procedure) continue;

      // Prefer this hospital's own quoted price where it lists one.
      const ownPrice = (source.treatments ?? []).find((item) =>
        matchTreatmentSlugs(item.name).includes(slug)
      );
      const [ownFrom, ownTo] = ownPrice ? parseCostRange(ownPrice.costUSD) : [0, 0];

      await prisma.hospitalTreatment.upsert({
        where: { hospitalId_treatmentId: { hospitalId: hospital.id, treatmentId: treatment.id } },
        update: {},
        create: {
          hospitalId: hospital.id,
          treatmentId: treatment.id,
          costFrom: ownFrom || procedure.costFrom,
          costTo: ownTo || procedure.costTo,
        },
      });
    }

    // Departments, derived from the hospital's own specialty list.
    const existingDepartments = await prisma.department.count({ where: { hospitalId: hospital.id } });
    if (existingDepartments === 0) {
      await prisma.department.createMany({
        data: (source.specialties ?? []).map((specialty) => ({
          hospitalId: hospital.id,
          name: specialty,
          description: `${specialty} at ${source.name}, ${source.city}.`,
        })),
      });
    }
  }

  console.log(`  hospitals: ${TOP_HOSPITALS.length}`);
}

// ─── DOCTORS ──────────────────────────────────────────────────────────────────

async function seedDoctors() {
  const hospitals = await prisma.hospital.findMany({ select: { id: true, name: true } });

  for (const source of TOP_DOCTORS) {
    const doctor = await prisma.doctor.upsert({
      where: { slug: source.slug },
      update: {
        name: source.name,
        rating: source.rating,
        reviewCount: source.reviewCount,
        published: true,
      },
      create: {
        slug: source.slug,
        name: source.name,
        designation: source.designation,
        specialty: source.specialty,
        subSpecialties: [],
        experience: source.experience,
        photoUrl: source.image ?? null,
        about: source.about,
        qualifications: source.education ?? [],
        certifications: [],
        publications: [],
        achievements: source.awards ?? [],
        languages: source.languages ?? ['English'],
        rating: source.rating ?? 0,
        reviewCount: source.reviewCount ?? 0,
        featured: true,
        published: true,
        metaTitle: `${source.name} — ${source.specialty} | Tatavera Health`,
        metaDescription: `${source.designation}. ${source.experience} years' experience, ${source.totalSurgeries} procedures. Book a free second opinion.`,
      },
    });

    // Link to the hospital named in the source data, matched on name prefix.
    const hospitalName = (source.hospital ?? '').split(',')[0].trim();
    const match = hospitals.find(
      (h) => h.name === hospitalName || h.name.startsWith(hospitalName) || hospitalName.startsWith(h.name)
    );
    if (match) {
      await prisma.doctorHospital.upsert({
        where: { doctorId_hospitalId: { doctorId: doctor.id, hospitalId: match.id } },
        update: {},
        create: { doctorId: doctor.id, hospitalId: match.id },
      });
    }

    // A standard Mon–Fri consulting schedule so the availability page has rows.
    const existingSlots = await prisma.doctorAvailability.count({ where: { doctorId: doctor.id } });
    if (existingSlots === 0) {
      await prisma.doctorAvailability.createMany({
        data: [1, 2, 3, 4, 5].map((dayOfWeek) => ({
          doctorId: doctor.id,
          dayOfWeek,
          startTime: '10:00',
          endTime: '17:00',
          slotMins: 30,
          active: true,
        })),
      });
    }
  }

  console.log(`  doctors: ${TOP_DOCTORS.length}`);
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

async function seedTestimonials() {
  const treatments = await prisma.treatment.findMany({ select: { id: true, slug: true } });

  for (const source of PATIENT_TESTIMONIALS) {
    const [matchedSlug] = matchTreatmentSlugs(source.treatment);
    const treatment = matchedSlug ? treatments.find((t) => t.slug === matchedSlug) : undefined;

    const existing = await prisma.testimonial.findFirst({
      where: { patientName: source.name, patientCountry: source.country },
    });
    if (existing) continue;

    await prisma.testimonial.create({
      data: {
        patientName: source.name,
        patientCountry: source.country,
        treatmentId: treatment?.id ?? null,
        quote: source.quote,
        photoUrl: source.image ?? null,
        videoUrl: source.videoUrl ?? null,
        rating: source.rating ?? 5,
        featured: true,
        published: true,
      },
    });
  }

  console.log(`  testimonials: ${PATIENT_TESTIMONIALS.length}`);
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

async function seedBlog() {
  for (const post of BLOG_POSTS) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { title: post.title, excerpt: post.excerpt, published: true },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: [
          `## ${post.title}`,
          '',
          post.excerpt,
          '',
          'This guide walks through what international patients actually need to know — the practical steps, the real costs, and the mistakes that cost people time and money.',
          '',
          '### Talk to someone before you book anything',
          '',
          'Tatavera Health consultations are free for patients. A case manager reviews your reports, matches you to accredited hospitals, and gives you written cost estimates before you commit to anything.',
        ].join('\n'),
        category: post.category,
        tags: [post.category],
        authorName: 'Tatavera Health Editorial',
        readTime: post.readTime,
        metaTitle: post.title,
        metaDescription: post.excerpt,
        published: true,
        publishedAt: new Date(post.date),
      },
    });
  }

  console.log(`  blog posts: ${BLOG_POSTS.length}`);
}

// ─── DEMO ACCOUNTS ────────────────────────────────────────────────────────────

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? 'Tatavera#2026';

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tataverahealth.com' },
    update: { role: Role.ADMIN },
    create: {
      name: 'Platform Admin',
      email: 'admin@tataverahealth.com',
      passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
      country: 'India',
    },
  });

  // Case manager — profile row plus the login account that points at it.
  const caseManagerProfile = await prisma.caseManager.upsert({
    where: { email: 'priya@tataverahealth.com' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'priya@tataverahealth.com',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      languages: ['English', 'Hindi', 'Arabic'],
    },
  });

  const caseManager = await prisma.user.upsert({
    where: { email: 'priya@tataverahealth.com' },
    update: { role: Role.CASE_MANAGER, caseManagerProfileId: caseManagerProfile.id },
    create: {
      name: 'Priya Sharma',
      email: 'priya@tataverahealth.com',
      passwordHash,
      role: Role.CASE_MANAGER,
      emailVerified: new Date(),
      country: 'India',
      caseManagerProfileId: caseManagerProfile.id,
    },
  });

  // Doctor login, bound to the first seeded doctor profile.
  const doctorProfile = await prisma.doctor.findUnique({ where: { slug: 'dr-naresh-trehan' } });
  if (doctorProfile) {
    await prisma.user.upsert({
      where: { email: 'doctor@tataverahealth.com' },
      update: { role: Role.DOCTOR, doctorProfileId: doctorProfile.id },
      create: {
        name: doctorProfile.name,
        email: 'doctor@tataverahealth.com',
        passwordHash,
        role: Role.DOCTOR,
        emailVerified: new Date(),
        country: 'India',
        doctorProfileId: doctorProfile.id,
      },
    });
  }

  // Hospital admin, bound to the first seeded hospital.
  const hospital = await prisma.hospital.findUnique({ where: { slug: 'apollo-hospitals-chennai' } });
  if (hospital) {
    const hospitalUser = await prisma.user.upsert({
      where: { email: 'hospital@tataverahealth.com' },
      update: { role: Role.HOSPITAL_ADMIN },
      create: {
        name: 'Apollo Chennai — International Desk',
        email: 'hospital@tataverahealth.com',
        passwordHash,
        role: Role.HOSPITAL_ADMIN,
        emailVerified: new Date(),
        country: 'India',
      },
    });

    await prisma.hospitalStaff.upsert({
      where: { userId: hospitalUser.id },
      update: { hospitalId: hospital.id },
      create: { userId: hospitalUser.id, hospitalId: hospital.id, title: 'International Patient Coordinator' },
    });
  }

  // Demo patient with an open case.
  const patient = await prisma.user.upsert({
    where: { email: 'patient@tataverahealth.com' },
    update: {},
    create: {
      name: 'Amara Diallo',
      email: 'patient@tataverahealth.com',
      passwordHash,
      role: Role.PATIENT,
      emailVerified: new Date(),
      country: 'Nigeria',
      phone: '+234 801 234 5678',
    },
  });

  const treatment = await prisma.treatment.findUnique({ where: { slug: 'coronary-artery-bypass' } });
  await prisma.patientCase.upsert({
    where: { userId: patient.id },
    update: {},
    create: {
      userId: patient.id,
      caseManagerId: caseManagerProfile.id,
      hospitalId: hospital?.id ?? null,
      treatmentId: treatment?.id ?? null,
      status: 'CONSULTATION_SCHEDULED',
      notes: 'Reports reviewed. Awaiting cardiology second opinion before quotation.',
    },
  });

  console.log('  users: admin, case manager, doctor, hospital admin, patient');
  return { admin, caseManager, caseManagerProfile, patient };
}

// ─── CRM PIPELINE ─────────────────────────────────────────────────────────────

const SAMPLE_LEADS: Array<{
  name: string;
  email: string;
  phone: string;
  country: string;
  treatmentName: string;
  stage: LeadStage;
  value: number;
  source: string;
}> = [
  { name: 'Amara Diallo', email: 'amara.diallo@example.com', phone: '+234 801 234 5678', country: 'Nigeria', treatmentName: 'Coronary Artery Bypass (CABG)', stage: 'TREATMENT_CONFIRMED', value: 8500, source: 'Website' },
  { name: 'Mohammed Al-Rashidi', email: 'm.alrashidi@example.com', phone: '+965 5000 1234', country: 'Kuwait', treatmentName: 'Total Knee Replacement', stage: 'VISA_PROCESSING', value: 5200, source: 'WhatsApp' },
  { name: 'Fatima Hassan', email: 'fatima.hassan@example.com', phone: '+20 100 555 7788', country: 'Egypt', treatmentName: 'IVF Treatment', stage: 'QUOTATION_RECEIVED', value: 4100, source: 'Referral' },
  { name: 'Sergei Volkov', email: 'sergei.volkov@example.com', phone: '+7 916 222 3344', country: 'Russia', treatmentName: 'Liver Transplant', stage: 'HOSPITAL_MATCHED', value: 38000, source: 'Website' },
  { name: 'Grace Okonkwo', email: 'grace.okonkwo@example.com', phone: '+234 802 987 6543', country: 'Nigeria', treatmentName: 'Spine Surgery (TLIF/PLIF)', stage: 'LEAD_CONTACTED', value: 7800, source: 'Google Ads' },
  { name: 'Ali Hassan Al-Zaabi', email: 'ali.alzaabi@example.com', phone: '+971 50 333 4455', country: 'UAE', treatmentName: 'Hair Transplant (FUE)', stage: 'LEAD_CREATED', value: 2400, source: 'Instagram' },
  { name: 'Joseph Mwangi', email: 'joseph.mwangi@example.com', phone: '+254 722 111 333', country: 'Kenya', treatmentName: 'Coronary Artery Bypass (CABG)', stage: 'REPORTS_UPLOADED', value: 7900, source: 'Website' },
  { name: 'Nadia Rahman', email: 'nadia.rahman@example.com', phone: '+880 171 444 5566', country: 'Bangladesh', treatmentName: 'Total Knee Replacement', stage: 'TREATMENT_COMPLETED', value: 4800, source: 'Referral' },
];

async function seedLeads(caseManagerProfileId: string, assigneeId: string) {
  const hospital = await prisma.hospital.findUnique({ where: { slug: 'apollo-hospitals-chennai' } });

  for (const source of SAMPLE_LEADS) {
    const existing = await prisma.lead.findFirst({ where: { email: source.email } });
    if (existing) continue;

    const lead = await prisma.lead.create({
      data: {
        name: source.name,
        email: source.email,
        phone: source.phone,
        country: source.country,
        treatmentName: source.treatmentName,
        stage: source.stage,
        value: source.value,
        currency: 'USD',
        source: source.source,
        caseManagerId: caseManagerProfileId,
        assigneeId,
        hospitalId: hospital?.id ?? null,
        stageHistory: {
          create: [{ stage: 'LEAD_CREATED', note: `Enquiry received via ${source.source}.` }],
        },
        notes: {
          create: [
            {
              authorId: assigneeId,
              body: `Initial call completed. Patient is enquiring about ${source.treatmentName.toLowerCase()} and asked about total cost including travel.`,
            },
          ],
        },
        tasks: {
          create: [
            {
              assigneeId,
              title: `Follow up with ${source.name.split(' ')[0]} on ${source.treatmentName}`,
              status: 'PENDING',
              priority: source.value > 10000 ? 'HIGH' : 'MEDIUM',
              dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      },
    });

    // Leads past the visa stage get visa and travel records.
    const advancedStages: LeadStage[] = ['VISA_PROCESSING', 'TRAVEL_ARRANGED', 'TREATMENT_CONFIRMED', 'TREATMENT_COMPLETED', 'FOLLOW_UP'];
    if (advancedStages.includes(source.stage)) {
      await prisma.visaStatus.create({
        data: {
          leadId: lead.id,
          stage: source.stage === 'VISA_PROCESSING' ? 'SUBMITTED' : 'APPROVED',
          country: 'India',
          documents: ['Passport copy', 'Hospital invitation letter', 'Medical reports'],
        },
      });

      await prisma.travelStatus.create({
        data: {
          leadId: lead.id,
          arrivalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          accommodation: 'Hospital guest house — twin room with companion bed',
          pickupArranged: true,
        },
      });
    }

    // Leads at or past quotation get a real quotation with line items.
    const quotedStages: LeadStage[] = ['QUOTATION_RECEIVED', 'VIDEO_CONSULTATION', 'TREATMENT_CONFIRMED', 'VISA_PROCESSING', 'TRAVEL_ARRANGED', 'TREATMENT_COMPLETED', 'FOLLOW_UP'];
    if (hospital && quotedStages.includes(source.stage)) {
      await prisma.quotation.create({
        data: {
          leadId: lead.id,
          hospitalId: hospital.id,
          status: source.stage === 'QUOTATION_RECEIVED' ? 'SENT' : 'ACCEPTED',
          currency: 'USD',
          totalAmount: source.value,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          notes: 'Estimate covers surgery, hospital stay, surgeon and anaesthetist fees. Excludes flights.',
          items: {
            create: [
              { description: `${source.treatmentName} — surgical package`, amount: Math.round(source.value * 0.75) },
              { description: 'Hospital stay and nursing care', amount: Math.round(source.value * 0.15) },
              { description: 'Pre-operative investigations', amount: Math.round(source.value * 0.1) },
            ],
          },
        },
      });
    }
  }

  console.log(`  leads: ${SAMPLE_LEADS.length} across the pipeline`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Seeding Tatavera Health…');

  await seedTreatments();
  await seedDestinations();
  await seedHospitals();
  await seedDoctors();
  await seedTestimonials();
  await seedBlog();

  const { caseManager, caseManagerProfile } = await seedUsers();
  await seedLeads(caseManagerProfile.id, caseManager.id);

  console.log('\nDone. Demo logins (password: ' + DEMO_PASSWORD + '):');
  console.log('  admin@tataverahealth.com     → /admin-portal');
  console.log('  priya@tataverahealth.com     → /case-manager-portal');
  console.log('  doctor@tataverahealth.com    → /doctor-portal');
  console.log('  hospital@tataverahealth.com  → /hospital-portal');
  console.log('  patient@tataverahealth.com   → /dashboard');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
