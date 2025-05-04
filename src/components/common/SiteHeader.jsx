'use client';
import NavLink from '@/components/common/NavLink';

export default function SiteHeader() {
  return (
    <header className="
     fixed top-0 left-0 w-full z-40
        bg-[#040500]/90 backdrop-blur-sm      /* solid or translucent bar */
        flex flex-col items-center
        pt-6 pb-4     
    ">

      {/* Menu */}
      <nav className="mt-4 text-sm uppercase tracking-widest">
        <ul className="flex gap-6">
          <NavLink label="Archives" href="/archives" />
          <NavLink label="Shop"     href="/shop"     />
          <NavLink label="About"    href="/about"    />
        </ul>
      </nav>
    </header>
  );
}
