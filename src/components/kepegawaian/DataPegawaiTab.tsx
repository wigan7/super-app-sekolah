"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";

type Penilaian = {
  pangkat: string;
  tanggal: string;
  uraian: string;
  pejabat: string;
};

type Pegawai = {
  id: string;
  nama: string;
  nip: string;
  jabatan: string;
  status: string;
  penilaian?: Penilaian[];
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_FORM = {
  nama: "",
  nip: "",
  jabatan: "",
  status: "PNS",
};

export function DataPegawaiTab() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rows, setRows] = useState<Pegawai[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/data/kepegawaian/pegawai");
      if (!res.ok) {
        return;
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data pegawai:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        penilaian: [],
      };

      const res = await fetch("/api/data/kepegawaian/pegawai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        alert("Gagal menyimpan data pegawai.");
        return;
      }

      setForm(EMPTY_FORM);
      setOpen(false);
      await fetchRows();
    } catch (error) {
      console.error("Gagal menyimpan data pegawai:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-slate-900 text-white hover:bg-slate-800" />}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pegawai
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Data Pegawai</DialogTitle>
              <DialogDescription>Input data guru atau pegawai baru.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" value={form.nama} onChange={(e) => setForm((prev) => ({ ...prev, nama: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" value={form.nip} onChange={(e) => setForm((prev) => ({ ...prev, nip: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input id="jabatan" value={form.jabatan} onChange={(e) => setForm((prev) => ({ ...prev, jabatan: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Batal</Button>
              <Button onClick={handleSubmit} disabled={saving}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data pegawai.</TableCell>
              </TableRow>
            ) : (
              <AnimatePresence mode="popLayout">
                {rows.map((pegawai, index) => (
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
                              {(pegawai.penilaian ?? []).length > 0 ? (
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
                                      {(pegawai.penilaian ?? []).map((nilai, idx) => (
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
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
