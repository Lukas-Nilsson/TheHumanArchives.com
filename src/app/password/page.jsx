'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordGate() {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ pw }),
    }).then((r) => r.ok);
    if (ok) router.push('/'); // or redirect to original destination
    else setError('Incorrect password');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <form onSubmit={submit} className="w-80 space-y-4">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Enter password"
          className="w-full rounded border border-gray-300 px-4 py-2"
        />
        <button className="w-full bg-black text-white py-2 rounded">
          Unlock
        </button>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>
    </main>
  );
}
