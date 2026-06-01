"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Plus, Trash2, PieChart, Users, Calendar, Filter, 
  Download, Upload, FileSpreadsheet, AlertTriangle, RefreshCw 
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows
} from "@/lib/clientDb";

type BulananRow = {
  id: string;
  bulan: string;
  kelas: string;
  total_siswa: number;
  sakit: number;
  izin: number;
  alpa: number;
  efektif: number;
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

const EXCEL_HEADERS = [
  "Bulan", "Kelas", "Total Siswa", "Hari Efektif", "Sakit", "Izin", "Alpa"
];

const ALIAS_MAPPING: Record<string, string[]> = {
  bulan: ["Bulan", "Month", "Bln"],
  kelas: ["Kelas", "Class", "Rombel", "Rombongan Belajar"],
  total_siswa: ["Total Siswa", "Siswa", "Jumlah Siswa", "Total_Siswa", "Student Count"],
  efektif: ["Hari Efektif", "Efektif", "Hari_Efektif", "Effective Days"],
  sakit: ["Sakit", "S", "Sakit (S)"],
  izin: ["Izin", "I", "Izin (I)"],
  alpa: ["Alpa", "Alpha", "A", "Alpa (A)"]
};

const normalizeKey = (str: string): string => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const EMPTY_FORM = {
  bulan: "Januari",
  kelas: "",
  total_siswa: "30",
  sakit: "0",
  izin: "0",
  alpa: "0",
  efektif: "20",
};

export default function TabKehadiran() {
  const [rows, setRows] = useState<BulananRow[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  // Import states
  const [importing, setImporting] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<Record<string, any>[] | null>(null);
  const [importFileName, setImportFileName] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // Filters
  const [filterKelas, setFilterKelas] = useState("all");
  const [filterBulan, setFilterBulan] = useState("all");

  const fetchRows = () => {
    try {
      const data = getDatasetRows("kesiswaan", "kehadiranBulanan");
      setRows(Array.isArray(data) ? (data as BulananRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat data kehadiran:", error);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleSave = () => {
    if (!form.kelas.trim()) {
      alert("Silakan isi nama kelas!");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        bulan: form.bulan,
        kelas: form.kelas.trim().toUpperCase(),
        total_siswa: Number(form.total_siswa || 0),
        sakit: Number(form.sakit || 0),
        izin: Number(form.izin || 0),
        alpa: Number(form.alpa || 0),
        efektif: Number(form.efektif || 0),
      };

      appendDatasetRow("kesiswaan", "kehadiranBulanan", payload);

      setForm(EMPTY_FORM);
      setOpen(false);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data kehadiran.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data kehadiran ini?")) {
      return;
    }

    try {
      deleteDatasetRow("kesiswaan", "kehadiranBulanan", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data.");
    }
  };

  // Excel integration helpers
  const downloadTemplate = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS]);
    worksheet["!cols"] = EXCEL_HEADERS.map(() => ({ wch: 18 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Template_Kehadiran_Bulanan.xlsx");
  };

  const exportExcel = () => {
    if (filteredRows.length === 0) {
      alert("Tidak ada data kehadiran untuk diekspor.");
      return;
    }

    const exportData = filteredRows.map((item) => ({
      "Bulan": item.bulan,
      "Kelas": item.kelas,
      "Total Siswa": item.total_siswa,
      "Hari Efektif": item.efektif,
      "Sakit": item.sakit,
      "Izin": item.izin,
      "Alpa": item.alpa
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet["!cols"] = EXCEL_HEADERS.map(() => ({ wch: 18 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kehadiran");
    XLSX.writeFile(workbook, "Data_Kehadiran_Bulanan.xlsx");
  };

  const importExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = ""; // Reset file selector

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const bytes = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(bytes, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const AOA = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (AOA.length === 0) {
          alert("Berkas Excel kosong atau tidak sesuai.");
          setImporting(false);
          return;
        }

        // Find header row
        let headerRowIndex = -1;
        for (let r = 0; r < AOA.length; r++) {
          const row = AOA[r];
          if (Array.isArray(row)) {
            const hasBulan = row.some(cell => cell?.toString().trim().toLowerCase().includes("bulan"));
            const hasKelas = row.some(cell => cell?.toString().trim().toLowerCase().includes("kelas"));
            if (hasBulan || hasKelas) {
              headerRowIndex = r;
              break;
            }
          }
        }

        if (headerRowIndex === -1) {
          headerRowIndex = 0;
        }

        const headerRow = AOA[headerRowIndex];
        const colFieldMap: Record<number, string> = {};

        // Map column indices to keys
        for (let c = 0; c < headerRow.length; c++) {
          const cellVal = headerRow[c];
          if (cellVal === undefined || cellVal === null || cellVal === "") continue;

          const normHeader = normalizeKey(cellVal.toString());
          for (const [key, aliases] of Object.entries(ALIAS_MAPPING)) {
            if (aliases.some(alias => normalizeKey(alias) === normHeader)) {
              colFieldMap[c] = key;
              break;
            }
          }
        }

        const parsedRows: Record<string, any>[] = [];
        for (let r = headerRowIndex + 1; r < AOA.length; r++) {
          const rowData = AOA[r];
          if (!rowData || rowData.length === 0) continue;

          const isEmpty = rowData.every(cell => cell === undefined || cell === null || cell === "");
          if (isEmpty) continue;

          const item: Record<string, any> = {
            bulan: "Januari",
            kelas: "",
            total_siswa: 30,
            efektif: 20,
            sakit: 0,
            izin: 0,
            alpa: 0,
          };

          let hasData = false;
          Object.entries(colFieldMap).forEach(([colIdxStr, key]) => {
            const colIdx = parseInt(colIdxStr, 10);
            const val = rowData[colIdx];
            if (val !== undefined && val !== null && val !== "") {
              hasData = true;
              if (key === "bulan") {
                const rawBln = val.toString().trim();
                const matchedMonth = MONTHS.find(m => m.toLowerCase() === rawBln.toLowerCase());
                item[key] = matchedMonth || rawBln;
              } else if (key === "kelas") {
                item[key] = val.toString().trim().toUpperCase();
              } else {
                item[key] = Math.max(0, parseInt(val.toString().trim(), 10) || 0);
              }
            }
          });

          if (hasData && item.kelas) {
            parsedRows.push(item);
          }
        }

        if (parsedRows.length === 0) {
          alert("Tidak ditemukan baris data kehadiran yang valid dengan format kolom kelas yang terisi.");
          setImporting(false);
          return;
        }

        setPendingImportData(parsedRows);
        setImportFileName(file.name);
        setShowImportModal(true);
      } catch (err) {
        console.error(err);
        alert("Gagal membaca file Excel. Pastikan format kolom sesuai.");
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
      importDatasetRows("kesiswaan", "kehadiranBulanan", pendingImportData, mode);
      alert(
        mode === "overwrite"
          ? `Sukses! Berhasil menimpa data kehadiran bulanan dengan ${pendingImportData.length} data baru.`
          : `Sukses! Berhasil menambahkan ${pendingImportData.length} data kehadiran baru.`
      );
      fetchRows();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengunggah data.");
    } finally {
      setImporting(false);
      setPendingImportData(null);
      setImportFileName("");
    }
  };

  // Extract unique classes for filter dropdown
  const uniqueClasses = Array.from(
    new Set(rows.map((r) => r.kelas).filter(Boolean))
  ).sort();

  // Filter rows
  const filteredRows = rows.filter((row) => {
    const matchKelas = filterKelas === "all" || row.kelas === filterKelas;
    const matchBulan = filterBulan === "all" || row.bulan === filterBulan;
    return matchKelas && matchBulan;
  });

  // Calculate aggregates for Pie Chart & Stats
  const totalSakit = filteredRows.reduce((sum, r) => sum + Number(r.sakit || 0), 0);
  const totalIzin = filteredRows.reduce((sum, r) => sum + Number(r.izin || 0), 0);
  const totalAlpa = filteredRows.reduce((sum, r) => sum + Number(r.alpa || 0), 0);
  const totalAbsent = totalSakit + totalIzin + totalAlpa;

  // Capacity in student-days: total students * effective days
  const totalCapacity = filteredRows.reduce(
    (sum, r) => sum + Number(r.total_siswa || 30) * Number(r.efektif || 20),
    0
  );

  const totalPresent = Math.max(0, totalCapacity - totalAbsent);

  const percentPresent = totalCapacity > 0 ? (totalPresent / totalCapacity) * 100 : 0;
  const percentAbsent = totalCapacity > 0 ? (totalAbsent / totalCapacity) * 100 : 0;

  // Pie Chart calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = ((100 - percentPresent) / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Dashboard Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* SVG Pie Chart Card */}
        <Card className="md:col-span-2 border border-slate-100 shadow-sm bg-white dark:bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <PieChart className="h-5 w-5 text-blue-500" />
              Diagram Persentase Kehadiran
            </CardTitle>
            <CardDescription>
              Representasi visual siswa masuk vs tidak masuk (sakit, izin, alpa) berdasarkan filter terpilih.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-around gap-6">
            {totalCapacity === 0 ? (
              <div className="h-48 flex items-center justify-center text-slate-400 dark:text-slate-500 font-medium">
                Belum ada data kehadiran untuk divisualisasikan.
              </div>
            ) : (
              <>
                {/* SVG Donut Chart */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Circle Background (Absent / Red slice) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#f43f5e"
                      strokeWidth="14"
                      className="transition-all duration-500 ease-in-out"
                    />
                    {/* Circle Foreground (Present / Green slice) */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="14"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-in-out"
                    />
                  </svg>
                  {/* Center Text */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {percentPresent.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                      Masuk
                    </span>
                  </div>
                </div>

                {/* Legends and detail breakdowns */}
                <div className="space-y-4 w-full max-w-[240px]">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Masuk</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {percentPresent.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak Masuk</span>
                      </div>
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {percentAbsent.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-1.5 text-xs text-slate-500">
                    <div className="flex justify-between">
                      <span>Sakit (S):</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{totalSakit} hari-siswa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Izin (I):</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{totalIzin} hari-siswa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alpha (A):</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{totalAlpa} hari-siswa</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Aggregate Stats Card */}
        <Card className="border border-slate-100 shadow-sm bg-white dark:bg-slate-900/50 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Users className="h-5 w-5 text-indigo-500" />
              Statistik Akumulatif
            </CardTitle>
            <CardDescription>
              Total volume absen berdasarkan filter aktif.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 flex-grow flex flex-col justify-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Hari-Siswa</span>
                <span className="text-xl font-bold text-slate-700 dark:text-slate-200">{totalCapacity}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Kehadiran</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalPresent}</span>
              </div>
            </div>
            <div className="bg-rose-50/50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-100/50 dark:border-rose-950/50">
              <span className="block text-[11px] font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Total Ketidakhadiran</span>
              <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{totalAbsent} <span className="text-sm font-medium text-slate-400">hari-siswa</span></span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table & Filtering */}
      <Card className="border border-slate-100 shadow-sm bg-white dark:bg-slate-900/50">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-50 dark:border-slate-800/50">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Calendar className="h-5 w-5 text-blue-500" />
              Papan Absen Bulanan
            </CardTitle>
            <CardDescription>
              Rekapitulasi dan pelaporan kehadiran siswa per kelas per bulan.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Download Template */}
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="text-xs h-8 text-slate-600 border-slate-200"
              title="Unduh template Excel"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Template Excel</span>
            </Button>

            {/* Import Excel */}
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer h-8">
              {importing ? (
                <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>{importing ? "Mengimpor..." : "Impor Excel"}</span>
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={importExcel}
                disabled={importing}
              />
            </label>

            {/* Export Excel */}
            <Button
              variant="outline"
              size="sm"
              onClick={exportExcel}
              className="text-xs h-8 text-slate-600 border-slate-200"
              disabled={filteredRows.length === 0}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1" />
              <span>Ekspor Excel</span>
            </Button>

            <span className="h-6 w-px bg-slate-200 mx-1 hidden sm:inline-block"></span>

            {/* Filter Kelas */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="text-xs h-8 px-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Semua Kelas</option>
                {uniqueClasses.map((kls) => (
                  <option key={kls} value={kls}>
                    {kls}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Bulan */}
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="text-xs h-8 px-2 rounded-md border border-slate-200 dark:border-slate-800 bg-transparent text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Semua Bulan</option>
              {MONTHS.map((bln) => (
                <option key={bln} value={bln}>
                  {bln}
                </option>
              ))}
            </select>

            {/* Input Data Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={<Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8" />}>
                <Plus className="h-4 w-4 mr-1.5" />
                Input Data
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <DialogHeader>
                  <DialogTitle>Input Kehadiran Bulanan</DialogTitle>
                  <DialogDescription>
                    Simpan data rekapitulasi ketidakhadiran (Sakit, Izin, Alpa) per kelas per bulan.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="bulan">Bulan</Label>
                      <select
                        id="bulan"
                        value={form.bulan}
                        onChange={(e) => setForm((prev) => ({ ...prev, bulan: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 text-slate-800 dark:text-slate-200"
                      >
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="kelas">Kelas</Label>
                      <Input
                        id="kelas"
                        placeholder="Contoh: VII-A"
                        value={form.kelas}
                        onChange={(e) => setForm((prev) => ({ ...prev, kelas: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="total_siswa">Total Siswa</Label>
                      <Input
                        id="total_siswa"
                        type="number"
                        min="1"
                        value={form.total_siswa}
                        onChange={(e) => setForm((prev) => ({ ...prev, total_siswa: e.target.value }))}
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="efektif">Hari Efektif</Label>
                      <Input
                        id="efektif"
                        type="number"
                        min="1"
                        value={form.efektif}
                        onChange={(e) => setForm((prev) => ({ ...prev, efektif: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="sakit" className="text-orange-600 dark:text-orange-400">Sakit (S)</Label>
                      <Input
                        id="sakit"
                        type="number"
                        min="0"
                        value={form.sakit}
                        onChange={(e) => setForm((prev) => ({ ...prev, sakit: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="izin" className="text-blue-600 dark:text-blue-400">Izin (I)</Label>
                      <Input
                        id="izin"
                        type="number"
                        min="0"
                        value={form.izin}
                        onChange={(e) => setForm((prev) => ({ ...prev, izin: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="alpa" className="text-red-600 dark:text-red-400">Alpa (A)</Label>
                      <Input
                        id="alpa"
                        type="number"
                        min="0"
                        value={form.alpa}
                        onChange={(e) => setForm((prev) => ({ ...prev, alpa: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={saving} className="text-xs h-9">
                    Batal
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9">
                    {saving ? "Menyimpan..." : "Simpan Data"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow>
                  <TableHead className="pl-6 py-3 text-slate-600 dark:text-slate-300 font-semibold text-xs">Bulan</TableHead>
                  <TableHead className="py-3 text-slate-600 dark:text-slate-300 font-semibold text-xs">Kelas</TableHead>
                  <TableHead className="py-3 text-center text-slate-600 dark:text-slate-300 font-semibold text-xs">Total Siswa</TableHead>
                  <TableHead className="py-3 text-center text-slate-600 dark:text-slate-300 font-semibold text-xs">Hari Efektif</TableHead>
                  <TableHead className="py-3 text-center text-orange-600 font-semibold text-xs">Sakit (S)</TableHead>
                  <TableHead className="py-3 text-center text-blue-600 font-semibold text-xs">Izin (I)</TableHead>
                  <TableHead className="py-3 text-center text-red-600 font-semibold text-xs">Alpa (A)</TableHead>
                  <TableHead className="py-3 text-center text-slate-600 dark:text-slate-300 font-semibold text-xs">Kapasitas Absen</TableHead>
                  <TableHead className="py-3 text-center text-emerald-600 font-semibold text-xs">Kehadiran (Masuk)</TableHead>
                  <TableHead className="pr-6 py-3 text-center text-slate-600 dark:text-slate-300 font-semibold text-xs">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-28 text-center text-slate-400 font-medium">
                      Tidak ada data kehadiran yang sesuai dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((item) => {
                    const rowCapacity = Number(item.total_siswa || 30) * Number(item.efektif || 20);
                    const rowAbsent = Number(item.sakit || 0) + Number(item.izin || 0) + Number(item.alpa || 0);
                    const rowPresent = Math.max(0, rowCapacity - rowAbsent);
                    const rowPercent = rowCapacity > 0 ? (rowPresent / rowCapacity) * 100 : 0;

                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <TableCell className="pl-6 py-3.5 font-medium text-slate-700 dark:text-slate-300 text-sm">
                          {item.bulan}
                        </TableCell>
                        <TableCell className="py-3.5 font-semibold text-blue-600 dark:text-blue-400 text-sm">
                          {item.kelas}
                        </TableCell>
                        <TableCell className="py-3.5 text-center text-slate-600 dark:text-slate-400 text-sm">
                          {item.total_siswa}
                        </TableCell>
                        <TableCell className="py-3.5 text-center text-slate-600 dark:text-slate-400 text-sm">
                          {item.efektif}
                        </TableCell>
                        <TableCell className="py-3.5 text-center font-medium text-orange-600 dark:text-orange-400 text-sm">
                          {item.sakit}
                        </TableCell>
                        <TableCell className="py-3.5 text-center font-medium text-blue-600 dark:text-blue-400 text-sm">
                          {item.izin}
                        </TableCell>
                        <TableCell className="py-3.5 text-center font-medium text-red-600 dark:text-red-400 text-sm">
                          {item.alpa}
                        </TableCell>
                        <TableCell className="py-3.5 text-center text-xs text-slate-400">
                          {rowCapacity} hs
                        </TableCell>
                        <TableCell className="py-3.5 text-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {rowPercent.toFixed(1)}%
                        </TableCell>
                        <TableCell className="pr-6 py-3.5 text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            className="h-7 w-7 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Import Choice Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl p-6 dark:bg-slate-950/95 dark:border-slate-800/50 flex flex-col gap-4">
          <DialogHeader className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">Pilih Mode Impor Kehadiran</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Berkas <span className="font-semibold text-slate-700 dark:text-slate-300">{importFileName}</span> berhasil dianalisis.
              Ditemukan <span className="font-bold text-blue-600 dark:text-blue-400">{pendingImportData?.length}</span> baris data rekap bulanan valid.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300 shadow-2xs">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
            <div>
              <strong>Perhatian:</strong> Pilihan <strong>Timpa Data</strong> akan menghapus seluruh data kehadiran bulanan di database saat ini secara permanen sebelum memasukkan data baru dari Excel.
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
    </div>
  );
}
