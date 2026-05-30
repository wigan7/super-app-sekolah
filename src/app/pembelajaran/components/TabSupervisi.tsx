"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, AlertCircle } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockSupervisi = [
  {
    id: 1,
    tanggal: "Senin, 15 Jan 2026",
    guru: "Budi Santoso, S.Pd",
    kelas: "VI A",
    mapel: "Matematika",
    aspek: "Metode Pembelajaran Interaktif",
    hasil: "Sangat Baik",
    saran: "Pertahankan penggunaan media visual.",
    status: "Selesai"
  },
  {
    id: 2,
    tanggal: "Selasa, 16 Jan 2026",
    guru: "Siti Aminah, M.Pd",
    kelas: "IV B",
    mapel: "IPAS",
    aspek: "Manajemen Kelas",
    hasil: "Cukup",
    saran: "Tingkatkan perhatian pada siswa di barisan belakang.",
    status: "Tindak Lanjut"
  },
];

const mockAdministrasi = [
  {
    id: 1,
    guru: "Budi Santoso, S.Pd",
    mapel: "Matematika (Kelas VI)",
    kelengkapan: { silabus: true, rpp: true, prota: true, promes: true },
    hasil: "Lengkap & Sesuai",
  },
  {
    id: 2,
    guru: "Siti Aminah, M.Pd",
    mapel: "IPAS (Kelas IV)",
    kelengkapan: { silabus: true, rpp: false, prota: true, promes: true },
    hasil: "Perlu Revisi RPP",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function TabSupervisi() {
  const penilai = "Wigan Anggit Utomo";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Input Supervisi Baru
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Input Supervisi Baru</SheetTitle>
              <SheetDescription>
                Catat hasil supervisi kelas atau administrasi guru. Penilai: {penilai}.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="guru">Nama Guru</Label>
                <Input id="guru" placeholder="Pilih guru..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="kelas">Kelas & Mapel</Label>
                <Input id="kelas" placeholder="Mis: VI A - Matematika" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aspek">Aspek Supervisi</Label>
                <Input id="aspek" placeholder="Aspek yang dinilai..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hasil">Hasil & Saran</Label>
                <Input id="hasil" placeholder="Hasil dan rekomendasi tindak lanjut" />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" className="w-full">Simpan Data</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Supervisi Kelas</CardTitle>
          <CardDescription>Jadwal dan hasil supervisi akademik di SDN Mukiran 03.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                  <TableHead className="font-medium text-slate-500 w-[150px]">Hari/Tanggal</TableHead>
                  <TableHead className="font-medium text-slate-500">Nama Guru</TableHead>
                  <TableHead className="font-medium text-slate-500">Kelas</TableHead>
                  <TableHead className="font-medium text-slate-500">Mapel</TableHead>
                  <TableHead className="font-medium text-slate-500">Aspek Disupervisi</TableHead>
                  <TableHead className="font-medium text-slate-500">Hasil & Saran</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody as={motion.tbody} variants={containerVariants} initial="hidden" animate="show">
                {mockSupervisi.map((row) => (
                  <TableRow as={motion.tr} variants={itemVariants} key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                    <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.guru}</TableCell>
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.kelas}</TableCell>
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.mapel}</TableCell>
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.aspek}</TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{row.hasil}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{row.saran}</div>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pemeriksaan Administrasi & Persiapan</CardTitle>
          <CardDescription>Pengecekan kelengkapan perangkat pembelajaran guru.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                  <TableHead className="font-medium text-slate-500">Nama Guru</TableHead>
                  <TableHead className="font-medium text-slate-500">Mapel</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Silabus</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">RPP</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Prota</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Promes</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right">Hasil Pemeriksaan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody as={motion.tbody} variants={containerVariants} initial="hidden" animate="show">
                {mockAdministrasi.map((row) => (
                  <TableRow as={motion.tr} variants={itemVariants} key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.guru}</TableCell>
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.mapel}</TableCell>
                    <TableCell className="py-4 text-center">
                      {row.kelengkapan.silabus ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {row.kelengkapan.rpp ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {row.kelengkapan.prota ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {row.kelengkapan.promes ? <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" /> : <AlertCircle className="h-5 w-5 text-rose-500 mx-auto" />}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        row.hasil === "Lengkap & Sesuai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}>
                        {row.hasil}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
