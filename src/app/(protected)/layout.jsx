// src/app/(protected)/layout.jsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/** Optional – Page-title etc. */
export const metadata = {
  title: 'The Human Archives',
};

export default async function ProtectedLayout({ children }) {
  // Server-side – runs on every request
  const cookieStore = await cookies();
  const authed      = cookieStore.get('site_auth')?.value === 'true';

  if (!authed) {
    redirect('/password');        // Hard redirect before any child renders
  }

  return <>{children}</>;         // ✅ User is allowed through
}
