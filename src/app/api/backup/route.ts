import { NextResponse } from 'next/server';
import { getSchoolData, writeSchoolData } from '@/lib/localDb';

export async function GET() {
  try {
    const allData = await getSchoolData();
    
    // Generate a readable backup filename with timestamp
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `backup-sekolah-${dateStr}.json`;

    return new NextResponse(JSON.stringify(allData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting backup:', error);
    return NextResponse.json({ error: 'Gagal mengekspor data cadangan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic structure validation
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Format data tidak valid' }, { status: 400 });
    }

    // Merge or write the imported data directly
    const mergedData = {
      kesiswaan: body.kesiswaan || { induk: [], akademikPrestasi: [], kehadiranHarian: [], kehadiranBulanan: [], mutasiMasuk: [], mutasiKeluar: [] },
      kepegawaian: body.kepegawaian || { pegawai: [], izinKeluar: [], piket: [], diklat: [], penghargaan: [], inventaris: [] },
      pembelajaran: body.pembelajaran || { supervisi: [], administrasi: [], kasus: [], bimbingan: [], kurikulumPencapaian: [], pembagianTugas: [], tamu: [], humas: [], pengaduan: [] },
      pkks: body.pkks || { completedIndicators: {}, links: {} },
      identitas: body.identitas || {
        namaKepalaSekolah: "", nipKepalaSekolah: "", jabatanKepalaSekolah: "", golonganKepalaSekolah: "",
        namaSekolah: "", npsn: "", alamat: "", kelurahan: "", kecamatan: "", kabupaten: "", provinsi: "",
        kodePos: "", telepon: "", email: "", website: ""
      }
    };

    await writeSchoolData(mergedData);

    return NextResponse.json({ success: true, message: 'Data berhasil dipulihkan dari cadangan' });
  } catch (error) {
    console.error('Error importing backup:', error);
    return NextResponse.json({ error: 'Gagal mengimpor data cadangan' }, { status: 500 });
  }
}
