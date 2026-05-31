import { NextResponse } from 'next/server';
import { getDataKesiswaan, addDataKesiswaan } from '@/lib/localDb';

export async function GET() {
  try {
    const data = await getDataKesiswaan();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from local JSON:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate simple UUID/ID for new row
    const newId = Date.now().toString();

    const newData = {
      id: newId,
      nama: body.nama_lengkap || '',
      nisn: body.nisn || '',
      nik: body.nik || '',
      jk: body.jk || 'L', // default L
      kelas: body.kelas || '1',
      tempatLahir: body.tempat_lahir || '',
      tanggalLahir: body.tanggal_lahir || '',
      alamat: body.alamat || '',
      namaAyah: body.nama_ayah || '',
      pekerjaanAyah: body.pekerjaan_ayah || '',
      namaIbu: body.nama_ibu || '',
      pekerjaanIbu: body.pekerjaan_ibu || '',
      noHp: body.no_hp || '',
      masukKelas: body.masuk_kelas || '',
      asalTk: body.asal_tk || '',
      status: 'Aktif'
    };

    await addDataKesiswaan(newData);

    return NextResponse.json({ success: true, message: 'Data siswa berhasil ditambahkan' }, { status: 201 });
  } catch (error) {
    console.error('Error adding data to local JSON:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}
