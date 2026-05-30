"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockPencapaian = [
  { id: 1, mapel: "Pendidikan Agama", target: 85, dayaSerap: 80, color: "bg-blue-500" },
  { id: 2, mapel: "PPKn", target: 90, dayaSerap: 88, color: "bg-indigo-500" },
  { id: 3, mapel: "Bahasa Indonesia", target: 100, dayaSerap: 92, color: "bg-emerald-500" },
  { id: 4, mapel: "Matematika", target: 80, dayaSerap: 75, color: "bg-amber-500" },
  { id: 5, mapel: "IPAS", target: 85, dayaSerap: 82, color: "bg-rose-500" },
];

const mockPembagianTugas = [
  {
    id: 1,
    nama: "Budi Santoso, S.Pd",
    golongan: "III/c",
    jabatan: "Guru Kelas",
    kelas: "VI A",
    jam: 24,
  },
  {
    id: 2,
    nama: "Siti Aminah, M.Pd",
    golongan: "IV/a",
    jabatan: "Guru Mapel",
    kelas: "IV, V, VI",
    jam: 18,
  },
  {
    id: 3,
    nama: "Wigan Anggit Utomo, S.Pd",
    golongan: "III/b",
    jabatan: "Kepala Sekolah",
    kelas: "-",
    jam: 6,
  }
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

const ProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => (
  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full rounded-full ${colorClass}`} 
    />
  </div>
);

export default function TabKurikulum() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pencapaian Kurikulum Semester Berjalan</CardTitle>
          <CardDescription>Target penyampaian materi dan persentase daya serap siswa per Mata Pelajaran.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            {mockPencapaian.map((item, i) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.mapel}</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Target Kurikulum</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.target}%</span>
                    </div>
                    <ProgressBar value={item.target} colorClass={item.color} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Daya Serap Siswa</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.dayaSerap}%</span>
                    </div>
                    <ProgressBar value={item.dayaSerap} colorClass={item.color} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pembagian Tugas Mengajar</CardTitle>
          <CardDescription>Distribusi beban mengajar guru di SDN Mukiran 03.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                  <TableHead className="font-medium text-slate-500">Nama Guru</TableHead>
                  <TableHead className="font-medium text-slate-500">Golongan</TableHead>
                  <TableHead className="font-medium text-slate-500">Jabatan</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Kelas</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Jml Jam</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody as={motion.tbody} variants={containerVariants} initial="hidden" animate="show">
                {mockPembagianTugas.map((row) => (
                  <TableRow as={motion.tr} variants={itemVariants} key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                    <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.golongan}</TableCell>
                    <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.jabatan}</TableCell>
                    <TableCell className="py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{row.kelas}</TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">
                        {row.jam}
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
