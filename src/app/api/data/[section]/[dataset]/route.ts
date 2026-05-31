import { NextResponse } from 'next/server';
import { appendDatasetRow, getDatasetRows } from '@/lib/localDb';

const ALLOWED_DATASETS = {
  kesiswaan: new Set([
    'induk',
    'akademikPrestasi',
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
    const newRow = await appendDatasetRow(section, dataset, body ?? {});

    if (!newRow) {
      return NextResponse.json({ error: 'Dataset tidak valid' }, { status: 400 });
    }

    return NextResponse.json(newRow, { status: 201 });
  } catch (error) {
    console.error('Error adding dataset row:', error);
    return NextResponse.json({ error: 'Gagal menambahkan data' }, { status: 500 });
  }
}
