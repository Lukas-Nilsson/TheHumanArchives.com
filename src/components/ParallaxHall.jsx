// src/components/ParallaxHall.jsx
'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = (xRatio) => {
      // BACK layer
      const back = el.querySelector('[data-layer="back"]');
      back.style.transform = `translateZ(-200px) translateX(${xRatio * -90}px)`;

      // MID layers (5 stacked arches)
      const mid0 = el.querySelector('[data-layer="mid-0"]');
      const mid1 = el.querySelector('[data-layer="mid-1"]');
      const mid2 = el.querySelector('[data-layer="mid-2"]');
      const mid3 = el.querySelector('[data-layer="mid-3"]');
      const mid4 = el.querySelector('[data-layer="mid-4"]');
      const mid5 = el.querySelector('[data-layer="mid-5"]');

      mid0.style.transform = `translateZ(-200px) translateX(${xRatio * -20}px)`;
      mid1.style.transform = `translateZ(-50px) translateX(${xRatio * -100}px)`;
      mid2.style.transform = `translateZ(-100px) translateX(${xRatio * -80}px)`;
      mid3.style.transform = `translateZ(-150px) translateX(${xRatio * -60}px)`;
      mid4.style.transform = `translateZ(-200px) translateX(${xRatio * -40}px)`;
      mid5.style.transform = `translateZ(-250px) translateX(${xRatio * -20}px)`;

      // FRONT stays fixed (no transform)
    };

    const handlePointer = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      apply(x * 2 - 1); // only X axis
    };

    el.addEventListener('pointermove', handlePointer);
    el.addEventListener('pointerleave', () => apply(0));
    apply(0);

    return () => {
      el.removeEventListener('pointermove', handlePointer);
    };
  }, []);

  return (
    <div
  ref={ref}
  className="relative overflow-hidden perspective-800"
  style={{
    width: '100%',        // or '800px', '60vw', etc.
    height: '600px',       // adjust to shrink vertically
  }}
>

      {/* BACK layer */}
      <div className="scale-[0.6] -translate-y-0 absolute inset-0 z-[2]">
        <Image
          src="/artifact-wall.png"
          alt="Artifact"
          fill
          className="object-cover"
          data-layer="back"
          draggable={false}
        />
      </div>

      <div className="scale-[0.9] translate-y-3 absolute inset-0 z-[5]">
        <Image
          src="/hand-frame.png"
          alt="Mid Arch 0"
          fill
          className="object-cover"
          data-layer="mid-0"
          draggable={false}
        />
      </div>

      {/* MID layers (5 arches) */}
      <div className="scale-[0.75] -translate-y-3 absolute inset-0 z-[2]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 1"
          fill
          className="object-cover"
          data-layer="mid-1"
          draggable={false}
        />
      </div>

      <div className="scale-[0.85] -translate-y-4 absolute inset-0 z-[3]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 2"
          fill
          className="object-cover"
          data-layer="mid-2"
          draggable={false}
        />
      </div>

      <div className="scale-[1.05] -translate-y-6 absolute inset-0 z-[4]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 3"
          fill
          className="object-cover"
          data-layer="mid-3"
          draggable={false}
        />
      </div>

      <div className="scale-[1.3] -translate-y-8 absolute inset-0 z-[5]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 4"
          fill
          className="object-cover"
          data-layer="mid-4"
          draggable={false}
        />
      </div>

      <div className="scale-[1.5] -translate-y-10 absolute inset-0 z-[6]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 5"
          fill
          className="object-cover"
          data-layer="mid-5"
          draggable={false}
        />
      </div>

      {/* FRONT layer */}
      <div className="scale-[1.2] absolute inset-0 z-[7] pointer-events-none">
        <Image
          src="/arch-foreground.png"
          alt="Front Arch"
          fill
          className="object-cover"
          data-layer="front"
          draggable={false}
        />
      </div>

    </div>
  );
} 

// globals.css (ensure this is present)
// .perspective-800 {
//   perspective: 800px;
// }