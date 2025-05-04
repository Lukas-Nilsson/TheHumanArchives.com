'use client';
import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PriceSlider from './PriceSlider';

export default function HoodieCard({ hoodie }) {
  const router = useRouter();
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(hoodie.min_price);
  const [pending, start]  = useTransition();

  /* live stock */
  useEffect(() => {
    fetch(`/api/stock?color=${hoodie.color}&size=${hoodie.size}`)
      .then(r => r.json())
      .then(({ stock }) => setStock(stock ?? 0));
  }, [hoodie.color, hoodie.size]);

  const out = stock === 0;

  async function handleBuy() {
    start(async () => {
      const res  = await fetch('/api/checkout', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ id: hoodie.id, price }),
      });
      const { url } = await res.json();
      if (url) router.push(url);
    });
  }

  return (
    <div
      className="
        bg-[#1a1a1a] rounded-lg p-6 w-full  /* ⬅️ no max-w */
        min-w-[15rem] flex flex-col gap-4 shadow-lg      /* optional min width */
      "
    >
      {/* image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded bg-neutral-900">
        <Image
          src={hoodie.image_url}
          alt={hoodie.name}
          fill
          className="object-contain"
          sizes="(max-width:640px) 100vw, 400px"
        />
        <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded
          ${out ? 'bg-red-600/80' : 'bg-black/70'}`}>
          {out ? 'Sold out' : `${stock} in stock`}
        </span>
      </div>

      <h2 className="text-lg font-semibold">{hoodie.name}</h2>

      <PriceSlider
        min={hoodie.min_price}
        max={hoodie.max_price}
        onChange={setPrice}
        className={out ? 'opacity-30 pointer-events-none' : ''}
      />

      <button
        onClick={handleBuy}
        disabled={out || pending}
        className="
          mt-auto bg-white text-black px-4 py-2 rounded
          hover:bg-tha-gold transition
          disabled:opacity-30 disabled:pointer-events-none
        "
      >
        {pending
          ? 'Processing…'
          : out
            ? 'Sold out'
            : `Buy for $${(price / 100).toFixed(2)}`}
      </button>

      <a
        href={`/archive/${hoodie.slug}`}
        className="text-xs underline text-neutral-400 hover:text-white mt-2"
      >
        Learn the story
      </a>
    </div>
  );
}
