'use client';

import { forwardRef, useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
} from 'framer-motion';
import useHeaderHeight from '@/hooks/useHeaderHeight';
import useShiftX       from '@/hooks/useShiftX';
import ParallaxHall    from '@/components/gallery/ParallaxHall';

/* ------------------------------------------------------------------ */
/*  Layer definitions (unchanged)                                     */
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

const hallLayers = [
  columbusOnly,   // 0
  columbusOnly,   // 1
  originsFull,    // 2
  columbusOnly,   // 3
  columbusOnly,   // 4
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default forwardRef(function HeroHomepage({ onEnter = () => {} }, outerRef) {
  useHeaderHeight();

  /* Tunables */
  const HALL_OVERLAP = -40;   // px between halls
  const TITLE_RISE   = -900;  // px title floats by scroll-end

  /* State & refs */
  const [hideHall, setHideHall] = useState(false);

  /* Pointer tracking for subtle x-parallax */
  const pointerX = useMotionValue(0);
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover:none)').matches) return;
    const move = e => pointerX.set(e.clientX);
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [pointerX]);

  /* Whole-page scroll progress */
  const { scrollYProgress } = useScroll();
  const clamped = useTransform(scrollYProgress, v => Math.max(0, Math.min(1, v)));

  const hallScale   = useTransform(clamped, [0, 1], [1.5, 5]);
  const fadeOpacity = useTransform(clamped, [0.1, 0.7], [0, 1]);
  useMotionValueEvent(clamped, 'change', v => setHideHall(v > 0.8));

  const titleScale = useTransform(clamped, [0, 1], [1, 5 / 1.5]);
  const titleY     = useTransform(clamped, [0, 1], [0, TITLE_RISE]);
  const titleX     = useTransform(pointerX, x => {
    const w = typeof window === 'undefined' ? 1 : window.innerWidth;
    return ((x / w) * 2 - 1) * -20;
  });

  const shiftX = useShiftX({ maxShift: 40 });

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <section
        ref={outerRef}
        className="sticky top-0 w-full overflow-hidden bg-[#040500] text-white snap-start"
        style={{ height: '100dvh' }}
      >
        {/* Pointer-sway wrapper */}
        <motion.div
          ref={shiftX.ref}
          className="h-full w-full"
          style={{ transform: shiftX.transform }}
        >
          {/* Title */}
          <motion.div
            className="absolute left-1/2 z-30 select-none pointer-events-none
                       text-4xl leading-tight tracking-wide origin-bottom"
            style={{
              top: `
                calc(
                  var(--header-h,72px) +
                  env(safe-area-inset-top,0px) +
                  clamp(4vh, 7.5vh, 12vh)
                )
              `,
              x: titleX,
              y: titleY,
              scale: titleScale,
              translateX: '-50%',
            }}
          >
            THE<br />HUMAN<br />ARCHIVES
          </motion.div>

          {/* Parallax halls (pinned, grow from bottom) */}
          {!hideHall && (
            <motion.div
              onClick={onEnter}
              className="absolute bottom-0 inset-x-0 flex justify-center cursor-pointer origin-bottom"
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

                {/* seam masks */}
                {[1, 2, 3, 4].map(i => (
                  <span
                    key={i}
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

          {/* fade-to-black overlay */}
          <motion.div
            className="absolute inset-0 bg-[#040500] pointer-events-none"
            style={{ opacity: fadeOpacity }}
          />
        </motion.div>
      </section>

      {/* --- placeholder grid (unchanged) --- */}
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
});
