// src/components/hero/HeroHomepage.jsx

'use client';

import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';
import useShiftX from '@/hooks/useShiftX';
import ParallaxHall from '@/components/gallery/ParallaxHall';
import GhostButton from '@/components/common/GhostButton';

const columbusOnly = [
  { src: '/arch-foreground-columbus.png', depth: 0, offset: -30 },
];

const originsFull = [
  { src: '/artifact-wall.png',  depth: -6, offset: -200 },
  { src: '/arch-midground.png', depth: -5, offset: -130 },
  { src: '/arch-midground.png', depth: -4, offset: -110 },
  { src: '/arch-midground.png', depth: -3, offset:  -90 },
  { src: '/arch-midground.png', depth: -2, offset:  -70 },
  { src: '/arch-midground.png', depth: -1, offset:  -50 },
  { src: '/arch-foreground-origins-2.png', depth: 0, offset: -30 },
];

// 2️⃣  One array = one hall’s layer stack
const hallLayers = [
  columbusOnly,   // 0
  columbusOnly,   // 1
  originsFull,    // 2  ← middle hall
  columbusOnly,   // 3
  columbusOnly,   // 4
];

export default function HeroHomepage({ onEnter = () => {} }) {
  // —— tunables (add near the top) —————————————————————————
  const HALL_OVERLAP = -40;  
  
  /* ── refs & state ── */
  const titleRef = useRef(null);
  const enterRef = useRef(null);
  const [hideHall, setHideHall] = useState(false);

  /* ── pointer-X ── */
  const pointerX = useMotionValue(0);
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    const fn = e => pointerX.set(e.clientX);
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, [pointerX]);

  /* ── scroll-derived values ── */
  const shiftX = useShiftX({ maxShift: 40 });
  const { scrollYProgress } = useScroll();
  const clamped = useTransform(scrollYProgress, v => Math.max(0, Math.min(1, v)));

  const hallScale   = useTransform(clamped, [0, 1], [1.5, 5]); // gentler zoom
  const fadeOpacity = useTransform(clamped, [0.1, 0.7], [0, 1]);
  useMotionValueEvent(clamped, 'change', v => setHideHall(v > 0.8));

  /* ── micro-parallax text ── */
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    const fn = e => {
      const r = (e.clientX / window.innerWidth) * 2 - 1;
      titleRef.current?.style.setProperty('transform', `translateX(${r * -20}px)`);
      enterRef.current?.style.setProperty('transform', `translateX(${r * -10}px)`);
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  /* ── render ── */
  return (
    <>
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#040500] text-white">
        <motion.div ref={shiftX.ref} className="h-full w-full" style={{ transform: shiftX.transform }}>
          {/* Title */}
          <div
            ref={titleRef}
            className="absolute top-40 left-1/2 -translate-x-1/2 z-30 select-none pointer-events-none text-2xl leading-tight tracking-wide"
          >
            THE<br />HUMAN<br />ARCHIVES
          </div>

          {/* Enter button */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
            <div ref={enterRef} className="flex flex-col items-center cursor-pointer">
              <GhostButton as="button" onClick={onEnter} className="text-lg px-10 py-40">
                ENTER
              </GhostButton>
            </div>
          </div>

          {/* ───── Parallax halls ───── */}
          {!hideHall && (
            <motion.div
              onClick={onEnter}
              className="absolute bottom-0 inset-x-0 flex justify-center cursor-pointer"
              style={{ scale: hallScale, willChange: 'transform' }}
            >
              {/*  strip wrapper must be relative so mask <span>s align */}
              <div className="relative flex">
                {/* halls */}
                {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={i ? { marginLeft: `${HALL_OVERLAP}px` } : undefined}>
                  <ParallaxHall
                    pointerX={pointerX}
                    scrollYProgress={scrollYProgress}
                    layers={hallLayers[i]}   // 👈 NEW – per-hall override
                  />
                </div>
              ))}

                {/* seam-mask bars */}
                {[1, 2, 3, 4].map(i => (
                  <span
                    key={`mask-${i}`}
                    className="pointer-events-none absolute inset-y-0 w-4"
                    style={{
                      left: `calc(${i} * 100% - 1px)`,   // centres each 4-px bar
                      background: '#040500',            // match page bg colour
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* fade to bg */}
        <motion.div
          className="absolute inset-0 bg-[#040500] pointer-events-none"
          style={{ opacity: fadeOpacity }}
        />
      </section>

      {/* placeholder grid */}
      <section className="bg-[#040500] text-white py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[#040500] flex items-center justify-center text-sm">
              Artifact {i + 1}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
