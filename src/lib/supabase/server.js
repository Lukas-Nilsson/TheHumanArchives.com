import { createServerClient } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies(); // now async
  const headerStore = await headers(); // also async

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        set: () => {},
        remove: () => {},
      },
      headers: Object.fromEntries(headerStore.entries()),
    }
  );
}