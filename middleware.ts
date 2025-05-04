import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/waitlist', '/password', '/api/login'];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const authed = req.cookies.get('site_auth')?.value === 'true';

  const isPublic =
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (isPublic) return NextResponse.next();

  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = '/password';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|favicon.ico).*)',
};
