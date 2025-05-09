'use client';
import { useLayoutEffect } from 'react';

/* Publishes the current <header> height as  --header-h  on :root. */
export default function useHeaderHeight() {
  useLayoutEffect(() => {
    const header = document.querySelector('header');     // adjust selector if needed
    if (!header) return;

    const set = () =>
      document.documentElement.style.setProperty('--header-h', `${header.offsetHeight}px`);

    set();                                   // initial
    const ro = new ResizeObserver(set);      // live whenever header resizes
    ro.observe(header);

    return () => ro.disconnect();
  }, []);
}
