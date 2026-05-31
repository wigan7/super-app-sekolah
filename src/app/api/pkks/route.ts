import { NextResponse } from 'next/server';
import { getPkksState, updatePkksState } from '@/lib/localDb';

export async function GET() {
  try {
    const data = await getPkksState();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching PKKS data:', error);
    return NextResponse.json({ error: 'Gagal mengambil data PKKS' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await updatePkksState({
      completedIndicators: body?.completedIndicators ?? {},
      links: body?.links ?? {},
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating PKKS data:', error);
    return NextResponse.json({ error: 'Gagal menyimpan data PKKS' }, { status: 500 });
  }
}
