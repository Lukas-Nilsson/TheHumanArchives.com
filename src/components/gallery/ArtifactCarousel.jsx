'use client';

import { forwardRef, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { artifacts } from '@/data/origins';
import { blurMap } from '@/blur-map';
import useScrollHandoff from '@/hooks/useScrollHandoff';

const ArtifactCarousel = forwardRef(function ArtifactCarousel(_, passedRef) {
  const wrapperRef = passedRef || useRef(null);
  const trackRef = useRef(null);
  useScrollHandoff(trackRef);

  /* haptic tick on snap */
  const { scrollYProgress } = useScroll({ container: trackRef });
  const idx = useTransform(
    scrollYProgress,
    artifacts.map((_, i) => i / (artifacts.length - 1)),
    artifacts.map((_, i) => i)
  );
  const springIdx = useSpring(idx, { stiffness: 120, damping: 18 });
  useEffect(() => springIdx.on('change', () => navigator.vibrate?.(8)), []);

  return (
    <section id="origins" ref={wrapperRef} className="relative h-[100dvh] bg-[#040500] text-white">
      <div
        ref={trackRef}
        className="snap-container h-full overflow-y-auto snap-y snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {artifacts.map((a, i) => {
          // derive key for blurMap lookup (e.g., 'artifacts/cmb.png')
          const blurKey = a.src.replace(/^\//, '');
          const blurData = blurMap?.[blurKey];

          return (
            <motion.article
              key={a.slug}
              className="h-[100dvh] snap-start flex flex-col items-center justify-center px-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.6, once: true }}
              transition={{ duration: 0.4 }}
            >
              {/* -------- image with optional blur placeholder -------- */}
              <Link href={`/store/${a.slug}`} className="block w-full max-w-md">
                <div className="relative w-full pb-[75%]">
                  <Image
                    src={a.src}
                    alt={a.title}
                    fill
                    sizes="(min-width:768px) 480px, 90vw"
                    className="object-cover rounded-2xl shadow-xl"
                    priority={i === 0}
                    {...(blurData ? { placeholder: 'blur', blurDataURL: blurData } : {})}
                  />
                </div>
              </Link>

              {/* -------- metadata + description -------- */}
              <h3 className="mt-6 text-xl font-semibold text-center">{a.title}</h3>

              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm max-w-md">
                <dt className="font-medium text-gray-300">Date</dt> <dd>{a.date}</dd>
                <dt className="font-medium text-gray-300">Location</dt> <dd>{a.location}</dd>
                <dt className="font-medium text-gray-300">Archive</dt> <dd>{a.archive}</dd>
                <dt className="font-medium text-gray-300">Medium</dt> <dd>{a.medium}</dd>
                <dt className="font-medium text-gray-300">Discipline</dt> <dd>{a.discipline}</dd>
              </dl>

              <p className="mt-4 mb-[calc(env(safe-area-inset-bottom)+4rem)] sm:mb-8 max-w-md text-center text-sm leading-snug text-gray-300">
                {a.description}
              </p>
            </motion.article>
          );
        })}

        {/* sentinel to exit reel */}
        <div
          className="pointer-events-none h-[25vh]"
          style={{ scrollSnapAlign: 'none', overscrollBehaviorY: 'contain' }}
        />
      </div>
    </section>
  );
});

export default ArtifactCarousel;
