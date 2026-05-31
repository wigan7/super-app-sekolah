"use client";

import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
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

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/data/kepegawaian/inventaris");
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
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

  const saveInventaris = async () => {
    const payload = {
      ...form,
      jumlah: Number(form.jumlah || 0),
    };

    const res = await fetch("/api/data/kepegawaian/inventaris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Gagal menyimpan inventaris.");
      return;
    }

    setForm(EMPTY_FORM);
    setOpen(false);
    await fetchRows();
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

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative max-w-sm w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Cari barang..."
              className="pl-9 bg-white border-slate-200 focus:border-slate-300 focus:ring-slate-200 rounded-lg shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="bg-slate-900 text-white hover:bg-slate-800" />}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Input Inventaris</DialogTitle>
                <DialogDescription>Tambahkan barang inventaris baru.</DialogDescription>
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
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-slate-500">
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
