import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// one lightweight client for this module
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!EMAIL_RX.test(email ?? '')) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const { error } = await supabase
      .from('waitlist_emails')
      .insert({ email });

    // allow duplicate inserts so the user still gets “success”
    if (error && error.code !== '23505') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
