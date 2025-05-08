import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

/** Create a Supabase client that shares Next.js request cookies/headers */
export async function createClient() {
  // In dynamic contexts these are Promises; in static they’re plain objects.
  const cookieStore = await cookies();
  const headerStore = await headers();

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
