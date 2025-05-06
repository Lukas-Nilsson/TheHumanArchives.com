// pages/index or /app/(protected)/archives/page.jsx
'use client';
import { useRef }       from 'react';
import HeroHomepage from '@/components/hero/HeroHomepage';
import ArtifactCarousel from '@/components/gallery/ArtifactCarousel';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ArchivesPage({ children }) {
  const originsRef = useRef(null);
  const router    = useRouter();
  const pathname  = usePathname().replace(/\/$/, '');
  const scrollToOrigins = () => {
    originsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleArchivesClick = e => {
    if (pathname === '/archives') {          // same page → intercept
      e.preventDefault();
      // Remove any hash and smooth-scroll to top
      router.replace('/archives/', { scroll: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Make sure this runs only in the browser
    if (typeof window === 'undefined') return;

    // Helper to scroll the origins carousel into view (if it exists)
    const scrollToOrigins = () => {
      document
        .getElementById('origins')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Strip trailing slash so "/archives/" === "/archives"
    const cleanPath = pathname.replace(/\/$/, '');
    const hash      = window.location.hash;

    if (cleanPath === '/archives' && hash === '') {
      // ① plain /archives  → top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (cleanPath === '/archives' && hash === '#origins') {
      // ② /archives#origins → scroll to carousel
      scrollToOrigins();
    }
  }, [pathname]);


  return (
    <>
      <HeroHomepage onEnter={scrollToOrigins}/>
      <ArtifactCarousel ref={originsRef}/>
    </>
  );
}
