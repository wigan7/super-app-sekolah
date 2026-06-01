import { NextResponse } from 'next/server';
import { appendDatasetRow, getDatasetRows, deleteDatasetRow, importDatasetRows } from '@/lib/localDb';

const ALLOWED_DATASETS = {
  kesiswaan: new Set([
    'induk',
    'akademikPrestasi',
    'akademikKenaikan',
    'rekapUjian',
    'penyerahanRaport',
    'penyerahanIjazah',
    'kehadiranHarian',
    'kehadiranBulanan',
    'mutasiMasuk',
    'mutasiKeluar',
  ]),
  kepegawaian: new Set([
    'pegawai',
    'izinKeluar',
    'piket',
    'diklat',
    'penghargaan',
    'inventaris',
  ]),
  pembelajaran: new Set([
    'supervisi',
    'administrasi',
    'kasus',
    'bimbingan',
    'kurikulumPencapaian',
    'pembagianTugas',
    'tamu',
    'humas',
    'pengaduan',
  ]),
} as const;

type SectionKey = keyof typeof ALLOWED_DATASETS;

const isAllowedDataset = (section: string, dataset: string): section is SectionKey => {
  if (!(section in ALLOWED_DATASETS)) {
    return false;
  }

  return ALLOWED_DATASETS[section as SectionKey].has(dataset);
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ section: string; dataset: string }> }
) {
  try {
    const { section, dataset } = await context.params;

    if (!isAllowedDataset(section, dataset)) {
      return NextResponse.json({ error: 'Dataset tidak ditemukan' }, { status: 404 });
    }

    const rows = await getDatasetRows(section, dataset);
    return NextResponse.json(rows ?? []);
  } catch (error) {
    console.error('Error fetching dataset:', error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ section: string; dataset: string }> }
) {
  try {
    const { section, dataset } = await context.params;

    if (!isAllowedDataset(section, dataset)) {
      return NextResponse.json({ error: 'Dataset tidak ditemukan' }, { status: 404 });
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'append';

    if (Array.isArray(body)) {
      const imported = await importDatasetRows(section as any, dataset, body, mode as any);
      if (!imported) {
        return NextResponse.json({ error: 'Dataset tidak valid' }, { status: 400 });
      }
      return NextResponse.json({ count: imported.length, rows: imported }, { status: 201 });
    } else {
      const newRow = await appendDatasetRow(section, dataset, body ?? {});
      if (!newRow) {
        return NextResponse.json({ error: 'Dataset tidak valid' }, { status: 400 });
      }
      return NextResponse.json(newRow, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding dataset row:', error);
    return NextResponse.json({ error: 'Gagal menambahkan data' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ section: string; dataset: string }> }
) {
  try {
    const { section, dataset } = await context.params;

    if (!isAllowedDataset(section, dataset)) {
      return NextResponse.json({ error: 'Dataset tidak ditemukan' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const success = await deleteDatasetRow(section as any, dataset, id);
    if (!success) {
      return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting dataset row:', error);
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 });
  }
}

