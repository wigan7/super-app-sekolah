import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type RowRecord = { [key: string]: JsonValue };

type SchoolData = {
  kesiswaan: {
    induk: RowRecord[];
    akademikPrestasi: RowRecord[];
    kehadiranHarian: RowRecord[];
    kehadiranBulanan: RowRecord[];
    mutasiMasuk: RowRecord[];
    mutasiKeluar: RowRecord[];
  };
  kepegawaian: {
    pegawai: RowRecord[];
    izinKeluar: RowRecord[];
    piket: RowRecord[];
    diklat: RowRecord[];
    penghargaan: RowRecord[];
    inventaris: RowRecord[];
  };
  pembelajaran: {
    supervisi: RowRecord[];
    administrasi: RowRecord[];
    kasus: RowRecord[];
    bimbingan: RowRecord[];
    kurikulumPencapaian: RowRecord[];
    pembagianTugas: RowRecord[];
    tamu: RowRecord[];
    humas: RowRecord[];
    pengaduan: RowRecord[];
  };
  pkks: {
    completedIndicators: Record<string, boolean>;
    links: Record<string, string>;
  };
};

const DEFAULT_SCHOOL_DATA: SchoolData = {
  kesiswaan: {
    induk: [],
    akademikPrestasi: [],
    kehadiranHarian: [],
    kehadiranBulanan: [],
    mutasiMasuk: [],
    mutasiKeluar: [],
  },
  kepegawaian: {
    pegawai: [],
    izinKeluar: [],
    piket: [],
    diklat: [],
    penghargaan: [],
    inventaris: [],
  },
  pembelajaran: {
    supervisi: [],
    administrasi: [],
    kasus: [],
    bimbingan: [],
    kurikulumPencapaian: [],
    pembagianTugas: [],
    tamu: [],
    humas: [],
    pengaduan: [],
  },
  pkks: {
    completedIndicators: {},
    links: {},
  },
};

// Helper untuk memastikan file ada
const ensureFileExists = async (fileName: string, defaultData: JsonValue = []) => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  const filePath = path.join(DATA_DIR, fileName);
  try {
    await fs.access(filePath);
  } catch {
    // Jika file belum ada, inisialisasi dengan data default
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

// Generic read
export const getData = async <T extends JsonValue = JsonValue>(
  fileName: string,
  defaultData: T = [] as unknown as T
) => {
  await ensureFileExists(fileName, defaultData);
  const filePath = path.join(DATA_DIR, fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data) as T;
};

// Generic write
export const writeData = async (fileName: string, data: JsonValue) => {
  await ensureFileExists(fileName);
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Unified school dataset helpers
export const getSchoolData = async (): Promise<SchoolData> => {
  const data = await getData('school-data.json', DEFAULT_SCHOOL_DATA);
  return {
    ...DEFAULT_SCHOOL_DATA,
    ...data,
    kesiswaan: { ...DEFAULT_SCHOOL_DATA.kesiswaan, ...(data?.kesiswaan ?? {}) },
    kepegawaian: { ...DEFAULT_SCHOOL_DATA.kepegawaian, ...(data?.kepegawaian ?? {}) },
    pembelajaran: { ...DEFAULT_SCHOOL_DATA.pembelajaran, ...(data?.pembelajaran ?? {}) },
    pkks: { ...DEFAULT_SCHOOL_DATA.pkks, ...(data?.pkks ?? {}) },
  };
};

export const writeSchoolData = async (data: SchoolData) => {
  await writeData('school-data.json', data);
};

export const getDatasetRows = async (section: keyof SchoolData, dataset: string) => {
  const schoolData = await getSchoolData();
  const sectionData = schoolData[section] as Record<string, JsonValue>;
  const rows = sectionData?.[dataset];
  return Array.isArray(rows) ? rows : null;
};

export const appendDatasetRow = async (
  section: keyof SchoolData,
  dataset: string,
  row: Record<string, JsonValue>
) => {
  const schoolData = await getSchoolData();
  const sectionData = schoolData[section] as Record<string, JsonValue>;
  if (!Array.isArray(sectionData?.[dataset])) {
    return null;
  }

  const newRow: RowRecord = {
    id: row.id ?? Date.now().toString(),
    ...row,
  };

  sectionData[dataset] = [...sectionData[dataset], newRow];
  await writeSchoolData(schoolData);
  return newRow;
};

export const getPkksState = async () => {
  const schoolData = await getSchoolData();
  return schoolData.pkks;
};

export const updatePkksState = async (newData: SchoolData['pkks']) => {
  const schoolData = await getSchoolData();
  schoolData.pkks = {
    completedIndicators: newData?.completedIndicators ?? {},
    links: newData?.links ?? {},
  };
  await writeSchoolData(schoolData);
  return schoolData.pkks;
};

// Kesiswaan
export const getDataKesiswaan = async () => {
  const rows = await getDatasetRows('kesiswaan', 'induk');
  return rows ?? [];
};
export const addDataKesiswaan = async (newData: Record<string, JsonValue>) => {
  return appendDatasetRow('kesiswaan', 'induk', newData);
};

// Kepegawaian
export const getDataKepegawaian = async () => {
  const rows = await getDatasetRows('kepegawaian', 'pegawai');
  return rows ?? [];
};
export const addDataKepegawaian = async (newData: Record<string, JsonValue>) => {
  return appendDatasetRow('kepegawaian', 'pegawai', newData);
};

// PKKS
export const getDataPkks = async () => {
  return getPkksState();
};
export const updateDataPkks = async (newData: SchoolData['pkks']) => {
  return updatePkksState(newData);
};
