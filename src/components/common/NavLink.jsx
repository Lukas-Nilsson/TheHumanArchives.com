'use client';

import Link           from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { animateScrollTo } from '@/utils/animateScrollTo';

export default function NavLink({ label, href, className = '' }) {
  const pathname     = usePathname();        // e.g. "/archives"
  const router       = useRouter();
  const [hash, setHash] = useState('');      // "#origins", ""

  /* Track the current #fragment (client-only) */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setHash(window.location.hash);
    update();                                       // run once on mount
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  /* Split the link target */
  const [hrefPath, hrefFragment] = href.split('#');   // "/#origins" → ["", "origins"]
  const hasFragment   = Boolean(hrefFragment);

  const isActive =
    pathname === (hrefPath || '/') &&                 // same page
    (!hasFragment || hash === `#${hrefFragment}`);    // + same hash if required

  /* Smooth-scroll when we’re already on the correct page */
  const handleClick = useCallback(
    e => {
      if (!hasFragment) return;                       // normal link

      const onSamePage = pathname === (hrefPath || '/');
      if (!onSamePage) return;                       // let Next.js navigate

      // Prevent the browser’s instant jump
      e.preventDefault();

      const targetEl = document.getElementById(hrefFragment);
      if (!targetEl) return;

      const mobile   = window.matchMedia('(max-width: 767px)').matches;
      const y        = targetEl.offsetTop;

      animateScrollTo(y, { duration: mobile ? 1400 : 900 });

      // Push the hash into the URL bar (no page reload)
      history.replaceState(null, '', `#${hrefFragment}`);
    },
    [hasFragment, hrefFragment, pathname, hrefPath]
  );

  return (
    <li>
      <Link
        href={href}
        scroll={false}                // we handle scroll manually
        onClick={handleClick}
        className={`
          relative px-1 py-0.5
          after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full
          after:bg-white after:transition-transform after:origin-left
          ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}
          ${className}
        `}
      >
        {label}
      </Link>
    </li>
  );
}
