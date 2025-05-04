import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// create a lightweight, stateless Supabase client
function supabase() {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!EMAIL_RX.test(email ?? '')) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const { error } = await supabase()
      .from('waitlist_emails')
      .insert({ email });

    // allow silent duplicates for idempotent UX
    if (error && error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
