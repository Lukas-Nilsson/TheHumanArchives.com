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
import useShiftX from '@/hooks/useShiftX.js';
import ParallaxHall from '@/components/gallery/ParallaxHall';
import GhostButton from '@/components/common/GhostButton';

export default function HeroHomepage() {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const enterRef   = useRef(null);
  const [hideHall, setHideHall] = useState(false);

  // 1. Desktop-only pointer-ratio MotionValue
  const pointerRatio = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;

    const onPointer = (e) => {
      let r = (e.clientX / window.innerWidth) * 2 - 1;
      r = Math.max(-1, Math.min(1, r));
      pointerRatio.set(-r);
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => window.removeEventListener('pointermove', onPointer);
  }, [pointerRatio]);

  // 2. scroll-driven scale/slide/fade stays the same
  const shiftX = useShiftX({ maxShift: 40 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const hallScale   = useTransform(scrollYProgress, [0, 1], [1, 3]);
  const hallY       = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const fadeOpacity = useTransform(scrollYProgress, [0.5, 0.75], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setHideHall(v > 0.75);
  });

  // 3. Title & ENTER parallax (unchanged)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    const handleMove = (e) => {
      const r = (e.clientX / window.innerWidth) * 2 - 1;
      titleRef.current?.style.setProperty('transform', `translateX(${r * -20}px)`);
      enterRef.current?.style.setProperty('transform', `translateX(${r * -10}px)`);
    };
    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <motion.section
        ref={sectionRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#040500] text-white"
        style={{ transform: shiftX, transition: 'transform .15s ease-out' }}
      >
        {/* TITLE */}
        <div
          ref={titleRef}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none select-none"
          style={{ transform: 'translateX(0)' }}
        >
          <div className="text-2xl leading-tight tracking-wide">
            THE<br />HUMAN<br />ARCHIVES
          </div>
        </div>

        {/* ENTER BUTTON */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div ref={enterRef} className="flex flex-col items-center">
            <div className="text-sm opacity-60 mb-1">▲</div>
            <GhostButton as="div" className="text-lg px-10 py-3">
              ENTER
            </GhostButton>
          </div>
        </div>

        {/* STATIC PERSPECTIVE WRAPPER */}
        {!hideHall && (
          <div
            className="absolute bottom-0 inset-x-0 flex justify-center gap-0"
            style={{
              perspective:       800,
              perspectiveOrigin: '50% 100%',
              transformStyle:    'preserve-3d',
            }}
          >
            {/* ANIMATED INNER */}
            <motion.div
              className="flex justify-center gap-0"
              style={{
                scale:          hallScale,
                y:              hallY,
                transformStyle: 'preserve-3d',
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <ParallaxHall
                  key={i}
                  pointerRatio={pointerRatio}
                />
              ))}
            </motion.div>
          </div>
        )}

        {/* FADE TO BLACK */}
        <motion.div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: fadeOpacity }}
        />
      </motion.section>

      {/* ARTIFACTS SECTION */}
      <section className="bg-black text-white py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-neutral-800 flex items-center justify-center text-sm"
            >
              Artifact {i + 1}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
