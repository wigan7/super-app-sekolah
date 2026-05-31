"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type DiklatRow = {
  id: string;
  nama: string;
  diklat: string;
  penyelenggara: string;
  tingkat: string;
  tahun: string;
  lama: string;
};

type PenghargaanRow = {
  id: string;
  nama: string;
  penghargaan: string;
  tingkat: string;
  instansi: string;
  nomor: string;
  tahun: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_DIKLAT = {
  nama: "",
  diklat: "",
  penyelenggara: "",
  tingkat: "",
  tahun: "",
  lama: "",
};

const EMPTY_PENGHARGAAN = {
  nama: "",
  penghargaan: "",
  tingkat: "",
  instansi: "",
  nomor: "",
  tahun: "",
};

export function PengembanganPrestasiTab() {
  const [diklatRows, setDiklatRows] = useState<DiklatRow[]>([]);
  const [penghargaanRows, setPenghargaanRows] = useState<PenghargaanRow[]>([]);
  const [openDiklat, setOpenDiklat] = useState(false);
  const [openPenghargaan, setOpenPenghargaan] = useState(false);
  const [diklatForm, setDiklatForm] = useState(EMPTY_DIKLAT);
  const [penghargaanForm, setPenghargaanForm] = useState(EMPTY_PENGHARGAAN);

  const fetchRows = async () => {
    try {
      const [diklatRes, penghargaanRes] = await Promise.all([
        fetch("/api/data/kepegawaian/diklat"),
        fetch("/api/data/kepegawaian/penghargaan"),
      ]);

      if (diklatRes.ok) {
        const data = await diklatRes.json();
        setDiklatRows(Array.isArray(data) ? data : []);
      }

      if (penghargaanRes.ok) {
        const data = await penghargaanRes.json();
        setPenghargaanRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data pengembangan/prestasi:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const saveDiklat = async () => {
    const res = await fetch("/api/data/kepegawaian/diklat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diklatForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan diklat");
    }

    setDiklatForm(EMPTY_DIKLAT);
    setOpenDiklat(false);
    await fetchRows();
  };

  const savePenghargaan = async () => {
    const res = await fetch("/api/data/kepegawaian/penghargaan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(penghargaanForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan penghargaan");
    }

    setPenghargaanForm(EMPTY_PENGHARGAAN);
    setOpenPenghargaan(false);
    await fetchRows();
  };

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

      <Accordion className="w-full space-y-4" defaultValue={["diklat"]}>
        <AccordionItem value="diklat" className="border border-slate-200 rounded-xl bg-white px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-medium text-slate-900 py-4">
            Buku Diklat/Penataran & Seminar
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <Dialog open={openDiklat} onOpenChange={setOpenDiklat}>
              <DialogTrigger render={<Button className="bg-slate-900 text-white hover:bg-slate-800" />}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Diklat
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Diklat/Seminar</DialogTitle>
                  <DialogDescription>Simpan riwayat pengembangan guru.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2"><Label htmlFor="dnama">Nama</Label><Input id="dnama" value={diklatForm.nama} onChange={(e) => setDiklatForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="ddiklat">Nama Diklat/Seminar</Label><Input id="ddiklat" value={diklatForm.diklat} onChange={(e) => setDiklatForm((prev) => ({ ...prev, diklat: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="dpenyelenggara">Penyelenggara</Label><Input id="dpenyelenggara" value={diklatForm.penyelenggara} onChange={(e) => setDiklatForm((prev) => ({ ...prev, penyelenggara: e.target.value }))} /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-2"><Label htmlFor="dtingkat">Tingkat</Label><Input id="dtingkat" value={diklatForm.tingkat} onChange={(e) => setDiklatForm((prev) => ({ ...prev, tingkat: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="dtahun">Tahun</Label><Input id="dtahun" value={diklatForm.tahun} onChange={(e) => setDiklatForm((prev) => ({ ...prev, tahun: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="dlama">Lama (Jam)</Label><Input id="dlama" value={diklatForm.lama} onChange={(e) => setDiklatForm((prev) => ({ ...prev, lama: e.target.value }))} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenDiklat(false)}>Batal</Button>
                  <Button onClick={saveDiklat}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                  {diklatRows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data diklat.</TableCell></TableRow>
                  ) : (
                    diklatRows.map((item, index) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="penghargaan" className="border border-slate-200 rounded-xl bg-white px-4 shadow-sm">
          <AccordionTrigger className="hover:no-underline font-medium text-slate-900 py-4">
            Buku Penghargaan
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3">
            <Dialog open={openPenghargaan} onOpenChange={setOpenPenghargaan}>
              <DialogTrigger render={<Button className="bg-slate-900 text-white hover:bg-slate-800" />}>
                <Plus className="h-4 w-4 mr-2" /> Tambah Penghargaan
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Penghargaan</DialogTitle>
                  <DialogDescription>Simpan data penghargaan guru.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2"><Label htmlFor="pnama">Nama</Label><Input id="pnama" value={penghargaanForm.nama} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="ppenghargaan">Nama Penghargaan</Label><Input id="ppenghargaan" value={penghargaanForm.penghargaan} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, penghargaan: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="pinstansi">Instansi Pemberi</Label><Input id="pinstansi" value={penghargaanForm.instansi} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, instansi: e.target.value }))} /></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="grid gap-2"><Label htmlFor="ptingkat">Tingkat</Label><Input id="ptingkat" value={penghargaanForm.tingkat} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, tingkat: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="pnomor">Nomor</Label><Input id="pnomor" value={penghargaanForm.nomor} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, nomor: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="ptahun">Tahun</Label><Input id="ptahun" value={penghargaanForm.tahun} onChange={(e) => setPenghargaanForm((prev) => ({ ...prev, tahun: e.target.value }))} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenPenghargaan(false)}>Batal</Button>
                  <Button onClick={savePenghargaan}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                  {penghargaanRows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data penghargaan.</TableCell></TableRow>
                  ) : (
                    penghargaanRows.map((item, index) => (
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
