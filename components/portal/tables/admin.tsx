'use client';

import { useState } from 'react';
import { DataTable, type Column } from '@/components/portal/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/Dialog';
import { Pill, formatDate, formatDateTime, formatMoney } from '@/components/portal/PortalPage';
import { LEAD_STAGE_LABELS, LEAD_STAGE_COLORS, CASE_STATUS_LABELS, CASE_STATUS_COLORS } from '@/lib/lead-stage';
import { LEAD_STAGE_ORDER } from './shared';

// ─── CRM LEADS ────────────────────────────────────────────────────────────────

type Lead = {
  id: string;
  name: string;
  email: string;
  country: string;
  treatment: string;
  stage: string;
  value: number | null;
  currency: string;
  assignee: string;
  hospital: string;
  createdAt: string;
};

const leadColumns: Array<Column<Lead>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (l) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{l.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {l.country} · {l.email}
        </p>
      </>
    ),
  },
  { key: 'treatment', header: 'Treatment', render: (l) => <span className="text-slate-600 dark:text-slate-300">{l.treatment}</span> },
  {
    key: 'stage',
    header: 'Stage',
    render: (l) => (
      <Pill className={LEAD_STAGE_COLORS[l.stage] ?? 'bg-slate-100 text-slate-700'}>
        {LEAD_STAGE_LABELS[l.stage] ?? l.stage}
      </Pill>
    ),
  },
  {
    key: 'owner',
    header: 'Owner',
    hideOnMobile: true,
    render: (l) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{l.assignee}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{l.hospital}</p>
      </>
    ),
  },
  {
    key: 'created',
    header: 'Created',
    hideOnMobile: true,
    render: (l) => <span className="text-slate-500 dark:text-slate-400">{formatDate(l.createdAt)}</span>,
  },
  {
    key: 'value',
    header: 'Value',
    align: 'right',
    render: (l) => <span className="font-medium text-slate-900 dark:text-white">{formatMoney(l.value, l.currency)}</span>,
  },
];

export function AdminLeadsTable({ rows }: { rows: Lead[] }) {
  return (
    <DataTable
      rows={rows}
      columns={leadColumns}
      searchIn={(l) => `${l.name} ${l.email} ${l.country} ${l.treatment} ${l.assignee}`}
      searchPlaceholder="Search leads by patient, country, treatment or owner…"
      filter={{
        label: 'All stages',
        options: LEAD_STAGE_ORDER.map((s) => ({ value: s, label: LEAD_STAGE_LABELS[s] ?? s })),
        matches: (l, value) => l.stage === value,
      }}
      emptyTitle="No leads yet"
      emptyDescription="Enquiries from the public site become leads once a case manager converts them."
    />
  );
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────

type Log = {
  id: string;
  user: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  ipAddress: string | null;
  createdAt: string;
};

const logColumns: Array<Column<Log>> = [
  {
    key: 'action',
    header: 'Action',
    render: (l) => (
      <>
        <p className="text-slate-700 dark:text-slate-200">{l.action}</p>
        {l.entityType && (
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {l.entityType}
            {l.entityId ? ` · ${l.entityId}` : ''}
          </p>
        )}
      </>
    ),
  },
  { key: 'user', header: 'By', render: (l) => <span className="text-slate-600 dark:text-slate-300">{l.user}</span> },
  {
    key: 'ip',
    header: 'IP',
    hideOnMobile: true,
    render: (l) => <span className="font-mono text-xs text-slate-400 dark:text-slate-500">{l.ipAddress ?? '—'}</span>,
  },
  {
    key: 'when',
    header: 'When',
    align: 'right',
    render: (l) => <span className="text-slate-500 dark:text-slate-400">{formatDateTime(l.createdAt)}</span>,
  },
];

export function AdminAuditLogsTable({ rows, entityTypes }: { rows: Log[]; entityTypes: string[] }) {
  return (
    <DataTable
      rows={rows}
      columns={logColumns}
      searchIn={(l) => `${l.action} ${l.user} ${l.entityType ?? ''} ${l.entityId ?? ''}`}
      searchPlaceholder="Search by action, user or record…"
      filter={
        entityTypes.length > 0
          ? {
              label: 'All record types',
              options: entityTypes.map((t) => ({ value: t, label: t })),
              matches: (l, value) => l.entityType === value,
            }
          : undefined
      }
      emptyTitle="No audit entries yet"
      emptyDescription="Staff actions that change records — creating users, updating lead stages, accepting quotations — are logged here."
    />
  );
}

// ─── DOCTORS ──────────────────────────────────────────────────────────────────

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  designation: string;
  hospital: string;
  rating: number;
  reviewCount: number;
  cases: number;
  published: boolean;
  featured: boolean;
};

const doctorColumns: Array<Column<Doctor>> = [
  {
    key: 'doctor',
    header: 'Doctor',
    render: (d) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{d.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{d.designation}</p>
      </>
    ),
  },
  { key: 'specialty', header: 'Specialty', render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.specialty}</span> },
  { key: 'hospital', header: 'Hospital', hideOnMobile: true, render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.hospital}</span> },
  { key: 'cases', header: 'Cases', align: 'right', hideOnMobile: true, render: (d) => <span className="text-slate-600 dark:text-slate-300">{d.cases}</span> },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-300">
        {d.rating > 0 ? `${d.rating.toFixed(1)} (${d.reviewCount})` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (d) => (
      <div className="flex justify-end gap-1.5">
        {d.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={d.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {d.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export function AdminDoctorsTable({ rows, specialties }: { rows: Doctor[]; specialties: string[] }) {
  return (
    <DataTable
      rows={rows}
      columns={doctorColumns}
      searchIn={(d) => `${d.name} ${d.specialty} ${d.designation} ${d.hospital}`}
      searchPlaceholder="Search by name, specialty or hospital…"
      filter={{
        label: 'All specialties',
        options: specialties.map((s) => ({ value: s, label: s })),
        matches: (d, value) => d.specialty === value,
      }}
      emptyTitle="No doctors in the catalogue"
      emptyDescription="Run the database seed, or add doctors to populate the public directory."
    />
  );
}

// ─── HOSPITALS ────────────────────────────────────────────────────────────────

type Hospital = {
  id: string;
  name: string;
  city: string;
  country: string;
  accreditations: string[];
  rating: number;
  reviewCount: number;
  doctors: number;
  departments: number;
  leads: number;
  published: boolean;
  featured: boolean;
};

const hospitalColumns: Array<Column<Hospital>> = [
  {
    key: 'hospital',
    header: 'Hospital',
    render: (h) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{h.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {h.city}, {h.country}
        </p>
      </>
    ),
  },
  {
    key: 'accreditations',
    header: 'Accreditations',
    hideOnMobile: true,
    render: (h) => (
      <span className="text-slate-600 dark:text-slate-300">
        {h.accreditations.length > 0 ? h.accreditations.join(', ') : '—'}
      </span>
    ),
  },
  {
    key: 'counts',
    header: 'Doctors / Depts',
    align: 'right',
    hideOnMobile: true,
    render: (h) => (
      <span className="text-slate-600 dark:text-slate-300">
        {h.doctors} / {h.departments}
      </span>
    ),
  },
  { key: 'leads', header: 'Leads', align: 'right', render: (h) => <span className="font-medium text-slate-900 dark:text-white">{h.leads}</span> },
  {
    key: 'rating',
    header: 'Rating',
    align: 'right',
    render: (h) => (
      <span className="text-slate-600 dark:text-slate-300">
        {h.rating > 0 ? `${h.rating.toFixed(1)} (${h.reviewCount})` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (h) => (
      <div className="flex justify-end gap-1.5">
        {h.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={h.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {h.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export function AdminHospitalsTable({ rows, countries }: { rows: Hospital[]; countries: string[] }) {
  return (
    <DataTable
      rows={rows}
      columns={hospitalColumns}
      searchIn={(h) => `${h.name} ${h.city} ${h.country} ${h.accreditations.join(' ')}`}
      searchPlaceholder="Search by name, city or accreditation…"
      filter={{
        label: 'All countries',
        options: countries.map((c) => ({ value: c, label: c })),
        matches: (h, value) => h.country === value,
      }}
      emptyTitle="No hospitals in the catalogue"
      emptyDescription="Run the database seed, or add hospitals to populate the public directory."
    />
  );
}

// ─── PATIENTS ─────────────────────────────────────────────────────────────────

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  caseStatus: string | null;
  treatment: string;
  hospital: string;
  caseManager: string;
  reports: number;
  appointments: number;
  createdAt: string;
};

const patientColumns: Array<Column<Patient>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (p) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {p.email}
          {p.country ? ` · ${p.country}` : ''}
        </p>
      </>
    ),
  },
  {
    key: 'case',
    header: 'Case',
    render: (p) =>
      p.caseStatus ? (
        <Pill className={CASE_STATUS_COLORS[p.caseStatus] ?? 'bg-slate-100 text-slate-700'}>
          {CASE_STATUS_LABELS[p.caseStatus] ?? p.caseStatus}
        </Pill>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-500">No case open</span>
      ),
  },
  {
    key: 'treatment',
    header: 'Treatment',
    hideOnMobile: true,
    render: (p) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{p.treatment}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{p.hospital}</p>
      </>
    ),
  },
  {
    key: 'manager',
    header: 'Case manager',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{p.caseManager}</span>,
  },
  {
    key: 'activity',
    header: 'Files / Appts',
    align: 'right',
    render: (p) => (
      <span className="text-slate-600 dark:text-slate-300">
        {p.reports} / {p.appointments}
      </span>
    ),
  },
  {
    key: 'joined',
    header: 'Joined',
    align: 'right',
    hideOnMobile: true,
    render: (p) => <span className="text-slate-500 dark:text-slate-400">{formatDate(p.createdAt)}</span>,
  },
];

export function AdminPatientsTable({ rows }: { rows: Patient[] }) {
  return (
    <DataTable
      rows={rows}
      columns={patientColumns}
      searchIn={(p) => `${p.name} ${p.email} ${p.country ?? ''} ${p.treatment} ${p.hospital}`}
      searchPlaceholder="Search by name, email, country or treatment…"
      filter={{
        label: 'All case statuses',
        options: Object.entries(CASE_STATUS_LABELS).map(([value, label]) => ({ value, label })),
        matches: (p, value) => p.caseStatus === value,
      }}
      emptyTitle="No patients registered yet"
      emptyDescription="Patients appear here when they sign up on the public site or are created by a case manager."
    />
  );
}

// ─── TREATMENTS ───────────────────────────────────────────────────────────────

type Treatment = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  costFrom: number | null;
  costTo: number | null;
  currency: string;
  duration: string | null;
  hospitals: number;
  enquiries: number;
  faqs: number;
  published: boolean;
};

const treatmentColumns: Array<Column<Treatment>> = [
  {
    key: 'treatment',
    header: 'Treatment',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">/{t.slug}</p>
      </>
    ),
  },
  { key: 'specialty', header: 'Specialty', render: (t) => <span className="text-slate-600 dark:text-slate-300">{t.specialty}</span> },
  {
    key: 'cost',
    header: 'Cost range',
    render: (t) => (
      <span className="text-slate-600 dark:text-slate-300">
        {t.costFrom !== null && t.costTo !== null
          ? `${formatMoney(t.costFrom, t.currency)} – ${formatMoney(t.costTo, t.currency)}`
          : '—'}
      </span>
    ),
  },
  { key: 'duration', header: 'Duration', hideOnMobile: true, render: (t) => <span className="text-slate-500 dark:text-slate-400">{t.duration ?? '—'}</span> },
  {
    key: 'linked',
    header: 'Hospitals / FAQs',
    align: 'right',
    hideOnMobile: true,
    render: (t) => (
      <span className="text-slate-600 dark:text-slate-300">
        {t.hospitals} / {t.faqs}
      </span>
    ),
  },
  { key: 'enquiries', header: 'Enquiries', align: 'right', render: (t) => <span className="font-medium text-slate-900 dark:text-white">{t.enquiries}</span> },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (t) => (
      <Pill className={t.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
        {t.published ? 'Live' : 'Hidden'}
      </Pill>
    ),
  },
];

export function AdminTreatmentsTable({ rows, specialties }: { rows: Treatment[]; specialties: string[] }) {
  return (
    <DataTable
      rows={rows}
      columns={treatmentColumns}
      searchIn={(t) => `${t.name} ${t.specialty} ${t.slug}`}
      searchPlaceholder="Search by treatment or specialty…"
      filter={{
        label: 'All specialties',
        options: specialties.map((s) => ({ value: s, label: s })),
        matches: (t, value) => t.specialty === value,
      }}
      emptyTitle="No treatments in the catalogue"
      emptyDescription="Treatments drive the public procedure pages and the enquiry form's dropdown."
    />
  );
}

// ─── DESTINATIONS ─────────────────────────────────────────────────────────────

type Destination = {
  id: string;
  slug: string;
  country: string;
  countryCode: string;
  topSpecialties: string[];
  leads: number;
  published: boolean;
  featured: boolean;
};

const destinationColumns: Array<Column<Destination>> = [
  {
    key: 'country',
    header: 'Country',
    render: (d) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{d.country}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {d.countryCode} · /{d.slug}
        </p>
      </>
    ),
  },
  {
    key: 'specialties',
    header: 'Top specialties',
    render: (d) => (
      <span className="text-slate-600 dark:text-slate-300">
        {d.topSpecialties.length > 0 ? d.topSpecialties.join(', ') : '—'}
      </span>
    ),
  },
  { key: 'leads', header: 'Patients from here', align: 'right', render: (d) => <span className="font-medium text-slate-900 dark:text-white">{d.leads}</span> },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (d) => (
      <div className="flex justify-end gap-1.5">
        {d.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={d.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {d.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export function AdminDestinationsTable({ rows }: { rows: Destination[] }) {
  return (
    <DataTable
      rows={rows}
      columns={destinationColumns}
      searchIn={(d) => `${d.country} ${d.countryCode} ${d.topSpecialties.join(' ')}`}
      searchPlaceholder="Search by country or specialty…"
      filter={{
        label: 'All statuses',
        options: [
          { value: 'LIVE', label: 'Live' },
          { value: 'HIDDEN', label: 'Hidden' },
          { value: 'FEATURED', label: 'Featured' },
        ],
        matches: (d, value) => (value === 'LIVE' ? d.published : value === 'HIDDEN' ? !d.published : d.featured),
      }}
      emptyTitle="No destination pages"
      emptyDescription="Destination pages explain what treatment in a country involves — visa, travel and accommodation."
    />
  );
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────

type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  readTime: number;
  published: boolean;
  publishedAt: string | null;
};

const postColumns: Array<Column<Post>> = [
  {
    key: 'post',
    header: 'Post',
    render: (p) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{p.title}</p>
        <p className="line-clamp-1 text-xs text-slate-400 dark:text-slate-500">{p.excerpt}</p>
      </>
    ),
  },
  { key: 'category', header: 'Category', render: (p) => <span className="text-slate-600 dark:text-slate-300">{p.category}</span> },
  {
    key: 'author',
    header: 'Author',
    hideOnMobile: true,
    render: (p) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{p.authorName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{p.readTime} min read</p>
      </>
    ),
  },
  { key: 'published', header: 'Published', hideOnMobile: true, render: (p) => <span className="text-slate-500 dark:text-slate-400">{formatDate(p.publishedAt)}</span> },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (p) => (
      <Pill className={p.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {p.published ? 'Live' : 'Draft'}
      </Pill>
    ),
  },
];

export function AdminBlogTable({ rows, categories }: { rows: Post[]; categories: string[] }) {
  return (
    <DataTable
      rows={rows}
      columns={postColumns}
      searchIn={(p) => `${p.title} ${p.excerpt} ${p.category} ${p.authorName}`}
      searchPlaceholder="Search by title, category or author…"
      filter={{
        label: 'All categories',
        options: categories.map((c) => ({ value: c, label: c })),
        matches: (p, value) => p.category === value,
      }}
      emptyTitle="No blog posts yet"
      emptyDescription="Blog posts are the main organic-search channel for a medical tourism business — worth investing in."
    />
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

type Testimonial = {
  id: string;
  patientName: string;
  patientCountry: string;
  treatment: string;
  quote: string;
  rating: number;
  videoUrl: string | null;
  featured: boolean;
  published: boolean;
};

const testimonialColumns: Array<Column<Testimonial>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (t) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{t.patientName}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{t.patientCountry}</p>
      </>
    ),
  },
  { key: 'quote', header: 'Quote', render: (t) => <p className="line-clamp-2 max-w-md text-slate-600 dark:text-slate-300">{t.quote}</p> },
  { key: 'treatment', header: 'Treatment', hideOnMobile: true, render: (t) => <span className="text-slate-600 dark:text-slate-300">{t.treatment}</span> },
  { key: 'rating', header: 'Rating', align: 'right', render: (t) => <span className="text-slate-600 dark:text-slate-300">{t.rating} / 5</span> },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (t) => (
      <div className="flex justify-end gap-1.5">
        {t.videoUrl && <Pill className="bg-purple-100 text-purple-700">Video</Pill>}
        {t.featured && <Pill className="bg-amber-100 text-amber-700">Featured</Pill>}
        <Pill className={t.published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
          {t.published ? 'Live' : 'Hidden'}
        </Pill>
      </div>
    ),
  },
];

export function AdminTestimonialsTable({ rows }: { rows: Testimonial[] }) {
  return (
    <DataTable
      rows={rows}
      columns={testimonialColumns}
      searchIn={(t) => `${t.patientName} ${t.patientCountry} ${t.treatment} ${t.quote}`}
      searchPlaceholder="Search by patient, country or treatment…"
      filter={{
        label: 'All statuses',
        options: [
          { value: 'LIVE', label: 'Live' },
          { value: 'HIDDEN', label: 'Hidden' },
          { value: 'FEATURED', label: 'Featured' },
          { value: 'VIDEO', label: 'Has video' },
        ],
        matches: (t, value) =>
          value === 'LIVE'
            ? t.published
            : value === 'HIDDEN'
              ? !t.published
              : value === 'FEATURED'
                ? t.featured
                : Boolean(t.videoUrl),
      }}
      emptyTitle="No testimonials yet"
      emptyDescription="Patient stories are the single strongest trust signal on a medical tourism site."
    />
  );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────

type Review = {
  id: string;
  author: string;
  country: string;
  subject: string;
  subjectType: string;
  rating: number;
  title: string | null;
  body: string;
  verified: boolean;
  createdAt: string;
};

const reviewColumns: Array<Column<Review>> = [
  {
    key: 'author',
    header: 'Author',
    render: (r) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{r.author}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.country}</p>
      </>
    ),
  },
  {
    key: 'subject',
    header: 'About',
    render: (r) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{r.subject}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.subjectType}</p>
      </>
    ),
  },
  {
    key: 'review',
    header: 'Review',
    hideOnMobile: true,
    render: (r) => (
      <>
        {r.title && <p className="font-medium text-slate-700 dark:text-slate-200">{r.title}</p>}
        <p className="line-clamp-2 max-w-sm text-slate-600 dark:text-slate-300">{r.body}</p>
      </>
    ),
  },
  { key: 'rating', header: 'Rating', align: 'right', render: (r) => <span className="font-medium text-slate-900 dark:text-white">{r.rating} / 5</span> },
  { key: 'date', header: 'Date', align: 'right', hideOnMobile: true, render: (r) => <span className="text-slate-500 dark:text-slate-400">{formatDate(r.createdAt)}</span> },
  {
    key: 'verified',
    header: 'Verified',
    align: 'right',
    render: (r) => (
      <Pill className={r.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {r.verified ? 'Verified' : 'Unverified'}
      </Pill>
    ),
  },
];

export function AdminReviewsTable({ rows }: { rows: Review[] }) {
  return (
    <DataTable
      rows={rows}
      columns={reviewColumns}
      searchIn={(r) => `${r.author} ${r.country} ${r.subject} ${r.title ?? ''} ${r.body}`}
      searchPlaceholder="Search by author, hospital, doctor or text…"
      filter={{
        label: 'All reviews',
        options: [
          { value: 'VERIFIED', label: 'Verified' },
          { value: 'UNVERIFIED', label: 'Unverified' },
          { value: 'LOW', label: 'Rated 3 or below' },
        ],
        matches: (r, value) => (value === 'VERIFIED' ? r.verified : value === 'UNVERIFIED' ? !r.verified : r.rating <= 3),
      }}
      emptyTitle="No reviews yet"
      emptyDescription="Reviews left by patients against a hospital or doctor appear here for moderation."
    />
  );
}

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────

type Payment = {
  id: string;
  patient: string;
  country: string;
  hospital: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
};

const paymentColumns: Array<Column<Payment>> = [
  {
    key: 'patient',
    header: 'Patient',
    render: (r) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{r.patient}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{r.country}</p>
      </>
    ),
  },
  { key: 'hospital', header: 'Hospital', render: (r) => <span className="text-slate-600 dark:text-slate-300">{r.hospital}</span> },
  { key: 'date', header: 'Last updated', hideOnMobile: true, render: (r) => <span className="text-slate-500 dark:text-slate-400">{formatDate(r.date)}</span> },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <Pill className={r.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
        {r.status === 'CONFIRMED' ? 'Accepted' : 'Awaiting acceptance'}
      </Pill>
    ),
  },
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => <span className="font-medium text-slate-900 dark:text-white">{formatMoney(r.amount, r.currency)}</span> },
];

export function AdminPaymentsTable({ rows }: { rows: Payment[] }) {
  return (
    <DataTable
      rows={rows}
      columns={paymentColumns}
      searchIn={(r) => `${r.patient} ${r.country} ${r.hospital}`}
      searchPlaceholder="Search by patient or hospital…"
      filter={{
        label: 'All statuses',
        options: [
          { value: 'CONFIRMED', label: 'Accepted' },
          { value: 'AWAITING_ACCEPTANCE', label: 'Awaiting acceptance' },
        ],
        matches: (r, value) => r.status === value,
      }}
      emptyTitle="No billable quotations yet"
      emptyDescription="Once hospitals send quotations and patients accept them, the value appears here."
    />
  );
}

// ─── ENQUIRIES ────────────────────────────────────────────────────────────────

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  treatment: string;
  message: string | null;
  status: string;
  source: string | null;
  converted: boolean;
  createdAt: string;
};

const ENQUIRY_STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-indigo-100 text-indigo-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  CONVERTED: 'bg-emerald-100 text-emerald-700',
  CLOSED: 'bg-slate-100 text-slate-700',
};

const enquiryColumns: Array<Column<Enquiry>> = [
  {
    key: 'enquiry',
    header: 'Enquiry',
    render: (e) => (
      <>
        <p className="font-medium text-slate-900 dark:text-white">{e.name}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {e.country} · {e.email} · {e.phone}
        </p>
      </>
    ),
  },
  {
    key: 'treatment',
    header: 'Interested in',
    render: (e) => (
      <>
        <p className="text-slate-600 dark:text-slate-300">{e.treatment}</p>
        {e.message && <p className="line-clamp-1 max-w-xs text-xs text-slate-400 dark:text-slate-500">{e.message}</p>}
      </>
    ),
  },
  { key: 'source', header: 'Source', hideOnMobile: true, render: (e) => <span className="text-slate-500 dark:text-slate-400">{e.source ?? 'Website'}</span> },
  { key: 'received', header: 'Received', hideOnMobile: true, render: (e) => <span className="text-slate-500 dark:text-slate-400">{formatDateTime(e.createdAt)}</span> },
  {
    key: 'status',
    header: 'Status',
    align: 'right',
    render: (e) => (
      <div className="flex justify-end gap-1.5">
        {e.converted && <Pill className="bg-emerald-100 text-emerald-700">Lead created</Pill>}
        <Pill className={ENQUIRY_STATUS_COLORS[e.status] ?? 'bg-slate-100 text-slate-700'}>
          {e.status.replace(/_/g, ' ')}
        </Pill>
      </div>
    ),
  },
];

/** The public form stores "[Treatment: knee-replacement] free text…" in the message field. */
function splitEnquiryMessage(message: string | null) {
  const m = message?.match(/^\[Treatment:\s*([^\]]+)\]\s*(.*)$/s);
  return m ? { treatment: m[1].trim(), text: m[2].trim() } : { treatment: null, text: message?.trim() ?? '' };
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-2.5 text-sm">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="col-span-2 break-words text-slate-900 dark:text-white">{children}</dd>
    </div>
  );
}

export function AdminEnquiriesTable({ rows }: { rows: Enquiry[] }) {
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const detail = selected ? splitEnquiryMessage(selected.message) : null;
  const whatsappDigits = selected?.phone.replace(/\D/g, '');

  return (
    <>
      <DataTable
        rows={rows}
        columns={enquiryColumns}
        onRowClick={setSelected}
        searchIn={(e) => `${e.name} ${e.email} ${e.phone} ${e.country} ${e.treatment} ${e.message ?? ''}`}
        searchPlaceholder="Search by name, email, country or treatment…"
        filter={{
          label: 'All statuses',
          options: Object.keys(ENQUIRY_STATUS_COLORS).map((value) => ({
            value,
            label: value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' '),
          })),
          matches: (e, value) => e.status === value,
        }}
        emptyTitle="No enquiries yet"
        emptyDescription="Enquiries submitted through the public site's forms land here first."
      />

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-xl">
          {selected && detail && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>Enquiry received {formatDateTime(selected.createdAt)}</DialogDescription>
              </DialogHeader>
              <dl className="divide-y divide-slate-100 dark:divide-slate-800">
                <DetailRow label="Status">
                  <div className="flex flex-wrap gap-1.5">
                    <Pill className={ENQUIRY_STATUS_COLORS[selected.status] ?? 'bg-slate-100 text-slate-700'}>
                      {selected.status.replace(/_/g, ' ')}
                    </Pill>
                    {selected.converted && <Pill className="bg-emerald-100 text-emerald-700">Lead created</Pill>}
                  </div>
                </DetailRow>
                <DetailRow label="Email">
                  <a className="text-blue-600 hover:underline dark:text-blue-400" href={`mailto:${selected.email}`}>
                    {selected.email}
                  </a>
                </DetailRow>
                <DetailRow label="Phone">
                  <a className="text-blue-600 hover:underline dark:text-blue-400" href={`tel:${selected.phone}`}>
                    {selected.phone}
                  </a>
                  {whatsappDigits && (
                    <a
                      className="ml-3 text-emerald-600 hover:underline dark:text-emerald-400"
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  )}
                </DetailRow>
                <DetailRow label="Country">{selected.country}</DetailRow>
                <DetailRow label="Treatment">{detail.treatment ?? (selected.treatment !== '—' ? selected.treatment : '—')}</DetailRow>
                <DetailRow label="Message">
                  <p className="whitespace-pre-wrap">{detail.text || '—'}</p>
                </DetailRow>
                <DetailRow label="Source">{selected.source ?? 'Website'}</DetailRow>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
