"use client";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type RowRecord = { [key: string]: JsonValue };

type SchoolData = {
  kesiswaan: {
    induk: RowRecord[];
    akademikPrestasi: RowRecord[];
    akademikKenaikan: RowRecord[];
    rekapUjian: RowRecord[];
    penyerahanRaport: RowRecord[];
    penyerahanIjazah: RowRecord[];
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
  identitas: {
    fotoKepalaSekolah: string;
    namaKepalaSekolah: string;
    nipKepalaSekolah: string;
    jabatanKepalaSekolah: string;
    golonganKepalaSekolah: string;
    namaSekolah: string;
    npsn: string;
    alamat: string;
    kelurahan: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    kodePos: string;
    telepon: string;
    email: string;
    website: string;
  };
};

const DEFAULT_SCHOOL_DATA: SchoolData = {
  kesiswaan: {
    induk: [],
    akademikPrestasi: [],
    akademikKenaikan: [],
    rekapUjian: [],
    penyerahanRaport: [],
    penyerahanIjazah: [],
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
  identitas: {
    fotoKepalaSekolah: "",
    namaKepalaSekolah: "",
    nipKepalaSekolah: "",
    jabatanKepalaSekolah: "",
    golonganKepalaSekolah: "",
    namaSekolah: "",
    npsn: "",
    alamat: "",
    kelurahan: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    kodePos: "",
    telepon: "",
    email: "",
    website: "",
  },
};

const STORAGE_KEY = 'super-app-school-data';

export const getSchoolData = (): SchoolData => {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_DATA;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_SCHOOL_DATA;
  try {
    const parsed = JSON.parse(data) as Partial<SchoolData>;
    return {
      ...DEFAULT_SCHOOL_DATA,
      ...parsed,
      kesiswaan: { ...DEFAULT_SCHOOL_DATA.kesiswaan, ...(parsed?.kesiswaan ?? {}) },
      kepegawaian: { ...DEFAULT_SCHOOL_DATA.kepegawaian, ...(parsed?.kepegawaian ?? {}) },
      pembelajaran: { ...DEFAULT_SCHOOL_DATA.pembelajaran, ...(parsed?.pembelajaran ?? {}) },
      pkks: { ...DEFAULT_SCHOOL_DATA.pkks, ...(parsed?.pkks ?? {}) },
      identitas: { ...DEFAULT_SCHOOL_DATA.identitas, ...(parsed?.identitas ?? {}) },
    };
  } catch {
    return DEFAULT_SCHOOL_DATA;
  }
};

export const writeSchoolData = (data: SchoolData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getDatasetRows = (section: keyof SchoolData, dataset: string): RowRecord[] | null => {
  const schoolData = getSchoolData();
  const sectionData = schoolData[section] as Record<string, JsonValue>;
  const rows = sectionData?.[dataset];
  return Array.isArray(rows) ? (rows as RowRecord[]) : null;
};

export const appendDatasetRow = (
  section: keyof SchoolData,
  dataset: string,
  row: Record<string, JsonValue>
): RowRecord | null => {
  const schoolData = getSchoolData();
  const sectionData = schoolData[section] as Record<string, JsonValue>;
  if (!Array.isArray(sectionData?.[dataset])) {
    return null;
  }

  const newRow: RowRecord = {
    id: row.id ?? Date.now().toString(),
    ...row,
  };

  sectionData[dataset] = [...(sectionData[dataset] as RowRecord[]), newRow];
  writeSchoolData(schoolData);
  return newRow;
};

export const deleteDatasetRow = (
  section: keyof SchoolData,
  dataset: string,
  id: string
): boolean => {
  const schoolData = getSchoolData();
  const sectionData = schoolData[section] as Record<string, any[]>;
  if (!Array.isArray(sectionData?.[dataset])) {
    return false;
  }
  const originalLength = sectionData[dataset].length;
  sectionData[dataset] = sectionData[dataset].filter((row) => row.id !== id);
  if (sectionData[dataset].length === originalLength) {
    return false;
  }
  writeSchoolData(schoolData);
  return true;
};

export const updateDatasetRow = (
  section: keyof SchoolData,
  dataset: string,
  id: string,
  row: Record<string, JsonValue>
): RowRecord | null => {
  const schoolData = getSchoolData();
  const sectionData = schoolData[section] as Record<string, any[]>;
  if (!Array.isArray(sectionData?.[dataset])) {
    return null;
  }
  const idx = sectionData[dataset].findIndex((r) => r.id === id);
  if (idx === -1) {
    return null;
  }
  sectionData[dataset][idx] = {
    ...sectionData[dataset][idx],
    ...row,
    id, // ensure ID doesn't change
  };
  writeSchoolData(schoolData);
  return sectionData[dataset][idx];
};

export const importDatasetRows = (
  section: keyof SchoolData,
  dataset: string,
  rows: Record<string, JsonValue>[],
  mode: 'append' | 'overwrite' = 'append'
): RowRecord[] | null => {
  const schoolData = getSchoolData();
  const sectionData = schoolData[section] as Record<string, any[]>;
  if (!Array.isArray(sectionData?.[dataset])) {
    return null;
  }

  const newRows = rows.map((row, i) => ({
    id: row.id ?? `${Date.now() + i}-${Math.random().toString(36).substring(2, 9)}`,
    ...row,
  }));

  if (mode === 'overwrite') {
    sectionData[dataset] = newRows;
  } else {
    sectionData[dataset] = [...sectionData[dataset], ...newRows];
  }

  writeSchoolData(schoolData);
  return newRows;
};

export const getPkksState = (): SchoolData['pkks'] => {
  const schoolData = getSchoolData();
  return schoolData.pkks;
};

export const updatePkksState = (newData: Partial<SchoolData['pkks']>): SchoolData['pkks'] => {
  const schoolData = getSchoolData();
  schoolData.pkks = {
    completedIndicators: newData?.completedIndicators ?? schoolData.pkks.completedIndicators,
    links: newData?.links ?? schoolData.pkks.links,
  };
  writeSchoolData(schoolData);
  return schoolData.pkks;
};

// Kesiswaan
export const getDataKesiswaan = (): RowRecord[] => {
  const rows = getDatasetRows('kesiswaan', 'induk');
  return rows ?? [];
};
export const addDataKesiswaan = (newData: Record<string, JsonValue>): RowRecord | null => {
  return appendDatasetRow('kesiswaan', 'induk', newData);
};
export const overwriteDataKesiswaan = (newDataList: Record<string, JsonValue>[]): RowRecord[] => {
  const schoolData = getSchoolData();
  schoolData.kesiswaan.induk = newDataList as RowRecord[];
  writeSchoolData(schoolData);
  return schoolData.kesiswaan.induk;
};

// Kepegawaian
export const getDataKepegawaian = (): RowRecord[] => {
  const rows = getDatasetRows('kepegawaian', 'pegawai');
  return rows ?? [];
};
export const addDataKepegawaian = (newData: Record<string, JsonValue>): RowRecord | null => {
  return appendDatasetRow('kepegawaian', 'pegawai', newData);
};

// PKKS
export const getDataPkks = (): SchoolData['pkks'] => {
  return getPkksState();
};
export const updateDataPkks = (newData: Partial<SchoolData['pkks']>): SchoolData['pkks'] => {
  return updatePkksState(newData);
};

// Identitas
export const getIdentitas = (): SchoolData['identitas'] => {
  const schoolData = getSchoolData();
  return schoolData.identitas;
};

export const updateIdentitas = (newData: Partial<SchoolData['identitas']>): SchoolData['identitas'] => {
  const schoolData = getSchoolData();
  schoolData.identitas = {
    ...schoolData.identitas,
    ...newData,
  };
  writeSchoolData(schoolData);
  return schoolData.identitas;
};

export const resetSchoolData = (): SchoolData => {
  writeSchoolData(DEFAULT_SCHOOL_DATA);
  return DEFAULT_SCHOOL_DATA;
};
