'use client';
import ParallaxHall from '@/components/gallery/ParallaxHall';

const hallConfigs = [
  {},
  {},
  {},
];

export default function ParallaxGallery() {
  return (
    <main
      className="
        w-full min-h-screen flex justify-center items-end
        gap-0 overflow-hidden py-0 bg-[#040500]
      "
    >
      {hallConfigs.map((cfg, i) => (
        <ParallaxHall key={i} {...cfg} />
      ))}
    </main>
  );
}
