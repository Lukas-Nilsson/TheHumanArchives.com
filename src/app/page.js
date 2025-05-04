// src/app/page.jsx
import EmailCapture from '@/components/email/EmailCapture';

export const metadata = { title: 'The Human Archives · Wait-list' };

export default function Landing() {
  return (
    <main className="min-h-screen grid place-items-center bg-tha-black text-tha-ivory">
      <div className="space-y-6 text-center">
        <h1 className="font-serif text-4xl">The Human Archives</h1>
        <p>A living museum of humanity.</p>

        <EmailCapture />

        <a
          href="https://instagram.com/the.human.archives"
          target="_blank"
          rel="noopener noreferrer"
          className="block underline decoration-tha-gold underline-offset-4 hover:text-tha-gold"
        >
          Follow us on Instagram
        </a>
      </div>
    </main>
  );
}
