import { describe, it, expect } from 'vitest';
import { PROCEDURES, SPECIALTIES, TREATMENT_AREAS, CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_TEL } from '@/lib/constants';
import {
  resolveTreatmentParam,
  treatmentLabel,
  isOtherTreatment,
  enquiryReference,
  OTHER_TREATMENT_LABEL,
} from '@/lib/enquiry';
import { maxPhoneDigits, limitPhoneDigits } from '@/lib/phone';

describe('Contact details', () => {
  it('uses the approved phone number consistently', () => {
    expect(CONTACT_PHONE).toBe('+91 98772 63279');
    expect(CONTACT_PHONE_TEL).toBe('+919877263279');
  });
  it('has a valid-looking email address', () => {
    expect(CONTACT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});

describe('Specialty filters (Cardiology showed 0)', () => {
  it('every specialty chip maps to at least one listed procedure or to a treatment area for enquiry', () => {
    for (const s of SPECIALTIES) {
      const matches = PROCEDURES.filter((p) => p.specialty === s.slug);
      const hasArea = TREATMENT_AREAS.some((a) => a.slug === s.slug);
      expect(matches.length > 0 || hasArea, `${s.name} has neither procedures nor an enquiry area`).toBe(true);
    }
  });
  it('cardiology has procedures listed', () => {
    expect(PROCEDURES.filter((p) => p.specialty === 'cardiology').length).toBeGreaterThan(0);
  });
  it('every procedure has a specialty slug', () => {
    for (const p of PROCEDURES) expect(p.specialty, p.name).toBeTruthy();
  });
});

describe('Treatment carried into the enquiry form', () => {
  it('resolves a procedure id', () => {
    const p = PROCEDURES[0];
    expect(resolveTreatmentParam(p.id)).toBe(`procedure:${p.id}`);
    expect(treatmentLabel(`procedure:${p.id}`)).toBe(p.name);
  });
  it('resolves a specialty slug to its treatment area', () => {
    expect(resolveTreatmentParam('cardiology')).toBe('area:cardiology');
  });
  it('resolves "other" and not-sure', () => {
    expect(resolveTreatmentParam('other')).toBe('other');
    expect(isOtherTreatment('other')).toBe(true);
    expect(treatmentLabel('other')).toBe(OTHER_TREATMENT_LABEL);
  });
  it('ignores unknown or empty values', () => {
    expect(resolveTreatmentParam('nonsense-xyz')).toBe('');
    expect(resolveTreatmentParam('')).toBe('');
    expect(resolveTreatmentParam(undefined)).toBe('');
  });
  it('takes the first value when a param is repeated', () => {
    expect(resolveTreatmentParam(['cardiology', 'other'])).toBe('area:cardiology');
  });
});

describe('Enquiry reference', () => {
  it('is the last 8 characters, upper case', () => {
    expect(enquiryReference('clxyzabcdefgh12345678')).toBe('12345678');
    expect(enquiryReference('abcdefghij')).toBe('CDEFGHIJ');
  });
});

describe('Phone digit limits per country', () => {
  it('limits Indian numbers to 10 digits', () => {
    expect(maxPhoneDigits('IN')).toBe(10);
    expect(limitPhoneDigits('98765432109999', 'IN')).toBe('9876543210');
  });
  it('accepts Kenyan numbers of 9 digits (7xx / 1xx)', () => {
    expect(maxPhoneDigits('KE')).toBeGreaterThanOrEqual(9);
    expect(limitPhoneDigits('712345678', 'KE').length).toBe(9);
  });
});
