'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall({
  pointerX,
  scrollYProgress,
  width = '100%',
  yFactor = -0.02,
  layers = [
    { src: '/artifact-wall.png',  depth: -6,  offset: -200 },
    { src: '/arch-midground.png', depth: -5,  offset: -130 },
    { src: '/arch-midground.png', depth: -4,  offset: -110 },
    { src: '/arch-midground.png', depth: -3,  offset:  -90 },
    { src: '/arch-midground.png', depth: -2,  offset:  -70 },
    { src: '/arch-midground.png', depth: -1,  offset:  -50 },
    { src: '/arch-midground.png', depth:  0,  offset:  -30 },
    { src: '/arch-foreground.png',depth:  1,  offset:  -10 },
  ],
}) {
  const ref = useRef(null);
  const P   = 800;

  /* ───────────────── pointer + scroll → CSS vars ───────────────── */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // X-parallax
    let rafX = null, xPos = window.innerWidth / 2, centerX = 0;
    const halfW = -(window.innerWidth / 2);
    const measure = () => {
      const { left, width } = el.getBoundingClientRect();
      centerX = left + width / 2;
    };
    measure();
    window.addEventListener('resize', measure);

    const applyX = () => {
      el.style.setProperty('--pr', (xPos - centerX) / halfW);
      rafX = null;
    };
    const unX = pointerX.onChange(v => {
      xPos = v;
      if (!rafX) rafX = requestAnimationFrame(applyX);
    });
    applyX();

    // scroll ease 0-1 → sqrt easing
    let rafS = null;
    const applyS = v => {
      const eased = Math.sqrt(Math.max(0, Math.min(v, 1)) / 1.2);
      el.style.setProperty('--scrollEase', eased);
      rafS = null;
    };
    const unS = scrollYProgress.onChange(v => {
      if (!rafS) rafS = requestAnimationFrame(() => applyS(v));
    });
    el.style.setProperty('--scrollEase', 0);

    return () => {
      window.removeEventListener('resize', measure);
      unX(); unS();
      if (rafX) cancelAnimationFrame(rafX);
      if (rafS) cancelAnimationFrame(rafS);
    };
  }, [pointerX, scrollYProgress]);

  /* ───────────────── render ───────────────── */
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
        // map depth → strength 0-1 (far = 1)
        const strength = Math.abs(l.depth) / maxDepth;

        /* fake Z-parallax with Y-shift + scale */
        const baseScale = P / (P - l.depth * 120);       // tweak 120 for spread
        const ty        = l.depth * yFactor * 120;       // same factor for Y

        const moveFactor = `calc(1 - ${strength} * 0.5)`; // deeper → slower X

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
