import { NextResponse } from 'next/server';
import { createClient } from '/lib/supabase/server';  
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email?.includes('@')) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    // Supabase anon client (no session persistence)
    const supabase = createClient();

    const { error } = await supabase
      .from('waitlist_emails')
      .insert({ email });

    if (error) {
      // treat duplicate email as success to keep UX smooth
      if (error.code === '23505') {
        return NextResponse.json({ ok: true });
      }
      console.error('Supabase insert error →', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Route crash →', err);
    return NextResponse.json({ error: 'server' }, { status: 500 });
  }
}
