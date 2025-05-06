'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function useShiftX({
  maxShift = 40,
  disabled = false,
  ref: externalRef,
} = {}) {
  // —— Option A: managed inside React state (easy, causes tiny re-render each frame)
  const [transform, setTransform] = useState('translateX(0px)');

  // —— Option B: write directly to a supplied ref to avoid re-renders
  const internalRef = useRef(null);
  const target = externalRef ?? internalRef;

  // Single RAF writer to avoid flooding
  const write = useCallback(
    (xNorm) => {
      const shift = xNorm * maxShift;
      const value = `translateX(${shift}px)`;

      if (target.current) target.current.style.transform = value;
      else setTransform(value);
    },
    [maxShift, target]
  );

  useEffect(() => {
    if (disabled) return;
    if (typeof window === 'undefined') return;

    // Respect accessibility setting
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (mq?.matches) return;

    let frameId = null;
    const schedule = (xNorm) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => write(xNorm));
    };

    // Desktop pointer
    const onMouse = (e) => schedule((e.clientX / window.innerWidth - 0.5) * 2);

    // Mobile gyro
    const onGyro = (e) => {
      const norm = (e.gamma ?? 0) / 45;
      schedule(Math.max(-1, Math.min(1, norm)));
    };

    // Gyro permission helper
    const enableGyro = async () => {
      if (
        typeof DeviceOrientationEvent?.requestPermission === 'function' &&
        (await DeviceOrientationEvent.requestPermission()) !== 'granted'
      ) {
        return;
      }
      window.addEventListener('deviceorientation', onGyro, true);
    };

    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch && 'DeviceOrientationEvent' in window) {
      window.addEventListener('click', enableGyro, { once: true });
    } else {
      window.addEventListener('mousemove', onMouse);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onGyro, true);
    };
  }, [disabled, write]);

  // When you want React to manage style:
  return { transform, ref: target };
}
