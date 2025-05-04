// src/app/page.jsx
import FadeIn from '@/components/common/FadeIn';
import HomeWarmup from '@/components/common/HomeWarmup';
import EmailCapture from '@/components/email/EmailCapture';

export const metadata = { title: 'The Human Archives · Wait-list' };

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-tha-black text-tha-ivory">
      {/* soft glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[70vw] max-h-96 w-[70vw] max-w-96 rounded-full bg-tha-gold/5 blur-3xl" />
      </div>

      {/* content */}
      <div className="relative z-10 grid min-h-screen place-items-center px-4">
        <FadeIn>
        <div className="mx-auto w-full max-w-md md:max-w-2xl lg:max-w-3xl space-y-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-wide">
            <span className="block md:inline">The&nbsp;</span>
            <span className="block md:inline">Human&nbsp;</span>
            <span className="block md:inline">Archives</span>
          </h1>


            <p className="mx-auto max-w-xs text-base sm:text-lg font-light tracking-wide text-tha-gold/80">
              A&nbsp;living museum&nbsp;of&nbsp;humanity
            </p>

            <EmailCapture />

            <a
              href="https://instagram.com/your_handle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs sm:text-sm uppercase tracking-widest text-tha-gold hover:text-tha-ivory/90"
            >
              Follow&nbsp;us&nbsp;on&nbsp;Instagram
            </a>
          </div>
        </FadeIn>
      </div>

      {/* background warm-up (hidden) */}
      <HomeWarmup />
    </main>
  );
}
