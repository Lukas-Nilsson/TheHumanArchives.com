// src/utils/animateScrollTo.js
export function animateScrollTo(targetY, {
    duration = 1200,          // ms – bump this up for a slower glide
    easing   = easeInOutQuad // pluggable easing
  } = {}) {
    const startY   = window.scrollY;
    const changeY  = targetY - startY;
    let   startT   = null;
  
    function step(now) {
      if (!startT) startT = now;
      const elapsed   = now - startT;
      const progress  = Math.min(elapsed / duration, 1);      // clamp 0-1
      const position  = startY + changeY * easing(progress);
      window.scrollTo(0, position);
  
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  
  /* classic ease - tweak or swap as needed */
  function easeInOutQuad(t) {
    return t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  