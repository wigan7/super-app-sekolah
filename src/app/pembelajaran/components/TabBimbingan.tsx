"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

type KasusRow = {
  id: string;
  nama: string;
  tanggal: string;
  uraian: string;
  penyelesaian: string;
  tindakLanjut: string;
};

type BimbinganRow = {
  id: string;
  waktu: string;
  nama: string;
  masalah: string;
  bentuk: string;
  jenis: string;
  tindakLanjut: string;
};

const EMPTY_KASUS = {
  nama: "",
  tanggal: "",
  uraian: "",
  penyelesaian: "",
  tindakLanjut: "",
};

const EMPTY_BIMBINGAN = {
  waktu: "",
  nama: "",
  masalah: "",
  bentuk: "",
  jenis: "",
  tindakLanjut: "",
};

export default function TabBimbingan() {
  const [kasusRows, setKasusRows] = useState<KasusRow[]>([]);
  const [bimbinganRows, setBimbinganRows] = useState<BimbinganRow[]>([]);
  const [openKasus, setOpenKasus] = useState(false);
  const [openBimbingan, setOpenBimbingan] = useState(false);
  const [kasusForm, setKasusForm] = useState(EMPTY_KASUS);
  const [bimbinganForm, setBimbinganForm] = useState(EMPTY_BIMBINGAN);

  const fetchRows = async () => {
    try {
      const [kasusRes, bimbinganRes] = await Promise.all([
        fetch("/api/data/pembelajaran/kasus"),
        fetch("/api/data/pembelajaran/bimbingan"),
      ]);

      if (kasusRes.ok) {
        const data = await kasusRes.json();
        setKasusRows(Array.isArray(data) ? data : []);
      }

      if (bimbinganRes.ok) {
        const data = await bimbinganRes.json();
        setBimbinganRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data bimbingan:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const saveKasus = async () => {
    const res = await fetch("/api/data/pembelajaran/kasus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(kasusForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan kasus");
    }

    setKasusForm(EMPTY_KASUS);
    setOpenKasus(false);
    await fetchRows();
  };

  const saveBimbingan = async () => {
    const res = await fetch("/api/data/pembelajaran/bimbingan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bimbinganForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan bimbingan");
    }

    setBimbinganForm(EMPTY_BIMBINGAN);
    setOpenBimbingan(false);
    await fetchRows();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <Accordion defaultValue={["kasus", "bimbingan"]} className="w-full space-y-4">
        <AccordionItem value="kasus" className="border-none bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 rounded-xl px-6 py-2 shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex flex-col items-start text-left">
              <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Penyelesaian Kasus Siswa</span>
              <span className="text-sm font-normal text-slate-500 mt-1">Pencatatan insiden dan penanganan kasus indisipliner.</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-6 space-y-3">
            <Dialog open={openKasus} onOpenChange={setOpenKasus}>
              <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Kasus</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Kasus Siswa</DialogTitle>
                  <DialogDescription>Tambahkan catatan kasus baru.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2"><Label htmlFor="knama">Nama Murid</Label><Input id="knama" value={kasusForm.nama} onChange={(e) => setKasusForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="ktanggal">Tanggal</Label><Input id="ktanggal" value={kasusForm.tanggal} onChange={(e) => setKasusForm((prev) => ({ ...prev, tanggal: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="kuraian">Uraian Kasus</Label><Input id="kuraian" value={kasusForm.uraian} onChange={(e) => setKasusForm((prev) => ({ ...prev, uraian: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="kpenyelesaian">Cara Penyelesaian</Label><Input id="kpenyelesaian" value={kasusForm.penyelesaian} onChange={(e) => setKasusForm((prev) => ({ ...prev, penyelesaian: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="ktindak">Tindak Lanjut</Label><Input id="ktindak" value={kasusForm.tindakLanjut} onChange={(e) => setKasusForm((prev) => ({ ...prev, tindakLanjut: e.target.value }))} /></div>
                </div>
                <DialogFooter><Button variant="outline" onClick={() => setOpenKasus(false)}>Batal</Button><Button onClick={saveKasus}>Simpan</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                    <TableHead className="font-medium text-slate-500 w-50">Nama Murid</TableHead>
                    <TableHead className="font-medium text-slate-500 w-30">Tanggal</TableHead>
                    <TableHead className="font-medium text-slate-500 w-62.5">Uraian Kasus</TableHead>
                    <TableHead className="font-medium text-slate-500 w-62.5">Cara Penyelesaian</TableHead>
                    <TableHead className="font-medium text-slate-500">Tindak Lanjut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kasusRows.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data kasus.</TableCell></TableRow>
                  ) : (
                    kasusRows.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.uraian}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.penyelesaian}</TableCell>
                        <TableCell className="py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{row.tindakLanjut}</span></TableCell>
                      </TableRow>
                    ))
                  )}
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
          <AccordionContent className="pt-2 pb-6 space-y-3">
            <Dialog open={openBimbingan} onOpenChange={setOpenBimbingan}>
              <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Bimbingan</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Program Bimbingan</DialogTitle>
                  <DialogDescription>Tambahkan program bimbingan baru.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2"><Label htmlFor="bwaktu">Waktu</Label><Input id="bwaktu" value={bimbinganForm.waktu} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, waktu: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="bnama">Sasaran</Label><Input id="bnama" value={bimbinganForm.nama} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="bmasalah">Masalah/Topik</Label><Input id="bmasalah" value={bimbinganForm.masalah} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, masalah: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2"><Label htmlFor="bbentuk">Bentuk</Label><Input id="bbentuk" value={bimbinganForm.bentuk} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, bentuk: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="bjenis">Jenis</Label><Input id="bjenis" value={bimbinganForm.jenis} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, jenis: e.target.value }))} /></div>
                  </div>
                  <div className="grid gap-2"><Label htmlFor="btindak">Tindak Lanjut</Label><Input id="btindak" value={bimbinganForm.tindakLanjut} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, tindakLanjut: e.target.value }))} /></div>
                </div>
                <DialogFooter><Button variant="outline" onClick={() => setOpenBimbingan(false)}>Batal</Button><Button onClick={saveBimbingan}>Simpan</Button></DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                    <TableHead className="font-medium text-slate-500 w-37.5">Waktu</TableHead>
                    <TableHead className="font-medium text-slate-500 w-45">Sasaran (Nama)</TableHead>
                    <TableHead className="font-medium text-slate-500 w-50">Masalah/Topik</TableHead>
                    <TableHead className="font-medium text-slate-500 text-center">Bentuk</TableHead>
                    <TableHead className="font-medium text-slate-500 text-center">Jenis</TableHead>
                    <TableHead className="font-medium text-slate-500">Tindak Lanjut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bimbinganRows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data bimbingan.</TableCell></TableRow>
                  ) : (
                    bimbinganRows.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.waktu}</TableCell>
                        <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.masalah}</TableCell>
                        <TableCell className="py-4 text-center"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{row.bentuk}</span></TableCell>
                        <TableCell className="py-4 text-center"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">{row.jenis}</span></TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tindakLanjut}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
