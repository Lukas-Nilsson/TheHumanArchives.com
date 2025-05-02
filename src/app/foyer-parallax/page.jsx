// src/app/foyer-parallax/page.jsx
import ParallaxHall from '@/components/ParallaxHall';

export const metadata = {
  title: 'THA · Parallax test',
};

export default function Page() {
  // Give ParallaxHall a full-viewport height so it doesn’t collapse
  return <ParallaxHall className="w-screen" />;
}
