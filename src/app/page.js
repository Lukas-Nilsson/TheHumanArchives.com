// src/app/page.js

import EmailCapture from './components/EmailCapture';


export default function Landing() {
    return (
      <main className="min-h-screen grid place-items-center bg-tha-black text-tha-ivory">
        <div className="space-y-6 text-center">
          <h1 className="font-serif text-4xl">The Human Archives</h1>
          <p>A living museum of humanity.</p>
          <EmailCapture />
          <a
            href="/shop"
            className="block underline decoration-tha-gold underline-offset-4 hover:text-tha-gold"
          >
            Enter the shop
          </a>
          <a
          href="/parallax-gallery/page.js"
          className="block underline decoration-tha-gold underline-offset-4 hover:text-tha-gold"
        >
          View the Parallax Gallery
        </a>
        </div>
      </main>
    );
  }
  