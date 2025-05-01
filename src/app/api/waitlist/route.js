import { NextResponse } from 'next/server';
import { createClient } from '/lib/supabase/server';

export async function POST(request) {
  const { email } = await request.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const supabase = createClient(); // assumes you have this helper
  const { error } = await supabase.from('waitlist_emails').insert({ email });

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
