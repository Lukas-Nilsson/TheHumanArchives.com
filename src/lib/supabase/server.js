import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

/** Create a Supabase client that shares Next.js request cookies/headers */
export function createClient() {
  // These helpers are synchronous in Next 15
  const cookieStore = cookies();
  const headerStore = headers();

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(), // keep session persistence
        set: () => {},                      // no-op on server
        remove: () => {},                   // no-op on server
      },
      headers: Object.fromEntries(headerStore.entries()),
    }
  );
}
