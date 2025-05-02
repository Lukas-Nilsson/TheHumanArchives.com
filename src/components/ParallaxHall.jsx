'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

export default function ParallaxHall({ width = '100%', height = '100%' }) {  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastScrollRatio = 0;
    let lastPointerRatio = 0;

    const apply = (scrollRatio = lastScrollRatio) => {
      lastScrollRatio = scrollRatio;

      // BACK layer
      const back = el.querySelector('[data-layer="back"]');
      if (back) {
        back.style.transform =
          `translateZ(-200px) translateX(${scrollRatio * -90 + (-lastPointerRatio) * 20}px)`;
      }

      // MID layers
      const layers = ['mid-0','mid-1','mid-2','mid-3','mid-4','mid-5'];
      const offsets = [-160, -100, -80, -60, -40, -20];
      const depths  = [-200,  -50, -100, -150, -200, -250];
      layers.forEach((layer, i) => {
        const node = el.querySelector(`[data-layer="${layer}"]`);
        if (node) {
          node.style.transform =
            `translateZ(${depths[i]}px) translateX(${scrollRatio * offsets[i] + (-lastPointerRatio) * 15}px)`;
        }
      });

      // FRONT layer
      const front = el.querySelector('[data-layer="front"]');
      if (front) {
        front.style.transform =
          `translateZ(0px) translateX(${scrollRatio * -20 + (-lastPointerRatio) * 20}px)`;
      }
    };

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const centerDiff = (rect.left + rect.width / 2) - (window.innerWidth / 2);
        const scrollRatio = centerDiff / (window.innerWidth / 2);
        apply(scrollRatio);
        ticking = false;
      });
    };

    const handleMouseMove = (e) => {
      lastPointerRatio = (e.clientX / window.innerWidth - 0.5) * 1;
      el.style.transform = `translateX(${-lastPointerRatio * 5}px)`;
      apply();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden perspective-800 will-change-transform backface-hidden"
      style={{
        width: `min(${width}, 100%)`, 
        minWidth: '300px',
        aspectRatio: '9/16',
        willChange: 'transform'
      }}
    >
      {/* BACK layer */}
      <div className="scale-[0.6] absolute inset-0 z-[2]">
        <Image
          src="/artifact-wall.png"
          alt="Artifact"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="back"
          draggable={false}
        />
      </div>

      {/* MID layer 0 */}
      <div className="scale-[0.3] translate-y-6 absolute inset-0 z-[2]">
        <Image
          src="/hand-frame.png"
          alt="Mid Arch 0"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="mid-0"
          draggable={false}
        />
      </div>

      {/* MID layers 1–5 */}
      <div className="scale-[0.5] -translate-y-3 absolute inset-0 z-[2]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 1"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="mid-1"
          draggable={false}
        />
      </div>
      <div className="scale-[0.7] -translate-y-4 absolute inset-0 z-[3]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 2"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="mid-2"
          draggable={false}
        />
      </div>
      <div className="scale-[0.9] -translate-y-6 absolute inset-0 z-[4]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 3"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="mid-3"
          draggable={false}
        />
      </div>
      <div className="scale-[1.1] -translate-y-8 absolute inset-0 z-[5]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 4"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="mid-4"
          draggable={false}
        />
      </div>
      <div className="scale-[1.3] -translate-y-10 absolute inset-0 z-[6]">
        <Image
          src="/arch-midground.png"
          alt="Mid Arch 5"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="mid-5"
          draggable={false}
        />
      </div>

      {/* FRONT layer */}
      <div className="scale-[1.3] absolute inset-0 z-[7] pointer-events-none">
        <Image
          src="/arch-foreground.png"
          alt="Front Arch"
          fill
          className="object-cover will-change-transform backface-hidden"
          data-layer="front"
          draggable={false}
        />
      </div>
    </div>
  );
}
