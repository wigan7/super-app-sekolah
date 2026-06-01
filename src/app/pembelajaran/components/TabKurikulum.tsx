"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
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
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows,
  getIdentitas
} from "@/lib/clientDb";

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
  const [pegawaiList, setPegawaiList] = useState<any[]>([]);
  const [openPencapaian, setOpenPencapaian] = useState(false);
  const [openTugas, setOpenTugas] = useState(false);
  const [pencapaianForm, setPencapaianForm] = useState(EMPTY_PENCAPAIAN);
  const [tugasForm, setTugasForm] = useState(EMPTY_TUGAS);
  const [namaSekolah, setNamaSekolah] = useState("");
  const [editingPencapaianId, setEditingPencapaianId] = useState<string | null>(null);
  const [editingTugasId, setEditingTugasId] = useState<string | null>(null);

  const fetchRows = () => {
    try {
      const pencapaianData = getDatasetRows("pembelajaran", "kurikulumPencapaian");
      const tugasData = getDatasetRows("pembelajaran", "pembagianTugas");
      
      setPencapaianRows(Array.isArray(pencapaianData) ? (pencapaianData as PencapaianRow[]) : []);
      setTugasRows(Array.isArray(tugasData) ? (tugasData as TugasRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat data kurikulum:", error);
    }
  };

  const fetchPegawaiList = () => {
    try {
      const data = getDatasetRows("kepegawaian", "pegawai");
      setPegawaiList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat list pegawai:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
    fetchPegawaiList();

    const fetchSchoolName = () => {
      try {
        const data = getIdentitas();
        setNamaSekolah(data?.namaSekolah || "");
      } catch (error) {
        console.error("Gagal memuat nama sekolah di kurikulum:", error);
      }
    };
    fetchSchoolName();
  }, []);

  const savePencapaian = () => {
    const payload = {
      mapel: pencapaianForm.mapel,
      target: Number(pencapaianForm.target || 0),
      dayaSerap: Number(pencapaianForm.dayaSerap || 0),
      color: pencapaianForm.color,
    };

    const isEdit = !!editingPencapaianId;
    try {
      if (isEdit) {
        const updated = pencapaianRows.map(r => r.id === editingPencapaianId ? { ...r, ...payload } : r);
        importDatasetRows("pembelajaran", "kurikulumPencapaian", updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", "kurikulumPencapaian", payload);
      }

      setPencapaianForm(EMPTY_PENCAPAIAN);
      setEditingPencapaianId(null);
      setOpenPencapaian(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} pencapaian`);
    }
  };

  const deletePencapaian = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pencapaian kurikulum ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", "kurikulumPencapaian", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const saveTugas = () => {
    const payload = {
      ...tugasForm,
      jam: Number(tugasForm.jam || 0),
    };

    const isEdit = !!editingTugasId;
    try {
      if (isEdit) {
        const updated = tugasRows.map(r => r.id === editingTugasId ? { ...r, ...payload } : r);
        importDatasetRows("pembelajaran", "pembagianTugas", updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", "pembagianTugas", payload);
      }

      setTugasForm(EMPTY_TUGAS);
      setEditingTugasId(null);
      setOpenTugas(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} tugas`);
    }
  };

  const deleteTugas = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pembagian tugas mengajar ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", "pembagianTugas", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
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
            <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setPencapaianForm(EMPTY_PENCAPAIAN); setEditingPencapaianId(null); }}><Plus className="h-4 w-4 mr-2" />Input Pencapaian</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>{editingPencapaianId ? "Edit Pencapaian Kurikulum" : "Input Pencapaian Kurikulum"}</DialogTitle><DialogDescription>Tambah target dan daya serap mapel.</DialogDescription></DialogHeader>
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
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setPencapaianForm({
                            mapel: item.mapel || "",
                            target: item.target?.toString() || "",
                            dayaSerap: item.dayaSerap?.toString() || "",
                            color: item.color || "bg-blue-500",
                          });
                          setEditingPencapaianId(item.id);
                          setOpenPencapaian(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePencapaian(item.id)}
                        className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
            <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setTugasForm(EMPTY_TUGAS); setEditingTugasId(null); }}><Plus className="h-4 w-4 mr-2" />Input Tugas</Button>} />
            <DialogContent>
              <DialogHeader><DialogTitle>{editingTugasId ? "Edit Pembagian Tugas" : "Input Pembagian Tugas"}</DialogTitle><DialogDescription>Tambah distribusi tugas mengajar guru.</DialogDescription></DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="tugas-guru-select">Pilih Guru</Label>
                  <select
                    id="tugas-guru-select"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                    value={tugasForm.nama}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = pegawaiList.find((p) => p.nama === val);
                      setTugasForm((prev) => ({
                        ...prev,
                        nama: val,
                        golongan: matched ? (matched.status || "") : prev.golongan,
                        jabatan: matched ? (matched.jabatan || "") : prev.jabatan,
                      }));
                    }}
                  >
                    <option value="">-- Pilih Guru --</option>
                    {pegawaiList.map((p) => (
                      <option key={p.id} value={p.nama}>
                        {p.nama} {p.nip && p.nip !== "-" ? `(NIP. ${p.nip})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2"><Label htmlFor="gol">Status Pegawai</Label><Input id="gol" value={tugasForm.golongan} onChange={(e) => setTugasForm((prev) => ({ ...prev, golongan: e.target.value }))} /></div>
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
                  <TableHead className="font-medium text-slate-500">Status Pegawai</TableHead>
                  <TableHead className="font-medium text-slate-500">Jabatan</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Kelas</TableHead>
                  <TableHead className="font-medium text-slate-500 text-center">Jml Jam</TableHead>
                  <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tugasRows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data pembagian tugas.</TableCell></TableRow>
                ) : (
                  tugasRows.map((row) => (
                    <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.golongan}</TableCell>
                      <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.jabatan}</TableCell>
                      <TableCell className="py-4 text-center text-slate-600 dark:text-slate-300 font-medium">{row.kelas}</TableCell>
                      <TableCell className="py-4 text-center"><span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">{row.jam}</span></TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => {
                              setTugasForm({
                                nama: row.nama || "",
                                golongan: row.golongan || "",
                                jabatan: row.jabatan || "",
                                kelas: row.kelas || "",
                                jam: row.jam?.toString() || "",
                              });
                              setEditingTugasId(row.id);
                              setOpenTugas(true);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTugas(row.id)}
                            className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TableCell>
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
