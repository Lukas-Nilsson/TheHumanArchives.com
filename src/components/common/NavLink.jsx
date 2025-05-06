// NavLink.jsx  – hydration‑safe hash‑aware underline
'use client';

import Link           from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavLink({ label, href, className = '' }) {
  const pathname      = usePathname();           // e.g.  "/archives"
  const [hash, setHash] = useState('');

  /* Track the current #fragment (client‑only) */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => setHash(window.location.hash); // "#origins", ""
    update();                        // run once on mount
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  /* Split the link's target into path + (optional) fragment */
  const [hrefPath, hrefFragment] = href.split('#');   // "/#origins" → ["", "origins"]
  const needHashMatch = Boolean(hrefFragment);        // true for anchors

  const isActive =
    pathname === (hrefPath || '/') &&                 // same page
    (!needHashMatch || hash === `#${hrefFragment}`);  //    + same hash if required

  return (
    <li>
      <Link
        href={href}
        scroll={false}                /* keeps smooth‑scroll behaviour */
        className={`
          relative px-1 py-0.5
          after:absolute after:left-0 after:bottom-0
          after:h-0.5 after:w-full after:bg-white
          after:transition-transform after:origin-left
          ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}
          ${className}
        `}
      >
        {label}
      </Link>
    </li>
  );
}
