import { NextRequest, NextResponse } from 'next/server';

// Edge-safe presence check only — full signature + role verification happens
// server-side (Node runtime) via getAuthUser() in each portal's page/layout,
// since jsonwebtoken/bcryptjs are not Edge-runtime compatible.
const PORTAL_PREFIXES = ['/dashboard', '/doctor-portal', '/hospital-portal', '/case-manager-portal', '/admin-portal'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!PORTAL_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/doctor-portal/:path*', '/hospital-portal/:path*', '/case-manager-portal/:path*', '/admin-portal/:path*'],
};
