'use client';
import NavLink from '@/components/common/NavLink';

export default function SiteHeader() {
  return (
    <>
      {/* Desktop header */}
      <header
        className="
          hidden md:flex
          fixed top-0 left-0 w-full z-40
          bg-[#040500]/90 backdrop-blur-sm
          flex-col items-center
          pt-6 pb-4
        "
      >
        {/* Menu */}
        <nav className="mt-4 text-sm uppercase tracking-widest">
          <ul className="flex gap-6">
            <NavLink label="Archives" href="/archives" />
            <NavLink label="Shop"     href="/shop"     />
            <NavLink label="About"    href="/about"    />
          </ul>
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <header
        className="
          md:hidden
          fixed bottom-0 left-0 w-full z-40
          bg-[#040500]/20 backdrop-blur-sm
          flex justify-center
          py-3
        "
      >
        <nav className="text-sm uppercase tracking-widest">
          <ul className="flex justify-around w-full px-4">
            <NavLink label="Archives" href="/archives" />
            <NavLink label="Shop"     href="/shop"     />
            <NavLink label="About"    href="/about"    />
          </ul>
        </nav>
      </header>
    </>
  );
}
