import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().delete('site_auth');
  return NextResponse.json({ ok: true });
}
