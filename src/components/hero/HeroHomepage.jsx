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

export default function HeroHomepage({ onEnter = () => {} }) {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const enterRef   = useRef(null);
  const [hideHall, setHideHall] = useState(false);
  const layersForHall2 = [
    { src: '/artifact-wall.png',      depth: -2300, offset: -200 },
    { src: '/arch-midground.png',     depth: -1100, offset: -130 },
    { src: '/arch-midground.png',     depth:  -900, offset: -110 },
    { src: '/arch-midground.png',     depth:  -700, offset:  -90 },
    { src: '/arch-midground.png',     depth:  -500, offset:  -70 },
    { src: '/arch-midground.png',     depth:  -300, offset:  -50 },
    { src: '/arch-midground.png',     depth:  -100, offset:  -30 },
    { src: '/arch-foreground-origins-2.png',    depth:   250, offset:  -10 },
  ];
  

  // 1️⃣ Global pointerX
  const pointerX = useMotionValue(0);
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches)
      return;
    const onMouse = e => pointerX.set(e.clientX);
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => window.removeEventListener('mousemove', onMouse);
  }, [pointerX]);

  // 1️⃣  hard-clamp the raw progress
  const shiftX        = useShiftX({ maxShift: 40 });
  const { scrollYProgress } = useScroll();
  const clamped = useTransform(scrollYProgress, v =>
    Math.max(0, Math.min(1, v))
  );

  // 2️⃣  derive everything from the clamped value
  const hallScale  = useTransform(clamped, [0, 0.5], [1, 2.6]);
  const hallZ      = useTransform(clamped, [0, 0.5], ['-300px', '0px']);
  const fadeOpacity = useTransform(clamped, [0.1, 0.5], [0, 1]);
  const perspectiveOrigin = useTransform(
    clamped,
    [0, 0.5],
    ['50% 100%', '50% 50%']
  );
  useMotionValueEvent(clamped, 'change', v => setHideHall(v > 0.9));

  // 3️⃣ Title & ENTER micro-parallax
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches)
      return;
    const onPointer = e => {
      const r = (e.clientX / window.innerWidth) * 2 - 1;
      titleRef.current?.style.setProperty('transform', `translateX(${r * -20}px)`);
      enterRef.current?.style.setProperty('transform', `translateX(${r * -10}px)`);
    };
    window.addEventListener('mousemove', onPointer, { passive: true });
    return () => window.removeEventListener('mousemove', onPointer);
  }, []);

  return (
    <>
      {/* Sticky container */}
      <section
        ref={sectionRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#ff00ff] text-white"
      >
        {/* 2.A Horizontal shift only on this block */}
        <motion.div
          ref={shiftX.ref}
          className="h-full w-full"
          style={{
            transform: shiftX.transform,
            transition: 'transform 0.0s snappy',
          }}
        >
          {/* TITLE */}
          <div
            ref={titleRef}
            className="absolute top-40 left-1/2 -translate-x-1/2 z-30 text-left select-none pointer-events-none"
          >
            <div className="text-2xl leading-tight tracking-wide">
              THE<br />HUMAN<br />ARCHIVES
            </div>
          </div>

          {/* ENTER BUTTON */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30">
            <div ref={enterRef} className="flex flex-col items-center">
              <div className="text-sm opacity-60 mb-1">▲</div>
              <GhostButton
                as="button"                 // button not div
                onClick={onEnter}           // ⬅️ smooth-scroll
                className="text-lg px-10 py-3"
              >
                ENTER
              </GhostButton>
            </div>
          </div>

          {/* PERSPECTIVE & PARALLAX HALLS */}
          {!hideHall && (
            <motion.div
              onClick={onEnter}
              className="absolute bottom-0 inset-x-0 flex justify-center cursor-pointer"
              style={{
                perspective: 800,
                perspectiveOrigin,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity', // promote & keep on GPU
                backfaceVisibility: 'hidden',     // iOS/Safari flash fix
                transform: 'translateZ(0)'                 // isolate repaints (Blink)
              }}
            >
              {/* fade overlay moved *inside* the promoted layer */}
              {/* <motion.div
                className="absolute inset-0 bg-[#040500] pointer-events-none"
                style={{ opacity: fadeOpacity }}
              /> */}

              <motion.div
                className="flex justify-center -space-x-px"
                style={{
                  scale: hallScale,
                  z:     hallZ,
                  transformStyle:  'preserve-3d',
                  transformOrigin: '50% 50%',
                }}
              >
                <ParallaxHall key={0} pointerX={pointerX} scrollYProgress={scrollYProgress} />
                <ParallaxHall key={1} pointerX={pointerX} scrollYProgress={scrollYProgress} />
                <ParallaxHall key={2} pointerX={pointerX} scrollYProgress={scrollYProgress} layers={layersForHall2} />
                <ParallaxHall key={3} pointerX={pointerX} scrollYProgress={scrollYProgress} />
                <ParallaxHall key={4} pointerX={pointerX} scrollYProgress={scrollYProgress} />
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* 2.B FADE TO BGCOLOR (now outside the shifting div) */}
        <motion.div
          className="absolute inset-0 bg-[#040500] pointer-events-none"
          style={{
            opacity: fadeOpacity, 
            willChange: 'opacity',
           }}
        />
      </section>

      {/* ARTIFACTS GRID */}
      <section className="bg-[#040500] text-white py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 px-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-[#040500] flex items-center justify-center text-sm"
            >
              Artifact {i + 1}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
