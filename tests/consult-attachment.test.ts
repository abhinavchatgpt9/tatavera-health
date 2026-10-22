import { describe, it, expect } from 'vitest';
import {
  isAllowedAttachmentMimeType,
  isAttachmentFileSizeValid,
  buildAttachmentFileKey,
  MAX_ATTACHMENT_FILE_SIZE,
} from '@/lib/consult-attachment';

describe('Consult attachment — file type restriction', () => {
  it('accepts PDF, JPG and PNG', () => {
    expect(isAllowedAttachmentMimeType('application/pdf')).toBe(true);
    expect(isAllowedAttachmentMimeType('image/jpeg')).toBe(true);
    expect(isAllowedAttachmentMimeType('image/png')).toBe(true);
  });

  it('rejects an executable or script disguised as an attachment', () => {
    expect(isAllowedAttachmentMimeType('application/x-msdownload')).toBe(false);
    expect(isAllowedAttachmentMimeType('text/html')).toBe(false);
  });
});

describe('Consult attachment — file size cap (5 MB, smaller than the 20 MB report cap)', () => {
  it('accepts a file within the limit', () => {
    expect(isAttachmentFileSizeValid(2 * 1024 * 1024)).toBe(true);
  });

  it('rejects a file over the 5 MB limit', () => {
    expect(isAttachmentFileSizeValid(MAX_ATTACHMENT_FILE_SIZE + 1)).toBe(false);
  });

  it('rejects a zero-byte file', () => {
    expect(isAttachmentFileSizeValid(0)).toBe(false);
  });
});

describe('Consult attachment — object key generation', () => {
  it('namespaces under consult-attachments and strips unsafe characters', () => {
    const key = buildAttachmentFileKey('my report (final)!.pdf', 1700000000000);
    expect(key).toBe('consult-attachments/1700000000000-my_report__final__.pdf');
  });
});
