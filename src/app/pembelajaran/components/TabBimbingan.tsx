"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockKasus = [
  {
    id: 1,
    nama: "Andi Wijaya (Kelas V)",
    tanggal: "10 Feb 2026",
    uraian: "Berkelahi dengan teman sekelas saat jam istirahat.",
    penyelesaian: "Pemanggilan kedua pihak dan mediasi oleh Wali Kelas.",
    tindakLanjut: "Pemantauan perilaku selama 1 minggu.",
  },
  {
    id: 2,
    nama: "Rina Sari (Kelas IV)",
    tanggal: "12 Feb 2026",
    uraian: "Sering tidak mengerjakan PR Matematika.",
    penyelesaian: "Diskusi personal untuk mengetahui kendala belajar di rumah.",
    tindakLanjut: "Pemanggilan orang tua jika tidak ada perubahan.",
  },
];

const mockBimbingan = [
  {
    id: 1,
    waktu: "14 Feb 2026, 13:00",
    nama: "Siswa Kelas VI",
    masalah: "Persiapan Ujian Sekolah & Motivasi Belajar",
    bentuk: "Kelompok",
    jenis: "Belajar",
    tindakLanjut: "Pemberian latihan soal tambahan.",
  },
  {
    id: 2,
    waktu: "15 Feb 2026, 09:00",
    nama: "Doni Pratama (Kelas III)",
    masalah: "Kesulitan beradaptasi dengan teman baru.",
    bentuk: "Individu",
    jenis: "Sosial",
    tindakLanjut: "Melibatkan Doni dalam kegiatan kelompok di kelas.",
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

export default function TabBimbingan() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <Accordion type="multiple" defaultValue={["kasus", "bimbingan"]} className="w-full space-y-4">
        <AccordionItem value="kasus" className="border-none bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 rounded-xl px-6 py-2 shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex flex-col items-start text-left">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Penyelesaian Kasus Siswa</span>
              <span className="text-sm font-normal text-slate-500 mt-1">Pencatatan insiden dan penanganan kasus indisipliner.</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                    <TableHead className="font-medium text-slate-500 w-[200px]">Nama Murid</TableHead>
                    <TableHead className="font-medium text-slate-500 w-[120px]">Tanggal</TableHead>
                    <TableHead className="font-medium text-slate-500 w-[250px]">Uraian Kasus</TableHead>
                    <TableHead className="font-medium text-slate-500 w-[250px]">Cara Penyelesaian</TableHead>
                    <TableHead className="font-medium text-slate-500">Tindak Lanjut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody as={motion.tbody} variants={containerVariants} initial="hidden" animate="show">
                  {mockKasus.map((row) => (
                    <TableRow as={motion.tr} variants={itemVariants} key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.uraian}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.penyelesaian}</TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                          {row.tindakLanjut}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bimbingan" className="border-none bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 rounded-xl px-6 py-2 shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex flex-col items-start text-left">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Program Bimbingan</span>
              <span className="text-sm font-normal text-slate-500 mt-1">Kegiatan bimbingan belajar dan sosial bagi siswa.</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6">
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                    <TableHead className="font-medium text-slate-500 w-[150px]">Waktu</TableHead>
                    <TableHead className="font-medium text-slate-500 w-[180px]">Sasaran (Nama)</TableHead>
                    <TableHead className="font-medium text-slate-500 w-[200px]">Masalah/Topik</TableHead>
                    <TableHead className="font-medium text-slate-500 text-center">Bentuk</TableHead>
                    <TableHead className="font-medium text-slate-500 text-center">Jenis</TableHead>
                    <TableHead className="font-medium text-slate-500">Tindak Lanjut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody as={motion.tbody} variants={containerVariants} initial="hidden" animate="show">
                  {mockBimbingan.map((row) => (
                    <TableRow as={motion.tr} variants={itemVariants} key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.waktu}</TableCell>
                      <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.masalah}</TableCell>
                      <TableCell className="py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.bentuk === "Individu" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        }`}>
                          {row.bentuk}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          row.jenis === "Belajar" ? "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
                        }`}>
                          {row.jenis}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tindakLanjut}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
