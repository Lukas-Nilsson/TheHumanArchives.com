'use server';

import { cookies } from 'next/headers';

export async function unlock(formData) {
  const pwd = formData.get('password');

  // 1️⃣ Replace with your real password check
  if (pwd !== process.env.SITE_PASSWORD) {
    return { ok: false };
  }

  // 2️⃣ Set the cookie *on the server* so every later request has it
  cookies().set({
    name:     'site_auth',
    value:    'true',
    httpOnly: true,
    path:     '/',                  // 👉 visible to all routes
    sameSite: 'strict',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   60 * 60 * 24 * 30,    // 30 days
  });

  return { ok: true };
}
