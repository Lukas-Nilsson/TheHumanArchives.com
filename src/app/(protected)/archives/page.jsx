'use client';
import HeroHomepage from '@/components/hero/HeroHomepage';

export default function LandingPage() {
  return (
    <>
      <HeroHomepage />

      {/* ↓  just a tall spacer while you build the real Artifacts grid */}
      <div style={{ height: '300vh', background: '#111' }} />
    </>
  );
}
