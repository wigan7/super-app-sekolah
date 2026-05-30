"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockIzin = [
  { id: 1, tanggal: "Senin, 15 Jan", nama: "Budi Santoso, S.Pd", tujuan: "Disdikbud", keperluan: "Mengambil Blangko Ijazah", berangkat: "09:00", kembali: "11:30" },
  { id: 2, tanggal: "Rabu, 17 Jan", nama: "Siti Aminah, M.Pd", tujuan: "Puskesmas", keperluan: "Periksa Kesehatan", berangkat: "10:00", kembali: "12:00" },
];

const mockPiket = [
  { id: 1, tanggal: "Senin, 15 Jan", nama: "Agus Riyadi", uraian: "Menerima Tamu Pengawas", keterangan: "Aman, Terkendali" },
  { id: 2, tanggal: "Selasa, 16 Jan", nama: "Ahmad Zainuri", uraian: "Mengatur Parkir & Gerbang", keterangan: "Aman" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function KehadiranPiketTab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kolom Kiri: Buku Izin Keluar */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-900">Buku Izin Keluar</CardTitle>
            <CardDescription>Pencatatan guru/pegawai yang izin keluar saat jam kerja.</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                <Plus className="w-4 h-4 mr-1" />
                Tambah Izin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-slate-200">
              <DialogHeader>
                <DialogTitle>Form Izin Keluar</DialogTitle>
                <DialogDescription>
                  Masukkan detail izin keluar guru atau pegawai.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nama/NIP
                  </Label>
                  <Input id="name" placeholder="Pilih atau ketik nama..." className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tujuan" className="text-right">
                    Tujuan
                  </Label>
                  <Input id="tujuan" placeholder="Instansi/Tempat" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="keperluan" className="text-right">
                    Keperluan
                  </Label>
                  <Input id="keperluan" placeholder="Alasan izin" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="berangkat" className="text-right">
                    Waktu
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input id="berangkat" type="time" className="flex-1" />
                    <span className="flex items-center text-slate-400">-</span>
                    <Input id="kembali" type="time" className="flex-1" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
                <Button type="button" className="bg-slate-900 text-white hover:bg-slate-800" onClick={() => setIsOpen(false)}>Simpan Izin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-4">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[100px] text-xs">Hari/Tanggal</TableHead>
                  <TableHead className="text-xs">Nama/NIP</TableHead>
                  <TableHead className="text-xs">Tujuan & Keperluan</TableHead>
                  <TableHead className="text-xs">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockIzin.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="text-xs text-slate-600 align-top pt-3">{item.tanggal}</TableCell>
                    <TableCell className="text-xs font-medium text-slate-900 align-top pt-3">{item.nama}</TableCell>
                    <TableCell className="text-xs align-top pt-3">
                      <div className="font-medium text-slate-900">{item.tujuan}</div>
                      <div className="text-slate-500 mt-0.5">{item.keperluan}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 align-top pt-3">
                      {item.berangkat} - {item.kembali}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Kolom Kanan: Buku Piket Guru */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-900">Buku Piket Guru</CardTitle>
          <CardDescription>Laporan harian pelaksanaan piket oleh guru.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-[3.25rem]">
            {/* Added margin top to align with left table given the button height above */}
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[100px] text-xs">Hari/Tanggal</TableHead>
                  <TableHead className="text-xs">Guru Piket</TableHead>
                  <TableHead className="text-xs">Uraian & Ket</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPiket.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="text-xs text-slate-600 align-top pt-3">{item.tanggal}</TableCell>
                    <TableCell className="text-xs font-medium text-slate-900 align-top pt-3">{item.nama}</TableCell>
                    <TableCell className="text-xs align-top pt-3">
                      <div className="font-medium text-slate-900">{item.uraian}</div>
                      <div className="text-slate-500 mt-0.5">{item.keterangan}</div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
