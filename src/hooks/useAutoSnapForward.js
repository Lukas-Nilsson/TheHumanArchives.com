'use client';
import { useEffect } from 'react';

/**
 * When the viewport has scrolled past `threshold` (0-1) of `heroRef`,
 * smooth-scroll the page to `targetRef`.
 */
export default function useAutoSnapForward(
  heroRef,
  targetRef,
  threshold = 0.9,
  scrollPortRef = { current: typeof window !== 'undefined' ? window : null }
) {
  useEffect(() => {
    const hero   = heroRef.current;
    const target = targetRef.current;
    const port   = scrollPortRef.current;
    if (!hero || !target || !port) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        const rect   = hero.getBoundingClientRect();
        const vh     = window.innerHeight;
        const prog   = Math.min(Math.max(-rect.top / vh, 0), 1); // 0-1

        if (prog >= threshold) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    };

    port.addEventListener('scroll', onScroll, { passive: true });
    return () => port.removeEventListener('scroll', onScroll);
  }, [heroRef, targetRef, threshold, scrollPortRef]);
}
