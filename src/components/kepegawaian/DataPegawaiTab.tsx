"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Plus, Upload, FileSpreadsheet, AlertCircle, Check, Edit2, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows,
  getIdentitas
} from "@/lib/clientDb";


type Penilaian = {
  pangkat: string;
  tanggal: string;
  uraian: string;
  pejabat: string;
};

type Pegawai = {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  status: string;
  penilaian?: Penilaian[];
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_FORM = {
  nama: "",
  nip: "",
  jabatan: "",
  status: "PNS",
};

export function DataPegawaiTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rows, setRows] = useState<Pegawai[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [namaSekolah, setNamaSekolah] = useState("");
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);

  // States for importing from Dapodik Excel
  const [importOpen, setImportOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [importMode, setImportMode] = useState<"append" | "overwrite">("append");
  const [fileName, setFileName] = useState("");
  const [importError, setImportError] = useState("");
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setFileName(file.name);
    setImportError("");
    setPreviewData([]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const XLSX = await import("xlsx");
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const range = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
        
        if (range.length === 0) {
          setImportError("File Excel kosong.");
          return;
        }

        // Cari baris header
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(range.length, 15); i++) {
          const row = range[i];
          if (Array.isArray(row)) {
            const rowStr = row.map(cell => String(cell ?? "").trim().toLowerCase());
            if (rowStr.includes("nama") && (rowStr.includes("nip") || rowStr.includes("nuptk") || rowStr.includes("status kepegawaian"))) {
              headerRowIndex = i;
              break;
            }
          }
        }

        if (headerRowIndex === -1) {
          // Fallback ke baris pertama yang berisi kolom dengan kata kunci "nama"
          for (let i = 0; i < Math.min(range.length, 20); i++) {
            const row = range[i];
            if (Array.isArray(row)) {
              const rowStr = row.map(cell => String(cell ?? "").trim().toLowerCase());
              if (rowStr.some(cell => cell.includes("nama"))) {
                headerRowIndex = i;
                break;
              }
            }
          }
        }

        if (headerRowIndex === -1) {
          setImportError("Header kolom 'Nama' tidak ditemukan di 20 baris pertama. Pastikan format file sesuai.");
          return;
        }

        const headers = range[headerRowIndex].map(h => String(h ?? "").trim().toLowerCase());
        const colMap = {
          nama: headers.indexOf("nama"),
          nip: headers.indexOf("nip"),
          jabatan: headers.findIndex(h => h.includes("jenis ptk") || h.includes("jabatan")),
          status: headers.findIndex(h => h.includes("status kepegawaian") || h.includes("status")),
        };

        if (colMap.nama === -1) {
          setImportError("Kolom 'Nama' tidak ditemukan pada baris header.");
          return;
        }

        const parsedPegawai: any[] = [];
        for (let i = headerRowIndex + 1; i < range.length; i++) {
          const row = range[i];
          if (!row || row.length === 0) continue;

          const namaVal = colMap.nama !== -1 ? String(row[colMap.nama] || "").trim() : "";
          if (!namaVal || namaVal.toLowerCase() === "nama" || namaVal.toLowerCase() === "no" || namaVal.startsWith("halaman")) continue;

          let nipVal = colMap.nip !== -1 ? String(row[colMap.nip] || "").trim() : "";
          nipVal = nipVal.replace(/^'/, ""); // Bersihkan prefix tanda kutip satu
          if (nipVal === "-" || nipVal.toLowerCase() === "null") nipVal = "";

          const jabatanVal = colMap.jabatan !== -1 && row[colMap.jabatan] ? String(row[colMap.jabatan]).trim() : "Guru";
          const statusVal = colMap.status !== -1 && row[colMap.status] ? String(row[colMap.status]).trim() : "PNS";

          parsedPegawai.push({
            nama: namaVal,
            nip: nipVal || "-",
            jabatan: jabatanVal,
            status: statusVal,
          });
        }

        if (parsedPegawai.length === 0) {
          setImportError("Tidak ada data pegawai yang valid ditemukan.");
        } else {
          setPreviewData(parsedPegawai);
        }
      } catch (err) {
        console.error(err);
        setImportError("Gagal membaca file Excel. Pastikan format file valid.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportSubmit = () => {
    if (previewData.length === 0) return;
    setImporting(true);
    try {
      importDatasetRows("kepegawaian", "pegawai", previewData, importMode);

      setImportOpen(false);
      setPreviewData([]);
      setFileName("");
      fetchRows();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengimpor data.");
    } finally {
      setImporting(false);
    }
  };

  const fetchRows = () => {
    try {
      const data = getDatasetRows("kepegawaian", "pegawai");
      setRows(Array.isArray(data) ? (data as Pegawai[]) : []);
    } catch (error) {
      console.error("Gagal memuat data pegawai:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();

    const fetchSchoolName = () => {
      try {
        const data = getIdentitas();
        setNamaSekolah(data?.namaSekolah || "");
      } catch (error) {
        console.error("Gagal memuat nama sekolah di pegawai:", error);
      }
    };
    fetchSchoolName();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubmit = () => {
    setSaving(true);
    try {
      const isEdit = !!editingPegawai;
      
      const payload = isEdit
        ? { ...form, id: editingPegawai.id, penilaian: editingPegawai.penilaian || [] }
        : { ...form, penilaian: [] };

      if (isEdit) {
        const updated = rows.map((p) => p.id === editingPegawai.id ? payload : p);
        importDatasetRows("kepegawaian", "pegawai", updated, "overwrite");
      } else {
        appendDatasetRow("kepegawaian", "pegawai", payload);
      }

      setForm(EMPTY_FORM);
      setEditingPegawai(null);
      setOpen(false);
      fetchRows();
    } catch (error) {
      console.error("Gagal menyimpan data pegawai:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, nama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data pegawai "${nama}"?`)) {
      return;
    }
    try {
      deleteDatasetRow("kepegawaian", "pegawai", id);
      fetchRows();
    } catch (error) {
      console.error("Gagal menghapus pegawai:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Daftar Guru & Pegawai
          </h2>
          <p className="text-sm text-slate-500">
            {namaSekolah || "(Belum input Nama Sekolah)"} - Data pokok kepegawaian dan riwayat penilaian.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dialog Import dari Excel Dapodik */}
          <Dialog open={importOpen} onOpenChange={(val) => {
            setImportOpen(val);
            if (!val) {
              setPreviewData([]);
              setFileName("");
              setImportError("");
            }
          }}>
            <DialogTrigger render={<Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50" />}>
              <Upload className="h-4 w-4 mr-2 text-slate-500" />
              Import Excel Dapodik
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Data Pegawai dari Excel Dapodik</DialogTitle>
                <DialogDescription>
                  Pilih file Excel (.xlsx atau .xls) hasil ekspor Dapodik. Sistem akan mendeteksi baris data guru/pegawai secara otomatis.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-2">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-50/80 transition-colors relative">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="h-10 w-10 text-emerald-600 mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    {fileName ? fileName : "Pilih atau Seret File Excel Dapodik"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Format file yang didukung: .xlsx, .xls
                  </p>
                </div>

                {importError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{importError}</span>
                  </div>
                )}

                {previewData.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">
                        Preview Data ({previewData.length} Pegawai Terdeteksi)
                      </p>
                      {/* Opsi mode import */}
                      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-md transition-all ${
                            importMode === "append"
                              ? "bg-white text-slate-900 shadow-sm"
                              : "hover:text-slate-900"
                          }`}
                          onClick={() => setImportMode("append")}
                        >
                          Tambah Data
                        </button>
                        <button
                          type="button"
                          className={`px-3 py-1 rounded-md transition-all ${
                            importMode === "overwrite"
                              ? "bg-white text-red-600 shadow-sm font-bold"
                              : "hover:text-slate-900"
                          }`}
                          onClick={() => setImportMode("overwrite")}
                        >
                          Ganti Semua
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-lg max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
                          <tr>
                            <th className="px-3 py-2 text-slate-600 font-semibold bg-slate-50">Nama Lengkap</th>
                            <th className="px-3 py-2 text-slate-600 font-semibold bg-slate-50">NIP</th>
                            <th className="px-3 py-2 text-slate-600 font-semibold bg-slate-50">Jabatan</th>
                            <th className="px-3 py-2 text-slate-600 font-semibold bg-slate-50">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {previewData.slice(0, 50).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-3 py-2 font-medium text-slate-900">{row.nama}</td>
                              <td className="px-3 py-2 text-slate-500">{row.nip}</td>
                              <td className="px-3 py-2 text-slate-500">{row.jabatan}</td>
                              <td className="px-3 py-2 text-slate-500">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                  row.status === "PNS"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-slate-100 text-slate-800"
                                }`}>
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {previewData.length > 50 && (
                            <tr>
                              <td colSpan={4} className="px-3 py-2 text-center text-slate-400 bg-slate-50/30">
                                ... Dan {previewData.length - 50} data pegawai lainnya ...
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setImportOpen(false)} disabled={importing}>
                  Batal
                </Button>
                <Button
                  onClick={handleImportSubmit}
                  disabled={previewData.length === 0 || importing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {importing ? "Mengimpor..." : `Import ${previewData.length} Pegawai`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog Tambah Manual */}
          <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
              setForm(EMPTY_FORM);
              setEditingPegawai(null);
            }
          }}>
            <DialogTrigger render={<Button className="bg-slate-900 text-white hover:bg-slate-800" />}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pegawai
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingPegawai ? "Edit Data Pegawai" : "Tambah Data Pegawai"}</DialogTitle>
                <DialogDescription>
                  {editingPegawai ? "Ubah data pokok pegawai." : "Input data guru atau pegawai baru."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input id="nip" value={form.nip} onChange={(e) => setForm((prev) => ({ ...prev, nip: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input id="jabatan" value={form.jabatan} onChange={(e) => setForm((prev) => ({ ...prev, jabatan: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Input id="status" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setOpen(false);
                  setForm(EMPTY_FORM);
                  setEditingPegawai(null);
                }} disabled={saving}>Batal</Button>
                <Button onClick={handleSubmit} disabled={saving}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data pegawai.</TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {rows.map((pegawai, index) => (
                  <React.Fragment key={pegawai.id}>
                    <motion.tr
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      transition={{ delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-slate-50 cursor-pointer"
                      onClick={() => toggleExpand(pegawai.id)}
                    >
                      <TableCell className="text-center">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          {expandedId === pegawai.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">
                        {pegawai.nama}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {pegawai.nip}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {pegawai.jabatan}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pegawai.status === "PNS"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {pegawai.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingPegawai(pegawai);
                              setForm({
                                nama: pegawai.nama,
                                nip: pegawai.nip,
                                jabatan: pegawai.jabatan,
                                status: pegawai.status,
                              });
                              setOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Pegawai"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pegawai.id, pegawai.nama)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus Pegawai"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </motion.tr>
                    {expandedId === pegawai.id && (
                      <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableCell colSpan={6} className="p-0 border-b">
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-4 pb-6 ml-12 border-l-2 border-blue-200">
                              <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                Catatan Penilaian PNS
                              </h4>
                              {(pegawai.penilaian ?? []).length > 0 ? (
                                <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-slate-50/50">
                                        <TableHead className="text-xs">Pangkat / Gol. Ruang</TableHead>
                                        <TableHead className="text-xs">Tanggal</TableHead>
                                        <TableHead className="text-xs">Uraian</TableHead>
                                        <TableHead className="text-xs">Pejabat Penilai</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {(pegawai.penilaian ?? []).map((nilai, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell className="text-xs font-medium text-slate-900">
                                            {nilai.pangkat}
                                          </TableCell>
                                          <TableCell className="text-xs text-slate-600">
                                            {nilai.tanggal}
                                          </TableCell>
                                          <TableCell className="text-xs text-slate-600">
                                            {nilai.uraian}
                                          </TableCell>
                                          <TableCell className="text-xs text-slate-600">
                                            {nilai.pejabat}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500 italic">
                                  Belum ada riwayat penilaian atau bukan PNS.
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
