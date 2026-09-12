import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

// Server-side (Node runtime) role gate for portal pages. Call at the top of
// each portal's page.tsx (or a shared layout) since middleware.ts only
// checks token presence (Edge runtime can't verify jsonwebtoken signatures).
export function requirePortalRole(allowedRoles: string[]) {
  const token = cookies().get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    redirect('/auth/login');
  }
  if (!allowedRoles.includes(payload.role)) {
    redirect('/auth/login?error=forbidden');
  }

  return payload;
}
