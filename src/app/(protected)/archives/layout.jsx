// src/app/(protected)/layout.jsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function ProtectedLayout({ children }) {
  // now allowed, because this file is forced‐dynamic
  const authed = cookies().get('site_auth')?.value === 'true';

  if (!authed) {
    redirect('/password');
  }

  return <>{children}</>;
}
