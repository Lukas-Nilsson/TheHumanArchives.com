import { useLayoutEffect } from 'react';

/**
 * @param {React.RefObject<HTMLElement>} ref  container with data-layer wrappers
 * @param {object}   cfg  { depths:number[], offsets:number[] }
 */
export default function useParallax(ref, cfg) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const layers = [...el.querySelectorAll('[data-layer]')];

    const getTransforms = (scrollRatio, pointerRatio) =>
      layers.map((node, i) => {
        const z = cfg.depths[i];
        const x = Math.round(
          pointerRatio * cfg.offsets[i] + scrollRatio * cfg.offsets[i]
        );
        return { node, x, z };
      });

    let scrollRatio = 0;
    let pointerRatio = 0;

    const apply = () => {
      getTransforms(scrollRatio, pointerRatio).forEach(({ node, x, z }) => {
        node.style.setProperty('--tx', `${x}px`);
        node.style.setProperty('--tz', `${z}px`);
      });
    };

    const onMouse = e => {
      pointerRatio = -((e.clientX / window.innerWidth) * 2 - 1);
      apply();
    };

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      scrollRatio = ((rect.left + rect.width / 2) - innerWidth / 2) / (innerWidth / 2);
      apply();
    };

    addEventListener('pointermove', onMouse);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    onScroll();                // initial

    return () => {
      removeEventListener('pointermove', onMouse);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [ref, cfg]);
}
