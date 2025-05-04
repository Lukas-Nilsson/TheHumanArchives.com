// src/app/api/stock/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const color = searchParams.get('color');
  const size  = searchParams.get('size');

  if (!color || !size) {
    return NextResponse.json({ error: 'Missing color or size' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('hoodie_stock')
    .select('stock')
    .eq('color', color)
    .eq('size', size)
    .single();

  if (error || !data) {
    return NextResponse.json({ stock: 0 });
  }

  return NextResponse.json({ stock: data.stock });
}
