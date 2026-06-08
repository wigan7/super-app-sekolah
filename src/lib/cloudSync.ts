import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveDataToCloud = async (uid: string, data: any) => {
  if (!db) throw new Error("Firestore belum diinisialisasi.");
  if (!uid) throw new Error("Pengguna belum login.");

  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {
    schoolData: data,
    lastUpdated: new Date().toISOString()
  }, { merge: true });
};

export const loadDataFromCloud = async (uid: string) => {
  if (!db) throw new Error("Firestore belum diinisialisasi.");
  if (!uid) throw new Error("Pengguna belum login.");

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().schoolData;
  } else {
    throw new Error("Tidak ada data cadangan di Cloud.");
  }
};
