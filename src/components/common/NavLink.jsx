'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function NavLink({ label, href }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`
          inline-block px-3 py-2
          text-base tracking-widest uppercase
          transition duration-150
          min-h-[44px]
          ${isActive
            ? 'text-white border-b border-white'
            : 'text-neutral-500 hover:text-white'}
        `}
      >
        {label}
      </Link>
    </li>
  );
}
