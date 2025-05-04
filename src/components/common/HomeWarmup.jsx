'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeWarmup() {
  const router = useRouter();

  useEffect(() => {
    /** Prefetch page routes (JS + data) */
    const routes = [
        '/archives',
        '/shop',
        '/about',

    ];
    routes.forEach((r) => router.prefetch(r));

    /** Pre-load hero images used in parallax pages */
    const images = [
      '/arch-foreground-origins-2.png',
      '/arch-midground.png',
      '/arch-foreground.png',
      'public/artifact-wall.png',
      '/lukas.JPG',
    ];
    images.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as  = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    /** Wake Supabase / shop stock endpoint (cheap read) */
    fetch('/api/stock?color=white&size=M').catch(() => {});
  }, []); // run once on first paint

  return null; // nothing visible
}
