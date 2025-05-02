'use client';
import ParallaxHall from '@/components/ParallaxHall';

export default function ParallaxGallery() {
  return (
    <div className="w-full flex justify-center gap-0 overflow-hidden">
      <ParallaxHall width="2000px" />
      <ParallaxHall width="2000px" />
      <ParallaxHall width="2000px" />
    </div>
  );
}
