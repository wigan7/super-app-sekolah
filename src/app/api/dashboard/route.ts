import { NextResponse } from 'next/server';
import { getDataKesiswaan, getDataKepegawaian, getDataPkks } from '@/lib/localDb';

export async function GET() {
  try {
    const [siswa, guru, pkks] = await Promise.all([
      getDataKesiswaan(),
      getDataKepegawaian(),
      getDataPkks(),
    ]);

    // Calculate PKKS progress
    let pkksProgress = 0;
    if (pkks && pkks.completedIndicators) {
      const completedCount = Object.values(pkks.completedIndicators).filter(Boolean).length;
      const totalIndicators = 13;
      pkksProgress = Math.round((completedCount / totalIndicators) * 100);
    }

    return NextResponse.json({
      totalSiswa: siswa.length,
      totalGuru: guru.length,
      pkksProgress: `${pkksProgress}%`
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
