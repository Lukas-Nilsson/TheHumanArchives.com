'use client';

import Link                     from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { forwardRef, useEffect, useState } from 'react';

/* ---- MenuLink -------------------------------------------------------- */
const MenuLink = forwardRef(function MenuLink(
  { href, label, isActive, onClick },
  ref
) {
  return (
    <Link
      ref={ref}
      href={href}
      scroll={false}
      onClick={onClick}
      className={`
        relative px-1 py-2
        ${isActive ? 'text-white' : 'text-gray-300'}
        hover:text-white transition-colors
        after:absolute after:left-0 after:bottom-0
        after:h-0.5 after:w-full after:bg-white
        after:transition-transform after:origin-left
        ${isActive ? 'after:scale-x-100' : 'after:scale-x-0'}
        hover:after:scale-x-100
      `}
    >
      {label}
    </Link>
  );
});

/* ---- SiteHeader ------------------------------------------------------ */
export default function SiteHeader() {
  const router   = useRouter();
  const pathname = usePathname().replace(/\/$/, '');

  /* 1️⃣  **No window access here** — just start blank */
  const [active, setActive] = useState('');

  /* 2️⃣  Sync once on mount, then whenever hash changes */
  useEffect(() => {
    const pick = () => {
      if (pathname === '/archives') {
        setActive(location.hash === '#origins' ? 'origins' : 'archives');
      } else if (pathname === '/shop') {
        setActive('shop');
      } else if (pathname === '/about') {
        setActive('about');
      } else {
        setActive('');
      }
    };
    pick();
    window.addEventListener('hashchange', pick);
    return () => window.removeEventListener('hashchange', pick);
  }, [pathname]);

  /* IntersectionObserver (unchanged) */
  useEffect(() => {
    if (pathname !== '/archives') return;

    const el = document.getElementById('origins');
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const inView  = entry.intersectionRatio >= 0.3;
        setActive(inView ? 'origins' : 'archives');

        const wantHash = inView ? '#origins' : '';
        if (location.hash !== wantHash) {
          router.replace(`/archives/${wantHash}`, { scroll: false });
        }
      },
      { threshold: [0, 0.3] }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [pathname, router]);

  /* click-scroll helpers (unchanged) */
  const scrollToTop = () => {
    router.replace('/archives/', { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActive('archives');
  };
  const scrollToOrigins = () => {
    router.replace('/archives#origins', { scroll: false });
    document.getElementById('origins')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive('origins');
  };

  /* ------------- JSX (unchanged) ------------- */
  return (
    <>
      {/* Desktop */}
      <header className="hidden md:flex fixed top-0 left-0 w-full z-40
                       bg-[#040500]/90 backdrop-blur-sm text-white
                       flex-col items-center pt-10 pb-8">
        <nav className="mt-4 text-sm uppercase tracking-widest">
          <ul className="flex gap-6">
            <li className="relative group">
              <MenuLink
                href="/archives/"
                label="Archives"
                isActive={active === 'archives'}
                onClick={pathname === '/archives'
                  ? e => { e.preventDefault(); scrollToTop(); }
                  : undefined}
              />
              <ul className="absolute left-0 top-full mt-2 hidden
                             group-hover:block group-focus-within:block
                             bg-[#040500]/95 backdrop-blur-sm rounded-md
                             shadow-lg min-w-[8rem] p-2">
                <li>
                  <MenuLink
                    href="/archives#origins"
                    label="Origins"
                    isActive={active === 'origins'}
                    onClick={pathname === '/archives'
                      ? e => { e.preventDefault(); scrollToOrigins(); }
                      : undefined}
                  />
                </li>
              </ul>
            </li>

            <li><MenuLink href="/shop"  label="Shop"  isActive={active === 'shop'}  /></li>
            <li><MenuLink href="/about" label="About" isActive={active === 'about'} /></li>
          </ul>
        </nav>
      </header>

      {/* Mobile */}
      <header className="md:hidden fixed bottom-0 left-0 w-full z-40
                   bg-[#040500]/20 backdrop-blur-sm text-white
                   flex justify-center py-8">
        <nav className="text-sm uppercase tracking-widest w-full">
          <ul className="flex justify-around w-full px-4 -translate-y-3">
            <li>
              <MenuLink
                href="/archives/"
                label="Archives"
                isActive={active === 'archives'}
                onClick={pathname === '/archives'
                  ? e => { e.preventDefault(); scrollToTop(); }
                  : undefined}
              />
            </li>
            <li>
              <MenuLink
                href="/archives#origins"
                label="Origins"
                isActive={active === 'origins'}
                onClick={pathname === '/archives'
                  ? e => { e.preventDefault(); scrollToOrigins(); }
                  : undefined}
              />
            </li>
            <li><MenuLink href="/shop"  label="Shop"  isActive={active === 'shop'}  /></li>
            <li><MenuLink href="/about" label="About" isActive={active === 'about'} /></li>
          </ul>
        </nav>
      </header>
    </>
  );
}
