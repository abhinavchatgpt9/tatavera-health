import { PROCEDURES, SPECIALTIES, TREATMENT_AREAS, OTHER_TREATMENT_VALUE } from '@/lib/constants';

/**
 * Shared enquiry helpers: the treatment choices offered by the one enquiry form, and the logic that turns a
 * link such as /free-consultation?treatment=cardiology into a pre-selected option.
 */

export const OTHER_TREATMENT_LABEL = 'Other / Not sure';

/** Minimum length of the description when the patient picks "Other / Not sure". */
export const MIN_OTHER_DESCRIPTION = 10;

export interface TreatmentOption {
  value: string;
  label: string;
}

/** Specific procedures we list on the site (shown first, as they are the most common requests). */
export const POPULAR_TREATMENT_OPTIONS: TreatmentOption[] = PROCEDURES.map((p) => ({
  value: `procedure:${p.id}`,
  label: p.name,
}));

/** Broad treatment areas, so a treatment that is not listed can still be requested. */
export const AREA_TREATMENT_OPTIONS: TreatmentOption[] = TREATMENT_AREAS.map((a) => ({
  value: `area:${a.slug}`,
  label: a.label,
}));

const ALL_OPTIONS: TreatmentOption[] = [
  ...POPULAR_TREATMENT_OPTIONS,
  ...AREA_TREATMENT_OPTIONS,
  { value: OTHER_TREATMENT_VALUE, label: OTHER_TREATMENT_LABEL },
];

export function treatmentLabel(value: string): string {
  return ALL_OPTIONS.find((o) => o.value === value)?.label ?? '';
}

export function isOtherTreatment(value: string): boolean {
  return value === OTHER_TREATMENT_VALUE;
}

const norm = (s: string) => s.trim().toLowerCase();

/**
 * Turns a loose value from a link (?treatment=...) into a valid option value, or '' when nothing matches.
 * Accepts a procedure id/slug/name, a treatment-area or specialty slug/name, or "other".
 */
export function resolveTreatmentParam(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return '';
  const v = norm(value);
  if (!v) return '';
  if (v === OTHER_TREATMENT_VALUE || v === 'not-sure' || v === 'not sure') return OTHER_TREATMENT_VALUE;
  if (ALL_OPTIONS.some((o) => o.value === value)) return value;

  const procedure = PROCEDURES.find((p) => norm(p.id) === v || norm(p.slug) === v || norm(p.name) === v);
  if (procedure) return `procedure:${procedure.id}`;

  const area = TREATMENT_AREAS.find((a) => norm(a.slug) === v || norm(a.label) === v);
  if (area) return `area:${area.slug}`;

  const specialty = SPECIALTIES.find((s) => norm(s.slug) === v || norm(s.name) === v);
  if (specialty && TREATMENT_AREAS.some((a) => a.slug === specialty.slug)) return `area:${specialty.slug}`;

  return '';
}

/** Short reference the patient can quote to the team, taken from the saved enquiry id. */
export function enquiryReference(id: string): string {
  return id.slice(-8).toUpperCase();
}
