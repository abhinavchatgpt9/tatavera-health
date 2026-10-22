/* eslint-disable @typescript-eslint/no-explicit-any */
// Intentionally empty: the previous hard-coded hospital/doctor/testimonial data was
// unverified placeholder content. Load real records from the database (Prisma
// Hospital / Doctor / Testimonial models) when they are confirmed.

export type HospitalRecord = {
  [key: string]: any;
  specialties: string[];
  accreditations: string[];
  treatments?: Array<{ name: string; costUSD: any; [key: string]: any }>;
};

export type DoctorRecord = {
  [key: string]: any;
  awards: string[];
  languages: string[];
};

export type TestimonialRecord = { [key: string]: any };

export const TOP_HOSPITALS: HospitalRecord[] = [];
export const TOP_DOCTORS: DoctorRecord[] = [];
export const PATIENT_TESTIMONIALS: TestimonialRecord[] = [];
