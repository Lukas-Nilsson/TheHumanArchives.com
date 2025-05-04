import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function supabase() {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const color = searchParams.get('color');
  const size  = searchParams.get('size');

  if (!color || !size) {
    return NextResponse.json({ error: 'bad params' }, { status: 400 });
  }

  const { data, error } = await supabase()
    .from('hoodie_stock')
    .select('stock')
    .eq('color', color)
    .eq('size', size)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ stock: data?.stock ?? 0 });
}
