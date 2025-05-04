import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/waitlist', '/password', '/api/login'];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const cookie = req.cookies.get('site_auth')?.value;

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/';

  if (isPublic) return NextResponse.next();

  if (cookie !== 'true') {
    const url = req.nextUrl.clone();
    url.pathname = '/password';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)',
};
