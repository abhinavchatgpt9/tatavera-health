import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * The signed-in user plus whichever profile row their role hangs off.
 *
 * Portal pages need more than the JWT carries — a doctor page needs the Doctor
 * row, a hospital page needs the hospital the staff member belongs to. Loading
 * it once here keeps every page's own query focused on what it renders.
 */
export type PortalSession = {
  userId: string;
  role: Role;
  name: string;
  email: string;
  avatarUrl: string | null;
  /** Set when role is DOCTOR and the account is linked to a Doctor profile. */
  doctorId: string | null;
  /** Set when role is HOSPITAL_ADMIN and the account is linked to a hospital. */
  hospitalId: string | null;
  /** Set when role is CASE_MANAGER and the account is linked to a CaseManager. */
  caseManagerId: string | null;
};

/**
 * Verifies the session cookie, enforces the role, and loads the linked profile.
 * Redirects rather than throwing — this runs at the top of a page render.
 *
 * `middleware.ts` only checks that a cookie exists (the Edge runtime can't
 * verify a jsonwebtoken signature). This is the call that actually authorises.
 */
export async function getPortalSession(allowedRoles: Role[]): Promise<PortalSession> {
  const token = cookies().get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      doctorProfileId: true,
      caseManagerProfileId: true,
      hospitalStaff: { select: { hospitalId: true } },
    },
  });

  // Token is valid but the account is gone — treat as signed out.
  if (!user) redirect('/auth/login');

  // Role is read from the database, not the token, so a role change takes
  // effect immediately instead of when the 7-day token expires.
  if (!allowedRoles.includes(user.role)) redirect('/auth/login?error=forbidden');

  return {
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    doctorId: user.doctorProfileId,
    hospitalId: user.hospitalStaff?.hospitalId ?? null,
    caseManagerId: user.caseManagerProfileId,
  };
}
