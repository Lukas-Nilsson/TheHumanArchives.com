import NavLink from '@/components/common/NavLink';
import SiteHeader from '@/components/common/SiteHeader';

export default function AboutPage() {
  return (
    <main className="bg-[#040500] text-white min-h-screen w-full font-serif">
      {/* Section 1 – The Stone */}
      <section className="px-6 pt-32 pb-24 max-w-3xl mx-auto text-center text-lg leading-relaxed tracking-wide">
        <p className="text-neutral-300 uppercase text-sm mb-8 tracking-[0.2em]">The Inscription</p>
        <h1 className="text-2xl md:text-3xl font-medium whitespace-pre-line">
          {`THE HUMAN ARCHIVES
was not created as a brand.
It was born from a belief:
That beauty is real.
That meaning is not dead.
That we are not separate from those who came before us.`}
        </h1>
        <p className="mt-10 text-base opacity-70 whitespace-pre-line">
          {`This is not a collection of products.
This is an act of preservation.
A visible thread between ancestors and the unborn.

We archive, because memory is sacred.
We create, because the future is watching.`}
        </p>
      </section>

      {/* Section 2 – The Face Behind It */}
      <section className="flex flex-col md:flex-row items-center gap-12 px-8 py-20 max-w-5xl mx-auto">
      <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden rounded-lg">
        <img
            src="/lukas.JPG"
            alt="Portrait of Lukas"
            className="w-full h-full object-cover contrast-130 brightness-80"
        />
      </div>  
        <div className="w-full md:w-1/2 text-left">
          <p className="uppercase text-sm text-neutral-500 mb-4">The Founder</p>
          <h2 className="text-2xl font-medium mb-6">My name is Lukas.</h2>
          <p className="text-lg leading-relaxed">
            I built this because I believe we are forgetting something vital:
            <br /><br />
            That humanity is beautiful.
            <br /><br />
            Not perfect — but miraculous.
            <br /><br />
            This project is how I remember.
            <br />
            And maybe how others will too.
          </p>
        </div>
      </section>

      {/* Section 3 – Core Beliefs */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">BELONGING</h3>
            <p className="opacity-70">Every artifact connects us.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">MEMORY</h3>
            <p className="opacity-70">What we preserve shapes who we become.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">REVERENCE</h3>
            <p className="opacity-70">Beauty is not a luxury. It is a foundation.</p>
          </div>
        </div>
      </section>

      {/* Section 4 – Invitation */}
      <section className="text-center py-20">
        <p className="text-lg mb-6">Want to walk with us?</p>
        <a href="/waitlist" className="inline-block px-10 py-4 border border-white text-white hover:bg-white hover:text-black transition">
          Join the Waitlist
        </a>
      </section>
    </main>
  );
}
