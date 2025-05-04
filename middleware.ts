import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log('🧪 Middleware running on:', pathname);

  if (pathname === '/waitlist' || pathname === '/password') {
    return NextResponse.next();
  }

  // 🔒 Force all other pages to redirect to /password
  const url = req.nextUrl.clone();
  url.pathname = '/password';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: '/:path*',
};
