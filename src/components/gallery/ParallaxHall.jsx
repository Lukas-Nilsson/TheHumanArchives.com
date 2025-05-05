// src/components/gallery/ParallaxHall.jsx
'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall({
  width       = '100%',
  yFactor     = -0.03,
  pointerRatio,
  layers      = [
    { src: '/artifact-wall.png',             depth: -2300, offset: -200 },
    { src: '/arch-midground.png',            depth: -1100, offset: -130 },
    { src: '/arch-midground.png',            depth:  -900, offset: -110 },
    { src: '/arch-midground.png',            depth:  -700, offset:  -90 },
    { src: '/arch-midground.png',            depth:  -500, offset:  -70 },
    { src: '/arch-midground.png',            depth:  -300, offset:  -50 },
    { src: '/arch-midground.png',            depth:  -100, offset:  -30 },
    { src: '/arch-foreground-origins-2.png',  depth:   250, offset:  -10 },
  ],
}) {
  const ref = useRef(null);
  const PERSPECTIVE = 800;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const planes  = Array.from(el.querySelectorAll('[data-depth]'));
    const depths  = planes.map(p => +p.dataset.depth);
    const offsets = planes.map(p => +p.dataset.offset);
    let rafId     = null;

    function apply() {
      const pr = pointerRatio.get();
      planes.forEach((node, i) => {
        const z  = depths[i];
        const tx = pr * offsets[i];
        const ty = z * yFactor;
        const sc = PERSPECTIVE / (PERSPECTIVE - z);
        node.style.transform = `translate3d(${tx}px, ${ty}px, ${z}px) scale(${sc})`;
      });
      rafId = null;
    }

    function schedule() {
      if (rafId === null) rafId = requestAnimationFrame(apply);
    }

    // run once at mount
    schedule();

    // subscribe to pointerRatio changes
    const unsubscribe = pointerRatio.onChange(schedule);

    return () => {
      unsubscribe();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pointerRatio, yFactor, layers]);

  const maxDepth      = Math.max(...layers.map(l => Math.abs(l.depth)));
  const backMostDepth = Math.min(...layers.map(l => l.depth));

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-w-[350px] max-w-[600px] absolute bottom-0"
      style={{
        width,
        aspectRatio:    '9/16',
        transformStyle: 'preserve-3d',
      }}
    >
      {layers.map((l) => {
        const isBack     = l.depth === backMostDepth;
        const isFront    = l.depth > 0;
        const dim        = !isBack && !isFront;
        const strength   = Math.abs(l.depth) / maxDepth;
        const brightness = dim ? 1 - strength * 1.6 : 1;

        return (
          <div
            key={l.depth}
            data-depth={l.depth}
            data-offset={l.offset}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full will-change-transform"
          >
            <Image
              src={l.src}
              alt=""
              fill
              draggable={false}
              className="object-cover"
              priority={isFront}
              style={{ filter: `brightness(${brightness})` }}
            />
          </div>
        );
      })}
    </div>
  );
}
