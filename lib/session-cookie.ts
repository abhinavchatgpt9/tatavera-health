import { NextResponse } from 'next/server';

export const SESSION_COOKIE = 'token';

/** Seven days, matching the JWT lifetime in lib/auth.ts. */
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/**
 * Attaches the session JWT to a response as an HttpOnly cookie.
 *
 * HttpOnly matters here: this platform stores medical records, and a token
 * readable from JavaScript means any cross-site scripting bug anywhere on the
 * site hands an attacker a full session. The token is deliberately NOT returned
 * in the response body either — a body value ends up in browser history, proxy
 * logs and error reporting tools.
 *
 * `secure` is off in development so the cookie works over plain http on
 * localhost; in production it is always on.
 */
export function withSessionCookie<T>(payload: T, token: string, init?: ResponseInit) {
  const response = NextResponse.json(payload, init);

  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });

  return response;
}

/** Clears the session cookie — used by sign-out. */
export function clearSessionCookie<T>(payload: T) {
  const response = NextResponse.json(payload);

  response.cookies.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
