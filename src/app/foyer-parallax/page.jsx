// src/app/foyer-parallax/page.jsx
import ParallaxHall from '@/components/gallery/ParallaxHall';

export const metadata = {
  title: 'THA · Parallax test',
};

export default function Page() {
  // Give ParallaxHall a full-viewport height so it doesn’t collapse
  return <ParallaxHall
            layers={[
              { src: '/artifact-wall.png', depth: -100, offset: -24 },  // back
            ]}
          />
}
