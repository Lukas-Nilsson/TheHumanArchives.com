/* src/hooks/useTiltRatio.js
   Gives a normalized x-axis ratio (-1 ←→ 1) driven by mouse or gyro.
*/
'use client';

import { useEffect, useState } from 'react';

export default function useTiltRatio() {
  const [xRatio, setXRatio] = useState(0); // -1 ↔ 1
  useEffect(() => {
    const isTouch = matchMedia('(hover: none)').matches;
    let raf = 0;

    const schedule = (value) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setXRatio(Math.max(-1, Math.min(1, value))));
    };

    /* desktop pointer */
    const onMouse = (e) => schedule((e.clientX / innerWidth - 0.5) * 2);

    /* mobile gyro (γ is left/right tilt, range ≈ −45 → 45) */
    const onGyro = (e) => schedule((e.gamma ?? 0) / 45);

    /* permission dance for iOS */
    const enableGyro = async () => {
      if (
        typeof DeviceOrientationEvent?.requestPermission === 'function' &&
        (await DeviceOrientationEvent.requestPermission()) !== 'granted'
      )
        return;
      window.addEventListener('deviceorientation', onGyro, true);
    };

    if (isTouch && 'DeviceOrientationEvent' in window) {
      window.addEventListener('click', enableGyro, { once: true });
    } else {
      window.addEventListener('mousemove', onMouse);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onGyro, true);
    };
  }, []);

  return xRatio; // use this to scale anything in X
}
