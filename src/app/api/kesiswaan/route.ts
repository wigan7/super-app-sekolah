import { NextResponse } from 'next/server';
import { getGoogleSheet } from '@/lib/googleSheets';

// Asumsi Header Kolom di Google Sheets:
// ID | Nama Lengkap | NISN | NIK | Jenis Kelamin | Kelas | Tempat Lahir | Tanggal Lahir | Alamat | Nama Ayah | Pekerjaan Ayah | Nama Ibu | Pekerjaan Ibu | No HP | Masuk Kelas | Asal TK | Status

export async function GET() {
  try {
    const doc = await getGoogleSheet();
    // Gunakan worksheet pertama (index 0)
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const data = rows.map((row) => ({
      id: row.get('ID'),
      nama: row.get('Nama Lengkap'),
      nisn: row.get('NISN'),
      nik: row.get('NIK'),
      jk: row.get('Jenis Kelamin'),
      kelas: row.get('Kelas'),
      tempatLahir: row.get('Tempat Lahir'),
      tanggalLahir: row.get('Tanggal Lahir'),
      alamat: row.get('Alamat'),
      namaAyah: row.get('Nama Ayah'),
      pekerjaanAyah: row.get('Pekerjaan Ayah'),
      namaIbu: row.get('Nama Ibu'),
      pekerjaanIbu: row.get('Pekerjaan Ibu'),
      noHp: row.get('No HP'),
      masukKelas: row.get('Masuk Kelas'),
      asalTk: row.get('Asal TK'),
      status: row.get('Status') || 'Aktif',
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const doc = await getGoogleSheet();
    const sheet = doc.sheetsByIndex[0];

    // Generate UUID/ID sederhana untuk baris baru
    const newId = Date.now().toString();

    await sheet.addRow({
      'ID': newId,
      'Nama Lengkap': body.nama_lengkap || '',
      'NISN': body.nisn || '',
      'NIK': body.nik || '',
      'Jenis Kelamin': body.jk || 'L', // default L
      'Kelas': body.kelas || '1',
      'Tempat Lahir': body.tempat_lahir || '',
      'Tanggal Lahir': body.tanggal_lahir || '',
      'Alamat': body.alamat || '',
      'Nama Ayah': body.nama_ayah || '',
      'Pekerjaan Ayah': body.pekerjaan_ayah || '',
      'Nama Ibu': body.nama_ibu || '',
      'Pekerjaan Ibu': body.pekerjaan_ibu || '',
      'No HP': body.no_hp || '',
      'Masuk Kelas': body.masuk_kelas || '',
      'Asal TK': body.asal_tk || '',
      'Status': 'Aktif'
    });

    return NextResponse.json({ success: true, message: 'Data siswa berhasil ditambahkan' }, { status: 201 });
  } catch (error) {
    console.error('Error adding data to Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}
