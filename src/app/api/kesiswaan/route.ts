import { NextResponse } from 'next/server';
import { getDataKesiswaan, addDataKesiswaan, overwriteDataKesiswaan } from '@/lib/localDb';

export async function GET() {
  try {
    const data = await getDataKesiswaan();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from local JSON:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

function mapToDbRecord(body: any) {
  return {
    nama: body.nama || body.nama_lengkap || '',
    nis: body.nis || '',
    jk: body.jk || 'L',
    nisn: body.nisn || '',
    tempatLahir: body.tempatLahir || body.tempat_lahir || '',
    tanggalLahir: body.tanggalLahir || body.tanggal_lahir || '',
    nik: body.nik || '',
    agama: body.agama || '',
    alamat: body.alamat || '',
    rt: body.rt || '',
    rw: body.rw || '',
    dusun: body.dusun || '',
    kelurahan: body.kelurahan || '',
    kecamatan: body.kecamatan || '',
    kodePos: body.kodePos || '',
    jenisTinggal: body.jenisTinggal || '',
    alatTransportasi: body.alatTransportasi || '',
    telepon: body.telepon || '',
    noHp: body.noHp || body.no_hp || '',
    email: body.email || '',
    skhun: body.skhun || '',
    penerimaKps: body.penerimaKps || '',
    noKps: body.noKps || '',
    
    namaAyah: body.namaAyah || body.nama_ayah || '',
    tahunLahirAyah: body.tahunLahirAyah || '',
    pendidikanAyah: body.pendidikanAyah || '',
    pekerjaanAyah: body.pekerjaanAyah || body.pekerjaan_ayah || '',
    penghasilanAyah: body.penghasilanAyah || '',
    nikAyah: body.nikAyah || '',
    namaIbu: body.namaIbu || body.nama_ibu || '',
    tahunLahirIbu: body.tahunLahirIbu || '',
    pendidikanIbu: body.pendidikanIbu || '',
    pekerjaanIbu: body.pekerjaanIbu || body.pekerjaan_ibu || '',
    penghasilanIbu: body.penghasilanIbu || '',
    nikIbu: body.nikIbu || '',
    namaWali: body.namaWali || '',
    tahunLahirWali: body.tahunLahirWali || '',
    pendidikanWali: body.pendidikanWali || '',
    pekerjaanWali: body.pekerjaanWali || '',
    penghasilanWali: body.penghasilanWali || '',
    nikWali: body.nikWali || '',
    
    kelas: body.kelas || body.masuk_kelas || '1',
    noUn: body.noUn || '',
    noIjazah: body.noIjazah || '',
    penerimaKip: body.penerimaKip || '',
    noKip: body.noKip || '',
    namaKip: body.namaKip || '',
    noKks: body.noKks || '',
    noAkta: body.noAkta || '',
    bank: body.bank || '',
    noRekening: body.noRekening || '',
    rekeningNama: body.rekeningNama || '',
    layakPip: body.layakPip || '',
    alasanPip: body.alasanPip || '',
    kebutuhanKhusus: body.kebutuhanKhusus || '',
    sekolahAsal: body.sekolahAsal || body.asal_tk || '',
    anakKe: body.anakKe || '',
    lintang: body.lintang || '',
    bujur: body.bujur || '',
    noKk: body.noKk || '',
    beratBadan: body.beratBadan || '',
    tinggiBadan: body.tinggiBadan || '',
    lingkarKepala: body.lingkarKepala || '',
    saudaraKandung: body.saudaraKandung || '',
    jarakSekolah: body.jarakSekolah || '',
    
    status: body.status || 'Aktif'
  };
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'append'; // 'append' or 'overwrite'
    const body = await request.json();

    if (Array.isArray(body)) {
      const results = [];
      const baseId = Date.now();
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        const newId = (baseId + i).toString() + Math.random().toString(36).substr(2, 4);
        const record = {
          id: newId,
          ...mapToDbRecord(item)
        };
        results.push(record);
      }

      if (mode === 'overwrite') {
        await overwriteDataKesiswaan(results);
      } else {
        for (const record of results) {
          await addDataKesiswaan(record);
        }
      }

      return NextResponse.json({ success: true, count: results.length, message: `${results.length} data siswa berhasil diimpor` }, { status: 201 });
    } else {
      const newId = Date.now().toString();
      const record = {
        id: newId,
        ...mapToDbRecord(body)
      };
      await addDataKesiswaan(record);
      return NextResponse.json({ success: true, message: 'Data siswa berhasil ditambahkan' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding data to local JSON:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}
