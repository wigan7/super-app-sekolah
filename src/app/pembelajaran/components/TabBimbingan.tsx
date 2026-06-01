"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getDatasetRows,
  appendDatasetRow,
  deleteDatasetRow,
  importDatasetRows
} from "@/lib/clientDb";

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
  const [editingKasusId, setEditingKasusId] = useState<string | null>(null);
  const [editingBimbinganId, setEditingBimbinganId] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [uniqueClasses, setUniqueClasses] = useState<string[]>([]);
  const [selectedKasusClass, setSelectedKasusClass] = useState<string>("");
  const [selectedBimbinganClass, setSelectedBimbinganClass] = useState<string>("");

  const fetchRows = () => {
    try {
      const kasusData = getDatasetRows("pembelajaran", "kasus");
      const bimbinganData = getDatasetRows("pembelajaran", "bimbingan");

      setKasusRows(Array.isArray(kasusData) ? (kasusData as KasusRow[]) : []);
      setBimbinganRows(Array.isArray(bimbinganData) ? (bimbinganData as BimbinganRow[]) : []);
    } catch (error) {
      console.error("Gagal memuat data bimbingan:", error);
    }
  };

  const fetchStudents = () => {
    try {
      const data = getDatasetRows("kesiswaan", "induk");
      if (Array.isArray(data)) {
        setAllStudents(data);
        const classes = Array.from(new Set(data.map((s: any) => s.kelas).filter(Boolean))) as string[];
        setUniqueClasses(classes.sort());
      }
    } catch (error) {
      console.error("Gagal memuat data siswa:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRows();
    fetchStudents();
  }, []);

  const saveKasus = () => {
    const isEdit = !!editingKasusId;
    try {
      if (isEdit) {
        const updated = kasusRows.map(r => r.id === editingKasusId ? { ...r, ...kasusForm } : r);
        importDatasetRows("pembelajaran", "kasus", updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", "kasus", kasusForm);
      }

      setKasusForm(EMPTY_KASUS);
      setEditingKasusId(null);
      setOpenKasus(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} kasus`);
    }
  };

  const deleteKasus = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data kasus ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", "kasus", id);
      fetchRows();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const saveBimbingan = () => {
    const isEdit = !!editingBimbinganId;
    try {
      if (isEdit) {
        const updated = bimbinganRows.map(r => r.id === editingBimbinganId ? { ...r, ...bimbinganForm } : r);
        importDatasetRows("pembelajaran", "bimbingan", updated, "overwrite");
      } else {
        appendDatasetRow("pembelajaran", "bimbingan", bimbinganForm);
      }

      setBimbinganForm(EMPTY_BIMBINGAN);
      setEditingBimbinganId(null);
      setOpenBimbingan(false);
      fetchRows();
    } catch (err) {
      console.error(err);
      alert(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} bimbingan`);
    }
  };

  const deleteBimbingan = (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data bimbingan ini?")) return;
    try {
      deleteDatasetRow("pembelajaran", "bimbingan", id);
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
              <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setKasusForm(EMPTY_KASUS); setEditingKasusId(null); setSelectedKasusClass(""); }}><Plus className="h-4 w-4 mr-2" />Input Kasus</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingKasusId ? "Edit Kasus Siswa" : "Input Kasus Siswa"}</DialogTitle>
                  <DialogDescription>Catat detail kasus siswa.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="kasus-kelas">Pilih Kelas</Label>
                    <select
                      id="kasus-kelas"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedKasusClass}
                      onChange={(e) => {
                        setSelectedKasusClass(e.target.value);
                        setKasusForm((prev) => ({ ...prev, nama: "" }));
                      }}
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {uniqueClasses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="kasus-murid">Pilih Murid</Label>
                    <select
                      id="kasus-murid"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                      value={kasusForm.nama}
                      disabled={!selectedKasusClass}
                      onChange={(e) => setKasusForm((prev) => ({ ...prev, nama: e.target.value }))}
                    >
                      <option value="">-- Pilih Murid --</option>
                      {allStudents
                        .filter((s) => s.kelas === selectedKasusClass)
                        .map((s) => (
                          <option key={s.id} value={s.nama}>
                            {s.nama} {s.nisn ? `(NISN: ${s.nisn})` : ""}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="grid gap-2"><Label htmlFor="ktanggal">Tanggal</Label><Input id="ktanggal" type="date" value={kasusForm.tanggal} onChange={(e) => setKasusForm((prev) => ({ ...prev, tanggal: e.target.value }))} /></div>
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
                    <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kasusRows.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Belum ada data kasus.</TableCell></TableRow>
                  ) : (
                    kasusRows.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tanggal}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.uraian}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.penyelesaian}</TableCell>
                        <TableCell className="py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{row.tindakLanjut}</span></TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => {
                                setKasusForm({
                                  nama: row.nama || "",
                                  tanggal: row.tanggal || "",
                                  uraian: row.uraian || "",
                                  penyelesaian: row.penyelesaian || "",
                                  tindakLanjut: row.tindakLanjut || "",
                                });
                                setEditingKasusId(row.id);
                                const student = allStudents.find((s) => s.nama === row.nama);
                                setSelectedKasusClass(student ? student.kelas : "");
                                setOpenKasus(true);
                              }}
                              className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteKasus(row.id)}
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
              <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setBimbinganForm(EMPTY_BIMBINGAN); setEditingBimbinganId(null); setSelectedBimbinganClass(""); }}><Plus className="h-4 w-4 mr-2" />Input Bimbingan</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingBimbinganId ? "Edit Program Bimbingan" : "Input Program Bimbingan"}</DialogTitle>
                  <DialogDescription>Tambahkan program bimbingan baru.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-2"><Label htmlFor="bwaktu">Waktu</Label><Input id="bwaktu" type="date" value={bimbinganForm.waktu} onChange={(e) => setBimbinganForm((prev) => ({ ...prev, waktu: e.target.value }))} /></div>
                  <div className="grid gap-2">
                    <Label htmlFor="bimbingan-kelas">Pilih Kelas</Label>
                    <select
                      id="bimbingan-kelas"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedBimbinganClass}
                      onChange={(e) => {
                        setSelectedBimbinganClass(e.target.value);
                        setBimbinganForm((prev) => ({ ...prev, nama: "" }));
                      }}
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {uniqueClasses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bimbingan-murid">Pilih Murid (Sasaran)</Label>
                    <select
                      id="bimbingan-murid"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                      value={bimbinganForm.nama}
                      disabled={!selectedBimbinganClass}
                      onChange={(e) => setBimbinganForm((prev) => ({ ...prev, nama: e.target.value }))}
                    >
                      <option value="">-- Pilih Murid --</option>
                      {allStudents
                        .filter((s) => s.kelas === selectedBimbinganClass)
                        .map((s) => (
                          <option key={s.id} value={s.nama}>
                            {s.nama} {s.nisn ? `(NISN: ${s.nisn})` : ""}
                          </option>
                        ))}
                    </select>
                  </div>
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
                    <TableHead className="font-medium text-slate-500 text-right w-20">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bimbinganRows.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="h-24 text-center text-slate-500">Belum ada data bimbingan.</TableCell></TableRow>
                  ) : (
                    bimbinganRows.map((row) => (
                      <TableRow key={row.id} className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 transition-colors">
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.waktu}</TableCell>
                        <TableCell className="py-4 font-medium text-slate-900 dark:text-slate-100">{row.nama}</TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.masalah}</TableCell>
                        <TableCell className="py-4 text-center"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{row.bentuk}</span></TableCell>
                        <TableCell className="py-4 text-center"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">{row.jenis}</span></TableCell>
                        <TableCell className="py-4 text-slate-600 dark:text-slate-300">{row.tindakLanjut}</TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => {
                                setBimbinganForm({
                                  waktu: row.waktu || "",
                                  nama: row.nama || "",
                                  masalah: row.masalah || "",
                                  bentuk: row.bentuk || "",
                                  jenis: row.jenis || "",
                                  tindakLanjut: row.tindakLanjut || "",
                                });
                                setEditingBimbinganId(row.id);
                                const student = allStudents.find((s) => s.nama === row.nama);
                                setSelectedBimbinganClass(student ? student.kelas : "");
                                setOpenBimbingan(true);
                              }}
                              className="p-1 text-slate-500 hover:text-slate-950 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteBimbingan(row.id)}
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
