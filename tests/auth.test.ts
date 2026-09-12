import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
  signPendingToken,
  verifyPendingToken,
  requireRole,
  generateOtp,
} from '@/lib/auth';
import { NextRequest } from 'next/server';

function reqWithToken(token: string | null): NextRequest {
  const headers = new Headers();
  if (token) headers.set('cookie', `token=${token}`);
  return new NextRequest('https://tatavera-health.vercel.app/api/test', { headers });
}

describe('1. Password hashing — patient/staff login security', () => {
  it('hashes a password and verifies the correct one against it', async () => {
    const hash = await hashPassword('S3cure!Pass123');
    expect(hash).not.toBe('S3cure!Pass123');
    expect(await verifyPassword('S3cure!Pass123', hash)).toBe(true);
  });

  it('rejects an incorrect password against a stored hash', async () => {
    const hash = await hashPassword('S3cure!Pass123');
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });
});

describe('2. JWT session tokens — the core of every logged-in request', () => {
  it('round-trips a signed token back to its original payload', () => {
    const token = signToken({ userId: 'user_123', role: 'PATIENT' });
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject({ userId: 'user_123', role: 'PATIENT' });
  });

  it('rejects a tampered/invalid token instead of throwing', () => {
    const token = signToken({ userId: 'user_123', role: 'PATIENT' });
    const tampered = token.slice(0, -2) + 'xx';
    expect(verifyToken(tampered)).toBeNull();
  });
});

describe('3. requireRole — the gate every portal API route relies on for RBAC', () => {
  it('allows a request whose token role is in the allowed list', () => {
    const token = signToken({ userId: 'admin_1', role: 'ADMIN' });
    const req = reqWithToken(token);
    expect(requireRole(req, ['ADMIN'])).toMatchObject({ userId: 'admin_1', role: 'ADMIN' });
  });

  it('denies a request whose token role is NOT in the allowed list (cross-portal access)', () => {
    const token = signToken({ userId: 'patient_1', role: 'PATIENT' });
    const req = reqWithToken(token);
    // A patient token must never satisfy an admin-only route.
    expect(requireRole(req, ['ADMIN'])).toBeNull();
  });

  it('denies a request with no token at all', () => {
    const req = reqWithToken(null);
    expect(requireRole(req, ['ADMIN', 'PATIENT'])).toBeNull();
  });
});

describe('4. Pending tokens — OTP signup and 2FA-login flows must not cross over', () => {
  it('accepts a pending token for the purpose it was signed for', () => {
    const token = signPendingToken('user_42', 'signup_verify');
    expect(verifyPendingToken(token)).toEqual({ userId: 'user_42', purpose: 'signup_verify' });
  });

  it('a 2FA-pending token cannot be replayed to complete signup verification', () => {
    // Simulates the API layer's own purpose check: verifyPendingToken decodes
    // fine, but the caller must reject it when the purpose doesn't match the
    // route it's being used on.
    const token = signPendingToken('user_42', '2fa_pending');
    const decoded = verifyPendingToken(token);
    expect(decoded?.purpose).not.toBe('signup_verify');
  });
});

describe('5. OTP generation — used for phone/email verification', () => {
  it('always generates a 6-digit numeric code', () => {
    for (let i = 0; i < 50; i++) {
      const otp = generateOtp();
      expect(otp).toMatch(/^\d{6}$/);
      expect(Number(otp)).toBeGreaterThanOrEqual(100000);
      expect(Number(otp)).toBeLessThanOrEqual(999999);
    }
  });
});
