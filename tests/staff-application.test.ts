import { describe, it, expect } from 'vitest';
import { ApplySchema, generateTempPassword } from '@/lib/staff-application';

describe('10. Doctor/hospital self-signup — application validation & temp password', () => {
  it('accepts a valid doctor application', () => {
    const result = ApplySchema.safeParse({
      requestedRole: 'DOCTOR',
      name: 'Dr. Jane Doe',
      email: 'jane@hospital.com',
      phone: '+919876543210',
      organizationName: 'Apollo Hospitals, Chennai',
      specialtyOrType: 'Cardiology',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an application with an invalid requestedRole (only DOCTOR/HOSPITAL_ADMIN allowed)', () => {
    const result = ApplySchema.safeParse({
      requestedRole: 'ADMIN', // a would-be applicant self-granting admin
      name: 'Jane Doe',
      email: 'jane@hospital.com',
      phone: '+919876543210',
      organizationName: 'Apollo Hospitals',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an application missing required fields', () => {
    const result = ApplySchema.safeParse({
      requestedRole: 'DOCTOR',
      name: 'Jane Doe',
      // email missing
      phone: '+919876543210',
      organizationName: 'Apollo Hospitals',
    });
    expect(result.success).toBe(false);
  });

  it('generates a temp password of usable, non-trivial length', () => {
    const pw = generateTempPassword();
    expect(pw.length).toBeGreaterThanOrEqual(10);
  });

  it('never generates the same temp password twice in a row (approving two applicants back to back)', () => {
    const passwords = new Set(Array.from({ length: 20 }, () => generateTempPassword()));
    expect(passwords.size).toBe(20);
  });
});
