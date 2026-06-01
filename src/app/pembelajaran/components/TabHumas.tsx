"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
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
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows,
  getIdentitas
} from "@/lib/clientDb";

type TamuRow = {
  id: string;
  tanggal: string;
  nama: string;
  jabatan: string;
  maksud: string;
  temuan: string;
};

type HumasRow = {
  id: string;
  tanggal: string;
  kegiatan: string;
  pihak: string;
  hasil: string;
};

type PengaduanRow = {
  id: string;
  nama: string;
  unsur: string;
  masalah: string;
  solusi: string;
  tindakLanjut: string;
  status: string;
};

const EMPTY_TAMU = {
  tanggal: "",
  nama: "",
  jabatan: "",
  maksud: "",
  temuan: "",
};

const EMPTY_HUMAS = {
  tanggal: "",
  kegiatan: "",
  pihak: "",
  hasil: "",
};

const EMPTY_PENGADUAN = {
  nama: "",
  unsur: "",
  masalah: "",
  solusi: "",
  tindakLanjut: "",
  status: "Diproses",
};

export default function TabHumas() {
  const [tamuRows, setTamuRows] = useState<TamuRow[]>([]);
  const [humasRows, setHumasRows] = useState<HumasRow[]>([]);
  const [pengaduanRows, setPengaduanRows] = useState<PengaduanRow[]>([]);
  const [openTamu, setOpenTamu] = useState(false);
  const [openHumas, setOpenHumas] = useState(false);
  const [openPengaduan, setOpenPengaduan] = useState(false);
  const [tamuForm, setTamuForm] = useState(EMPTY_TAMU);
  const [humasForm, setHumasForm] = useState(EMPTY_HUMAS);
  const [pengaduanForm, setPengaduanForm] = useState(EMPTY_PENGADUAN);
  const [namaSekolah, setNamaSekolah] = useState("");
  const [editingTamuId, setEditingTamuId] = useState<string | null>(null);
  const [editingHumasId, setEditingHumasId] = useState<string | null>(null);
  const [editingPengaduanId, setEditingPengaduanId] = useState<string | null>(null);

  const fetchRows = () => {
    try {
      const tamuData = getDatasetRows("pembelajaran", "tamu");
      const humasData = getDatasetRows("pembelajaran", "humas");
      const pengaduanData = getDatasetRows("pembelajaran", "pengaduan");

      setTamuRows(Array.isArray(tamuData) ? (tamuData as TamuRow[]) : []);
      setHumasRows(Array.isArray(humasData) ? (humasData as HumasRow[]) : []);
      setPengaduanRows(Array.isArray(pengaduanData) ? (pengaduanData as PengaduanRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat data humas:", error);
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
        console.error("Gagal memuat nama sekolah di humas:", error);
      }
    };
    fetchSchoolName();
  }, []);

  const save = (dataset: string, payload: Record<string, string>, editId: string | null, onDone: () => void) => {
    try {
      if (editId) {
        let currentRows: any[] = [];
        if (dataset === "tamu") currentRows = tamuRows;
        else if (dataset === "humas") currentRows = humasRows;
        else if (dataset === "pengaduan") currentRows = pengaduanRows;

        const updated = currentRows.map(r => r.id === editId ? { ...r, ...payload } : r);
        importDatasetRows("pembelajaran", dataset, updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", dataset, payload);
      }
      onDone();
      fetchRows();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data");
    }
  };

  const deleteItem = (dataset: string, id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", dataset, id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  // Tamu Excel Functions
  const downloadTamuTemplate = async () => {
    try {
      const XLSX = await import("xlsx");
      const headers = [["Tanggal", "Nama Tamu", "Jabatan", "Maksud Kunjungan", "Temuan / Kesan"]];
      const ws = XLSX.utils.aoa_to_sheet(headers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "Template_Kunjungan_Tamu.xlsx");
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh template.");
    }
  };

  const exportTamuData = async () => {
    try {
      const XLSX = await import("xlsx");
      const data = tamuRows.map((row) => ({
        "Tanggal": row.tanggal,
        "Nama Tamu": row.nama,
        "Jabatan": row.jabatan,
        "Maksud Kunjungan": row.maksud,
        "Temuan / Kesan": row.temuan,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Kunjungan Tamu");
      XLSX.writeFile(wb, "Data_Kunjungan_Tamu.xlsx");
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan export.");
    }
  };

  const importTamuData = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
          const wb = XLSX.read(buffer, { type: "array" });
          const raw = XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
          
          const mapped = raw.map((row) => ({
            tanggal: String(row["Tanggal"] || "").trim(),
            nama: String(row["Nama Tamu"] || "").trim(),
            jabatan: String(row["Jabatan"] || "").trim(),
            maksud: String(row["Maksud Kunjungan"] || "").trim(),
            temuan: String(row["Temuan / Kesan"] || "").trim(),
          })).filter((r) => r.nama !== "");

          if (mapped.length === 0) {
            alert("Tidak ada data valid untuk diimpor.");
            return;
          }

          importDatasetRows("pembelajaran", "tamu", mapped, "append");
          alert(`Berhasil mengimpor ${mapped.length} data kunjungan tamu.`);
          fetchRows();
        } catch (err) {
          console.error(err);
          alert("Gagal memproses file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
    }
  };

  // Humas Excel Functions
  const downloadHumasTemplate = async () => {
    try {
      const XLSX = await import("xlsx");
      const headers = [["Tanggal", "Kegiatan", "Pihak Terlibat", "Hasil / Keterangan"]];
      const ws = XLSX.utils.aoa_to_sheet(headers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "Template_Kegiatan_Humas.xlsx");
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh template.");
    }
  };

  const exportHumasData = async () => {
    try {
      const XLSX = await import("xlsx");
      const data = humasRows.map((row) => ({
        "Tanggal": row.tanggal,
        "Kegiatan": row.kegiatan,
        "Pihak Terlibat": row.pihak,
        "Hasil / Keterangan": row.hasil,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Kegiatan Humas");
      XLSX.writeFile(wb, "Data_Kegiatan_Humas.xlsx");
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan export.");
    }
  };

  const importHumasData = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
          const wb = XLSX.read(buffer, { type: "array" });
          const raw = XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
          
          const mapped = raw.map((row) => ({
            tanggal: String(row["Tanggal"] || "").trim(),
            kegiatan: String(row["Kegiatan"] || "").trim(),
            pihak: String(row["Pihak Terlibat"] || "").trim(),
            hasil: String(row["Hasil / Keterangan"] || "").trim(),
          })).filter((r) => r.kegiatan !== "");

          if (mapped.length === 0) {
            alert("Tidak ada data valid untuk diimpor.");
            return;
          }

          importDatasetRows("pembelajaran", "humas", mapped, "append");
          alert(`Berhasil mengimpor ${mapped.length} data kegiatan humas.`);
          fetchRows();
        } catch (err) {
          console.error(err);
          alert("Gagal memproses file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
    }
  };

  // Pengaduan Excel Functions
  const downloadPengaduanTemplate = async () => {
    try {
      const XLSX = await import("xlsx");
      const headers = [["Nama Pelapor", "Unsur", "Masalah / Saran", "Solusi", "Tindak Lanjut", "Status"]];
      const ws = XLSX.utils.aoa_to_sheet(headers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "Template_Pengaduan_Saran.xlsx");
    } catch (err) {
      console.error(err);
      alert("Gagal mengunduh template.");
    }
  };

  const exportPengaduanData = async () => {
    try {
      const XLSX = await import("xlsx");
      const data = pengaduanRows.map((row) => ({
        "Nama Pelapor": row.nama,
        "Unsur": row.unsur,
        "Masalah / Saran": row.masalah,
        "Solusi": row.solusi,
        "Tindak Lanjut": row.tindakLanjut,
        "Status": row.status,
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Pengaduan Saran");
      XLSX.writeFile(wb, "Data_Pengaduan_Saran.xlsx");
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan export.");
    }
  };

  const importPengaduanData = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
          const wb = XLSX.read(buffer, { type: "array" });
          const raw = XLSX.utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
          
          const mapped = raw.map((row) => ({
            nama: String(row["Nama Pelapor"] || "").trim(),
            unsur: String(row["Unsur"] || "").trim(),
            masalah: String(row["Masalah / Saran"] || "").trim(),
            solusi: String(row["Solusi"] || "").trim(),
            tindakLanjut: String(row["Tindak Lanjut"] || "").trim(),
            status: String(row["Status"] || "Diproses").trim(),
          })).filter((r) => r.nama !== "");

          if (mapped.length === 0) {
            alert("Tidak ada data valid untuk diimpor.");
            return;
          }

          importDatasetRows("pembelajaran", "pengaduan", mapped, "append");
          alert(`Berhasil mengimpor ${mapped.length} data pengaduan/saran.`);
          fetchRows();
        } catch (err) {
          console.error(err);
          alert("Gagal memproses file.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <Tabs defaultValue="tamu" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 p-1 border border-slate-100 dark:border-slate-800 rounded-xl mb-6">
          <TabsTrigger value="tamu" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            Kunjungan & Tamu
          </TabsTrigger>
          <TabsTrigger value="humas" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            Hubungan Masyarakat
          </TabsTrigger>
          <TabsTrigger value="pengaduan" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">
            Pengaduan & Saran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tamu">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Tamu & Pembinaan</CardTitle>
                <CardDescription>Catatan kunjungan dinas dan tamu ke {namaSekolah || "(Belum input Nama Sekolah)"}.</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={downloadTamuTemplate}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                >
                  Template
                </button>
                <label className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm flex items-center">
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) importTamuData(files[0]);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={exportTamuData}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                >
                  Export
                </button>
                <Dialog open={openTamu} onOpenChange={setOpenTamu}>
                  <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setTamuForm(EMPTY_TAMU); setEditingTamuId(null); }}><Plus className="h-4 w-4 mr-2" />Input Tamu</Button>} />
                  <DialogContent>
                    <DialogHeader><DialogTitle>{editingTamuId ? "Edit Kunjungan Tamu" : "Input Kunjungan Tamu"}</DialogTitle><DialogDescription>Tambahkan catatan kunjungan baru.</DialogDescription></DialogHeader>
                    <div className="grid gap-3">
                      <div className="grid gap-2"><Label htmlFor="ttanggal">Tanggal</Label><Input id="ttanggal" type="date" value={tamuForm.tanggal} onChange={(e) => setTamuForm((prev) => ({ ...prev, tanggal: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="tnama">Nama</Label><Input id="tnama" value={tamuForm.nama} onChange={(e) => setTamuForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="tjabatan">Jabatan</Label><Input id="tjabatan" value={tamuForm.jabatan} onChange={(e) => setTamuForm((prev) => ({ ...prev, jabatan: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="tmaksud">Maksud Kunjungan</Label><Input id="tmaksud" value={tamuForm.maksud} onChange={(e) => setTamuForm((prev) => ({ ...prev, maksud: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="ttemuan">Temuan/Kesan</Label><Input id="ttemuan" value={tamuForm.temuan} onChange={(e) => setTamuForm((prev) => ({ ...prev, temuan: e.target.value }))} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setOpenTamu(false)}>Batal</Button><Button onClick={() => save("tamu", tamuForm, editingTamuId, () => { setTamuForm(EMPTY_TAMU); setEditingTamuId(null); setOpenTamu(false); })}>Simpan</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-30">Tanggal</TableHead>
                      <TableHead className="font-medium text-slate-500 w-50">Nama / Jabatan Tamu</TableHead>
                      <TableHead className="font-medium text-slate-500 w-62.5">Maksud Kunjungan</TableHead>
                      <TableHead className="font-medium text-slate-500">Temuan / Kesan</TableHead>
                      <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tamuRows.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data kunjungan tamu.</TableCell></TableRow>
                    ) : (
                      tamuRows.map((row) => (
                        <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                          <TableCell className="py-4"><div className="font-medium text-slate-900 dark:text-slate-100">{row.nama}</div><div className="text-sm text-slate-500">{row.jabatan}</div></TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.maksud}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.temuan}</TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setTamuForm({
                                    tanggal: row.tanggal || "",
                                    nama: row.nama || "",
                                    jabatan: row.jabatan || "",
                                    maksud: row.maksud || "",
                                    temuan: row.temuan || "",
                                  });
                                  setEditingTamuId(row.id);
                                  setOpenTamu(true);
                                }}
                                className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteItem("tamu", row.id)}
                                className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humas">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Kegiatan Hubungan Masyarakat</CardTitle>
                <CardDescription>Kerjasama dengan Komite Sekolah dan Lembaga Eksternal.</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={downloadHumasTemplate}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                >
                  Template
                </button>
                <label className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm flex items-center">
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) importHumasData(files[0]);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={exportHumasData}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                >
                  Export
                </button>
                <Dialog open={openHumas} onOpenChange={setOpenHumas}>
                  <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setHumasForm(EMPTY_HUMAS); setEditingHumasId(null); }}><Plus className="h-4 w-4 mr-2" />Input Kegiatan</Button>} />
                  <DialogContent>
                    <DialogHeader><DialogTitle>{editingHumasId ? "Edit Kegiatan Humas" : "Input Kegiatan Humas"}</DialogTitle><DialogDescription>Tambahkan kegiatan humas baru.</DialogDescription></DialogHeader>
                    <div className="grid gap-3">
                      <div className="grid gap-2"><Label htmlFor="htanggal">Tanggal</Label><Input id="htanggal" type="date" value={humasForm.tanggal} onChange={(e) => setHumasForm((prev) => ({ ...prev, tanggal: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="hkegiatan">Kegiatan</Label><Input id="hkegiatan" value={humasForm.kegiatan} onChange={(e) => setHumasForm((prev) => ({ ...prev, kegiatan: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="hpihak">Pihak Terlibat</Label><Input id="hpihak" value={humasForm.pihak} onChange={(e) => setHumasForm((prev) => ({ ...prev, pihak: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="hhasil">Hasil/Keterangan</Label><Input id="hhasil" value={humasForm.hasil} onChange={(e) => setHumasForm((prev) => ({ ...prev, hasil: e.target.value }))} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setOpenHumas(false)}>Batal</Button><Button onClick={() => save("humas", humasForm, editingHumasId, () => { setHumasForm(EMPTY_HUMAS); setEditingHumasId(null); setOpenHumas(false); })}>Simpan</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-30">Tanggal</TableHead>
                      <TableHead className="font-medium text-slate-500 w-50">Kegiatan</TableHead>
                      <TableHead className="font-medium text-slate-500 w-50">Pihak Terlibat</TableHead>
                      <TableHead className="font-medium text-slate-500">Hasil / Keterangan</TableHead>
                      <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {humasRows.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data kegiatan humas.</TableCell></TableRow>
                    ) : (
                      humasRows.map((row) => (
                        <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                          <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.kegiatan}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.pihak}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.hasil}</TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setHumasForm({
                                    tanggal: row.tanggal || "",
                                    kegiatan: row.kegiatan || "",
                                    pihak: row.pihak || "",
                                    hasil: row.hasil || "",
                                  });
                                  setEditingHumasId(row.id);
                                  setOpenHumas(true);
                                }}
                                className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteItem("humas", row.id)}
                                className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengaduan">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Pengaduan & Saran</CardTitle>
                <CardDescription>Aspirasi dan tindak lanjut keluhan masyarakat terkait sekolah.</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={downloadPengaduanTemplate}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                >
                  Template
                </button>
                <label className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm flex items-center">
                  <span>Import</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files[0]) importPengaduanData(files[0]);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={exportPengaduanData}
                  className="text-xs text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-100 transition-colors font-medium cursor-pointer border border-slate-200 dark:border-slate-850 px-3 py-2 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
                >
                  Export
                </button>
                <Dialog open={openPengaduan} onOpenChange={setOpenPengaduan}>
                  <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setPengaduanForm(EMPTY_PENGADUAN); setEditingPengaduanId(null); }}><Plus className="h-4 w-4 mr-2" />Input Pengaduan</Button>} />
                  <DialogContent>
                    <DialogHeader><DialogTitle>{editingPengaduanId ? "Edit Pengaduan & Saran" : "Input Pengaduan & Saran"}</DialogTitle><DialogDescription>Tambahkan pengaduan/saran baru.</DialogDescription></DialogHeader>
                    <div className="grid gap-3">
                      <div className="grid gap-2"><Label htmlFor="pnama">Nama</Label><Input id="pnama" value={pengaduanForm.nama} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="punsur">Unsur</Label><Input id="punsur" value={pengaduanForm.unsur} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, unsur: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="pmasalah">Masalah/Saran</Label><Input id="pmasalah" value={pengaduanForm.masalah} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, masalah: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="psolusi">Solusi</Label><Input id="psolusi" value={pengaduanForm.solusi} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, solusi: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="ptindak">Tindak Lanjut</Label><Input id="ptindak" value={pengaduanForm.tindakLanjut} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, tindakLanjut: e.target.value }))} /></div>
                      <div className="grid gap-2"><Label htmlFor="pstatus">Status</Label><Input id="pstatus" value={pengaduanForm.status} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, status: e.target.value }))} /></div>
                    </div>
                    <DialogFooter><Button variant="outline" onClick={() => setOpenPengaduan(false)}>Batal</Button><Button onClick={() => save("pengaduan", pengaduanForm, editingPengaduanId, () => { setPengaduanForm(EMPTY_PENGADUAN); setEditingPengaduanId(null); setOpenPengaduan(false); })}>Simpan</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-50">Nama & Unsur</TableHead>
                      <TableHead className="font-medium text-slate-500 w-62.5">Masalah / Saran</TableHead>
                      <TableHead className="font-medium text-slate-500 w-62.5">Solusi</TableHead>
                      <TableHead className="font-medium text-slate-500 text-center font-medium">Tindak Lanjut & Status</TableHead>
                      <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pengaduanRows.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data pengaduan.</TableCell></TableRow>
                    ) : (
                      pengaduanRows.map((row) => (
                        <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                          <TableCell className="py-4"><div className="font-medium text-slate-900 dark:text-slate-100">{row.nama}</div><div className="text-sm text-slate-500">{row.unsur}</div></TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.masalah}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.solusi}</TableCell>
                          <TableCell className="py-4"><div className="text-sm text-slate-600 dark:text-slate-300 text-center mb-1">{row.tindakLanjut}</div><div className="text-center"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>{row.status}</span></div></TableCell>
                          <TableCell className="py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => {
                                  setPengaduanForm({
                                    nama: row.nama || "",
                                    unsur: row.unsur || "",
                                    masalah: row.masalah || "",
                                    solusi: row.solusi || "",
                                    tindakLanjut: row.tindakLanjut || "",
                                    status: row.status || "Diproses",
                                  });
                                  setEditingPengaduanId(row.id);
                                  setOpenPengaduan(true);
                                }}
                                className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteItem("pengaduan", row.id)}
                                className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
