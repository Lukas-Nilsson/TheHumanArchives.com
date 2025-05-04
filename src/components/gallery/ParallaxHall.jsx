// src/components/ParallaxHall.jsx
'use client';
import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall({
  width   = '100%',
  yFactor = -0.03,
  layers = [
    { src: '/artifact-wall.png', depth: -2300, offset: -200 },
    { src: '/arch-midground.png', depth: -1100, offset: -130 },
    { src: '/arch-midground.png', depth:  -900, offset: -110 },
    { src: '/arch-midground.png', depth:  -700, offset:  -90 },
    { src: '/arch-midground.png', depth:  -500, offset:  -70 },
    { src: '/arch-midground.png', depth:  -300, offset:  -50 },
    { src: '/arch-midground.png', depth:  -100, offset:  -30 },
    { src: '/arch-foreground.png', depth:   250, offset:  -10 },
  ],
}) {
  const ref = useRef(null);

  /* ── parallax math (unchanged) ── */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const planes   = [...el.querySelectorAll('[data-depth]')];
    const depths   = planes.map(p => +p.dataset.depth);
    const offsets  = planes.map(p => +p.dataset.offset);

    let scrollRatio  = 0;
    let pointerRatio = 0;
    let raf = null;

    const apply = () => {
      planes.forEach((node, i) => {
        const tx = Math.round(pointerRatio * offsets[i] + scrollRatio * offsets[i]);
        const ty = Math.round(depths[i] * yFactor);

        node.style.transform =
          `translate3d(${tx}px, ${ty}px, ${depths[i]}px)`;
      });
      raf = null;
    };

    const schedule = () => raf ??= requestAnimationFrame(apply);

    const onPointer = e => {
      pointerRatio = -((e.clientX / innerWidth) * 2 - 1);
      schedule();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      scrollRatio = ((r.left + r.width / 2) - innerWidth / 2) / (innerWidth / 2);
      schedule();
    };

    addEventListener('pointermove', onPointer);
    addEventListener('scroll',  onScroll, { passive: true });
    addEventListener('resize',  onScroll);
    onScroll();             // initial paint

    return () => {
      removeEventListener('pointermove', onPointer);
      removeEventListener('scroll',  onScroll);
      removeEventListener('resize',  onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [yFactor, layers]);

  /* ── brightness helper (unchanged) ── */
  const maxDepth      = Math.max(...layers.map(l => Math.abs(l.depth)));
  const backMostDepth = Math.min(...layers.map(l => l.depth));

  return (
    <div
      ref={ref}
      className="relative overflow-hidden min-w-[350px] max-w-[600px] absolute bottom-0"
      style={{
        width,
        aspectRatio: '9/16',
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {layers.map(l => {
        const isBack  = l.depth === backMostDepth;
        const isFront = l.depth > 0;
        const dim     = !isBack && !isFront;

        const strength   = Math.abs(l.depth) / maxDepth;
        const brightness = dim ? (1 - strength * 1.6).toFixed(3) : '1';

        return (
          <div
            key={l.depth}
            data-depth={l.depth}
            data-offset={l.offset}
            /* will-change + tiny ease-out transition */
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
                       will-change-transform transition-transform duration-150 ease-out"
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
