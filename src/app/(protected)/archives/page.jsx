// src/app/(protected)/archives/page.jsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import HeroHomepage      from '@/components/hero/HeroHomepage';
import ArtifactCarousel  from '@/components/gallery/ArtifactCarousel';

export default function Page({ params, searchParams }) {
  const originsRef = useRef(null);
  const router     = useRouter();
  const pathname   = usePathname().replace(/\/$/, '');
  
  /* Scroll helper for the ENTER button */
  const scrollToOrigins = () => {
    originsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* One-time scroll on mount based on hash */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (pathname === '/archives' && hash === '#origins') {
      originsRef.current
        ? scrollToOrigins()
        : document.getElementById('origins')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/archives') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <>
      <HeroHomepage onEnter={scrollToOrigins} />
      <ArtifactCarousel ref={originsRef} />
    </>
  );
}