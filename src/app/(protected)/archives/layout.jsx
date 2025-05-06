// src/app/(protected)/archives/layout.jsx
export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ArchivesLayout({ children }) {
  // Server-side – runs on every request
  const cookieStore = await cookies();
  const authed      = cookieStore.get('site_auth')?.value === 'true';

  if (!authed) {
    redirect('/password');
  }
 return <>{children}</>;
    
}
