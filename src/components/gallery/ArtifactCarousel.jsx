// src/components/gallery/ArtifactCarousel.jsx
'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const artifacts = [
  { src: '/artifacts/cmb.png',                  alt: 'Cosmic Microwave Background (WMAP full-sky map)' },
  { src: '/artifacts/creation-of-adam.png',     alt: 'Michelangelo – The Creation of Adam (1512)' },
  { src: '/artifacts/i-think.png',              alt: '“I think” – Darwin notebook, 1837' },
  { src: '/artifacts/yin-yang.png',             alt: 'Taijitu (Yin-Yang symbol)' },
  { src: '/artifacts/imago-mundi.png',          alt: 'Imago Mundi – Babylonian World Map (c. 600 BCE)' },
  { src: '/artifacts/cueva-de-las-manos.png',   alt: 'Cueva de las Manos hand stencils (c. 7300 BCE)' },
  { src: '/artifacts/archaeopteryx-fossil.png', alt: 'Archaeopteryx lithographica fossil' },
  { src: '/artifacts/cogito-ergo-sum.png',      alt: '“Cogito, ergo sum” – Descartes, 1637' },
  { src: '/artifacts/lomekwi-3.png',            alt: 'Lomekwi 3 stone tools (3.3 Myr BP)' },
];

const Glow = ({ delay = 0 }) => (
  <motion.div
    // Animate the intensity & diameter on a slow loop
    initial   = {{ opacity: 0.25, scale: 0.8 }}
    animate   = {{ opacity: [0.25, 0.5, 0.25], scale: [0.8, 1.1, 0.8] }}
    transition={{
      duration: 6,
      repeat:   Infinity,
      ease:     'easeInOut',
      delay,
    }}
    className="absolute inset-0 pointer-events-none z-10"
    style={{
      background:
        'radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.25) 40%, transparent 70%)',
      filter: 'blur(90px)',
      mixBlendMode: 'screen',      // keeps whites bright without washing colour
    }}
  />
);

// put this near the <Glow /> helper
const Vignette = () => (
  <div
    className="absolute inset-0 pointer-events-none z-5"
    style={{
      /* translucent black ring that gets stronger at the edges */
      background:
        'radial-gradient(ellipse at 50% 50%, transparent 65%, rgba(0,0,0,0.6) 100%)',
      mixBlendMode: 'multiply',   // darkens whatever is beneath without tinting colours
    }}
  />
);


const ArtifactCarousel = forwardRef(function ArtifactCarousel(_, refPassed) {
  const trackRef  = useRef(null);
  const controls  = useAnimationControls();
  const wrapperRef = refPassed || useRef(null);

  /* ───── desktop / mobile switch (runs only in browser) ───── */
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* nudge by ±1 viewport width */
  const nudge = dir => () => {
    if (!trackRef.current) return;
    const step = window.innerWidth;
    const xNow = trackRef.current.getBoundingClientRect().x;
    controls.start({ x: xNow + dir * step, transition: { duration: 0.5, ease: 'easeOut' } });
  };

  return (
    <section
      id="origins"
      ref={wrapperRef}
      className="bg-[#040500] py-20 overflow-hidden select-none relative"
    >
      {/* ─── Arrow buttons (desktop only) ─── */}
      {isDesktop && (
        <>
          <button
            onClick={nudge(1)}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3"
            aria-label="Previous"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nudge(-1)}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3"
            aria-label="Next"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

     {/* ─── Track wrapper: native swipe on mobile ─── */}
     <div className={`
        ${isDesktop ? 'md:overflow-hidden' : 'overflow-x-auto scroll-smooth snap-x snap-mandatory'}
        px-8 md:px-12 pb-6 md:pb-8 scrollbar-black
      `}>
        <motion.ul
          ref={trackRef}
          drag={isDesktop ? 'x' : false}
          dragConstraints={isDesktop ? { left: -9999, right: 0 } : undefined}
          dragElastic={0.05}
          animate={controls}
          className="flex gap-8 px-8 md:cursor-grab md:active:cursor-grabbing"
        >
          {artifacts.map(({ src, alt }, i) => (
            <li
              key={i}
              className="flex-shrink-0 w-[80vw] md:w-[36vw] snap-center px-4 py-40"
            >
              <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-[#0b0c10]">
                {/* ✨ spotlight layer */}
                <Vignette /> 
                <Glow delay={i * 0.3} />   {/* small stagger keeps variety */}

                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 768px) 35vw, 90vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-xs text-center py-2 tracking-wide z-20">
                  {alt}
                </span>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
});

export default ArtifactCarousel;