import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Helper untuk memastikan file ada
const ensureFileExists = async (fileName: string, defaultData: any = []) => {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  const filePath = path.join(DATA_DIR, fileName);
  try {
    await fs.access(filePath);
  } catch (error) {
    // Jika file belum ada, inisialisasi dengan data default
    await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

// Generic read
export const getData = async (fileName: string, defaultData: any = []) => {
  await ensureFileExists(fileName, defaultData);
  const filePath = path.join(DATA_DIR, fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

// Generic write
export const writeData = async (fileName: string, data: any) => {
  await ensureFileExists(fileName);
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Kesiswaan
export const getDataKesiswaan = async () => getData('kesiswaan.json');
export const addDataKesiswaan = async (newData: any) => {
  const currentData = await getDataKesiswaan();
  currentData.push(newData);
  await writeData('kesiswaan.json', currentData);
  return newData;
};

// Kepegawaian
export const getDataKepegawaian = async () => getData('kepegawaian.json');
export const addDataKepegawaian = async (newData: any) => {
  const currentData = await getDataKepegawaian();
  currentData.push(newData);
  await writeData('kepegawaian.json', currentData);
  return newData;
};

// PKKS
export const getDataPkks = async () => {
  return getData('pkks.json', { completedIndicators: {}, links: {} });
};
export const updateDataPkks = async (newData: any) => {
  await writeData('pkks.json', newData);
  return newData;
};
