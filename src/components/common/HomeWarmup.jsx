// src/components/common/HomeWarmup.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeWarmup() {
  const router = useRouter();

  useEffect(() => {
    // Pre-fetch the shop route’s JS chunk & data
    router.prefetch('/shop');

    // Ping an inexpensive API to wake the backend / cold Start
    fetch('/api/stock?color=white&size=M').catch(() => {/* silent */});
  }, []);

  return null; // renders nothing
}
