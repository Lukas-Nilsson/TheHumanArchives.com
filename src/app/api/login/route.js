import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { pw } = await req.json();
  const correct = pw === process.env.SITE_PASSWORD;

  if (!correct) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cookieStore = await cookies(); // ← await first
  cookieStore.set('site_auth', 'true', {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
