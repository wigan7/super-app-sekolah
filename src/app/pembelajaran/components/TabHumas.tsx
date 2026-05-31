"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

type TamuRow = {
  id: string;
  tanggal: string;
  nama: string;
  jabatan: string;
  maksud: string;
  temuan: string;
};

type HumasRow = {
  id: string;
  tanggal: string;
  kegiatan: string;
  pihak: string;
  hasil: string;
};

type PengaduanRow = {
  id: string;
  nama: string;
  unsur: string;
  masalah: string;
  solusi: string;
  tindakLanjut: string;
  status: string;
};

const EMPTY_TAMU = {
  tanggal: "",
  nama: "",
  jabatan: "",
  maksud: "",
  temuan: "",
};

const EMPTY_HUMAS = {
  tanggal: "",
  kegiatan: "",
  pihak: "",
  hasil: "",
};

const EMPTY_PENGADUAN = {
  nama: "",
  unsur: "",
  masalah: "",
  solusi: "",
  tindakLanjut: "",
  status: "Diproses",
};

export default function TabHumas() {
  const [tamuRows, setTamuRows] = useState<TamuRow[]>([]);
  const [humasRows, setHumasRows] = useState<HumasRow[]>([]);
  const [pengaduanRows, setPengaduanRows] = useState<PengaduanRow[]>([]);
  const [openTamu, setOpenTamu] = useState(false);
  const [openHumas, setOpenHumas] = useState(false);
  const [openPengaduan, setOpenPengaduan] = useState(false);
  const [tamuForm, setTamuForm] = useState(EMPTY_TAMU);
  const [humasForm, setHumasForm] = useState(EMPTY_HUMAS);
  const [pengaduanForm, setPengaduanForm] = useState(EMPTY_PENGADUAN);

  const fetchRows = async () => {
    try {
      const [tamuRes, humasRes, pengaduanRes] = await Promise.all([
        fetch("/api/data/pembelajaran/tamu"),
        fetch("/api/data/pembelajaran/humas"),
        fetch("/api/data/pembelajaran/pengaduan"),
      ]);

      if (tamuRes.ok) {
        const data = await tamuRes.json();
        setTamuRows(Array.isArray(data) ? data : []);
      }

      if (humasRes.ok) {
        const data = await humasRes.json();
        setHumasRows(Array.isArray(data) ? data : []);
      }

      if (pengaduanRes.ok) {
        const data = await pengaduanRes.json();
        setPengaduanRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data humas:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
  }, []);

  const save = async (endpoint: string, payload: Record<string, string>, onDone: () => void) => {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan data");
    }

    onDone();
    await fetchRows();
  };

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
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Tamu & Pembinaan</CardTitle>
                <CardDescription>Catatan kunjungan dinas dan tamu ke SDN Mukiran 03.</CardDescription>
              </div>
              <Dialog open={openTamu} onOpenChange={setOpenTamu}>
                <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Tamu</Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle>Input Kunjungan Tamu</DialogTitle><DialogDescription>Tambahkan catatan kunjungan baru.</DialogDescription></DialogHeader>
                  <div className="grid gap-3">
                    <div className="grid gap-2"><Label htmlFor="ttanggal">Tanggal</Label><Input id="ttanggal" value={tamuForm.tanggal} onChange={(e) => setTamuForm((prev) => ({ ...prev, tanggal: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="tnama">Nama</Label><Input id="tnama" value={tamuForm.nama} onChange={(e) => setTamuForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="tjabatan">Jabatan</Label><Input id="tjabatan" value={tamuForm.jabatan} onChange={(e) => setTamuForm((prev) => ({ ...prev, jabatan: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="tmaksud">Maksud Kunjungan</Label><Input id="tmaksud" value={tamuForm.maksud} onChange={(e) => setTamuForm((prev) => ({ ...prev, maksud: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="ttemuan">Temuan/Kesan</Label><Input id="ttemuan" value={tamuForm.temuan} onChange={(e) => setTamuForm((prev) => ({ ...prev, temuan: e.target.value }))} /></div>
                  </div>
                  <DialogFooter><Button variant="outline" onClick={() => setOpenTamu(false)}>Batal</Button><Button onClick={() => save("/api/data/pembelajaran/tamu", tamuForm, () => { setTamuForm(EMPTY_TAMU); setOpenTamu(false); })}>Simpan</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-30">Tanggal</TableHead>
                      <TableHead className="font-medium text-slate-500 w-50">Nama / Jabatan Tamu</TableHead>
                      <TableHead className="font-medium text-slate-500 w-62.5">Maksud Kunjungan</TableHead>
                      <TableHead className="font-medium text-slate-500">Temuan / Kesan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tamuRows.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data kunjungan tamu.</TableCell></TableRow>
                    ) : (
                      tamuRows.map((row) => (
                        <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                          <TableCell className="py-4"><div className="font-medium text-slate-900 dark:text-slate-100">{row.nama}</div><div className="text-sm text-slate-500">{row.jabatan}</div></TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.maksud}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.temuan}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="humas">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Kegiatan Hubungan Masyarakat</CardTitle>
                <CardDescription>Kerjasama dengan Komite Sekolah dan Lembaga Eksternal.</CardDescription>
              </div>
              <Dialog open={openHumas} onOpenChange={setOpenHumas}>
                <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Kegiatan</Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle>Input Kegiatan Humas</DialogTitle><DialogDescription>Tambahkan kegiatan humas baru.</DialogDescription></DialogHeader>
                  <div className="grid gap-3">
                    <div className="grid gap-2"><Label htmlFor="htanggal">Tanggal</Label><Input id="htanggal" value={humasForm.tanggal} onChange={(e) => setHumasForm((prev) => ({ ...prev, tanggal: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="hkegiatan">Kegiatan</Label><Input id="hkegiatan" value={humasForm.kegiatan} onChange={(e) => setHumasForm((prev) => ({ ...prev, kegiatan: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="hpihak">Pihak Terlibat</Label><Input id="hpihak" value={humasForm.pihak} onChange={(e) => setHumasForm((prev) => ({ ...prev, pihak: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="hhasil">Hasil/Keterangan</Label><Input id="hhasil" value={humasForm.hasil} onChange={(e) => setHumasForm((prev) => ({ ...prev, hasil: e.target.value }))} /></div>
                  </div>
                  <DialogFooter><Button variant="outline" onClick={() => setOpenHumas(false)}>Batal</Button><Button onClick={() => save("/api/data/pembelajaran/humas", humasForm, () => { setHumasForm(EMPTY_HUMAS); setOpenHumas(false); })}>Simpan</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-30">Tanggal</TableHead>
                      <TableHead className="font-medium text-slate-500 w-50">Kegiatan</TableHead>
                      <TableHead className="font-medium text-slate-500 w-50">Pihak Terlibat</TableHead>
                      <TableHead className="font-medium text-slate-500">Hasil / Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {humasRows.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data kegiatan humas.</TableCell></TableRow>
                    ) : (
                      humasRows.map((row) => (
                        <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                          <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.kegiatan}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.pihak}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.hasil}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pengaduan">
          <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buku Pengaduan & Saran</CardTitle>
                <CardDescription>Aspirasi dan tindak lanjut keluhan masyarakat terkait sekolah.</CardDescription>
              </div>
              <Dialog open={openPengaduan} onOpenChange={setOpenPengaduan}>
                <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Pengaduan</Button>} />
                <DialogContent>
                  <DialogHeader><DialogTitle>Input Pengaduan & Saran</DialogTitle><DialogDescription>Tambahkan pengaduan/saran baru.</DialogDescription></DialogHeader>
                  <div className="grid gap-3">
                    <div className="grid gap-2"><Label htmlFor="pnama">Nama</Label><Input id="pnama" value={pengaduanForm.nama} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="punsur">Unsur</Label><Input id="punsur" value={pengaduanForm.unsur} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, unsur: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="pmasalah">Masalah/Saran</Label><Input id="pmasalah" value={pengaduanForm.masalah} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, masalah: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="psolusi">Solusi</Label><Input id="psolusi" value={pengaduanForm.solusi} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, solusi: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="ptindak">Tindak Lanjut</Label><Input id="ptindak" value={pengaduanForm.tindakLanjut} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, tindakLanjut: e.target.value }))} /></div>
                    <div className="grid gap-2"><Label htmlFor="pstatus">Status</Label><Input id="pstatus" value={pengaduanForm.status} onChange={(e) => setPengaduanForm((prev) => ({ ...prev, status: e.target.value }))} /></div>
                  </div>
                  <DialogFooter><Button variant="outline" onClick={() => setOpenPengaduan(false)}>Batal</Button><Button onClick={() => save("/api/data/pembelajaran/pengaduan", pengaduanForm, () => { setPengaduanForm(EMPTY_PENGADUAN); setOpenPengaduan(false); })}>Simpan</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50">
                      <TableHead className="font-medium text-slate-500 w-50">Nama & Unsur</TableHead>
                      <TableHead className="font-medium text-slate-500 w-62.5">Masalah / Saran</TableHead>
                      <TableHead className="font-medium text-slate-500 w-62.5">Solusi</TableHead>
                      <TableHead className="font-medium text-slate-500 text-center">Tindak Lanjut & Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pengaduanRows.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center text-slate-500">Belum ada data pengaduan.</TableCell></TableRow>
                    ) : (
                      pengaduanRows.map((row) => (
                        <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                          <TableCell className="py-4"><div className="font-medium text-slate-900 dark:text-slate-100">{row.nama}</div><div className="text-sm text-slate-500">{row.unsur}</div></TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.masalah}</TableCell>
                          <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.solusi}</TableCell>
                          <TableCell className="py-4"><div className="text-sm text-slate-600 dark:text-slate-300 text-center mb-1">{row.tindakLanjut}</div><div className="text-center"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${row.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>{row.status}</span></div></TableCell>
                        </TableRow>
                      ))
                    )}
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
