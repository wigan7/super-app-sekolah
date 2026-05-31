import { NextResponse } from 'next/server';
import { getIdentitas, updateIdentitas } from '@/lib/localDb';

export async function GET() {
  try {
    const identitas = await getIdentitas();
    return NextResponse.json(identitas);
  } catch (error) {
    console.error('Error fetching school identity:', error);
    return NextResponse.json({ error: 'Gagal mengambil data identitas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await updateIdentitas(body ?? {});
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating school identity:', error);
    return NextResponse.json({ error: 'Gagal menyimpan data identitas' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}
