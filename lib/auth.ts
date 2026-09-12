import bcrypt from 'bcryptjs';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
// Long-lived on purpose: sessions should stay active until the user
// explicitly logs out, not expire silently mid-use. A JWT can't literally
// never expire (no revocation without server-side session state), so 90
// days is used as a practical "stays logged in" duration instead.
const JWT_EXPIRY = '90d';
const PENDING_JWT_EXPIRY = '10m';

export type PendingPurpose = 'signup_verify' | '2fa_pending';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function signPendingToken(userId: string, purpose: PendingPurpose): string {
  return jwt.sign({ userId, purpose }, JWT_SECRET, { expiresIn: PENDING_JWT_EXPIRY });
}

export function verifyPendingToken(token: string): { userId: string; purpose: PendingPurpose } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId?: string;
      purpose?: string;
    };
    if (!decoded.userId || (decoded.purpose !== 'signup_verify' && decoded.purpose !== '2fa_pending')) {
      return null;
    }
    return { userId: decoded.userId, purpose: decoded.purpose as PendingPurpose };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  const cookie = req.cookies.get('token')?.value;
  return cookie || null;
}

export function getAuthUser(req: NextRequest): { userId: string; role: string } | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireRole(
  req: NextRequest,
  roles: string[]
): { userId: string; role: string } | null {
  const auth = getAuthUser(req);
  if (!auth || !roles.includes(auth.role)) return null;
  return auth;
}

