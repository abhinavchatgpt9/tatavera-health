/** Values shared across the portal table modules. */

export const REPORT_CATEGORY_LABELS: Record<string, string> = {
  BLOOD_REPORTS: 'Blood reports',
  IMAGING: 'Imaging',
  PRESCRIPTIONS: 'Prescriptions',
  OTHER: 'Other',
};

export const REPORT_CATEGORY_COLORS: Record<string, string> = {
  BLOOD_REPORTS: 'bg-rose-100 text-rose-700',
  IMAGING: 'bg-purple-100 text-purple-700',
  PRESCRIPTIONS: 'bg-blue-100 text-blue-700',
  OTHER: 'bg-slate-100 text-slate-700',
};

export const APPOINTMENT_STATUS_OPTIONS = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => ({
  value: s,
  label: s.charAt(0) + s.slice(1).toLowerCase(),
}));

export const QUOTATION_STATUS_OPTIONS = ['DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED'].map((s) => ({
  value: s,
  label: s.charAt(0) + s.slice(1).toLowerCase(),
}));

export const LEAD_STAGE_ORDER = [
  'LEAD_CREATED', 'LEAD_ASSIGNED', 'LEAD_CONTACTED', 'REPORTS_UPLOADED',
  'HOSPITAL_MATCHED', 'QUOTATION_RECEIVED', 'VIDEO_CONSULTATION',
  'TREATMENT_CONFIRMED', 'VISA_PROCESSING', 'TRAVEL_ARRANGED',
  'TREATMENT_COMPLETED', 'FOLLOW_UP',
];

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
