"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

const mockPegawai = [
  {
    id: 1,
    nama: "Budi Santoso, S.Pd",
    nip: "198001012005011001",
    jabatan: "Guru Kelas",
    status: "PNS",
    penilaian: [
      {
        pangkat: "Penata Muda / III.a",
        tanggal: "15 Jan 2024",
        uraian: "Baik",
        pejabat: "Kepala Sekolah",
      },
    ],
  },
  {
    id: 2,
    nama: "Siti Aminah, M.Pd",
    nip: "197505152000122002",
    jabatan: "Guru PAI",
    status: "PNS",
    penilaian: [
      {
        pangkat: "Penata / III.c",
        tanggal: "10 Feb 2024",
        uraian: "Sangat Baik",
        pejabat: "Kepala Sekolah",
      },
      {
        pangkat: "Penata Muda Tk I / III.b",
        tanggal: "12 Feb 2022",
        uraian: "Baik",
        pejabat: "Kepala Sekolah",
      },
    ],
  },
  {
    id: 3,
    nama: "Agus Riyadi",
    nip: "-",
    jabatan: "Penjaga Sekolah",
    status: "Honorer",
    penilaian: [],
  },
];


const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function DataPegawaiTab() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Daftar Guru & Pegawai
          </h2>
          <p className="text-sm text-slate-500">
            SDN Mukiran 03 - Data pokok kepegawaian dan riwayat penilaian.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {mockPegawai.map((pegawai, index) => (
                <React.Fragment key={pegawai.id}>
                  <motion.tr
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    transition={{ delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-slate-50 cursor-pointer"
                    onClick={() => toggleExpand(pegawai.id)}
                  >
                    <TableCell className="text-center">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        {expandedId === pegawai.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {pegawai.nama}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {pegawai.nip}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {pegawai.jabatan}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pegawai.status === "PNS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {pegawai.status}
                      </span>
                    </TableCell>
                  </motion.tr>
                  {expandedId === pegawai.id && (
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableCell colSpan={5} className="p-0 border-b">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-4 pb-6 ml-12 border-l-2 border-blue-200">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">
                              Catatan Penilaian PNS
                            </h4>
                            {pegawai.penilaian.length > 0 ? (
                              <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="bg-slate-50/50">
                                      <TableHead className="text-xs">Pangkat / Gol. Ruang</TableHead>
                                      <TableHead className="text-xs">Tanggal</TableHead>
                                      <TableHead className="text-xs">Uraian</TableHead>
                                      <TableHead className="text-xs">Pejabat Penilai</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pegawai.penilaian.map((nilai, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="text-xs font-medium text-slate-900">
                                          {nilai.pangkat}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600">
                                          {nilai.tanggal}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600">
                                          {nilai.uraian}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-600">
                                          {nilai.pejabat}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            ) : (
                              <p className="text-sm text-slate-500 italic">
                                Belum ada riwayat penilaian atau bukan PNS.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
