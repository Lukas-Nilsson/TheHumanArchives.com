import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req) {
  const { id, price } = await req.json();
  const supa = createClient();

  /* decrement stock optimistically */
  const { data: ok } = await supabase.rpc('purchase_artifact_hoodie', {
    p_slug: 'origins',
    p_color: 'white',
    p_size: 'M',
  });
  if (!ok) return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
}  
