"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const mockInventaris = [
  { id: 1, nama: "Laptop ASUS VivoBook", jumlah: 2, perolehan: "BOS Reguler 2023", keterangan: "Baik" },
  { id: 2, nama: "Proyektor Epson", jumlah: 1, perolehan: "Bantuan Dinas 2022", keterangan: "Baik" },
  { id: 3, nama: "Lemari Arsip Besi", jumlah: 4, perolehan: "BOS Reguler 2021", keterangan: "1 Rusak Ringan" },
  { id: 4, nama: "Printer Epson L3110", jumlah: 3, perolehan: "BOS Kinerja 2023", keterangan: "Baik" },
  { id: 5, nama: "Papan Tulis Whiteboard", jumlah: 6, perolehan: "BOS Reguler 2020", keterangan: "Baik" },
];


const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function InventarisTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = mockInventaris.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[300px]">Nama Barang</TableHead>
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
