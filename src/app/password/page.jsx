'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordPage() {
  const [pw, setPw]     = useState('');
  const [err, setErr]   = useState('');
  const router          = useRouter();

  async function submit(e) {
    e.preventDefault();
    setErr('');

    const res = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pw }),
    });

    if (res.ok) {
      router.replace('/archives');       // cookie now set on server
    } else {
      setErr('Incorrect password');
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-80 space-y-4">
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Enter password"
          className="w-full rounded border border-gray-300 px-4 py-2"
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Unlock
        </button>
        {err && <p className="text-red-600 text-sm text-center">{err}</p>}
      </form>
    </main>
  );
}
