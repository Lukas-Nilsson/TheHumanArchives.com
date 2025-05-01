import { NextResponse } from 'next/server';
import { createClient } from '/lib/supabase/server';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!EMAIL_RX.test(email ?? '')) {
      console.error(`[${new Date().toISOString()}] Invalid email: ${email}`);
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('waitlist_emails')
      .insert({ email });

    if (error) {
      // duplicate = success (idempotent UX)
      if (error.code === '23505') return NextResponse.json({ ok: true });

      console.error(
        `[${new Date().toISOString()}] Supabase insert error`,
        error
      );
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Route crash`, err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
