// middleware.mjs

import { NextResponse } from 'next/server';

/** @param {import('next/server').NextRequest} req */
export function middleware(req) {
  const pathname = req.nextUrl.pathname;

  console.log('🔒 Middleware running on:', pathname);

  if (pathname === '/waitlist' || pathname === '/password') {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = '/password';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*',
};
