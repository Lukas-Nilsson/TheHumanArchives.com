'use client';
import { useEffect, useState } from 'react';

export default function useTilt({ maxTilt = 15 } = {}) {
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

  useEffect(() => {
    const isTouch = matchMedia('(hover: none)').matches;

    /** --- Mouse pointer (desktop) ---------------------------- */
    function onMouseMove(e) {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;   // −1 → +1
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setTransform(
        `rotateX(${y * maxTilt}deg) rotateY(${x * -maxTilt}deg)`
      );
    }

    /** --- Gyro (mobile) ------------------------------------- */
    function onOrientation(e) {
      // gamma → left/right, beta → front/back
      const x = (e.gamma ?? 0) / 45;  // normalize ±45°
      const y = (e.beta  ?? 0) / 45;
      setTransform(
        `rotateX(${y * maxTilt}deg) rotateY(${x * -maxTilt}deg)`
      );
    }

    if (isTouch && window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onOrientation, true);
      return () =>
        window.removeEventListener('deviceorientation', onOrientation, true);
    }

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [maxTilt]);

  return transform;          // use as inline style
}
