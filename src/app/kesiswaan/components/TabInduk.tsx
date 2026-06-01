"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PendaftaranSheet from "./PendaftaranSheet";
import { motion, AnimatePresence } from "framer-motion";
import { FileSpreadsheet, Download, Upload, AlertTriangle, Plus, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { getDataKesiswaan, getIdentitas, overwriteDataKesiswaan, addDataKesiswaan } from "@/lib/clientDb";

const EXCEL_HEADERS = [
  // 1. Identitas Siswa
  "Nama", "NIS", "Jenis Kelamin", "NISN", "Tempat Lahir", "Tanggal Lahir", "NIK", "Agama", "Alamat", "RT", "RW", "Dusun", "Kelurahan", "Kecamatan", "Kode Pos", "Jenis Tinggal", "Alat Transportasi", "Telepon", "HP", "E-Mail", "SKHUN", "Penerima KPS", "No. KPS",
  // 2. Orang Tua & Wali
  "Nama Ayah", "Tahun Lahir Ayah", "Jenjang Pendidikan Ayah", "Pekerjaan Ayah", "Penghasilan Ayah", "NIK Ayah", "Nama Ibu", "Tahun Lahir Ibu", "Jenjang Pendidikan Ibu", "Pekerjaan Ibu", "Penghasilan Ibu", "NIK Ibu", "Nama Wali", "Tahun Lahir Wali", "Jenjang Pendidikan Wali", "Pekerjaan Wali", "Penghasilan Wali", "NIK Wali",
  // 3. Akademik, Bantuan & Fisik
  "Rombel Saat Ini", "No Peserta Ujian Nasional", "No Seri Ijazah", "Penerima KIP", "Nomor KIP", "Nama di KIP", "Nomor KKS", "No Registrasi Akta Lahir", "Bank", "Nomor Rekening Bank", "Rekening Atas Nama", "Layak PIP (usulan dari sekolah)", "Alasan Layak PIP", "Kebutuhan Khusus", "Sekolah Asal", "Anak ke-berapa", "Lintang", "Bujur", "No KK", "Berat Badan", "Tinggi Badan", "Lingkar Kepala", "Jml. Saudara Kandung", "Jarak Rumah ke Sekolah (KM)"
];

const ALIAS_MAPPING: Record<string, string[]> = {
  nama: ["Nama", "Nama Lengkap", "Nama Siswa", "Nama Peserta Didik", "Nama PD"],
  nis: ["NIS", "NIPD", "Nomor Induk", "Nomor Induk Siswa", "No Induk", "No. Induk"],
  jk: ["Jenis Kelamin", "JK", "Jk", "Sex", "Gender"],
  nisn: ["NISN", "Nisn", "Nomor Induk Siswa Nasional"],
  tempatLahir: ["Tempat Lahir", "Tempat lahir", "Tpt Lahir"],
  tanggalLahir: ["Tanggal Lahir", "Tanggal lahir", "Tgl Lahir", "Tgl. Lahir"],
  nik: ["NIK", "Nik", "Nomor Induk Kependudukan", "No. NIK", "No NIK"],
  agama: ["Agama", "Agama & Kepercayaan"],
  alamat: ["Alamat", "Alamat Jalan", "Alamat Tinggal"],
  rt: ["RT", "Rt", "R.T."],
  rw: ["RW", "Rw", "R.W."],
  dusun: ["Dusun", "Nama Dusun", "Dukuh", "Nama Dukuh"],
  kelurahan: ["Kelurahan", "Kelurahan/Desa", "Kelurahan / Desa", "Desa"],
  kecamatan: ["Kecamatan", "Kec"],
  kodePos: ["Kode Pos", "Kodepos", "Kode POS"],
  jenisTinggal: ["Jenis Tinggal", "Tinggal Dengan", "Jenis Tempat Tinggal"],
  alatTransportasi: ["Alat Transportasi", "Transportasi", "Kendaraan"],
  telepon: ["Telepon", "No Telepon", "No. Telepon", "Telp", "No. Telp"],
  noHp: ["HP", "HP", "No HP", "No. HP", "Nomor HP", "Handphone", "No Handphone"],
  email: ["E-Mail", "Email", "E-mail"],
  skhun: ["SKHUN", "Skhun", "No. SKHUN", "Nomor SKHUN"],
  penerimaKps: ["Penerima KPS", "Penerima Kps", "KPS"],
  noKps: ["No. KPS", "No KPS", "Nomor KPS"],
  
  namaAyah: ["Nama Ayah", "Nama Ayah Kandung", "Ayah"],
  tahunLahirAyah: ["Tahun Lahir Ayah", "Thn Lahir Ayah", "Tahun Lahir Ayah Kandung"],
  pendidikanAyah: ["Jenjang Pendidikan Ayah", "Pendidikan Ayah", "Pendidikan Terakhir Ayah"],
  pekerjaanAyah: ["Pekerjaan Ayah", "Pekerjaan Ayah Kandung"],
  penghasilanAyah: ["Penghasilan Ayah", "Penghasilan Bulanan Ayah", "Gaji Ayah"],
  nikAyah: ["NIK Ayah", "NIK Ayah Kandung"],
  
  namaIbu: ["Nama Ibu", "Nama Ibu Kandung", "Ibu"],
  tahunLahirIbu: ["Tahun Lahir Ibu", "Thn Lahir Ibu", "Tahun Lahir Ibu Kandung"],
  pendidikanIbu: ["Jenjang Pendidikan Ibu", "Pendidikan Ibu", "Pendidikan Terakhir Ibu"],
  pekerjaanIbu: ["Pekerjaan Ibu", "Pekerjaan Ibu Kandung"],
  penghasilanIbu: ["Penghasilan Ibu", "Penghasilan Bulanan Ibu", "Gaji Ibu"],
  nikIbu: ["NIK Ibu", "NIK Ibu Kandung"],
  
  namaWali: ["Nama Wali", "Wali"],
  tahunLahirWali: ["Tahun Lahir Wali", "Thn Lahir Wali"],
  pendidikanWali: ["Jenjang Pendidikan Wali", "Pendidikan Wali", "Pendidikan Terakhir Wali"],
  pekerjaanWali: ["Pekerjaan Wali", "Pekerjaan Wali"],
  penghasilanWali: ["Penghasilan Wali", "Penghasilan Bulanan Wali"],
  nikWali: ["NIK Wali"],
  
  kelas: ["Rombel Saat Ini", "Rombel", "Kelas", "Rombongan Belajar"],
  noUn: ["No Peserta Ujian Nasional", "Nomor Peserta UN", "No Peserta UN", "No UN", "Nomor UN"],
  noIjazah: ["No Seri Ijazah", "No Seri Ijazah", "Nomor Ijazah", "No. Ijazah"],
  penerimaKip: ["Penerima KIP", "KIP"],
  noKip: ["Nomor KIP", "No. KIP", "No KIP"],
  namaKip: ["Nama di KIP", "Nama KIP", "Nama Pada KIP"],
  noKks: ["Nomor KKS", "No. KKS", "No KKS", "KKS"],
  noAkta: ["No Registrasi Akta Lahir", "No Registrasi Akta", "No Akta Lahir", "Nomor Akta Lahir", "No. Akta", "No Akta"],
  bank: ["Bank", "Nama Bank"],
  noRekening: ["Nomor Rekening Bank", "No Rekening Bank", "No. Rekening Bank", "No Rekening", "Nomor Rekening", "No. Rekening"],
  rekeningNama: ["Rekening Atas Nama", "Atas Nama Rekening", "Nama di Rekening", "Nama Pemilik Rekening"],
  layakPip: ["Layak PIP (usulan dari sekolah)", "Layak PIP", "Usulan PIP", "Layak PIP?"],
  alasanPip: ["Alasan Layak PIP", "Alasan PIP"],
  kebutuhanKhusus: ["Kebutuhan Khusus", "Berkebutuhan Khusus", "Kebutuhan Khusus Siswa"],
  sekolahAsal: ["Sekolah Asal", "Asal Sekolah", "Nama Sekolah Asal"],
  anakKe: ["Anak ke-berapa", "Anak Ke-berapa", "Anak Keberapa", "Anak Ke", "Anak ke"],
  lintang: ["Lintang", "Latitude", "Garisan Lintang"],
  bujur: ["Bujur", "Longitude", "Garisan Bujur"],
  noKk: ["No KK", "Nomor KK", "No. KK", "Nomor Kartu Keluarga", "No Kartu Keluarga"],
  beratBadan: ["Berat Badan", "Berat Badan (kg)", "Berat", "BB"],
  tinggiBadan: ["Tinggi Badan", "Tinggi Badan (cm)", "Tinggi", "TB"],
  lingkarKepala: ["Lingkar Kepala", "Lingkar Kepala (cm)", "Lingkar"],
  saudaraKandung: ["Jml. Saudara Kandung", "Jumlah Saudara Kandung", "Jml Saudara", "Jumlah Saudara"],
  jarakSekolah: ["Jarak Rumah ke Sekolah (KM)", "Jarak Rumah ke Sekolah", "Jarak Sekolah", "Jarak (KM)", "Jarak"]
};

const normalizeKey = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const getValueByAliases = (normalizedRow: Record<string, any>, aliases: string[]): string => {
  for (const alias of aliases) {
    const normAlias = normalizeKey(alias);
    if (normalizedRow[normAlias] !== undefined && normalizedRow[normAlias] !== null) {
      return normalizedRow[normAlias].toString().trim();
    }
  }
  return "";
};

const getNormalizedJk = (val: string): string => {
  const normalized = val.trim().toLowerCase();
  if (normalized.startsWith("l")) return "L";
  if (normalized.startsWith("p")) return "P";
  return "L"; // default safe fallback
};

export default function TabInduk() {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [namaSekolah, setNamaSekolah] = useState("");
  const [pendingImportData, setPendingImportData] = useState<Record<string, any>[] | null>(null);
  const [importFileName, setImportFileName] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchData = () => {
    setLoading(true);
    try {
      const data = getDataKesiswaan();
      setData(data as Record<string, string>[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const fetchSchoolName = () => {
      try {
        const data = getIdentitas();
        setNamaSekolah(data?.namaSekolah || "");
      } catch (error) {
        console.error("Gagal memuat nama sekolah di kesiswaan:", error);
      }
    };
    fetchSchoolName();
  }, []);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS]);
    worksheet["!cols"] = EXCEL_HEADERS.map(() => ({ wch: 22 })); // clean columns fit

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Template_Impor_Siswa.xlsx");
  };

  const exportExcel = () => {
    if (data.length === 0) {
      alert("Tidak ada data siswa untuk diekspor.");
      return;
    }

    const exportRows = data.map((item: any) => {
      const row: Record<string, any> = {};
      
      row["Nama"] = item.nama || "";
      row["NIS"] = item.nis || "";
      row["Jenis Kelamin"] = item.jk || "";
      row["NISN"] = item.nisn || "";
      row["Tempat Lahir"] = item.tempatLahir || "";
      row["Tanggal Lahir"] = item.tanggalLahir || "";
      row["NIK"] = item.nik || "";
      row["Agama"] = item.agama || "";
      row["Alamat"] = item.alamat || "";
      row["RT"] = item.rt || "";
      row["RW"] = item.rw || "";
      row["Dusun"] = item.dusun || "";
      row["Kelurahan"] = item.kelurahan || "";
      row["Kecamatan"] = item.kecamatan || "";
      row["Kode Pos"] = item.kodePos || "";
      row["Jenis Tinggal"] = item.jenisTinggal || "";
      row["Alat Transportasi"] = item.alatTransportasi || "";
      row["Telepon"] = item.telepon || "";
      row["HP"] = item.noHp || "";
      row["E-Mail"] = item.email || "";
      row["SKHUN"] = item.skhun || "";
      row["Penerima KPS"] = item.penerimaKps || "";
      row["No. KPS"] = item.noKps || "";
      
      row["Nama Ayah"] = item.namaAyah || "";
      row["Tahun Lahir Ayah"] = item.tahunLahirAyah || "";
      row["Jenjang Pendidikan Ayah"] = item.pendidikanAyah || "";
      row["Pekerjaan Ayah"] = item.pekerjaanAyah || "";
      row["Penghasilan Ayah"] = item.penghasilanAyah || "";
      row["NIK Ayah"] = item.nikAyah || "";
      row["Nama Ibu"] = item.namaIbu || "";
      row["Tahun Lahir Ibu"] = item.tahunLahirIbu || "";
      row["Jenjang Pendidikan Ibu"] = item.pendidikanIbu || "";
      row["Pekerjaan Ibu"] = item.pekerjaanIbu || "";
      row["Penghasilan Ibu"] = item.penghasilanIbu || "";
      row["NIK Ibu"] = item.nikIbu || "";
      row["Nama Wali"] = item.namaWali || "";
      row["Tahun Lahir Wali"] = item.tahunLahirWali || "";
      row["Jenjang Pendidikan Wali"] = item.pendidikanWali || "";
      row["Pekerjaan Wali"] = item.pekerjaanWali || "";
      row["Penghasilan Wali"] = item.penghasilanWali || "";
      row["NIK Wali"] = item.nikWali || "";
      
      row["Rombel Saat Ini"] = item.kelas || "";
      row["No Peserta Ujian Nasional"] = item.noUn || "";
      row["No Seri Ijazah"] = item.noIjazah || "";
      row["Penerima KIP"] = item.penerimaKip || "";
      row["Nomor KIP"] = item.noKip || "";
      row["Nama di KIP"] = item.namaKip || "";
      row["Nomor KKS"] = item.noKks || "";
      row["No Registrasi Akta Lahir"] = item.noAkta || "";
      row["Bank"] = item.bank || "";
      row["Nomor Rekening Bank"] = item.noRekening || "";
      row["Rekening Atas Nama"] = item.rekeningNama || "";
      row["Layak PIP (usulan dari sekolah)"] = item.layakPip || "";
      row["Alasan Layak PIP"] = item.alasanPip || "";
      row["Kebutuhan Khusus"] = item.kebutuhanKhusus || "";
      row["Sekolah Asal"] = item.sekolahAsal || "";
      row["Anak ke-berapa"] = item.anakKe || "";
      row["Lintang"] = item.lintang || "";
      row["Bujur"] = item.bujur || "";
      row["No KK"] = item.noKk || "";
      row["Berat Badan"] = item.beratBadan || "";
      row["Tinggi Badan"] = item.tinggiBadan || "";
      row["Lingkar Kepala"] = item.lingkarKepala || "";
      row["Jml. Saudara Kandung"] = item.saudaraKandung || "";
      row["Jarak Rumah ke Sekolah (KM)"] = item.jarakSekolah || "";
      
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = EXCEL_HEADERS.map(() => ({ wch: 22 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Siswa");

    const cleanSchoolName = namaSekolah ? namaSekolah.replace(/[^a-zA-Z0-9\s]/g, "").trim().replace(/\s+/g, "_") : "Sekolah";
    XLSX.writeFile(workbook, `Data_Siswa_${cleanSchoolName}.xlsx`);
  };

  const importExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ""; // Reset value for future imports

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bytes = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(bytes, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to Array of Arrays (AOA) for maximum robustness with multi-row headers & merged cells
        const AOA = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (AOA.length === 0) {
          alert("Berkas Excel kosong atau format header tidak sesuai.");
          setImporting(false);
          return;
        }

        // Find the main header row dynamically by scanning rows for known student columns
        let headerRowIndex = -1;
        for (let r = 0; r < AOA.length; r++) {
          const row = AOA[r];
          if (Array.isArray(row)) {
            const hasNama = row.some(cell => cell?.toString().trim().toLowerCase() === "nama");
            const hasNisn = row.some(cell => cell?.toString().trim().toLowerCase() === "nisn");
            const hasNipd = row.some(cell => cell?.toString().trim().toLowerCase() === "nipd");
            const hasNik = row.some(cell => cell?.toString().trim().toLowerCase() === "nik");
            
            if (hasNama && (hasNisn || hasNipd || hasNik)) {
              headerRowIndex = r;
              break;
            }
          }
        }

        // Fallback to row 0 if no header found
        if (headerRowIndex === -1) {
          headerRowIndex = 0;
        }

        // 1. Build dynamic column map mapping each Column Index -> target database field key
        const headerRow = AOA[headerRowIndex];
        const colFieldMap: Record<number, string> = {};

        const resolveField = (parent: string, header: string): string | null => {
          const normParent = parent.toLowerCase().replace(/[^a-z0-9]/g, "");
          const normHeader = header.toLowerCase().replace(/[^a-z0-9]/g, "");
          
          // Parent / Wali contexts
          if (normParent.includes("ayah")) {
            if (normHeader === "nama" || normHeader.includes("nama")) return "namaAyah";
            if (normHeader.includes("tahunlahir") || normHeader.includes("thnlahir")) return "tahunLahirAyah";
            if (normHeader.includes("jenjangpendidikan") || normHeader.includes("pendidikan")) return "pendidikanAyah";
            if (normHeader.includes("pekerjaan")) return "pekerjaanAyah";
            if (normHeader.includes("penghasilan")) return "penghasilanAyah";
            if (normHeader.includes("nik")) return "nikAyah";
          }
          
          if (normParent.includes("ibu")) {
            if (normHeader === "nama" || normHeader.includes("nama")) return "namaIbu";
            if (normHeader.includes("tahunlahir") || normHeader.includes("thnlahir")) return "tahunLahirIbu";
            if (normHeader.includes("jenjangpendidikan") || normHeader.includes("pendidikan")) return "pendidikanIbu";
            if (normHeader.includes("pekerjaan")) return "pekerjaanIbu";
            if (normHeader.includes("penghasilan")) return "penghasilanIbu";
            if (normHeader.includes("nik")) return "nikIbu";
          }
          
          if (normParent.includes("wali")) {
            if (normHeader === "nama" || normHeader.includes("nama")) return "namaWali";
            if (normHeader.includes("tahunlahir") || normHeader.includes("thnlahir")) return "tahunLahirWali";
            if (normHeader.includes("jenjangpendidikan") || normHeader.includes("pendidikan")) return "pendidikanWali";
            if (normHeader.includes("pekerjaan")) return "pekerjaanWali";
            if (normHeader.includes("penghasilan")) return "penghasilanWali";
            if (normHeader.includes("nik")) return "nikWali";
          }
          
          // Fallback to exact alias matching
          for (const [key, aliases] of Object.entries(ALIAS_MAPPING)) {
            for (const alias of aliases) {
              if (normalizeKey(alias) === normHeader) {
                return key;
              }
            }
          }
          
          return null;
        };

        for (let c = 0; c < headerRow.length; c++) {
          const cellVal = headerRow[c];
          if (cellVal === undefined || cellVal === null || cellVal === "") continue;
          
          const headerText = cellVal.toString().trim();
          
          // Retrieve the parent category cell above the header (handles merged cells like "Data Ayah")
          let parentText = "";
          if (headerRowIndex > 0) {
            for (let col = c; col >= 0; col--) {
              const parentVal = AOA[headerRowIndex - 1]?.[col];
              if (parentVal !== undefined && parentVal !== null && parentVal !== "") {
                parentText = parentVal.toString().trim();
                break;
              }
            }
          }

          const resolvedKey = resolveField(parentText, headerText);
          if (resolvedKey) {
            colFieldMap[c] = resolvedKey;
          }
        }

        // 2. Parse data rows starting from headerRowIndex + 1
        const mappedData: Record<string, any>[] = [];
        for (let r = headerRowIndex + 1; r < AOA.length; r++) {
          const rowData = AOA[r];
          if (!rowData || rowData.length === 0) continue;

          // Check if it's a completely empty row or header note
          const isRowEmpty = rowData.every(cell => cell === undefined || cell === null || cell === "");
          if (isRowEmpty) continue;

          const student: Record<string, any> = {
            status: "Aktif",
            kelas: "1" // default fallback rombel
          };

          let hasAnyData = false;
          Object.keys(colFieldMap).forEach((colIdxStr) => {
            const colIdx = parseInt(colIdxStr, 10);
            const key = colFieldMap[colIdx];
            const rawVal = rowData[colIdx];
            if (rawVal !== undefined && rawVal !== null && rawVal !== "") {
              const val = rawVal.toString().trim();
              if (val !== "") {
                if (key === "jk") {
                  student[key] = getNormalizedJk(val);
                } else {
                  student[key] = val;
                }
                hasAnyData = true;
              }
            }
          });

          // Only keep student record if there's actual data (especially a name)
          if (hasAnyData && student.nama) {
            mappedData.push(student);
          }
        }

        if (mappedData.length === 0) {
          alert("Gagal mengimpor data. Pastikan lembar kerja memiliki baris data siswa yang valid.");
          setImporting(false);
          return;
        }

        // Instead of immediate save, store pending import data and show prompt choice
        setPendingImportData(mappedData);
        setImportFileName(file.name);
        setShowImportModal(true);
      } catch (err) {
        console.error(err);
        alert("Gagal membaca berkas Excel. Pastikan format kolom sesuai.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const confirmImport = (mode: "append" | "overwrite") => {
    if (!pendingImportData) return;
    
    setImporting(true);
    setShowImportModal(false);
    try {
      if (mode === "overwrite") {
        overwriteDataKesiswaan(pendingImportData);
      } else {
        pendingImportData.forEach(row => addDataKesiswaan(row));
      }

      alert(
        mode === "overwrite"
          ? `Impor Sukses! Berhasil menimpa Buku Induk dengan ${pendingImportData.length} data siswa dari DAPODIK.`
          : `Impor Sukses! Berhasil menambahkan ${pendingImportData.length} data siswa baru dari DAPODIK.`
      );
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah data.");
    } finally {
      setImporting(false);
      setPendingImportData(null);
      setImportFileName("");
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
        <div className="space-y-2">
          <CardTitle className="text-xl font-semibold text-slate-900">Buku Induk & Klapper</CardTitle>
          <CardDescription className="text-slate-500">Kelola data induk seluruh siswa {namaSekolah || "(Belum input Nama Sekolah)"}.</CardDescription>
          
          <div className="inline-flex items-start gap-2 px-3 py-2 rounded-xl text-[11px] font-medium leading-relaxed text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 dark:text-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-900/50 backdrop-blur-md max-w-lg shadow-2xs">
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-indigo-500 animate-pulse mt-1" />
            <span>💡 <strong>Integrasi Dapodik Aktif:</strong> Anda dapat langsung mengunggah file Excel hasil ekspor <strong>DAPODIK (F-PD)</strong> asli. Kunci kolom dan data akan disesuaikan otomatis!</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Download Template Button */}
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-97"
            title="Unduh template Excel kosong"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Template Excel</span>
          </button>

          {/* Import Excel Button */}
          <label
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-97"
            title="Impor siswa baru dari berkas Excel"
          >
            {importing ? (
              <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{importing ? "Mengimpor..." : "Impor Excel"}</span>
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={importExcel}
              disabled={importing || loading}
            />
          </label>

          {/* Export Excel Button */}
          <button
            onClick={exportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 bg-white/70 backdrop-blur-md border border-slate-200/50 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-97"
            title="Ekspor seluruh data siswa ke berkas Excel"
            disabled={loading || data.length === 0}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>Ekspor Excel</span>
          </button>

          <PendaftaranSheet onSuccess={fetchData} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="w-20">No</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>L/P</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <motion.tr
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b transition-colors"
                    >
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    </motion.tr>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500 font-medium">
                      Belum ada data siswa. Silakan tambahkan manual atau impor lewat Excel.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((siswa, index) => (
                    <motion.tr
                      key={siswa.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-700">{siswa.nisn || "-"}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{siswa.nama || "-"}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{siswa.kelas || "-"}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{siswa.jk || "-"}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20 shadow-2xs">
                          {siswa.status}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Import Mode Selection Dialog (Premium Glassmorphism Style) */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl p-6 dark:bg-slate-950/95 dark:border-slate-800/50 flex flex-col gap-4">
          <DialogHeader className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Pilih Mode Impor Data</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Berkas <span className="font-semibold text-slate-700 dark:text-slate-300">{importFileName}</span> berhasil dianalisis.
              Ditemukan <span className="font-bold text-indigo-600 dark:text-indigo-400">{pendingImportData?.length}</span> data siswa valid.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300 shadow-2xs">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <strong>Perhatian:</strong> Pilihan <strong>Timpa Data</strong> akan menghapus seluruh data siswa di Buku Induk saat ini secara permanen sebelum memasukkan data baru dari Excel.
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2">
            <button
              onClick={() => {
                setShowImportModal(false);
                setPendingImportData(null);
                setImportFileName("");
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-all cursor-pointer active:scale-97"
            >
              Batal
            </button>
            <button
              onClick={() => confirmImport("append")}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all cursor-pointer active:scale-97"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Data
            </button>
            <button
              onClick={() => confirmImport("overwrite")}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-all cursor-pointer active:scale-97"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-reverse" />
              Timpa Data
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
