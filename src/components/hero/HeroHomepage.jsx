'use client';
import { useRef, useEffect } from 'react';
import ParallaxHall from '@/components/gallery/ParallaxHall';
import GhostButton  from '@/components/common/GhostButton';

export default function HeroHomepage() {
  const enterRef = useRef(null);
  const titleRef = useRef(null);

  /* ────────── pointer-parallax ────────── */
  useEffect(() => {
    const enterEl = enterRef.current;
    const titleEl = titleRef.current;
    if (!enterEl || !titleEl) return;

    const handleMove = e => {
      const ratio = (e.clientX / window.innerWidth) * 2 - 1; // −1 ←→ 1

      /* ENTER button (small slide) */
      const txBtn = ratio * -10;
      enterEl.style.transform = `
        translateZ(200px)
        translateX(${txBtn}px)
        rotateY(${txBtn}deg)
        rotateX(60deg)
        scaleX(0.85)
      `;

      /* TITLE: depth + slide + platter-spin (rotateY) */
      const txTitle = ratio * -20;      // horizontal slide
      const ryTitle = ratio * 0;       // lazy-Susan spin ± 8°
      titleEl.style.transform = `
        translateZ(300px)
        translateX(${txTitle}px)
        rotateY(${ryTitle}deg)
      `;
    };

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  /* ────────── render ────────── */
  return (
    <section className="relative h-screen w-full bg-[#040500] text-white overflow-hidden">
      {/* TITLE (platter spin) */}
      <div
        ref={titleRef}
        className="absolute top-25 left-1/2 -translate-x-1/2 z-30 text-center transform-gpu transition-transform duration-150 ease-out"
        style={{ transform: 'translateZ(100px)' }}  /* initial depth */
      >
        <div className="text-2xl font-snas leading-tight tracking-wide">
          THE<br />HUMAN<br />ARCHIVES
        </div>
      </div>

      {/* ENTER overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 perspective-[600px]">
        <div
          ref={enterRef}
          className="flex flex-col items-center transform-style-3d transition-transform duration-0 group px-6 py-4 cursor-pointer"
        >
          <div className="text-sm mb-1 opacity-60 group-hover:text-neutral-900 transition-colors">
            ▲
          </div>
          <GhostButton as="div" className="text-lg px-10 py-3 drop-shadow-lg">
            ENTER
          </GhostButton>
        </div>
      </div>

      {/* PARALLAX HALLS */}
      <div className="absolute bottom-0 inset-x-0 flex justify-center gap-0 z-0">
        <ParallaxHall />
        <ParallaxHall />
        {/* custom hall */}
        <ParallaxHall
          layers={[
            { src: '/artifact-wall.png', depth: -2300, offset: -200 },
            { src: '/arch-midground.png', depth: -1100, offset: -130 },
            { src: '/arch-midground.png', depth:  -900, offset: -110 },
            { src: '/arch-midground.png', depth:  -700, offset: -90  },
            { src: '/arch-midground.png', depth:  -500, offset: -70  },
            { src: '/arch-midground.png', depth:  -300, offset: -50  },
            { src: '/arch-midground.png', depth:  -100, offset: -30  },
            { src: '/arch-foreground-origins-2.png', depth: 250, offset: -10 },
          ]}
        />
        <ParallaxHall />
        <ParallaxHall />
      </div>
    </section>
  );
}
