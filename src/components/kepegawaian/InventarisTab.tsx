"use client";

import { motion } from "framer-motion";
import { Search, Plus, Pencil, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows
} from "@/lib/clientDb";

type InventarisRow = {
  id: string;
  nama: string;
  jumlah: number;
  perolehan: string;
  keterangan: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_FORM = {
  nama: "",
  jumlah: "",
  perolehan: "",
  keterangan: "",
};

export function InventarisTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<InventarisRow[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchRows = () => {
    try {
      const data = getDatasetRows("kepegawaian", "inventaris");
      setRows(Array.isArray(data) ? (data as InventarisRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat inventaris:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const filteredData = rows.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveInventaris = () => {
    const isEdit = !!editingId;
    const payload = {
      ...form,
      jumlah: Number(form.jumlah || 0),
    };

    try {
      if (isEdit) {
        const updated = rows.map((r) => r.id === editingId ? { ...r, ...payload } : r);
        importDatasetRows("kepegawaian", "inventaris", updated, "overwrite");
      } else {
        appendDatasetRow("kepegawaian", "inventaris", payload);
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setOpen(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} inventaris.`);
    }
  };

  const deleteInventaris = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus barang inventaris ini?")) return;
    try {
      deleteDatasetRow("kepegawaian", "inventaris", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  // Helper template Excel
  const downloadTemplate = async () => {
    try {
      const XLSX = await import("xlsx");
      const headers = [["Nama Barang", "Jumlah", "Asal Usul / Perolehan", "Keterangan"]];
      
      const ws = XLSX.utils.aoa_to_sheet(headers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Template");
      XLSX.writeFile(wb, "Template_Inventaris.xlsx");
    } catch (err) {
      console.error("Gagal mendownload template:", err);
      alert("Terjadi kesalahan saat mengunduh template.");
    }
  };

  // Helper Export Excel
  const exportData = async () => {
    try {
      const XLSX = await import("xlsx");
      const rowsToExport = rows.map((item) => ({
        "Nama Barang": item.nama,
        "Jumlah": item.jumlah,
        "Asal Usul / Perolehan": item.perolehan,
        "Keterangan": item.keterangan
      }));

      const ws = XLSX.utils.json_to_sheet(rowsToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Inventaris");
      XLSX.writeFile(wb, "Data_Inventaris.xlsx");
    } catch (err) {
      console.error("Gagal export data:", err);
      alert("Terjadi kesalahan saat melakukan export.");
    }
  };

  // Helper Import Excel
  const handleImport = async (file: File) => {
    try {
      const XLSX = await import("xlsx");
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawRows = XLSX.utils.sheet_to_json<any>(sheet);

          if (rawRows.length === 0) {
            alert("File kosong atau tidak memiliki baris data.");
            return;
          }

          const mappedData = rawRows.map((row: any) => ({
            nama: String(row["Nama Barang"] || row["nama barang"] || "").trim(),
            jumlah: Number(row["Jumlah"] || row["jumlah"] || 0),
            perolehan: String(row["Asal Usul / Perolehan"] || row["asal usul / perolehan"] || "").trim(),
            keterangan: String(row["Keterangan"] || row["keterangan"] || "").trim(),
          })).filter((item: any) => item.nama !== "");

          if (mappedData.length === 0) {
            alert("Tidak ada data valid yang dapat diimpor.");
            return;
          }

          importDatasetRows("kepegawaian", "inventaris", mappedData, "append");
          alert(`Berhasil mengimpor ${mappedData.length} data inventaris.`);
          fetchRows();
        } catch (err) {
          console.error(err);
          alert("Gagal memproses file Excel.");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan load library Excel.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Buku Keadaan Barang Inventaris Lainnya
          </h2>
          <p className="text-sm text-slate-500">
            Daftar aset non-gedung dan non-tanah milik sekolah.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto items-center flex-wrap sm:flex-nowrap">
          <div className="relative max-w-sm w-full sm:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Cari barang..."
              className="pl-9 bg-white border-slate-200 focus:border-slate-300 focus:ring-slate-200 rounded-lg shadow-sm transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadTemplate}
              className="text-xs text-slate-500 hover:text-slate-950 transition-colors font-medium cursor-pointer border border-slate-200 px-3 py-2 bg-white rounded-lg hover:bg-slate-50 shadow-sm"
            >
              Template
            </button>
            <label className="text-xs text-slate-500 hover:text-slate-950 transition-colors font-medium cursor-pointer border border-slate-200 px-3 py-2 bg-white rounded-lg hover:bg-slate-50 shadow-sm flex items-center">
              <span>Import</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files[0]) handleImport(files[0]);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </label>
            <button
              onClick={exportData}
              className="text-xs text-slate-500 hover:text-slate-950 transition-colors font-medium cursor-pointer border border-slate-200 px-3 py-2 bg-white rounded-lg hover:bg-slate-50 shadow-sm"
            >
              Export
            </button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm" onClick={() => { setForm(EMPTY_FORM); setEditingId(null); }} />}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Inventaris" : "Input Inventaris"}</DialogTitle>
                <DialogDescription>Tambahkan atau ubah barang inventaris.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2"><Label htmlFor="nama">Nama Barang</Label><Input id="nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="jumlah">Jumlah</Label><Input id="jumlah" type="number" value={form.jumlah} onChange={(e) => setForm((prev) => ({ ...prev, jumlah: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="perolehan">Asal Usul / Perolehan</Label><Input id="perolehan" value={form.perolehan} onChange={(e) => setForm((prev) => ({ ...prev, perolehan: e.target.value }))} /></div>
                <div className="grid gap-2"><Label htmlFor="keterangan">Keterangan</Label><Input id="keterangan" value={form.keterangan} onChange={(e) => setForm((prev) => ({ ...prev, keterangan: e.target.value }))} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button onClick={saveInventaris}>Simpan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-75">Nama Barang</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Asal Usul / Perolehan</TableHead>
              <TableHead>Keterangan</TableHead>
              <TableHead className="w-20 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-slate-50"
                >
                  <TableCell className="font-medium text-slate-900">
                    {item.nama}
                  </TableCell>
                  <TableCell className="text-slate-600">{item.jumlah}</TableCell>
                  <TableCell className="text-slate-600">{item.perolehan}</TableCell>
                  <TableCell className="text-slate-600">{item.keterangan}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setForm({
                            nama: item.nama || "",
                            jumlah: String(item.jumlah || ""),
                            perolehan: item.perolehan || "",
                            keterangan: item.keterangan || "",
                          });
                          setEditingId(item.id);
                          setOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteInventaris(item.id)}
                        className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                  Tidak ada barang yang sesuai dengan pencarian.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
