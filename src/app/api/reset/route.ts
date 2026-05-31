import { NextResponse } from 'next/server';
import { resetSchoolData } from '@/lib/localDb';

export async function POST() {
  try {
    await resetSchoolData();
    return NextResponse.json({ success: true, message: 'Semua data berhasil di-reset' });
  } catch (error) {
    console.error('Error resetting school data:', error);
    return NextResponse.json({ error: 'Gagal mereset data' }, { status: 500 });
  }
}
