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
import useShiftX     from '@/hooks/useShiftX';
import ParallaxHall  from '@/components/gallery/ParallaxHall';
import GhostButton   from '@/components/common/GhostButton';

/* ------------------------------------------------------------------ */
/*  Layer definitions                                                 */
/* ------------------------------------------------------------------ */

const columbusOnly = [
  { src: '/arch-foreground-columbus.png', depth: 0, offset: -30 },
];

const originsFull = [
  { src: '/artifact-wall.png',  depth: -6, offset: -160 },
  { src: '/arch-midground.png', depth: -5, offset: -130 },
  { src: '/arch-midground.png', depth: -4, offset: -110 },
  { src: '/arch-midground.png', depth: -3, offset:  -90 },
  { src: '/arch-midground.png', depth: -2, offset:  -70 },
  { src: '/arch-midground.png', depth: -1, offset:  -50 },
  { src: '/arch-foreground-origins-2.png', depth: 0, offset: -30 },
];

/* 0–4 → the five halls rendered side-by-side */
const hallLayers = [
  columbusOnly,   // 0
  columbusOnly,   // 1
  originsFull,    // 2  ← middle hall
  columbusOnly,   // 3
  columbusOnly,   // 4
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function HeroHomepage({ onEnter = () => {} }) {
  /* ───────────────── Tunables ───────────────── */
  const HALL_OVERLAP = -40;           // negative margin between halls
  const TITLE_RISE   = -900;          // px the title floats up by scroll-end

  /* ───────────────── State & refs ───────────────── */
  const [hideHall, setHideHall] = useState(false);
  const enterRef = useRef(null);

  /* ───────────────── Mouse X tracking ───────────────── */
  const pointerX = useMotionValue(0);
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    const move = e => pointerX.set(e.clientX);
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [pointerX]);

  /* ───────────────── Scroll-derived transforms ───────────────── */
  const shiftX = useShiftX({ maxShift: 40 });               // subtle hall sway
  const { scrollYProgress } = useScroll();                  // whole page – still fine
  const clamped = useTransform(scrollYProgress, v => Math.max(0, Math.min(1, v)));

  const hallScale   = useTransform(clamped, [0, 1], [1.5, 5]);
  const fadeOpacity = useTransform(clamped, [0.1, 0.7], [0, 1]);
  useMotionValueEvent(clamped, 'change', v => setHideHall(v > 0.8));

  /* ─────────── Title motion (matches front hall) ─────────── */
  const titleScale = useTransform(clamped, [0, 1], [1, 5 / 1.5]);  // ≈ 1 → 3.33
  const titleY     = useTransform(clamped, [0, 1], [0, TITLE_RISE]);
  const titleX     = useTransform(pointerX, x =>
    ((x / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 2 - 1) * -20
  );

  /* ─────────── Micro-parallax for ENTER button ─────────── */
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return;
    const fn = e => {
      const r = (e.clientX / window.innerWidth) * 2 - 1;
      enterRef.current?.style.setProperty('transform', `translateX(${r * -10}px)`);
    };
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  /* ───────────────── Render ───────────────── */
  return (
    <>
      <section className="sticky top-0 h-screen w-full overflow-hidden bg-[#040500] text-white">
        <motion.div ref={shiftX.ref} className="h-full w-full" style={{ transform: shiftX.transform }}>
          {/* ───── Title ───── */}
          <motion.div
            className="absolute top-24 left-1/2 z-30 select-none pointer-events-none
                       text-4xl leading-tight tracking-wide origin-bottom"
            style={{ x: titleX, y: titleY, scale: titleScale, translateX: '-50%' }}
          >
            THE<br />HUMAN<br />ARCHIVES
          </motion.div>

          {/* ───── ENTER button (optional) ───── */}
          {/* <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30">
            <div ref={enterRef} className="flex flex-col items-center cursor-pointer">
              <GhostButton as="button" onClick={onEnter} className="text-lg px-10 py-4">
                ENTER
              </GhostButton>
            </div>
          </div> */}

          {/* ───── Parallax halls ───── */}
          {!hideHall && (
            <motion.div
              onClick={onEnter}
              className="absolute bottom-0 inset-x-0 flex justify-center cursor-pointer"
              style={{ scale: hallScale, willChange: 'transform' }}
            >
              <div className="relative flex">
                {hallLayers.map((layers, i) => (
                  <div key={i} style={i ? { marginLeft: `${HALL_OVERLAP}px` } : undefined}>
                    <ParallaxHall
                      pointerX={pointerX}
                      scrollYProgress={scrollYProgress}
                      layers={layers}
                    />
                  </div>
                ))}

                {/* seam-mask bars */}
                {[1, 2, 3, 4].map(i => (
                  <span
                    key={`mask-${i}`}
                    className="pointer-events-none absolute inset-y-0 w-4"
                    style={{
                      left: `calc(${i} * 100% - 1px)`,
                      background: '#040500',
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

      {/* placeholder grid (demo content) */}
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
