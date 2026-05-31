"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type PencapaianRow = {
  id: string;
  mapel: string;
  target: number;
  dayaSerap: number;
  color?: string;
};

type TugasRow = {
  id: string;
  nama: string;
  golongan: string;
  jabatan: string;
  kelas: string;
  jam: number;
};

const ProgressBar = ({ value, colorClass }: { value: number; colorClass: string }) => (
  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full rounded-full ${colorClass}`}
    />
  </div>
);

const EMPTY_PENCAPAIAN = {
  mapel: "",
  target: "",
  dayaSerap: "",
  color: "bg-blue-500",
};

const EMPTY_TUGAS = {
  nama: "",
  golongan: "",
  jabatan: "",
  kelas: "",
  jam: "",
};

export default function TabKurikulum() {
  const [pencapaianRows, setPencapaianRows] = useState<PencapaianRow[]>([]);
  const [tugasRows, setTugasRows] = useState<TugasRow[]>([]);
  const [openPencapaian, setOpenPencapaian] = useState(false);
  const [openTugas, setOpenTugas] = useState(false);
  const [pencapaianForm, setPencapaianForm] = useState(EMPTY_PENCAPAIAN);
  const [tugasForm, setTugasForm] = useState(EMPTY_TUGAS);
  const [namaSekolah, setNamaSekolah] = useState("");

  const fetchRows = async () => {
    try {
      const [pencapaianRes, tugasRes] = await Promise.all([
        fetch("/api/data/pembelajaran/kurikulumPencapaian"),
        fetch("/api/data/pembelajaran/pembagianTugas"),
      ]);

      if (pencapaianRes.ok) {
        const data = await pencapaianRes.json();
        setPencapaianRows(Array.isArray(data) ? data : []);
      }

      if (tugasRes.ok) {
        const data = await tugasRes.json();
        setTugasRows(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Gagal memuat data kurikulum:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();

    const fetchSchoolName = async () => {
      try {
        const res = await fetch("/api/identitas");
        if (res.ok) {
          const data = await res.json();
          setNamaSekolah(data?.namaSekolah || "");
        }
      } catch (error) {
        console.error("Gagal memuat nama sekolah di kurikulum:", error);
      }
    };
    fetchSchoolName();
  }, []);

  const savePencapaian = async () => {
    const payload = {
      mapel: pencapaianForm.mapel,
      target: Number(pencapaianForm.target || 0),
      dayaSerap: Number(pencapaianForm.dayaSerap || 0),
      color: pencapaianForm.color,
    };

    const res = await fetch("/api/data/pembelajaran/kurikulumPencapaian", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan pencapaian");
    }

    setPencapaianForm(EMPTY_PENCAPAIAN);
    setOpenPencapaian(false);
    await fetchRows();
  };

  const saveTugas = async () => {
    const payload = {
      ...tugasForm,
      jam: Number(tugasForm.jam || 0),
    };

    const res = await fetch("/api/data/pembelajaran/pembagianTugas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Gagal menyimpan tugas");
    }

    setTugasForm(EMPTY_TUGAS);
    setOpenTugas(false);
    await fetchRows();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pencapaian Kurikulum Semester Berjalan</CardTitle>
            <CardDescription>Target penyampaian materi dan persentase daya serap siswa per Mata Pelajaran.</CardDescription>
          </div>
          <Dialog open={openPencapaian} onOpenChange={setOpenPencapaian}>
            <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Pencapaian</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Input Pencapaian Kurikulum</DialogTitle><DialogDescription>Tambah target dan daya serap mapel.</DialogDescription></DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2"><Label htmlFor="mapel">Mata Pelajaran</Label><Input id="mapel" value={pencapaianForm.mapel} onChange={(e) => setPencapaianForm((prev) => ({ ...prev, mapel: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label htmlFor="target">Target (%)</Label><Input id="target" type="number" value={pencapaianForm.target} onChange={(e) => setPencapaianForm((prev) => ({ ...prev, target: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="daya">Daya Serap (%)</Label><Input id="daya" type="number" value={pencapaianForm.dayaSerap} onChange={(e) => setPencapaianForm((prev) => ({ ...prev, dayaSerap: e.target.value }))} /></div>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpenPencapaian(false)}>Batal</Button><Button onClick={savePencapaian}>Simpan</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            {pencapaianRows.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada data pencapaian kurikulum.</p>
            ) : (
              pencapaianRows.map((item, i) => (
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
                      <ProgressBar value={item.target} colorClass={item.color ?? "bg-blue-500"} />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Daya Serap Siswa</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.dayaSerap}%</span>
                      </div>
                      <ProgressBar value={item.dayaSerap} colorClass={item.color ?? "bg-blue-500"} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Pembagian Tugas Mengajar</CardTitle>
            <CardDescription>Distribusi beban mengajar guru di {namaSekolah || "(Belum input Nama Sekolah)"}.</CardDescription>
          </div>
          <Dialog open={openTugas} onOpenChange={setOpenTugas}>
            <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="h-4 w-4 mr-2" />Input Tugas</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>Input Pembagian Tugas</DialogTitle><DialogDescription>Tambah distribusi tugas mengajar guru.</DialogDescription></DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2"><Label htmlFor="nama">Nama Guru</Label><Input id="nama" value={tugasForm.nama} onChange={(e) => setTugasForm((prev) => ({ ...prev, nama: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label htmlFor="gol">Golongan</Label><Input id="gol" value={tugasForm.golongan} onChange={(e) => setTugasForm((prev) => ({ ...prev, golongan: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="jab">Jabatan</Label><Input id="jab" value={tugasForm.jabatan} onChange={(e) => setTugasForm((prev) => ({ ...prev, jabatan: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label htmlFor="kelas">Kelas</Label><Input id="kelas" value={tugasForm.kelas} onChange={(e) => setTugasForm((prev) => ({ ...prev, kelas: e.target.value }))} /></div>
                  <div className="grid gap-2"><Label htmlFor="jam">Jml Jam</Label><Input id="jam" type="number" value={tugasForm.jam} onChange={(e) => setTugasForm((prev) => ({ ...prev, jam: e.target.value }))} /></div>
                </div>
              </div>
              <DialogFooter><Button variant="outline" onClick={() => setOpenTugas(false)}>Batal</Button><Button onClick={saveTugas}>Simpan</Button></DialogFooter>
            </DialogContent>
          </Dialog>
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
              <TableBody>
                {tugasRows.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-500">Belum ada data pembagian tugas.</TableCell></TableRow>
                ) : (
                  tugasRows.map((row) => (
                    <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.golongan}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.jabatan}</TableCell>
                      <TableCell className="py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{row.kelas}</TableCell>
                      <TableCell className="py-4 text-center"><span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">{row.jam}</span></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
