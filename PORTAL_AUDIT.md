# Portal Build Audit — Doctor / Hospital / Case Manager / Admin

Scope note: Public site and Patient portal (`app/dashboard/*`) were not re-audited — they already exist and were left untouched. This covers the four portals built in this pass.

## What was built

| Portal | Pages | Layout/Nav | API routes | DB models |
|---|---|---|---|---|
| Case Manager | 11 (dashboard, leads, timeline, tasks, notes, communication, follow-ups, travel, visa, reports, quotations) | `components/CaseManagerLayout.tsx` | `/api/leads*`, `/api/tasks/[id]` | `Lead`, `LeadNote`, `LeadTask`, `LeadStageEvent`, `VisaStatus`, `TravelStatus` |
| Doctor | 8 (dashboard, patients, appointments, calendar, opinions, reports, profile, availability) | `components/DoctorLayout.tsx` | `/api/doctor/patients`, `/api/doctor/availability`, `/api/doctor/opinions` | `DoctorAvailability`, `MedicalOpinion` |
| Hospital | 8 (dashboard, doctors, departments, appointments, leads, quotations, reports, settings) | `components/HospitalLayout.tsx` | `/api/hospital/doctors`, `/api/hospital/departments`, `/api/hospital/settings`, `/api/quotations*` | `HospitalStaff`, `Department`, `Quotation`, `QuotationItem` |
| Admin | 17 (dashboard, users, doctors, hospitals, patients, treatments, countries, blogs, testimonials, reviews, payments, analytics, crm, notifications, settings, audit-logs, cms) | `components/AdminLayout.tsx` | `/api/admin/users`, `/api/admin/stats`, `/api/admin/audit-logs` | `AuditLog` |

Shared: `lib/portal-mock-data.ts` (all mock data), `lib/lead-stage.ts` (stage/priority/visa color-badge maps), `lib/require-portal-role.ts` (server-side role gate), `middleware.ts` (Edge-safe auth-presence redirect).

## Auth & access control

- New `Role` enum values: `DOCTOR`, `HOSPITAL_ADMIN` (added to existing `PATIENT`, `CASE_MANAGER`, `ADMIN`, `PARTNER`).
- Login (password+2FA and phone OTP) now redirects by role via `lib/portal-routes.ts#portalPathForRole`.
- `middleware.ts` only checks cookie *presence* and redirects to `/auth/login` if missing — it cannot verify JWT signatures because `jsonwebtoken`/`bcryptjs` are not Edge-runtime compatible. Real signature + role verification happens server-side (Node runtime) in each portal's `layout.tsx` via `requirePortalRole()`. Two-layer defense: Edge middleware for the fast path, Node layout for the actual authorization decision.
- **Gap**: no route currently issues a `DOCTOR` or `HOSPITAL_ADMIN` account — `/api/admin/users` (ADMIN-only) is the only way to create one today. There is no self-serve doctor/hospital signup flow.

## CRM lead lifecycle — implemented

All 12 stages from the spec exist as the `LeadStage` enum and are exercised in the Case Manager board view, Hospital leads view, and Admin CRM view:
`LEAD_CREATED → LEAD_ASSIGNED → LEAD_CONTACTED → REPORTS_UPLOADED → HOSPITAL_MATCHED → QUOTATION_RECEIVED → VIDEO_CONSULTATION → TREATMENT_CONFIRMED → VISA_PROCESSING → TRAVEL_ARRANGED → TREATMENT_COMPLETED → FOLLOW_UP`

`POST /api/enquiries/{id}/convert` bridges the public-site enquiry form into this pipeline (creates a `Lead` from an `Enquiry`, previously a `// TODO: Push to CRM` comment with no implementation).

`PUT /api/leads/{id}/stage` and `PUT /api/quotations/{id}` (on ACCEPTED) both write `LeadStageEvent` rows, so the Case Manager Timeline page has a real audit trail once wired to live data instead of mock data.

## What's still mock data (by design, per your instruction to build only necessary APIs first)

Every portal page currently renders from `lib/portal-mock-data.ts`, not live Prisma queries — the API routes exist and are schema-correct, but the pages weren't rewired to call them yet. Wiring order I'd suggest, highest-value first:
1. `case-manager-portal/leads` → `GET /api/leads`
2. `hospital-portal/quotations` create form → `POST /api/quotations`
3. `doctor-portal/availability` → `GET/POST /api/doctor/availability`
4. `admin-portal/users` → `GET /api/admin/users`

The remaining ~13 lighter Admin pages (doctors, hospitals, patients, treatments, countries, blogs, testimonials, reviews, payments, notifications, cms) have no dedicated API routes yet — they reuse patterns from existing public-site data models (`Doctor`, `Hospital`, `Treatment`, `Destination`, `BlogPost`, `Testimonial`, `Review`) which already have Prisma models but no admin CRUD endpoints. Not built in this pass since you asked for necessary APIs first; flag if you want these prioritized next.

## Known gaps / explicitly out of scope this pass

- **Video Consultation**: no video provider integration (Zoom/Twilio/Daily) — `Appointment.meetLink` field exists but nothing populates it.
- **File uploads for case manager report review**: `case-manager-portal/reports` uses fake report counts; doesn't yet hit the real `Report` model tied to a patient's case.
- **Notifications**: `admin-portal/notifications` is UI-only; no real-time delivery (would need websockets/SSE or a polling endpoint).
- **CMS**: `admin-portal/cms` is a placeholder list; no rich content editor wired to `BlogPost`/`Treatment` content fields.
- **Payments**: `admin-portal/payments` is mock-only; no payment gateway (Stripe/Razorpay) integration exists anywhere in the codebase.

## Build verification

`npx prisma validate` ✓ · `npx tsc --noEmit` ✓ (zero errors, whole project) · `npm run build` ✓ (123 routes compiled, including all 4 new portals).

## Next step: Supabase

Schema is ready for `prisma db push` the moment `DATABASE_URL`/`DIRECT_URL` point at a real Postgres instance — currently `.env` still points at local Docker Postgres, not Supabase. Nothing in this pass touched deployment config.
