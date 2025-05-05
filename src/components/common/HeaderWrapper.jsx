// src/components/common/HeaderWrapper.jsx
'use client';
import { usePathname } from 'next/navigation';
import SiteHeader from './SiteHeader';

export default function HeaderWrapper() {
  const pathname = usePathname();
  return <SiteHeader />; //pathname === '/' ? null : 
}
