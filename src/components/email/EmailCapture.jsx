'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail]   = useState('');
  const [busy, setBusy]     = useState(false);              // loading spinner flag
  const [status, setStatus] = useState(null);               // 'ok' | 'error' | 'invalid' | null
  const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!EMAIL_RX.test(email)) {
      setStatus('invalid');
      return;
    }

    setBusy(true);
    setStatus(null);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    } finally {
      setBusy(false);
    }
  }

  /* noValidate disables the browser’s built-in e-mail validation so
     our custom <p> message renders instead */
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-2"
    >
    <input
    type="email"
    placeholder="you@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="rounded px-3 py-2 bg-[#1a1a1a] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tha-gold"
    required
    />


      <button
        type="submit"
        disabled={busy}
        className="btn disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {busy ? 'Joining…' : 'Join Waitlist'}
      </button>

      {status === 'invalid' && (
        <p className="text-red-500 text-sm">Please enter a valid email.</p>
      )}
      {status === 'ok' && (
        <p className="text-green-500 text-sm">
          Success! Check your inbox for a confirmation.
        </p>
      )}
      {status === 'error' && (
        <p className="text-red-500 text-sm">
          Something went wrong. Please try again later.
        </p>
      )}
    </form>
  );
}
