import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'kesiswaan.json');

// Pastikan direktori dan file JSON ada
const ensureFileExists = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  try {
    await fs.access(FILE_PATH);
  } catch (error) {
    // Jika file belum ada, inisialisasi dengan array kosong
    await fs.writeFile(FILE_PATH, JSON.stringify([]), 'utf-8');
  }
};

export const getDataKesiswaan = async () => {
  await ensureFileExists();
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
};

export const addDataKesiswaan = async (newData: any) => {
  await ensureFileExists();
  const currentData = await getDataKesiswaan();
  currentData.push(newData);
  await fs.writeFile(FILE_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
  return newData;
};
