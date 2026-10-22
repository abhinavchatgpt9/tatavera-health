import { describe, it, expect } from 'vitest';
import {
  isAllowedReportMimeType,
  isReportFileSizeValid,
  buildReportFileKey,
  normalizeReportCategory,
  MAX_REPORT_FILE_SIZE,
} from '@/lib/report-validation';

describe('6. Report upload — file type restriction', () => {
  it('accepts PDF, JPG and PNG', () => {
    expect(isAllowedReportMimeType('application/pdf')).toBe(true);
    expect(isAllowedReportMimeType('image/jpeg')).toBe(true);
    expect(isAllowedReportMimeType('image/png')).toBe(true);
  });

  it('rejects an executable or script disguised as a report', () => {
    expect(isAllowedReportMimeType('application/x-msdownload')).toBe(false);
    expect(isAllowedReportMimeType('text/html')).toBe(false);
  });
});

describe('7. Report upload — file size cap (20 MB)', () => {
  it('accepts a file within the limit', () => {
    expect(isReportFileSizeValid(5 * 1024 * 1024)).toBe(true);
  });

  it('rejects a file over the 20 MB limit', () => {
    expect(isReportFileSizeValid(MAX_REPORT_FILE_SIZE + 1)).toBe(false);
  });

  it('rejects a zero-byte / empty file', () => {
    expect(isReportFileSizeValid(0)).toBe(false);
  });
});

describe('8. Report storage key — one patient can never overwrite another patient\'s file', () => {
  it('namespaces the S3 key by userId', () => {
    const key = buildReportFileKey('user_abc', 'blood-test.pdf', 1700000000000);
    expect(key).toBe('reports/user_abc/1700000000000-blood-test.pdf');
  });

  it('strips path separators and shell metacharacters so the key stays inside its own prefix', () => {
    const key = buildReportFileKey('user_abc', '../../etc/passwd; rm -rf.pdf', 1700000000000);
    const prefix = 'reports/user_abc/1700000000000-';
    expect(key.startsWith(prefix)).toBe(true);
    const suffix = key.slice(prefix.length);
    expect(suffix).not.toMatch(/[/;]/); // no slashes or semicolons snuck into the filename portion
  });

  it('two different users uploading the same filename get different keys', () => {
    const keyA = buildReportFileKey('user_a', 'scan.pdf', 1700000000000);
    const keyB = buildReportFileKey('user_b', 'scan.pdf', 1700000000000);
    expect(keyA).not.toBe(keyB);
  });
});

describe('9. Report category normalization — used to bucket reports in the dashboard UI', () => {
  it('maps a known UI category to its DB enum value', () => {
    expect(normalizeReportCategory('Blood Reports')).toBe('BLOOD_REPORTS');
    expect(normalizeReportCategory('Imaging')).toBe('IMAGING');
  });

  it('falls back to OTHER for an unrecognized category instead of throwing', () => {
    expect(normalizeReportCategory('Something Unexpected')).toBe('OTHER');
  });
});
