import { clearSessionCookie } from '@/lib/session-cookie';

// POST /api/auth/logout — clear the session cookie
// Auth: not required; clearing a cookie you may not have is harmless.
export async function POST() {
  return clearSessionCookie({ success: true });
}
