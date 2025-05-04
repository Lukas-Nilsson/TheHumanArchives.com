import { createClient }  from '@/lib/supabase/server';
import HoodieCard        from '@/components/store/HoodieCard';
import SiteHeader        from '@/components/common/SiteHeader';

export const revalidate = 60;

export default async function StorePage() {
  const supabase = await createClient();
  const { data: hoodies, error } = await supabase
    .from('hoodies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <main
      className="
        min-h-screen bg-[#040500] text-white
        flex flex-col items-center pt-[120px]
      "
    >
      <SiteHeader />

      <h1 className="font-serif text-3xl mb-12 text-center">
        The Archive Store
      </h1>

      {/* 🔥 auto-fit columns: min 18 rem, grow to 1fr */}
      <div
        className="
          grid gap-10
          w-full px-4
          max-w-7xl
          [grid-template-columns:repeat(auto-fit,minmax(18rem,1fr))]
        "
      >
        {hoodies.map(h => <HoodieCard key={h.id} hoodie={h} />)}
      </div>
    </main>
  );
}
