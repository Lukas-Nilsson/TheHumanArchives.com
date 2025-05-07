'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall({
  pointerX,
  scrollYProgress,
  width = '100%',
  yFactor = 0,
  layers = [
    { src: '/artifact-wall.png',  depth: -6, offset: -200 },
    { src: '/arch-midground.png', depth: -5, offset: -130 },
    { src: '/arch-midground.png', depth: -4, offset: -110 },
    { src: '/arch-midground.png', depth: -3, offset:  -90 },
    { src: '/arch-midground.png', depth: -2, offset:  -70 },
    { src: '/arch-midground.png', depth: -1, offset:  -50 },
    { src: '/arch-midground.png', depth:  0, offset:  -30 },
    { src: '/arch-foreground.png',depth:  1, offset:  -10 },
  ],
}) {
  const ref = useRef(null);

  /* ─────────── Tunables ─────────── */
  const DEPTH_SPREAD = 100;   // spacing between layer sizes
  const BASE_P       = 600;   // base scale divisor
  const FRONT_BOOST  = 0.45;  // extra pop for positive-depth layer(s)

  /* ───────── pointer & scroll → CSS vars ───────── */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* track hall centre on every frame so scaling never drifts */
    const halfW = -(window.innerWidth / 2);  // invert X-parallax
    let xPos = window.innerWidth / 2;

    const measureCenter = () => {
      const { left, width } = el.getBoundingClientRect();
      return left + width / 2;
    };

    /* pointer-ratio updater */
    let rafX = null;
    const applyX = () => {
      const centerX = measureCenter();            // <- re-measure!
      el.style.setProperty('--pr', (xPos - centerX) / halfW);
      rafX = null;
    };
    const unX = pointerX.onChange(v => {
      xPos = v;
      if (!rafX) rafX = requestAnimationFrame(applyX);
    });
    applyX();

    /* eased scroll progress 0-1 */
    let rafS = null;
    const applyS = v => {
      const eased = Math.sqrt(Math.max(0, Math.min(v, 1)) / 1.2);
      el.style.setProperty('--scrollEase', eased);

      applyX();              // 👈 NEW—re-run X-ratio after scaling changes
      rafS = null;
    };
    const unS = scrollYProgress.onChange(v => {
      if (!rafS) rafS = requestAnimationFrame(() => applyS(v));
    });
    el.style.setProperty('--scrollEase', 0);

    /* cleanup */
    return () => {
      unX();
      unS();
      if (rafX) cancelAnimationFrame(rafX);
      if (rafS) cancelAnimationFrame(rafS);
    };
  }, [pointerX, scrollYProgress]);

  /* ───────── render ───────── */
  const maxDepth = Math.max(...layers.map(l => Math.abs(l.depth)));

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-w-[350px] max-w-[600px] absolute bottom-0"
      style={{
        width,
        aspectRatio: '9/16',
        '--pr': 0,
        '--scrollEase': 0,
      }}
    >
      {layers.map(l => {
        const strength = Math.abs(l.depth) / maxDepth;

        /* fake-3D: translateY + scale */
        const baseScale =
          l.depth > 0
            ? 1 + l.depth * FRONT_BOOST
            : BASE_P / (BASE_P - l.depth * DEPTH_SPREAD);

        const ty = l.depth * yFactor * DEPTH_SPREAD;
        const moveFactor = `calc(1 - ${strength} * 0.5)`;

        return (
          <div
            key={l.depth}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full will-change-transform"
            style={{
              transform: `
                translateX(calc(var(--pr) * ${l.offset}px * ${moveFactor}))
                translateY(${ty}px)
                scale(calc(${baseScale} * (1 - var(--scrollEase) * ${strength})))
              `,
              backfaceVisibility: 'hidden',
              transformOrigin: '50% 50%',
            }}
          >
            <Image
              src={l.src}
              alt=""
              fill
              draggable={false}
              className="object-cover"
              priority={l.depth > 0}
              sizes="(max-width: 640px) 100vw, 600px"
            />
          </div>
        );
      })}
    </div>
  );
}
