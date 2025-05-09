// src/hooks/useScrollHandoff.js
'use client';
import { useEffect } from 'react';

/**
 * Lets page-scroll take over as soon as the inner scroller reaches
 * its start or end — much smoother than waiting for momentum = 0.
 *
 * @param {React.RefObject<HTMLElement>} ref  the scroll container
 */
export default function useScrollHandoff(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = e => {
      const atTop    = el.scrollTop <= 0;
      const atBottom = el.scrollTop >= el.scrollHeight - el.clientHeight - 1;
      const up       = e.deltaY < 0;

      if ((up && atTop) || (!up && atBottom)) {
        // forward the leftover delta to the page and stop the inner scroll
        e.preventDefault();
        // use the identical delta so momentum feels continuous
        window.scrollBy({ top: e.deltaY, behavior: 'auto' });
      }
      // else: let the carousel handle the scroll normally
    };

    // passive:false → we need preventDefault
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel, { passive: false });
  }, [ref]);
}
