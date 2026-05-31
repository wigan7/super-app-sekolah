"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockTamu = [
  {
    id: 1,
    tanggal: "20 Feb 2026",
    nama: "Drs. H. Mulyono, M.Pd",
    jabatan: "Pengawas Sekolah",
    maksud: "Monitoring Pelaksanaan Ujian Praktek",
    temuan: "Pelaksanaan berjalan tertib. Administrasi lengkap.",
  },
  {
    id: 2,
    tanggal: "22 Feb 2026",
    nama: "dr. Siska",
    jabatan: "Puskesmas Kecamatan",
    maksud: "Pemeriksaan Kesehatan Berkala & BIAS",
    temuan: "Sebagian besar siswa sehat, 5 siswa disarankan pemeriksaan gigi lanjutan.",
  },
];

const mockHumas = [
  {
    id: 1,
    tanggal: "18 Feb 2026",
    kegiatan: "Rapat Pleno Komite Sekolah",
    pihak: "Komite & Wali Murid",
    hasil: "Disepakati program perbaikan fasilitas sanitasi sekolah secara swadaya.",
  },
  {
    id: 2,
    tanggal: "25 Feb 2026",
    kegiatan: "Kunjungan Edukatif ke Museum",
    pihak: "Dinas Kebudayaan",
    hasil: "Siswa mendapatkan wawasan sejarah lokal secara langsung.",
  },
];

const mockPengaduan = [
  {
    id: 1,
    nama: "Ibu Rahmawati",
    unsur: "Wali Murid (Kelas II)",
    masalah: "Kualitas katering makanan sekolah kurang bervariasi.",
    solusi: "Evaluasi vendor katering dan penambahan menu sayur & buah.",
    tindakLanjut: "Rapat dengan pihak katering minggu depan.",
    status: "Diproses",
  },
  {
    id: 2,
    nama: "Bapak Sudirman",
    unsur: "Tokoh Masyarakat",
    masalah: "Lalu lintas depan sekolah macet saat jam pulang.",
    solusi: "Pengaturan jalur penjemputan dan koordinasi dengan Linmas setempat.",
    tindakLanjut: "Penerapan sistem drop-zone mulai bulan depan.",
    status: "Selesai",
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

export default function TabHumas() {
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
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Tamu & Pembinaan</CardTitle>
              <CardDescription>Catatan kunjungan dinas dan tamu ke SDN Mukiran 03.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-[120px]">Tanggal</TableHead>
                      <TableHead className="font-medium text-slate-500 w-[200px]">Nama / Jabatan Tamu</TableHead>
                      <TableHead className="font-medium text-slate-500 w-[250px]">Maksud Kunjungan</TableHead>
                      <TableHead className="font-medium text-slate-500">Temuan / Kesan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTamu.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                        <TableCell className="py-4">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{row.nama}</div>
                          <div className="text-sm text-slate-500">{row.jabatan}</div>
                        </TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.maksud}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.temuan}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humas">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Kegiatan Hubungan Masyarakat</CardTitle>
              <CardDescription>Kerjasama dengan Komite Sekolah dan Lembaga Eksternal.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-[120px]">Tanggal</TableHead>
                      <TableHead className="font-medium text-slate-500 w-[200px]">Kegiatan</TableHead>
                      <TableHead className="font-medium text-slate-500 w-[200px]">Pihak Terlibat</TableHead>
                      <TableHead className="font-medium text-slate-500">Hasil / Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHumas.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                        <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.kegiatan}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.pihak}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.hasil}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengaduan">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Pengaduan & Saran</CardTitle>
              <CardDescription>Aspirasi dan tindak lanjut keluhan masyarakat terkait sekolah.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-[200px]">Nama & Unsur</TableHead>
                      <TableHead className="font-medium text-slate-500 w-[250px]">Masalah / Saran</TableHead>
                      <TableHead className="font-medium text-slate-500 w-[250px]">Solusi</TableHead>
                      <TableHead className="font-medium text-slate-500 text-center">Tindak Lanjut & Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPengaduan.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{row.nama}</div>
                          <div className="text-sm text-slate-500">{row.unsur}</div>
                        </TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.masalah}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.solusi}</TableCell>
                        <TableCell className="py-4">
                           <div className="text-sm text-slate-600 dark:text-slate-300 text-center mb-1">{row.tindakLanjut}</div>
                           <div className="text-center">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              row.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                             }`}>
                              {row.status}
                             </span>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
