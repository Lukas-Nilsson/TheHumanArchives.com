'use client';
import { useState } from 'react';

export default function PriceSlider({ min, max, onChange }) {
  const [value, setValue] = useState(min);

  function handle(e) {
    const v = Number(e.target.value);
    setValue(v);
    onChange?.(v);
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        type="range"
        min={min}
        max={max}
        step="100"                       /* $1 steps (100 ¢) */
        value={value}
        onChange={handle}
        className="w-full accent-tha-gold"
      />

      <div className="text-center text-sm tracking-widest">
        {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100)}
      </div>
    </div>
  );
}
