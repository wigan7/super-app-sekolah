"use client";

import { useEffect, useState } from "react";
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

type IzinRow = {
  id: string;
  tanggal: string;
  nama: string;
  tujuan: string;
  keperluan: string;
  berangkat: string;
  kembali: string;
};

type PiketRow = {
  id: string;
  tanggal: string;
  nama: string;
  uraian: string;
  keterangan: string;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const EMPTY_IZIN = {
  tanggal: "",
  nama: "",
  tujuan: "",
  keperluan: "",
  berangkat: "",
  kembali: "",
};

const EMPTY_PIKET = {
  tanggal: "",
  nama: "",
  uraian: "",
  keterangan: "",
};

export function KehadiranPiketTab() {
  const [izinRows, setIzinRows] = useState<IzinRow[]>([]);
  const [piketRows, setPiketRows] = useState<PiketRow[]>([]);
  const [openIzin, setOpenIzin] = useState(false);
  const [openPiket, setOpenPiket] = useState(false);
  const [izinForm, setIzinForm] = useState(EMPTY_IZIN);
  const [piketForm, setPiketForm] = useState(EMPTY_PIKET);

  const fetchRows = async () => {
    try {
      const [izinRes, piketRes] = await Promise.all([
        fetch("/api/data/kepegawaian/izinKeluar"),
        fetch("/api/data/kepegawaian/piket"),
      ]);

      if (izinRes.ok) {
        const data = await izinRes.json();
        setIzinRows(Array.isArray(data) ? data : []);
      }

      if (piketRes.ok) {
        const data = await piketRes.json();
        setPiketRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data izin/piket:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const saveIzin = async () => {
    const res = await fetch("/api/data/kepegawaian/izinKeluar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(izinForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan izin");
    }

    setIzinForm(EMPTY_IZIN);
    setOpenIzin(false);
    await fetchRows();
  };

  const savePiket = async () => {
    const res = await fetch("/api/data/kepegawaian/piket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(piketForm),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan piket");
    }

    setPiketForm(EMPTY_PIKET);
    setOpenPiket(false);
    await fetchRows();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-slate-900">Buku Izin Keluar</CardTitle>
            <CardDescription>Pencatatan guru/pegawai yang izin keluar saat jam kerja.</CardDescription>
          </div>
          <Dialog open={openIzin} onOpenChange={setOpenIzin}>
            <DialogTrigger render={<Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors" />}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah Izin
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 border-slate-200">
              <DialogHeader>
                <DialogTitle>Form Izin Keluar</DialogTitle>
                <DialogDescription>
                  Masukkan detail izin keluar guru atau pegawai.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="inama">Nama/NIP</Label>
                  <Input id="inama" value={izinForm.nama} onChange={(e) => setIzinForm((prev) => ({ ...prev, nama: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="itanggal">Hari/Tanggal</Label>
                  <Input id="itanggal" value={izinForm.tanggal} onChange={(e) => setIzinForm((prev) => ({ ...prev, tanggal: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tujuan">Tujuan</Label>
                  <Input id="tujuan" value={izinForm.tujuan} onChange={(e) => setIzinForm((prev) => ({ ...prev, tujuan: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="keperluan">Keperluan</Label>
                  <Input id="keperluan" value={izinForm.keperluan} onChange={(e) => setIzinForm((prev) => ({ ...prev, keperluan: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="berangkat">Berangkat</Label>
                    <Input id="berangkat" type="time" value={izinForm.berangkat} onChange={(e) => setIzinForm((prev) => ({ ...prev, berangkat: e.target.value }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kembali">Kembali</Label>
                    <Input id="kembali" type="time" value={izinForm.kembali} onChange={(e) => setIzinForm((prev) => ({ ...prev, kembali: e.target.value }))} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenIzin(false)}>Batal</Button>
                <Button type="button" onClick={saveIzin}>Simpan Izin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-4">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-25 text-xs">Hari/Tanggal</TableHead>
                  <TableHead className="text-xs">Nama/NIP</TableHead>
                  <TableHead className="text-xs">Tujuan & Keperluan</TableHead>
                  <TableHead className="text-xs">Waktu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {izinRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data izin.</TableCell>
                  </TableRow>
                ) : (
                  izinRows.map((item, index) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900">Buku Piket Guru</CardTitle>
            <CardDescription>Laporan harian pelaksanaan piket oleh guru.</CardDescription>
          </div>
          <Dialog open={openPiket} onOpenChange={setOpenPiket}>
            <DialogTrigger render={<Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 transition-colors" />}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah Piket
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 border-slate-200">
              <DialogHeader>
                <DialogTitle>Form Piket Guru</DialogTitle>
                <DialogDescription>
                  Masukkan laporan piket harian guru.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="ptanggal">Hari/Tanggal</Label>
                  <Input id="ptanggal" value={piketForm.tanggal} onChange={(e) => setPiketForm((prev) => ({ ...prev, tanggal: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pnama">Nama Guru Piket</Label>
                  <Input id="pnama" value={piketForm.nama} onChange={(e) => setPiketForm((prev) => ({ ...prev, nama: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="puraian">Uraian</Label>
                  <Input id="puraian" value={piketForm.uraian} onChange={(e) => setPiketForm((prev) => ({ ...prev, uraian: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pket">Keterangan</Label>
                  <Input id="pket" value={piketForm.keterangan} onChange={(e) => setPiketForm((prev) => ({ ...prev, keterangan: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenPiket(false)}>Batal</Button>
                <Button type="button" onClick={savePiket}>Simpan Piket</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-100 overflow-hidden mt-4">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-25 text-xs">Hari/Tanggal</TableHead>
                  <TableHead className="text-xs">Guru Piket</TableHead>
                  <TableHead className="text-xs">Uraian & Ket</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {piketRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-slate-500">Belum ada data piket.</TableCell>
                  </TableRow>
                ) : (
                  piketRows.map((item, index) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
