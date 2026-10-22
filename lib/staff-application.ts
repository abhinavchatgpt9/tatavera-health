import { randomBytes } from 'crypto';
import { z } from 'zod';

// Shared between the public application POST and the admin PATCH review
// route, and unit-testable on its own since it holds no I/O.
export const ApplySchema = z.object({
  requestedRole: z.enum(['DOCTOR', 'HOSPITAL_ADMIN']),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  organizationName: z.string().min(2).max(200),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  specialtyOrType: z.string().max(150).optional(),
  message: z.string().max(2000).optional(),
});

// 9 random bytes -> 12-character base64url string handed to an approved
// applicant as their initial portal password (they're expected to change it).
export function generateTempPassword(): string {
  return randomBytes(9).toString('base64url');
}
