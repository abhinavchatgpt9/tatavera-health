// Pure validation helpers for the medical report upload feature.
// Kept separate from app/api/reports/route.ts so the core rules (allowed
// file types, size cap, storage key shape) are unit-testable without
// spinning up S3, Prisma, or a request object.

export const ALLOWED_REPORT_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
export const MAX_REPORT_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export function isAllowedReportMimeType(mimeType: string): boolean {
  return ALLOWED_REPORT_MIME_TYPES.includes(mimeType);
}

export function isReportFileSizeValid(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= MAX_REPORT_FILE_SIZE;
}

// Builds the S3 object key for an uploaded report: namespaced by user so one
// patient can never (accidentally or otherwise) collide with or overwrite
// another's file, with unsafe characters stripped from the original name.
export function buildReportFileKey(userId: string, originalFileName: string, now: number = Date.now()): string {
  const safeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `reports/${userId}/${now}-${safeName}`;
}

const CATEGORY_MAP: Record<string, 'BLOOD_REPORTS' | 'IMAGING' | 'PRESCRIPTIONS' | 'OTHER'> = {
  'Blood Reports': 'BLOOD_REPORTS',
  Imaging: 'IMAGING',
  Prescriptions: 'PRESCRIPTIONS',
  Other: 'OTHER',
};

export function normalizeReportCategory(category: string): 'BLOOD_REPORTS' | 'IMAGING' | 'PRESCRIPTIONS' | 'OTHER' {
  return CATEGORY_MAP[category] || 'OTHER';
}
