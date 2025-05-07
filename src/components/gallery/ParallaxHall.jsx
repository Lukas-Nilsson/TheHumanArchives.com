// src/components/gallery/ParallaxHall.jsx
'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall({
  pointerX,
  scrollYProgress,
  width = '100%',
  yFactor = -0.02,
  layers = [
    { src: '/artifact-wall.png',      depth: -2300, offset: -200 },
    { src: '/arch-midground.png',     depth: -1100, offset: -130 },
    { src: '/arch-midground.png',     depth:  -900, offset: -110 },
    { src: '/arch-midground.png',     depth:  -700, offset:  -90 },
    { src: '/arch-midground.png',     depth:  -500, offset:  -70 },
    { src: '/arch-midground.png',     depth:  -300, offset:  -50 },
    { src: '/arch-midground.png',     depth:  -100, offset:  -30 },
    { src: '/arch-foreground.png',    depth:   250, offset:  -10 },
  ],
}) {
  const ref = useRef(null);
  const P   = 800;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // measure center once & on resize
    let centerX = 0;
    const halfW = -(window.innerWidth / 2);
    const measure = () => {
      const { left, width: w } = el.getBoundingClientRect();
      centerX = left + w / 2;
    };
    measure();
    window.addEventListener('resize', measure);

    // pointerX → --pr via RAF
    let rafX = null, xPos = window.innerWidth/2;
    const applyX = () => {
      // 🔄 recalc centre on every RAF so changes in scale are captured
      const { left, width } = el.getBoundingClientRect();
      centerX = left + width / 2;
  
      const pr = (xPos - centerX) / halfW;
      el.style.setProperty('--pr', pr);
      rafX = null;
    };
    const unsubX = pointerX.onChange(v => {
      xPos = v;
      if (!rafX) rafX = requestAnimationFrame(applyX);
    });
    applyX();

    // scrollYProgress → --scrollEase via RAF
    let rafS = null;
    const applyS = v => {
      const clamped = Math.max(0, Math.min(v, 1)); // never below 0 or above 1
      const eased   = Math.sqrt(clamped / 1.2);
      el.style.setProperty('--scrollEase', eased);
      applyX();
      rafS = null;
    };
    const unsubS = scrollYProgress.onChange(v => {
      if (!rafS) rafS = requestAnimationFrame(() => applyS(v));
    });
    el.style.setProperty('--scrollEase', 0);

    return () => {
      window.removeEventListener('resize', measure);
      unsubX(); unsubS();
      if (rafX) cancelAnimationFrame(rafX);
      if (rafS) cancelAnimationFrame(rafS);
    };
  }, [pointerX, scrollYProgress]);

  const maxDepth  = Math.max(...layers.map(l => Math.abs(l.depth)));
  const backDepth = Math.min(...layers.map(l => l.depth));

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-w-[350px] max-w-[600px] absolute bottom-0 will-change-transform"
      style={{
        width,
        aspectRatio:    '9/16',
        transformStyle: 'preserve-3d',
        '--pr':         0,
        '--scrollEase': 0,
      }}
    >
      {layers.map(l => {
        const isWall   = l.src.includes('artifact-wall');
        const rawScale = P / (P - l.depth);
        const baseScale = isWall
          ? Math.max(rawScale, 0.2)
          : rawScale;
        const strength  = l.depth > 0
          ? 0
          : Math.abs(l.depth) / maxDepth;
        let ty = l.depth * yFactor;
        if (isWall) ty *= 0.5;
        const brightness = l.depth === backDepth
          ? 1
          : 1 - (Math.abs(l.depth) / maxDepth) * 1.6;

        // adjust deeper layers' X-translation intensity
        // use 0.5 so artifact-wall (strength=1) still moves at 50% of offset
        const moveFactor = `calc(1 - var(--strength) * 0.5)`;

        return (
          <div
            key={l.depth}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full will-change-transform"
            style={{
              '--base-scale': baseScale,
              '--strength':   strength,
              transform: `
                translate3d(
                  calc(var(--pr) * ${l.offset}px * ${moveFactor}),
                  ${ty}px,
                  ${l.depth + 0.1}px
                )
                scale(calc(
                  var(--base-scale)
                  * (1 - var(--scrollEase) * var(--strength))
                ))
              `,
              filter: `brightness(${brightness})`,
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
