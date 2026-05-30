"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockDiklat = [
  { id: 1, nama: "Budi Santoso, S.Pd", diklat: "Pelatihan Implementasi Kurikulum Merdeka", penyelenggara: "Kemdikbudristek", tingkat: "Nasional", tahun: "2023", lama: "32 Jam" },
  { id: 2, nama: "Siti Aminah, M.Pd", diklat: "Bimtek Pemanfaatan Platform Merdeka Mengajar", penyelenggara: "Dinas Pendidikan Kab. Semarang", tingkat: "Kabupaten", tahun: "2024", lama: "32 Jam" },
  { id: 3, nama: "Ahmad Zainuri, S.Pd.I", diklat: "Seminar Pendidikan Agama Islam Transformatif", penyelenggara: "Kemenag", tingkat: "Provinsi", tahun: "2022", lama: "16 Jam" },
];

const mockPenghargaan = [
  { id: 1, nama: "Budi Santoso, S.Pd", penghargaan: "Guru Berprestasi", tingkat: "Kabupaten", instansi: "Bupati Semarang", nomor: "800/123/2023", tahun: "2023" },
  { id: 2, nama: "Siti Aminah, M.Pd", penghargaan: "Satyalancana Karya Satya 10 Tahun", tingkat: "Nasional", instansi: "Presiden RI", nomor: "123/TK/Tahun 2022", tahun: "2022" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function PengembanganPrestasiTab() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Pengembangan & Prestasi Guru
        </h2>
        <p className="text-sm text-slate-500">
          Riwayat diklat, penataran, seminar, dan penghargaan yang diperoleh.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="diklat">
        <AccordionItem value="diklat" className="border border-slate-200 rounded-xl bg-white px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-medium text-slate-900 py-4">
            Buku Diklat/Penataran & Seminar
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="rounded-lg border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Nama Penataran/Seminar</TableHead>
                    <TableHead>Penyelenggara</TableHead>
                    <TableHead>Tingkat</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Lama (Jam)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDiklat.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="font-medium text-slate-900">{item.nama}</TableCell>
                      <TableCell className="text-slate-600">{item.diklat}</TableCell>
                      <TableCell className="text-slate-600">{item.penyelenggara}</TableCell>
                      <TableCell className="text-slate-600">{item.tingkat}</TableCell>
                      <TableCell className="text-slate-600">{item.tahun}</TableCell>
                      <TableCell className="text-slate-600">{item.lama}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="penghargaan" className="border border-slate-200 rounded-xl bg-white px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-medium text-slate-900 py-4">
            Buku Penghargaan
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="rounded-lg border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead>Nama Guru</TableHead>
                    <TableHead>Nama Penghargaan</TableHead>
                    <TableHead>Tingkat</TableHead>
                    <TableHead>Instansi Pemberi</TableHead>
                    <TableHead>Nomor</TableHead>
                    <TableHead>Tahun</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPenghargaan.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      transition={{ delay: index * 0.05 }}
                      className="border-b transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="font-medium text-slate-900">{item.nama}</TableCell>
                      <TableCell className="text-slate-600">{item.penghargaan}</TableCell>
                      <TableCell className="text-slate-600">{item.tingkat}</TableCell>
                      <TableCell className="text-slate-600">{item.instansi}</TableCell>
                      <TableCell className="text-slate-600">{item.nomor}</TableCell>
                      <TableCell className="text-slate-600">{item.tahun}</TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
