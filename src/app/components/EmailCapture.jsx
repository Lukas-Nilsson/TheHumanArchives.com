'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'ok' | 'error'

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    res.ok ? setStatus('ok') : setStatus('error');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="px-4 py-2 rounded text-black"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-tha-gold text-tha-black rounded hover:opacity-90"
      >
        Join Waitlist
      </button>
      {status === 'ok' && (
        <p className="text-sm text-tha-gold">Thanks! You’re on the list.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-500">Something went wrong.</p>
      )}
    </form>
  );
}
