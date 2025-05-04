// src/app/(protected)/layout.jsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/** Optional – Page-title etc. */
export const metadata = {
  title: 'The Human Archives',
};

export default function ProtectedLayout({ children }) {
  // Server-side – runs on every request
  const authed = cookies().get('site_auth')?.value === 'true';

  if (!authed) {
    redirect('/password');        // Hard redirect before any child renders
  }

  return children;                // ✅ User is allowed through
}
