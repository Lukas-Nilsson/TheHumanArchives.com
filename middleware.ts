import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/waitlist', '/password', '/api/login'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
  
    if (
      pathname.startsWith('/waitlist') ||
      pathname.startsWith('/password')
    ) {
      return NextResponse.next();
    }
  
    const url = req.nextUrl.clone();
    url.pathname = '/password';
    return NextResponse.redirect(url);
  }
  
// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Allow Next.js internals, public assets, and public pages
//   const isPublic =
//     PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
//     pathname.startsWith('/_next') ||
//     pathname.startsWith('/favicon') ||
//     pathname.startsWith('/images') || // optional: allow static assets folder
//     pathname === '/';

//   if (isPublic) {
//     return NextResponse.next();
//   }

//   const authed = req.cookies.get('site_auth')?.value === 'true';

//   if (!authed) {
//     const url = req.nextUrl.clone();
//     url.pathname = '/password';
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

export const config = {
  matcher: '/((?!_next).*)',
};
